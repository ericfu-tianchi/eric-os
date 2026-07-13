import { useRef, useState, type ReactNode } from "react";
import { useOS, type WinInstance } from "../store";

/**
 * WindowFrame — the single chrome for every window in ERIC OS.
 * Controls live TOP-LEFT: red square = close, green square = maximize.
 * Plain color blocks at rest; glyphs appear on hover.
 * Drag by titlebar; double-click titlebar toggles maximize.
 */
export function WindowFrame({
  win,
  focused,
  badge,
  children,
}: {
  win: WinInstance;
  focused: boolean;
  badge?: string;
  children: ReactNode;
}) {
  const { close, focus, move, resize, toggleMax, order } = useOS();
  const [closing, setClosing] = useState(false);
  const drag = useRef<{ dx: number; dy: number; pid: number } | null>(null);
  const grip = useRef<{ pid: number } | null>(null);

  const z = 20 + order.indexOf(win.id);

  const onPointerDown = (e: React.PointerEvent) => {
    if (win.maximized) return;
    if ((e.target as HTMLElement).closest(".ctrl")) return;
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y, pid: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || drag.current.pid !== e.pointerId) return;
    const x = Math.min(Math.max(e.clientX - drag.current.dx, -win.w + 90), window.innerWidth - 40);
    const y = Math.min(Math.max(e.clientY - drag.current.dy, 0), window.innerHeight - 120);
    move(win.id, x, y);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (drag.current?.pid === e.pointerId) drag.current = null;
  };

  const requestClose = () => {
    setClosing(true);
    window.setTimeout(() => close(win.id), 110);
  };

  const style = win.maximized
    ? { left: 0, top: 0, width: "100%", height: "100%", zIndex: z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: z };

  const title = win.title ?? win.id;

  return (
    <section
      className={`window ${focused ? "focused" : ""} ${win.maximized ? "maximized" : ""} ${closing ? "closing" : ""}`}
      style={style}
      onPointerDown={() => focus(win.id)}
      aria-label={title}
    >
      <header
        className="titlebar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={() => toggleMax(win.id)}
      >
        <div className="controls">
          <button className="ctrl close" aria-label="关闭窗口" onClick={requestClose}>
            <svg viewBox="0 0 8 8" aria-hidden>
              <path d="M1 1l6 6M7 1L1 7" stroke="#1b1a15" strokeWidth="1.8" strokeLinecap="square" />
            </svg>
          </button>
          <button className="ctrl max" aria-label="最大化窗口" onClick={() => toggleMax(win.id)}>
            <svg viewBox="0 0 8 8" aria-hidden>
              <path d="M1.4 1.4h5.2v5.2H1.4z" fill="none" stroke="#1b1a15" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
        <span className="title">{title}</span>
        <span className="spacer" />
        {badge && <span className="badge">{badge}</span>}
      </header>
      <div className="win-body">{children}</div>
      {!win.maximized && (
        <div
          className="resize-grip"
          aria-label="拖拽调整窗口大小"
          onPointerDown={(e) => {
            e.stopPropagation();
            grip.current = { pid: e.pointerId };
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            focus(win.id);
          }}
          onPointerMove={(e) => {
            if (grip.current?.pid !== e.pointerId) return;
            const w = Math.max(320, Math.min(e.clientX - win.x + 8, window.innerWidth - win.x - 8));
            const h = Math.max(200, Math.min(e.clientY - win.y + 8, window.innerHeight - win.y - 8));
            resize(win.id, w, h);
          }}
          onPointerUp={(e) => {
            if (grip.current?.pid === e.pointerId) grip.current = null;
          }}
        >
          <svg viewBox="0 0 10 10" aria-hidden>
            <rect x="7" y="1" width="2" height="2" />
            <rect x="4" y="4" width="2" height="2" />
            <rect x="7" y="4" width="2" height="2" />
            <rect x="1" y="7" width="2" height="2" />
            <rect x="4" y="7" width="2" height="2" />
            <rect x="7" y="7" width="2" height="2" />
          </svg>
        </div>
      )}
    </section>
  );
}
