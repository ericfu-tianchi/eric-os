import { useEffect, useRef, useState } from "react";
import { useOS, type SnakeHat } from "../store";
import { gridSpec, iconCellData, PixIcon, rasterIconUrl, type PixIconName } from "./Pixel";
import { ICONS, TOPBAR, iconCellOf, iconGlyph, iconVisiblePos, useGridSpec, type GridSpec } from "./desktopGrid";
import appleRaster from "../assets/icons/b/apple.png";
import { readSnakeRecord, writeSnakeRecord, type SnakeRecord } from "../data/snakeRecord";

/**
 * DesktopSnake — Eric's hand-drawn wallpaper snake, and the game it wakes into.
 * `frozen` renders the exact same snake as a static wallpaper (eyes follow the
 * mouse); starting SNAKE.SYS re-renders it live from the same cells — seamless.
 * Spec: 44px adaptive grid · flush blocks, no border · brand green #06C268 ·
 * 中大 eyes (white + pupil) · vector tongue · top-down hats (set in Prefs) ·
 * swallowed icons keep their original look and ride at a fixed distance
 * behind the head (newest closest). ESC exits. Dev QA: ?snakedemo=1.
 */
const GREEN = "#06C268";
const TONGUE = "#F04E38";

// Eric's hand-drawn "hello" — FINAL (pose-drafts/hello-eric-v4.json, 84 cells, verbatim).
// The full hello: h with its two-wide ascender, a real looped e (entered at
// (6,11), wound around its counter, exited at (7,11)), two tall l's, o.
// One stroke, tail (0,11) → head (23,11) facing right; the body folds against
// itself at the h and e — legal for a snake, only the editor's tracer chokes
// on it. Reference grid 35×18, rows anchored to the bottom at runtime.
const ERIC_POSE: [number, number][] = [
  [0, 11],  [1, 11],  [2, 11],  [2, 10],  [2, 9],  [2, 8],  [2, 7],  [2, 6],  [2, 5],  [2, 4],
  [3, 4],  [3, 5],  [3, 6],  [3, 7],  [4, 7],  [4, 8],  [4, 9],  [4, 10],  [4, 11],  [5, 11],
  [6, 11],  [6, 10],  [6, 9],  [6, 8],  [6, 7],  [7, 7],  [8, 7],  [8, 8],  [8, 9],  [7, 9],
  [7, 10],  [7, 11],  [8, 11],  [9, 11],  [10, 11],  [10, 10],  [10, 9],  [10, 8],  [10, 7],  [10, 6],
  [10, 5],  [10, 4],  [11, 4],  [12, 4],  [12, 5],  [12, 6],  [12, 7],  [12, 8],  [12, 9],  [12, 10],
  [12, 11],  [13, 11],  [14, 11],  [14, 10],  [14, 9],  [14, 8],  [14, 7],  [14, 6],  [14, 5],  [14, 4],
  [15, 4],  [16, 4],  [16, 5],  [16, 6],  [16, 7],  [16, 8],  [16, 9],  [16, 10],  [16, 11],  [17, 11],
  [18, 11],  [18, 10],  [18, 9],  [18, 8],  [18, 7],  [19, 7],  [20, 7],  [20, 8],  [20, 9],  [20, 10],
  [20, 11],  [21, 11],  [22, 11],  [23, 11],
];
function ericBody(rows: number): [number, number][] {
  const shift = rows - 18 + 2; // bottom-anchored, +2 = Eric: sit the hello a touch below center
  return ERIC_POSE.map(([x, y]) => [x, y + shift]);
}

type Seg = { x: number; y: number };
type Lump = { dist: number; glyph: PixIconName }; // dist = segments behind the head
type BoardIcon = { key: string; glyph: PixIconName; label: string; cx: number; cy: number; px: number; py: number };
type ScorePop = { id: number; points: 1 | 5; x: number; y: number; bonus: boolean };
/** opening beat: windows fly out → apple drops/flashes → "!" → tutorial → play */
type Phase = "enter" | "apple" | "alert" | "tutorial" | "play";

// The apple animation itself lasts 1.62s (drop + two flashes). Leave a small
// breathing gap so every beat reads separately instead of landing at once.
const APPLE_BEAT_MS = 1700;
const ALERT_LEAD_MS = 1000;
const TUTORIAL_MS = 2600;

