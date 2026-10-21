import { useEffect, useMemo, useRef, useState } from "react";
import { useOS, type AppId, type WinInstance } from "../store";
import { APP_VIEWS } from "../appViews";
import { WindowChromeProvider, type WindowChromeState } from "../components/WindowChrome";
import { ERIC_POSE } from "../components/DesktopSnake";
import { MiniHead, HatPicker } from "../components/SnakeGuide";
import { SnakeChat } from "../components/SnakeChat";
import { PROJECTS } from "../data/projects";
import { coverOf, heroOf } from "../data/projectAssets";
import { MEDIA_FOLDERS } from "../data/media";
import portrait from "../assets/about/portrait.webp";
import pdfIcon from "../assets/icons/b/pdf.png";
import snakeIcon from "../assets/icons/b/snake.png";
import gearIcon from "../assets/icons/b/gear.png";
import computerIcon from "../assets/icons/b/computer.png";
import chatIcon from "../assets/icons/b/chat.png";
import soulBladeIcon from "../assets/icons/b/soul-blade.png";
import twistIcon from "../assets/icons/b/twist-solver.png";
import legoIcon from "../assets/icons/b/lego-world.svg";
import "./ios.css";

/**
 * iOS shell — study for the mobile version (?ios). The desktop is macOS-shaped; the phone is iOS-shaped.
 * Every existing app runs unchanged: a home-screen icon calls the same store `open()` the desktop uses,
 * and the newest window becomes the full-screen app. Windows = running apps, so the app switcher is free.
 * Native-only screens: Lock Screen, Home, Dynamic Island (the snake guide lives there), Messages (Ask), Settings.
 */

type Native = "messages" | "settings";
type Running = { key: string; kind: "win"; id: string } | { key: string; kind: "native"; id: Native };
type Launch = { app: AppId; title: string; payload?: string; maximized?: boolean };

const DARK_APPS = new Set<string>(["about", "snake", "preview", "player", "soul-blade", "twist-solver", "lego-world"]);
const thumbs = MEDIA_FOLDERS.find((f) => f.id === "img-playground")!.items.slice(0, 4).map((i) => i.thumb!);
const SCHOOL = ["refugeeone", "neurobot", "homesoffcampus", "connectr", "subtension", "rutabagga"];

/* ---------- small pieces ---------- */

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 10_000); return () => window.clearInterval(t); }, []);
  return now;
}

function StatusBar({ tone }: { tone: "light" | "dark" }) {
  const now = useClock();
  return (
    <div className={`ios-status ${tone}`}>
      <span className="t">{now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false })}</span>
      <span className="r" aria-hidden>
        <svg viewBox="0 0 18 12" width="18" height="12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg viewBox="0 0 16 12" width="16" height="12"><path d="M8 2.3c2.2 0 4.2.8 5.7 2.2l1.2-1.3A10 10 0 0 0 8 .5 10 10 0 0 0 1.1 3.2l1.2 1.3A8.2 8.2 0 0 1 8 2.3Zm0 3.6c1.2 0 2.3.4 3.2 1.2l1.2-1.3A6.6 6.6 0 0 0 8 4.1c-1.7 0-3.2.6-4.4 1.7l1.2 1.3c.9-.8 2-1.2 3.2-1.2Zm0 3.5c.4 0 .8.2 1.1.4L8 11.2 6.9 9.8c.3-.2.7-.4 1.1-.4Z" /></svg>
        <span className="batt"><i /></span>
      </span>
    </div>
  );
}

/** The desktop wallpaper, phone-sized: charcoal grid + Eric's hand-drawn "hello" snake. */
function Wallpaper({ dim }: { dim?: boolean }) {
  const cell = 15;
  return (
    <div className={`ios-wall ${dim ? "dim" : ""}`} aria-hidden>
      <svg className="ios-hello" viewBox={`0 0 ${24 * cell} ${9 * cell}`} width={24 * cell} height={9 * cell}>
        {ERIC_POSE.map(([x, y], i) => (
          <rect key={i} x={x * cell + 0.75} y={(y - 3.5) * cell + 0.75} width={cell - 1.5} height={cell - 1.5} rx={1.6} fill="#06C268" />
        ))}
        <circle cx={23 * cell + 10} cy={7.5 * cell + 4.2} r={2.2} fill="#fff" /><circle cx={23 * cell + 10} cy={7.5 * cell + 10.8} r={2.2} fill="#fff" />
      </svg>
    </div>
  );
}

