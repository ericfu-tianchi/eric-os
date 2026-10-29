import soulBladeIcon from "../assets/icons/b/soul-blade.png";
import twistSolverIcon from "../assets/icons/b/twist-solver.png";
import legoWorldIcon from "../assets/icons/b/lego-world.svg";
import applicationsIcon from "../assets/icons/b/sidebar-applications.png";
import applicationsSideIcon from "../assets/icons/b/sidebar-applications-bold.png";
import desktopIcon from "../assets/icons/b/sidebar-desktop.png";
import desktopSideIcon from "../assets/icons/b/sidebar-desktop-bold.png";
import documentsIcon from "../assets/icons/b/sidebar-documents.png";
import documentsSideIcon from "../assets/icons/b/sidebar-documents-bold.png";
import imagesIcon from "../assets/icons/b/sidebar-images.png";
import imagesSideIcon from "../assets/icons/b/sidebar-images-bold.png";
import videosIcon from "../assets/icons/b/sidebar-videos.png";
import videosSideIcon from "../assets/icons/b/sidebar-videos-bold.png";
import { MEDIA_FOLDERS } from "./media";

export type ExternalGameId = "soul-blade" | "twist-solver" | "lego-world";
export type FileNodeKind = "folder" | "project" | "game" | "document" | "app" | "shortcut" | "placeholder" | "image" | "video";

export interface FileNode {
  id: string;
  parent?: string;
  name: string;
  kind: FileNodeKind;
  description?: string;
  projectSlug?: string;
  gameId?: ExternalGameId;
  app?: "about" | "resume" | "snake" | "prefs";
  /** A static HTML page in public/, shown inside a regular OS window. */
  html?: string;
  /** Finder-only pixel art for the five root locations. */
  icon?: string;
  /** The same folder with a bigger, darker glyph, readable at the sidebar's 20px. */
  sidebarIcon?: string;
  /** Image / video file: the MediaItem id in src/data/media.ts. */
  mediaId?: string;
  /** Finder thumbnail for media files. */
  thumb?: string;
  /** A Desktop / Applications alias that resolves to a canonical node. */
  targetId?: string;
}

export const EXTERNAL_GAMES: Record<ExternalGameId, {
  name: string;
  url: string;
  repository: string;
  icon: string;
}> = {
  "soul-blade": {
    name: "Soul Blade",
    url: "https://soul-blade.pages.dev/",
    repository: "https://github.com/ericfu-tianchi/soul-blade",
    icon: soulBladeIcon,
  },
  "twist-solver": {
    name: "Twist Solver",
    url: "https://twist-solver.pages.dev/",
    repository: "https://github.com/ericfu-tianchi/twist-solver",
    icon: twistSolverIcon,
  },
  "lego-world": {
    name: "My Lego World",
    url: "https://ericfu-lego-world.pages.dev/",
    repository: "https://github.com/ericfu-tianchi/my-lego-world",
    icon: legoWorldIcon,
  },
};

/**
 * The one canonical portfolio file tree. Desktop folders are aliases into this
 * tree, so adding a project here updates both the Desktop and Tianchintosh.
 */
