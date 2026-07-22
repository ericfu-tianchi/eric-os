import { useEffect, useState } from "react";
import type { AppId, IconPosition } from "../store";
import { gridSpec, type PixIconName } from "./Pixel";
import { filesystemNode } from "../data/filesystem";

export const TOPBAR = 34; // menubar height (keep in sync with --menubar-h in styles.css)

export interface IconDef {
  key: string;
  label: string;
  icon: PixIconName;
  app: AppId;
  title: string;
  payload?: string;
  maximized?: boolean;
  cellRight: number; // column, counted from the RIGHT edge
  row: number; // grid row, from the top
}

/** Desktop icons live ON the grid: one icon = one cell. */
const folderIcon = (key: "school" | "huawei" | "opus" | "selected" | "website" | "ai", cellRight: number, row: number): IconDef => {
  const node = filesystemNode(key)!;
  return { key, label: node.name, icon: "folder", app: "filesystem", title: node.name, payload: node.id, cellRight, row };
};

/** Desktop = the six project roots plus the small system utilities. Each folder opens
    the same canonical node that Tianchintosh HD exposes, never a duplicate view. */
export const ICONS: IconDef[] = [
  folderIcon("school", 2, 1),
  folderIcon("huawei", 5, 1),
  folderIcon("opus", 8, 1),
  folderIcon("selected", 2, 4),
  folderIcon("website", 5, 4),
  folderIcon("ai", 8, 4),
  { key: "about", label: "About_Me.md", icon: "doc", app: "about", title: "About_Me.md", cellRight: 2, row: 7 },
  { key: "resume", label: "resume.pdf", icon: "pdf", app: "resume", title: "resume.pdf", cellRight: 5, row: 7 },
  { key: "snake", label: "Snake", icon: "snake", app: "snake", title: "Snake", cellRight: 8, row: 7 },
  { key: "disk", label: "Tianchintosh HD", icon: "computer", app: "filesystem", title: "Tianchintosh HD", payload: "tianchintosh", cellRight: 2, row: 10 },
  { key: "settings", label: "Settings", icon: "gear", app: "prefs", title: "Settings", cellRight: 5, row: 10 },
];

export type GridSpec = ReturnType<typeof gridSpec>;

/** The hit/label box is deliberately wider than a single 44px grid cell. */
export const ICON_BOX_W = 104;
export const ICON_BOX_H = 104;
const ICON_EDGE = 4;

/** icon glyph size: fills a full grid cell (Eric's spec — icon width ≈ one cell) */
export const iconGlyph = (s: GridSpec) => Math.round(Math.min(s.cellW, s.cellH));

/** default pixel position for an icon def so its glyph centers on its grid cell */
export function iconDefaultPos(d: IconDef, s: GridSpec) {
  return iconPosForCell([s.cols - d.cellRight, d.row], s);
}

export function clampIconCell([col, row]: [number, number], s: GridSpec): [number, number] {
  return [Math.max(0, Math.min(col, s.cols - 1)), Math.max(0, Math.min(row, s.rows - 1))];
}

/** Keep the entire icon AND its filename visible, even after a screen change. */
export function clampIconPosition(
  { x, y }: { x: number; y: number },
  s: GridSpec
) {
  const width = s.cellW * s.cols;
  const height = s.cellH * s.rows;
  return {
    x: Math.max(ICON_EDGE, Math.min(Math.round(x), Math.max(ICON_EDGE, width - ICON_BOX_W - ICON_EDGE))),
    y: Math.max(ICON_EDGE, Math.min(Math.round(y), Math.max(ICON_EDGE, height - ICON_BOX_H - ICON_EDGE))),
  };
}

/** Pixel coordinates for a whole grid cell, with a second physical-edge clamp
    because a 104px file icon is wider than one 44px desktop cell. */
export function iconPosForCell(cell: [number, number], s: GridSpec) {
  const [col, row] = clampIconCell(cell, s);
  const g = iconGlyph(s);
  return clampIconPosition({
    x: (col + 0.5) * s.cellW - ICON_BOX_W / 2,
    y: (row + 0.5) * s.cellH - (9 + g / 2),
  }, s);
}

/** Convert a free-drag pixel position back into its closest desktop cell. */
export function iconCellAtPosition({ x, y }: { x: number; y: number }, s: GridSpec): [number, number] {
  const g = iconGlyph(s);
  return clampIconCell([
    Math.floor((x + ICON_BOX_W / 2) / s.cellW),
    Math.floor((y + 9 + g / 2) / s.cellH),
  ], s);
}

function rightPinnedFreePosition(pos: IconPosition, s: GridSpec) {
  const width = s.cellW * s.cols;
  return clampIconPosition({ x: width - pos.rightPx! - ICON_BOX_W, y: pos.y }, s);
}

/** A saved icon always resolves to a visible cell, including legacy pixel-only positions.
    New positions use `right`, so the file column stays visually pinned to the right
    while the left-anchored hello wordmark gets more breathing room on wide displays. */
export function iconCellOf(d: IconDef, pos: IconPosition | undefined, s: GridSpec): [number, number] {
  if (pos?.rightPx !== undefined) return iconCellAtPosition(rightPinnedFreePosition(pos, s), s);
  if (pos?.right !== undefined && pos.row !== undefined) return clampIconCell([s.cols - pos.right, pos.row], s);
  if (pos?.col !== undefined && pos.row !== undefined) return clampIconCell([pos.col, pos.row], s);
  if (!pos) return clampIconCell([s.cols - d.cellRight, d.row], s);
  return iconCellAtPosition(pos, s);
}

export function iconVisiblePos(d: IconDef, pos: IconPosition | undefined, s: GridSpec) {
  if (pos?.rightPx !== undefined) return rightPinnedFreePosition(pos, s);
  return iconPosForCell(iconCellOf(d, pos, s), s);
}

export function useGridSpec(): GridSpec {
  const [spec, setSpec] = useState(() => gridSpec(window.innerWidth, window.innerHeight - TOPBAR));
  useEffect(() => {
    const fn = () => setSpec(gridSpec(window.innerWidth, window.innerHeight - TOPBAR));
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return spec;
}