function Tile({ kind, src, bg, children }: { kind?: "cover" | "glyph" | "mosaic"; src?: string; bg?: string; children?: React.ReactNode }) {
  return (
    <span className={`ios-ic ${kind ?? "glyph"}`} style={{ background: bg }}>
      {kind === "mosaic" ? thumbs.map((t) => <img key={t} src={t} alt="" draggable={false} />) : src ? <img src={src} alt="" draggable={false} /> : null}
      {children}
    </span>
  );
}

/* ---------- the shell ---------- */

export function IOSShell() {
  const { windows, order, open, close, focus } = useOS();
  const [locked, setLocked] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [fg, setFg] = useState<string | null>(null); // running key in front, null = Home
  const [closing, setClosing] = useState(false);
  const [natives, setNatives] = useState<Native[]>([]);
  const [mine, setMine] = useState<string[]>([]); // windows opened in this phone session (ignore restored desktop ones)
  const [switcher, setSwitcher] = useState(false);
  const [folder, setFolder] = useState<"school" | "work" | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; items: { label: string; run: () => void }[] } | null>(null);
  const [island, setIsland] = useState<"idle" | "peek" | "open">("idle");
  const origin = useRef("50% 50%");
  const seen = useRef(new Set(order));
  const device = useRef<HTMLDivElement>(null);
  // on a desktop the phone is drawn in a frame, zoomed to fit the window height
  const fit = () => (window.innerWidth > 500 ? Math.min(1, (window.innerHeight - 96) / 852) : 1);
  const [zoom, setZoom] = useState(fit);
  useEffect(() => { const f = () => setZoom(fit()); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);

  // phone: the page behind the shell matches it (Safari tints its bars from it) and never rubber-bands
  useEffect(() => {
    const r = document.documentElement, b = document.body;
    r.style.background = b.style.background = "#111214";
    r.style.overscrollBehavior = b.style.overscrollBehavior = "none";
  }, []);

  // a window that appears in the store = an app that just launched (from Home, or from inside another app)
  useEffect(() => {
    const fresh = order.filter((id) => !seen.current.has(id));
    fresh.forEach((id) => seen.current.add(id));
    if (!fresh.length) return;
    setMine((m) => [...m, ...fresh]);
    setFg(`w:${fresh[fresh.length - 1]}`);
    setSwitcher(false);
  }, [order]);

  // most recently used last, like the iOS app switcher
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => { if (fg) setRecent((r) => [...r.filter((k) => k !== fg), fg]); }, [fg]);
  const running: Running[] = useMemo(() => [
    ...mine.filter((id) => windows[id]).map((id): Running => ({ key: `w:${id}`, kind: "win", id })),
    ...natives.map((id): Running => ({ key: `n:${id}`, kind: "native", id })),
  ].sort((a, b) => recent.indexOf(a.key) - recent.indexOf(b.key)), [mine, windows, natives, recent]);
  const front = running.find((r) => r.key === fg);
  const frontDark = front ? (front.kind === "win" ? DARK_APPS.has(windows[front.id]?.app) : false) : true;

  // the snake peeks out of the Dynamic Island once, a moment after unlock
  useEffect(() => {
    if (locked) return;
    const a = window.setTimeout(() => setIsland((s) => (s === "idle" ? "peek" : s)), 2200);
    const b = window.setTimeout(() => setIsland((s) => (s === "peek" ? "idle" : s)), 6200);
    return () => { window.clearTimeout(a); window.clearTimeout(b); };
  }, [locked]);

  const at = (e: { currentTarget: Element }) => {
    const d = device.current?.getBoundingClientRect(), r = e.currentTarget.getBoundingClientRect();
    if (d) origin.current = `${(r.left + r.width / 2 - d.left) / zoom}px ${(r.top + r.height / 2 - d.top) / zoom}px`;
  };
  const launch = (l: Launch) => {
    const hit = mine.find((id) => windows[id]?.app === l.app && windows[id]?.payload === l.payload);
    setFolder(null); setMenu(null);
    if (hit) { focus(hit); setFg(`w:${hit}`); return; }
    open(l.app, { title: l.title, payload: l.payload, maximized: true });
  };
  const launchNative = (n: Native) => {
    setNatives((xs) => (xs.includes(n) ? xs : [...xs, n]));
    setFg(`n:${n}`); setIsland("idle"); setSwitcher(false);
  };
  const goHome = () => {
    if (switcher) { setSwitcher(false); return; }
    if (!fg) { setFolder(null); return; }
    setClosing(true);
    window.setTimeout(() => { setFg(null); setClosing(false); }, 280);
  };
  const quit = (r: Running) => {
    if (r.kind === "win") close(r.id); else setNatives((xs) => xs.filter((x) => x !== r.id));
    if (fg === r.key) setFg(null);
  };

  // home indicator: tap or swipe up = Home; hold = app switcher
  const hold = useRef<{ y: number; t: number } | null>(null);
  const holdTimer = useRef(0);
  const bar = {
    onPointerDown: (e: React.PointerEvent) => {
      hold.current = { y: e.clientY, t: Date.now() };
      holdTimer.current = window.setTimeout(() => { hold.current = null; if (running.length) setSwitcher(true); }, 450);
    },
    onPointerUp: () => { window.clearTimeout(holdTimer.current); if (hold.current) goHome(); hold.current = null; },
    onPointerLeave: () => window.clearTimeout(holdTimer.current),
  };

  // touch controls for keyboard games: swipe = arrow keys, tap = space
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const gamePad = front?.kind === "win" && windows[front.id]?.app === "snake" ? {
    onPointerDown: (e: React.PointerEvent) => { swipe.current = { x: e.clientX, y: e.clientY }; },
    onPointerUp: (e: React.PointerEvent) => {
      const s = swipe.current; swipe.current = null; if (!s) return;
      const dx = e.clientX - s.x, dy = e.clientY - s.y;
      const key = Math.hypot(dx, dy) < 12 ? " " : Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "ArrowRight" : "ArrowLeft") : (dy > 0 ? "ArrowDown" : "ArrowUp");
      window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    },
  } : {};

  const longPress = (items: { label: string; run: () => void }[]) => {
    let t = 0;
    return {
      onPointerDown: (e: React.PointerEvent) => {
        const d = device.current!.getBoundingClientRect(), r = (e.currentTarget as Element).getBoundingClientRect();
        t = window.setTimeout(() => setMenu({ x: (r.left - d.left) / zoom, y: (r.bottom - d.top) / zoom + 8, items }), 450);
      },
      onPointerUp: () => window.clearTimeout(t),
      onPointerLeave: () => window.clearTimeout(t),
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    };
  };

  const App = ({ label, tile, onTap, press }: { label: string; tile: React.ReactNode; onTap: (e: React.MouseEvent) => void; press?: ReturnType<typeof longPress> }) => (
    <button type="button" className="ios-app-icon" onClick={(e) => { if (menu) return; at(e); onTap(e); }} {...press}>
      {tile}<span className="lbl">{label}</span>
    </button>
  );
  const game = (id: "soul-blade" | "lego-world" | "twist-solver", name: string) => ({
    play: () => launch({ app: id, title: name, maximized: true }),
    read: () => launch({ app: "project-detail", title: name, payload: id }),
  });
  const sb = game("soul-blade", "Soul Blade"), lw = game("lego-world", "My Lego World"), ts = game("twist-solver", "Twist Solver");

  const home = (
    <div className={`ios-home ${fg && !closing ? "behind" : ""}`}>
      <button type="button" className="ios-widget" onClick={(e) => { at(e); launch({ app: "about", title: "About Me" }); }}>
        <span className="txt"><small><i />Now · AI PM · Singapore</small><b>Tianchi<br /><em>(Eric)</em> Fu</b><span>Turning what AI can do into products people enjoy.</span></span>
        <img src={portrait} alt="" draggable={false} />
      </button>
      <div className="ios-grid">
        <App label="How I AI" tile={<Tile kind="cover" src={heroOf("how-i-ai")} bg="#fff" />} onTap={() => launch({ app: "project-detail", title: "How I AI", payload: "how-i-ai" })} />
        <App label="Resume" tile={<Tile src={pdfIcon} bg="linear-gradient(#ffffff,#eceef1)" />} onTap={() => launch({ app: "resume", title: "resume.pdf" })} />
        <App label="School" tile={<span className="ios-ic folder">{SCHOOL.slice(0, 4).map((s) => <img key={s} src={coverOf(s)} alt="" />)}</span>} onTap={() => setFolder("school")} />
        <App label="Work" tile={<span className="ios-ic folder work"><b>OpusClip</b><b>Huawei</b></span>} onTap={() => setFolder("work")} />
        <App label="Soul Blade" tile={<Tile src={soulBladeIcon} bg="linear-gradient(#5a1220,#2a070d)" />} onTap={sb.play}
          press={longPress([{ label: "Play", run: sb.play }, { label: "How I Built It", run: sb.read }])} />
        <App label="Lego World" tile={<Tile src={legoIcon} bg="linear-gradient(#ffd84a,#f5b400)" />} onTap={lw.play}
          press={longPress([{ label: "Open", run: lw.play }, { label: "How I Built It", run: lw.read }])} />
        <App label="Twist Solver" tile={<Tile src={twistIcon} bg="linear-gradient(#2f8f4e,#1d6a37)" />} onTap={ts.play}
          press={longPress([{ label: "Open", run: ts.play }, { label: "How I Built It", run: ts.read }])} />
        <App label="Snake" tile={<Tile src={snakeIcon} bg="linear-gradient(#26272c,#141518)" />} onTap={() => launch({ app: "snake", title: "Snake" })} />
        <App label="Videos" tile={<Tile bg="linear-gradient(#2b2d33,#0d0e10)"><svg className="play" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg></Tile>} onTap={() => launch({ app: "filesystem", title: "Videos", payload: "videos" })} />
        <App label="Files" tile={<Tile src={computerIcon} bg="linear-gradient(#e9f1ff,#c9dcff)" />} onTap={() => launch({ app: "filesystem", title: "Tianchintosh HD" })} />
      </div>
      <div className="ios-dots"><i className="on" /><i /></div>
      <div className="ios-dock">
        <App label="" tile={<Tile src={chatIcon} bg="linear-gradient(#5ff07f,#06c268)" />} onTap={() => launchNative("messages")} />
        <App label="" tile={<Tile kind="mosaic" bg="#fff" />} onTap={() => launch({ app: "filesystem", title: "Images", payload: "images" })} />
        <App label="" tile={<Tile kind="cover" src={portrait} bg="#111214" />} onTap={() => launch({ app: "about", title: "About Me" })} />
        <App label="" tile={<Tile src={gearIcon} bg="linear-gradient(#b8bcc4,#8a8f98)" />} onTap={() => launchNative("settings")} />
      </div>
    </div>
  );

  const appLayer = (r: Running, i: number) => {
    const isFront = r.key === fg;
    const idx = running.length - 1 - i; // 0 = newest
    const style: React.CSSProperties = switcher
      ? { transform: `translateX(${-idx * 62}%) scale(.64)`, zIndex: 50 - idx, transformOrigin: "50% 50%" }
      : { transformOrigin: origin.current, zIndex: isFront ? 60 : 0 };
    const cls = `ios-layer ${isFront && !switcher ? "front" : ""} ${isFront && closing ? "closing" : ""} ${switcher ? "card" : ""}`;
    const dark = r.kind === "win" ? DARK_APPS.has(windows[r.id]?.app) : false;
    return (
      <div key={r.key} className={cls} style={style} hidden={!switcher && !isFront}
        onClick={switcher ? () => { setFg(r.key); setSwitcher(false); } : undefined}>
        {switcher && <div className="ios-card-label"><button type="button" aria-label="Quit" onClick={(e) => { e.stopPropagation(); quit(r); }}>×</button>{r.kind === "win" ? (windows[r.id]?.title ?? "") : r.id === "messages" ? "Messages" : "Settings"}</div>}
        {r.kind === "win" ? <WinScreen win={windows[r.id]} dark={dark} pad={gamePad} /> : r.id === "messages" ? <Messages onAct={(a) => {
          const map: Record<string, Launch> = { about: { app: "about", title: "About Me" }, resume: { app: "resume", title: "resume.pdf" }, school: { app: "filesystem", title: "School Projects", payload: "school" }, ai: { app: "filesystem", title: "AI Side Projects", payload: "ai" }, play: { app: "snake", title: "Snake" } };
          if (map[a]) launch(map[a]);
        }} /> : <Settings onAbout={() => launch({ app: "about", title: "About Me" })} onOS={() => launch({ app: "about-os", title: "About Tianchi OS" })} />}
      </div>
    );
  };

  return (
    <div className="ios-stage">
      <div className="ios" ref={device} style={{ zoom }} onClick={() => menu && setMenu(null)}>
        <Wallpaper dim={!locked} />
        {!locked && home}
        {running.map(appLayer)}
        {switcher && <div className="ios-switch-scrim" onClick={() => setSwitcher(false)} />}

        {folder && (
          <div className="ios-folder" onClick={() => setFolder(null)}>
            <h3>{folder === "school" ? "School" : "Work"}</h3>
            <div className="box" onClick={(e) => e.stopPropagation()}>
              {folder === "school" ? SCHOOL.map((s) => {
                const p = PROJECTS.find((x) => x.slug === s)!;
                return <App key={s} label={p.name} tile={<Tile kind="cover" src={coverOf(s)} bg="#fff" />} onTap={() => launch({ app: "project-detail", title: p.name, payload: s })} />;
              }) : [["opus", "OpusClip"], ["huawei", "Huawei"]].map(([id, name]) => (
                <App key={id} label={name} tile={<span className="ios-ic folder work"><b>{name}</b></span>} onTap={() => launch({ app: "filesystem", title: name, payload: id })} />
              ))}
            </div>
          </div>
        )}
        {menu && (
          <div className="ios-menu" style={{ left: Math.min(menu.x, 393 - 220), top: menu.y }}>
            {menu.items.map((m) => <button type="button" key={m.label} onClick={(e) => { e.stopPropagation(); m.run(); }}>{m.label}</button>)}
          </div>
        )}

        {locked && (
          <div className={`ios-lock ${unlocking ? "up" : ""}`} onClick={() => { setUnlocking(true); window.setTimeout(() => setLocked(false), 420); }}>
            <div className="date">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
            <LockClock />
            <div className="ios-note">
              <Tile src={chatIcon} bg="linear-gradient(#5ff07f,#06c268)" />
              <div><b>Tianchi OS</b><span>now</span><p><strong>Hi, I'm Tianchi.</strong> An AI PM in Singapore. Swipe up to look around, and say hi to the snake.</p></div>
            </div>
            <div className="hint">Swipe up to open</div>
          </div>
        )}

        <StatusBar tone={locked || !front || switcher || frontDark ? "light" : "dark"} />
        <button type="button" className={`ios-island ${island}`} aria-label="Tianchi's snake" onClick={(e) => { e.stopPropagation(); if (!locked) setIsland((s) => (s === "open" ? "idle" : "open")); }}>
          {island === "peek" && <><MiniHead hat={useOS.getState().snakeHat} size={26} /><span>Psst. Tap me.</span></>}
          {island === "open" && (
            <span className="isl-card" onClick={(e) => e.stopPropagation()}>
              <span className="who"><MiniHead hat={useOS.getState().snakeHat} size={44} /><span><b>Tianchi's snake</b><small>I know a lot about him.</small></span></span>
              <span className="acts">
                <span role="button" tabIndex={0} onClick={() => launchNative("messages")}>Ask about Tianchi</span>
                <span role="button" tabIndex={0} onClick={() => { setIsland("idle"); launch({ app: "snake", title: "Snake" }); }}>Play Snake</span>
                <span role="button" tabIndex={0} onClick={() => launchNative("settings")}>Dress me up</span>
              </span>
            </span>
          )}
        </button>
        <div className={`ios-homebar ${locked || !front || switcher || frontDark ? "light" : "dark"}`} {...bar}><i /></div>
      </div>
      <aside className="ios-caption">
        <b>Tianchi OS · iOS study</b>
        <span>Tap the lock screen · tap an icon · hold Soul Blade / Lego World / Twist Solver for “How I Built It” · tap the Dynamic Island · tap the bar at the bottom to go Home, hold it for the app switcher</span>
      </aside>
    </div>
  );
}

