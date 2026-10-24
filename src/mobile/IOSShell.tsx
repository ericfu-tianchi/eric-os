import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useOS, type WinInstance } from "../store";
import { mediaItem } from "../data/media";
import { PROJECTS } from "../data/projects";
import { MiniHead } from "../components/SnakeGuide";
import portrait from "../assets/about/portrait.webp";
import { ALBUMS, HOME, HOME_FOLDERS, appKey, type HomeItem, type Route } from "./model";
import { AppTile, ItemTile } from "./icons";
import { AppState, NavBar, NavContext, type Nav, type Screen } from "./nav";
import { screenFor } from "./routes";
import { currentWallpaper, headDir, type Cell, type Wallpaper } from "./wallpapers";
import { SnakeHead, angleOf } from "./SnakeHead";
import { SnakeGame } from "./SnakeGame";
import "./ios.css";

/**
 * Tianchi OS for phones: the desktop is macOS-shaped, the phone is iOS-shaped.
 * Same content files, its own shell. Lock Screen → Home (two pages + Dock) → apps that open full screen,
 * each with its own navigation stack. Every way back works: the Back / Home button in the bar,
 * the home indicator (tap or drag up), an edge swipe, and the browser's own back.
 */

type App = { key: string; route: Route; stack: Screen[]; opener?: string };
let seq = 0;
const sk = () => `s${++seq}`;
const EASE = "cubic-bezier(.2,.9,.25,1)";

/** A critically damped spring sampled into a CSS linear() curve: the motion iOS uses for app launch / close.
    No overshoot, so the app never undershoots the icon and snaps back on the last frame. */
function springEasing(damping = 1, response = 0.34, dur = 0.5) {
  const w = (2 * Math.PI) / response, wd = w * Math.sqrt(Math.max(0, 1 - damping * damping));
  const pts: string[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = (i / 48) * dur;
    const x = wd < 1e-6
      ? 1 - Math.exp(-w * t) * (1 + w * t) // critically damped
      : 1 - Math.exp(-damping * w * t) * (Math.cos(wd * t) + ((damping * w) / wd) * Math.sin(wd * t));
    pts.push(Math.min(1, x / 0.996).toFixed(4)); // the last 0.4% would land below a pixel: arrive exactly, a few frames early, and rest there
  }
  return `linear(${pts.join(",")})`;
}
const SPRING_MS = 500;
const SPRING = typeof CSS !== "undefined" && CSS.supports("transition-timing-function", "linear(0, 1)") ? springEasing() : "cubic-bezier(.2,.95,.25,1)";
const LOCK_KEY = "eric-os-phone-unlocked";
/** Running apps kept in memory, like iOS: the oldest is closed when a new one opens past this. */
const MAX_APPS = 6;
/** Hosted games that stay loaded at once (the front one plus the last one you used); older ones reload when you return. */
const LIVE_GAMES = 2;
/** The Home Screen item for a running app: its icon and name in the app switcher. */
const ALL_ITEMS: HomeItem[] = [...HOME.page1, ...HOME.page2, ...HOME.dock, ...HOME_FOLDERS.flatMap((f) => (f.kind === "folder" ? f.items : [f]))];
const itemFor = (key: string) => ALL_ITEMS.find((i) => i.kind === "app" && i.id === key) as Extract<HomeItem, { kind: "app" }> | undefined;
const BANNER_KEY = "eric-os-phone-banner";
const isTouch = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
const session = { get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return "1"; } }, set: (k: string) => { try { sessionStorage.setItem(k, "1"); } catch { /* private mode */ } } };

/* ---------------- wallpaper ---------------- */

/** The wallpaper snake: cells on the Home grid. `x0`/`y0` = the pixel position of canvas col 0 / the bottom line of the free area. */
function WallArt({ art, cols, c, x0, bottom }: { art: Wallpaper; cols: [number, number]; c: number; x0: number; bottom: number }) {
  const at = ([x, y]: Cell) => ({ left: x0 + (x - cols[0]) * c, top: bottom - (y + 1) * c, width: c, height: c });
  const inView = (p: Cell) => p[0] >= cols[0] && p[0] <= cols[1];
  const head = art.cells[art.cells.length - 1], [dx, dy] = headDir(art.cells);
  return (
    <div className="ios-art" aria-hidden>
      {art.cells.slice(0, -1).filter(inView).map((p, i) => <i key={i} style={at(p)} />)}
      {inView(head) && <><i style={at(head)} /><SnakeHead size={c} ang={angleOf(dx, -dy)} style={{ left: at(head).left - c, top: at(head).top - c }} /></>}
      {art.apples.filter(inView).map((p, i) => <em key={i} className="apple" style={at(p)} />)}
    </div>
  );
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 15_000); return () => window.clearInterval(t); }, []);
  return now;
}
const hhmm = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false });

function StatusBar({ tone }: { tone: "light" | "dark" }) {
  const now = useClock();
  return (
    <div className={`ios-status ${tone}`} aria-hidden>
      <span>{hhmm(now)}</span>
      <span className="r">
        <svg viewBox="0 0 18 12" width="18" height="12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <span className="batt"><i /></span>
      </span>
    </div>
  );
}

/* ---------------- the shell ---------------- */

