/**
 * The snake's shipping wardrobe: head accessories + the "Ask" chat glyph.
 * Every hat is an SVG fragment in HEAD-LOCAL coordinates for a 44px cell:
 * origin = head centre, +x = the way the snake faces, +y = its right side.
 * The head square spans ±21; eyes sit at (13.75, ±9.24), r 5.5.
 * Everything stays inside ±34 (the NY brim alone reaches -40), so nothing is ever clipped.
 * Everything turns with the head; `svg` may take the heading (deg) to keep a detail
 * readable (the Michigan M counter-rotates so it never reads as a Σ).
 * Candidates and earlier rounds live in snakeHatStudy.ts → /hat-study.html (dev server).
 */

import type { SnakeHat } from "../store";

export type HatDesign = { id: string; group: string; label: string; note?: string; svg: string | ((ang: number) => string) };

export const hatSvg = (d: HatDesign, ang = 0) => (typeof d.svg === "function" ? d.svg(ang) : d.svg);

export type ChatGlyph = { id: string; label: string; note?: string; svg: string }; // 32×32 viewBox

export const INK = "#1b1c1f";

export const ASK_GLYPH: ChatGlyph = {
  id: "c3", label: "Line bubble", note: "Geometric, matches the OS chrome",
  svg: `<path d="M9 4.5h14a6 6 0 0 1 6 6v7a6 6 0 0 1-6 6h-9l-5.5 4.5v-4.5H9a6 6 0 0 1-6-6v-7a6 6 0 0 1 6-6Z" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="10.5" cy="14" r="1.9" fill="${INK}"/><circle cx="16" cy="14" r="1.9" fill="${INK}"/><circle cx="21.5" cy="14" r="1.9" fill="${INK}"/>`,
};

export const EYE_X = 13.75, EYE_Y = 9.24;

export const arms = (stroke: string, w: number, from: number) =>
  [-1, 1].map((s) => `<path d="M${EYE_X - 1} ${s * from} L-5 ${s * 19.4} l-2.6 ${-s * 1.6}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`).join("");

export const lensTint = (r: number) => [-1, 1].map((s) => `<circle cx="${EYE_X}" cy="${s * EYE_Y}" r="${r}" fill="rgba(255,255,255,.16)"/>`).join("");

export const glint = (r: number) => [-1, 1].map((s) => `<path d="M${EYE_X + r * 0.15} ${s * EYE_Y - r * 0.72} a${r * 0.75} ${r * 0.75} 0 0 1 ${r * 0.58} ${r * 0.42}" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1" stroke-linecap="round"/>`).join("");

export function headphones(o: { band: string; bandEdge: string; cup: string; cupEdge: string; pad: string; accent?: string; bandW?: number }) {
  const bw = o.bandW ?? 5;
  const cup = (s: number) => `
    <rect x="-11.5" y="${s > 0 ? 19.5 : -29.5}" width="21" height="10" rx="4.6" fill="${o.cup}" stroke="${o.cupEdge}" stroke-width="1.1"/>
    <rect x="-9.5" y="${s > 0 ? 18.2 : -21.2}" width="17" height="3" rx="1.5" fill="${o.pad}"/>
    ${o.accent ? `<rect x="-7" y="${s > 0 ? 26.4 : -27.4}" width="12" height="1.6" rx=".8" fill="${o.accent}"/>` : ""}`;
  return `
    <path d="M-1 -22 Q-11 0 -1 22" fill="none" stroke="${o.bandEdge}" stroke-width="${bw + 1.6}" stroke-linecap="round"/>
    <path d="M-1 -22 Q-11 0 -1 22" fill="none" stroke="${o.band}" stroke-width="${bw}" stroke-linecap="round"/>
    ${cup(-1)}${cup(1)}`;
}

