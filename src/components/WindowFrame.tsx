import { useMemo, useRef, useState, type ReactNode } from "react";
import { useOS, type WinInstance } from "../store";
import { TOPBAR } from "./desktopGrid";
import { WindowChromeProvider, type WindowChromeState } from "./WindowChrome";
import { PROJECTS } from "../data/projects";

/**
 * WindowFrame — the single chrome for every window in Tianchi OS.
 * Controls live TOP-LEFT: red square = close, green square = maximize.
 * Plain color blocks at rest; glyphs appear on hover.
 * Drag by titlebar; double-click titlebar toggles maximize.
 */
export function WindowFrame({
  win,
  focused,
  badge,
  flyout,
  children,
}: {
  win: WinInstance;
  focused: boolean;
  badge?: string;
  flyout?: { x: number; y: number }; // set = animate off-screen along this vector (SNAKE.SYS takeover)
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

  const style: React.CSSProperties = win.maximized
    ? { left: 0, top: 0, width: "100%", height: "100%", zIndex: z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: z };
  if (flyout) {
    style.zIndex = 800 + order.indexOf(win.id); // sail above EVERYTHING (menubar 500 / snake 560 / hud 600) on the way out
    (style as Record<string, string | number>)["--fly-x"] = `${flyout.x}px`;
    (style as Record<string, string | number>)["--fly-y"] = `${flyout.y}px`;
  }

  // Existing windows persist across refreshes, so normalize former v0.4 names
  // here too instead of requiring Eric to close every restored window once.
  const canonicalTitle: Partial<Record<WinInstance["app"], string>> = {
    projects: "Projects",
    about: "About Me",
    resume: "resume.pdf",
    snake: "Snake",
    readme: "Tianchintosh HD",
    prefs: "Settings",
    "about-os": "About Tianchi OS",
  };
  const title = win.app === "project-detail"
    ? PROJECTS.find((project) => project.slug === win.payload)?.name ?? win.title ?? win.id
    : canonicalTitle[win.app] ?? win.title ?? win.id;
  const defaultChrome = useMemo<WindowChromeState>(() => ({ trail: [{ label: title }], meta: badge }), [badge, title]);
  const [chrome, setChrome] = useState<WindowChromeState | null>(defaultChrome);
  const trail = chrome?.trail?.length ? chrome.trail : defaultChrome.trail;
  const meta = chrome?.meta ?? defaultChrome.meta;

  return (
    <section
      className={`window ${focused ? "focused" : ""} ${win.maximized ? "maximized" : ""} ${closing ? "closing" : ""} ${flyout ? "flyout" : ""}`}
      style={style}
      onPointerDown={() => focus(win.id)}
      aria-label={title}
    >
      <header
        className={`titlebar ${chrome?.navigation ? "finder-titlebar" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={() => toggleMax(win.id)}
      >
        <div className="controls">
          <button className="ctrl close" aria-label="Close window" onClick={requestClose}>
            <svg viewBox="0 0 8 8" aria-hidden>
              <path d="M1 1l6 6M7 1L1 7" stroke="rgba(0,0,0,0.6)" strokeWidth="1.8" strokeLinecap="square" />
            </svg>
          </button>
          <button className="ctrl max" aria-label={win.maximized ? "Restore window" : "Maximize window"} onClick={() => toggleMax(win.id)}>
            <svg viewBox="0 0 13 13" aria-hidden>
              {/* macOS full-screen arrows, optically balanced: both states share the triangles' centroids */}
              <path
                d={win.maximized
                  ? "M5.67 5.67H1.27L5.67 1.27Z M7.33 7.33H11.73L7.33 11.73Z"
                  : "M2.73 2.73H7.13L2.73 7.13Z M10.27 10.27H5.87L10.27 5.87Z"}
                fill="rgba(0,0,0,0.6)"
              />
            </svg>
          </button>
        </div>
        {chrome?.navigation && (
          <div className="finder-nav" onPointerDown={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Back" disabled={!chrome.navigation.canGoBack} onClick={chrome.navigation.onBack}>
              <svg viewBox="0 0 16 16" aria-hidden><path d="M10 3.5 5.5 8l4.5 4.5" /></svg>
            </button>
            <button type="button" aria-label="Forward" disabled={!chrome.navigation.canGoForward} onClick={chrome.navigation.onForward}>
              <svg viewBox="0 0 16 16" aria-hidden><path d="m6 3.5 4.5 4.5L6 12.5" /></svg>
            </button>
          </div>
        )}
        <nav className="window-crumb" aria-label="Location" onPointerDown={(e) => { if ((e.target as HTMLElement).closest("button")) e.stopPropagation(); }}>
          {trail.map((crumb, index) => (
            <span className="crumb-part" key={`${crumb.label}-${index}`}>
              {index > 0 && <span className="crumb-sep">/</span>}
              {crumb.onClick && index < trail.length - 1 ? (
                <button type="button" onClick={crumb.onClick}>{crumb.label}</button>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <span className="spacer" />
        {chrome?.viewControls && (
          <div className="finder-views" onPointerDown={(e) => e.stopPropagation()} aria-label="View">
            <button type="button" className={chrome.viewControls.mode === "icon" ? "active" : ""} aria-label="Icon view" onClick={() => chrome.viewControls?.onChange("icon")}>
              <svg viewBox="0 0 16 16" aria-hidden><rect x="2" y="2" width="5" height="5" rx="1.2" /><rect x="9" y="2" width="5" height="5" rx="1.2" /><rect x="2" y="9" width="5" height="5" rx="1.2" /><rect x="9" y="9" width="5" height="5" rx="1.2" /></svg>
            </button>
            <button type="button" className={chrome.viewControls.mode === "list" ? "active" : ""} aria-label="List view" onClick={() => chrome.viewControls?.onChange("list")}>
              <svg viewBox="0 0 16 16" aria-hidden><rect x="2" y="3" width="2" height="2" rx=".6" /><rect x="5.5" y="3.25" width="8.5" height="1.5" rx=".75" /><rect x="2" y="7" width="2" height="2" rx=".6" /><rect x="5.5" y="7.25" width="8.5" height="1.5" rx=".75" /><rect x="2" y="11" width="2" height="2" rx=".6" /><rect x="5.5" y="11.25" width="8.5" height="1.5" rx=".75" /></svg>
            </button>
          </div>
        )}
        {meta && <span className="badge">{meta}</span>}
      </header>
      <WindowChromeProvider setChrome={setChrome}>
        <div className="win-body">{children}</div>
      </WindowChromeProvider>
      {!win.maximized && (
        <div
          className="resize-grip"
          aria-label="Resize window"
          onPointerDown={(e) => {
            e.stopPropagation();
            grip.current = { pid: e.pointerId };
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            focus(win.id);
          }}
          onPointerMove={(e) => {
            if (grip.current?.pid !== e.pointerId) return;
            const top = TOPBAR + win.y; // window's viewport-space top (the window layer sits below the menubar)
            const w = Math.max(320, Math.min(e.clientX - win.x + 8, window.innerWidth - win.x - 8));
            const h = Math.max(200, Math.min(e.clientY - top + 8, window.innerHeight - top - 8)); // bottom edge can't pass the screen bottom
            resize(win.id, w, h);
          }}
          onPointerUp={(e) => {
            if (grip.current?.pid === e.pointerId) grip.current = null;
          }}
        >
          <svg viewBox="0 0 12 12" aria-hidden>
            <path d="M9.2 4.55 L9.2 8.05 Q9.2 9.2 8.05 9.2 L4.55 9.2 Q3.4 9.2 4.21 8.39 L8.39 4.21 Q9.2 3.4 9.2 4.55 Z" />
          </svg>
        </div>
      )}
    </section>
  );
}
