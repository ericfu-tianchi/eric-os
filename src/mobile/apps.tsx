import { useEffect, useRef, useState } from "react";
import { useOS } from "../store";
import { SnakeChat, EMAIL } from "../components/SnakeChat";
import { HatPicker, MiniHead } from "../components/SnakeGuide";
import { EXTERNAL_GAMES, type ExternalGameId, type FileNode } from "../data/filesystem";
import { mediaItem, type MediaItem } from "../data/media";
import { coverOf } from "../data/projectAssets";
import resumePage from "../assets/resume-page.png";
import resume from "../data/resumeLinks.json";
import portrait from "../assets/about/portrait.webp";
import folderIcon from "../assets/icons/b/folder.png";
import docIcon from "../assets/icons/b/doc.png";
import pdfIcon from "../assets/icons/b/pdf.png";
import { ALBUMS, VIDEOS, filesChildren, filesNode, filesRoot, routeForNode, type Route } from "./model";
import { AppTile } from "./icons";
import { LargeTitle, useAppState, useNav, useTap } from "./nav";
import { screenFor } from "./routes";
import { readBest } from "./SnakeGame";

const Chevron = () => <svg className="chev" viewBox="0 0 8 14" aria-hidden><path d="m1.5 1.5 5 5.5-5 5.5" /></svg>;

/* ================= Files ================= */

function nodeIcon(n: FileNode) {
  if (n.kind === "folder") return <img src={folderIcon} alt="" />;
  if (n.kind === "project" && n.projectSlug) {
    const c = coverOf(n.projectSlug);
    return c ? <img className="thumb" src={c} alt="" /> : <img src={docIcon} alt="" />;
  }
  if (n.kind === "game" && n.gameId) return <img src={EXTERNAL_GAMES[n.gameId].icon} alt="" />;
  if (n.app === "resume") return <img src={pdfIcon} alt="" />;
  if (n.thumb) return <img className="thumb" src={n.thumb} alt="" />;
  return <img src={docIcon} alt="" />;
}
function nodeSub(n: FileNode) {
  if (n.kind === "folder") {
    const k = filesChildren(n.id).length;
    return k === 0 ? "Empty" : `${k} item${k === 1 ? "" : "s"}`;
  }
  if (n.kind === "placeholder") return "Coming soon";
  if (n.kind === "game") return "Playable";
  if (n.kind === "project") return "Case study";
  return n.description ?? "";
}

