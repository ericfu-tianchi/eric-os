import { DESKTOP_FOLDER_IDS, EXTERNAL_GAMES, filesystemChildren, filesystemNode, type ExternalGameId, type FileNode } from "../data/filesystem";
import { MEDIA_FOLDERS } from "../data/media";

/**
 * The phone's information architecture, derived from the same content files the desktop reads
 * (src/data/filesystem.ts, projects.ts, media.ts). Add a project, a folder, a photo or a video
 * there and it appears here too: in a Home Screen folder, in Files, in Photos or in Videos.
 * Only the system apps and the order of Home are written by hand (HOME below).
 */

/** Everything the phone can open. One running app per `appKey(route)`. */
export type Route =
  | { app: "about" }
  | { app: "case"; slug: string; title: string }
  | { app: "resume" }
  | { app: "files"; folder?: string }
  | { app: "photos"; album?: string; item?: string }
  | { app: "videos"; item?: string }
  | { app: "messages" }
  | { app: "settings"; page?: "snake" | "os" }
  | { app: "snake" }
  | { app: "game"; id: ExternalGameId };

export const appKey = (r: Route) =>
  r.app === "case" ? `case:${r.slug}` : r.app === "game" ? `game:${r.id}` : r.app;

/** A Home Screen slot: an app, or a folder of apps. */
export type HomeItem =
  | { kind: "app"; id: string; label: string; route: Route; menu?: { label: string; route: Route }[] }
  | { kind: "folder"; id: string; label: string; items: HomeItem[] };

const game = (id: ExternalGameId, label = EXTERNAL_GAMES[id].name): HomeItem => ({
  kind: "app", id: `game:${id}`, label, route: { app: "game", id },
  menu: [{ label: id === "soul-blade" ? "Play" : "Open", route: { app: "game", id } }, { label: "How I Built It", route: { app: "case", slug: id, title: label } }],
});

/** A file-tree node as a Home Screen item (folders of a game + its case page collapse into the game). */
function nodeToItem(n: FileNode): HomeItem | null {
  if (n.kind === "project" && n.projectSlug) return { kind: "app", id: `case:${n.projectSlug}`, label: n.name, route: { app: "case", slug: n.projectSlug, title: n.name } };
  if (n.kind === "game" && n.gameId) return game(n.gameId);
  if (n.kind === "folder") {
    const kids = filesystemChildren(n.id);
    const g = kids.find((k) => k.kind === "game");
    if (g?.gameId) return game(g.gameId);
    return { kind: "app", id: `files:${n.id}`, label: n.name, route: { app: "files", folder: n.id } };
  }
  return null;
}

/** Desktop folders (School Projects, Work, AI Side Projects) become Home Screen folders, contents included.
    Home Screen labels have room for about 12 characters, so long folder names get a short one here. */
const SHORT: Record<string, string> = { school: "School", ai: "AI Projects" };
export const HOME_FOLDERS: HomeItem[] = DESKTOP_FOLDER_IDS.map((id) => {
  const node = filesystemNode(id)!;
  return { kind: "folder", id, label: SHORT[id] ?? node.name, items: filesystemChildren(id).map(nodeToItem).filter((x): x is HomeItem => !!x) };
});

const app = (id: string, label: string, route: Route): HomeItem => ({ kind: "app", id, label, route });

const folder = (id: string) => HOME_FOLDERS.find((f) => f.id === id)!;

/** Page 1: the About widget (it is the About app), the apps, and the AI side projects and Work as folders.
    Page 2: School, plus Documents' one page (My Website). The Dock stays put. */
export const HOME = {
  page1: [
    app("case:how-i-ai", "How I AI", { app: "case", slug: "how-i-ai", title: "How I AI" }),
    app("resume", "Resume", { app: "resume" }),
    app("snake", "Snake", { app: "snake" }),
    app("videos", "Videos", { app: "videos" }),
    folder("ai"),
    folder("work"),
  ],
  page2: [
    folder("school"),
    app("case:handcoded", "My Website", { app: "case", slug: "handcoded", title: "My Website Evolution" }),
  ],
  dock: [
    app("messages", "Messages", { app: "messages" }),
    app("photos", "Photos", { app: "photos" }),
    app("files", "Files", { app: "files" }),
    app("settings", "Settings", { app: "settings" }),
  ],
};

/* ---------- Files: the same tree, minus what only makes sense on a Mac ---------- */

/** Phone root: the desktop's folders hoisted to the top (a phone has no Desktop), then Documents. Apps, shortcuts and media live elsewhere. */
export function filesRoot(): FileNode[] {
  return [...DESKTOP_FOLDER_IDS.map((id) => filesystemNode(id)!), filesystemNode("documents")!].filter(Boolean);
}
export function filesChildren(folder: string): FileNode[] {
  return filesystemChildren(folder).filter((n) => n.kind !== "shortcut" && n.kind !== "app");
}
export const filesNode = filesystemNode;

/** What tapping a file opens. */
export function routeForNode(n: FileNode): Route | { push: string } | null {
  if (n.kind === "folder") return { push: n.id };
  if (n.kind === "project" && n.projectSlug) return { app: "case", slug: n.projectSlug, title: n.name };
  if (n.kind === "game" && n.gameId) return { app: "game", id: n.gameId };
  if (n.kind === "document" && n.app === "about") return { app: "about" };
  if (n.kind === "document" && n.app === "resume") return { app: "resume" };
  if (n.kind === "image" && n.mediaId) return { app: "photos", item: n.mediaId };
  if (n.kind === "video" && n.mediaId) return { app: "videos", item: n.mediaId };
  return null;
}

export const ALBUMS = MEDIA_FOLDERS.filter((f) => f.kind === "image");
export const VIDEOS = MEDIA_FOLDERS.filter((f) => f.kind === "video").flatMap((f) => f.items);
