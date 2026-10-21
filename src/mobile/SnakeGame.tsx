import { useEffect, useRef, useState } from "react";
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
  const g = useRef({ cols: 13, rows: 20, cell: 30, ox: 0, oy: 0, snake: [] as P[], dir: { x: 1, y: 0 }, next: { x: 1, y: 0 }, food: { x: 0, y: 0 }, step: 150, acc: 0, last: 0, grow: 0 });
  const apple = useRef<HTMLImageElement | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // board = the screen's own grid: whole cells only, centred, same cell size as the wallpaper
  const layout = () => {
    const el = wrap.current, c = cv.current;
    if (!el || !c) return;
    const cell = parseFloat(getComputedStyle(el).getPropertyValue("--cell")) || 30;
    const w = el.clientWidth, h = el.clientHeight;
    const s = g.current;
    s.cell = cell; s.cols = Math.max(8, Math.floor(w / cell)); s.rows = Math.max(10, Math.floor(h / cell));
    s.ox = Math.round((w - s.cols * cell) / 2); s.oy = Math.round((h - s.rows * cell) / 2);
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    c.width = w * dpr; c.height = h * dpr; c.style.width = `${w}px`; c.style.height = `${h}px`;
    c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
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
    s.dir = { x: 1, y: 0 }; s.next = { x: 1, y: 0 }; s.step = 150; s.acc = 0; s.grow = 0; s.last = performance.now();
    placeFood();
  };
  const start = () => { reset(); setScore(0); setPhase("playing"); };

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
    const ro = new ResizeObserver(layout); if (wrap.current) ro.observe(wrap.current);
    let raf = 0;
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const s = g.current, c = cv.current, el = wrap.current;
      if (!c || !el) return;
      const visible = el.offsetParent !== null && document.visibilityState === "visible";
      if (phaseRef.current === "playing" && visible) {
        s.acc += Math.min(100, t - s.last);
        while (s.acc >= s.step) {
          s.acc -= s.step;
          s.dir = s.next;
          const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
          const hit = head.x < 0 || head.y < 0 || head.x >= s.cols || head.y >= s.rows || s.snake.some((p) => p.x === head.x && p.y === head.y);
          if (hit) {
            setPhase("over");
            navigator.vibrate?.(30);
            setBest((b) => { const n = Math.max(b, s.snake.length - 3); try { localStorage.setItem(BEST_KEY, String(n)); } catch { /* private mode */ } return n; });
            break;
          }
          s.snake.unshift(head);
          if (head.x === s.food.x && head.y === s.food.y) {
            setScore(s.snake.length - 3);
            s.step = Math.max(78, s.step - 3);
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
      if (apple.current?.complete) ctx.drawImage(apple.current, s.ox + s.food.x * C + C * 0.12, s.oy + s.food.y * C + C * 0.12, C * 0.76, C * 0.76);
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
    raf = requestAnimationFrame(frame);
    const key = (e: KeyboardEvent) => {
      const m: Record<string, P> = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
      if (m[e.key]) { e.preventDefault(); if (phaseRef.current === "playing") steer(m[e.key]); else start(); }
    };
    window.addEventListener("keydown", key);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener("keydown", key); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // swipe anywhere: steer as soon as the finger has clearly picked a direction (no need to lift it)
  const sw = useRef<{ x: number; y: number; fired: boolean } | null>(null);
  const down = (e: React.PointerEvent) => { sw.current = { x: e.clientX, y: e.clientY, fired: false }; };
  const move = (e: React.PointerEvent) => {
    const s = sw.current; if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.hypot(dx, dy) < 18) return;
    steer(Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) });
    sw.current = { x: e.clientX, y: e.clientY, fired: true }; // chain turns in one gesture
  };
  const up = () => {
    const s = sw.current; sw.current = null;
    if (s && !s.fired && phaseRef.current !== "playing") start();
  };

  return (
    <div className="ios-snake" ref={wrap} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => (sw.current = null)}>
      <canvas ref={cv} />
      <div className="hud"><span>Score <b>{score}</b></span><span>Best <b>{Math.max(best, score)}</b></span></div>
      {phase !== "playing" && (
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
