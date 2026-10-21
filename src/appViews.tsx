import type { AppId, WinInstance } from "./store";
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

/** App registry: what each window renders. Shared by the desktop (App.tsx) and the iOS shell (mobile/IOSShell.tsx). */
export const APP_VIEWS: Record<AppId, (w: WinInstance) => React.ReactNode> = {
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
