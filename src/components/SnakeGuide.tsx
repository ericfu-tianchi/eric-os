import { useEffect, useRef, useState } from "react";
import { useOS, type SnakeHat } from "../store";
import { PixIcon } from "./Pixel";
import { GREEN, Hat } from "./DesktopSnake";
import { useGridSpec } from "./desktopGrid";

/**
 * SnakeGuide — the wallpaper snake as Eric's sidekick. Every so often it
 * nudges (play / dress me up / ask), and clicking its head opens a chat that
 * answers questions about Eric (POST /api/ask → Workers AI, see worker/).
 *
 * Three nudge styles are on trial; pick one with ?guide=a|b|c
 * (default from VITE_GUIDE at build time):
 *   a · Talk  — speech bubble with a line and one button
 *   b · Think — thought bubble with an icon, caption on hover
 *   c · Hello — a small greeting card with all three choices
 * Dev QA: ?guidefast=1 compresses the schedule to seconds.
 */

type Variant = "a" | "b" | "c";
type Topic = "play" | "dress" | "ask";
type Panel = null | "chat" | "dress";
type Action = "play" | "dress" | "resume" | "about" | "school" | "ai" | "email";
type Msg = { role: "user" | "assistant"; content: string; action?: Action };

const params = new URLSearchParams(window.location.search);
const VARIANT: Variant = ((v) => (v === "b" || v === "c" ? v : "a"))(params.get("guide") ?? import.meta.env.VITE_GUIDE);
const FAST = params.has("guidefast");

// Head cell of Eric's "hello" pose: (23, 11) on the 18-row reference, bottom-anchored (see ericBody).
const HEAD_COL = 23;
const headRow = (rows: number) => 11 + rows - 16;

const SCHEDULE = FAST
  ? { first: [2, 3], gap: [6, 8], show: 6, max: 5 }
  : VARIANT === "c"
    ? { first: [15, 20], gap: [60, 120], show: 10, max: 3 }
    : { first: [15, 20], gap: [45, 90], show: 9, max: 5 };
const ORDER: Topic[] = ["play", "dress", "ask"];

const LINES: Record<Topic, string[]> = {
  play: ["Psst — up for a round of Snake?", "I'm bored. Race me?", "Bet you can't beat the high score."],
  dress: ["Feeling a little plain. Dress me up?", "New look, who dis? Pick me a hat.", "I'd look great in glasses. Just saying."],
  ask: ["Curious about Eric? Ask me anything.", "I know all of Eric's secrets. Well, the work ones.", "Got a question about Eric? I'm all ears. Well, no ears."],
};
const CTA: Record<Topic, string> = { play: "Play Snake", dress: "Dress me up", ask: "Ask me" };
const ACTION_LABEL: Record<Action, string> = {
  play: "Play Snake",
  dress: "Dress me up",
  resume: "Open resume",
  about: "Open About Me",
  school: "See school projects",
  ai: "See AI projects",
  email: "Email Eric",
};
const STARTERS = ["What does Eric do?", "What is he building lately?", "Show me his AI projects"];
const HATS: { id: SnakeHat; label: string }[] = [
  { id: "none", label: "None" },
  { id: "glasses", label: "Glasses" },
  { id: "cap", label: "Grad cap" },
  { id: "phones", label: "Headphones" },
  { id: "bow", label: "Bow" },
  { id: "bubble", label: "Daydream" },
];

const rand = ([a, b]: number[]) => (a + Math.random() * (b - a)) * 1000;
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

/** The snake's head on its own, wearing a hat — used in the picker and the thought bubble. */
function MiniHead({ hat, size = 40 }: { hat: SnakeHat; size?: number }) {
  const c = 44, er = c * 0.125, pr = er * 0.42, fa = c / 2 - er * 1.5, pb = c * 0.21;
  // The daydream bubble floats up-right, so that head gets a larger box (and a smaller bubble) to stay the same size.
  const dream = hat === "bubble";
  const k = dream ? 76 / 60 : 1;
  return (
    <svg width={size * k} height={size * k} viewBox={dream ? "-28 -50 76 76" : "-30 -30 60 60"} style={dream ? { margin: `${-size * (k - 1)}px 0 0` } : undefined} aria-hidden>
      <rect x={-21} y={-21} width={42} height={42} rx={4.4} fill={GREEN} />
      {[-1, 1].map((s) => (
        <g key={s}>
          <circle cx={fa} cy={pb * s} r={er} fill="#fafafa" />
          <circle cx={fa + pr * 0.8} cy={pb * s} r={pr} fill="#363636" />
        </g>
      ))}
      {dream ? <Hat hat={hat} cw={24} ch={24} er={er} /> : <Hat hat={hat} cw={c} ch={c} er={er} />}
    </svg>
  );
}

