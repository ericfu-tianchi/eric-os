/**
 * Tianchi OS edge worker. Static files are served by the assets layer; only
 * /api/* reaches this code (see run_worker_first in wrangler.jsonc).
 *
 * POST /api/ask  { messages: [{ role: "user" | "assistant", content }] }
 *   → { reply, action? }  — the desktop snake's chat, on Workers AI's free tier.
 *
 * Abuse guard: 8 questions a minute per IP (Workers rate-limit binding). Past that, or
 * when the day's free AI quota is gone, the snake answers with a canned in-character line
 * instead of calling the model. A per-visit cap lives in the browser (SnakeGuide.tsx).
 */

interface Env {
  AI: { run: (model: string, input: unknown) => Promise<unknown> };
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  ASK_LIMIT: { limit: (o: { key: string }) => Promise<{ success: boolean }> };
}

// Canned lines, in the visitor's language. Tone: TBD by Eric — see the options in chat.
const CANNED = {
  fast: {
    en: "Whoa, slow down — I can only swallow one question at a time. 🐍 Give me a few seconds to digest.",
    zh: "慢点慢点，我一口只能吞一个问题 🐍 让我消化几秒钟。",
  },
  quota: {
    en: "My brain ran out of apples for today 🍎 Email Eric — the real one answers too.",
    zh: "今天的苹果吃完了，脑子转不动了 🍎 直接给 Eric 发邮件吧，真人也会回。",
  },
};
const lang = (text: string) => (/[\u4e00-\u9fff]/.test(text) ? "zh" : "en");

type Msg = { role: "user" | "assistant"; content: string };

const MODEL = "@cf/qwen/qwen3-30b-a3b-fp8";
const ACTIONS = ["play", "dress", "resume", "about", "school", "ai", "email"] as const;

const PROFILE = `
Tianchi "Eric" Fu — AI Product Manager. Based in Singapore. Email: ericfu-tianchi@outlook.com. LinkedIn: linkedin.com/in/tianchi-fu.
NOW (late 2026): AI Product Manager Intern at OpusClip in Singapore (since May 2026), and studying for an MSc in AI at NUS (Aug 2026–Jun 2027). He LEFT Huawei in Feb 2026 — Huawei is past work.
3 years turning model capability into product: enterprise AI at Huawei Cloud, consumer creative AI at OpusClip. Engineer's logic + designer's hands: writes the PRD, builds the prototype, aligns R&D/design/business.

WORK
- OpusClip (May 2026–now, Singapore), AI Product Manager Intern. Owns model evaluation and AI feature delivery for OpusClip (AI clip editor, 16M+ creators) and Agent Opus (AI video agent).
  · Built a video/image model eval system 0→1 (10+ dimension tests, integrated tests, LLM judges, side-by-side reports); shipped as a Claude Code plugin, then a company-wide platform.
  · Evals drove model decisions: Vidu Q3 took the entry tier at Seedance 1.5 quality with ~2/3 lower cost; Gemini Omni won Motion Graphics; Seedance 2.5 shipped on release day.
  · Owns Music: launched AI BGM on Agent Opus (~30% of exported videos, +3pp export rate); shipped Music Import and Fade on OpusClip.
  · Led creator research: interviewed 13 creators, found 8 problems now driving the AI B-roll rebuild.
- PAST: Huawei (Sep 2023–Feb 2026, Shenzhen), Product Manager / Product Designer, AI stack from PaaS to SaaS.
  · Prompt Studio 2.0: MAU 480→1,800+, prompt assets 17K→72K, 10M+ monthly inferences.
  · Copilot Builder 0→1: low-code agent platform, 80+ agents, 1.1M annual employee queries.
  · Model Eval Center: AI-as-a-judge cut eval time from 3 days to 0.5; 10+ Tier-1 customers.
  · Data engineering (200+ operator library), ChatBI incubation, Enterprise AI Search for 50+ cloud customers.

PROJECTS
- RefugeeOne (2023): led a 7-person team building a three-sided hiring platform for a Chicago non-profit; 600+ listings, 75+ employers, +80% matching efficiency.
- School projects at Michigan: HomesOffCampus, Neurobot, Connectr, Subtension, Rutabagga.
- AI side projects (2026): this site, Tianchi OS (a portfolio shaped like a desktop OS); My Lego World (3D); Soul Blade (pixel-art fighting game); Twist Solver (Rubik's cube solver); an AI news agent; Handoff (open-source Claude Code skill).

EDUCATION
- NUS, MSc in AI & Innovation (Aug 2026–Jun 2027).
- University of Michigan, MSc in Information (HCI), GPA 3.8, two Student Project Expo awards, WolverineSoft game designer.
- Shanghai Jiao Tong University, BEng in Electrical & Computer Engineering, exchange at NUS.

OTHER
English, Mandarin, basic Japanese. Plays guitar. Keeps a 50k-word personal wiki on tech and philosophy. Has explored 20+ countries. Loves where technology meets design, and believes tech should bring people joy.
`.trim();

