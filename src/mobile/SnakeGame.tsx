import { useEffect, useRef, useState } from "react";
import { useAppState } from "./nav";
import { pendingStart, setPendingStart, type Cell } from "./wallpapers";
import appleIcon from "../assets/icons/b/apple.png";

/**
 * Snake for the phone: the whole screen is the board, on the same grid as the wallpaper.
 * Swipe to steer (anywhere), tap to start. Walls and your own tail end the run.
 * No file-eating here: that's the desktop's party trick.
 */
type P = { x: number; y: number };
const GREEN = "#06C268";
const BEST_KEY = "eric-os-mobile-snake-best";
const readBest = () => { try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; } };

export function SnakeGame() {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(readBest);
  const g = useRef({ cols: 13, rows: 20, cell: 30, ox: 0, oy: 0, snake: [] as P[], dir: { x: 1, y: 0 }, next: { x: 1, y: 0 }, food: { x: 0, y: 0 }, step: 150, acc: 0, last: 0, grow: 0, dirty: true, lineCol: 0, lineRow: 0, base: 3 });
  // started from the wallpaper: carry on from the snake's exact pose (taken once, at launch)
  const wallPose = useRef(pendingStart); if (pendingStart) setPendingStart(null);
  const [fromWall, setFromWall] = useState(!!wallPose.current);
  const { shown } = useAppState();
  const shownRef = useRef(shown); shownRef.current = shown;
  const loop = useRef<{ start: () => void; stop: () => void } | null>(null);
  const apple = useRef<HTMLImageElement | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // board = the Home Screen's own grid: same cell, and its lines sit exactly on the wallpaper's lines
  const layout = () => {
    const el = wrap.current, c = cv.current;
    if (!el || !c) return;
    const cs = getComputedStyle(el), dev = el.closest<HTMLElement>(".ios");
    const cell = parseFloat(cs.getPropertyValue("--cell")) || 30;
    const gx = parseFloat(cs.getPropertyValue("--gx")) || 0, gy = parseFloat(cs.getPropertyValue("--gy")) || 0;
    const w = el.clientWidth, h = el.clientHeight;
    const s = g.current;
    let offL = 0, offT = 0; // where this board sits on the device, in device pixels
    if (dev) { const z = parseFloat(getComputedStyle(dev).zoom) || 1, a = el.getBoundingClientRect(), d = dev.getBoundingClientRect(); offL = (a.left - d.left) / z; offT = (a.top - d.top) / z; }
    const hud = 36; // the score line stays clear of the board
    s.cell = cell;
    s.ox = (((gx - offL) % cell) + cell) % cell;
    s.oy = (((gy - offT) % cell) + cell) % cell; while (s.oy < hud) s.oy += cell;
    s.cols = Math.max(8, Math.floor((w - s.ox + 0.5) / cell)); s.rows = Math.max(10, Math.floor((h - s.oy - 12) / cell));
    s.lineCol = Math.round((offL + s.ox - gx) / cell); s.lineRow = Math.round((offT + s.oy - gy) / cell); // board (0,0) as a device grid cell
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    c.width = w * dpr; c.height = h * dpr; c.style.width = `${w}px`; c.style.height = `${h}px`;
    c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
    s.dirty = true;
  };

  const placeFood = () => {
    const s = g.current;
    for (let k = 0; k < 500; k++) {
      const f = { x: Math.floor(Math.random() * s.cols), y: Math.floor(Math.random() * s.rows) };
      if (!s.snake.some((p) => p.x === f.x && p.y === f.y)) { s.food = f; return; }
    }
  };
  const reset = () => {
    const s = g.current;
    const y = Math.floor(s.rows / 2);
    s.snake = [{ x: 4, y }, { x: 3, y }, { x: 2, y }];
    s.dir = { x: 1, y: 0 }; s.next = { x: 1, y: 0 };
    const w = wallPose.current;
    if (w) {
      const body = w.cells.map(([c, r]: Cell) => ({ x: c - s.lineCol, y: r - s.lineRow })).reverse(); // head first
      if (body.every((p) => p.x >= 0 && p.y >= 0 && p.x < s.cols && p.y < s.rows)) {
        s.snake = body; s.dir = s.next = { x: w.dir[0], y: -w.dir[1] }; // canvas rows count up, board rows count down
      }
    }
    s.base = s.snake.length; s.step = 175; s.acc = 0; s.grow = 0; s.last = performance.now(); s.dirty = true;
    placeFood();
  };
  const start = () => { reset(); setScore(0); setPhase("playing"); wallPose.current = null; setFromWall(false); };
  /** from the wallpaper the snake is already on the board: the first swipe just sets it moving */
  const go = (d: P) => { const s = g.current; if (!(d.x === -s.dir.x && d.y === -s.dir.y)) s.next = d; s.last = performance.now(); setPhase("playing"); wallPose.current = null; setFromWall(false); };

  const steer = (d: P) => {
    const s = g.current;
    if (phaseRef.current !== "playing") return;
    if (d.x === -s.dir.x && d.y === -s.dir.y) return;
    s.next = d;
  };

  // draw + tick
  useEffect(() => {
    apple.current = new Image(); apple.current.src = appleIcon;
    layout(); reset();
    const ro = new ResizeObserver(() => { layout(); if (phaseRef.current === "ready") reset(); }); // first shown (and on resize): place the board, then the waiting snake if (wrap.current) ro.observe(wrap.current);
    // the loop runs only while the game is on screen; in the background it stops completely (and resumes where it was)
    let raf = 0;
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const s = g.current, c = cv.current, el = wrap.current;
      if (!c || !el) return;
      const playing = phaseRef.current === "playing";
      if (!playing && !s.dirty) { s.last = t; return; } // nothing moves between runs: don't repaint
      s.dirty = false;
      if (playing) {
        s.acc += Math.min(100, t - s.last);
        while (s.acc >= s.step) {
          s.acc -= s.step;
          s.dir = s.next;
          const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
          const hit = head.x < 0 || head.y < 0 || head.x >= s.cols || head.y >= s.rows || s.snake.some((p) => p.x === head.x && p.y === head.y);
          if (hit) {
            setPhase("over");
            navigator.vibrate?.(30);
            setBest((b) => { const n = Math.max(b, s.snake.length - s.base); try { localStorage.setItem(BEST_KEY, String(n)); } catch { /* private mode */ } return n; });
            break;
          }
          s.snake.unshift(head);
          if (head.x === s.food.x && head.y === s.food.y) {
            setScore(s.snake.length - s.base);
            s.step = Math.max(105, s.step - 3);
            navigator.vibrate?.(8);
            placeFood();
          } else s.snake.pop();
        }
      }
      s.last = t;
      // paint
      const ctx = c.getContext("2d")!;
      const W = c.clientWidth, H = c.clientHeight, C = s.cell;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,.055)"; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= s.cols; x++) { ctx.moveTo(s.ox + x * C + 0.5, s.oy); ctx.lineTo(s.ox + x * C + 0.5, s.oy + s.rows * C); }
      for (let y = 0; y <= s.rows; y++) { ctx.moveTo(s.ox, s.oy + y * C + 0.5); ctx.lineTo(s.ox + s.cols * C, s.oy + y * C + 0.5); }
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.16)"; ctx.strokeRect(s.ox + 0.5, s.oy + 0.5, s.cols * C, s.rows * C);
      if (apple.current?.complete) ctx.drawImage(apple.current, s.ox + s.food.x * C + C * 0.05, s.oy + s.food.y * C + C * 0.05, C * 0.9, C * 0.9);
      ctx.fillStyle = GREEN;
      s.snake.forEach((p) => {
        const r = C * 0.1, x = s.ox + p.x * C + 1.5, y = s.oy + p.y * C + 1.5, w = C - 3;
        ctx.beginPath(); ctx.roundRect(x, y, w, w, r); ctx.fill();
      });
      // eyes look where it's going
      const h = s.snake[0], d = s.dir;
      const cx = s.ox + h.x * C + C / 2, cy = s.oy + h.y * C + C / 2;
      const fx = d.x * C * 0.18, fy = d.y * C * 0.18, sx = -d.y * C * 0.2, sy = d.x * C * 0.2;
      [1, -1].forEach((k) => {
        ctx.fillStyle = "#fafafa"; ctx.beginPath(); ctx.arc(cx + fx + sx * k, cy + fy + sy * k, C * 0.12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(cx + fx * 1.35 + sx * k, cy + fy * 1.35 + sy * k, C * 0.055, 0, Math.PI * 2); ctx.fill();
      });
    };
    loop.current = {
      start: () => { if (!raf) { g.current.last = performance.now(); g.current.dirty = true; raf = requestAnimationFrame(frame); } },
      stop: () => { cancelAnimationFrame(raf); raf = 0; },
    };
    if (shownRef.current) loop.current.start();
    const key = (e: KeyboardEvent) => {
      if (!shownRef.current) return;
      const m: Record<string, P> = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
      if (m[e.key]) { e.preventDefault(); if (phaseRef.current === "playing") steer(m[e.key]); else start(); }
    };
    window.addEventListener("keydown", key);
    return () => { cancelAnimationFrame(raf); raf = 0; ro.disconnect(); window.removeEventListener("keydown", key); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (shown) loop.current?.start(); else loop.current?.stop(); }, [shown]);
  useEffect(() => { g.current.dirty = true; }, [phase]);

  // swipe anywhere: steer as soon as the finger has clearly picked a direction (no need to lift it)
  const sw = useRef<{ x: number; y: number; fired: boolean } | null>(null);
  const down = (e: React.PointerEvent) => { sw.current = { x: e.clientX, y: e.clientY, fired: false }; };
  const move = (e: React.PointerEvent) => {
    const s = sw.current; if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.hypot(dx, dy) < 18) return;
    const d = Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) };
    if (phaseRef.current === "ready" && wallPose.current) go(d); else steer(d);
    sw.current = { x: e.clientX, y: e.clientY, fired: true }; // chain turns in one gesture
  };
  const up = () => {
    const s = sw.current; sw.current = null;
    if (s && !s.fired && phaseRef.current !== "playing") { if (phaseRef.current === "ready" && wallPose.current) go(g.current.dir); else start(); }
  };

  return (
    <div className="ios-snake" ref={wrap} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => (sw.current = null)}>
      <canvas ref={cv} />
      <div className="hud"><span>Score <b>{score}</b></span><span>Best <b>{Math.max(best, score)}</b></span></div>
      {fromWall && phase === "ready" && <p className="wall-hint">Swipe to go</p>}
      {phase !== "playing" && !(fromWall && phase === "ready") && (
        <div className="card">
          {phase === "ready" ? (
            <><h2>Snake</h2><p>Swipe anywhere to steer.<br />Eat apples, miss the walls and your tail.</p><span className="go">Tap to start</span></>
          ) : (
            <><h2>Game over</h2><p><b>{score}</b> {score === 1 ? "apple" : "apples"}{score > 0 && score >= best ? " · new best" : ""}</p><span className="go">Tap to play again</span></>
          )}
        </div>
      )}
    </div>
  );
}