/** swallowed icon riding the body — draw the REAL raster art (matches the desktop), fall back to vector */
function IconOnCell({ name, x, y, size }: { name: PixIconName; x: number; y: number; size: number }) {
  const raster = rasterIconUrl(name);
  if (raster) {
    return <image href={raster} x={x} y={y} width={size} height={size} preserveAspectRatio="xMidYMid meet" />;
  }
  const d = iconCellData(name);
  const m = Math.max(d.w, d.h);
  const u = size / m;
  const ox = x + (size - d.w * u) / 2;
  const oy = y + (size - d.h * u) / 2;
  return (
    <g shapeRendering="crispEdges" transform={`translate(${ox},${oy}) scale(${u})`}>
      {d.cells.map(([cx, cy, c], i) => (
        <rect key={i} x={cx} y={cy} width={1} height={1} fill={c} />
      ))}
    </g>
  );
}

/** top-down hats, drawn in head-local coords (origin = head center, +x = facing) */
function Hat({ hat, cw, ch, er }: { hat: SnakeHat; cw: number; ch: number; er: number }) {
  if (hat === "none") return null;
  if (hat === "glasses") {
    const a = cw / 2 - er * 1.5, b = ch * 0.21, r = er * 1.42, sw = Math.max(1.6, er * 0.22), dk = "#1b1c1f";
    return (
      <g stroke={dk} strokeWidth={sw} fill="none">
        <circle cx={a} cy={-b} r={r} />
        <circle cx={a} cy={b} r={r} />
        <line x1={a} y1={-b + r} x2={a} y2={b - r} />
        <line x1={a - r * 0.5} y1={-b - r * 0.85} x2={a - cw * 0.62} y2={-b - r * 0.55} />
        <line x1={a - r * 0.5} y1={b + r * 0.85} x2={a - cw * 0.62} y2={b + r * 0.55} />
      </g>
    );
  }
  if (hat === "cap") {
    const bx = -cw * 0.12, s = ch * 0.62;
    return (
      <g>
        <polygon points={`${bx},${-s} ${bx + s},0 ${bx},${s} ${bx - s},0`} fill="#17181b" stroke="rgba(255,255,255,.16)" strokeWidth={1.2} />
        <circle cx={bx} cy={0} r={ch * 0.05} fill="#E0A93F" />
        <path d={`M ${bx} 0 Q ${bx - s * 0.5} ${s * 0.55} ${bx - s * 0.92} ${s * 0.7}`} fill="none" stroke="#E0A93F" strokeWidth={2} />
        <circle cx={bx - s * 0.92} cy={s * 0.74} r={ch * 0.06} fill="#E0A93F" />
      </g>
    );
  }
  if (hat === "phones") {
    const dk = "#454a54", bx = -cw * 0.08;
    return (
      <g>
        <path d={`M ${bx} ${-ch * 0.52} Q ${bx + cw * 0.16} 0 ${bx} ${ch * 0.52}`} fill="none" stroke={dk} strokeWidth={ch * 0.12} strokeLinecap="round" />
        <rect x={bx - cw * 0.14} y={-ch * 0.68} width={cw * 0.3} height={ch * 0.2} rx={4} fill={dk} stroke="#8f96a3" strokeWidth={1.2} />
        <rect x={bx - cw * 0.14} y={ch * 0.48} width={cw * 0.3} height={ch * 0.2} rx={4} fill={dk} stroke="#8f96a3" strokeWidth={1.2} />
      </g>
    );
  }
  if (hat === "bow") {
    const bx = -cw * 0.26, lw = cw * 0.3, lh = ch * 0.24, pk = "#FF3B77";
    return (
      <g fill={pk}>
        <polygon points={`${bx},0 ${bx - lw},${-lh} ${bx - lw * 0.35},${-lh * 1.35}`} />
        <polygon points={`${bx},0 ${bx - lw},${lh} ${bx - lw * 0.35},${lh * 1.35}`} />
        <polygon points={`${bx},0 ${bx + lw * 0.7},${-lh * 0.9} ${bx + lw * 0.28},${-lh * 1.25}`} />
        <polygon points={`${bx},0 ${bx + lw * 0.7},${lh * 0.9} ${bx + lw * 0.28},${lh * 1.25}`} />
        <circle cx={bx} cy={0} r={ch * 0.09} fill="#D22B60" />
      </g>
    );
  }
  if (hat === "bubble") {
    return (
      <g>
        <circle cx={cw * 0.62} cy={-ch * 0.78} r={ch * 0.055} fill="#fff" />
        <circle cx={cw * 0.82} cy={-ch * 1.1} r={ch * 0.09} fill="#fff" />
        <ellipse cx={cw * 1.35} cy={-ch * 1.62} rx={cw * 0.56} ry={ch * 0.42} fill="#fff" />
        <path
          d="M0,-8 L2.2,-2.5 L8,-2.5 L3.4,1 L5,7 L0,3.4 L-5,7 L-3.4,1 L-8,-2.5 L-2.2,-2.5 Z"
          fill="#F5B027"
          transform={`translate(${cw * 1.35},${-ch * 1.62}) scale(${ch / 34})`}
        />
      </g>
    );
  }
  return null;
}

