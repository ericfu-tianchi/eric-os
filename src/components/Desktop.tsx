import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FitName } from "./FitName";
import { useOS } from "../store";
import { PixIcon } from "./Pixel";
import {
  ICON_BOX_H,
  ICON_BOX_W,
  ICONS,
  TOPBAR,
  clampIconPosition,
  iconCellAtPosition,
  iconDefaultPos,
  iconGlyph,
  iconPosForCell,
  iconVisiblePos,
  useGridSpec,
  type IconDef,
  type GridSpec,
} from "./desktopGrid";
import { DesktopSnake } from "./DesktopSnake";
import { SnakeGuide } from "./SnakeGuide";

type Point = { x: number; y: number };
type Marquee = { start: Point; end: Point };
type ContextMenu = { x: number; y: number; kind: "desktop" | "selection" };
type IconDrag = {
  pointerId: number;
  start: Point;
  origins: Record<string, Point>;
  moved: boolean;
};

const MENU_W = 150;
const MENU_H = 82;

function rectOf(m: Marquee) {
  return {
    left: Math.min(m.start.x, m.end.x),
    top: Math.min(m.start.y, m.end.y),
    right: Math.max(m.start.x, m.end.x),
    bottom: Math.max(m.start.y, m.end.y),
  };
}

function intersects(a: { left: number; top: number; right: number; bottom: number }, b: { left: number; top: number; right: number; bottom: number }) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function DesktopIcon({
  def,
  spec,
  selected,
  dragging,
  dockInvalid,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onContextMenu,
}: {
  def: IconDef;
  spec: GridSpec;
  selected: boolean;
  dragging: boolean;
  dockInvalid: boolean;
  onPointerDown: (event: React.PointerEvent, key: string) => void;
  onPointerMove: (event: React.PointerEvent) => void;
  onPointerUp: (event: React.PointerEvent) => void;
  onContextMenu: (event: React.MouseEvent, key: string) => void;
}) {
  const { open, iconPos, setIconPos, setSnakeMode } = useOS();
  const ref = useRef<HTMLButtonElement>(null);
  const savedPos = iconPos[def.key];
  const pos = dragging && savedPos ? savedPos : iconVisiblePos(def, savedPos, spec);
  const iconArt = <><PixIcon name={def.icon} size={iconGlyph(spec)} /><span className="label"><FitName className="label-text" text={def.label} lines={2} /></span></>;

  // Existing absolute placements become right-anchored the first time they are seen.
  useEffect(() => {
    if (!savedPos || savedPos.right !== undefined || savedPos.rightPx !== undefined || dragging) return;
    const [col, row] = iconCellAtPosition(savedPos, spec);
    const snapped = iconPosForCell([col, row], spec);
    setIconPos(def.key, snapped.x, snapped.y, { right: spec.cols - col, row });
  }, [def.key, dragging, savedPos, setIconPos, spec]);

  return (
    <>
    <button
      ref={ref}
      className={`dicon ${selected ? "selected" : ""} ${dragging ? "dragging" : ""} ${dockInvalid ? "dock-drop-invalid" : ""}`}
      style={{ left: pos.x, top: pos.y, background: "none" }}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        ref.current?.setPointerCapture(event.pointerId);
        onPointerDown(event, def.key);
      }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onContextMenu={(event) => onContextMenu(event, def.key)}
      onDoubleClick={() => (
        def.app === "snake"
          ? setSnakeMode(true)
          : open(def.app, { title: def.title, payload: def.payload, maximized: def.maximized })
      )}
      aria-label={`${def.label} — double-click to open`}
    >
      {iconArt}
    </button>
    {dragging && createPortal(
      <div
        className={`dicon dicon-drag-preview dragging ${dockInvalid ? "dock-drop-invalid" : ""}`}
        style={{ left: pos.x, top: pos.y + TOPBAR, background: "none" }}
        aria-hidden="true"
      >
        {iconArt}
      </div>,
      document.body
    )}
    </>
  );
}

