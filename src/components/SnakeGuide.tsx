import { useEffect, useRef, useState } from "react";
import { useOS, type SnakeHat } from "../store";
import { PixIcon } from "./Pixel";
import { GREEN, Hat } from "./DesktopSnake";
import { useGridSpec } from "./desktopGrid";

/**
 * SnakeGuide — the wallpaper snake as Eric's sidekick. Its head is a menu:
 * hover (or tap) it and three thought bubbles pop up — Play / Dress me up /
 * Ask about Eric. Left alone, it now and then thinks ONE of them, in that
 * bubble's own spot, so the idle hint and the menu are the same thing.
 * Ask opens a chat (POST /api/ask → Workers AI, see worker/).
 *
 * Two layouts on trial; pick with ?guide=arc|cloud (default from VITE_GUIDE):
 *   arc   — three separate clouds fanned over the head, each with its own trail
 *   cloud — one thought cloud of three lobes on a shared trail
 * Dev QA: ?guidefast=1 compresses the idle schedule to seconds.
 */

type Layout = "arc" | "cloud";
type Topic = "play" | "dress" | "ask";
type Panel = null | "chat" | "dress";
type Action = "play" | "dress" | "resume" | "about" | "school" | "ai" | "email";
type Msg = { role: "user" | "assistant"; content: string; action?: Action };

const params = new URLSearchParams(window.location.search);
const LAYOUT: Layout = (params.get("guide") ?? import.meta.env.VITE_GUIDE) === "cloud" ? "cloud" : "arc";
const FAST = params.has("guidefast");

// Head cell of Eric's "hello" pose: (23, 11) on the 18-row reference, bottom-anchored (see ericBody).
const HEAD_COL = 23;
const headRow = (rows: number) => 11 + rows - 16;

const SCHEDULE = FAST
  ? { first: [2, 3], gap: [5, 6], show: 5, max: 6 }
  : { first: [5, 10], gap: [25, 35], show: 9, max: 5 };

// Once a visitor has found the menu (hovered it for a beat, or clicked the head or a bubble),
// the snake stops nudging for the rest of the visit, and on later visits nudges only once.
const KNOWN_KEY = "eric-os-snake-guide-known";
const readKnown = () => { try { return !FAST && localStorage.getItem(KNOWN_KEY) === "1"; } catch { return false; } };
const TOPICS: Topic[] = ["play", "dress", "ask"];
const CAPTION: Record<Topic, string> = { play: "Play Snake", dress: "Dress me up", ask: "Ask about Eric" };

/** Bubble centres, in cell units from the head's centre (+y = down). Trail dots run from the head to each. */
const SLOTS: Record<Layout, Record<Topic, { x: number; y: number }>> = {
  arc: { play: { x: -1.6, y: -1.9 }, dress: { x: 0.05, y: -2.6 }, ask: { x: 1.7, y: -1.9 } },
  cloud: { play: { x: -0.35, y: -2.2 }, dress: { x: 0.85, y: -2.55 }, ask: { x: 2.05, y: -2.2 } },
};

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