export const FILE_NODES: FileNode[] = [
  { id: "tianchintosh", name: "Tianchintosh HD", kind: "folder", description: "Portfolio volume" },

  { id: "applications", parent: "tianchintosh", name: "Applications", kind: "folder", description: "5 apps", icon: applicationsIcon, sidebarIcon: applicationsSideIcon },
  { id: "desktop", parent: "tianchintosh", name: "Desktop", kind: "folder", description: "8 items", icon: desktopIcon, sidebarIcon: desktopSideIcon },
  { id: "documents", parent: "tianchintosh", name: "Documents", kind: "folder", description: "1 item", icon: documentsIcon, sidebarIcon: documentsSideIcon },
  { id: "images", parent: "tianchintosh", name: "Images", kind: "folder", description: `${MEDIA_FOLDERS.filter((f) => f.kind === "image").length} folders`, icon: imagesIcon, sidebarIcon: imagesSideIcon },
  { id: "videos", parent: "tianchintosh", name: "Videos", kind: "folder", description: `${MEDIA_FOLDERS.filter((f) => f.kind === "video").reduce((n, f) => n + f.items.length, 0)} videos`, icon: videosIcon, sidebarIcon: videosSideIcon },

  { id: "snake", parent: "applications", name: "Snake", kind: "app", app: "snake", description: "Playable game" },
  { id: "soul-blade-app", parent: "applications", name: "Soul Blade", kind: "shortcut", targetId: "soul-blade", description: "Playable game" },
  { id: "twist-solver-launcher", parent: "applications", name: "Twist Solver", kind: "shortcut", targetId: "twist-solver", description: "Playable app" },
  { id: "lego-world-launcher", parent: "applications", name: "My Lego World", kind: "shortcut", targetId: "lego-world", description: "Playable app" },
  { id: "settings", parent: "applications", name: "Settings", kind: "app", app: "prefs", description: "System preferences" },

  { id: "school", parent: "desktop", name: "School Projects", kind: "folder", description: "6 items" },
  { id: "refugeeone", parent: "school", name: "RefugeeOne Job Finding Website", kind: "project", projectSlug: "refugeeone" },
  { id: "neurobot", parent: "school", name: "Neurobot", kind: "project", projectSlug: "neurobot" },
  { id: "subtension", parent: "school", name: "Subtension Game", kind: "project", projectSlug: "subtension" },
  { id: "homesoffcampus", parent: "school", name: "Homes Off Campus", kind: "project", projectSlug: "homesoffcampus" },
  { id: "connectr", parent: "school", name: "Connectr App", kind: "project", projectSlug: "connectr" },
  { id: "rutabagga", parent: "school", name: "Rutabagga Logo", kind: "project", projectSlug: "rutabagga" },

  { id: "work", parent: "desktop", name: "Work", kind: "folder", description: "2 folders" },
  { id: "opus", parent: "work", name: "OpusClip", kind: "folder", description: "Empty folder" },
  { id: "huawei", parent: "work", name: "Huawei", kind: "folder", description: "3 items" },
  { id: "huawei-overview", parent: "huawei", name: "Work Overview", kind: "placeholder", description: "Coming soon" },
  { id: "prompt-engineering", parent: "huawei", name: "Prompt Engineering Platform", kind: "placeholder", description: "Coming soon" },
  { id: "data-workflow", parent: "huawei", name: "Data Workflow", kind: "placeholder", description: "Coming soon" },


  { id: "website", parent: "documents", name: "My Website", kind: "folder", description: "1 item" },
  { id: "website-evolution", parent: "website", name: "My Website Evolution", kind: "project", projectSlug: "handcoded" },

  { id: "ai", parent: "desktop", name: "AI Side Projects", kind: "folder", description: "4 items" },
  { id: "soul-blade-game", parent: "ai", name: "Soul Blade Game", kind: "folder", description: "2 items" },
  { id: "soul-blade", parent: "soul-blade-game", name: "Soul Blade", kind: "game", gameId: "soul-blade", description: "Playable game" },
  { id: "soul-blade-how", parent: "soul-blade-game", name: "How I Built It", kind: "project", projectSlug: "soul-blade" },
  { id: "lego-world-folder", parent: "ai", name: "My Lego World", kind: "folder", description: "2 items" },
  { id: "lego-world", parent: "lego-world-folder", name: "My Lego World", kind: "game", gameId: "lego-world", description: "Playable app" },
  { id: "lego-world-how", parent: "lego-world-folder", name: "How I Built It", kind: "project", projectSlug: "lego-world" },
  { id: "twist-solver-app", parent: "ai", name: "Twist Solver App", kind: "folder", description: "2 items" },
  { id: "twist-solver", parent: "twist-solver-app", name: "Twist Solver", kind: "game", gameId: "twist-solver", description: "Playable app" },
  { id: "twist-solver-how", parent: "twist-solver-app", name: "How I Built It", kind: "project", projectSlug: "twist-solver" },

  { id: "desktop-soul-blade", parent: "desktop", name: "Soul Blade", kind: "shortcut", targetId: "soul-blade", description: "Playable game" },
  { id: "desktop-lego-world", parent: "desktop", name: "My Lego World", kind: "shortcut", targetId: "lego-world", description: "Playable app" },
  { id: "about", parent: "desktop", name: "About Me", kind: "document", app: "about", description: "Profile" },
  { id: "resume", parent: "desktop", name: "resume.pdf", kind: "document", app: "resume", description: "PDF document" },
  { id: "desktop-snake", parent: "desktop", name: "Snake", kind: "shortcut", targetId: "snake", description: "Application shortcut" },

  // Images / Videos: generated from src/data/media.ts
  ...MEDIA_FOLDERS.flatMap((f): FileNode[] => {
    const root = f.kind === "image" ? "images" : "videos";
    return [
      ...(f.flat ? [] : [{ id: f.id, parent: root, name: f.name, kind: "folder" as const, description: `${f.items.length} item${f.items.length === 1 ? "" : "s"}` }]),
      ...f.items.map((i): FileNode => ({ id: i.id, parent: f.flat ? root : f.id, name: i.name, kind: f.kind, mediaId: i.id, thumb: i.thumb, description: f.kind === "image" ? "Image" : "Video" })),
    ];
  }),
];

export const filesystemNode = (id: string) => FILE_NODES.find((node) => node.id === id);
export const filesystemChildren = (parent: string) => FILE_NODES.filter((node) => node.parent === parent);

export function filesystemTrail(id: string): FileNode[] {
  const trail: FileNode[] = [];
  let node = filesystemNode(id);
  while (node) {
    trail.unshift(node);
    node = node.parent ? filesystemNode(node.parent) : undefined;
  }
  return trail;
}

export const DESKTOP_FOLDER_IDS = ["school", "work", "ai"] as const;
export const FINDER_ROOT_IDS = ["applications", "desktop", "documents", "images", "videos"] as const;