export function DesktopSnake({ frozen = false, windowsOpen = false }: { frozen?: boolean; windowsOpen?: boolean }) {
  const setSnakeMode = useOS((s) => s.setSnakeMode);
  const iconPos = useOS((s) => s.iconPos);
  const best = useOS((s) => s.snakeBest);
  const setSnakeBest = useOS((s) => s.setSnakeBest);
  const storeHat = useOS((s) => s.snakeHat);
  const spec = useGridSpec();
  const [, force] = useState(0);
  const rr = () => force((n) => n + 1);

  // dev QA override: ?hat=cap
  const hat = ((): SnakeHat => {
    const q = new URLSearchParams(window.location.search).get("hat") as SnakeHat | null;
    return q && ["none", "glasses", "cap", "phones", "bow", "bubble"].includes(q) ? q : storeHat;
  })();

  const snake = useRef<Seg[]>([]);
  const lumps = useRef<Lump[]>([]);
  const dir = useRef({ x: 1, y: 0 });
  const nextDir = useRef({ x: 1, y: 0 });
  const apple = useRef<{ x: number; y: number } | null>(null);
  const icons = useRef<BoardIcon[]>([]);
  const score = useRef(0);
  const over = useRef(false);
  const recordClaiming = useRef(false);
  const demo = useRef(false);
  const phase = useRef<Phase>("play");
  const sp = useRef<GridSpec>(spec);
  const pupils = useRef<(SVGCircleElement | null)[]>([]);
  const eyeCenters = useRef<{ cx: number; cy: number; max: number }[]>([]);
  const playStartAt = useRef(0);   // when play began → drives the first-second speed ease-in
  const firstRun = useRef(false);  // tutorial shows only on the very first snake game
  const alertLifeMs = useRef(ALERT_LEAD_MS); // "!" remains through the optional tutorial
  const audio = useRef<AudioContext | null>(null);
  const scorePopTimer = useRef<number | null>(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const [scorePulse, setScorePulse] = useState(0);
  const [scorePop, setScorePop] = useState<ScorePop | null>(null);
  const [record, setRecord] = useState<SnakeRecord>(() => readSnakeRecord());
  const [recordClaim, setRecordClaim] = useState(false);
  const [recordName, setRecordName] = useState("");

  function playSound(kind: "apple" | "bonus") {
    if (mutedRef.current) return;
    try {
      const ctx = audio.current ?? new AudioContext();
      audio.current = ctx;
      if (ctx.state === "suspended") void ctx.resume();
      const now = ctx.currentTime;
      const tone = (from: number, to: number, at: number, duration: number, volume: number, wave: OscillatorType) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(from, at);
        osc.frequency.exponentialRampToValueAtTime(to, at + duration);
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(volume, at + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
        osc.connect(gain).connect(ctx.destination);
        osc.start(at);
        osc.stop(at + duration + 0.02);
      };
      if (kind === "apple") {
        // A tiny two-note square-wave chirp: familiar Snake energy without mimicking any source audio.
        tone(430, 600, now, 0.08, 0.055, "square");
        tone(610, 770, now + 0.075, 0.1, 0.045, "square");
      } else {
        // Arcade Spark — the selected icon bonus: a clean, compact three-note lift.
        tone(440, 520, now, 0.075, 0.06, "square");
        tone(630, 720, now + 0.075, 0.085, 0.055, "square");
        tone(890, 980, now + 0.15, 0.12, 0.045, "triangle");
      }
    } catch {
      // Audio is an enhancement; the game remains fully playable where Web Audio is unavailable.
    }
  }

  function unlockAudio() {
    if (mutedRef.current) return;
    try {
      const ctx = audio.current ?? new AudioContext();
      audio.current = ctx;
      if (ctx.state === "suspended") void ctx.resume();
    } catch {
      // Audio is optional in restricted browser environments.
    }
  }

  function award(points: 1 | 5, x: number, y: number, bonus: boolean) {
    score.current += points;
    setScorePulse((n) => n + 1);
    const id = performance.now();
    setScorePop({ id, points, x, y, bonus });
    if (scorePopTimer.current !== null) window.clearTimeout(scorePopTimer.current);
    scorePopTimer.current = window.setTimeout(() => setScorePop(null), 860);
    playSound(bonus ? "bonus" : "apple");
  }

  function reset() {
    sp.current = gridSpec(window.innerWidth, window.innerHeight - TOPBAR);
    const s = sp.current;
    icons.current = ICONS.map((d) => {
      const [cx, cy] = iconCellOf(d, iconPos[d.key], s); // game collision is per-cell…
      const pos = iconVisiblePos(d, iconPos[d.key], s); // …but paint uses the exact desktop position.
      return { key: d.key, glyph: d.icon, label: d.label, cx, cy, px: pos.x, py: pos.y };
    });
    snake.current = ericBody(s.rows).map(([x, y]) => ({ x, y }));
    lumps.current = [];
    dir.current = { x: 1, y: 0 };
    nextDir.current = { x: 1, y: 0 };
    score.current = 0;
    over.current = false;
    recordClaiming.current = false;
    setRecordClaim(false);
    setRecordName("");
    setScorePop(null);
    playStartAt.current = 0; // re-arm the first-second speed ease-in
    if (!frozen && phase.current !== "enter") spawnApple(); // during the intro the apple makes its own entrance
    rr();
  }

  function spawnApple() {
    const s = sp.current;
    for (let i = 0; i < 400; i++) {
      const x = Math.floor(Math.random() * s.cols);
      const y = Math.floor(Math.random() * s.rows);
      if (snake.current.some((c) => c.x === x && c.y === y)) continue;
      if (icons.current.some((ic) => ic.cx === x && ic.cy === y)) continue;
      apple.current = { x, y };
      return;
    }
  }

  function end() {
    over.current = true;
    if (score.current > best) setSnakeBest(score.current);
    const currentRecord = readSnakeRecord();
    setRecord(currentRecord);
    if (score.current > currentRecord.score) {
      recordClaiming.current = true;
      setRecordClaim(true);
    }
    rr();
  }

  function claimRecord() {
    const alias = recordName.trim().slice(0, 16) || "Anonymous";
    const next = { score: score.current, alias };
    writeSnakeRecord(next);
    setRecord(next);
    recordClaiming.current = false;
    setRecordClaim(false);
  }

  function tick() {
    if (over.current || phase.current !== "play") return;
    const s = sp.current;
    if (demo.current) {
      const h = snake.current[snake.current.length - 1];
      nextDir.current = h.x < s.cols - 2 ? { x: 1, y: 0 } : { x: 0, y: -1 };
    }
    dir.current = nextDir.current;
    const head = snake.current[snake.current.length - 1];
    const nx = head.x + dir.current.x;
    const ny = head.y + dir.current.y;
    if (nx < 0 || ny < 0 || nx >= s.cols || ny >= s.rows) return end();
    const hit = icons.current.find((ic) => ic.cx === nx && ic.cy === ny); // one icon = one cell, exact bite
    const appleHit = !!apple.current && apple.current.x === nx && apple.current.y === ny;
    const grew = !!hit || appleHit;
    if (snake.current.some((c, i) => c.x === nx && c.y === ny && (grew || i > 0))) return end();
    if (grew) lumps.current.forEach((l) => (l.dist += 1)); // a segment is born at the head
    if (hit) {
      icons.current = icons.current.filter((i) => i.key !== hit.key);
      award(5, nx, ny, true);
      lumps.current.push({ dist: 1, glyph: hit.glyph }); // newest lump right behind the head
    }
    if (appleHit) {
      award(1, nx, ny, false);
      spawnApple();
    }
    snake.current.push({ x: nx, y: ny });
    if (!grew) snake.current.shift();
    rr();
  }

  useEffect(() => {
    demo.current = !frozen && new URLSearchParams(window.location.search).has("snakedemo");
    firstRun.current = !frozen &&
      (!localStorage.getItem("eric-os-snake-onboarded") || new URLSearchParams(window.location.search).has("tut")); // tutorial only the very first time (?tut=1 forces it for QA)
    alertLifeMs.current = ALERT_LEAD_MS + (firstRun.current ? TUTORIAL_MS : 0);
    const timers: number[] = [];
    const pin = new URLSearchParams(window.location.search).get("snakephase") as Phase | null; // dev QA: ?snakephase=alert
    if (!frozen && pin && ["enter", "apple", "alert", "tutorial", "play"].includes(pin)) {
      phase.current = pin;
    } else if (!frozen && !demo.current) {
      phase.current = "enter";
      const scatterMs = windowsOpen ? 960 : 0;
      // The apple now begins about one second after the click: just after the
      // scatter has cleared, without the former extra one-second empty pause.
      const t0 = windowsOpen ? scatterMs + 90 : 650;
      timers.push(window.setTimeout(() => { phase.current = "apple"; spawnApple(); rr(); }, t0));
      // The apple gets its own full beat: fall, squash, and both flashes all finish before the snake reacts.
      timers.push(window.setTimeout(() => { phase.current = "alert"; rr(); }, t0 + APPLE_BEAT_MS));
      // First-run teaching arrives one second after the yellow exclamation appears; the bubble stays visible.
      if (firstRun.current) {
        timers.push(window.setTimeout(() => { phase.current = "tutorial"; rr(); }, t0 + APPLE_BEAT_MS + ALERT_LEAD_MS));
      }
      timers.push(window.setTimeout(() => {
        phase.current = "play";
        playStartAt.current = performance.now();
        localStorage.setItem("eric-os-snake-onboarded", "1");
        rr();
      }, t0 + APPLE_BEAT_MS + ALERT_LEAD_MS + (firstRun.current ? TUTORIAL_MS : 0)));
    } else {
      phase.current = "play";
    }
    reset();
    const onResize = () => reset();
    window.addEventListener("resize", onResize);
    if (frozen) {
      // wallpaper mode: eyes follow the mouse
      const onMove = (e: MouseEvent) => {
        pupils.current.forEach((p, i) => {
          const E = eyeCenters.current[i];
          if (!p || !E) return;
          const dx = e.clientX - E.cx;
          const dy = e.clientY - TOPBAR - E.cy;
          const d = Math.hypot(dx, dy) || 1;
          const k = Math.min(E.max, d) / d;
          p.setAttribute("cx", String(E.cx + dx * k));
          p.setAttribute("cy", String(E.cy + dy * k));
        });
      };
      window.addEventListener("mousemove", onMove);
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
      };
    }
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "Escape") { setSnakeMode(false); return; }
      // While the player is naming a new record, all normal game keys belong
      // to the input — especially M and R, which are valid letters in names.
      if (recordClaiming.current) return;
      if (k === "m" || k === "M") {
        setMuted((value) => {
          const next = !value;
          mutedRef.current = next;
          return next;
        });
        e.preventDefault();
        return;
      }
      if (over.current) { if (k === " " || k === "Enter" || k === "r" || k === "R") reset(); return; }
      const d = dir.current;
      let nd: { x: number; y: number } | null = null;
      if ((k === "ArrowUp" || k === "w" || k === "W") && d.y === 0) nd = { x: 0, y: -1 };
      else if ((k === "ArrowDown" || k === "s" || k === "S") && d.y === 0) nd = { x: 0, y: 1 };
      else if ((k === "ArrowLeft" || k === "a" || k === "A") && d.x === 0) nd = { x: -1, y: 0 };
      else if ((k === "ArrowRight" || k === "d" || k === "D") && d.x === 0) nd = { x: 1, y: 0 };
      if (nd) { unlockAudio(); nextDir.current = nd; e.preventDefault(); }
    };
    window.addEventListener("keydown", onKey);
    // movement loop: ease-in over the first second of play (buffer), then steady game speed
    const NORMAL = 140, SLOW = 250, RAMP = 1000;
    let mv = 0;
    const loop = () => {
      tick();
      let delay = NORMAL;
      if (phase.current === "play") {
        if (playStartAt.current === 0) playStartAt.current = performance.now();
        const el = performance.now() - playStartAt.current;
        if (el < RAMP) delay = SLOW + (NORMAL - SLOW) * (el / RAMP); // slow → normal over ~1s
      }
      mv = window.setTimeout(loop, delay);
    };
    mv = window.setTimeout(loop, NORMAL);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(mv);
      if (scorePopTimer.current !== null) window.clearTimeout(scorePopTimer.current);
      timers.forEach(window.clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frozen]);

  const s = sp.current;
  const { cellW, cellH } = s;
  const body = snake.current;
  const n = body.length;
  if (n === 0) return null;

  // lumps: body index (from head) -> glyph
  const lumpAt = new Map<number, PixIconName>();
  for (const l of lumps.current) lumpAt.set(Math.max(0, n - 1 - l.dist), l.glyph);

  const [hx, hy] = [body[n - 1].x, body[n - 1].y];
  const d = dir.current;
  const cx = hx * cellW + cellW / 2;
  const cy = hy * cellH + cellH / 2;
  const er = cellH * 0.125; // 中大
  const pr = er * 0.42;
  const fa = cellW / 2 - er * 1.5;
  const pb = cellH * 0.21;
  const pxv = { x: -d.y, y: d.x };
  eyeCenters.current = [-1, 1].map((sgn) => ({
    cx: cx + d.x * fa + pxv.x * pb * sgn,
    cy: cy + d.y * fa + pxv.y * pb * sgn,
    max: er - pr - 1,
  }));
  const ang = (Math.atan2(d.y, d.x) * 180) / Math.PI;
  const g = iconGlyph(s);
  const rx = cellH * 0.1;
  const shown = Math.max(best, score.current);

  return (
    <div className={`dsnake ${frozen ? "frozen" : ""}`}>
      {!frozen && (
        <div className="dsnake-hud">
          <span>Snake</span>
          <span key={scorePulse} className="score-readout">SCORE {score.current}</span>
          <span>BEST {shown}</span>
          <span>RECORD {record.score}</span>
          <span className="esc">↑↓←→ 控制蛇 · M 键{muted ? "打开声音" : "静音"} · ESC 退出</span>
        </div>
      )}
      {!frozen &&
        icons.current.map((ic) => (
          // The icon and label live in one HTML wrapper. `px/py` are copied from
          // iconVisiblePos at reset, so free-dragged desktop files never snap when
          // Snake takes over; the separate cx/cy stay available for game collision.
          <div key={ic.key} className="dsnake-icon" style={{ left: ic.px, top: ic.py }}>
            <PixIcon name={ic.glyph} size={g} />
            <span className="label">{ic.label}</span>
          </div>
        ))}
      <svg className="dsnake-svg" width="100%" height="100%">
        {body.map((seg, i) => {
          const lump = lumpAt.get(i);
          if (lump) {
            const size = Math.min(cellW, cellH); // eaten icon fills the cell, like a body segment
            return (
              <IconOnCell
                key={i}
                name={lump}
                x={seg.x * cellW + (cellW - size) / 2}
                y={seg.y * cellH + (cellH - size) / 2}
                size={size}
              />
            );
          }
          return (
            <rect
              key={i}
              x={seg.x * cellW + 1}
              y={seg.y * cellH + 1}
              width={cellW - 2}
              height={cellH - 2}
              rx={rx}
              fill={GREEN}
            />
          );
        })}
        {!frozen && apple.current && (
          <image
            className={phase.current === "apple" || phase.current === "alert" ? "apple-intro" : undefined}
            href={appleRaster}
            x={apple.current.x * cellW}
            y={apple.current.y * cellH - cellH * 0.055}
            width={cellW}
            height={cellH}
            preserveAspectRatio="xMidYMid meet"
          />
        )}
        {/* head decor: tongue, eyes, hat */}
        <g transform={`translate(${cx + d.x * (cellW / 2 + 1)},${cy + d.y * (cellH / 2 + 1)}) rotate(${ang}) scale(${cellH / 44})`}>
          <path d="M0 -1.4 C10 -2.2 15 -5 23 -12.5 C18 -5.5 14 -2.6 8 -0.6 C15 1.2 20 4.5 27 10 C18 4.8 11 2.2 0 1.6 Z" fill={TONGUE} />
        </g>
        {eyeCenters.current.map((E, i) => {
          // during the intro the snake eyes the apple; otherwise they look where it's going
          let pdx = d.x * pr * 0.8, pdy = d.y * pr * 0.8;
          const spotting = !frozen && (phase.current === "apple" || phase.current === "alert") && apple.current;
          if (spotting) {
            const ax = apple.current!.x * cellW + cellW / 2 - E.cx;
            const ay = apple.current!.y * cellH + cellH / 2 - E.cy;
            const dd = Math.hypot(ax, ay) || 1;
            const k = Math.min(E.max, dd) / dd;
            pdx = ax * k;
            pdy = ay * k;
          }
          return (
            <g key={i}>
              <circle cx={E.cx} cy={E.cy} r={er} fill="#fafafa" />
              <circle
                ref={(el) => { pupils.current[i] = el; }}
                cx={E.cx + pdx}
                cy={E.cy + pdy}
                r={pr}
                fill="#363636"
              />
            </g>
          );
        })}
        <g transform={`translate(${cx},${cy}) rotate(${hat === "bubble" ? 0 : ang})`}>
          <Hat hat={hat} cw={cellW} ch={cellH} er={er} />
        </g>
        {/* the snake spots the apple: a thought bubble ("!") pops above its head, then it moves */}
        {!frozen && (phase.current === "alert" || phase.current === "tutorial") && (
          <g className="snake-alert" style={{ "--alert-ms": `${alertLifeMs.current}ms` } as React.CSSProperties}>
            <g className="pop">
              <circle cx={cx + cellW * 0.46} cy={cy - cellH * 0.74} r={cellH * 0.1} fill="#fff" />
              <circle cx={cx + cellW * 0.74} cy={cy - cellH * 1.2} r={cellH * 0.15} fill="#fff" />
              <ellipse cx={cx + cellW * 1.08} cy={cy - cellH * 1.98} rx={cellW * 0.74} ry={cellH * 0.58} fill="#fff" />
              <text
                x={cx + cellW * 1.08}
                y={cy - cellH * 1.92}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-display)"
                fontWeight={800}
                fontSize={cellH * 0.98}
                fill="#F5B027"
              >
                !
              </text>
            </g>
          </g>
        )}
      </svg>
      {!frozen && phase.current === "tutorial" && firstRun.current && (
        <div className="snake-tutorial" style={{ "--tutorial-ms": `${TUTORIAL_MS}ms` } as React.CSSProperties}>
          <div className="tut-keys">
            <span className="tut-key tut-key-vertical"><span>↑</span></span>
            <div className="tut-row">
              <span className="tut-key">←</span>
              <span className="tut-key tut-key-vertical"><span>↓</span></span>
              <span className="tut-key">→</span>
            </div>
          </div>
          <div className="tut-cap">
            <span>用</span><span className="tut-inline-keys" aria-label="上下左右"><span>↑</span><span>↓</span><span>←</span><span>→</span></span><span>控制蛇去吃苹果</span>
          </div>
        </div>
      )}
      {!frozen && scorePop && (
        <div
          key={scorePop.id}
          className={`dsnake-score-pop ${scorePop.bonus ? "bonus" : ""}`}
          style={{ left: (scorePop.x + 0.5) * cellW, top: (scorePop.y + 0.35) * cellH }}
        >
          +{scorePop.points}
        </div>
      )}
      {!frozen && over.current && (
        recordClaim ? (
          <form
            className="snake-tutorial dsnake-over dsnake-record-claim"
            onSubmit={(e) => { e.preventDefault(); claimRecord(); }}
          >
            <div className="dsover-kicker">NEW RECORD</div>
            <div className="dsover-record-score">{score.current}</div>
            <div className="dsover-record-copy">留下署名？不填将显示 Anonymous</div>
            <input
              autoFocus
              maxLength={16}
              value={recordName}
              onChange={(e) => setRecordName(e.target.value)}
              placeholder="Your name (optional)"
              aria-label="全站纪录署名"
            />
            <button type="submit">SAVE RECORD</button>
          </form>
        ) : (
          <div className="snake-tutorial dsnake-over">
            <div className="dsover-title">GAME OVER</div>
            <div className="dsover-score">
              <div className="current"><span>SCORE</span><strong>{score.current}</strong></div>
              <div><span>BEST</span><strong>{shown}</strong></div>
            </div>
            <div className="dsover-record">
              <span>ALL-TIME RECORD</span>
              <strong>{record.score}</strong>
              <span>held by <b>{record.alias}</b></span>
            </div>
            <div className="dsover-actions">
              <span><b>R</b> REPLAY</span>
              <span><b>M</b> {muted ? "打开声音" : "静音"}</span>
              <button type="button" className="dsover-action" onClick={() => setSnakeMode(false)}><b className="wide">ESC</b> EXIT</button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
