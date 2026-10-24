import { useEffect, useRef, useState } from "react";
import { useAppState } from "./nav";
import type { Cell } from "./wallpapers";
import { SnakeHead, angleOf } from "./SnakeHead";
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

/** start: the wallpaper snake's pose and apple in device grid cells (col from the left line, row from the top line).
    full: the Home Screen itself is the board: no frame, no own grid (the wallpaper's shows through), walls at the screen's safe edges. */
export function SnakeGame({ start: startPose, apple: startApple, full, top = 0, bottom = 0, intro }: { start?: { cells: Cell[]; dir: Cell }; apple?: Cell; full?: boolean; top?: number; bottom?: number; intro?: number } = {}) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(readBest);
  const g = useRef({ cols: 13, rows: 20, cell: 30, ox: 0, oy: 0, snake: [] as P[], dir: { x: 1, y: 0 }, next: { x: 1, y: 0 }, food: { x: 0, y: 0 }, step: 150, acc: 0, last: 0, grow: 0, dirty: true, lineCol: 0, lineRow: 0, base: 3, target: 175, blinkUntil: 0 });
  // started from the wallpaper: carry on from the snake's exact pose (taken once, at launch)
  const wallPose = useRef(startPose ?? null);
  const wallApple = useRef(startApple ?? null);
  const [fromWall, setFromWall] = useState(!!wallPose.current);
  const { shown } = useAppState();
  const shownRef = useRef(shown); shownRef.current = shown;
  const loop = useRef<{ start: () => void; stop: () => void } | null>(null);
  const apple = useRef<HTMLImageElement | null>(null);
  const headEl = useRef<SVGSVGElement>(null);
  const angRef = useRef(0);
  const [ang, setAng] = useState(0);
  const [cellPx, setCellPx] = useState(30);
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
    const hud = full ? top + 40 : 36; // the score line stays clear of the board
    s.cell = cell; setCellPx(cell);
    s.ox = (((gx - offL) % cell) + cell) % cell;
    s.oy = (((gy - offT) % cell) + cell) % cell; while (s.oy < hud) s.oy += cell;
    s.cols = Math.max(8, Math.floor((w - s.ox + 0.5) / cell)); s.rows = Math.max(10, Math.floor((h - s.oy - (full ? bottom + 30 : 12)) / cell));
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
      const all = w.cells.map(([c, r]: Cell) => ({ x: c - s.lineCol, y: r - s.lineRow })).reverse(); // head first
      // the whole snake, page-2 body included: off the board to the right, it slides in behind the head as it goes
      const body = all;
      const h0 = body[0];
      if (body.length >= 2 && h0.x >= 0 && h0.y >= 0 && h0.x < s.cols && h0.y < s.rows) {
        s.snake = body; s.dir = s.next = { x: w.dir[0], y: -w.dir[1] }; // canvas rows count up, board rows count down
      }
    }
    s.base = s.snake.length; s.step = 175; s.target = 175; s.acc = 0; s.grow = 0; s.last = performance.now(); s.dirty = true;
    const wa = wallApple.current; // the wallpaper's apple stays where it was, as the first one to eat
    const f = w && wa ? { x: wa[0] - s.lineCol, y: wa[1] - s.lineRow } : null;
    if (f && f.x >= 0 && f.y >= 0 && f.x < s.cols && f.y < s.rows) s.food = f; else placeFood();
  };
  const start = () => { reset(); if (full) g.current.step = 330; setScore(0); setPhase("playing"); wallPose.current = null; setFromWall(false); };
  /** from the wallpaper the snake is already on the board: the first swipe just sets it moving */
  const go = (d: P) => { const s = g.current; if (full) s.step = Math.max(s.step, 330); if (!(d.x === -s.dir.x && d.y === -s.dir.y)) s.next = d; s.last = performance.now(); setPhase("playing"); wallPose.current = null; setFromWall(false); };

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
      const blinking = s.blinkUntil > t;
      if (!playing && !s.dirty && !blinking) { s.last = t; return; } // nothing moves between runs: don't repaint
      s.dirty = false;
      if (playing) {
        s.acc += Math.min(100, t - s.last);
        while (s.acc >= s.step) {
          s.acc -= s.step;
          if (s.step > s.target) s.step = Math.max(s.target, s.step * 0.86); // the run starts slow and picks up speed
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
            s.target = Math.max(105, s.target - 3);
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
      ctx.lineWidth = 1;
      if (!full) { // full screen: the wallpaper's own grid is the board, only the walls are drawn
        ctx.strokeStyle = "rgba(255,255,255,.055)";
        ctx.beginPath();
        for (let x = 0; x <= s.cols; x++) { ctx.moveTo(s.ox + x * C + 0.5, s.oy); ctx.lineTo(s.ox + x * C + 0.5, s.oy + s.rows * C); }
        for (let y = 0; y <= s.rows; y++) { ctx.moveTo(s.ox, s.oy + y * C + 0.5); ctx.lineTo(s.ox + s.cols * C, s.oy + y * C + 0.5); }
        ctx.stroke();
      }
      // the walls: outside the board goes a shade darker, and the edge is a crisp 1px line on the same pixel rows as the wallpaper's grid lines
      const dpr = c.width / W, snap = (v: number) => Math.round(v * dpr) / dpr;
      const L0 = snap(s.ox), T0 = snap(s.oy), R0 = snap(s.ox + s.cols * C), B0 = snap(s.oy + s.rows * C);
      if (full) {
        ctx.fillStyle = "rgba(0,0,0,.32)";
        ctx.fillRect(0, 0, W, T0); ctx.fillRect(0, B0 + 1, W, H - B0 - 1); ctx.fillRect(0, T0, L0, B0 - T0 + 1); ctx.fillRect(R0 + 1, T0, W - R0 - 1, B0 - T0 + 1);
      }
      ctx.fillStyle = full ? "rgba(255,255,255,.2)" : "rgba(255,255,255,.16)";
      ctx.fillRect(L0, T0, R0 - L0 + 1, 1); ctx.fillRect(L0, B0, R0 - L0 + 1, 1); ctx.fillRect(L0, T0, 1, B0 - T0 + 1); ctx.fillRect(R0, T0, 1, B0 - T0 + 1);
      if (apple.current?.complete && s.food.x >= 0 && !(blinking && Math.floor(t / 140) % 2)) ctx.drawImage(apple.current, s.ox + s.food.x * C + C * 0.05, s.oy + s.food.y * C + C * 0.05, C * 0.9, C * 0.9);
      ctx.fillStyle = GREEN;
      s.snake.forEach((p) => {
        const r = C * 0.1, x = s.ox + p.x * C + 1.5, y = s.oy + p.y * C + 1.5, w = C - 3;
        ctx.beginPath(); ctx.roundRect(x, y, w, w, r); ctx.fill();
      });
      // the head decor (tongue, eyes, hat) is an SVG laid over the head cell, like the desktop snake
      const h = s.snake[0], d = s.dir, hel = headEl.current;
      if (hel) hel.style.transform = `translate3d(${s.ox + h.x * C - C}px, ${s.oy + h.y * C - C}px, 0)`;
      const a = angleOf(d.x, d.y); if (a !== angRef.current) { angRef.current = a; setAng(a); }
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
  // on Home: the icons clear away, an apple blinks in somewhere, and the snake sets off by itself, slowly at first
  useEffect(() => {
    if (!full || intro == null) return;
    const s = g.current; s.food = { x: -1, y: -1 };
    const a = window.setTimeout(() => { placeFood(); g.current.blinkUntil = performance.now() + 760; }, intro);
    const b = window.setTimeout(() => { if (phaseRef.current !== "ready") return; const s = g.current; s.step = 330; s.last = performance.now(); setPhase("playing"); wallPose.current = null; setFromWall(false); }, intro + 760);
    return () => { window.clearTimeout(a); window.clearTimeout(b); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className={`ios-snake ${full ? "full" : ""}`} ref={wrap} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => (sw.current = null)}>
      <canvas ref={cv} />
      <SnakeHead ref={headEl} size={cellPx} ang={ang} style={{ left: 0, top: 0 }} />
      <div className="hud"><span>Score <b>{score}</b></span><span>Best <b>{Math.max(best, score)}</b></span></div>
      {fromWall && phase === "ready" && !full && <p className="wall-hint">Swipe to go</p>}
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
