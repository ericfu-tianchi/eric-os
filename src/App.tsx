import { useEffect, useState } from "react";
import { useOS, type AppId, type WinInstance } from "./store";
import { MenuBar } from "./components/MenuBar";
import { Desktop } from "./components/Desktop";
import { Dock } from "./components/Dock";
import { WindowFrame } from "./components/WindowFrame";
import { DesktopSnake, ERIC_POSE } from "./components/DesktopSnake";
import { gridSpec } from "./components/Pixel";
import { PROJECTS } from "./data/projects";
import { TOPBAR } from "./components/desktopGrid";
import { BootSplash } from "./components/BootSplash";
import { MobileShell } from "./components/MobileShell";
import { AboutApp } from "./apps/AboutApp";
import { ProjectsApp, ProjectDetailApp } from "./apps/ProjectsApp";
import { SnakeApp } from "./apps/SnakeApp";
import { ResumeApp, PrefsApp } from "./apps/MiscApps";
import { LifeApp, PlaygroundApp } from "./apps/LifeApp";
import { FileSystemApp } from "./apps/FileSystemApp";
import { ExternalGameApp } from "./apps/ExternalGameApp";
import { HtmlDocApp } from "./apps/HtmlDocApp";
import { AboutOSApp } from "./apps/AboutOSApp";
import { PreviewApp, PlayerApp } from "./apps/MediaApps";
import { ScreenSaver } from "./components/ScreenSaver";

/** App registry — add an app: one component + one entry here. */
const APP_VIEWS: Record<AppId, (w: WinInstance) => React.ReactNode> = {
  about: () => <AboutApp />,
  projects: () => <ProjectsApp />,
  resume: () => <ResumeApp />,
  readme: () => <FileSystemApp />,
  filesystem: (w) => <FileSystemApp initialId={w.payload} />,
  prefs: () => <PrefsApp />,
  snake: () => <SnakeApp />,
  "soul-blade": () => <ExternalGameApp gameId="soul-blade" />,
  "twist-solver": () => <ExternalGameApp gameId="twist-solver" />,
  "lego-world": () => <ExternalGameApp gameId="lego-world" />,
  "html-doc": (w) => <HtmlDocApp nodeId={w.payload} />,
  life: () => <LifeApp />,
  playground: () => <PlaygroundApp />,
  "project-detail": (w) => <ProjectDetailApp slug={w.payload} />,
  "about-os": () => <AboutOSApp />,
  preview: (w) => <PreviewApp mediaId={w.payload} />,
  player: (w) => <PlayerApp mediaId={w.payload} />,
};

const APP_BADGES: Partial<Record<AppId, string>> = {
  projects: "3 folders",
  snake: "v1.0",
  "soul-blade": "LIVE GAME",
  "twist-solver": "LIVE APP",
  "lego-world": "LIVE APP",
  resume: "2026",
};

const CANVAS_VARIANTS = [
  { id: "carbon", label: "Carbon" },
  { id: "ink", label: "Ink" },
  { id: "smoke", label: "Smoke" },
  { id: "graphite", label: "Graphite" },
] as const;

/** SNAKE.SYS takeover: one window sweeps left; several scatter away from center, Exposé-style */
function flyVec(w: WinInstance, count: number): { x: number; y: number } {
  const vw = window.innerWidth, vh = window.innerHeight;
  const D = Math.max(vw, vh) * 1.2;
  if (count === 1 || w.maximized) return { x: -D, y: 0 };
  let dx = w.x + w.w / 2 - vw / 2, dy = w.y + w.h / 2 - vh / 2;
  if (Math.hypot(dx, dy) < 40) { dx = -1; dy = -0.1; } // dead-center window still needs a direction
  const m = Math.hypot(dx, dy);
  return { x: (dx / m) * D, y: (dy / m) * D };
}

