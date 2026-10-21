import { AboutApp } from "../apps/AboutApp";
import { ProjectDetailApp } from "../apps/ProjectsApp";
import { WindowChromeProvider } from "../components/WindowChrome";
import { EXTERNAL_GAMES } from "../data/filesystem";
import { filesNode, type Route } from "./model";
import type { Screen } from "./nav";
import { AlbumsScreen, FilesScreen, GameFrame, MessagesScreen, ResumeScreen, SettingsScreen, VideosScreen } from "./apps";
import { SnakeGame } from "./SnakeGame";

const noop = () => {};
/** Desktop views ask for window chrome (title trails); on the phone the nav bar owns the title. */
const Hosted = ({ children }: { children: React.ReactNode }) => <WindowChromeProvider setChrome={noop}>{children}</WindowChromeProvider>;

/** The first screen of each app. */
export function screenFor(r: Route): Omit<Screen, "key"> {
  switch (r.app) {
    case "about": return { title: "About Me", tone: "dark", node: <Hosted><AboutApp /></Hosted> };
    case "case": return { title: r.title, tone: "light", node: <Hosted><ProjectDetailApp slug={r.slug} /></Hosted> };
    case "resume": return { title: "Resume", tone: "light", node: <ResumeScreen /> };
    case "files": return { title: r.folder ? filesNode(r.folder)?.name ?? "Files" : "Files", tone: "light", large: true, node: <FilesScreen folder={r.folder} /> };
    case "photos": return { title: "Photos", tone: "light", large: true, node: <AlbumsScreen start={r.item} /> };
    case "videos": return { title: "Videos", tone: "light", large: true, node: <VideosScreen start={r.item} /> };
    case "messages": return { title: "Messages", tone: "light", node: <MessagesScreen /> };
    case "settings": return { title: "Settings", tone: "light", large: true, node: <SettingsScreen page={r.page} /> };
    case "snake": return { title: "Snake", tone: "dark", node: <SnakeGame /> };
    case "game": return { title: EXTERNAL_GAMES[r.id].name, tone: "dark", node: <GameFrame id={r.id} /> };
  }
}
