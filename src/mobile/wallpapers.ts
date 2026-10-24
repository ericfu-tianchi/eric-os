/**
 * Wallpaper snakes for the phone's Home Screen, drawn on the same grid as everything else.
 * Coordinates live on a 24-column canvas that spans both Home pages (12 columns each):
 * col 0–11 = page 1, col 12–23 = page 2; rows count up from the bottom of the free area (0 = lowest).
 *
 * The head sits on page 1, low, in the free rows under the icons (the game starts from it without a cut);
 * the body runs off to the right and writes "hi" on page 2. Drawn by Tianchi in /wall-studio.html.
 * The last cell of `cells` is the head. ?wall=custom shows the design last previewed from the studio.
 */
export type Cell = [number, number];
export type Wallpaper = { id: number; name: string; cells: Cell[]; apples: Cell[] };

/** Tianchi's design (wall-studio export, 2026-10-24): tail → head */
const HI: Wallpaper = {
  id: 1, name: "hi",
  cells: [[15, 8], [15, 7], [15, 6], [14, 8], [14, 7], [14, 6], [14, 9], [15, 9], [20, 5], [20, 4], [20, 3], [20, 2], [20, 1], [19, 1], [18, 1], [17, 1], [17, 2], [17, 3], [17, 4], [17, 5], [16, 5], [15, 5], [14, 5], [14, 4], [14, 3], [14, 2], [14, 1], [13, 1], [12, 1], [11, 1], [10, 1], [9, 1]],
  apples: [],
};
export const WALLPAPERS: Wallpaper[] = [HI];

const query = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
/** ?wall=custom: the design last previewed from /wall-studio.html (kept in this browser) */
const custom = (): Wallpaper | null => {
  try { const d = JSON.parse(localStorage.getItem("eric-os-wall-custom") || "null"); return d?.cells?.length ? { id: 0, name: "Custom", cells: d.cells, apples: d.apples ?? [] } : null; } catch { return null; }
};
export const currentWallpaper = (): Wallpaper => (query.get("wall") === "custom" && custom()) || HI;

/** direction of travel at the head: [dx, dy] in canvas units (dy up = +1) */
export const headDir = (cells: Cell[]): Cell => {
  const [a, b] = [cells[cells.length - 2], cells[cells.length - 1]];
  return [Math.sign(b[0] - a[0]), Math.sign(b[1] - a[1])];
};

/** the part of the snake on page 1 (head end): what the game picks up */
export const page1Part = (cells: Cell[]) => {
  let i = cells.length - 1;
  while (i > 0 && cells[i - 1][0] <= 11) i--;
  return cells.slice(i);
};