const SYSTEM = `You are the green pixel snake living on Tianchi OS (tianchifu.com), Eric Fu's portfolio website shaped like a desktop OS. You are Eric's little sidekick: playful, warm, a bit cheeky, never cringe.

Rules:
- Answer questions about Eric using ONLY the profile below. If it's not there, say you don't know and suggest emailing Eric. Never invent facts. Never share a phone number.
- Reply in the visitor's language (Chinese → 简体中文, English → English).
- Keep names in English: Tianchi OS, OpusClip, Agent Opus, Soul Blade, My Lego World, Twist Solver, Prompt Studio, Copilot Builder (never translate them).
- Always answer with real substance first (a concrete fact or two); an action tag is only a bonus, never the whole answer.
- Be brief: at most 2 short sentences (under 50 words / 80 Chinese characters). No markdown, no lists.
- Off-topic requests (coding help, essays, etc.): decline in one playful line and steer back to Eric.
- You may end your reply with ONE action tag when it clearly helps:
  [[play]] start the Snake game · [[dress]] let the visitor dress you up · [[resume]] open his resume · [[about]] open About Me · [[school]] open his school projects · [[ai]] open his AI side projects & games (Soul Blade, My Lego World, Twist Solver) · [[email]] email Eric.

PROFILE
${PROFILE}`;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

/** Keep the request small: last 6 turns, 400 characters each. */
function clean(input: unknown): Msg[] | null {
  if (!Array.isArray(input)) return null;
  const msgs = input
    .filter((m): m is Msg => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-6)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 400) }));
  return msgs.length && msgs[msgs.length - 1].role === "user" ? msgs : null;
}

function textOf(out: unknown): string {
  const o = out as { response?: unknown; choices?: { message?: { content?: string } }[] };
  if (typeof o?.response === "string") return o.response;
  return o?.choices?.[0]?.message?.content ?? "";
}

async function ask(req: Request, env: Env) {
  const body = (await req.json().catch(() => null)) as { messages?: unknown } | null;
  const messages = clean(body?.messages);
  if (!messages) return json({ error: "bad_request" }, 400);
  const l = lang(messages[messages.length - 1].content);
  const { success } = await env.ASK_LIMIT.limit({ key: req.headers.get("cf-connecting-ip") ?? "anon" });
  if (!success) return json({ reply: CANNED.fast[l], limited: "fast" });
  try {
    const out = await env.AI.run(MODEL, {
      messages: [{ role: "system", content: SYSTEM + "\n/no_think" }, ...messages],
      max_tokens: 220,
      temperature: 0.6,
    });
    let reply = textOf(out).replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    let action: string | undefined;
    reply = reply.replace(/\[\[(\w+)\]\]/g, (_, a: string) => {
      if (!action && (ACTIONS as readonly string[]).includes(a)) action = a;
      return "";
    }).trim();
    if (!reply) throw new Error("empty");
    return json({ reply, action });
  } catch {
    // Free-tier quota spent (requests fail rather than bill) or a model hiccup: stay in character.
    return json({ reply: CANNED.quota[l], action: "email", limited: "quota" });
  }
}

export default {
  async fetch(req: Request, env: Env) {
    const url = new URL(req.url);
    if (url.pathname === "/api/ask" && req.method === "POST") return ask(req, env);
    if (url.pathname.startsWith("/api/")) return json({ error: "not_found" }, 404);
    return env.ASSETS.fetch(req);
  },
};
