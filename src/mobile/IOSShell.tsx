import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useOS, type WinInstance } from "../store";
import { mediaItem } from "../data/media";
import { PROJECTS } from "../data/projects";
import { MiniHead } from "../components/SnakeGuide";
import portrait from "../assets/about/portrait.webp";
import { ALBUMS, HOME, appKey, type HomeItem, type Route } from "./model";
import { AppTile, ItemTile } from "./icons";
import { NavBar, NavContext, type Nav, type Screen } from "./nav";
import { screenFor } from "./routes";
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
const LOCK_KEY = "eric-os-phone-unlocked";
const BANNER_KEY = "eric-os-phone-banner";
const isTouch = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
const session = { get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return "1"; } }, set: (k: string) => { try { sessionStorage.setItem(k, "1"); } catch { /* private mode */ } } };

/* ---------------- wallpaper ---------------- */

/** "hi", written by the snake on the wallpaper grid: h, then a cursive join into i; an apple dots the i. */
const HI: [number, number][] = [
  [0, 6], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [2, 3], [3, 3], [3, 4], [3, 5], [3, 6], [4, 6], [5, 6], [5, 5], [5, 4], [5, 3], [5, 2],
];
function HiSnake({ col, row }: { col: number; row: number }) {
  const [hx, hy] = HI[HI.length - 1];
  const at = (x: number, y: number) => ({ left: `calc(var(--cell) * ${x})`, top: `calc(var(--cell) * ${y})` });
  return (
    <div className="ios-hi" style={at(col, row)} aria-hidden>
      {HI.map(([x, y], i) => <i key={i} style={at(x, y)} />)}
      <b className="eyes" style={at(hx, hy)}><span /><span /></b>
      <em className="apple" style={at(hx, hy - 2)} />
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

  // device size → grid cell (13 across, same as the Snake board) and the desktop-preview zoom
  useLayoutEffect(() => {
    const f = () => {
      const el = device.current; if (!el) return;
      setSize({ w: el.offsetWidth, h: el.offsetHeight });
      setZoom(framed ? Math.min(1, (window.innerHeight - 92) / 852) : 1);
    };
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, [framed]);
  const cell = size.w / 13;

  const frontApp = apps.find((a) => a.key === front) ?? null;
  const top = frontApp?.stack[frontApp.stack.length - 1];

  /* ---------- geometry + flights ---------- */

  const layerOf = (key: string) => device.current?.querySelector<HTMLElement>(`.ios-layer[data-app="${CSS.escape(key)}"]`) ?? null;
  const iconOf = (key: string) => device.current?.querySelector(`.ios-home [data-id="${CSS.escape(key)}"] .ios-ic, .ios-home .ios-widget[data-id="${CSS.escape(key)}"]`) ?? null;
  const rectIn = (el: Element) => {
    const d = device.current!.getBoundingClientRect(), r = el.getBoundingClientRect(), z = zoomRef.current;
    return { x: (r.left - d.left) / z, y: (r.top - d.top) / z, w: r.width / z, h: r.height / z };
  };
  /** the app zooms out of its icon (in), or back into it (out) */
  const flight = (el: HTMLElement, from: Element | null | undefined, dir: "in" | "out", done?: () => void) => {
    const W = el.offsetWidth, H = el.offsetHeight;
    const vis = !!from && from.isConnected && (from as HTMLElement).offsetParent !== null;
    let t = "translate3d(0,30px,0) scale(.9)";
    if (vis) {
      const r = rectIn(from!);
      t = `translate3d(${r.x + r.w / 2 - W / 2}px, ${r.y + r.h / 2 - H / 2}px, 0) scale(${r.w / W}, ${r.h / H})`;
    }
    const k = [{ transform: t, borderRadius: `${Math.max(W, H) * 0.12}px`, opacity: vis ? 1 : 0 }, { transform: "none", borderRadius: "0px", opacity: 1 }];
    const a = el.animate(dir === "in" ? k : [k[1], k[0]], { duration: dir === "in" ? 440 : 380, easing: EASE, fill: dir === "out" ? "forwards" : "none" });
    a.onfinish = () => done?.();
  };

  const pushHistory = () => { history.pushState({ ios: depth.current + 1 }, ""); depth.current++; };

  /* ---------- open / push / back / home ---------- */

  const launch = (route: Route, from?: Element | null) => {
    const key = appKey(route);
    setMenu(null); setFolder(null); setSheet(false); setBanner(false);
    const opener = frontRef.current && frontRef.current !== key ? frontRef.current : undefined;
    const existing = appsRef.current.find((a) => a.key === key);
    if (!existing) setApps((xs) => [...xs, { key, route, stack: [{ key: sk(), ...screenFor(route) }], opener }]);
    else setApps((xs) => xs.map((a) => (a.key === key ? { ...a, opener } : a)));
    setFront(key);
    pushHistory();
    requestAnimationFrame(() => requestAnimationFrame(() => { const el = layerOf(key); if (el) flight(el, from, "in"); }));
  };
  const open = (route: Route, from?: Element | null) => {
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

  const toHome = (k: string) => {
    const el = layerOf(k);
    const finish = () => { setFront(null); el?.getAnimations().forEach((a) => a.cancel()); };
    if (el) flight(el, iconOf(k), "out", finish); else finish();
  };

  /** Home: drop every history entry we added, and fly the app back into its icon */
  const goHome = () => {
    const k = frontRef.current;
    if (depth.current > 0) { skipPop.current++; history.go(-depth.current); depth.current = 0; }
    setFolder(null);
    if (k) toHome(k);
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
  useEffect(() => {
    const onPop = () => {
      if (skipPop.current > 0) { skipPop.current--; return; }
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
  const unlock = () => { session.set(LOCK_KEY); setLocked(false); };
  const lockDrag = useRef<{ y: number; t: number } | null>(null);
  const [lockY, setLockY] = useState(0);
  const [lockAnim, setLockAnim] = useState(false);

  // the snake says hi once, a while after you land on Home
  useEffect(() => {
    if (locked || session.get(BANNER_KEY)) return;
    const a = window.setTimeout(() => { if (!frontRef.current) { setBanner(true); session.set(BANNER_KEY); } }, 6000);
    return () => window.clearTimeout(a);
  }, [locked]);
  useEffect(() => { if (!banner) return; const t = window.setTimeout(() => setBanner(false), 7000); return () => window.clearTimeout(t); }, [banner]);

  /* ---------- Home: two pages that follow the finger ---------- */
  const pg = useRef<{ x: number; y: number; t: number; axis?: "x" | "y" } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [paging, setPaging] = useState(false);
  const suppressTap = useRef(false);
  const pageDown = (e: React.PointerEvent) => { pg.current = { x: e.clientX, y: e.clientY, t: Date.now() }; setPaging(false); suppressTap.current = false; };
  const pageMove = (e: React.PointerEvent) => {
    const s = pg.current; if (!s) return;
    const dx = (e.clientX - s.x) / zoom, dy = (e.clientY - s.y) / zoom;
    if (!s.axis && Math.hypot(dx, dy) > 8) { s.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"; suppressTap.current = true; window.clearTimeout(press.current); }
    if (s.axis === "x") setDragX((page === 0 && dx > 0) || (page === 1 && dx < 0) ? dx * 0.3 : dx);
  };
  const pageUp = (e: React.PointerEvent) => {
    const s = pg.current; pg.current = null; if (!s) return;
    const dx = (e.clientX - s.x) / zoom, v = dx / Math.max(1, Date.now() - s.t);
    setPaging(true);
    if (s.axis === "x") {
      if ((dx < -size.w / 4 || v < -0.3) && page === 0) setPage(1);
      else if ((dx > size.w / 4 || v > 0.3) && page === 1) setPage(0);
    }
    setDragX(0);
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
  const Icon = ({ item, dock }: { item: HomeItem; dock?: boolean }) => (
    <button type="button" className={`ios-icon ${menu && menu.item === item ? "lifted" : ""}`} aria-label={item.label} {...iconProps(item)}>
      <ItemTile item={item} />
      {!dock && <span className="lbl">{item.label}</span>}
    </button>
  );

  /* ---------- home indicator: tap = Home; drag up = the app shrinks under your finger ---------- */
  const hb = useRef<{ y: number; t: number } | null>(null);
  const hbDown = (e: React.PointerEvent) => { if (!frontRef.current) return; hb.current = { y: e.clientY, t: Date.now() }; (e.currentTarget as Element).setPointerCapture(e.pointerId); };
  const hbMove = (e: React.PointerEvent) => {
    const s = hb.current, k = frontRef.current; if (!s || !k) return;
    const dy = Math.min(0, (e.clientY - s.y) / zoom);
    const el = layerOf(k); if (!el) return;
    const p = Math.min(1, -dy / 420);
    el.style.transition = "none";
    el.style.transform = `translate3d(0, ${dy * 0.55}px, 0) scale(${1 - p * 0.42})`;
    el.style.borderRadius = `${24 + p * 30}px`;
  };
  const hbUp = (e: React.PointerEvent) => {
    const s = hb.current, k = frontRef.current; hb.current = null;
    if (!s || !k) return;
    const dy = (e.clientY - s.y) / zoom, v = dy / Math.max(1, Date.now() - s.t);
    const el = layerOf(k);
    if (Math.abs(dy) < 6 || dy < -70 || v < -0.4) {
      if (el) { el.style.transition = ""; el.style.transform = ""; el.style.borderRadius = ""; }
      goHome();
    } else if (el) {
      el.style.transition = `transform .35s ${EASE}, border-radius .35s`; el.style.transform = ""; el.style.borderRadius = "";
      window.setTimeout(() => { el.style.transition = ""; }, 360);
    }
  };

  /* ---------- edge swipe: drag the screen off to the right to go back ---------- */
  const edge = useRef<{ x: number; t: number; top: HTMLElement; under: HTMLElement | null } | null>(null);
  const edgeDown = (e: React.PointerEvent) => {
    if (!frontApp || frontApp.stack.length < 2) return;
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

  /* ---------- widgets ---------- */
  const featured = useMemo(() => { const all = ALBUMS.flatMap((a) => a.items); return all[Math.floor(Math.random() * all.length)]; }, []);
  const bestLine = useMemo(() => {
    let best = 0; try { best = Number(localStorage.getItem("eric-os-mobile-snake-best")) || 0; } catch { /* */ }
    return best > 0 ? `Your best: ${best}` : "Swipe to play";
  }, [front]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- render ---------- */
  const now = useClock();
  const rows = Math.floor(size.h / cell);
  const ink = locked || !top || top.tone !== "light" ? "light" : "dark";

  return (
    <div className={`ios-stage ${framed ? "framed" : "phone"}`}>
      <div className={`ios ${framed ? "framed" : "phone"}`} ref={device} style={{ zoom, "--cell": `${cell}px` } as React.CSSProperties}>
        <div className="ios-wall" aria-hidden />

        {/* Home */}
        <div className={`ios-home ${front ? "behind" : ""} ${locked ? "hidden" : ""}`} aria-hidden={!!front || locked}
          onPointerDown={pageDown} onPointerMove={pageMove} onPointerUp={pageUp} onPointerCancel={pageUp}>
          <div className="pages" style={{ transform: `translate3d(${-page * size.w + dragX}px,0,0)`, transition: paging ? `transform .44s ${EASE}` : "none" }}>
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
              <div className="ios-grid">{HOME.page1.map((it) => <Icon key={it.id} item={it} />)}</div>
              <div className="ios-widgets">
                <button type="button" className="ios-mini snake" data-id="snake" onClick={(e) => { if (suppressTap.current) { suppressTap.current = false; return; } open({ app: "snake" }, e.currentTarget); }}>
                  <span className="board" aria-hidden>{[[0, 3], [1, 3], [2, 3], [2, 2], [2, 1], [3, 1], [4, 1]].map(([x, y], i) => <i key={i} style={{ left: `${x * 20}%`, top: `${y * 20}%` }} />)}<em style={{ left: "80%", top: "60%" }} /></span>
                  <span className="cap"><b>Snake</b><small>{bestLine}</small></span>
                </button>
                <button type="button" className="ios-mini photo" data-id="photos" onClick={(e) => { if (suppressTap.current) { suppressTap.current = false; return; } open({ app: "photos", item: featured.id }, e.currentTarget); }}>
                  <img src={featured.thumb} alt="" draggable={false} />
                  <span className="cap"><small>Featured photo</small><b>{featured.name}</b></span>
                </button>
              </div>
            </section>
            <section className="page" aria-label="Home page 2">
              <div className="ios-grid">{HOME.page2.map((it) => <Icon key={it.id} item={it} />)}</div>
              <HiSnake col={3} row={Math.max(7, rows - 12)} />
            </section>
          </div>
          <div className="ios-dots" role="tablist" aria-label="Home Screen pages">
            {[0, 1].map((i) => <button type="button" key={i} role="tab" aria-selected={page === i} aria-label={`Page ${i + 1}`} className={page === i ? "on" : ""} onClick={() => { setPaging(true); setPage(i); }} />)}
          </div>
          <div className="ios-dock">{HOME.dock.map((it) => <Icon key={it.id} item={it} dock />)}</div>
        </div>

        {/* running apps keep their state; only the front one shows */}
        <NavContext.Provider value={nav}>
          {apps.map((a) => (
            <div key={a.key} className="ios-layer" data-app={a.key} hidden={a.key !== front}
              onPointerDown={edgeDown} onPointerMove={edgeMove} onPointerUp={edgeUp} onPointerCancel={edgeUp}>
              {a.stack.map((s, i) => {
                const n = a.stack.length, isTop = i === n - 1, isUnder = i === n - 2;
                const moving = anim?.app === a.key;
                const cls = isTop ? (moving ? (anim!.kind === "push" ? "enter" : "leave") : "") : (isUnder && moving ? (anim!.kind === "push" ? "cover" : "reveal") : "under");
                return <ScreenView key={s.key} screen={s} prev={i > 0 ? a.stack[i - 1] : undefined} cls={cls} visible={isTop || (isUnder && moving)} onBack={back} onHome={goHome} />;
              })}
            </div>
          ))}
        </NavContext.Provider>

        {/* folder */}
        {folder && (
          <div className="ios-folder" onClick={back}>
            <h3>{folder.label}</h3>
            <div className="box" onClick={(e) => e.stopPropagation()}>
              {folder.items.map((it) => <Icon key={it.id} item={it} />)}
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

        {/* Lock Screen: tap or swipe up */}
        {locked && (
          <div className={`ios-lock ${lockAnim ? "anim" : ""}`} style={{ transform: `translate3d(0, ${lockY}px, 0)` }}
            onPointerDown={(e) => { lockDrag.current = { y: e.clientY, t: Date.now() }; setLockAnim(false); }}
            onPointerMove={(e) => { const s = lockDrag.current; if (s) setLockY(Math.min(0, (e.clientY - s.y) / zoom)); }}
            onPointerUp={(e) => {
              const s = lockDrag.current; lockDrag.current = null; if (!s) return;
              const dy = (e.clientY - s.y) / zoom, v = dy / Math.max(1, Date.now() - s.t);
              setLockAnim(true);
              if (Math.abs(dy) < 8 || dy < -size.h * 0.18 || v < -0.4) { setLockY(-size.h); window.setTimeout(unlock, 400); }
              else setLockY(0);
            }}>
            <div className="date">{now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
            <div className="clock">{hhmm(now)}</div>
            <div className="notes">
              <div className="ios-note"><img className="av" src={portrait} alt="" /><div><span className="h"><b>Tianchi Fu</b><small>now</small></span><p>Hi, I'm Tianchi, an AI PM at OpusClip in Singapore. My work, side projects and a snake are inside.</p></div></div>
              <div className="ios-note"><span className="av snake"><MiniHead hat={useOS.getState().snakeHat} size={28} /></span><div><span className="h"><b>Tianchi's snake</b><small>now</small></span><p>Tap anywhere to come in.</p></div></div>
            </div>
            <HiSnake col={3} row={Math.max(9, rows - 10)} />
            <div className="hint">Swipe up or tap to open</div>
          </div>
        )}

        {framed && <StatusBar tone={ink} />}
        {!locked && (
          <div className={`ios-homebar ${ink === "dark" ? "dark" : ""} ${front ? "" : "idle"}`}
            onPointerDown={hbDown} onPointerMove={hbMove} onPointerUp={hbUp} onPointerCancel={hbUp} aria-hidden><i /></div>
        )}
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
