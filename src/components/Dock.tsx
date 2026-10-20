import { useOS, type AppId } from "../store";
import { PixIcon, type PixIconName } from "./Pixel";

const DOCK_ITEMS: { app: AppId; glyph: PixIconName; label: string; title: string }[] = [
  { app: "filesystem", glyph: "computer", label: "Tianchintosh HD", title: "Tianchintosh HD" },
  { app: "about", glyph: "doc", label: "About_Me.md", title: "About_Me.md" },
  { app: "snake", glyph: "snake", label: "Snake", title: "Snake" },
  { app: "prefs", glyph: "gear", label: "Settings", title: "Settings" },
];

export function Dock({ leaving = false }: { leaving?: boolean }) {
  const { open, windows, setSnakeMode } = useOS();
  const running = new Set(Object.values(windows).map((w) => w.app));
  return (
    <nav className={`dock${leaving ? " dock-leave" : ""}`} aria-label="Dock">
      {DOCK_ITEMS.map((item, i) => (
        <span key={item.app} style={{ display: "contents" }}>
          {i === 3 && <span className="dock-sep" aria-hidden />}
          <button
            className={`dock-item ${running.has(item.app) ? "running" : ""}`}
            onClick={() => (
              item.app === "snake"
                ? setSnakeMode(true)
                : open(item.app, { title: item.title, payload: item.app === "filesystem" ? "tianchintosh" : undefined })
            )}
            aria-label={`Open ${item.label}`}
          >
            <span className="tip">{item.label}</span>
            <PixIcon name={item.glyph} size={46} />
            <span className="dot" aria-hidden />
          </button>
        </span>
      ))}
    </nav>
  );
}