export function IOSShell() {
  const framed = typeof window !== "undefined" && window.innerWidth > 500; // desktop preview (?ios) draws a phone
  const device = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 393, h: 852 });
  const [zoom, setZoom] = useState(1);
  const [locked, setLocked] = useState(() => !session.get(LOCK_KEY));
  const [apps, setApps] = useState<App[]>([]);
  const [front, setFront] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [folder, setFolder] = useState<Extract<HomeItem, { kind: "folder" }> | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; at: { x: number; y: number; w: number }; item: Extract<HomeItem, { kind: "app" }> } | null>(null);
  const [sheet, setSheet] = useState(false);
  const [banner, setBanner] = useState(false);
  const [anim, setAnim] = useState<{ kind: "push" | "pop"; app: string } | null>(null);
  const [switcher, setSwitcher] = useState(false);
  /** the Snake easter egg: Home itself becomes the board, starting from the wallpaper snake */
  const [snake, setSnake] = useState(false);
  const snakeRef = useRef(snake); snakeRef.current = snake;
  const switcherRef = useRef(switcher); switcherRef.current = switcher;
  const appsRef = useRef(apps); appsRef.current = apps;
  const frontRef = useRef(front); frontRef.current = front;
  const zoomRef = useRef(zoom); zoomRef.current = zoom;
  const depth = useRef(0); // history entries we pushed and haven't popped
  const skipPop = useRef(0);

  // the page behind the shell: same color (browsers tint their bars from it), no rubber band
  useEffect(() => {
    const r = document.documentElement, b = document.body;
    r.style.background = b.style.background = "#111214";
    r.style.overscrollBehavior = b.style.overscrollBehavior = "none";
  }, []);

  // device size + safe areas → the grid, and the desktop-preview zoom
  const [insets, setInsets] = useState({ top: 0, bot: 0 });
  useLayoutEffect(() => {
    const f = () => {
      const el = device.current; if (!el) return;
      setSize({ w: el.offsetWidth, h: el.offsetHeight });
      const pt = el.querySelector<HTMLElement>(".ios-probe.t"), pb = el.querySelector<HTMLElement>(".ios-probe.b");
      setInsets({ top: pt?.offsetHeight ?? 0, bot: pb?.offsetHeight ?? 0 });
      setZoom(framed ? Math.min(1, (window.innerHeight - 92) / 852) : 1);
    };
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, [framed]);
  /**
   * One grid for the whole phone: 12 columns, offset by half a cell so icons, widgets and the Dock sit exactly on its lines.
   * Columns: ½ margin · 4 icons of 2 cells with 1-cell gaps · ½ margin. Rows are anchored so the Dock's bottom edge lands
   * on a line just above the home bar; content starts on the first line below the status bar.
   */
  const cell = size.w / 12;
  const gx = cell / 2;
  const dockBottom = size.h - insets.bot - 34;
  const gy = ((dockBottom % cell) + cell) % cell;
  const dockTop = dockBottom - cell * 3;
  const padTop = gy + Math.ceil((insets.top + 10 - gy) / cell) * cell;
  const freeBottom = dockTop - cell; // the row above the Dock holds the page dots
  const freeRows = Math.round((freeBottom - padTop) / cell);
  const widgetRows = freeRows >= 13 ? 5 : freeRows >= 11 ? 4 : 3; // the About widget shrinks on short screens
  const art = useMemo(currentWallpaper, []);


  const frontApp = apps.find((a) => a.key === front) ?? null;
  const top = frontApp?.stack[frontApp.stack.length - 1];

  /* ---------- geometry + flights ---------- */

  const layerOf = (key: string) => device.current?.querySelector<HTMLElement>(`.ios-layer[data-app="${CSS.escape(key)}"]`) ?? null;
  // an open folder wins: an app launched from a folder flies back into it
  const iconOf = (key: string) => {
    const k = CSS.escape(key), d = device.current;
    return d?.querySelector(`.ios-folder [data-id="${k}"] .ios-ic`) ?? d?.querySelector(`.ios-home [data-id="${k}"] .ios-ic, .ios-home .ios-widget[data-id="${k}"]`) ?? null;
  };
  const rectIn = (el: Element) => {
    const d = device.current!.getBoundingClientRect(), r = el.getBoundingClientRect(), z = zoomRef.current;
    return { x: (r.left - d.left) / z, y: (r.top - d.top) / z, w: r.width / z, h: r.height / z };
  };
  /**
   * The app grows out of its icon (in) or shrinks back into it (out), the way iOS does it:
   * one spring drives position, size and corner radius together; the corners end exactly on the icon's
   * squircle; a copy of the icon rides inside the shrinking app and fades up over the last part, so the
   * app has already become the icon when it lands. The real icon stays hidden until then: no swap, no pop.
   */
  const flight = (el: HTMLElement, from: Element | null | undefined, dir: "in" | "out", done?: () => void) => {
    const W = el.offsetWidth, H = el.offsetHeight;
    const live = { transform: el.style.transform || "none", borderRadius: el.style.borderRadius || "0px" }; // where a drag left it
    el.style.transform = ""; el.style.borderRadius = ""; el.style.transition = "";
    const target = from && from.isConnected && (from as HTMLElement).offsetParent !== null ? (from as HTMLElement) : null;
    const full = { transform: "none", borderRadius: framed ? "55px" : "0px" };
    if (!target) {
      const away = { transform: "translate3d(0,24px,0) scale(.9)", opacity: 0 };
      const a = el.animate(dir === "in" ? [away, { ...full, opacity: 1 }] : [{ ...live, opacity: 1 }, away], { duration: 300, easing: EASE, fill: dir === "out" ? "forwards" : "none" });
      a.onfinish = () => done?.();
      return;
    }
    let r = rectIn(target);
    const home = target.closest<HTMLElement>(".ios-home");
    if (home && dir === "out") {
      const m = getComputedStyle(home).transform; // matrix(s,0,0,s,0,0) while it settles back to 1
      const sc = m && m !== "none" ? parseFloat(m.slice(7)) || 1 : 1;
      const ox = W / 2, oy = H / 2;
      r = { x: ox + (r.x - ox) / sc, y: oy + (r.y - oy) / sc, w: r.w / sc, h: r.h / sc };
    }
    const cs = getComputedStyle(target).borderTopLeftRadius;
    const rad = cs.endsWith("%") ? (parseFloat(cs) / 100) * r.w : parseFloat(cs) || r.w * 0.225;
    const small = {
      transform: `translate3d(${r.x}px, ${r.y}px, 0) scale(${r.w / W}, ${r.h / H})`,
      borderRadius: `${(rad * W) / r.w}px / ${(rad * H) / r.h}px`,
    };
    // the icon copy: drawn at icon size, stretched to the app's box, so the app's own scale squeezes it back to exactly the icon
    const ghost = document.createElement("div");
    ghost.className = "ios-ghost";
    ghost.style.width = `${r.w}px`; ghost.style.height = `${r.h}px`;
    ghost.style.transform = `scale(${W / r.w}, ${H / r.h})`;
    const copy = target.cloneNode(true) as HTMLElement;
    // keep the tile's own inline style (its background and glyph scale live there): the copy must be opaque, exactly the icon; square corners, the app's own clip rounds it (two anti-aliased edges let the page bleed through)
    Object.assign(copy.style, { width: "100%", height: "100%", margin: "0", borderRadius: "0", boxShadow: "none", transform: "none", transition: "none", opacity: "1", visibility: "visible" });
    ghost.appendChild(copy);
    el.appendChild(ghost);
    el.style.transformOrigin = "0 0";
    target.style.visibility = "hidden";
    const opts = { duration: SPRING_MS, easing: SPRING, fill: "forwards" as FillMode };
    const a = el.animate(dir === "in" ? [small, full] : [{ ...live, transformOrigin: "0 0" }, small], opts);
    ghost.animate(dir === "in"
      ? [{ opacity: 1 }, { opacity: 0, offset: 0.22 }, { opacity: 0 }]
      : live.transform !== "none" // let go mid-drag: the app is already small, so it turns into the icon sooner
        ? [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1 }]
        : [{ opacity: 0 }, { opacity: 0, offset: 0.08 }, { opacity: 1, offset: 0.42 }, { opacity: 1 }], { duration: SPRING_MS, easing: "linear", fill: "forwards" });
    a.onfinish = () => {
      if (dir === "out") done?.(); // hides the app in this same frame…
      target.style.visibility = ""; // …as the real icon comes back
      ghost.remove();
      el.style.transformOrigin = "";
      if (dir === "in") { el.getAnimations().forEach((x) => x.cancel()); done?.(); }
    };
  };

  const pushHistory = () => { history.pushState({ ios: depth.current + 1 }, ""); depth.current++; };

  /* ---------- open / push / back / home ---------- */

  const launch = (route: Route, from?: Element | null, fade = false) => {
    const key = appKey(route);
    setMenu(null); setSheet(false); setBanner(false);
    if (!from?.closest(".ios-folder")) setFolder(null); // launched from a folder: it stays open underneath, like iOS
    const opener = frontRef.current && frontRef.current !== key ? frontRef.current : undefined;
    const existing = appsRef.current.find((a) => a.key === key);
    // apps are kept most-recent-last; past MAX_APPS the oldest one quietly closes
    setApps((xs) => {
      const next = existing ? [...xs.filter((a) => a.key !== key), { ...existing, opener }] : [...xs, { key, route, stack: [{ key: sk(), ...screenFor(route) }], opener }];
      return next.length > MAX_APPS ? next.slice(next.length - MAX_APPS) : next;
    });
    setFront(key);
    pushHistory();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const el = layerOf(key); if (!el) return;
      el.hidden = false;
      if (fade) { // from the wallpaper: the board fades in around a snake that never moves, so Home must not move either
        const home = device.current?.querySelector<HTMLElement>(".ios-home");
        if (home) { home.style.transform = "none"; window.setTimeout(() => { home.style.transform = ""; }, 360); }
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: "ease-out" });
        return;
      }
      flight(el, from, "in"); homeTo(true);
    }));
  };
  const open = (route: Route, from?: Element | null) => {
    if (route.app === "snake") { // Snake isn't an app here: Home turns into the board
      setMenu(null); setFolder(null); setSheet(false); setBanner(false);
      if (frontRef.current) { goHome(); window.setTimeout(enterSnake, SPRING_MS + 60); } else enterSnake();
      return;
    }
    // keyboard games: ask first on touch screens
    if (route.app === "game" && route.id === "soul-blade" && isTouch()) { setMenu(null); setFolder(null); setSheet(true); return; }
    launch(route, from);
  };

  const push = (s: Omit<Screen, "key">) => {
    const k = frontRef.current; if (!k) return;
    setApps((xs) => xs.map((a) => (a.key === k ? { ...a, stack: [...a.stack, { key: sk(), ...s }] } : a)));
    setAnim({ kind: "push", app: k });
    window.setTimeout(() => setAnim(null), 430);
    pushHistory();
  };

  /**
   * Going Home touches only the DOM while anything moves: a React render in the first or the last frame
   * of the flight is exactly the "stuck frame" you see on a phone. State catches up after the landing has painted.
   */
  /** Home's scale rides the same spring as the app, frame for frame, so the icon the app is landing on never moves under it */
  const homeTo = (behind: boolean) => {
    const home = device.current?.querySelector<HTMLElement>(".ios-home"); if (!home) return;
    const from = getComputedStyle(home).transform;
    home.style.transform = ""; home.style.transition = "";
    home.classList.toggle("behind", behind);
    home.animate([{ transform: from === "none" ? "scale(1)" : from }, { transform: behind ? "scale(.94)" : "scale(1)" }], { duration: SPRING_MS, easing: SPRING });
    const dim = device.current?.querySelector<HTMLElement>(".ios-dim"); // the dim rides the same spring from wherever the finger left it
    if (dim) { const o = getComputedStyle(dim).opacity; dim.style.transition = ""; dim.style.opacity = ""; dim.classList.toggle("on", behind); dim.animate([{ opacity: o }, { opacity: behind ? 0.45 : 0 }], { duration: SPRING_MS, easing: SPRING }); }
  };
  const toHome = (k: string) => {
    const el = layerOf(k);
    const finish = () => {
      if (el) { el.hidden = true; el.getAnimations().forEach((a) => a.cancel()); }
      window.setTimeout(() => { if (frontRef.current === k) setFront(null); }, 120);
    };
    if (el) flight(el, iconOf(k), "out", finish); else finish(); // flight measures the icon with Home where it is now…
    homeTo(false); // …then Home and the app move together
  };

  /** Home: drop the history entries we added (keeping an open folder's), and fly the app back into its icon */
  const folderRef = useRef(folder); folderRef.current = folder;
  const goHome = () => {
    const k = frontRef.current;
    const keep = k && folderRef.current ? 1 : 0; // an app opened from a folder returns to that folder
    if (depth.current > keep) { skipPop.current++; history.go(-(depth.current - keep)); depth.current = keep; }
    if (k) toHome(k); else { if (folderRef.current && depth.current > 0) { skipPop.current++; history.back(); depth.current--; } setFolder(null); }
  };

  /** one level back: a screen, else the app (to the app that opened it, else Home) */
  const backOne = () => {
    const k = frontRef.current;
    if (!k) { setFolder(null); setMenu(null); return; }
    const app = appsRef.current.find((a) => a.key === k);
    if (!app) return;
    if (app.stack.length > 1) {
      setAnim({ kind: "pop", app: k });
      window.setTimeout(() => { setApps((xs) => xs.map((a) => (a.key === k ? { ...a, stack: a.stack.slice(0, -1) } : a))); setAnim(null); }, 340);
      return;
    }
    const opener = app.opener && appsRef.current.some((a) => a.key === app.opener) ? app.opener : null;
    if (opener) {
      const el = layerOf(k);
      setFront(opener);
      // keep the leaving app drawn on top while it slides away
      if (el) { el.hidden = false; el.style.zIndex = "40"; el.animate([{ transform: "none" }, { transform: "translate3d(100%,0,0)" }], { duration: 340, easing: EASE }).onfinish = () => { el.style.zIndex = ""; el.hidden = frontRef.current !== k; }; }
    } else toHome(k);
  };

  // the browser's back (Android back button, Safari's edge swipe) = one level back
  const backRef = useRef(backOne); backRef.current = backOne;
  const switcherHomeRef = useRef(() => {});
  useEffect(() => {
    const onPop = () => {
      if (skipPop.current > 0) { skipPop.current--; return; }
      if (switcherRef.current) { depth.current = Math.max(0, depth.current - 1); switcherHomeRef.current(); return; }
      if (snakeRef.current) { depth.current = Math.max(0, depth.current - 1); exitSnakeRef.current(true); return; }
      if (depth.current > 0) depth.current--;
      backRef.current();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  /** our Back buttons go through history too, so the browser's stack stays in step */
  const back = () => { if (depth.current > 0) history.back(); else backOne(); };

  const fns = useRef({ open, push, back, goHome }); fns.current = { open, push, back, goHome };
  const nav: Nav = useMemo(() => ({
    open: (r, from) => fns.current.open(r, from),
    push: (s) => fns.current.push(s),
    pop: () => fns.current.back(),
    home: () => fns.current.goHome(),
  }), []);

  /* ---------- desktop components still call the desktop's open() (About → a folder, …): route them here ---------- */
  const order = useOS((s) => s.order);
  const seen = useRef(new Set(useOS.getState().order));
  useEffect(() => {
    const { windows, close } = useOS.getState();
    order.filter((id) => !seen.current.has(id)).forEach((id) => {
      seen.current.add(id);
      const r = routeForWindow(windows[id]);
      close(id);
      if (r) nav.open(r);
    });
  }, [order, nav]);

  /* ---------- lock screen ---------- */
  const introHome = useMemo(() => !!session.get(LOCK_KEY), []); // already unlocked this visit: Home just zooms in on load
  const unlock = () => { session.set(LOCK_KEY); setLocked(false); };
  const lockDrag = useRef<{ y: number; t: number; ly: number; lt: number; v: number } | null>(null);
  /** one gesture drives both layers: the lock slides up 1:1 with the finger, Home zooms in from 1.08 and fades up underneath */
  const lockPose = (dy: number, t = "") => {
    const lock = device.current?.querySelector<HTMLElement>(".ios-lock"), home = device.current?.querySelector<HTMLElement>(".ios-home");
    const p = Math.min(1, -dy / (size.h * 0.55));
    if (lock) { lock.style.transition = t ? `transform ${t}` : "none"; lock.style.transform = `translate3d(0, ${dy}px, 0)`; }
    if (home) { home.style.transition = t ? `transform ${t}, opacity ${t}` : "none"; home.style.opacity = String(p); home.style.transform = `scale(${1.08 - 0.08 * p})`; }
    const bar = device.current?.querySelector<HTMLElement>(".ios-homebar"); if (bar) { bar.style.transition = t ? `transform ${t}` : "none"; bar.style.transform = `translate3d(0, ${Math.max(dy * 0.18, -26)}px, 0)`; }
  };
  const lockDown = (e: React.PointerEvent) => {
    const d = device.current!.getBoundingClientRect(), y = (e.clientY - d.top) / zoom;
    if (y < size.h - Math.max(140, size.h * 0.18)) { // not from the bottom: the home bar breathes harder to show where to start
      const bar = device.current?.querySelector<HTMLElement>(".ios-homebar i"); bar?.animate([{ transform: "scaleX(1)" }, { transform: "scaleX(1.25)", opacity: 1 }, { transform: "scaleX(1)" }], { duration: 520, easing: "ease-in-out" });
      return;
    }
    const n = Date.now(); lockDrag.current = { y: e.clientY, t: n, ly: e.clientY, lt: n, v: 0 }; (e.currentTarget as Element).setPointerCapture(e.pointerId); };
  const lockMove = (e: React.PointerEvent) => {
    const s = lockDrag.current; if (!s) return;
    const n = Date.now(); s.v = ((e.clientY - s.ly) / zoom) / Math.max(1, n - s.lt); s.ly = e.clientY; s.lt = n;
    const raw = (e.clientY - s.y) / zoom;
    lockPose(raw < 0 ? raw : raw * 0.12); // a little give downwards, like a rubber band
  };
  const lockUp = (e: React.PointerEvent) => {
    const s = lockDrag.current; lockDrag.current = null; if (!s) return;
    const dy = (e.clientY - s.y) / zoom;
    const T = `${SPRING_MS}ms ${SPRING}`;
    if (dy < -size.h * 0.16 || (dy < -24 && s.v < -0.35)) { // far enough, or flicked: finish the same motion
      lockPose(-size.h, T);
      window.setTimeout(() => {
        const home = device.current?.querySelector<HTMLElement>(".ios-home"), bar = device.current?.querySelector<HTMLElement>(".ios-homebar");
        [home, bar].forEach((x) => { if (x) { x.style.transition = ""; x.style.transform = ""; x.style.opacity = ""; } });
        unlock();
      }, SPRING_MS);
    } else lockPose(0, `${380}ms ${EASE}`); // not far enough: everything settles back
  };

  // the snake says hi once, a while after you land on Home
  useEffect(() => {
    if (locked || session.get(BANNER_KEY)) return;
    const a = window.setTimeout(() => { if (!frontRef.current) { setBanner(true); session.set(BANNER_KEY); } }, 6000);
    return () => window.clearTimeout(a);
  }, [locked]);
  useEffect(() => { if (!banner) return; const t = window.setTimeout(() => setBanner(false), 7000); return () => window.clearTimeout(t); }, [banner]);

  /* ---------- Home: two pages that follow the finger ---------- */
  const pg = useRef<{ x: number; y: number; t: number; axis?: "x" | "y" } | null>(null);
  const pagesEl = useRef<HTMLDivElement>(null);
  const suppressTap = useRef(false);
  const placePages = (p: number, dx = 0, animate = false) => {
    const el = pagesEl.current; if (!el) return;
    el.style.transition = animate ? `transform .46s ${EASE}` : "none";
    el.style.transform = `translate3d(${-p * size.w + dx}px,0,0)`;
  };
  const firstPlace = useRef(true);
  useLayoutEffect(() => { placePages(page, 0, !firstPlace.current); firstPlace.current = false; }, [page, size.w]); // eslint-disable-line react-hooks/exhaustive-deps
  const pageDown = (e: React.PointerEvent) => { pg.current = { x: e.clientX, y: e.clientY, t: Date.now() }; suppressTap.current = false; };
  const pageMove = (e: React.PointerEvent) => {
    const s = pg.current; if (!s) return;
    const dx = (e.clientX - s.x) / zoom, dy = (e.clientY - s.y) / zoom;
    if (!s.axis && Math.hypot(dx, dy) > 10) { s.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"; suppressTap.current = true; window.clearTimeout(press.current); }
    if (s.axis === "x") placePages(page, (page === 0 && dx > 0) || (page === 1 && dx < 0) ? dx * 0.3 : dx);
  };
  const pageUp = (e: React.PointerEvent) => {
    const s = pg.current; pg.current = null; if (!s || s.axis !== "x") return;
    const dx = (e.clientX - s.x) / zoom, v = dx / Math.max(1, Date.now() - s.t);
    const next = (dx < -size.w / 4 || v < -0.3) && page === 0 ? 1 : (dx > size.w / 4 || v > 0.3) && page === 1 ? 0 : page;
    if (next === page) placePages(page, 0, true); else setPage(next);
  };

  /* ---------- icons: tap opens, long-press opens quick actions ---------- */
  const press = useRef(0);
  const iconProps = (item: HomeItem) => ({
    "data-id": item.kind === "app" ? appKey(item.route) : item.id,
    onPointerDown: (e: React.PointerEvent) => {
      if (item.kind !== "app" || !item.menu) return;
      const el = (e.currentTarget as Element).querySelector(".ios-ic")!;
      press.current = window.setTimeout(() => {
        suppressTap.current = true;
        const r = rectIn(el);
        navigator.vibrate?.(10);
        setMenu({ x: Math.min(Math.max(12, r.x - 4), size.w - 236), y: r.y + r.h + 130 > size.h - 120 ? r.y - 112 : r.y + r.h + 10, at: { x: r.x, y: r.y, w: r.w }, item });
      }, 450);
    },
    onPointerUp: () => window.clearTimeout(press.current),
    onPointerLeave: () => window.clearTimeout(press.current),
    onPointerCancel: () => window.clearTimeout(press.current),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    onClick: (e: React.MouseEvent) => {
      if (suppressTap.current) { suppressTap.current = false; return; }
      if (item.kind === "folder") { setFolder(item); pushHistory(); return; }
      open(item.route, e.currentTarget.querySelector(".ios-ic") ?? e.currentTarget);
    },
  });
  const icon = (item: HomeItem, dock?: boolean) => (
    <button type="button" key={item.id} className="ios-icon" aria-label={item.label} {...iconProps(item)}>
      <ItemTile item={item} />
      {!dock && <span className="lbl">{item.label}</span>}
    </button>
  );

  /* ---------- home indicator: tap = Home; drag up = the app shrinks under your finger;
     drag up and pause = the app switcher (from Home too, once an app has run) ---------- */
  const hb = useRef<{ x: number; y: number; t: number; ly: number; lt: number; vy: number; axis?: "x" | "y" } | null>(null);
  const hbDown = (e: React.PointerEvent) => {
    if (snakeRef.current) { hb.current = { x: e.clientX, y: e.clientY, t: Date.now(), ly: e.clientY, lt: Date.now(), vy: 0 }; (e.currentTarget as Element).setPointerCapture(e.pointerId); return; }
    if (switcherRef.current) { hb.current = { x: e.clientX, y: e.clientY, t: Date.now(), ly: e.clientY, lt: Date.now(), vy: 0 }; return; }
    if (!frontRef.current && !appsRef.current.length) return;
    hb.current = { x: e.clientX, y: e.clientY, t: Date.now(), ly: e.clientY, lt: Date.now(), vy: 0 };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const hbMove = (e: React.PointerEvent) => {
    const s = hb.current, k = frontRef.current; if (!s || switcherRef.current) return;
    if (snakeRef.current) { // the board lifts and shrinks under your finger, the icons start coming back
      const dy = Math.min(0, (e.clientY - s.y) / zoom), p = Math.min(1, -dy / 320);
      const ov = device.current?.querySelector<HTMLElement>(".ios-snake-home");
      if (ov) { ov.style.transition = "none"; ov.style.transform = `translate3d(0, ${dy * 0.35}px, 0) scale(${1 - p * 0.14})`; ov.style.opacity = String(1 - p * 0.55); }
      return;
    }
    const now = Date.now(); s.vy = ((e.clientY - s.ly) / zoom) / Math.max(1, now - s.lt); s.ly = e.clientY; s.lt = now;
    if (!k) { // on Home: Home recedes and dims, and the recent apps rise in as cards, all with the finger
      if (!appsRef.current.length) return;
      const dy = Math.min(0, (e.clientY - s.y) / zoom), p = Math.min(1, -dy / 260);
      const home = device.current?.querySelector<HTMLElement>(".ios-home"), dim = device.current?.querySelector<HTMLElement>(".ios-dim");
      if (home) { home.style.transition = "none"; home.style.transform = `scale(${1 - 0.06 * p})`; }
      if (dim) { dim.style.transition = "none"; dim.style.opacity = String(0.62 * p); }
      // the cards slide in from the left edge, as on iOS: the most recent one travels from just off-screen to the centre
      const g = swGeo(), off = g.x0 + g.cw + 12;
      recent().forEach((a, i) => {
        const el = layerOf(a.key); if (!el || i > 2) return;
        el.hidden = false; el.dataset.peek = "1";
        el.style.transition = "none"; el.style.transformOrigin = "0 0";
        el.style.transform = `translate3d(${g.x0 - i * g.step - off * (1 - p)}px, ${g.y}px, 0) scale(${SW})`;
        el.style.borderRadius = `${26 / SW}px`; el.style.opacity = "1";
      });
      return;
    }
    const rawX = (e.clientX - s.x) / zoom, rawY = (e.clientY - s.y) / zoom;
    if (!s.axis && Math.hypot(rawX, rawY) > 10) s.axis = Math.abs(rawX) > Math.abs(rawY) * 1.4 ? "x" : "y";
    const el = layerOf(k); if (!el) return;
    const W = el.offsetWidth, H = el.offsetHeight;
    if (s.axis === "x") { // slide along the bar: the previous app comes in from the left, like iOS
      const prev = recent()[1]; const pel = prev && layerOf(prev.key); if (!pel) return;
      const dx = Math.max(0, rawX);
      el.style.transition = pel.style.transition = "none";
      el.style.transform = `translate3d(${dx}px,0,0)`; pel.hidden = false; pel.dataset.slide = "1"; pel.style.transform = `translate3d(${dx - W - 10}px,0,0)`;
      return;
    }
    const dy = Math.min(0, rawY);
    const p = Math.min(1, -dy / 420), sc = 1 - p * 0.42;
    const tx = (W * (1 - sc)) / 2, ty = dy * 0.55 + (H * (1 - sc)) / 2;
    el.style.transition = "none";
    el.style.transformOrigin = "0 0"; // same origin the flight uses, so letting go continues from exactly here
    el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${sc})`;
    el.style.borderRadius = `${(framed ? 55 : 30) + p * 10}px`;
    // past a short way up, the apps you used before peek in from the left at the same size, as on iOS
    const fade = Math.max(0, Math.min(1, (p - 0.06) / 0.18));
    recent().slice(1, 3).forEach((a, i) => {
      const n = layerOf(a.key); if (!n) return;
      if (fade <= 0) { if (n.dataset.peek) { n.hidden = true; delete n.dataset.peek; n.style.cssText = ""; } return; }
      n.hidden = false; n.dataset.peek = "1";
      n.style.transition = "none"; n.style.transformOrigin = "0 0";
      n.style.transform = `translate3d(${tx - (i + 1) * (W * sc + 22)}px, ${ty}px, 0) scale(${sc})`;
      n.style.borderRadius = `${40 / Math.max(sc, 0.5)}px`; n.style.opacity = String(fade);
    });
    const home = device.current?.querySelector<HTMLElement>(".ios-home"), dim = device.current?.querySelector<HTMLElement>(".ios-dim");
    const q = Math.min(1, p * 1.7); // Home comes forward and brightens with your finger, done well before the top
    if (home) { home.style.transition = "none"; home.style.transform = `scale(${0.94 + 0.06 * q})`; }
    if (dim) { dim.style.transition = "none"; dim.style.opacity = String(0.45 * (1 - q)); }
  };
  const hbUp = (e: React.PointerEvent) => {
    const s = hb.current, k = frontRef.current; hb.current = null;
    if (!s) return;
    if (snakeRef.current) { // a tap, a flick or a long enough drag goes Home; a short one springs back
      const dy = (e.clientY - s.y) / zoom, v = dy / Math.max(1, Date.now() - s.t);
      const ov = device.current?.querySelector<HTMLElement>(".ios-snake-home");
      if (Math.abs(dy) < 6 || dy < -60 || v < -0.4) exitSnake();
      else if (ov) { ov.style.transition = `transform .3s ${EASE}, opacity .3s`; ov.style.transform = ""; ov.style.opacity = ""; }
      return;
    }
    const dy = (e.clientY - s.y) / zoom, v = dy / Math.max(1, Date.now() - s.t);
    const paused = Date.now() - s.lt > 90 || s.vy > -0.35; // the finger slowed down or stopped before letting go
    if (switcherRef.current) { if (Math.abs(dy) < 6) switcherHome(); return; }
    if (!k) {
      if (dy < -40 || (dy < -16 && s.vy < -0.3)) { enterSwitcher(); return; } // the peeking cards glide on into place
      // not far enough: Home comes back, the cards sink away
      const home = device.current?.querySelector<HTMLElement>(".ios-home"), dim = device.current?.querySelector<HTMLElement>(".ios-dim");
      const T = `.32s ${EASE}`;
      if (home) { home.style.transition = `transform ${T}`; home.style.transform = ""; }
      if (dim) { dim.style.transition = `opacity ${T}`; dim.style.opacity = ""; }
      const g = swGeo(), off = g.x0 + g.cw + 12; // not far enough: the cards slide back out to the left
      recent().forEach((a, i) => { const el = layerOf(a.key); if (!el?.dataset.peek) return; el.style.transition = `transform ${T}`; el.style.transform = `translate3d(${g.x0 - i * g.step - off}px, ${g.y}px, 0) scale(${SW})`; });
      window.setTimeout(() => {
        if (home) home.style.transition = ""; if (dim) dim.style.transition = "";
        appsRef.current.forEach((a) => { const el = layerOf(a.key); if (!el?.dataset.peek) return; delete el.dataset.peek; el.style.cssText = ""; el.hidden = a.key !== frontRef.current; });
      }, 330);
      return;
    }
    const el = layerOf(k);
    const home = device.current?.querySelector<HTMLElement>(".ios-home");
    if (s.axis === "x") { // finish or undo the slide to the previous app
      const prev = recent()[1], pel = prev && layerOf(prev.key), W = size.w, dx = Math.max(0, (e.clientX - s.x) / zoom);
      if (!el || !pel || !prev) return;
      const done = dx > W * 0.3 || dx / Math.max(1, Date.now() - s.t) > 0.5;
      const t = `transform .32s ${EASE}`;
      el.style.transition = pel.style.transition = t;
      el.style.transform = done ? `translate3d(${W + 10}px,0,0)` : ""; pel.style.transform = done ? "" : `translate3d(${-W - 10}px,0,0)`;
      window.setTimeout(() => {
        [el, pel].forEach((x) => { x.style.transition = ""; x.style.transform = ""; delete x.dataset.slide; });
        if (done) { setApps((xs) => [...xs.filter((a) => a.key !== prev.key), ...xs.filter((a) => a.key === prev.key)]); setFront(prev.key); }
        else pel.hidden = true;
      }, 330);
      return;
    }
    const peeks = appsRef.current.map((a) => layerOf(a.key)).filter((n): n is HTMLElement => !!n && !!n.dataset.peek);
    const dropPeeks = () => peeks.forEach((n) => { n.style.transition = "opacity .2s"; n.style.opacity = "0"; window.setTimeout(() => { if (!switcherRef.current) { n.hidden = n.dataset.app !== frontRef.current; n.style.cssText = ""; } delete n.dataset.peek; }, 220); });
    if (Math.abs(dy) < 6) { dropPeeks(); goHome(); }
    else if (dy < -60 && paused && appsRef.current.length) enterSwitcher(); // the dragged app becomes a card; peeking apps glide on into place
    else if (dy < -70 || v < -0.4) { dropPeeks(); goHome(); } // a flick: the flight picks up from the dragged pose
    else if (el) {
      dropPeeks();
      if (home) homeTo(true);
      el.style.transition = `transform .35s ${EASE}, border-radius .35s`; el.style.transform = "translate3d(0,0,0) scale(1)"; el.style.borderRadius = "";
      window.setTimeout(() => { el.style.transition = ""; el.style.transform = ""; el.style.transformOrigin = ""; }, 360);
    }
  };

  /* ---------- edge swipe: drag the screen off to the right to go back ---------- */
  const edge = useRef<{ x: number; t: number; top: HTMLElement; under: HTMLElement | null } | null>(null);
  const edgeDown = (e: React.PointerEvent) => {
    if (!frontApp || frontApp.stack.length < 2) return;
    if ((e.target as Element).closest("video, iframe, input, canvas")) return; // a video's scrubber or a game owns its own drags
    const x = (e.clientX - device.current!.getBoundingClientRect().left) / zoom;
    if (x > 24) return;
    const layer = layerOf(frontApp.key); if (!layer) return;
    const screens = layer.querySelectorAll<HTMLElement>(":scope > .ios-screen");
    edge.current = { x: e.clientX, t: Date.now(), top: screens[screens.length - 1], under: screens[screens.length - 2] ?? null };
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };
  const edgeMove = (e: React.PointerEvent) => {
    const s = edge.current; if (!s) return;
    const dx = Math.max(0, (e.clientX - s.x) / zoom);
    s.top.style.transition = "none"; s.top.style.transform = `translate3d(${dx}px,0,0)`;
    if (s.under) { s.under.style.transition = "none"; s.under.style.transform = `translate3d(${-size.w * 0.3 + dx * 0.3}px,0,0)`; s.under.style.visibility = "visible"; }
  };
  const edgeUp = (e: React.PointerEvent) => {
    const s = edge.current; edge.current = null; if (!s) return;
    const dx = (e.clientX - s.x) / zoom, v = dx / Math.max(1, Date.now() - s.t);
    const clean = () => [s.top, s.under].forEach((el) => { if (el) { el.style.transition = ""; el.style.transform = ""; el.style.visibility = ""; } });
    const ease = `transform .26s ${EASE}`;
    if (dx > size.w * 0.33 || v > 0.5) {
      s.top.style.transition = ease; s.top.style.transform = `translate3d(${size.w}px,0,0)`;
      if (s.under) { s.under.style.transition = ease; s.under.style.transform = "translate3d(0,0,0)"; }
      window.setTimeout(() => {
        const k = frontRef.current;
        setApps((xs) => xs.map((a) => (a.key === k ? { ...a, stack: a.stack.slice(0, -1) } : a)));
        if (depth.current > 0) { skipPop.current++; depth.current--; history.back(); }
        requestAnimationFrame(clean);
      }, 260);
    } else {
      s.top.style.transition = ease; s.top.style.transform = "";
      if (s.under) { s.under.style.transition = ease; s.under.style.transform = ""; }
      window.setTimeout(clean, 300);
    }
  };

  /* ---------- app switcher: swipe up from the bottom and pause ----------
     The cards are the running apps themselves, scaled down: no screenshots, nothing re-rendered.
     Everything moves on the compositor (transform + opacity) and React only renders when you enter or leave. */
  const SW = 0.62; // card scale
  const swPan = useRef(0); // 0 = the most recent app centered; 1 = the one before it, …
  const swGeo = () => {
    const cw = size.w * SW, ch = size.h * SW;
    return { cw, ch, step: cw + 22, x0: (size.w - cw) / 2, y: (size.h - ch) / 2 + 14 };
  };
  const recent = () => [...appsRef.current].reverse(); // most recent first
  /** place every card (and its label) for a pan position; `t` = transition, `lift` = one card dragged up */
  const placeCards = (pan: number, t = "", lift?: { key: string; dy: number }, list = recent()) => {
    const g = swGeo();
    list.forEach((a, i) => {
      const el = layerOf(a.key); if (!el) return;
      const x = g.x0 + (pan - i) * g.step, dy = lift?.key === a.key ? lift.dy : 0;
      el.hidden = false;
      el.style.transition = t ? `transform ${t}, border-radius ${t}, opacity ${t}` : "none";
      el.style.transformOrigin = "0 0";
      el.style.transform = `translate3d(${x}px, ${g.y + dy}px, 0) scale(${SW})`;
      el.style.borderRadius = `${26 / SW}px`;
      el.style.opacity = dy < 0 ? String(Math.max(0.2, 1 + dy / (g.ch * 1.4))) : "1";
      const lbl = device.current?.querySelector<HTMLElement>(`.ios-sw-label[data-app="${CSS.escape(a.key)}"]`);
      if (lbl) { lbl.style.transition = t ? `transform ${t}, opacity ${t}` : "none"; lbl.style.transform = `translate3d(${x}px, ${g.y - 36 + dy}px, 0)`; lbl.style.opacity = dy < 0 ? "0" : "1"; }
    });
  };
  const SW_T = `.42s ${EASE}`;
  const enterSwitcher = () => {
    if (!appsRef.current.length) return;
    setMenu(null); setFolder(null); setBanner(false);
    swPan.current = 0;
    setSwitcher(true);
    homeTo(true);
    const dim = device.current?.querySelector<HTMLElement>(".ios-dim");
    if (dim) { const o = getComputedStyle(dim).opacity; dim.animate([{ opacity: o }, { opacity: 0.62 }], { duration: SPRING_MS, easing: SPRING }); }
  };
  // first frame of the switcher: cards glide from wherever they are (a dragged app, or below the screen) into place
  useLayoutEffect(() => {
    if (!switcher) return;
    const g = swGeo();
    recent().forEach((a, i) => {
      const el = layerOf(a.key); if (!el || a.key === frontRef.current) return;
      if (el.dataset.peek) { delete el.dataset.peek; return; } // already peeking in from the drag: glide on from there
      el.hidden = false; el.style.transition = "none"; el.style.transformOrigin = "0 0";
      el.style.transform = `translate3d(${g.x0 - i * g.step}px, ${size.h}px, 0) scale(${SW})`; el.style.borderRadius = `${26 / SW}px`;
    });
    device.current?.offsetWidth; // commit the start poses before the transition
    placeCards(0, SW_T);
  }, [switcher]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearCard = (el: HTMLElement) => { el.style.transition = ""; el.style.transform = ""; el.style.transformOrigin = ""; el.style.borderRadius = ""; el.style.opacity = ""; };
  /** tap a card: it grows back to full screen and becomes the front app */
  const switchTo = (key: string) => {
    const el = layerOf(key); if (!el) return;
    el.style.zIndex = "41";
    el.style.transition = `transform ${SW_T}, border-radius ${SW_T}`;
    el.style.transform = "translate3d(0,0,0) scale(1)"; el.style.borderRadius = framed ? "55px" : "0px";
    device.current?.querySelectorAll<HTMLElement>(".ios-sw-label").forEach((l) => { l.style.transition = "opacity .2s"; l.style.opacity = "0"; });
    window.setTimeout(() => {
      appsRef.current.forEach((a) => { const l = layerOf(a.key); if (l) { clearCard(l); l.style.zIndex = ""; l.hidden = a.key !== key; } });
      setApps((xs) => [...xs.filter((a) => a.key !== key), ...xs.filter((a) => a.key === key)]);
      setFront(key); setSwitcher(false);
    }, 430);
  };
  /** tap outside the cards, or the home bar: back to Home */
  const switcherHome = () => {
    recent().forEach((a, i) => {
      const el = layerOf(a.key); if (!el) return;
      const g = swGeo();
      el.style.transition = `transform .34s ${EASE}, opacity .26s`;
      el.style.transform = `translate3d(${g.x0 + (swPan.current - i) * g.step}px, ${g.y + 60}px, 0) scale(${SW * 0.92})`; el.style.opacity = "0";
    });
    device.current?.querySelectorAll<HTMLElement>(".ios-sw-label").forEach((l) => { l.style.transition = "opacity .2s"; l.style.opacity = "0"; });
    homeTo(false);
    if (depth.current > 0) { skipPop.current++; history.go(-depth.current); depth.current = 0; }
    window.setTimeout(() => {
      appsRef.current.forEach((a) => { const l = layerOf(a.key); if (l) { clearCard(l); l.hidden = true; } });
      setFront(null); setSwitcher(false);
    }, 340);
  };
  switcherHomeRef.current = switcherHome;
  /** flick a card up: the app quits */
  const closeApp = (key: string) => {
    const el = layerOf(key);
    if (el) { el.style.transition = `transform .3s ${EASE}, opacity .3s`; el.style.transform = `translate3d(${el.style.transform.match(/translate3d\(([-\d.]+)px/)?.[1] ?? 0}px, ${-size.h * 0.7}px, 0) scale(${SW})`; el.style.opacity = "0"; }
    window.setTimeout(() => {
      const left = appsRef.current.filter((a) => a.key !== key);
      if (frontRef.current === key) setFront(null);
      setApps(left);
      if (!left.length) { swPan.current = 0; switcherHome(); return; }
      swPan.current = Math.min(swPan.current, left.length - 1);
      requestAnimationFrame(() => placeCards(swPan.current, SW_T, undefined, [...left].reverse())); // the cards close the gap (state hasn't caught up yet)
    }, 280);
  };
  const swDrag = useRef<{ x: number; y: number; t: number; pan: number; key: string | null; axis?: "x" | "y"; vx: number; vy: number; lx: number; ly: number; lt: number } | null>(null);
  const cardAt = (cx: number, cy: number) => {
    const d = device.current!.getBoundingClientRect(), z = zoomRef.current, g = swGeo();
    const x = (cx - d.left) / z, y = (cy - d.top) / z;
    if (y < g.y - 40 || y > g.y + g.ch) return null;
    return recent().find((_, i) => { const l = g.x0 + (swPan.current - i) * g.step; return x >= l && x <= l + g.cw; })?.key ?? null;
  };
  const swDown = (e: React.PointerEvent) => {
    swDrag.current = { x: e.clientX, y: e.clientY, t: Date.now(), pan: swPan.current, key: cardAt(e.clientX, e.clientY), vx: 0, vy: 0, lx: e.clientX, ly: e.clientY, lt: Date.now() };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const swMove = (e: React.PointerEvent) => {
    const s = swDrag.current; if (!s) return;
    const dx = (e.clientX - s.x) / zoom, dy = (e.clientY - s.y) / zoom, now = Date.now();
    const dt = Math.max(1, now - s.lt); s.vx = ((e.clientX - s.lx) / zoom) / dt; s.vy = ((e.clientY - s.ly) / zoom) / dt; s.lx = e.clientX; s.ly = e.clientY; s.lt = now;
    if (!s.axis && Math.hypot(dx, dy) > 8) s.axis = Math.abs(dx) > Math.abs(dy) || !s.key ? "x" : "y";
    const n = appsRef.current.length, g = swGeo();
    if (s.axis === "x") {
      let pan = s.pan + dx / g.step;
      if (pan < 0) pan *= 0.3; else if (pan > n - 1) pan = n - 1 + (pan - (n - 1)) * 0.3; // rubber band at the ends
      swPan.current = pan; placeCards(pan);
    } else if (s.axis === "y" && s.key) placeCards(swPan.current, "", { key: s.key, dy: Math.min(0, dy) + Math.max(0, dy) * 0.15 });
  };
  const swUp = (e: React.PointerEvent) => {
    const s = swDrag.current; swDrag.current = null; if (!s) return;
    const dy = (e.clientY - s.y) / zoom, n = appsRef.current.length;
    if (!s.axis) { if (s.key) switchTo(s.key); else switcherHome(); return; }
    if (s.axis === "x") {
      const target = Math.round(Math.max(0, Math.min(n - 1, swPan.current + s.vx * 0.9))); // a flick carries to the next card
      swPan.current = target; placeCards(target, SW_T);
    } else if (s.key) {
      if (dy < -swGeo().ch * 0.3 || s.vy < -0.5) closeApp(s.key);
      else placeCards(swPan.current, SW_T);
    }
  };

  /* ---------- Snake on Home: the icons clear away in a ripple from the snake's head, then Home is the board ----------
     iOS-style: each item shrinks and fades on one spring, a few ms later the farther it is from the head. Leaving plays it backwards. */
  const SNAKE_IN = 420; // ms until the last item is gone and the apple blinks in
  const homeItems = () => {
    const d = device.current; if (!d) return [];
    return [...d.querySelectorAll<HTMLElement>(".ios-home .page:first-child .ios-widget, .ios-home .page:first-child .ios-icon, .ios-dock .ios-icon, .ios-dock, .ios-dots")];
  };
  const ripple = (out: boolean) => {
    const d = device.current; if (!d) return;
    const dr = d.getBoundingClientRect(), z = zoomRef.current;
    const hx = startPose.cells.length ? gx + (startPose.cells[startPose.cells.length - 1][0] + 0.5) * cell : size.w / 2;
    const hy = startPose.cells.length ? gy + (startPose.cells[startPose.cells.length - 1][1] + 0.5) * cell : size.h / 2;
    homeItems().forEach((el) => {
      el.getAnimations().forEach((a) => a.cancel());
      const r = el.getBoundingClientRect(), cx = (r.left + r.width / 2 - dr.left) / z, cy = (r.top + r.height / 2 - dr.top) / z;
      const dist = Math.hypot(cx - hx, cy - hy) / Math.hypot(size.w, size.h); // 0 near the head … ~1 far away
      const gone = { opacity: 0, transform: "scale(.72)", filter: "blur(2px)" }, here = { opacity: 1, transform: "none", filter: "blur(0)" };
      el.animate(out ? [here, gone] : [gone, here], { duration: out ? 300 : 420, delay: (out ? dist : 1 - dist) * 140, easing: SPRING, fill: "both" });
    });
  };
  const enterSnake = () => {
    if (snakeRef.current) return;
    if (page !== 0) setPage(0);
    ripple(true);
    setSnake(true);
    history.pushState({ ios: depth.current + 1 }, ""); depth.current++;
  };
  /** back to Home: the board fades, the snake returns to the wallpaper, the icons ripple back in */
  const exitSnake = (fromPop = false) => {
    if (!snakeRef.current) return;
    const ov = device.current?.querySelector<HTMLElement>(".ios-snake-home");
    const done = () => {
      setSnake(false);
      ripple(false);
      window.setTimeout(() => homeItems().forEach((el) => el.getAnimations().forEach((a) => a.cancel())), 620);
    };
    if (ov) { ov.style.transition = "opacity .2s ease-out, transform .2s ease-out"; ov.style.opacity = "0"; window.setTimeout(done, 200); } else done();
    if (!fromPop && depth.current > 0) { skipPop.current++; history.back(); depth.current--; }
  };
  const exitSnakeRef = useRef(exitSnake); exitSnakeRef.current = exitSnake;
  const startPose = useMemo(() => {
    const rowOf = (y: number) => Math.round((freeBottom - (y + 1) * cell - gy) / cell); // canvas row → grid row from the top line
    const part = art.cells; // the whole snake: the page-2 body follows the head onto the board
    const apple = art.apples.find(([x]) => x <= 11);
    return { cells: part.map(([x, y]) => [x, rowOf(y)] as Cell), dir: headDir(art.cells), apple: apple ? [apple[0], rowOf(apple[1])] as Cell : undefined };
  }, [art, freeBottom, cell, gy]);

  /* ---------- widgets ---------- */

  /* which apps may keep heavy content alive: the newest LIVE_GAMES games */
  const liveGames = useMemo(() => new Set(apps.filter((a) => a.route.app === "game").slice(-LIVE_GAMES).map((a) => a.key)), [apps]);
  const stateCache = useRef(new Map<string, { shown: boolean; front: boolean; alive: boolean }>());
  const appState = (a: App) => {
    const v = { shown: a.key === front || switcher, front: a.key === front && !switcher, alive: a.route.app !== "game" || liveGames.has(a.key) };
    const old = stateCache.current.get(a.key);
    if (old && old.shown === v.shown && old.front === v.front && old.alive === v.alive) return old; // same object: no re-render of the app
    stateCache.current.set(a.key, v); return v;
  };

  const hat = useOS((s) => s.snakeHat);

  /* ---------- render ---------- */
  const now = useClock();
  const ink = locked || !top || top.tone !== "light" ? "light" : "dark";

  return (
    <div className={`ios-stage ${framed ? "framed" : "phone"}`}>
      <div className={`ios ${framed ? "framed" : "phone"} ${switcher ? "switching" : ""}`} ref={device} style={{ zoom, "--cell": `${cell}px`, "--gx": `${gx}px`, "--gy": `${gy}px`, "--pad-top": `${padTop}px`, "--dock-top": `${dockTop}px`, "--wrows": widgetRows } as React.CSSProperties}>
        <span className="ios-probe t" /><span className="ios-probe b" />
        <div className="ios-wall" aria-hidden />

        {/* Home */}
        <div className={`ios-home ${front || switcher ? "behind" : ""} ${locked ? "under-lock" : ""} ${introHome ? "intro" : ""} ${snake ? "snaking" : ""}`} aria-hidden={!!front || switcher || locked}
          onPointerDown={pageDown} onPointerMove={pageMove} onPointerUp={pageUp} onPointerCancel={pageUp}>
          <div className="pages" ref={pagesEl}>
            <section className="page" aria-label="Home page 1">
              <button type="button" className="ios-widget" data-id="about"
                onClick={(e) => { if (suppressTap.current) { suppressTap.current = false; return; } open({ app: "about" }, e.currentTarget); }}>
                <span className="txt">
                  <small><i />Now · AI PM · Singapore</small>
                  <b>Tianchi<br /><em>(Eric)</em> Fu</b>
                  <span>I turn what AI can do into products people enjoy.</span>
                </span>
                <img src={portrait} alt="" draggable={false} />
              </button>
              <div className="ios-grid">{HOME.page1.map((it) => icon(it))}</div>
            </section>
            <section className="page" aria-label="Home page 2">
              <div className="ios-grid">{HOME.page2.map((it) => icon(it))}</div>
            </section>
            <WallArt art={art} cols={[0, 23]} c={cell} x0={gx} bottom={freeBottom} />
          </div>
          <div className="ios-dots" role="tablist" aria-label="Home Screen pages">
            {[0, 1].map((i) => <button type="button" key={i} role="tab" aria-selected={page === i} aria-label={`Page ${i + 1}`} className={page === i ? "on" : ""} onClick={() => setPage(i)} />)}
          </div>
          <div className="ios-dock">{HOME.dock.map((it) => icon(it, true))}</div>
        </div>

        {/* the dim over Home while an app is open: full screen and never scaled, so there's no dark box around Home */}
        <div className={`ios-dim ${front || switcher ? "on" : ""} ${switcher ? "deep" : ""}`} aria-hidden />

        {/* Snake on Home: a full-screen board over the wallpaper, lined up with its grid */}
        {snake && (
          <div className="ios-snake-home">
            <SnakeGame full start={startPose} apple={startPose.apple} top={insets.top} bottom={insets.bot} intro={SNAKE_IN} />
            <button type="button" className="ios-snake-homebtn" onClick={() => exitSnake()}>
              <svg viewBox="0 0 24 24" aria-hidden><path d="M3.5 10.6 12 3.8l8.5 6.8" /><path d="M5.8 9v10.2h4.4v-5.6h3.6v5.6h4.4V9" /></svg><span>Home</span>
            </button>
          </div>
        )}

        {/* running apps keep their state; only the front one shows */}
        <NavContext.Provider value={nav}>
          {apps.map((a) => (
            <AppState.Provider key={a.key} value={appState(a)}>
            <div className="ios-layer" data-app={a.key} hidden={a.key !== front && !switcher}
              onPointerDown={edgeDown} onPointerMove={edgeMove} onPointerUp={edgeUp} onPointerCancel={edgeUp}>
              {a.stack.map((s, i) => {
                const n = a.stack.length, isTop = i === n - 1, isUnder = i === n - 2;
                const moving = anim?.app === a.key;
                const cls = isTop ? (moving ? (anim!.kind === "push" ? "enter" : "leave") : "") : (isUnder && moving ? (anim!.kind === "push" ? "cover" : "reveal") : "under");
                return <ScreenView key={s.key} screen={s} prev={i > 0 ? a.stack[i - 1] : undefined} cls={cls} visible={isTop || (isUnder && moving)} onBack={back} onHome={goHome} />;
              })}
            </div>
            </AppState.Provider>
          ))}
        </NavContext.Provider>

        {/* app switcher: a touch surface over the cards, and each card's icon and name */}
        {switcher && (
          <div className="ios-switcher" onPointerDown={swDown} onPointerMove={swMove} onPointerUp={swUp} onPointerCancel={swUp}>
            {[...apps].reverse().map((a) => {
              const it = itemFor(a.key);
              return (
                <span key={a.key} className="ios-sw-label" data-app={a.key}>
                  <AppTile id={it?.id ?? a.key} size={26} /><b>{it?.label ?? a.stack[0].title}</b>
                </span>
              );
            })}
          </div>
        )}

        {/* folder */}
        {folder && (
          <div className="ios-folder" onClick={back}>
            <h3>{folder.label}</h3>
            <div className="box" onClick={(e) => e.stopPropagation()}>
              {folder.items.map((it) => icon(it))}
            </div>
          </div>
        )}

        {/* quick actions */}
        {menu && (
          <div className="ios-menu-scrim" onClick={() => setMenu(null)} onPointerDown={(e) => e.stopPropagation()}>
            <span className="ios-menu-icon" style={{ left: menu.at.x, top: menu.at.y, width: menu.at.w, height: menu.at.w }}><AppTile id={menu.item.id} size={menu.at.w} /></span>
            <div className="ios-menu" style={{ left: menu.x, top: menu.y }} onClick={(e) => e.stopPropagation()}>
              {menu.item.menu!.map((m) => (
                <button type="button" key={m.label} onClick={() => { const from = iconOf(appKey(menu.item.route)); setMenu(null); open(m.route, from); }}>
                  {m.label}{m.label === "How I Built It"
                    ? <svg viewBox="0 0 20 20" aria-hidden><path d="M3 4.5c2.5-1 5-1 7 .8 2-1.8 4.5-1.8 7-.8v11c-2.5-1-5-1-7 .8-2-1.8-4.5-1.8-7-.8z" /><path d="M10 5.3v11" /></svg>
                    : <svg viewBox="0 0 20 20" aria-hidden><path d="M6 4v12l10-6z" /></svg>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* action sheet: games that need a keyboard */}
        {sheet && (
          <div className="ios-sheet-scrim" onClick={() => setSheet(false)}>
            <div className="ios-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="group">
                <p className="msg"><b>Soul Blade plays with a keyboard</b>It's at its best on a computer. You can still take a look, or read how it was made.</p>
                <button type="button" onClick={() => launch({ app: "case", slug: "soul-blade", title: "Soul Blade" })}>Read How I Built It</button>
                <button type="button" onClick={() => launch({ app: "game", id: "soul-blade" })}>Open Anyway</button>
              </div>
              <button type="button" className="cancel" onClick={() => setSheet(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* the snake's hello */}
        {banner && !front && (
          <button type="button" className="ios-banner" onClick={() => open({ app: "messages" })}>
            <AppTile id="messages" size={38} />
            <span className="tx"><span className="h"><b>Tianchi's snake</b><small>now</small></span><span>Psst. Ask me anything about Tianchi. I know his work inside out.</span></span>
          </button>
        )}

        {/* Lock Screen: swipe up to open (no tap): Home rises underneath with your finger, so the gesture teaches the home bar */}
        {locked && (
          <div className="ios-lock"
            onPointerDown={(e) => { lockDown(e); }}
            onPointerMove={lockMove}
            onPointerUp={lockUp} onPointerCancel={lockUp}>
            {/* the same wallpaper as Home's first page, in the same cells: swiping up reveals Home with the snake exactly where it was */}
            <WallArt art={art} cols={[0, 11]} c={cell} x0={gx} bottom={freeBottom} />
            <div className="date">{now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
            <div className="clock">{hhmm(now)}</div>
            <div className="notes">
              <div className="ios-note"><img className="av" src={portrait} alt="" /><div><span className="h"><b>Tianchi Fu</b><small>now</small></span><p>Hi, I'm Tianchi, an AI PM at OpusClip in Singapore. My work, side projects and a snake are inside.</p></div></div>
              <div className="ios-note"><span className="av snake"><MiniHead hat={hat} size={28} /></span><div><span className="h"><b>Tianchi's snake</b><small>now</small></span><p>Swipe up from the bottom to come in.</p></div></div>
            </div>
            <div className="hint">Swipe up to open</div>
          </div>
        )}

        {framed && <StatusBar tone={ink} />}
        <div className={`ios-homebar ${ink === "dark" && !switcher && !snake ? "dark" : ""} ${locked ? "locked" : front || switcher || snake || apps.length ? "" : "idle"}`}
          onPointerDown={hbDown} onPointerMove={hbMove} onPointerUp={hbUp} onPointerCancel={hbUp} aria-hidden><i /></div>
      </div>
      {framed && (
        <aside className="ios-caption">
          <b>Tianchi OS for phones</b>
          <span>The phone version, shown in a frame. On a phone it fills the screen. Swipe between Home pages, hold a game for quick actions, drag the bar at the bottom up to go Home.</span>
        </aside>
      )}
    </div>
  );
}

/** One screen inside an app: nav bar + scrolling body, or a bare screen that draws its own chrome. */
function ScreenView({ screen, prev, cls, visible, onBack, onHome }: { screen: Screen; prev?: Screen; cls: string; visible: boolean; onBack: () => void; onHome: () => void }) {
  const body = useRef<HTMLDivElement>(null);
  return (
    <div className={`ios-screen tone-${screen.tone} ${cls} ${screen.bare ? "bare" : ""}`} style={{ visibility: visible ? undefined : "hidden" }}>
      {!screen.bare && <NavBar screen={screen} prev={prev} onBack={onBack} onHome={onHome} scroller={body} />}
      <div className="win-body ios-body" ref={body}>{screen.node}</div>
    </div>
  );
}

/** What a desktop window means on the phone. */
function routeForWindow(w?: WinInstance): Route | null {
  if (!w) return null;
  switch (w.app) {
    case "about": return { app: "about" };
    case "resume": return { app: "resume" };
    case "snake": return { app: "snake" };
    case "prefs": return { app: "settings" };
    case "about-os": return { app: "settings", page: "os" };
    case "filesystem": case "readme":
      if (w.payload === "images") return { app: "photos" };
      if (w.payload === "videos") return { app: "videos" };
      return { app: "files", folder: w.payload && w.payload !== "tianchintosh" && w.payload !== "desktop" ? w.payload : undefined };
    case "project-detail": return w.payload ? { app: "case", slug: w.payload, title: PROJECTS.find((p) => p.slug === w.payload)?.name ?? w.payload } : null;
    case "soul-blade": case "lego-world": case "twist-solver": return { app: "game", id: w.app };
    case "preview": return { app: "photos", item: mediaItem(w.payload)?.item.id };
    case "player": return { app: "videos", item: w.payload };
    default: return null;
  }
}
