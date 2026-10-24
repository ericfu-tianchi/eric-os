import { ERIC_POSE } from "../components/DesktopSnake";

/**
 * Wallpaper snakes for the phone's Home Screen, drawn on the same grid as everything else.
 * Coordinates live on a 24-column canvas that spans both Home pages (12 columns each):
 * col 0–11 = page 1, col 12–23 = page 2; rows count up from the bottom of the free area (0 = lowest).
 * The last cell of `cells` is the head. Pick one while reviewing with ?wall=1…5.
 */
export type Cell = [number, number];
export type Wallpaper = {
  id: number;
  name: string;
  cells: Cell[];
  apples: Cell[];
  /** the art uses page 1's lower rows, so page 1 drops its small widgets */
  page1: boolean;
  /** tap the snake to play: the game starts from exactly this pose */
  playable?: boolean;
  hint?: string;
};

const path = (start: Cell, moves: string): Cell[] => {
  const out: Cell[] = [start];
  let [x, y] = start;
  for (const m of moves.replace(/\s/g, "")) {
    if (m === "R") x++; else if (m === "L") x--; else if (m === "U") y++; else if (m === "D") y--;
    out.push([x, y]);
  }
  return out;
};

// 1 · the desktop's own cursive "hello", 24 cells wide: exactly two pages
const hello: Cell[] = ERIC_POSE.map(([x, y]) => [x, 11 - y] as Cell);

// 2 · a long snake slides from page 1 into page 2, after an apple
const chase = path([0, 1], "RRR U RRR D RRR UU RRR D RRR D RRR UU RR");

// 3 · page 2: a snake runs the border of the page, head right behind its own tail
const loop: Cell[] = [
  ...path([13, 8], "RRRRRRRRR"),
  ...path([22, 7], "DDDDDD"),
  ...path([21, 1], "LLLLLLLL"),
  ...path([13, 2], "UUUU"),
];

// 4 · page 2: TF, set by the snake
const tf: Cell[] = [
  ...path([13, 7], "RRRR"), // T bar
  ...path([15, 6], "DDDDD"), // T stem (down to row 1)
  ...path([15, 0], "RRRR"), // the join along the bottom
  ...path([19, 1], "UUUUUU"), // F stem
  ...path([20, 4], "R"), // F middle bar
  ...path([20, 7], "RR"), // F top bar: the head ends here
];

// 5 · page 2: a game, paused mid-run; tap the snake and it carries on
const game = path([14, 2], "UU RRR UU R");

export const WALLPAPERS: Wallpaper[] = [
  { id: 1, name: "Hello, across both pages", cells: hello, apples: [], page1: true },
  { id: 2, name: "The chase", cells: chase, apples: [[23, 4]], page1: true },
  { id: 3, name: "Head meets tail", cells: loop, apples: [[17, 4]], page1: false },
  { id: 4, name: "TF", cells: tf, apples: [[22, 2]], page1: false },
  { id: 5, name: "Paused game", cells: game, apples: [[21, 6], [15, 9]], page1: false, playable: true, hint: "Tap the snake to play" },
];

export const wallpaperFor = (id: number) => WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0];

/** direction of travel at the head: [dx, dy] in canvas units (dy up = +1) */
export const headDir = (cells: Cell[]): Cell => {
  const [a, b] = [cells[cells.length - 2], cells[cells.length - 1]];
  return [Math.sign(b[0] - a[0]), Math.sign(b[1] - a[1])];
};

/** handed from the wallpaper to the Snake game: the pose in device grid cells (col from the left grid line, row from the top one) */
export let pendingStart: { cells: Cell[]; dir: Cell } | null = null;
export const setPendingStart = (v: typeof pendingStart) => { pendingStart = v; };