/** The snake's head on its own, wearing a hat — used in the picker and the dress bubble. */
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
  const [menu, setMenu] = useState(false); // all three bubbles (hover / tap on the head)
  const [panel, setPanel] = useState<Panel>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const shown = useRef(0);
  const last = useRef<Topic | null>(null);
  const hovering = useRef(false);
  const closeTimer = useRef(0);
  const knowTimer = useRef(0);
  const knownAtLoad = useRef(readKnown());
  const knownNow = useRef(false);
  const markKnown = () => {
    if (FAST || knownNow.current) return;
    knownNow.current = true;
    try { localStorage.setItem(KNOWN_KEY, "1"); } catch { /* private mode: just this visit */ }
  };
  const listRef = useRef<HTMLDivElement>(null);

  const { cellW, cellH, rows } = spec;
  const hx = HEAD_COL * cellW;
  const hy = headRow(rows) * cellH;
  const vw = window.innerWidth;

  // Is any window sitting on the head? Then the snake keeps quiet.
  const covered = Object.values(windows).some((w) =>
    w.maximized || (hx + cellW / 2 > w.x && hx + cellW / 2 < w.x + w.w && hy + cellH / 2 > w.y && hy + cellH / 2 < w.y + w.h));

  // Live values for the scheduler, which runs outside React's render cycle.
  const live = useRef({ covered, panel, hat, menu });
  live.current = { covered, panel, hat, menu };

  // Idle: now and then think ONE of the three, at random (never the same twice in a row; no dress nag once dressed).
  useEffect(() => {
    let t = 0, hide = 0;
    const next = (ms: number) => { t = window.setTimeout(fire, ms); };
    function fire() {
      if (knownNow.current || shown.current >= (knownAtLoad.current ? 1 : SCHEDULE.max)) return;
      const L = live.current;
      if (document.hidden || L.covered || L.panel || L.menu) return next(5000); // try again shortly
      const pool = TOPICS.filter((x) => x !== last.current && !(x === "dress" && L.hat !== "none"));
      const topic = pool[Math.floor(Math.random() * pool.length)];
      shown.current += 1;
      last.current = topic;
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

  useEffect(() => { if (covered) { setNudge(null); setMenu(false); } }, [covered]);
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight }); }, [msgs, busy]);

  // Hover in → menu; hover out → close after a beat, so the gap between head and bubbles is forgiving.
  const enter = () => {
    hovering.current = true;
    window.clearTimeout(closeTimer.current);
    if (panel) return;
    setMenu(true);
    knowTimer.current = window.setTimeout(markKnown, 800); // a passing cursor doesn't count
  };
  const leave = () => {
    hovering.current = false;
    window.clearTimeout(knowTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(false), 320);
  };

  function act(a: Action | Topic) {
    markKnown();
    setNudge(null);
    setMenu(false);
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

  // Which bubbles are up: the whole menu, or the one idle thought.
  const visible = panel ? [] : menu ? TOPICS : nudge ? [nudge] : [];
  const c = cellH;
  // Trail dots from the top of the head toward a bubble; they grow as they rise.
  const trail = (to: { x: number; y: number }, ks: number[]) => ks.map((k, j) => ({
    x: to.x * c * k,
    y: -c * 0.55 + (to.y * c + c * 0.55) * k,
    r: ks.length > 1 && j === 0 ? 3.5 : 5,
  }));

  return (
    <div className="sguide" aria-live="polite">
      <div
        className={`sguide-zone ${LAYOUT} ${menu ? "menu" : ""}`}
        style={{ left: hx + cellW / 2, top: hy + cellH / 2 }}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseEnter={enter}
        onMouseLeave={leave}
      >
        <button
          type="button"
          className="sguide-head"
          style={{ left: -cellW / 2, top: -cellH / 2, width: cellW, height: cellH }}
          aria-label="Snake menu"
          aria-expanded={menu}
          onClick={() => { markKnown(); setNudge(null); setPanel(null); setMenu((m) => !m); }}
        />

        {LAYOUT === "cloud" && visible.length > 0 && trail(SLOTS.cloud[menu ? "dress" : visible[0]], [0.3, 0.56]).map((d, i) => (
          <i key={i} className="sguide-dot" style={{ left: d.x, top: d.y, width: d.r * 2, height: d.r * 2, animationDelay: `${i * 50}ms` }} />
        ))}

        {visible.map((t, i) => {
          const s = SLOTS[LAYOUT][t];
          const at = { x: s.x * c, y: s.y * c };
          // arc: each bubble trails its own dots back toward the head — one each in the menu, so the fan stays clean
          const dots = LAYOUT === "arc" ? trail(s, menu ? [0.5] : [0.3, 0.56]) : [];
          const delay = menu ? i * 55 : 0;
          return (
            <span key={t} className="sguide-thought" style={{ "--d": `${delay}ms` } as React.CSSProperties}>
              {dots.map((d, j) => (
                <i key={j} className="sguide-dot" style={{ left: d.x, top: d.y, width: d.r * 2, height: d.r * 2, animationDelay: `${delay + j * 40}ms` }} />
              ))}
              <button
                type="button"
                className={`sguide-bubble ${t}`}
                style={{ left: at.x, top: at.y, animationDelay: `${delay + 80}ms` }}
                onClick={() => act(t)}
                aria-label={CAPTION[t]}
              >
                {t === "play" && <PixIcon name="snake" size={32} />}
                {t === "dress" && <span className="cycle">{HATS.slice(1).map((h) => <MiniHead key={h.id} hat={h.id} size={32} />)}</span>}
                {t === "ask" && <b className="q">?</b>}
                <span className="cap">{CAPTION[t]}</span>
              </button>
            </span>
          );
        })}
      </div>

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
