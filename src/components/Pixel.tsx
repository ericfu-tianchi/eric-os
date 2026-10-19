/**
 * Pixel — the hand-drawn pixel-art system of Tianchi OS.
 *
 * Every glyph is a character grid; each char maps to a palette color.
 * Rendered as crisp SVG rects so icons stay sharp at any scale.
 * Add new glyphs by drawing grids — keep outlines 'K', keep silhouettes
 * readable at 16px, give every object a darker "shade" row/edge.
 */

import folderRaster from "../assets/icons/b/folder.png";
import docRaster from "../assets/icons/b/doc.png";
import pdfRaster from "../assets/icons/b/pdf.png";
import snakeRaster from "../assets/icons/b/snake.png";
import heartRaster from "../assets/icons/b/heart.png";
import starRaster from "../assets/icons/b/star.png";
import gearRaster from "../assets/icons/b/gear.png";
import computerRaster from "../assets/icons/b/computer.png";
import soulBladeRaster from "../assets/icons/b/soul-blade.png";
import legoWorldRaster from "../assets/icons/b/lego-world.svg";
import aboutPageRaster from "../assets/file-icons/about.webp";

/** AI pixel-art icon set (v0.5, "Balanced"): crisp true-pixel + tidy shading, vivid on the charcoal
 *  stage. These rasters override the hand-drawn vector PixIcons below. Flip USE_RASTER_ICONS to
 *  false to fall back to the vector grids (fully reversible). */
const USE_RASTER_ICONS = true;
const RASTER_ICONS: Record<string, string> = {
  folder: folderRaster, doc: docRaster, pdf: pdfRaster,
  snake: snakeRaster, heart: heartRaster, star: starRaster,
  gear: gearRaster, computer: computerRaster,
  "soul-blade": soulBladeRaster, "lego-world": legoWorldRaster, "about-page": aboutPageRaster,
};

/** raster URL for an icon (so the snake game can draw eaten icons as the real art, not the vector). */
export function rasterIconUrl(name: string): string | undefined {
  return USE_RASTER_ICONS ? RASTER_ICONS[name] : undefined;
}

const PALETTE: Record<string, string> = {
  K: "#1b1a15", // ink outline
  W: "#fffdf7", // white
  w: "#efe9d8", // warm white shade
  Y: "#f5c84c", // gold
  y: "#d19c2c", // gold shade
  G: "#23bd5f", // green
  g: "#158f46", // green shade
  L: "#cde84a", // lime
  R: "#ff5347", // red
  r: "#c93a31", // red shade
  P: "#ff3b77", // pink
  T: "#17bebb", // teal
  t: "#0e8f8d", // teal shade
  B: "#3e6de8", // blue
  S: "#c9c4b2", // silver
  s: "#8f8b7a", // silver shade
  O: "#f58b2e", // orange
};