export function FilesScreen({ folder }: { folder?: string }) {
  const nav = useNav();
  const tap = useTap();
  const nodes = folder ? filesChildren(folder) : filesRoot();
  const title = folder ? filesNode(folder)?.name ?? "Files" : "Tianchintosh";
  const go = (n: FileNode, e: React.MouseEvent) => {
    if (tap.moved(e)) return;
    const r = routeForNode(n);
    if (!r) return;
    if ("push" in r) return nav.push({ title: filesNode(r.push)?.name ?? "", tone: "light", large: true, node: <FilesScreen folder={r.push} /> });
    // reading pages open in place, so Back returns to the folder
    if (r.app === "case" || r.app === "about" || r.app === "resume") return nav.push(screenFor(r));
    nav.open(r, e.currentTarget);
  };
  return (
    <div className="ios-list-page">
      <LargeTitle sub={folder ? undefined : "Everything on this phone, in folders."}>{title}</LargeTitle>
      {nodes.length === 0 ? <p className="ios-empty">This folder is empty for now.</p> : (
        <div className="ios-group">
          {nodes.map((n) => (
            <button type="button" key={n.id} className={`ios-row fsrow ${n.kind === "placeholder" ? "dim" : ""}`} disabled={n.kind === "placeholder"}
              onPointerDown={tap.onPointerDown} onClick={(e) => go(n, e)}>
              <span className="ic">{nodeIcon(n)}</span>
              <span className="tx"><b>{n.name}</b><small>{nodeSub(n)}</small></span>
              {n.kind !== "placeholder" && <Chevron />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= Photos ================= */

export function AlbumsScreen({ start }: { start?: string }) {
  const nav = useNav();
  const tap = useTap();
  const openAlbum = (id: string, item?: string) => {
    const a = ALBUMS.find((x) => x.id === id)!;
    nav.push({ title: a.name, tone: "light", node: <AlbumScreen id={id} start={item} /> });
  };
  // deep link (Files → a photo): open its album, then the photo
  useEffect(() => {
    const hit = start ? mediaItem(start) : undefined;
    if (hit) openAlbum(hit.folder.id, start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="ios-list-page">
      <LargeTitle>Photos</LargeTitle>
      <div className="ios-albums">
        {ALBUMS.map((a) => (
          <button type="button" key={a.id} onPointerDown={tap.onPointerDown} onClick={(e) => !tap.moved(e) && openAlbum(a.id)}>
            <span className="cover">{a.items.slice(0, 4).map((i) => <img key={i.id} src={i.thumb} alt="" loading="lazy" />)}</span>
            <b>{a.name}</b><small>{a.items.length}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function AlbumScreen({ id, start }: { id: string; start?: string }) {
  const nav = useNav();
  const tap = useTap();
  const album = ALBUMS.find((x) => x.id === id)!;
  const view = (i: number) => nav.push({ title: album.name, tone: "black", bare: true, node: <PhotoViewer items={album.items} start={i} /> });
  useEffect(() => {
    const i = start ? album.items.findIndex((x) => x.id === start) : -1;
    if (i >= 0) view(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="ios-photo-grid">
      {album.items.map((it, i) => (
        <button type="button" key={it.id} aria-label={it.name} onPointerDown={tap.onPointerDown} onClick={(e) => !tap.moved(e) && view(i)}>
          <img src={it.thumb} alt="" loading="lazy" draggable={false} />
        </button>
      ))}
      <p className="ios-count">{album.items.length} Photos</p>
    </div>
  );
}

/** Full-screen photo: swipe left/right to step (the strip follows the finger), swipe down to close, tap for chrome. */
function PhotoViewer({ items, start }: { items: MediaItem[]; start: number }) {
  const nav = useNav();
  const [i, setI] = useState(start);
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [anim, setAnim] = useState(false);
  const [chrome, setChrome] = useState(true);
  const g = useRef<{ x: number; y: number; t: number; axis?: "x" | "y" } | null>(null);
  const W = () => (g.current && (document.querySelector(".ios-viewer") as HTMLElement | null)?.clientWidth) || 393;
  const down = (e: React.PointerEvent) => { g.current = { x: e.clientX, y: e.clientY, t: Date.now() }; setAnim(false); (e.currentTarget as Element).setPointerCapture(e.pointerId); };
  const move = (e: React.PointerEvent) => {
    const s = g.current; if (!s) return;
    const mx = e.clientX - s.x, my = e.clientY - s.y;
    if (!s.axis && Math.hypot(mx, my) > 8) s.axis = Math.abs(mx) > Math.abs(my) ? "x" : "y";
    if (s.axis === "x") setDx((i === 0 && mx > 0) || (i === items.length - 1 && mx < 0) ? mx * 0.3 : mx);
    if (s.axis === "y") setDy(Math.max(0, my));
  };
  const up = (e: React.PointerEvent) => {
    const s = g.current; g.current = null; if (!s) return;
    const mx = e.clientX - s.x, v = mx / Math.max(1, Date.now() - s.t);
    setAnim(true);
    if (!s.axis) { setChrome((c) => !c); return; }
    if (s.axis === "y") { if (dy > 110) nav.pop(); else setDy(0); return; }
    const w = W();
    if ((mx < -w / 4 || v < -0.4) && i < items.length - 1) setI(i + 1);
    else if ((mx > w / 4 || v > 0.4) && i > 0) setI(i - 1);
    setDx(0);
  };
  const it = items[i];
  return (
    <div className={`ios-viewer ${chrome ? "" : "clean"}`} style={{ background: `rgba(0,0,0,${1 - Math.min(dy / 400, 0.6)})` }}>
      <div className="strip" style={{ transform: `translate3d(calc(${-i * 100}% + ${dx}px), ${dy}px, 0) scale(${1 - Math.min(dy / 1600, 0.2)})`, transition: anim ? "transform .38s cubic-bezier(.2,.9,.25,1)" : "none" }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        {items.map((x, k) => (
          <div className="slide" key={x.id} style={{ left: `${k * 100}%` }}>
            {Math.abs(k - i) <= 1 && <img src={x.src} alt={x.name} draggable={false} />}
          </div>
        ))}
      </div>
      <div className="vtop">
        <button type="button" className="ios-back" onClick={() => nav.pop()}><svg viewBox="0 0 12 20" aria-hidden><path d="M10 2 2 10l8 8" /></svg><span>Back</span></button>
        <b>{i + 1} of {items.length}</b>
        <span />
      </div>
      <div className="vbot"><b>{it.name}</b>{it.credit && <small>{it.credit}</small>}</div>
    </div>
  );
}

/* ================= Videos ================= */

export function VideosScreen({ start }: { start?: string }) {
  const nav = useNav();
  const tap = useTap();
  const play = (v: MediaItem) => nav.push({ title: v.name, tone: "black", bare: true, node: <VideoPlayer key={v.id} v={v} /> });
  useEffect(() => {
    const v = VIDEOS.find((x) => x.id === start);
    if (v) play(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="ios-list-page">
      <LargeTitle sub="Five I keep coming back to.">Videos</LargeTitle>
      <div className="ios-videos">
        {VIDEOS.map((v) => (
          <button type="button" key={v.id} onPointerDown={tap.onPointerDown} onClick={(e) => !tap.moved(e) && play(v)}>
            <span className="th"><img src={v.thumb} alt="" loading="lazy" /><i aria-hidden><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg></i></span>
            <b>{v.name}</b>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Full-screen player, Shorts / TikTok style without the feed. It opens immersive: just the video.
 * A tap on the picture shows the controls (play/pause in the middle, title and a scrubbable bar at the bottom);
 * another tap on the picture hides them again. While playing they also tuck away after a few seconds.
 */
function VideoPlayer({ v }: { v: MediaItem }) {
  const nav = useNav();
  const { front } = useAppState();
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [t, setT] = useState({ cur: 0, dur: 0 });
  const scrub = useRef<{ was: boolean } | null>(null);
  const [ui, setUi] = useState(false); // controls shown
  const hideT = useRef(0);
  const later = () => { window.clearTimeout(hideT.current); hideT.current = window.setTimeout(() => { if (!video.current?.paused && !scrub.current) setUi(false); }, 3200); };
  useEffect(() => () => window.clearTimeout(hideT.current), []);

  // start playing; if the browser blocks sound without a fresh tap, play muted and offer "Tap for sound"
  useEffect(() => {
    const el = video.current; if (!el) return;
    el.play().catch(() => { el.muted = true; setMuted(true); el.play().catch(() => setPaused(true)); });
  }, []);
  useEffect(() => { if (!front) { video.current?.pause(); setPaused(true); } }, [front]); // leaving the app pauses it; the position stays

  const toggle = () => {
    const el = video.current; if (!el) return;
    if (muted) { el.muted = false; setMuted(false); if (!el.paused) return; }
    if (el.paused) { el.play(); setPaused(false); later(); } else { el.pause(); setPaused(true); window.clearTimeout(hideT.current); }
  };
  const tapPicture = () => { if (muted) { toggle(); return; } setUi((v) => { if (!v) later(); return !v; }); };
  const seekTo = (clientX: number) => {
    const el = video.current, b = bar.current; if (!el || !b || !el.duration) return;
    const r = b.getBoundingClientRect(), f = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    el.currentTime = f * el.duration; setT({ cur: el.currentTime, dur: el.duration });
  };
  const fmt = (x: number) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, "0")}`;
  const pct = t.dur ? (t.cur / t.dur) * 100 : 0;

  return (
    <div className={`ios-reel ${paused ? "paused" : ""} ${ui || paused ? "ui" : ""} ${scrub.current ? "scrubbing" : ""}`}>
      <video ref={video} src={v.src} poster={v.thumb} playsInline loop preload="auto" className={v.portrait ? "tall" : "wide"}
        onClick={tapPicture} onTimeUpdate={(e) => !scrub.current && setT({ cur: e.currentTarget.currentTime, dur: e.currentTarget.duration || 0 })}
        onLoadedMetadata={(e) => setT({ cur: 0, dur: e.currentTarget.duration })} />
      <button type="button" className="reel-back" onClick={() => nav.pop()} aria-label="Back to Videos"><svg viewBox="0 0 12 20" aria-hidden><path d="M10 2 2 10l8 8" /></svg></button>
      {muted && <button type="button" className="reel-sound" onClick={toggle}>Tap for sound</button>}
      <button type="button" className="reel-play" onClick={toggle} aria-label={paused ? "Play" : "Pause"}>
        {paused ? <svg viewBox="0 0 24 24" aria-hidden><path d="M8.5 6.2v11.6c0 .8.9 1.3 1.6.9l9.3-5.8c.6-.4.6-1.3 0-1.7l-9.3-5.8c-.7-.4-1.6.1-1.6.8z" /></svg>
          : <svg viewBox="0 0 24 24" aria-hidden><rect x="6.5" y="5.5" width="3.8" height="13" rx="1.2" /><rect x="13.7" y="5.5" width="3.8" height="13" rx="1.2" /></svg>}
      </button>
      <div className="reel-info"><b>{v.name}</b><small>{fmt(t.cur)} / {fmt(t.dur)}</small></div>
      <div className="reel-bar" role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={Math.round(t.dur)} aria-valuenow={Math.round(t.cur)}
        onPointerDown={(e) => { (e.currentTarget as Element).setPointerCapture(e.pointerId); const el = video.current; scrub.current = { was: !!el && !el.paused }; el?.pause(); seekTo(e.clientX); setT((x) => ({ ...x })); }}
        onPointerMove={(e) => { if (scrub.current) seekTo(e.clientX); }}
        onPointerUp={() => { const s = scrub.current; scrub.current = null; if (s?.was) { video.current?.play(); later(); } setT((x) => ({ ...x })); }}
        onPointerCancel={() => { scrub.current = null; }}>
        <span className="track" ref={bar}><i style={{ width: `${pct}%` }} /><em style={{ left: `${pct}%` }} /></span>
      </div>
    </div>
  );
}

/* ================= Messages ================= */

export function MessagesScreen() {
  const hat = useOS((s) => s.snakeHat);
  const nav = useNav();
  const act = (a: string) => {
    const map: Record<string, Route> = {
      about: { app: "about" }, resume: { app: "resume" }, play: { app: "snake" },
      school: { app: "files", folder: "school" }, ai: { app: "files", folder: "ai" },
    };
    if (map[a]) nav.open(map[a]);
  };
  return (
    <div className="ios-msgs">
      <div className="contact">
        <span className="av"><MiniHead hat={hat} size={64} /></span>
        <b>Tianchi's snake</b>
        <small>Lives on Tianchi's desktop and knows his work inside out.</small>
      </div>
      <div className="sguide"><SnakeChat style={{}} onAct={act} onClose={() => nav.home()} focus={false} /></div>
    </div>
  );
}

/* ================= Settings ================= */

const RowIcon = ({ bg, children }: { bg: string; children: React.ReactNode }) => <span className="ri" style={{ background: bg }}>{children}</span>;
const MailGlyph = () => <svg viewBox="0 0 16 16"><rect x="1.5" y="3.5" width="13" height="9" rx="2" fill="none" stroke="#fff" strokeWidth="1.5" /><path d="M2.5 4.8 8 9l5.5-4.2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>;
const InGlyph = () => <svg viewBox="0 0 16 16" fill="#fff"><path d="M3.6 6.2h1.9v6.3H3.6zM4.6 3.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM6.9 6.2h1.8v.9c.3-.5 1-1.1 2-1.1 2 0 2.4 1.3 2.4 3v3.5h-1.9V9.4c0-.7 0-1.7-1-1.7s-1.2.8-1.2 1.6v3.2H6.9z" /></svg>;
const GhGlyph = () => <svg viewBox="0 0 16 16" fill="#fff"><path d="M8 1.3a6.7 6.7 0 0 0-2.1 13c.3.1.5-.1.5-.3v-1.2c-1.9.4-2.3-.8-2.3-.8-.3-.8-.7-1-.7-1-.6-.4 0-.4 0-.4.7 0 1 .7 1 .7.6 1 1.6.7 2 .5.1-.4.2-.7.4-.9-1.5-.2-3-.7-3-3.3 0-.7.3-1.3.7-1.8-.1-.2-.3-.9.1-1.8 0 0 .6-.2 1.8.7a6.3 6.3 0 0 1 3.3 0c1.3-.9 1.8-.7 1.8-.7.4.9.2 1.6.1 1.8.4.5.7 1.1.7 1.8 0 2.6-1.6 3.1-3 3.3.2.2.4.6.4 1.2v1.8c0 .2.2.4.5.3A6.7 6.7 0 0 0 8 1.3z" /></svg>;

export function SettingsScreen({ page }: { page?: "snake" | "os" }) {
  const hat = useOS((s) => s.snakeHat);
  const nav = useNav();
  const tap = useTap();
  const pushSnake = () => nav.push({ title: "Snake Wardrobe", tone: "light", node: <div className="ios-list-page pad-top"><p className="ios-foot">Pick what the snake wears. It shows up on the desktop and in Messages.</p><div className="ios-group pad"><HatPicker /></div></div> });
  const pushOS = () => nav.push({ title: "About", tone: "light", node: <AboutOS /> });
  useEffect(() => { if (page === "snake") pushSnake(); if (page === "os") pushOS(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  const row = (fn: () => void) => ({ onPointerDown: tap.onPointerDown, onClick: (e: React.MouseEvent) => !tap.moved(e) && fn() });
  return (
    <div className="ios-list-page">
      <LargeTitle>Settings</LargeTitle>
      <div className="ios-group">
        <button type="button" className="ios-row profile" {...row(() => nav.push(screenFor({ app: "about" })))}>
          <img src={portrait} alt="" /><span className="tx"><b>Tianchi (Eric) Fu</b><small>AI PM · OpusClip · Singapore</small></span><Chevron />
        </button>
      </div>
      <div className="ios-group">
        <button type="button" className="ios-row" {...row(pushSnake)}><span className="ri mini"><MiniHead hat={hat} size={30} /></span><span className="tx"><b>Snake Wardrobe</b></span><Chevron /></button>
        <button type="button" className="ios-row" {...row(pushOS)}><AppTile id="settings" size={29} /><span className="tx"><b>About Tianchi OS</b></span><Chevron /></button>
      </div>
      <p className="ios-sec">Say hi</p>
      <div className="ios-group">
        <a className="ios-row" href={`mailto:${EMAIL}`}><RowIcon bg="#06c268"><MailGlyph /></RowIcon><span className="tx"><b>Email</b></span><small className="val">{EMAIL.split("@")[0]}</small><Chevron /></a>
        <a className="ios-row" href="https://www.linkedin.com/in/tianchi-fu/" target="_blank" rel="noopener noreferrer"><RowIcon bg="#0a66c2"><InGlyph /></RowIcon><span className="tx"><b>LinkedIn</b></span><Chevron /></a>
        <a className="ios-row" href="https://github.com/ericfu-tianchi" target="_blank" rel="noopener noreferrer"><RowIcon bg="#24292f"><GhGlyph /></RowIcon><span className="tx"><b>GitHub</b></span><Chevron /></a>
        <button type="button" className="ios-row" {...row(() => nav.push(screenFor({ app: "resume" })))}><AppTile id="resume" size={29} /><span className="tx"><b>Resume</b></span><Chevron /></button>
      </div>
      <div className="ios-group">
        <a className="ios-row" href="/?desktop"><AppTile id="files" size={29} /><span className="tx"><b>Desktop Website</b><small>The full Tianchi OS, best on a big screen</small></span><Chevron /></a>
      </div>
    </div>
  );
}

function AboutOS() {
  const best = readBest();
  const specs: [string, string][] = [
    ["Name", "Tianchi OS"], ["Owner", "Tianchi (Eric) Fu"], ["Model", "Tianchi Phone"], ["Chip", "Tianchi T1"], ["Capacity", "256 GB"],
    ["Your Snake best", best > 0 ? `${best} ${best === 1 ? "apple" : "apples"}` : "Not played yet"], ["Version", "1.0 (2026)"],
  ];
  return (
    <div className="ios-list-page pad-top">
      <div className="ios-group">
        {specs.map(([k, v]) => <div className="ios-row kv" key={k}><span className="tx"><b>{k}</b></span><small className="val">{v}</small></div>)}
      </div>
      <p className="ios-foot center">Made with Claude and ♥ by Tianchi</p>
    </div>
  );
}

/* ================= Resume ================= */

export function ResumeScreen() {
  return (
    <div className="ios-resume">
      <div className="page" style={{ aspectRatio: resume.aspect }}>
        <img src={resumePage} alt="Tianchi (Eric) Fu, Resume 2026" draggable={false} />
        {resume.links.map((l, i) => (
          <a key={i} href={l.href} target="_blank" rel="noopener" aria-label={l.href} style={{ left: `${l.left}%`, top: `${l.top}%`, width: `${l.width}%`, height: `${l.height}%` }} />
        ))}
      </div>
      <p className="meta">Tianchi-Fu-Resume-2026.pdf · 1 page · Links work</p>
    </div>
  );
}

/* ================= Hosted web apps ================= */

/** A hosted game keeps running in the background only while it's one of the most recent games; older ones unload and reload when you come back. */
export function GameFrame({ id }: { id: ExternalGameId }) {
  const { alive } = useAppState();
  return (
    <div className="ios-frame">
      {alive
        ? <iframe src={EXTERNAL_GAMES[id].url} title={EXTERNAL_GAMES[id].name} allow="autoplay; fullscreen" allowFullScreen />
        : <div className="ios-frame-idle"><AppTile id={`game:${id}`} size={72} /><b>{EXTERNAL_GAMES[id].name}</b></div>}
    </div>
  );
}