function LockClock() {
  const now = useClock();
  return <div className="clock">{now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false })}</div>;
}

/** One running window as a full-screen app: iOS nav bar (title, back) over the unchanged app view. */
function WinScreen({ win, dark, pad }: { win: WinInstance; dark: boolean; pad: object }) {
  const [chrome, setChrome] = useState<WindowChromeState | null>(null);
  const title = chrome?.trail?.[chrome.trail.length - 1]?.label ?? win.title ?? "";
  const nav = chrome?.navigation;
  return (
    <div className={`ios-screen ${dark ? "dark" : ""} app-${win.app}`}>
      <div className="ios-nav">
        {nav?.canGoBack ? <button type="button" className="back" onClick={nav.onBack}><svg viewBox="0 0 12 20"><path d="M10 2 2 10l8 8" /></svg>Back</button> : <span />}
        <b>{title}</b><span />
      </div>
      <div className="win-body ios-body" {...pad}>
        <WindowChromeProvider setChrome={setChrome}>{APP_VIEWS[win.app](win)}</WindowChromeProvider>
      </div>
    </div>
  );
}

function Messages({ onAct }: { onAct: (a: string) => void }) {
  return (
    <div className="ios-screen ios-msgs">
      <div className="ios-nav tall"><span /><span className="who"><MiniHead hat={useOS.getState().snakeHat} size={40} /><b>Tianchi's snake</b></span><span /></div>
      <div className="ios-body"><div className="sguide"><SnakeChat style={{}} onAct={onAct} onClose={() => {}} /></div></div>
    </div>
  );
}