export const GLYPHS: Record<string, string[]> = {
  folder: [
    ".KKKKKK.........",
    "KYYYYYYK........",
    "KYYYYYYKKKKKKKK.",
    "KYWWYYYYYYYYYYYK",
    "KYYYYYYYYYYYYYYK",
    "KYYYYYYYYYYYYYYK",
    "KYYYYYYYYYYYYYYK",
    "KYYYYYYYYYYYYYYK",
    "KyYYYYYYYYYYYYyK",
    "KyyyyyyyyyyyyyyK",
    ".KKKKKKKKKKKKKK.",
  ],
  doc: [
    ".KKKKKKKK...",
    ".KWWWWWKWK..",
    ".KWWWWWKKK..",
    ".KWWWWWWWWK.",
    ".KWGGGGGWWK.",
    ".KWWWWWWWWK.",
    ".KWGGGGGGWK.",
    ".KWWWWWWWWK.",
    ".KWGGGGWWWK.",
    ".KWWWWWWWWK.",
    ".KwwwwwwwwK.",
    ".KKKKKKKKKK.",
  ],
  pdf: [
    ".KKKKKKKK...",
    ".KWWWWWKWK..",
    ".KWWWWWKKK..",
    ".KWWWWWWWWK.",
    ".KRRRRRRRRK.",
    ".KRWWRWWRRK.",
    ".KRWRRWRWRK.",
    ".KRWWRWWRRK.",
    ".KrrrrrrrrK.",
    ".KWWWWWWWWK.",
    ".KwwwwwwwwK.",
    ".KKKKKKKKKK.",
  ],
  gear: [
    ".....KKKK.....",
    "..KK.KSSK.KK..",
    ".KSSKKSSKKSSK.",
    ".KSSSSSSSSSSK.",
    "KKSSSKKKKSSSKK",
    "KSSSK.ww.KSSSK",
    "KSSK.wTTw.KSSK",
    "KSSK.wTTw.KSSK",
    "KSSSK.ww.KSSSK",
    "KKSSSKKKKSSSKK",
    ".KSSSSSSSSSSK.",
    ".KSSKKssKKSSK.",
    "..KK.KssK.KK..",
    ".....KKKK.....",
  ],
  computer: [
    ".KKKKKKKKKKKKK.",
    "KSSSSSSSSSSSSSK",
    "KSKKKKKKKKKKKSK",
    "KSKTTTTTTTTTKSK",
    "KSKTTGGTTTTTKSK",
    "KSKTTTTTGGTTKSK",
    "KSKTTGGGGGTTKSK",
    "KSKTTTTTTTTTKSK",
    "KSKKKKKKKKKKKSK",
    "KsSSSSSSSSSSSsK",
    ".KKKKKKKKKKKKK.",
    "....KssssK.....",
    "..KKKKKKKKKK...",
    "..KssssssssK...",
    "..KKKKKKKKKK...",
  ],
  snake: [
    "................",
    ".....KKKKKKK....",
    "....KGGGGGGGK...",
    "....KGWKGGGGK...",
    "....KGGGGGGGK.K.",
    "....KKKKKGGGKKPK",
    "........KGGGK.K.",
    ".KKKKKKKKGGGK...",
    "KGGGGGGGGGGGK...",
    "KGggggggggggK...",
    "KGGGGGGGGGGGGK..",
    "KKKKKKKKKKKKK...",
  ],
  trash: [
    "....KKKK....",
    ".KKKKssKKKK.",
    "KssssssssssK",
    "KKKKKKKKKKKK",
    ".KSSSSSSSSK.",
    ".KSKSKKSKSK.",
    ".KSKSKKSKSK.",
    ".KSKSKKSKSK.",
    ".KSKSKKSKSK.",
    ".KSSSSSSSSK.",
    ".KssssssssK.",
    "..KKKKKKKK..",
  ],
  mail: [
    "KKKKKKKKKKKKKK",
    "KWWWWWWWWWWWWK",
    "KWKWWWWWWWWKWK",
    "KWWKWWWWWWKWWK",
    "KWWWKWWWWKWWWK",
    "KWWWWKKKKWWWWK",
    "KWWWWWWWWWWWWK",
    "KwwwwwwwwwwwwK",
    "KKKKKKKKKKKKKK",
  ],
  heart: [
    ".KK...KK.",
    "KPPK.KPPK",
    "KPPPKPPPK",
    "KPWPPPPPK",
    ".KPPPPPK.",
    "..KPPPK..",
    "...KPK...",
    "....K....",
  ],
  star: [
    "....KK....",
    "...KYYK...",
    "KKKKYYKKKK",
    "KYYYYYYYYK",
    ".KYYYYYYK.",
    "..KYYYYK..",
    ".KYYKKYYK.",
    ".KYK..KYK.",
    "..K....K..",
  ],
  apple: [
    "....KK...",
    "...KgK...",
    "..KKRKK..",
    ".KRRRRRK.",
    "KRRWRRRRK",
    "KRRRRRRRK",
    "KRRRRRRRK",
    ".KRRRRRK.",
    "..KKKKK..",
  ],
  wifi: [
    ".KKKKKKKK.",
    "K........K",
    ".KKKKKKKK.",
    "..........",
    "..KKKKKK..",
    ".K......K.",
    "..KKKKKK..",
    "....KK....",
    "....KK....",
  ],
  battery: [
    ".SSSSSSSSSSSS....",
    ".SGGGGGGGGWWS.SS.",
    ".SGGGGGGGGWWS.Ss.",
    ".SGGGGGGGGWWS.SS.",
    ".SSSSSSSSSSSS....",
  ],
  logo: [
    ".KKKKKKKKK..",
    "KGGGGGGGGGK.",
    "KGWKKGGGGGK.",
    "KGWKKGGGGGK.",
    "KGGGGGGGGGKK",
    "KGGGGGGGGGKP",
    "KgggggggggKK",
    ".KKKKKKKKK..",
  ],
};

