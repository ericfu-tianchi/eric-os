import { useEffect, useRef, useState } from "react";
import { useOS } from "../store";

/**
 * Snake — the soul of Tianchi OS, fully playable.
 * Arrow keys / WASD. Eat apples, don't eat walls or yourself.
 */
const COLS = 22;
const ROWS = 16;
const CELL = 17;

const INK = "#1b1a15";
const PAPER = "#f4f0e6";
const GREEN = "#23bd5f";
const GREEN_D = "#158f46";
const RED = "#ff5347";
const PINK = "#ff3b77";
const GRID = "rgba(27,26,21,0.07)";

type P = { x: number; y: number };

export function SnakeApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const { snakeBest, setSnakeBest } = useOS();

  const state = useRef({
    snake: [] as P[],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 14, y: 8 },
    score: 0,
    dead: false,
    stepMs: 130,
    acc: 0,
    last: 0,
    raf: 0,
  });

  const spawnFood = () => {
    const s = state.current;
    let p: P;
    do {
      p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (s.snake.some((c) => c.x === p.x && c.y === p.y));
    s.food = p;
  };

  const start = () => {
    const s = state.current;
    s.snake = [
      { x: 6, y: 8 },
      { x: 5, y: 8 },
      { x: 4, y: 8 },
    ];
    s.dir = { x: 1, y: 0 };
    s.nextDir = { x: 1, y: 0 };
    s.score = 0;
    s.dead = false;
    s.stepMs = 130;
    s.acc = 0;
    s.last = performance.now();
    setScore(0);
    spawnFood();
    setPhase("playing");
  };

  // input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = state.current;
      const map: Record<string, P> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
      };
      const d = map[e.key];
      if (d) {
        e.preventDefault();
        if (phase === "playing" && (d.x !== -s.dir.x || d.y !== -s.dir.y)) s.nextDir = d;
        else if (phase !== "playing") start();
      }
      if (e.key === " " && phase !== "playing") {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // game loop
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const s = state.current;

    const draw = () => {
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = GRID;
      for (let gx = 0; gx < COLS; gx++)
        for (let gy = 0; gy < ROWS; gy++) ctx.fillRect(gx * CELL + CELL - 2, gy * CELL + CELL - 2, 1.5, 1.5);

      // apple
      const f = s.food;
      ctx.fillStyle = RED;
      ctx.fillRect(f.x * CELL + 3, f.y * CELL + 4, CELL - 6, CELL - 7);
      ctx.fillStyle = GREEN_D;
      ctx.fillRect(f.x * CELL + Math.floor(CELL / 2) - 1, f.y * CELL + 1, 2, 4);
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.fillRect(f.x * CELL + 5, f.y * CELL + 6, 3, 3);

      // snake
      s.snake.forEach((c, i) => {
        ctx.fillStyle = i === 0 ? GREEN : i % 2 === 0 ? GREEN : GREEN_D;
        ctx.fillRect(c.x * CELL + 1, c.y * CELL + 1, CELL - 2, CELL - 2);
        if (i === 0) {
          ctx.fillStyle = INK;
          const ex = c.x * CELL + (s.dir.x === 1 ? CELL - 7 : s.dir.x === -1 ? 4 : CELL / 2 - 4);
          const ey = c.y * CELL + (s.dir.y === 1 ? CELL - 7 : s.dir.y === -1 ? 4 : 4);
          ctx.fillRect(ex, ey, 3, 3);
          ctx.fillStyle = PINK;
          ctx.fillRect(
            c.x * CELL + (s.dir.x === 1 ? CELL - 2 : s.dir.x === -1 ? -2 : CELL / 2 - 1),
            c.y * CELL + (s.dir.y === 1 ? CELL - 2 : s.dir.y === -1 ? -2 : CELL / 2 - 1),
            s.dir.x !== 0 ? 4 : 2,
            s.dir.y !== 0 ? 4 : 2
          );
        }
      });
    };

    const step = () => {
      s.dir = s.nextDir;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
      if (
        head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
        s.snake.some((c) => c.x === head.x && c.y === head.y)
      ) {
        s.dead = true;
        setPhase("over");
        if (s.score > snakeBest) setSnakeBest(s.score);
        return;
      }
      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        s.score += 10;
        setScore(s.score);
        s.stepMs = Math.max(70, s.stepMs - 2.5);
        spawnFood();
      } else {
        s.snake.pop();
      }
    };

    const loop = (t: number) => {
      s.raf = requestAnimationFrame(loop);
      if (phase !== "playing" || s.dead) {
        draw();
        return;
      }
      s.acc += t - s.last;
      s.last = t;
      while (s.acc >= s.stepMs) {
        s.acc -= s.stepMs;
        step();
        if (s.dead) break;
      }
      draw();
    };
    s.last = performance.now();
    s.raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(s.raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, snakeBest]);

  return (
    <div className="win-pad snake-wrap">
      <div className="snake-hud">
        <span>SCORE {String(score).padStart(4, "0")}</span>
        <span className="sp" />
        <span>BEST {String(Math.max(snakeBest, score)).padStart(4, "0")}</span>
      </div>
      <div className="snake-canvas-frame">
        <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} />
        {phase !== "playing" && (
          <div className="snake-overlay">
            <span className="big">{phase === "over" ? "GAME OVER" : "Snake"}</span>
            {phase === "over" && (
              <span style={{ fontFamily: "var(--font-system)", fontSize: 13, fontWeight: 700 }}>
                得分 {score}{score >= snakeBest && score > 0 ? " · 新纪录!" : ""}
              </span>
            )}
            <button className="arcade-btn primary" onClick={start}>
              {phase === "over" ? "再来一局" : "开始游戏"}
            </button>
            <span style={{ fontFamily: "var(--font-system)", fontSize: 10.5, color: "var(--muted)", letterSpacing: "0.08em" }}>
              方向键 / WASD 控制
            </span>
          </div>
        )}
      </div>
      <p style={{ margin: 0, fontFamily: "var(--font-system)", fontSize: 10.5, color: "var(--faint)", letterSpacing: "0.06em" }}>
        // 未来版本:果实=项目图标,吃到哪个开哪个
      </p>
    </div>
  );
}
