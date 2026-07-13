import { useOS, type AppId } from "../store";
import { PixelGlyph, GLYPHS } from "./Pixel";

const DOCK_ITEMS: { app: AppId; glyph: keyof typeof GLYPHS; label: string; title: string }[] = [
  { app: "projects", glyph: "folder", label: "PROJECTS", title: "PROJECTS.DIR" },
  { app: "about", glyph: "doc", label: "ABOUT", title: "ABOUT.TXT" },
  { app: "snake", glyph: "snake", label: "SNAKE.SYS", title: "SNAKE.SYS" },
  { app: "readme", glyph: "computer", label: "README", title: "README.MD" },
  { app: "prefs", glyph: "gear", label: "PREFS", title: "SYSTEM PREFS" },
];

export function Dock() {
  const { open, windows } = useOS();
  const running = new Set(Object.values(windows).map((w) => w.app));
  return (
    <nav className="dock" aria-label="Dock">
      {DOCK_ITEMS.map((item, i) => (
        <span key={item.app} style={{ display: "contents" }}>
          {i === 3 && <span className="dock-sep" aria-hidden />}
          <button
            className={`dock-item ${running.has(item.app) ? "running" : ""}`}
            onClick={() => open(item.app, { title: item.title })}
            aria-label={`打开 ${item.label}`}
          >
            <span className="tip">{item.label}</span>
            <PixelGlyph name={item.glyph} size={38} />
            <span className="dot" aria-hidden />
          </button>
        </span>
      ))}
    </nav>
  );
}
