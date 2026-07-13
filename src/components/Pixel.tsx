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

/** Wallpaper snake, exported as a data-URI so CSS can paint it. */
export function snakeWallpaperURI(): string {
  const cells: [number, number, string][] = [];
  // a calm snake winding through the grid — body path (x, y)
  const path: [number, number][] = [
    [0, 9], [1, 9], [2, 9], [3, 9], [3, 8], [3, 7], [4, 7], [5, 7],
    [6, 7], [6, 6], [6, 5], [6, 4], [7, 4], [8, 4], [9, 4], [9, 3],
    [9, 2], [10, 2], [11, 2],
  ];
  path.forEach(([x, y], i) => cells.push([x, y, i === path.length - 1 ? "#23bd5f" : "#23bd5f"]));
  const head = path[path.length - 1];
  const rects = cells
    .map(
      ([x, y, c], i) =>
        `<rect x='${x * 10 + 1}' y='${y * 10 + 1}' width='8' height='8' rx='1.5' fill='${c}' opacity='${(0.35 + (i / cells.length) * 0.65).toFixed(2)}'/>`
    )
    .join("");
  // eye + tongue on head, apple ahead of the snake
  const extras =
    `<rect x='${head[0] * 10 + 3}' y='${head[1] * 10 + 3}' width='2' height='2' fill='#1b1a15'/>` +
    `<rect x='${(head[0] + 1) * 10 + 1}' y='${head[1] * 10 + 4}' width='4' height='2' fill='#ff3b77'/>` +
    `<circle cx='${(head[0] + 3) * 10 + 5}' cy='${head[1] * 10 + 5}' r='4' fill='#ff5347'/>` +
    `<rect x='${(head[0] + 3) * 10 + 4}' y='${head[1] * 10 - 1}' width='2' height='3' fill='#158f46'/>`;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='110' viewBox='0 0 160 110'>` +
    `<g opacity='0.30'>${rects}${extras}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