export function Desktop({ children }: { children?: React.ReactNode }) {
  const { snakeMode, iconPos, setIconPos, open, setSnakeMode } = useOS();
  const spec = useGridSpec();
  const desktopRef = useRef<HTMLElement>(null);
  const iconDrag = useRef<IconDrag | null>(null);
  const marqueeRef = useRef<Marquee | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [draggingKeys, setDraggingKeys] = useState<string[]>([]);
  const [dockDropKeys, setDockDropKeys] = useState<string[]>([]);
  const [marquee, setMarquee] = useState<Marquee | null>(null);
  const [context, setContext] = useState<ContextMenu | null>(null);
  const vars = { "--cell-w": `${spec.cellW}px`, "--cell-h": `${spec.cellH}px` } as React.CSSProperties;

  const pointInDesktop = (event: { clientX: number; clientY: number }): Point => {
    const rect = desktopRef.current?.getBoundingClientRect();
    return { x: event.clientX - (rect?.left ?? 0), y: event.clientY - (rect?.top ?? 0) };
  };

  const showContext = (event: { clientX: number; clientY: number }, kind: ContextMenu["kind"]) => {
    const x = Math.max(10, Math.min(event.clientX, window.innerWidth - MENU_W - 10));
    const y = Math.max(10, Math.min(event.clientY, window.innerHeight - MENU_H - 10));
    setContext({ x, y, kind });
  };

  const storeFreePosition = (key: string, pos: Point) => {
    const free = clampIconPosition(pos, spec);
    const desktopWidth = spec.cellW * spec.cols;
    // Preserve the exact visual offset from the right — no invisible grid snap.
    setIconPos(key, free.x, free.y, { rightPx: Math.round(desktopWidth - free.x - ICON_BOX_W) });
  };

  const dockHitKeys = (origins: Record<string, Point>, dx: number, dy: number) => {
    const dock = document.querySelector(".dock")?.getBoundingClientRect();
    const desktop = desktopRef.current?.getBoundingClientRect();
    if (!dock || !desktop) return [];
    return Object.entries(origins).flatMap(([key, origin]) => {
      const pos = clampIconPosition({ x: origin.x + dx, y: origin.y + dy }, spec);
      const rect = {
        left: desktop.left + pos.x,
        top: desktop.top + pos.y,
        right: desktop.left + pos.x + ICON_BOX_W,
        bottom: desktop.top + pos.y + ICON_BOX_H,
      };
      return intersects(rect, dock) ? [key] : [];
    });
  };

  const sortDesktop = () => {
    ICONS.forEach((icon) => {
      const pos = iconDefaultPos(icon, spec);
      setIconPos(icon.key, pos.x, pos.y, { right: icon.cellRight, row: icon.row });
    });
    setSelectedKeys([]);
    setContext(null);
  };

  const openSelection = () => {
    const selected = ICONS.filter((icon) => selectedKeys.includes(icon.key));
    if (selected.length === 0) return;
    const snake = selected.find((icon) => icon.app === "snake");
    selected
      .filter((icon) => icon.app !== "snake")
      .forEach((icon) => open(icon.app, { title: icon.title, payload: icon.payload, maximized: icon.maximized }));
    // Snake is inherently full-screen. Opening it on the next frame lets every
    // other chosen file register first, then deliberately clears the desktop.
    if (snake) window.requestAnimationFrame(() => setSnakeMode(true));
    setContext(null);
  };

  const onIconPointerDown = (event: React.PointerEvent, key: string) => {
    setContext(null);
    const keys = selectedKeys.includes(key) ? selectedKeys : [key];
    if (!selectedKeys.includes(key)) setSelectedKeys(keys);
    const origins: Record<string, Point> = {};
    keys.forEach((selectedKey) => {
      const icon = ICONS.find((item) => item.key === selectedKey);
      if (icon) origins[selectedKey] = iconVisiblePos(icon, iconPos[selectedKey], spec);
    });
    iconDrag.current = { pointerId: event.pointerId, start: pointInDesktop(event), origins, moved: false };
  };

  const onIconPointerMove = (event: React.PointerEvent) => {
    const drag = iconDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const point = pointInDesktop(event);
    const dx = point.x - drag.start.x;
    const dy = point.y - drag.start.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    const keys = Object.keys(drag.origins);
    setDraggingKeys(keys);
    keys.forEach((key) => {
      const origin = drag.origins[key];
      const pos = clampIconPosition({ x: origin.x + dx, y: origin.y + dy }, spec);
      setIconPos(key, pos.x, pos.y);
    });
    setDockDropKeys(dockHitKeys(drag.origins, dx, dy));
  };

  const onIconPointerUp = (event: React.PointerEvent) => {
    const drag = iconDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.moved) {
      const point = pointInDesktop(event);
      const dx = point.x - drag.start.x;
      const dy = point.y - drag.start.y;
      const invalidKeys = dockHitKeys(drag.origins, dx, dy);
      Object.entries(drag.origins).forEach(([key, origin]) => {
        // A dock overlap cancels the whole grouped drop, keeping its original layout intact.
        storeFreePosition(key, invalidKeys.length > 0 ? origin : { x: origin.x + dx, y: origin.y + dy });
      });
    }
    iconDrag.current = null;
    setDraggingKeys([]);
    setDockDropKeys([]);
  };

  const onDesktopPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest(".dicon, .desktop-context")) return;
    setContext(null);
    setSelectedKeys([]);
    const point = pointInDesktop(event);
    const next = { start: point, end: point };
    marqueeRef.current = next;
    setMarquee(next);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onDesktopPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const active = marqueeRef.current;
    if (!active) return;
    const next = { ...active, end: pointInDesktop(event) };
    marqueeRef.current = next;
    setMarquee(next);
    const selection = rectOf(next);
    setSelectedKeys(ICONS.filter((icon) => {
      const pos = iconVisiblePos(icon, iconPos[icon.key], spec);
      return intersects(selection, { left: pos.x, top: pos.y, right: pos.x + ICON_BOX_W, bottom: pos.y + ICON_BOX_H });
    }).map((icon) => icon.key));
  };

  const onDesktopPointerUp = () => {
    marqueeRef.current = null;
    setMarquee(null);
  };

  const onDesktopContext = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest(".dicon")) return;
    event.preventDefault();
    setSelectedKeys([]);
    showContext(event, "desktop");
  };

  // A display resize may move a right-pinned file onto the dock. Only the dock's
  // actual rectangle is protected — bottom-left and bottom-right remain usable.
  useEffect(() => {
    if (draggingKeys.length > 0) return;
    const dock = document.querySelector(".dock")?.getBoundingClientRect();
    const desktop = desktopRef.current?.getBoundingClientRect();
    if (!dock || !desktop) return;
    ICONS.forEach((icon) => {
      const pos = iconVisiblePos(icon, iconPos[icon.key], spec);
      const fileRect = {
        left: desktop.left + pos.x,
        top: desktop.top + pos.y,
        right: desktop.left + pos.x + ICON_BOX_W,
        bottom: desktop.top + pos.y + ICON_BOX_H,
      };
      if (!intersects(fileRect, dock)) return;
      storeFreePosition(icon.key, { x: pos.x, y: dock.top - desktop.top - ICON_BOX_H - 8 });
    });
  }, [draggingKeys.length, iconPos, spec]);

  const onIconContext = (event: React.MouseEvent, key: string) => {
    event.preventDefault();
    event.stopPropagation();
    if (!selectedKeys.includes(key)) setSelectedKeys([key]);
    showContext(event, "selection");
  };

  const selectionBox = marquee ? rectOf(marquee) : null;
  return (
    <main
      ref={desktopRef}
      className="desktop"
      style={vars}
      onPointerDown={onDesktopPointerDown}
      onPointerMove={onDesktopPointerMove}
      onPointerUp={onDesktopPointerUp}
      onContextMenu={onDesktopContext}
    >
      <div className="gridlayer" aria-hidden />
      {!snakeMode && <DesktopSnake frozen />}
      {!snakeMode && <SnakeGuide />}
      {!snakeMode && ICONS.map((icon) => (
        <DesktopIcon
          key={icon.key}
          def={icon}
          spec={spec}
          selected={selectedKeys.includes(icon.key)}
          dragging={draggingKeys.includes(icon.key)}
          dockInvalid={dockDropKeys.includes(icon.key)}
          onPointerDown={onIconPointerDown}
          onPointerMove={onIconPointerMove}
          onPointerUp={onIconPointerUp}
          onContextMenu={onIconContext}
        />
      ))}
      {selectionBox && (
        <div
          className="selection-marquee"
          style={{ left: selectionBox.left, top: selectionBox.top, width: selectionBox.right - selectionBox.left, height: selectionBox.bottom - selectionBox.top }}
          aria-hidden
        />
      )}
      {context?.kind === "desktop" && (
        <div className="desktop-context" style={{ left: context.x, top: context.y }} role="menu">
          <button type="button" onClick={sortDesktop}>Sort</button>
          <button type="button" onClick={() => { open("prefs", { title: "Settings" }); setContext(null); }}>Settings</button>
        </div>
      )}
      {context?.kind === "selection" && (
        <div className="desktop-context" style={{ left: context.x, top: context.y }} role="menu">
          <button type="button" onClick={openSelection}>Open</button>
        </div>
      )}
      {children}
    </main>
  );
}
