import { useEffect, useRef, useState } from "react";
import { useOS, type SnakeHat } from "../store";
import { PixIcon } from "./Pixel";
import { Hat } from "./DesktopSnake";
import chatIcon from "../assets/icons/b/chat.png";
import { useGridSpec } from "./desktopGrid";
import { SnakeChat, digestAfterGame, type ChatAction } from "./SnakeChat";

/**
 * SnakeGuide — the wallpaper snake as Tianchi's sidekick. Its head is a menu:
 * hover (or tap) it and three thought bubbles pop up — Play / Dress me up /
 * Ask about Tianchi. Left alone, it now and then thinks ONE of them, in that
 * bubble's own spot, so the idle hint and the menu are the same thing.
 * Ask opens the chat (SnakeChat.tsx).
 * The three clouds fan out over the head, each trailing its own dots back to it.
 * Dev QA: ?guidefast=1 compresses the idle schedule to seconds.
 */

type Topic = "play" | "dress" | "ask";
type Panel = null | "chat" | "dress";
type Action = Exclude<ChatAction, "email" | "back">;

const params = new URLSearchParams(window.location.search);
const FAST = params.has("guidefast");

// Head cell of the "hello" pose: (23, 11) on the 18-row reference, bottom-anchored (see ericBody).
const HEAD_COL = 23;
const headRow = (rows: number) => 11 + rows - 16;

// gap = start to start. Every page load starts fresh; nothing is remembered between visits.
const SCHEDULE = FAST
  ? { first: [2, 3], gap: [6, 8], show: 5 }
  : { first: [5, 10], gap: [20, 30], show: 9 };

// Once the visitor has found the menu (hovered it for a beat, or clicked the head or a bubble),
// the snake stops nudging until the next page load.
const TOPICS: Topic[] = ["play", "dress", "ask"];
const CAPTION: Record<Topic, string> = { play: "Play Snake", dress: "Dress me up", ask: "Ask about Tianchi" };

/** Bubble centres, in cell units from the head's centre (+y = down). Trail dots run from the head to each. */
const SLOTS: Record<Topic, { x: number; y: number }> = { play: { x: -1.6, y: -1.9 }, dress: { x: 0.05, y: -2.6 }, ask: { x: 1.7, y: -1.9 } };

const HATS: { id: SnakeHat; label: string }[] = [
  { id: "none", label: "None" },
  { id: "glasses", label: "Glasses" },
  { id: "cap", label: "Grad cap" },
  { id: "phones", label: "Headphones" },
  { id: "bow", label: "Bow" },
  { id: "shades", label: "Shades" },
  { id: "cat", label: "Cat ears" },
  { id: "nycap", label: "NY cap" },
];

const rand = ([a, b]: number[]) => (a + Math.random() * (b - a)) * 1000;

/** The snake's head on its own, wearing a hat — used in the picker and the dress bubble.
    One viewBox for every hat (the NY brim reaches -40), so all heads render the same size. */
export function MiniHead({ hat, size = 40 }: { hat: SnakeHat; size?: number }) {
  const c = 44, er = c * 0.125, pr = er * 0.42, fa = c / 2 - er * 1.5, pb = c * 0.21;
  return (
    <svg width={size} height={size} viewBox="-40 -37 76 74" overflow="visible" aria-hidden>
      <rect x={-21} y={-21} width={42} height={42} rx={4.4} style={{ fill: "var(--snake)" }} />
      {[-1, 1].map((s) => (
        <g key={s}>
          <circle cx={fa} cy={pb * s} r={er} fill="#fafafa" />
          <circle cx={fa + pr * 0.8} cy={pb * s} r={pr} fill="#363636" />
        </g>
      ))}
      <Hat hat={hat} />
    </svg>
  );
}

/** The wardrobe grid — the same picker in the snake's "Dress me up" card and in Settings. */
export function HatPicker() {
  const hat = useOS((s) => s.snakeHat);
  const setSnakeHat = useOS((s) => s.setSnakeHat);
  return (
    <div className="sguide-hats" role="radiogroup" aria-label="Snake accessory">
      {HATS.map((h) => (
        <button type="button" role="radio" aria-checked={hat === h.id} key={h.id} className={hat === h.id ? "on" : ""} onClick={() => setSnakeHat(h.id)}>
          <MiniHead hat={h.id} size={56} />
          <span>{h.label}</span>
        </button>
      ))}
    </div>
  );
}

