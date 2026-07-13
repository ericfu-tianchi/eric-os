/**
 * Pixel — the hand-drawn pixel-art system of ERIC OS.
 *
 * Every glyph is a character grid; each char maps to a palette color.
 * Rendered as crisp SVG rects so icons stay sharp at any scale.
 * Add new glyphs by drawing grids — keep outlines 'K', keep silhouettes
 * readable at 16px, give every object a darker "shade" row/edge.
 */

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
    "KKKKKKKKKKKK..",
    "KWWWWWWWWWWK..",
    "KWGGGGGGGWWKKK",
    "KWGGGGGGGWWKgK",
    "KWGGGGGGGWWKKK",
    "KWWWWWWWWWWK..",
    "KKKKKKKKKKKK..",
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
  text = "ERIC OS",
  cell = 3,
  color = "#1b1a15",
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

/**
 * Wallpaper snake, exported as a data-URI so CSS can paint it.
 * Modeled after the snake board of tianchi-fu.com: a slim snake of
 * rounded cells winding along the grid, dreaming of a star, an apple
 * waiting one move ahead. Cell size = 24 to lock onto the CSS grid.
 */
export function snakeWallpaperURI(bright = false): string {
  const C = 24; // must match --grid-size in CSS
  const path: [number, number][] = [
    [0, 12], [1, 12], [2, 12], [3, 12], [4, 12], [4, 11], [4, 10],
    [5, 10], [6, 10], [7, 10], [7, 9], [7, 8], [7, 7], [8, 7],
    [9, 7], [10, 7], [10, 6], [10, 5], [11, 5], [12, 5], [13, 5],
    [13, 4], [13, 3],
  ];
  const head = path[path.length - 1];
  const green = bright ? "#2ed573" : "#23bd5f";
  const baseOp = bright ? 0.42 : 0.34;
  const rects = path
    .map(([x, y], i) => {
      const op = baseOp * (0.32 + (i / path.length) * 0.68);
      return `<rect x='${x * C + 3}' y='${y * C + 3}' width='${C - 6}' height='${C - 6}' rx='3' fill='${green}' opacity='${op.toFixed(2)}'/>`;
    })
    .join("");
  const hx = head[0] * C;
  const hy = head[1] * C;
  const extras =
    // eyes
    `<rect x='${hx + 7}' y='${hy + 8}' width='3' height='3' fill='#1b1a15' opacity='${baseOp + 0.25}'/>` +
    `<rect x='${hx + 14}' y='${hy + 8}' width='3' height='3' fill='#1b1a15' opacity='${baseOp + 0.25}'/>` +
    // apple one move ahead
    `<rect x='${hx + 5}' y='${hy - C * 2 + 6}' width='${C - 10}' height='${C - 10}' rx='6' fill='#ff5347' opacity='${baseOp + 0.1}'/>` +
    `<rect x='${hx + 10}' y='${hy - C * 2 + 2}' width='3' height='5' fill='#158f46' opacity='${baseOp + 0.1}'/>` +
    // the star it dreams of
    `<g opacity='${(baseOp * 0.9).toFixed(2)}' fill='#f5c84c'>` +
    `<rect x='${hx + C * 2 + 6}' y='${hy - C * 3}' width='4' height='12' /><rect x='${hx + C * 2 + 2}' y='${hy - C * 3 + 4}' width='12' height='4' />` +
    `</g>`;
  const w = 15 * C;
  const h = 14 * C;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
    rects + extras + `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
