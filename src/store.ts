import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppId =
  | "projects"
  | "about"
  | "resume"
  | "readme"
  | "prefs"
  | "snake"
  | "filesystem"
  | "soul-blade"
  | "twist-solver"
  | "lego-world"
  | "html-doc"
  | "preview"
  | "player"
  | "life"
  | "playground"
  | "project-detail"
  | "about-os";

export interface WinInstance {
  id: string; // instance id
  app: AppId;
  title?: string; // override
  payload?: string; // e.g. project slug for detail windows
  x: number;
  y: number;
  w: number;
  h: number;
  maximized: boolean;
}

export type IconSet = "a" | "d";
export type Theme = "dark" | "light";
export const SNAKE_HAT_IDS = ["none", "glasses", "cap", "phones", "bow", "shades", "cat", "nycap"] as const;
/** Bump when the default desktop arrangement changes: saved icon positions reset once. */
const ICON_LAYOUT = 3;
export const DOCK_SIZE = { stops: [32, 40, 48, 56, 64] as const, default: 48 };
export type SaverId = "duel" | "corner" | "crazy" | "reel";
export const SAVER_IDS: SaverId[] = ["duel", "corner", "crazy", "reel"];
export type SnakeHat = (typeof SNAKE_HAT_IDS)[number];
/**
 * Desktop files are anchored to the right edge, independently of the
 * left-anchored "hello" wallpaper. `col` is retained only for old persisted
 * positions; free drags store their exact `rightPx` offset and Sort stores
 * `right` as a one-based cell coordinate.
 */
export type IconPosition = { x: number; y: number; col?: number; row?: number; right?: number; rightPx?: number };

interface OSState {
  windows: Record<string, WinInstance>;
  order: string[]; // z-order, last = front
  iconPos: Record<string, IconPosition>;
  iconSet: IconSet;
  theme: Theme;
  snakeBest: number;
  snakeHat: SnakeHat; // wallpaper snake's head accessory (set in Prefs)
  dockSize: number; // dock icon size in px (Settings → Dock)
  dockAutoHide: boolean;
  saver: SaverId; // Settings → Screen saver
  saverDelay: number; // idle minutes before it starts; 0 = never
  saverActive: boolean; // transient: the screen saver is showing
  snakeMode: boolean; // desktop-wide snake takeover (transient, not persisted)
  booted: boolean;
  seq: number;

  open: (app: AppId, opts?: Partial<Pick<WinInstance, "title" | "payload" | "w" | "h" | "maximized">>) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, w: number, h: number) => void;
  toggleMax: (id: string) => void;
  setIconPos: (key: string, x: number, y: number, cell?: { row?: number; col?: number; right?: number; rightPx?: number }) => void;
  setIconSet: (s: IconSet) => void;
  setTheme: (t: Theme) => void;
  setSnakeBest: (n: number) => void;
  setSnakeHat: (h: SnakeHat) => void;
  setSnakeMode: (on: boolean) => void;
  setDockSize: (px: number) => void;
  setDockAutoHide: (on: boolean) => void;
  setSaver: (id: SaverId) => void;
  setSaverDelay: (min: number) => void;
  setSaverActive: (on: boolean) => void;
  setBooted: () => void;
  resetDesktop: () => void;
}

const DEFAULT_SIZE: Record<AppId, { w: number; h: number }> = {
  projects: { w: 680, h: 540 },
  about: { w: 960, h: 720 },
  resume: { w: 720, h: 680 },
  readme: { w: 540, h: 470 },
  prefs: { w: 560, h: 640 },
  snake: { w: 424, h: 434 },
  filesystem: { w: 860, h: 590 },
  "soul-blade": { w: 1120, h: 720 },
  "twist-solver": { w: 1120, h: 720 },
  "lego-world": { w: 1120, h: 720 },
  "html-doc": { w: 820, h: 620 },
  preview: { w: 860, h: 600 },
  player: { w: 854, h: 510 },
  life: { w: 560, h: 500 },
  playground: { w: 600, h: 520 },
  "project-detail": { w: 700, h: 520 },
  "about-os": { w: 300, h: 470 },
};