export function SnakeGuide() {
  const spec = useGridSpec();
  const open = useOS((s) => s.open);
  const setSnakeMode = useOS((s) => s.setSnakeMode);
  const hat = useOS((s) => s.snakeHat);
  const windows = useOS((s) => s.windows);

  const [nudge, setNudge] = useState<Topic | null>(null);
  const [menu, setMenu] = useState(false); // all three bubbles (hover / tap on the head)
  const [panel, setPanel] = useState<Panel>(null);
  // back from a Snake game played while the snake was full: open the chat on the burp
  useEffect(() => { if (digestAfterGame()) setPanel("chat"); }, []);
  const last = useRef<Topic | null>(null);
  const hovering = useRef(false);
  const closeTimer = useRef(0);
  const knowTimer = useRef(0);
  const knownNow = useRef(false);
  const markKnown = () => {
    if (!FAST) knownNow.current = true;
  };

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
      if (knownNow.current) return;
      const L = live.current;
      if (document.hidden || L.covered || L.panel || L.menu) return next(5000); // try again shortly
      const pool = TOPICS.filter((x) => x !== last.current && !(x === "dress" && L.hat !== "none"));
      const topic = pool[Math.floor(Math.random() * pool.length)];
      last.current = topic;
      setNudge(topic);
      const autoHide = () => {
        if (hovering.current) { hide = window.setTimeout(autoHide, 1500); return; }
        setNudge(null);
      };
      hide = window.setTimeout(autoHide, SCHEDULE.show * 1000);
      next(rand(SCHEDULE.gap));
    }
    next(rand(SCHEDULE.first));
    return () => { window.clearTimeout(t); window.clearTimeout(hide); };
  }, []);

  useEffect(() => { if (covered) { setNudge(null); setMenu(false); } }, [covered]);

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
    closeTimer.current = window.setTimeout(() => setMenu(false), 600);
  };

  function act(a: Action | Topic) {
    markKnown();
    setNudge(null);
    setMenu(false);
    if (a === "play") { setPanel(null); return setSnakeMode(true); }
    if (a === "dress") return setPanel("dress");
    if (a === "ask") return setPanel("chat");
    if (a === "resume") open("resume", { title: "resume.pdf" });
    if (a === "about") open("about", { title: "About Me" });
    if (a === "school") open("filesystem", { title: "School Projects", payload: "school" });
    if (a === "ai") open("filesystem", { title: "AI Side Projects", payload: "ai" });
    setPanel(null);
  }

  // Cards open above the head, nudged left if the screen is narrow; the tail always points at the head.
  const cardW = panel === "chat" ? 320 : 336;
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
        className={`sguide-zone ${menu ? "menu" : ""}`}
        style={{ left: hx + cellW / 2, top: hy + cellH / 2 }}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseEnter={enter}
        onMouseLeave={leave}
      >
        {/* under the head and bubbles */}
        {menu && <i className="sguide-bridge" style={{ left: -2.6 * c, top: -3.35 * c, width: 5.2 * c, height: 3.35 * c }} aria-hidden />}
        <button
          type="button"
          className="sguide-head"
          style={{ left: -cellW / 2, top: -cellH / 2, width: cellW, height: cellH }}
          aria-label="Snake menu"
          aria-expanded={menu}
          onClick={() => { markKnown(); setNudge(null); setPanel(null); setMenu((m) => !m); }}
        />

        {visible.map((t, i) => {
          const s = SLOTS[t];
          const at = { x: s.x * c, y: s.y * c };
          // each bubble trails its own dots back toward the head — one each in the menu, so the fan stays clean
          const dots = trail(s, menu ? [0.5] : [0.3, 0.56]);
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
                {t === "dress" && <span className="cycle">{HATS.slice(1).map((h) => <MiniHead key={h.id} hat={h.id} size={50} />)}</span>}
                {t === "ask" && <img src={chatIcon} width={32} height={32} alt="" draggable={false} />}
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
          <HatPicker />
          <footer>
            <span>Saved on this device.</span>
            <button type="button" onClick={() => { setPanel(null); open("prefs", { title: "Settings" }); }}>More in Settings</button>
          </footer>
        </div>
      )}

      {panel === "chat" && (
        <SnakeChat
          style={{ ...anchor, width: cardW, maxHeight: Math.min(440, hy - 24), "--tail": `${tailX}px` } as React.CSSProperties}
          onAct={act}
          onClose={() => setPanel(null)}
        />
      )}
    </div>
  );
}
