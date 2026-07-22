import soulBladeIcon from "../assets/icons/b/soul-blade.png";
import twistSolverIcon from "../assets/icons/b/twist-solver.png";
import applicationsIcon from "../assets/icons/b/sidebar-applications.png";
import desktopIcon from "../assets/icons/b/sidebar-desktop.png";
import documentsIcon from "../assets/icons/b/sidebar-documents.png";
import imagesIcon from "../assets/icons/b/sidebar-images.png";
import videosIcon from "../assets/icons/b/sidebar-videos.png";

export type ExternalGameId = "soul-blade" | "twist-solver";
export type FileNodeKind = "folder" | "project" | "game" | "document" | "app" | "shortcut" | "placeholder";

export interface FileNode {
  id: string;
  parent?: string;
  name: string;
  kind: FileNodeKind;
  description?: string;
  projectSlug?: string;
  gameId?: ExternalGameId;
  app?: "about" | "resume" | "snake" | "prefs";
  /** Finder-only pixel art for the five root locations. */
  icon?: string;
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
};

/**
 * The one canonical portfolio file tree. Desktop folders are aliases into this
 * tree, so adding a project here updates both the Desktop and Tianchintosh.
 */
export const FILE_NODES: FileNode[] = [
  { id: "tianchintosh", name: "Tianchintosh HD", kind: "folder", description: "Portfolio volume" },

  { id: "applications", parent: "tianchintosh", name: "Applications", kind: "folder", description: "3 apps", icon: applicationsIcon },
  { id: "desktop", parent: "tianchintosh", name: "Desktop", kind: "folder", description: "11 items", icon: desktopIcon },
  { id: "documents", parent: "tianchintosh", name: "Documents", kind: "folder", description: "0 items", icon: documentsIcon },
  { id: "images", parent: "tianchintosh", name: "Images", kind: "folder", description: "0 items", icon: imagesIcon },
  { id: "videos", parent: "tianchintosh", name: "Videos", kind: "folder", description: "0 items", icon: videosIcon },

  { id: "snake", parent: "applications", name: "Snake", kind: "app", app: "snake", description: "Playable game" },
  { id: "soul-blade-app", parent: "applications", name: "Soul Blade", kind: "shortcut", targetId: "soul-blade", description: "Playable game" },
  { id: "twist-solver-launcher", parent: "applications", name: "Twist Solver", kind: "shortcut", targetId: "twist-solver", description: "Playable app" },

  { id: "school", parent: "desktop", name: "School Projects", kind: "folder", description: "6 items" },
  { id: "refugeeone", parent: "school", name: "RefugeeOne Job Finding Website", kind: "project", projectSlug: "refugeeone" },
  { id: "neurobot", parent: "school", name: "Neurobot", kind: "project", projectSlug: "neurobot" },
  { id: "homesoffcampus", parent: "school", name: "HomesOffCampus", kind: "project", projectSlug: "homesoffcampus" },
  { id: "connectr", parent: "school", name: "Connectr", kind: "project", projectSlug: "connectr" },
  { id: "subtension", parent: "school", name: "Subtension", kind: "project", projectSlug: "subtension" },
  { id: "rutabagga", parent: "school", name: "Rutabagga", kind: "project", projectSlug: "rutabagga" },

  { id: "huawei", parent: "desktop", name: "Work at Huawei", kind: "folder", description: "3 items" },
  { id: "huawei-overview", parent: "huawei", name: "Work Overview", kind: "placeholder", description: "Coming soon" },
  { id: "prompt-engineering", parent: "huawei", name: "Prompt Engineering Platform", kind: "placeholder", description: "Coming soon" },
  { id: "data-workflow", parent: "huawei", name: "Data Workflow", kind: "placeholder", description: "Coming soon" },

  { id: "opus", parent: "desktop", name: "Work at Opus Clip", kind: "folder", description: "Empty folder" },
  { id: "selected", parent: "desktop", name: "Selected Work", kind: "folder", description: "Empty folder" },

  { id: "website", parent: "desktop", name: "My Website", kind: "folder", description: "1 item" },
  { id: "website-evolution", parent: "website", name: "My Website Evolution", kind: "project", projectSlug: "handcoded" },

  { id: "ai", parent: "desktop", name: "AI Stuff", kind: "folder", description: "3 items" },
  { id: "soul-blade-game", parent: "ai", name: "Soul Blade Game", kind: "folder", description: "2 items" },
  { id: "soul-blade", parent: "soul-blade-game", name: "Soul Blade", kind: "game", gameId: "soul-blade", description: "Playable game" },
  { id: "soul-blade-how", parent: "soul-blade-game", name: "How I Built It", kind: "project", projectSlug: "soul-blade" },
  { id: "twist-solver-app", parent: "ai", name: "Twist Solver App", kind: "folder", description: "2 items" },
  { id: "twist-solver", parent: "twist-solver-app", name: "Twist Solver", kind: "game", gameId: "twist-solver", description: "Playable app" },
  { id: "twist-solver-how", parent: "twist-solver-app", name: "How I Built It", kind: "project", projectSlug: "twist-solver" },
  { id: "how-i-ai", parent: "ai", name: "How I AI", kind: "placeholder", description: "Coming soon" },

  { id: "about", parent: "desktop", name: "About_Me.md", kind: "document", app: "about", description: "Markdown document" },
  { id: "resume", parent: "desktop", name: "resume.pdf", kind: "document", app: "resume", description: "PDF document" },
  { id: "desktop-snake", parent: "desktop", name: "Snake", kind: "shortcut", targetId: "snake", description: "Application shortcut" },
  { id: "desktop-disk", parent: "desktop", name: "Tianchintosh HD", kind: "shortcut", targetId: "tianchintosh", description: "System volume" },
  { id: "settings", parent: "desktop", name: "Settings", kind: "app", app: "prefs", description: "System preferences" },
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

export const DESKTOP_FOLDER_IDS = ["school", "huawei", "opus", "selected", "website", "ai"] as const;
export const FINDER_ROOT_IDS = ["applications", "desktop", "documents", "images", "videos"] as const;