export const HAT_PHONES: HatDesign = {
    id: "h4", group: "headphones", label: "Cream & mint", note: "Soft pastel, very desk-setup",
    svg: headphones({ band: "#F6F1E7", bandEdge: "#CFC6B5", cup: "#8FD9BD", cupEdge: "#5DB896", pad: "#F6F1E7", accent: "#F6F1E7" }),
  };

export const NAVY = "#00274C", MAIZE = "#FFCB05";

export const BLOCK_M = "M-8 -6H-3L0 -1.4L3 -6H8V-3.6H6.6V3.6H8V6H2.4V3.6H3.6V-0.9L0 4.1L-3.6 -0.9V3.6H-2.4V6H-8V3.6H-6.6V-3.6H-8Z";

export const BLK = "#141416";

export const blackHi = (r: number) => [-1, 1].map((s) => `<path d="M${EYE_X - r * 0.95} ${s * EYE_Y - r * 0.3} A${r} ${r} 0 0 1 ${EYE_X - r * 0.3} ${s * EYE_Y - r * 0.95}" fill="none" stroke="rgba(255,255,255,.28)" stroke-width=".8" stroke-linecap="round"/>`).join("");

export const HAT_GLASSES: HatDesign = {
    id: "bg2", group: "glasses", label: "Black acetate round", note: "Chunky matte round, a soft sheen on the rim",
    svg: `${arms(BLK, 2.4, 17)}${lensTint(7)}
      ${[-1, 1].map((s) => `<circle cx="${EYE_X}" cy="${s * EYE_Y}" r="7.5" fill="none" stroke="${BLK}" stroke-width="3"/>`).join("")}${blackHi(7.5)}
      <rect x="${EYE_X - 1.4}" y="-2.4" width="2.8" height="4.8" rx="1.2" fill="${BLK}"/>${glint(6.6)}`,
  };

export const capBoard = (fill: string, edge = "rgba(255,255,255,.2)") =>
  `<polygon points="-5,-20 15,0 -5,20 -25,0" fill="${fill}" stroke="${edge}" stroke-width="1.1" stroke-linejoin="round"/>`;

export const sideTassel = (cord: string, hang: string, knot: string) =>
  `<path d="M-8.5 16.5 L-5 20" stroke="${cord}" stroke-width="1.4" stroke-linecap="round"/>
   <rect x="-6.6" y="19.6" width="3.2" height="2.2" rx="1" fill="${knot}"/><path d="M-6.4 21.6 h2.8 l.6 7.2 h-4 z" fill="${hang}"/>`;

export const M = (ang: number, x: number, s: number, fill: string) => `<path d="${BLOCK_M}" transform="translate(${x} 0) rotate(${-ang}) scale(${s})" fill="${fill}"/>`;

export const HAT_CAP: HatDesign = {
    id: "mc2", group: "cap", label: "Navy + inset line", note: "Michigan blue board, maize keyline, M centred",
    svg: (ang) => `${capBoard(NAVY)}<polygon points="-5,-15.6 10.6,0 -5,15.6 -20.6,0" fill="none" stroke="${MAIZE}" stroke-width=".9" stroke-linejoin="round"/>${M(ang, -5, 0.74, MAIZE)}${sideTassel(MAIZE, MAIZE, "#E0A800")}`,
  };

export const LOOP = (s: number) => `M0 0 C${s * 4} -9.5 ${s * 13.5} -10.5 ${s * 13.5} -3 C${s * 13.5} 4 ${s * 4.5} 5 0 0Z`;

