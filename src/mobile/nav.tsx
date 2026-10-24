import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Route } from "./model";

/** A screen inside a running app. Apps start with one and push more (Files → folder → file). */
export type Tone = "light" | "dark" | "black";
export type Screen = {
  key: string;
  title: string;
  node: ReactNode;
  tone: Tone;
  /** a big title scrolls with the content; the bar shows the small one once it's gone (iOS large titles) */
  large?: boolean;
  /** the screen draws its own chrome (photo viewer, games) */
  bare?: boolean;
  /** extra control on the right of the bar */
  action?: ReactNode;
};

export type Nav = {
  open: (route: Route, from?: Element | null) => void;
  push: (s: Omit<Screen, "key">) => void;
  pop: () => void;
  home: () => void;
};

export const NavContext = createContext<Nav | null>(null);
export const useNav = () => {
  const n = useContext(NavContext);
  if (!n) throw new Error("useNav outside the iOS shell");
  return n;
};

/** Whether this app is on screen. Apps in the background stop their loops and media so a long visit never slows down.
    shown: drawn (the front app, or a card in the app switcher). front: the one being used.
    alive: may keep heavy content (a game's iframe) while in the background; only the most recent games do. */
export const AppState = createContext<{ shown: boolean; front: boolean; alive: boolean }>({ shown: true, front: true, alive: true });
export const useAppState = () => useContext(AppState);

/** The screen's own scroll container, so a screen can listen to it (large titles). */
export const ScrollContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

const BackIcon = () => <svg viewBox="0 0 12 20" aria-hidden><path d="M10 2 2 10l8 8" /></svg>;
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden><path d="M3.5 10.6 12 3.8l8.5 6.8" /><path d="M5.8 9v10.2h4.4v-5.6h3.6v5.6h4.4V9" /></svg>
);

/** iOS navigation bar: Back (with the previous title) inside an app, Home at an app's first screen. */
export function NavBar({ screen, prev, onBack, onHome, scroller }: {
  screen: Screen;
  prev?: Screen;
  onBack: () => void;
  onHome: () => void;
  scroller: React.RefObject<HTMLDivElement | null>;
}) {
  const [scrolled, setScrolled] = useState(!screen.large);
  useEffect(() => {
    const el = scroller.current;
    if (!el || !screen.large) return;
    const f = () => setScrolled(el.scrollTop > 38);
    f();
    el.addEventListener("scroll", f, { passive: true });
    return () => el.removeEventListener("scroll", f);
  }, [scroller, screen.large]);
  return (
    <header className={`ios-nav ${screen.large ? "large" : ""} ${scrolled ? "scrolled" : ""}`}>
      {prev ? (
        <button type="button" className="ios-back" onClick={onBack} aria-label={`Back to ${prev.title}`}><BackIcon /><span>{prev.title}</span></button>
      ) : (
        <button type="button" className="ios-back home" onClick={onHome} aria-label="Home"><HomeIcon /><span>Home</span></button>
      )}
      <b className="ios-nav-title">{screen.title}</b>
      <span className="ios-nav-action">{screen.action}</span>
    </header>
  );
}

/** The big title at the top of a list screen. */
export function LargeTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return <div className="ios-large"><h1>{children}</h1>{sub && <p>{sub}</p>}</div>;
}

/** Pointer helper: a tap that doesn't fire when the finger moved (scrolling, paging). */
export function useTap() {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onPointerDown: (e: React.PointerEvent) => { start.current = { x: e.clientX, y: e.clientY }; },
    moved: (e: React.MouseEvent) => !!start.current && Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 8,
  };
}