/** 5-row pixel letterforms for the wordmark */
const PIX_FONT: Record<string, string[]> = {
  T: ["KKK", ".K.", ".K.", ".K.", ".K."],
  A: [".KK.", "K..K", "KKKK", "K..K", "K..K"],
  N: ["K..K", "KK.K", "K.KK", "K..K", "K..K"],
  H: ["K..K", "K..K", "KKKK", "K..K", "K..K"],
  E: ["KKKK", "K...", "KKK.", "K...", "KKKK"],
  R: ["KKK.", "K..K", "KKK.", "K.K.", "K..K"],
  I: ["KKK", ".K.", ".K.", ".K.", "KKK"],
  C: [".KKK", "K...", "K...", "K...", ".KKK"],
  O: [".KK.", "K..K", "K..K", "K..K", ".KK."],
  S: [".KKK", "K...", ".KK.", "...K", "KKK."],
  " ": ["..", "..", "..", "..", ".."],
};

function gridRects(grid: string[], color?: (c: string) => string) {
  const rects: { x: number; y: number; c: string }[] = [];
  grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === ".") continue;
      rects.push({ x, y, c: color ? color(ch) : PALETTE[ch] ?? PALETTE.K });
    }
  });
  return rects;
}

export function PixelGlyph({
  name,
  size = 44,
  className,
  title,
}: {
  name: keyof typeof GLYPHS;
  size?: number;
  className?: string;
  title?: string;
}) {
  const grid = GLYPHS[name];
  const h = grid.length;
  const w = Math.max(...grid.map((r) => r.length));
  const rects = gridRects(grid);
  return (
    <span className={`glyph-wrap ${className ?? ""}`} style={{ display: "inline-flex", lineHeight: 0 }}>
      <svg
        width={size}
        height={(size * h) / w}
        viewBox={`0 0 ${w} ${h}`}
        shapeRendering="crispEdges"
        role={title ? "img" : "presentation"}
        aria-label={title}
      >
        {rects.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={1} height={1} fill={r.c} />
        ))}
      </svg>
    </span>
  );
}

export function PixelWordmark({
  text = "TIANCHI OS",
  cell = 3,
  color = "currentColor",
}: {
  text?: string;
  cell?: number;
  color?: string;
}) {
  const letters = text.split("").map((ch) => PIX_FONT[ch] ?? PIX_FONT[" "]);
  const gap = 1;
  let cursor = 0;
  const placed: { rects: { x: number; y: number }[]; offset: number }[] = [];
  letters.forEach((g) => {
    const w = Math.max(...g.map((r) => r.length));
    const rects: { x: number; y: number }[] = [];
    g.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) if (row[x] === "K") rects.push({ x, y });
    });
    placed.push({ rects, offset: cursor });
    cursor += w + gap;
  });
  const totalW = cursor - gap;
  return (
    <svg
      width={totalW * cell}
      height={5 * cell}
      viewBox={`0 0 ${totalW} 5`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={text}
    >
      {placed.flatMap((l, li) =>
        l.rects.map((r, i) => (
          <rect key={`${li}-${i}`} x={r.x + l.offset} y={r.y} width={1} height={1} fill={color} />
        ))
      )}
    </svg>
  );
}

export const GRID_TARGET = 44; // desired cell size (Eric's final spec)

/** The grid: cells flex a little on BOTH axes so width and height divide into
    whole cells exactly — no partial cells anywhere, on any screen. */
export function gridSpec(vw: number, vh: number) {
  const rows = Math.max(8, Math.round(vh / GRID_TARGET));
  const cellH = vh / rows;
  const cols = Math.max(8, Math.round(vw / cellH));
  const cellW = vw / cols;
  return { cellW, cellH, cols, rows };
}

/** An icon's pixel cells, content-cropped, in its original (outline-treatment) colors.
    Used by the snake game to render swallowed icons riding the body. */
export function iconCellData(name: PixIconName): { w: number; h: number; cells: [number, number, string][] } {
  const { hue, g } = I_GRID[name in I_GRID ? (name as VectorIconName) : "doc"];
  const [body, shade, , acc] = I_HUE[hue];
  const map: Record<string, string> = { K: I_INK, B: body, S: shade, H: I_CREAM, A: acc };
  const cells: [number, number, string][] = [];
  g.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] !== ".") cells.push([x, y, map[row[x]]]);
  });
  const xs = cells.map((c) => c[0]);
  const ys = cells.map((c) => c[1]);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  return {
    w: Math.max(...xs) - x0 + 1,
    h: Math.max(...ys) - y0 + 1,
    cells: cells.map(([x, y, c]) => [x - x0, y - y0, c]),
  };
}