function useIsMobile() {
  const force = typeof window !== "undefined" && window.location.search.includes("forceDesktop");
  // The OS only works when the full "hello" pose and Snake's right-turn buffer fit:
  // 27 columns = head at col 23 + three open cells; 13 rows keeps the wordmark
  // whole while still leaving four cells below it. Below this, use the content view.
  const fitsDesktop = () => {
    if (typeof window === "undefined") return false;
    const spec = gridSpec(window.innerWidth, window.innerHeight - TOPBAR);
    return spec.cols >= 27 && spec.rows >= 13;
  };
  const [mobile, setMobile] = useState(() => !force && !fitsDesktop());
  useEffect(() => {
    if (force) return;
    const update = () => setMobile(!fitsDesktop());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [force]);
  return mobile;
}

export default function App() {
  const { windows, order, open } = useOS();
  const theme = useOS((s) => s.theme);
  const snakeMode = useOS((s) => s.snakeMode);
  const isMobile = useIsMobile();
  const canvasStudy = new URLSearchParams(window.location.search).has("canvasStudy");
  const [canvasVariant, setCanvasVariant] = useState<(typeof CANVAS_VARIANTS)[number]["id"]>(() => {
    const requested = new URLSearchParams(window.location.search).get("canvas");
    return CANVAS_VARIANTS.some((variant) => variant.id === requested) ? requested as (typeof CANVAS_VARIANTS)[number]["id"] : "carbon";
  });
  const [booting, setBooting] = useState(() => !sessionStorage.getItem("eric-os-booted"));
  const [exiting, setExiting] = useState(false); // windows/dock are animating off for SNAKE.SYS
  const [prevSnake, setPrevSnake] = useState(snakeMode);
  if (snakeMode !== prevSnake) {
    // flip during render so windows are never unmounted before the fly-out starts
    setPrevSnake(snakeMode);
    setExiting(snakeMode);
  }
  useEffect(() => {
    if (!exiting) return;
    // Leave a small compositor buffer after the continuous Exposé-style scatter finishes.
    const t = window.setTimeout(() => setExiting(false), 960);
    return () => window.clearTimeout(t);
  }, [exiting]);

  // charcoal hero is the default (:root); light twin is an explicit opt-in
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;

    // Canvas study tokens only belong to the charcoal desktop. Keep the
    // explicit light theme independent when the study control is not open.
    if (theme === "light" && !canvasStudy) {
      delete root.dataset.canvas;
      return;
    }

    root.dataset.canvas = canvasVariant;
    return () => { delete root.dataset.canvas; };
  }, [canvasVariant, canvasStudy, theme]);

  // every visit starts with About Me open (once per browser session, only on an empty desktop),
  // placed so the snake's head still peeks out beside it: visitors notice there's a snake underneath.
  useEffect(() => {
    if (isMobile) return;
    if (new URLSearchParams(window.location.search).get("snake")) useOS.getState().setSnakeMode(true);
    if (Object.keys(useOS.getState().windows).length === 0 && !sessionStorage.getItem("eric-os-about-shown")) {
      const vw = window.innerWidth, vh = window.innerHeight;
      const s = gridSpec(vw, vh - TOPBAR);
      const [hc, hr] = ERIC_POSE[ERIC_POSE.length - 1];
      const headX = hc * s.cellW, headY = (hr + s.rows - 16) * s.cellH; // same bottom anchoring as the wallpaper; window coords start under the menubar
      // Eric's placement: just under the menubar, right edge ~2 cells short of the head (head + a bit of body show)
      const gap = 2 * s.cellW + 16, y = 36;
      const w = Math.min(880, vw - 40, Math.max(760, headX - gap - 12)); // give up a little width before covering the head
      const x = Math.max(12, headX - gap - w);
      // too narrow to sit beside the head: stop the window above it instead
      const h = x + w > headX - gap ? Math.max(360, Math.min(720, headY - 16 - y)) : Math.min(720, vh - TOPBAR - y - 16);
      open("about", { title: "About Me", w, h, x, y });
      sessionStorage.setItem("eric-os-about-shown", "1");
    }
    // deep link: ?open=projects,life or ?open=project-detail:twist-solver
    const m = new URLSearchParams(window.location.search).get("open");
    if (m) {
      const TITLES: Partial<Record<AppId, string>> = {
        projects: "Projects", about: "About Me", resume: "resume.pdf",
        readme: "Tianchintosh HD", filesystem: "Tianchintosh HD", prefs: "Settings", snake: "Snake",
        "soul-blade": "Soul Blade", "twist-solver": "Twist Solver",
        life: "LIFE.APP", playground: "PLAYGROUND", "about-os": "About Tianchi OS",
      };
      m.split(",").forEach((tok) => {
        const [app, payload] = tok.split(":") as [AppId, string?];
        if (app === "project-detail" && payload) {
          open("project-detail", { title: PROJECTS.find((p) => p.slug === payload)?.name ?? payload, payload });
        } else if (TITLES[app]) {
          open(app, { title: TITLES[app] });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  if (isMobile) return <MobileShell />;

  return (
    <>
      {booting && (
        <BootSplash
          onDone={() => {
            sessionStorage.setItem("eric-os-booted", "1");
            setBooting(false);
          }}
        />
      )}
      <MenuBar />
      <Desktop />
      {canvasStudy && (
        <aside className="canvas-study" aria-label="Canvas color study">
          <span>CANVAS</span>
          {CANVAS_VARIANTS.map((variant) => (
            <button
              key={variant.id}
              className={canvasVariant === variant.id ? "active" : ""}
              onClick={() => setCanvasVariant(variant.id)}
            >
              {variant.label}
            </button>
          ))}
        </aside>
      )}
      {/* Windows live OUTSIDE .desktop: .desktop is position:fixed (its own stacking context),
          so windows nested in it can never rise above the live snake on the way out. This layer
          is position:absolute with NO z-index — a containing block that restores the menubar
          offset without forming a stacking context, so each window's z-index competes at the
          root and the flyout beats the snake. pointer-events:none keeps the gaps click-through. */}
      {(!snakeMode || exiting) && (
        <div className="window-layer">
          {order.map((id) => {
            const w = windows[id];
            if (!w) return null;
            return (
              <WindowFrame
                key={id}
                win={w}
                focused={order[order.length - 1] === id}
                badge={APP_BADGES[w.app]}
                flyout={snakeMode ? flyVec(w, order.length) : undefined}
              >
                {APP_VIEWS[w.app](w)}
              </WindowFrame>
            );
          })}
        </div>
      )}
      {snakeMode && <DesktopSnake windowsOpen={order.length > 0} />}
      {(!snakeMode || exiting) && !order.some((id) => windows[id]?.maximized) && <Dock leaving={snakeMode} />}
      <ScreenSaver />
    </>
  );
}