export const BOW_B1 = `<defs>${[-1, 1].map((s) => `<clipPath id="snk-bow${s}"><path d="${LOOP(s)}"/></clipPath>`).join("")}</defs>
  <g transform="translate(-7 -14) rotate(-20)">
    <path d="M-1.2 1.2 L-5.4 11.2 L-3.3 10.2 L-2.2 12.6 L1.4 2.2Z" fill="#D63A69"/>
    <path d="M1.2 1.2 L5 11.4 L2.9 10.5 L1.9 12.8 L-1.2 2.2Z" fill="#FF5C8A"/>
    ${[-1, 1].map((s) => `<path d="${LOOP(s)}" fill="#FF5C8A"/>
      <g clip-path="url(#snk-bow${s})">
        <path d="M0 0 C${s * 3} -5.4 ${s * 8.4} -6 ${s * 9} -2.2 C${s * 9} 1.6 ${s * 3.6} 2.4 0 0Z" fill="#E2477A"/>
        <path d="M${s * 4.6} -6.4 C${s * 7.6} -7.6 ${s * 10.6} -6.8 ${s * 11.8} -4.2" fill="none" stroke="#FFB3C8" stroke-width="1.3" stroke-linecap="round"/>
      </g>`).join("")}
    <rect x="-2.7" y="-3.3" width="5.4" height="6.6" rx="1.9" fill="#E84677"/>
    <path d="M-1 -2 Q0 0 -1 2" fill="none" stroke="#C72E61" stroke-width=".8" stroke-linecap="round"/>
  </g>`;

export const HAT_BOW: HatDesign = { id: "b1r", group: "bow", label: "Satin pink, refined", note: "Was B1", svg: BOW_B1 };

export function memeShades(rows: string[], u: number, palette: Record<string, string>, armColor: string) {
  const w = rows[0].length * u, x0 = 19.6 - rows.length * u; // front edge flush with the eyes' front
  let out = "";
  rows.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      const col = palette[row[c]];
      if (col) out += `<rect x="${x0 + r * u}" y="${-w / 2 + c * u}" width="${u + 0.02}" height="${u + 0.02}" fill="${col}"/>`;
    }
  });
  const arm = [-1, 1].map((s) => `<rect x="-5" y="${s > 0 ? w / 2 - u : -w / 2}" width="${x0 + 5}" height="${u}" fill="${armColor}"/>`).join("");
  return `<g shape-rendering="crispEdges">${arm}${out}</g>`;
}

export const PK = { K: "#0E0E10", W: "#ffffff", G: "#34353B" };

export const LENS = [
  "KKKKKKKKKKKKKKKKKKKKK",
  ".KWKKKKKKK.KWKKKKKKK.",
  ".KKWKKKKKK.KKWKKKKKK.",
  ".KKKKKKKKK.KKKKKKKKK.",
  "..KKKKKKK...KKKKKKK..",
  "...KKKKK.....KKKKK...",
];

export const HAT_SHADES: HatDesign = { id: "s1a", group: "shades", label: "Classic", note: "The meme proportions, lenses fully over the eyes", svg: memeShades(LENS, 2, PK, PK.K) };

export const CAT_EAR = "M-6.5 0 C-6.8 -4.6 -5 -9.6 -2 -12.6 Q-0.6 -13.6 0.6 -12.4 C3.8 -9.2 6.2 -4.8 6.5 0 Q0 -2 -6.5 0Z";

export const CAT_INNER = "M-3.8 -1.2 C-4 -4.4 -2.8 -7.6 -1 -9.4 C1.2 -7.4 3 -4.4 3.8 -1.2 Q0 -2.4 -3.8 -1.2Z";

export function catEars(o: { x: number; y: number; tilt: number; k?: number; bandX?: number; bandW?: number }) {
  const k = o.k ?? 1.15, bx = o.bandX ?? o.x;
  const ear = (s: number) => `<g transform="translate(${o.x} ${s * o.y}) scale(${k} ${-s * k}) rotate(${o.tilt})">
      <path d="${CAT_EAR}" fill="#1E1F23" stroke="#1E1F23" stroke-width="1" stroke-linejoin="round"/><path d="${CAT_INNER}" fill="#FF8FB1"/></g>`;
  return `<path d="M${bx} -21.5 Q${bx - 6} 0 ${bx} 21.5" fill="none" stroke="#1E1F23" stroke-width="${o.bandW ?? 3}" stroke-linecap="round"/>${ear(-1)}${ear(1)}`;
}