/* ============================================================
   PixIcon — v2 icon set (DevDay-flavored, moderate pixelation).
   Cell roles: '.' empty · K outline · B body · S shade ·
   H highlight · A accent. Crisp SVG rects, self-drawn grids,
   restrained gem palette. treatment="outline" ships as default;
   the others are kept so the whole set restyles from one prop.
   ============================================================ */
type VectorIconName =
  | "folder" | "doc" | "pdf" | "snake" | "heart" | "star" | "gear" | "computer";
/** App icons exist only as raster art; their vector fallback is the plain document. */
export type PixIconName = VectorIconName | "soul-blade" | "lego-world" | "about-page";
export type IconTreatment = "outline" | "flat" | "duotone" | "tile" | "dissolve";

const I_INK = "#26262b";
const I_CREAM = "#f4f0e6";
const I_SLATE = "#2f3a46";
// [body, shade, highlight, accent, tileDark]
const I_HUE: Record<string, [string, string, string, string, string]> = {
  gold: ["#d9a441", "#a9781f", "#f0d38a", "#8a5f16", "#a9781f"],
  paper: ["#eef1f6", "#c3ccda", "#ffffff", "#4a74d6", "#3a5bb0"],
  pdf: ["#eef1f6", "#c3ccda", "#ffffff", "#e0483a", "#b23a2f"],
  green: ["#43a066", "#237a43", "#bfe6c8", "#155e33", "#237a43"],
  rose: ["#d76a97", "#ad4570", "#f2b8cf", "#8f2f57", "#ad4570"],
  amber: ["#e0a93f", "#b3812a", "#f5d98f", "#8a6015", "#b3812a"],
  steel: ["#9aa2ae", "#6a727e", "#d9dee5", "#535a66", "#5b6470"],
  screen: ["#9aa2ae", "#6a727e", "#d9dee5", "#1fb0ab", "#5b6470"],
};
const I_GRID: Record<VectorIconName, { hue: string; g: string[] }> = {
  folder: { hue: "gold", g: [
    "................", "...KKKKKK.......", "..KBBBBBBK......", "..KBBBBBBKKKKKK.",
    ".KBBBBBBBBBBBBK.", ".KBHHBBBBBBBBBK.", ".KBBBBBBBBBBBBK.", ".KBBBBBBBBBBBBK.",
    ".KBBBBBBBBBBBBK.", ".KSSSSSSSSSSSBK.", ".KSSSSSSSSSSSSK.", "..KKKKKKKKKKKK..",
    "................", "................" ] },
  doc: { hue: "paper", g: [
    "................", "..KKKKKKKKK.....", "..KBBBBBBKK.....", "..KBBBBBBBK.....",
    "..KBAAAABBK.....", "..KBBBBBBBK.....", "..KBAAAAABK.....", "..KBBBBBBBK.....",
    "..KBAAAABBK.....", "..KBBBBBBBK.....", "..KBAAAAABK.....", "..KBBBBBBBK.....",
    "..KKKKKKKKK.....", "................" ] },
  pdf: { hue: "pdf", g: [
    "................", "..KKKKKKKKK.....", "..KBBBBBBKK.....", "..KBBBBBBBK.....",
    "..KBBBBBBBK.....", "..KAAAAAAAK.....", "..KAAAAAAAK.....", "..KAAAAAAAK.....",
    "..KBBBBBBBK.....", "..KBBBBBBBK.....", "..KBBBBBBBK.....", "..KBBBBBBBK.....",
    "..KKKKKKKKK.....", "................" ] },
  snake: { hue: "green", g: [
    "................", "....KKKKKK......", "...KBBBBBBK.....", "...KBHKBBBK.KK..",
    "...KBBBBBBKKKAK.", "...KKKKKBBBK.KK.", ".KKKKK.KBBBK....", "KBBBBBKKBBBK....",
    "KBSSSBBBBBBK....", "KBBBBBBBBBBBK...", "KBSSSSSSSSSBK...", "KKKKKKKKKKKKK...",
    "................", "................" ] },
  heart: { hue: "rose", g: [
    "................", "..KKK....KKK....", ".KBBBKKKBBBBK...", ".KBHBBBBBBBBK...",
    ".KBBBBBBBBBBK...", "..KBBBBBBBBK....", "...KBBBBBBK.....", "....KBBBBK......",
    ".....KBBK.......", "......KK........", "................", "................",
    "................", "................" ] },
  star: { hue: "amber", g: [
    "................", ".......KK.......", "......KBBK......", "......KBBK......",
    "..KKKKKBBKKKKK..", "..KBBBBBBBBBBK..", "...KBBBBBBBBK...", "....KBBBBBBK....",
    "...KBBBKKBBBK...", "..KBBBK..KBBBK..", "..KBK......KBK..", "................",
    "................", "................" ] },
  gear: { hue: "steel", g: [
    "................", "......KKKK......", "...KK.KBBK.KK...", "...KBKKBBKKBK...",
    "...KBBBBBBBBK...", "..KKBBBKKBBBKK..", "..KBBBK..KBBBK..", "..KBBBK..KBBBK..",
    "..KKBBBKKBBBKK..", "...KBBBBBBBBK...", "...KBKKBBKKBK...", "...KK.KSSK.KK...",
    "......KKKK......", "................" ] },
  computer: { hue: "screen", g: [
    "................", ".KKKKKKKKKKKKK..", ".KBBBBBBBBBBBK..", ".KBAAAAAAAAABK..",
    ".KBAAAAAAAAABK..", ".KBAAAAAAAAABK..", ".KBAAAAAAAAABK..", ".KBBBBBBBBBBBK..",
    ".KKKKKKKKKKKKK..", "......KKK......", ".....KBSBK.....", "....KKKKKKK....",
    "....KBBBBBK....", "....KKKKKKK...." ] },
};

