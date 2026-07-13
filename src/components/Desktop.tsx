import { useMemo, useRef, useState } from "react";
import { useOS, type AppId } from "../store";
import { PixelGlyph, snakeWallpaperURI, GLYPHS } from "./Pixel";

interface IconDef {
  key: string;
  label: string;
  glyph: keyof typeof GLYPHS;
  app: AppId;
  title: string;
  defaultPos: { x: number; y: number };
}

const ICONS: IconDef[] = [
  { key: "projects", label: "PROJECTS.DIR", glyph: "folder", app: "projects", title: "PROJECTS.DIR", defaultPos: { x: -110, y: 24 } },
  { key: "about", label: "ABOUT.TXT", glyph: "doc", app: "about", title: "ABOUT.TXT", defaultPos: { x: -110, y: 148 } },
  { key: "resume", label: "RESUME.PDF", glyph: "pdf", app: "resume", title: "RESUME.PDF", defaultPos: { x: -110, y: 272 } },
  { key: "snake", label: "SNAKE.SYS", glyph: "snake", app: "snake", title: "SNAKE.SYS", defaultPos: { x: -110, y: 396 } },
];

function DesktopIcon({ def }: { def: IconDef }) {
  const { open, iconPos, setIconPos } = useOS();
  const [selected, setSelected] = useState(false);
  const [dragging, setDragging] = useState(false);
  const moved = useRef(false);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const elRef = useRef<HTMLButtonElement>(null);

  // negative default x means "offset from the right edge"
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const fallback = {
    x: def.defaultPos.x < 0 ? vw + def.defaultPos.x : def.defaultPos.x,
    y: def.defaultPos.y,
  };
  const pos = iconPos[def.key] ?? fallback;
  const x = pos.x;
  const y = pos.y;

  const onPointerDown = (e: React.PointerEvent) => {
    setSelected(true);
    moved.current = false;
    drag.current = { dx: e.clientX - x, dy: e.clientY - y };
    elRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const nx = e.clientX - drag.current.dx;
    const ny = e.clientY - drag.current.dy;
    if (!moved.current && Math.hypot(nx - x, ny - y) < 5) return;
    moved.current = true;
    setDragging(true);
    setIconPos(
      def.key,
      Math.min(Math.max(nx, 4), window.innerWidth - 96),
      Math.min(Math.max(ny, 4), window.innerHeight - 160)
    );
  };
  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <button
      ref={elRef}
      className={`dicon ${selected ? "selected" : ""} ${dragging ? "dragging" : ""}`}
      style={{ left: x, top: y, background: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onBlur={() => setSelected(false)}
      onDoubleClick={() => open(def.app, { title: def.title })}
      aria-label={`${def.label},双击打开`}
    >
      <PixelGlyph name={def.glyph} size={52} />
      <span className="label">{def.label}</span>
    </button>
  );
}

export function Desktop({ children }: { children?: React.ReactNode }) {
  const wallpaper = useOS((s) => s.wallpaper);
  const wpVar = useMemo(() => ({ "--wp-snake": snakeWallpaperURI() }) as React.CSSProperties, []);
  return (
    <main className={`desktop wp-${wallpaper}`} style={wpVar}>
      {ICONS.map((d) => (
        <DesktopIcon key={d.key} def={d} />
      ))}
      {children}
    </main>
  );
}
