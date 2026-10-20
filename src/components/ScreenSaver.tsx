import { useEffect, useRef } from "react";
import { useOS, SAVER_IDS } from "../store";
import { SAVERS } from "./screensavers";

/**
 * Starts the chosen screen saver after `saverDelay` idle minutes (Settings),
 * like macOS. Never while the visitor plays Snake or has focus inside an
 * embedded game (iframe input never reaches this page). Any move, key, click
 * or scroll ends it; the click that ends it doesn't reach the desktop.
 */
export function ScreenSaver() {
  const { saver, saverDelay, saverActive, setSaverActive } = useOS();
  const cv = useRef<HTMLCanvasElement>(null);

  // idle timer
  useEffect(() => {
    if (!saverDelay || saverActive) return;
    let t = 0;
    const arm = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const s = useOS.getState();
        if (s.snakeMode || document.activeElement?.tagName === "IFRAME") return arm();
        setSaverActive(true);
      }, saverDelay * 60_000);
    };
    const evs = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;
    evs.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    arm();
    return () => { window.clearTimeout(t); evs.forEach((e) => window.removeEventListener(e, arm)); };
  }, [saverDelay, saverActive, setSaverActive]);

  // run + wake
  useEffect(() => {
    if (!saverActive || !cv.current) return;
    const canvas = cv.current, dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const ctx = canvas.getContext("2d")!;
    const engine = SAVERS[saver].make(W, H);
    let raf = 0, last = performance.now();
    const frame = (ts: number) => {
      engine.step(Math.max(0, Math.min((ts - last) / 1000, 0.1))); last = ts;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); engine.draw(ctx, ts / 1000);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    // ignore the first half second (the click on "Preview" shouldn't end it) and tiny pointer jitter
    const born = performance.now(); let moved = 0, px = -1, py = -1;
    const wake = (e?: Event) => {
      if (performance.now() - born < 500) return;
      if (e && e.type !== "wheel") {
        // the press that wakes the screen shouldn't also click or drag what's underneath
        e.stopPropagation();
        const eat = (c: Event) => { c.stopPropagation(); c.preventDefault(); };
        window.addEventListener("click", eat, { capture: true, once: true });
        window.setTimeout(() => window.removeEventListener("click", eat, { capture: true }), 600);
      }
      setSaverActive(false);
    };
    const onMove = (e: PointerEvent) => {
      if (px >= 0) moved += Math.abs(e.clientX - px) + Math.abs(e.clientY - py);
      px = e.clientX; py = e.clientY;
      if (moved > 8) wake();
    };
    const evs = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    evs.forEach((e) => window.addEventListener(e, wake, { capture: true }));
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      evs.forEach((e) => window.removeEventListener(e, wake, { capture: true }));
      window.removeEventListener("pointermove", onMove);
    };
  }, [saverActive, saver, setSaverActive]);

  if (!saverActive) return null;
  return (
    <div className="screensaver" onClickCapture={(e) => e.stopPropagation()} aria-hidden>
      <canvas ref={cv} />
    </div>
  );
}

/** Settings: every screen saver as a live thumbnail, like macOS. Each runs a miniature of the real thing. */
export function SaverPicker() {
  const { saver, setSaver } = useOS();
  const refs = useRef<(HTMLCanvasElement | null)[]>([]);
  const ids = SAVER_IDS;
  useEffect(() => {
    const VW = 480, VH = 300; // draw the real saver at a small "screen", then scale it into the tile
    const runs = refs.current.map((cv, i) => {
      if (!cv) return null;
      const dpr = window.devicePixelRatio || 1, r = cv.getBoundingClientRect();
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      return { ctx: cv.getContext("2d")!, k: (r.width * dpr) / VW, engine: SAVERS[ids[i]].make(VW, VH) };
    });
    let raf = 0, last = performance.now();
    const frame = (ts: number) => {
      const dt = Math.max(0, Math.min((ts - last) / 1000, 0.1)); last = ts;
      for (const run of runs) {
        if (!run) continue;
        run.engine.step(dt); run.ctx.setTransform(run.k, 0, 0, run.k, 0, 0); run.engine.draw(run.ctx, ts / 1000);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [ids]);
  return (
    <div className="saver-picker" role="radiogroup" aria-label="Screen saver">
      {ids.map((id, i) => (
        <button key={id} type="button" role="radio" aria-checked={saver === id} className={saver === id ? "on" : ""} onClick={() => setSaver(id)}>
          <canvas ref={(el) => { refs.current[i] = el; }} />
          <span>{SAVERS[id].label}</span>
        </button>
      ))}
    </div>
  );
}