export function PixIcon({
  name, size = 48, className, treatment = "outline", swallow = false,
}: { name: PixIconName; size?: number; className?: string; treatment?: IconTreatment; swallow?: boolean }) {
  if (USE_RASTER_ICONS && !swallow && RASTER_ICONS[name]) {
    return (
      <span className={`glyph-wrap ${className ?? ""}`} style={{ display: "inline-flex", lineHeight: 0 }}>
        <img src={RASTER_ICONS[name]} width={size} height={size} draggable={false}
          style={{ objectFit: "contain", pointerEvents: "none", userSelect: "none" }} alt="" aria-hidden />
      </span>
    );
  }
  const { hue, g } = I_GRID[name in I_GRID ? (name as VectorIconName) : "doc"];
  const [body, shade, hi, acc, tdark] = I_HUE[hue];
  const W = Math.max(...g.map((r) => r.length));
  const H = g.length;
  const map = (ch: string): string | null => {
    if (ch === ".") return null;
    // "swallow" = the icon's SILHOUETTE, solid green — shape and size only, no pixel detail
    if (swallow) return "#3fbf6e";
    switch (treatment) {
      case "flat": return { ".": null, K: null, B: body, S: shade, H: hi, A: acc }[ch] ?? null;
      case "duotone": return { ".": null, K: null, B: body, S: I_SLATE, H: hi, A: I_SLATE }[ch] ?? null;
      case "tile": return { ".": null, K: null, B: I_CREAM, S: "#d8d2c2", H: "#ffffff", A: I_CREAM }[ch] ?? null;
      default: return { ".": null, K: I_INK, B: body, S: shade, H: I_CREAM, A: acc }[ch] ?? null; // outline & dissolve
    }
  };
  const rects: unknown[] = [];
  g.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = map(row[x]);
      if (c) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c} />);
    }
  });
  if (treatment === "dissolve") {
    [[W, 2], [W + 1, 3], [W, 5], [W + 2, 4], [W + 1, 6]].forEach(([x, y], i) =>
      rects.push(<rect key={`d${i}`} x={x} y={y} width={1} height={1} fill={body} />));
  }
  const vw = W + (treatment === "dissolve" ? 3 : 0);
  return (
    <span className={`glyph-wrap ${className ?? ""}`} style={{ display: "inline-flex", lineHeight: 0 }}>
      <svg width={size} height={(size * H) / vw} viewBox={`0 0 ${vw} ${H}`} shapeRendering="crispEdges" aria-hidden>
        {treatment === "tile" && <rect x={0} y={0} width={W} height={H} rx={1.6} fill={tdark} />}
        {rects as React.ReactNode}
      </svg>
    </span>
  );
}

/**
 * Wallpaper snake, exported as a data-URI so CSS can paint it.
 * Modeled after the snake board of tianchi-fu.com: a slim snake of
 * rounded cells winding along the grid, dreaming of a star, an apple
 * waiting one move ahead. Cell size = 24 to lock onto the CSS grid.
 */
