import { useEffect, useRef, useState } from "react";
import { useOS, type AppId } from "../store";
import { PixIcon, type PixIconName } from "./Pixel";

const DOCK_ITEMS: { app: AppId; glyph: PixIconName; label: string; title: string }[] = [
  { app: "filesystem", glyph: "computer", label: "Tianchintosh HD", title: "Tianchintosh HD" },
  { app: "about", glyph: "doc", label: "About_Me.md", title: "About_Me.md" },
  { app: "snake", glyph: "snake", label: "Snake", title: "Snake" },
  { app: "prefs", glyph: "gear", label: "Settings", title: "Settings" },
];

export function Dock({ leaving = false }: { leaving?: boolean }) {
  const { open, windows, setSnakeMode, dockSize, dockAutoHide } = useOS();
  const running = new Set(Object.values(windows).map((w) => w.app));
  // Auto-hide, like macOS: the dock waits below the screen edge and slides up
  // when the pointer reaches the bottom; it tucks away a beat after the pointer leaves.
  const [peek, setPeek] = useState(false);
  const hideTimer = useRef(0);
  const show = () => { window.clearTimeout(hideTimer.current); setPeek(true); };
  const hide = () => { window.clearTimeout(hideTimer.current); hideTimer.current = window.setTimeout(() => setPeek(false), 400); };
  useEffect(() => () => window.clearTimeout(hideTimer.current), []);
  const hidden = dockAutoHide && !peek;
  return (
    <>
    {dockAutoHide && <div className="dock-hotzone" onPointerEnter={show} aria-hidden />}
    <nav
      className={`dock${leaving ? " dock-leave" : ""}${hidden ? " dock-hidden" : ""}`}
      aria-label="Dock"
      onPointerEnter={dockAutoHide ? show : undefined}
      onPointerLeave={dockAutoHide ? hide : undefined}
      onFocus={dockAutoHide ? show : undefined}
      onBlur={dockAutoHide ? hide : undefined}
    >
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
            <PixIcon name={item.glyph} size={dockSize} />
            <span className="dot" aria-hidden />
          </button>
        </span>
      ))}
    </nav>
    </>
  );
}