function Settings({ onAbout, onOS }: { onAbout: () => void; onOS: () => void }) {
  return (
    <div className="ios-screen ios-settings">
      <div className="ios-body">
        <h1>Settings</h1>
        <button type="button" className="group profile" onClick={onAbout}>
          <img src={portrait} alt="" /><span><b>Tianchi (Eric) Fu</b><small>AI PM · OpusClip · Singapore</small></span><i>›</i>
        </button>
        <div className="sec">Snake</div>
        <div className="group pad"><HatPicker /></div>
        <div className="sec">Say hi</div>
        <div className="group">
          <a href="mailto:ericfu-tianchi@outlook.com"><span className="dot" style={{ background: "#06c268" }} />Email<i>›</i></a>
          <a href="https://www.linkedin.com/in/tianchi-fu/" target="_blank" rel="noopener noreferrer"><span className="dot" style={{ background: "#0a66c2" }} />LinkedIn<i>›</i></a>
          <a href="https://github.com/ericfu-tianchi" target="_blank" rel="noopener noreferrer"><span className="dot" style={{ background: "#24292f" }} />GitHub<i>›</i></a>
        </div>
        <div className="group">
          <button type="button" onClick={onOS}><span className="dot" style={{ background: "#8e8e93" }} />About Tianchi OS<i>›</i></button>
        </div>
      </div>
    </div>
  );
}
