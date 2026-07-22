import { createContext, useContext, useEffect, type Dispatch, type SetStateAction } from "react";

export type WindowCrumb = { label: string; onClick?: () => void };
export type WindowNavigation = {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
};
export type WindowViewMode = "icon" | "list";
export type WindowViewControls = { mode: WindowViewMode; onChange: (mode: WindowViewMode) => void };
export type WindowChromeState = {
  trail: WindowCrumb[];
  meta?: string;
  /** Finder windows use a centered location name instead of breadcrumbs. */
  centeredTitle?: string;
  navigation?: WindowNavigation;
  viewControls?: WindowViewControls;
};

const WindowChromeContext = createContext<Dispatch<SetStateAction<WindowChromeState | null>> | null>(null);

export function WindowChromeProvider({
  setChrome,
  children,
}: {
  setChrome: Dispatch<SetStateAction<WindowChromeState | null>>;
  children: React.ReactNode;
}) {
  return <WindowChromeContext.Provider value={setChrome}>{children}</WindowChromeContext.Provider>;
}

/** Lets an app place its Finder-like location trail in the shared window chrome. */
export function useWindowChrome(chrome: WindowChromeState) {
  const setChrome = useContext(WindowChromeContext);
  if (!setChrome) throw new Error("useWindowChrome must be used inside WindowFrame");
  useEffect(() => {
    setChrome(chrome);
    return () => setChrome(null);
  }, [chrome, setChrome]);
}