export const HAT_CAT: HatDesign = { id: "ce2", group: "ears", label: "Swept back", note: "Tips folded back toward the tail — relaxed, a bit sly", svg: catEars({ x: -1, y: 20, tilt: -42 }) };

export const NY_LOGO_D = "M31.554,86.643c3.799.142,23.85-21.491,26.791-23.703,21.438,29.347,22.032,39.505,71.449,84.088-2.975-20.317-38.262-80.601-56.562-99.327,8.932-9.029,27.56-27.152,32.744-33.296,5.491,15.799,25.006,77.316,45.252,114.563h0c15.479-29.347,42.52-103.844,42.271-115.128,8.849,8.192,22.393,25.94,32.153,34.427-19.056,14.673-51.801,81.83-63.711,113.435-3.451,9.167-.593,14.673-.593,14.673,10.674,8.192,46.44,41.762,52.991,47.97C201.243,139.693,228.63,83.257,247.682,62.94c3.053,3.219,12.271,10.933,22.03,20.881-10.12,13.544-30.136,48.92-30.96,85.782-1.192,53.049,7.738,76.188,22.027,97.069-6.391,7.835-11.179,7.321-20.241,18.06-14.338-13.164-68.987-62.478-78.596-71.109h0l1.79,40.069c.456,2.339.969,23.352,10.12,33.299-20.102.026-23.964.028-44.059.563,6.71-9.071,8.778-28.845,8.932-34.989l-.598-63.773c-7.932-7.607-47.121-43.191-50.606-46.842h0c4.165,21.446,4.764,88.04-25.004,138.27-2.443-3.514-27.299-33.074-26.797-33.863,9.15-14.338,25.295-46.615,25.601-76.752.559-55.033-20.922-69.503-29.767-82.962";

export type CapColors = { crown: string; crownHi: string; seam: string; brim: string; brimHi: string; stitch: string; logo: string; eyelet: string };

