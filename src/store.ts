import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppId =
  | "projects"
  | "about"
  | "resume"
  | "readme"
  | "prefs"
  | "snake"
  | "project-detail";

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

export type Wallpaper = "snake" | "clean" | "noir";

interface OSState {
  windows: Record<string, WinInstance>;
  order: string[]; // z-order, last = front
  iconPos: Record<string, { x: number; y: number }>;
  wallpaper: Wallpaper;
  snakeBest: number;
  booted: boolean;
  seq: number;

  open: (app: AppId, opts?: Partial<Pick<WinInstance, "title" | "payload" | "w" | "h">>) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, w: number, h: number) => void;
  toggleMax: (id: string) => void;
  setIconPos: (key: string, x: number, y: number) => void;
  setWallpaper: (w: Wallpaper) => void;
  setSnakeBest: (n: number) => void;
  setBooted: () => void;
  resetDesktop: () => void;
}

const DEFAULT_SIZE: Record<AppId, { w: number; h: number }> = {
  projects: { w: 660, h: 520 },
  about: { w: 500, h: 420 },
  resume: { w: 460, h: 400 },
  readme: { w: 540, h: 470 },
  prefs: { w: 460, h: 430 },
  snake: { w: 424, h: 434 },
  "project-detail": { w: 480, h: 380 },
};

export const useOS = create<OSState>()(
  persist(
    (set, get) => ({
      windows: {},
      order: [],
      iconPos: {},
      wallpaper: "snake",
      snakeBest: 0,
      booted: false,
      seq: 1,

      open: (app, opts) => {
        const s = get();
        // single-instance apps: focus if already open (project-detail keyed by payload)
        const existing = Object.values(s.windows).find(
          (w) => w.app === app && (app !== "project-detail" || w.payload === opts?.payload)
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
          maximized: false,
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

      setIconPos: (key, x, y) =>
        set({ iconPos: { ...get().iconPos, [key]: { x, y } } }),

      setWallpaper: (wallpaper) => set({ wallpaper }),
      setSnakeBest: (snakeBest) => set({ snakeBest }),
      setBooted: () => set({ booted: true }),

      resetDesktop: () =>
        set({ windows: {}, order: [], iconPos: {}, wallpaper: "snake" }),
    }),
    {
      name: "eric-os-v1",
      partialize: (s) => ({
        windows: s.windows,
        order: s.order,
        iconPos: s.iconPos,
        wallpaper: s.wallpaper,
        snakeBest: s.snakeBest,
        seq: s.seq,
      }),
    }
  )
);
