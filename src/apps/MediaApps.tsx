import { useEffect, useMemo, useRef, useState } from "react";
import { mediaItem } from "../data/media";
import { useWindowChrome } from "../components/WindowChrome";

/**
 * Preview (images) and Player (videos), after macOS Preview / Quick Look and QuickTime:
 * a dark stage, the file fitted inside, controls that appear on hover.
 * Window: green control maximizes. Real full screen: the ⤢ button, F, or double-click.
 * ←/→ step through the folder (Preview). Space plays / pauses (Player). Esc leaves full screen.
 */

function useFullscreen(ref: React.RefObject<HTMLElement | null>) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const sync = () => setOn(document.fullscreenElement === ref.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, [ref]);
  const toggle = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void ref.current?.requestFullscreen?.();
  };
  return [on, toggle] as const;
}

const FS_ICON = (on: boolean) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    {on ? <path d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4" /> : <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />}
  </svg>
);

export function PreviewApp({ mediaId }: { mediaId?: string }) {
  const start = mediaItem(mediaId);
  const [index, setIndex] = useState(start?.index ?? 0);
  const stage = useRef<HTMLDivElement>(null);
  const [full, toggleFull] = useFullscreen(stage);
  const folder = start?.folder;
  const item = folder?.items[index];
  const count = folder?.items.length ?? 0;
  const go = (d: number) => count && setIndex((i) => (i + d + count) % count);

  const chrome = useMemo(() => ({ trail: [{ label: item?.name ?? "Preview" }], meta: count > 1 ? `${index + 1} of ${count}` : undefined }), [item, index, count]);
  useWindowChrome(chrome);
  useEffect(() => { stage.current?.focus(); }, []);
  // warm the neighbours so stepping is instant
  useEffect(() => {
    if (!folder) return;
    [1, -1].forEach((d) => { const n = folder.items[(index + d + count) % count]; if (n) new Image().src = n.src; });
  }, [folder, index, count]);

  if (!item) return <div className="media-stage"><p className="media-empty">This file is missing.</p></div>;
  return (
    <div
      ref={stage}
      className={`media-stage preview${full ? " full" : ""}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        else if (e.key === "ArrowLeft") go(-1);
        else if (e.key === "f" || e.key === "F") toggleFull();
      }}
    >
      <div className="media-frame"><img key={item.src} className="media-img" src={item.src} alt={item.name} draggable={false} onDoubleClick={toggleFull} /></div>
      {count > 1 && <>
        <button type="button" className="media-nav prev" aria-label="Previous image" onClick={() => go(-1)}><svg viewBox="0 0 16 16" aria-hidden><path d="M10 3.5 5.5 8l4.5 4.5" /></svg></button>
        <button type="button" className="media-nav next" aria-label="Next image" onClick={() => go(1)}><svg viewBox="0 0 16 16" aria-hidden><path d="m6 3.5 4.5 4.5L6 12.5" /></svg></button>
      </>}
      <div className="media-bar">
        <div className="media-cap">
          {full && <b>{item.name}</b>}
          {item.caption && <span>{item.caption}</span>}
          {item.credit && <small>{item.credit}</small>}
        </div>
        {full && count > 1 && <span className="media-count">{index + 1} / {count}</span>}
        <button type="button" className="media-btn" aria-label={full ? "Exit full screen" : "Full screen"} onClick={toggleFull}>{FS_ICON(full)}</button>
      </div>
    </div>
  );
}

const fmt = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

export function PlayerApp({ mediaId }: { mediaId?: string }) {
  const found = mediaItem(mediaId);
  const item = found?.item;
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [full, toggleFull] = useFullscreen(stage);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [muted, setMuted] = useState(false);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef(0);

  const chrome = useMemo(() => ({ trail: [{ label: item?.name ?? "Player" }] }), [item]);
  useWindowChrome(chrome);
  useEffect(() => { stage.current?.focus(); }, []);

  // controls fade out after 2s without movement while playing, like QuickTime
  const wake = () => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2000);
  };
  useEffect(() => () => window.clearTimeout(idleTimer.current), []);

  const toggle = () => { const v = video.current; if (!v) return; if (v.paused) void v.play(); else v.pause(); };

  if (!item) return <div className="media-stage"><p className="media-empty">This file is missing.</p></div>;

  if (item.youtube) {
    return (
      <div ref={stage} className={`media-stage player${full ? " full" : ""}`}>
        <iframe className="media-yt" src={`https://www.youtube-nocookie.com/embed/${item.youtube}?autoplay=1&rel=0&modestbranding=1`} title={item.name}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      </div>
    );
  }

  return (
    <div
      ref={stage}
      className={`media-stage player${full ? " full" : ""}${playing && idle ? " idle" : ""}`}
      tabIndex={0}
      onPointerMove={wake}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "k") { e.preventDefault(); toggle(); }
        else if (e.key === "f" || e.key === "F") toggleFull();
        else if (e.key === "ArrowRight" && video.current) video.current.currentTime += 5;
        else if (e.key === "ArrowLeft" && video.current) video.current.currentTime -= 5;
        else if (e.key === "m" && video.current) { video.current.muted = !video.current.muted; setMuted(video.current.muted); }
        wake();
      }}
    >
      <video
        ref={video}
        className="media-video"
        src={item.src}
        poster={item.thumb}
        autoPlay
        playsInline
        onClick={toggle}
        onDoubleClick={toggleFull}
        onPlay={() => { setPlaying(true); wake(); }}
        onPause={() => { setPlaying(false); setIdle(false); }}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
      />
      {!playing && <button type="button" className="media-bigplay" aria-label="Play" onClick={toggle}><svg viewBox="0 0 24 24" aria-hidden><path d="M8 5.5v13l11-6.5z" /></svg></button>}
      <div className="media-hud" onPointerDown={(e) => e.stopPropagation()}>
        <button type="button" className="media-btn" aria-label={playing ? "Pause" : "Play"} onClick={toggle}>
          <svg viewBox="0 0 16 16" aria-hidden>{playing ? <path d="M4.5 3h2.5v10H4.5zM9 3h2.5v10H9z" fill="currentColor" /> : <path d="M5 3v10l8-5z" fill="currentColor" />}</svg>
        </button>
        <span className="media-time">{fmt(t)}</span>
        <input className="media-scrub" type="range" min={0} max={dur || 0} step={0.1} value={t} aria-label="Seek"
          style={{ "--p": `${dur ? (t / dur) * 100 : 0}%` } as React.CSSProperties}
          onChange={(e) => { if (video.current) video.current.currentTime = Number(e.target.value); }} />
        <span className="media-time">-{fmt(Math.max(0, dur - t))}</span>
        <button type="button" className="media-btn" aria-label={muted ? "Unmute" : "Mute"} onClick={() => { if (!video.current) return; video.current.muted = !video.current.muted; setMuted(video.current.muted); }}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M2.5 6h2.5l3.5-3v10L5 10H2.5z" fill="currentColor" stroke="none" />{muted ? <path d="M11 6l4 4M15 6l-4 4" /> : <path d="M11 5.5c1 .7 1.5 1.5 1.5 2.5s-.5 1.8-1.5 2.5M12.8 3.8c1.5 1.1 2.3 2.5 2.3 4.2s-.8 3.1-2.3 4.2" />}</svg>
        </button>
        <button type="button" className="media-btn" aria-label={full ? "Exit full screen" : "Full screen"} onClick={toggleFull}>{FS_ICON(full)}</button>
      </div>
    </div>
  );
}