export function nyCap(id: string, c: CapColors, sticker: boolean) {
  // crown centre / radii / top button. Pushed back so the crown ends just behind the eyes (edge ≈ x 7.2, eyes start at 8.25)
  const cx = -12.5, rx = 19.5, ry = 19.5 * 0.97, bx = cx + 1.2;
  const pt = (deg: number, k = 1) => {
    const a = (deg * Math.PI) / 180;
    return [cx + rx * k * Math.cos(a), ry * k * Math.sin(a)] as const;
  };
  const f = (n: number) => n.toFixed(2);
  const [p1x, p1y] = pt(112), [p2x, p2y] = pt(248);
  const tip = cx - rx - 13.5; // a real brim sticks out about a third of the crown
  const brim = (k: number) => {
    // the brim outline scaled toward its root, so the stitch rows converge at the corners like real ones
    const ox = p1x - 2, sx = (x: number) => f(ox + (x - ox) * k), sy = (y: number) => f(y * k);
    return `M${sx(p2x)} ${sy(p2y)} C${sx(p2x - 11)} ${sy(p2y - 2.2)} ${sx(tip)} ${sy(-15.5)} ${sx(tip)} 0 C${sx(tip)} ${sy(15.5)} ${sx(p1x - 11)} ${sy(p1y + 2.2)} ${sx(p1x)} ${sy(p1y)}`;
  };
  const seamAngles = [0, 60, 120, 180, 240, 300];
  const seams = seamAngles.map((d) => {
    const [ex, ey] = pt(d, 0.995);
    const a = (d * Math.PI) / 180, nx = -Math.sin(a) * 0.75, ny = Math.cos(a) * 0.75;
    return `<path d="M${f(bx)} 0 L${f(ex)} ${f(ey)}" stroke="${c.seam}" stroke-width=".8"/>
      <path d="M${f(bx + nx * 2)} ${f(ny * 2)} L${f(ex + nx)} ${f(ey + ny)}" stroke="${c.stitch}" stroke-width=".3" stroke-dasharray=".8 .55"/>`;
  }).join("");
  const eyelets = seamAngles.map((d) => {
    const [ex, ey] = pt(d + 30, 0.34); // eyelets sit high on each panel, near the button
    return `<circle cx="${f(ex)}" cy="${f(ey)}" r=".95" fill="${c.eyelet}"/><circle cx="${f(ex)}" cy="${f(ey)}" r="1.35" fill="none" stroke="${c.stitch}" stroke-width=".35"/>`;
  }).join("");
  const s = 11.6 / 274; // logo height ≈ 12 units, running along the panel
  return `<defs>
      <radialGradient id="${id}-dome" cx="${f(cx - 5)}" cy="-6" r="${f(rx * 1.25)}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c.crownHi}"/><stop offset="1" stop-color="${c.crown}"/></radialGradient>
      <linearGradient id="${id}-brim" x1="${f(tip)}" y1="0" x2="${f(p1x)}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c.brimHi}"/><stop offset="1" stop-color="${c.brim}"/></linearGradient>
      <clipPath id="${id}-bclip"><path d="${brim(1)}Z"/></clipPath>
    </defs>
    <g transform="scale(1.03)">
      <path d="${brim(1)}Z" fill="url(#${id}-brim)" stroke="${c.seam}" stroke-width=".7"/>
      ${[0.94, 0.89, 0.84, 0.79].map((k) => `<path d="${brim(k)}" fill="none" stroke="${c.stitch}" stroke-width=".3" stroke-dasharray=".8 .5"/>`).join("")}
      <ellipse cx="${f(cx - 1.4)}" cy=".6" rx="${rx}" ry="${f(ry)}" fill="rgba(0,0,0,.35)" clip-path="url(#${id}-bclip)"/>
      ${sticker ? `<g transform="translate(${f(tip + 5.4)} -8.4)"><circle r="3.1" fill="#C9A13A"/><circle r="3.1" fill="none" stroke="#F3DC8E" stroke-width=".5"/><circle r="2" fill="none" stroke="#A88224" stroke-width=".45"/><path d="M-1.6 -1.6 A2.4 2.4 0 0 1 .6 -2.3" fill="none" stroke="#FFF2C4" stroke-width=".6" stroke-linecap="round"/></g>` : ""}
      <ellipse cx="${f(cx)}" cy="0" rx="${rx}" ry="${f(ry)}" fill="url(#${id}-dome)" stroke="${c.seam}" stroke-width=".8"/>
      ${seams}${eyelets}
      <g transform="translate(${f(cx - 12.6)} 0) rotate(90) scale(${s.toFixed(5)}) translate(-150.63 -150.7)">
        <path d="${NY_LOGO_D}" fill="rgba(0,0,0,.4)" transform="translate(9 9)"/>
        <path d="${NY_LOGO_D}" fill="${c.logo}"/>
      </g>
      <circle cx="${f(bx)}" cy="0" r="2.3" fill="url(#${id}-dome)" stroke="${c.seam}" stroke-width=".6"/>
      <circle cx="${f(bx - 0.6)}" cy="-0.6" r=".8" fill="${c.crownHi}" opacity=".9"/>
    </g>`;
}

export const HAT_NYCAP: HatDesign = {
    id: "ny2b", group: "nycap", label: "Black + gold sticker", note: "Same cap in black",
    svg: nyCap("snk-ny2", { crown: "#121316", crownHi: "#2E3036", seam: "#000000", brim: "#121316", brimHi: "#2A2B30", stitch: "rgba(255,255,255,.22)", logo: "#FFFFFF", eyelet: "#000000" }, true),
  };

export const SNAKE_HATS: Record<Exclude<SnakeHat, "none">, HatDesign> = {
  glasses: HAT_GLASSES,
  cap: HAT_CAP,
  phones: HAT_PHONES,
  bow: HAT_BOW,
  shades: HAT_SHADES,
  cat: HAT_CAT,
  nycap: HAT_NYCAP,
};
