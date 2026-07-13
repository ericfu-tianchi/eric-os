import { useEffect, useState } from "react";
import { useOS, type AppId, type WinInstance } from "./store";
import { MenuBar } from "./components/MenuBar";
import { Desktop } from "./components/Desktop";
import { Dock } from "./components/Dock";
import { WindowFrame } from "./components/WindowFrame";
import { BootSplash } from "./components/BootSplash";
import { MobileShell } from "./components/MobileShell";
import { AboutApp } from "./apps/AboutApp";
import { ProjectsApp, ProjectDetailApp } from "./apps/ProjectsApp";
import { SnakeApp } from "./apps/SnakeApp";
import { ResumeApp, ReadmeApp, PrefsApp } from "./apps/MiscApps";

/** App registry — add an app: one component + one entry here. */
const APP_VIEWS: Record<AppId, (w: WinInstance) => React.ReactNode> = {
  about: () => <AboutApp />,
  projects: () => <ProjectsApp />,
  resume: () => <ResumeApp />,
  readme: () => <ReadmeApp />,
  prefs: () => <PrefsApp />,
  snake: () => <SnakeApp />,
  "project-detail": (w) => <ProjectDetailApp slug={w.payload} />,
};

const APP_BADGES: Partial<Record<AppId, string>> = {
  projects: "6 items",
  snake: "v1.0",
  readme: "manual",
};

function useIsMobile() {
  const force = typeof window !== "undefined" && window.location.search.includes("forceDesktop");
  const [mobile, setMobile] = useState(
    () => !force && typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches
  );
  useEffect(() => {
    if (force) return;
    const mq = window.matchMedia("(max-width: 820px)");
    const fn = () => setMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [force]);
  return mobile;
}

export default function App() {
  const { windows, order, open } = useOS();
  const isMobile = useIsMobile();
  const [booting, setBooting] = useState(() => !sessionStorage.getItem("eric-os-booted"));

  // first visit: never an empty desktop
  useEffect(() => {
    if (isMobile) return;
    if (Object.keys(useOS.getState().windows).length === 0 && !localStorage.getItem("eric-os-welcomed")) {
      open("about", { title: "ABOUT.TXT" });
      localStorage.setItem("eric-os-welcomed", "1");
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
      <Desktop>
        {order.map((id) => {
          const w = windows[id];
          if (!w) return null;
          return (
            <WindowFrame key={id} win={w} focused={order[order.length - 1] === id} badge={APP_BADGES[w.app]}>
              {APP_VIEWS[w.app](w)}
            </WindowFrame>
          );
        })}
      </Desktop>
      <Dock />
    </>
  );
}
