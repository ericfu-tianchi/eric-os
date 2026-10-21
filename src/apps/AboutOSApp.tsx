import { useEffect, useState } from "react";
import { useOS } from "../store";
import { ERIC_POSE } from "../components/DesktopSnake";
import { cachedSnakeRecord, fetchSnakeRecord } from "../data/snakeRecord";

/** The hero: a tiny Tianchi OS screen with the "hello" snake on its grid, like About This Mac's laptop. */
function TinyScreen() {
  const C = 6; // one grid cell
  const cols = 30, rows = 14;
  const W = cols * C, H = rows * C;
  const lines = [
    ...Array.from({ length: cols - 1 }, (_, i) => <line key={`v${i}`} x1={(i + 1) * C} y1={0} x2={(i + 1) * C} y2={H} />),
    ...Array.from({ length: rows - 1 }, (_, i) => <line key={`h${i}`} x1={0} y1={(i + 1) * C} x2={W} y2={(i + 1) * C} />),
  ];
  const head = ERIC_POSE[ERIC_POSE.length - 1];
  const at = (x: number, y: number) => ({ x: (x + 3) * C + 0.4, y: (y - 1) * C + 0.4 });
  const h = at(head[0], head[1]);
  return (
    <svg className="aboutos-screen" viewBox={`-8 -8 ${W + 16} ${H + 30}`} aria-hidden>
      <rect x={-8} y={-8} width={W + 16} height={H + 16} rx={7} fill="#0e0f11" />
      <rect x={0} y={0} width={W} height={H} rx={1.5} fill="#1c1d21" />
      <g stroke="rgba(255,255,255,.05)" strokeWidth={0.5}>{lines}</g>
      <rect x={0} y={0} width={W} height={4} fill="rgba(255,255,255,.07)" />
      {ERIC_POSE.map(([x, y], i) => {
        const p = at(x, y);
        return <rect key={i} x={p.x} y={p.y} width={C - 0.8} height={C - 0.8} rx={0.7} fill="#06c268" />;
      })}
      <circle cx={h.x + 3.6} cy={h.y + 1.5} r={0.9} fill="#fafafa" />
      <circle cx={h.x + 3.6} cy={h.y + 3.7} r={0.9} fill="#fafafa" />
      <rect x={W / 2 - 18} y={H - 6} width={36} height={4} rx={1.5} fill="rgba(255,255,255,.12)" />
      <path d={`M${W / 2 - 12} ${H + 8} h24 l3 12 h-30 z`} fill="#d9d9de" />
      <rect x={W / 2 - 26} y={H + 19} width={52} height={3} rx={1.5} fill="#c8c8ce" />
    </svg>
  );
}

export function AboutOSApp() {
  const open = useOS((s) => s.open);
  const [record, setRecord] = useState(cachedSnakeRecord);
  useEffect(() => { fetchSnakeRecord().then(setRecord); }, []);
  const specs: [string, string][] = [
    ["Owner", "Tianchi (Eric) Fu"],
    ["Chip", "Tianchi T1 Pro"],
    ["Memory", "18 GB"],
    ["Snake record", record.score > 0 ? `${record.score} by ${record.alias}` : "Up for grabs"],
    ["Version", "1.0 (2026)"],
  ];
  return (
    <div className="aboutos">
      <TinyScreen />
      <h1>Tianchi OS</h1>
      <p className="aboutos-sub">Personal edition, 2026</p>
      <dl>
        {specs.map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
      <button type="button" className="btn" onClick={() => open("about", { title: "About Me" })}>More Info…</button>
      <footer>
        <span>Made with Claude and ♥ by Tianchi</span>
        <span>© 2026 Tianchi Fu. All snakes reserved.</span>
      </footer>
    </div>
  );
}