export const useOS = create<OSState>()(
  persist(
    (set, get) => ({
      windows: {},
      order: [],
      iconPos: {},
      iconSet: "d",
      theme: "dark",
      snakeBest: 0,
      snakeHat: "none",
      dockSize: DOCK_SIZE.default,
      dockAutoHide: false,
      saver: "duel",
      saverDelay: 3,
      saverActive: false,
      snakeMode: false,
      booted: false,
      seq: 1,

      open: (app, opts) => {
        const s = get();
        // File-system windows and project detail windows are keyed by location;
        // every other app remains single-instance.
        const existing = Object.values(s.windows).find(
          (w) => w.app === app && (!["project-detail", "filesystem", "html-doc", "preview", "player"].includes(app) || w.payload === opts?.payload)
        );
        if (existing) return s.focus(existing.id);
        const id = `${app}-${s.seq}`;
        const size = DEFAULT_SIZE[app];
        const n = s.order.length;
        const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
        const win: WinInstance = {
          id,
          app,
          title: opts?.title,
          payload: opts?.payload,
          w: Math.min(opts?.w ?? size.w, vw - 40),
          h: opts?.h ?? size.h,
          x: Math.max(12, Math.min(90 + n * 34, vw - size.w - 60)),
          y: 64 + ((n * 30) % 180),
          maximized: opts?.maximized ?? false,
        };
        set({
          windows: { ...s.windows, [id]: win },
          order: [...s.order, id],
          seq: s.seq + 1,
        });
      },

      close: (id) => {
        const { [id]: _, ...rest } = get().windows;
        set({ windows: rest, order: get().order.filter((o) => o !== id) });
      },

      focus: (id) => {
        const order = get().order.filter((o) => o !== id);
        order.push(id);
        set({ order });
      },

      move: (id, x, y) => {
        const w = get().windows[id];
        if (!w) return;
        set({ windows: { ...get().windows, [id]: { ...w, x, y } } });
      },

      resize: (id, w, h) => {
        const win = get().windows[id];
        if (!win) return;
        set({ windows: { ...get().windows, [id]: { ...win, w, h } } });
      },

      toggleMax: (id) => {
        const w = get().windows[id];
        if (!w) return;
        set({ windows: { ...get().windows, [id]: { ...w, maximized: !w.maximized } } });
        get().focus(id);
      },

      setIconPos: (key, x, y, cell) =>
        set({ iconPos: { ...get().iconPos, [key]: { x, y, ...cell } } }),

      setIconSet: (iconSet) => set({ iconSet }),
      setTheme: (theme) => set({ theme }),
      setSnakeBest: (snakeBest) => set({ snakeBest }),
      setSnakeHat: (snakeHat) => set({ snakeHat }),
      setSnakeMode: (snakeMode) => set({ snakeMode }),
      setDockSize: (dockSize) => set({ dockSize }),
      setDockAutoHide: (dockAutoHide) => set({ dockAutoHide }),
      setSaver: (saver) => set({ saver }),
      setSaverDelay: (saverDelay) => set({ saverDelay }),
      setSaverActive: (saverActive) => set({ saverActive }),
      setBooted: () => set({ booted: true }),

      resetDesktop: () =>
        set({ windows: {}, order: [], iconPos: {} }),
    }),
    {
      name: "eric-os-v1",
      partialize: (s) => ({
        windows: s.windows,
        order: s.order,
        iconPos: s.iconPos,
        iconLayout: ICON_LAYOUT,
        iconSet: s.iconSet,
        theme: s.theme,
        snakeBest: s.snakeBest,
        snakeHat: s.snakeHat,
        dockSize: s.dockSize,
        dockAutoHide: s.dockAutoHide,
        saver: s.saver,
        saverDelay: s.saverDelay,
        seq: s.seq,
      }),
      // a hat retired from the wardrobe (e.g. the old "bubble") falls back to none
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<OSState>;
        const snakeHat = (SNAKE_HAT_IDS as readonly string[]).includes(p.snakeHat ?? "") ? p.snakeHat! : "none";
        delete (p as { wallpaper?: unknown }).wallpaper; // retired setting: the snake wallpaper is the only one
        if (p.dockSize && !(DOCK_SIZE.stops as readonly number[]).includes(p.dockSize)) p.dockSize = DOCK_SIZE.default; // old free-slider values snap back
        if (p.saver && !SAVER_IDS.includes(p.saver)) p.saver = "duel";
        if ((p as { iconLayout?: number }).iconLayout !== ICON_LAYOUT) p.iconPos = {}; // the desktop was re-arranged
        return { ...current, ...p, snakeHat };
      },
    }
  )
);
