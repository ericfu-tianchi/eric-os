/**
 * Wallpaper snakes for the phone's Home Screen, drawn on the same grid as everything else.
 * Coordinates live on a 24-column canvas that spans both Home pages (12 columns each):
 * col 0–11 = page 1, col 12–23 = page 2; rows count up from the bottom of the free area (0 = lowest).
 *
 * Every design keeps the head on page 1, low, in the free rows under the icons (so the game can start
 * from it without a cut), and lets the body run off to the right into page 2, where it makes the picture.
 * The last cell of `cells` is the head. Pick one while reviewing with ?wall=1…5 (and ?apple=0 to drop the apple).
 */
export type Cell = [number, number];
export type Wallpaper = { id: number; name: string; cells: Cell[]; apples: Cell[] };

const walk = (start: Cell, moves: string): Cell[] => {
  const out: Cell[] = [start];
  let [x, y] = start;
  for (const m of moves.replace(/\s/g, "")) {
    if (m === "R") x++; else if (m === "L") x--; else if (m === "U") y++; else if (m === "D") y--;
    out.push([x, y]);
  }
  return out;
};
const dedupe = (cells: Cell[]) => cells.filter((c, i) => cells.findIndex((d) => d[0] === c[0] && d[1] === c[1]) === i);

/** page 1: the body comes in from the right edge, steps up once, and the head looks left at the apple */
const PAGE1: Cell[] = walk([11, 1], "LLL U LLL"); // ends at (5, 2), heading left
const APPLE1: Cell = [2, 2];

/** page 2 patterns; each ends at (12, 1), right where page 1 picks up */
const hi: Cell[] = dedupe([
  ...walk([15, 8], "DDDDDDD"), // h stem
  ...walk([16, 5], "RR"), ...walk([18, 4], "DDD"), // h shoulder and leg
  ...walk([19, 1], "RR"), // the join into the i
  ...walk([21, 2], "UUU"), // i stem; its dot is an apple
  ...walk([14, 1], "LL"), // out to page 1
]);
const HI_DOT: Cell = [21, 7];

/** one clean bend: up the page and over */
const bend: Cell[] = walk([20, 7], "DDDDDD LLLLLLL");

/** just a short tail on page 2: the quietest version */
const short: Cell[] = walk([15, 1], "LL");

/** one long wave across page 2 */
const wave: Cell[] = (() => {
  const out: Cell[] = [];
  for (let x = 23; x >= 12; x--) {
    const y = Math.round(4 + 2.6 * Math.sin((x - 12) / 1.9));
    const prev = out[out.length - 1];
    if (prev) for (let k = prev[1]; k !== y; k += Math.sign(y - k)) if (k !== prev[1]) out.push([prev[0], k]);
    out.push([x, y]);
  }
  const end = out[out.length - 1]; // drop the last column down to row 1 to meet page 1
  for (let k = end[1] - 1; k >= 1; k--) out.push([12, k]);
  return out;
})();

/** a ring around an apple, closing at the bottom where the body leaves for page 1 */
const ring: Cell[] = walk([16, 1], "RRRR UUUUUU LLLLLL DDDDDD LL");

export const WALLPAPERS: Wallpaper[] = [
  { id: 1, name: "hi", cells: [...hi, ...PAGE1], apples: [HI_DOT] },
  { id: 2, name: "Bend", cells: [...bend, ...PAGE1], apples: [] },
  { id: 3, name: "Short", cells: [...short, ...PAGE1], apples: [] },
  { id: 4, name: "Wave", cells: [...wave, ...PAGE1], apples: [] },
  { id: 5, name: "Ring", cells: [...ring, ...PAGE1], apples: [[17, 4]] },
];

const query = typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search);
/** ?wall=custom: the design last previewed from /wall-studio.html (kept in this browser) */
const custom = (): Wallpaper | null => {
  try { const d = JSON.parse(localStorage.getItem("eric-os-wall-custom") || "null"); return d?.cells?.length ? { id: 0, name: "Custom", cells: d.cells, apples: d.apples ?? [] } : null; } catch { return null; }
};
export const wallpaperFor = (id: number): Wallpaper => {
  if (query.get("wall") === "custom") { const c = custom(); if (c) return c; } // the studio draws its own apples
  const w = WALLPAPERS.find((x) => x.id === id) ?? WALLPAPERS[0];
  return query.get("apple") === "0" ? w : { ...w, apples: [...w.apples, APPLE1] };
};

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