export function SnakeGuide() {
  const spec = useGridSpec();
  const open = useOS((s) => s.open);
  const setSnakeMode = useOS((s) => s.setSnakeMode);
  const hat = useOS((s) => s.snakeHat);
  const setSnakeHat = useOS((s) => s.setSnakeHat);
  const windows = useOS((s) => s.windows);

  const [nudge, setNudge] = useState<Topic | null>(null);
  const [line, setLine] = useState("");
  const [panel, setPanel] = useState<Panel>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const shown = useRef(0);
  const dismissed = useRef(0);
  const hovering = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  const { cellW, cellH, rows } = spec;
  const hx = HEAD_COL * cellW;
  const hy = headRow(rows) * cellH;
  const vw = window.innerWidth;

  // Is any window sitting on the head? Then the snake keeps quiet.
  const covered = Object.values(windows).some((w) =>
    w.maximized || (hx + cellW / 2 > w.x && hx + cellW / 2 < w.x + w.w && hy + cellH / 2 > w.y && hy + cellH / 2 < w.y + w.h));

  // Live values for the scheduler, which runs outside React's render cycle.
  const live = useRef({ covered, panel, hat });
  live.current = { covered, panel, hat };

  useEffect(() => {
    let t = 0, hide = 0;
    const next = (ms: number) => { t = window.setTimeout(fire, ms); };
    function fire() {
      if (shown.current >= SCHEDULE.max || dismissed.current >= 2) return;
      const L = live.current;
      if (document.hidden || L.covered || L.panel) return next(5000); // try again shortly
      let topic = ORDER[shown.current % ORDER.length];
      if (topic === "dress" && L.hat !== "none") topic = "ask"; // already dressed — don't nag
      shown.current += 1;
      setLine(pick(LINES[topic]));
      setNudge(topic);
      const autoHide = () => {
        if (hovering.current) { hide = window.setTimeout(autoHide, 1500); return; }
        setNudge(null);
      };
      hide = window.setTimeout(autoHide, SCHEDULE.show * 1000);
      next(SCHEDULE.show * 1000 + rand(SCHEDULE.gap));
    }
    next(rand(SCHEDULE.first));
    return () => { window.clearTimeout(t); window.clearTimeout(hide); };
  }, []);

  useEffect(() => { if (covered) setNudge(null); }, [covered]);
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight }); }, [msgs, busy]);

  function act(a: Action | Topic) {
    setNudge(null);
    if (a === "play") { setPanel(null); return setSnakeMode(true); }
    if (a === "dress") return setPanel("dress");
    if (a === "ask") return setPanel("chat");
    if (a === "resume") open("resume", { title: "resume.pdf" });
    if (a === "about") open("about", { title: "About_Me.md" });
    if (a === "school") open("filesystem", { title: "School Projects", payload: "school" });
    if (a === "ai") open("filesystem", { title: "AI Stuff", payload: "ai" });
    if (a === "email") window.location.href = "mailto:ericfu-tianchi@outlook.com";
    setPanel(null);
  }

  function dismiss() {
    dismissed.current += 1;
    setNudge(null);
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setDraft("");
    setBusy(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = (await res.json()) as { reply?: string; action?: Action };
      setMsgs([...next, { role: "assistant", content: data.reply ?? "Hmm, I lost my train of thought. Try again?", action: data.action }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "I can't reach my brain right now. Try again in a bit?" }]);
    } finally {
      setBusy(false);
    }
  }

  // Cards open above the head, nudged left if the screen is narrow; the tail always points at the head.
  const cardW = panel === "chat" ? 320 : 292;
  const cardLeft = Math.max(16, Math.min(hx - 18, vw - cardW - 16));
  const tailX = hx + cellW / 2 - cardLeft;
  const anchor = { left: cardLeft, top: hy - 10 };

  return (
    <div className="sguide" aria-live="polite">
      <button
        type="button"
        className="sguide-head"
        style={{ left: hx, top: hy, width: cellW, height: cellH }}
        aria-label="Chat with the snake"
        title="Ask me about Eric"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => { setNudge(null); setPanel((p) => (p === "chat" ? null : "chat")); }}
      />

      {nudge && !panel && VARIANT === "a" && (
        <div
          className="sguide-say"
          style={{ left: hx + cellW * 0.5, top: hy - 6 }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseEnter={() => { hovering.current = true; }}
          onMouseLeave={() => { hovering.current = false; }}
        >
          <button type="button" className="sguide-x" aria-label="Dismiss" onClick={dismiss}>×</button>
          <p>{line}</p>
          <button type="button" className="sguide-cta" onClick={() => act(nudge)}>{CTA[nudge]}</button>
        </div>
      )}

      {nudge && !panel && VARIANT === "b" && (
        <button
          type="button"
          className="sguide-think"
          style={{ left: hx + cellW * 0.42, top: hy - cellH * 0.2 }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseEnter={() => { hovering.current = true; }}
          onMouseLeave={() => { hovering.current = false; }}
          onClick={() => act(nudge)}
          aria-label={CTA[nudge]}
        >
          <i className="d1" /><i className="d2" />
          <span className="cloud">
            {nudge === "play" && <PixIcon name="snake" size={34} />}
            {nudge === "dress" && <span className="cycle">{HATS.slice(1).map((h) => <MiniHead key={h.id} hat={h.id} size={34} />)}</span>}
            {nudge === "ask" && <b className="q">?</b>}
          </span>
          <span className="cap">{CTA[nudge]}</span>
        </button>
      )}

      {nudge && !panel && VARIANT === "c" && (
        <div
          className="sguide-card sguide-hello"
          style={{ left: Math.max(16, Math.min(hx - 18, vw - 268)), top: hy - 10, "--tail": `${hx + cellW / 2 - Math.max(16, Math.min(hx - 18, vw - 268))}px` } as React.CSSProperties}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseEnter={() => { hovering.current = true; }}
          onMouseLeave={() => { hovering.current = false; }}
        >
          <button type="button" className="sguide-x" aria-label="Dismiss" onClick={dismiss}>×</button>
          <p className="hi">Hi, I'm Eric's snake.</p>
          <p className="sub">What should we do?</p>
          <div className="chips">
            {ORDER.map((t) => <button type="button" key={t} onClick={() => act(t)}>{CTA[t] === "Ask me" ? "Ask about Eric" : CTA[t]}</button>)}
          </div>
        </div>
      )}

      {panel === "dress" && (
        <div className="sguide-card" style={{ ...anchor, width: cardW, "--tail": `${tailX}px` } as React.CSSProperties} onPointerDown={(e) => e.stopPropagation()}>
          <header>
            <b>Dress me up</b>
            <button type="button" className="sguide-x" aria-label="Close" onClick={() => setPanel(null)}>×</button>
          </header>
          <div className="sguide-hats">
            {HATS.map((h) => (
              <button type="button" key={h.id} className={hat === h.id ? "on" : ""} onClick={() => setSnakeHat(h.id)}>
                <MiniHead hat={h.id} />
                <span>{h.label}</span>
              </button>
            ))}
          </div>
          <footer>
            <span>Saved on this device.</span>
            <button type="button" onClick={() => { setPanel(null); open("prefs", { title: "Settings" }); }}>More in Settings</button>
          </footer>
        </div>
      )}

      {panel === "chat" && (
        <div
          className="sguide-card sguide-chat"
          style={{ ...anchor, width: cardW, maxHeight: Math.min(420, hy - 24), "--tail": `${tailX}px` } as React.CSSProperties}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <header>
            <b>Ask the snake</b>
            <span className="tag">about Eric</span>
            <button type="button" className="sguide-x" aria-label="Close" onClick={() => setPanel(null)}>×</button>
          </header>
          <div className="sguide-log" ref={listRef}>
            <div className="msg bot">Hi! I live on Eric's desktop and know his work inside out. Ask me anything.</div>
            {msgs.map((m, i) => (
              <div key={i} className={`msg ${m.role === "user" ? "me" : "bot"}`}>
                {m.content}
                {m.action && (
                  <button type="button" className="sguide-cta" onClick={() => act(m.action!)}>{ACTION_LABEL[m.action]} →</button>
                )}
              </div>
            ))}
            {busy && <div className="msg bot typing"><i /><i /><i /></div>}
            {msgs.length === 0 && (
              <div className="chips">
                {STARTERS.map((s) => <button type="button" key={s} onClick={() => send(s)}>{s}</button>)}
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); void send(draft); }}>
            <input
              autoFocus
              value={draft}
              maxLength={300}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask anything about Eric…"
              aria-label="Your question"
            />
            <button type="submit" disabled={!draft.trim() || busy} aria-label="Send">↑</button>
          </form>
          <p className="fine">AI answers can be wrong. Built on Cloudflare Workers AI.</p>
        </div>
      )}
    </div>
  );
}
