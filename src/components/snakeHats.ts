/**
 * Snake head accessories + the "Ask" chat glyphs — design candidates.
 * Every hat is an SVG fragment in HEAD-LOCAL coordinates for a 44px cell:
 * origin = head centre, +x = the way the snake faces, +y = its right side.
 * The head square spans ±21; eyes sit at (13.75, ±9.24), r 5.5.
 * Everything stays inside ±34 so nothing is ever clipped.
 * Everything turns with the head. `svg` may take the heading (deg) to keep a detail
 * readable, e.g. the Michigan M counter-rotates so it never reads as a Σ.
 * Review page: /hat-study.html (dev server).
 */

export type HatDesign = { id: string; group: string; label: string; note?: string; svg: string | ((ang: number) => string) };
export const hatSvg = (d: HatDesign, ang = 0) => (typeof d.svg === "function" ? d.svg(ang) : d.svg);
export type ChatGlyph = { id: string; label: string; note?: string; svg: string }; // 32×32 viewBox

const INK = "#1b1c1f";

/* ── pixel helper: map rows → <rect>s; unit = px per pixel; origin = top-left ── */
function pixels(rows: string[], palette: Record<string, string>, unit: number, ox = 0, oy = 0) {
  let out = "";
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = palette[row[x]];
      if (c) out += `<rect x="${ox + x * unit}" y="${oy + y * unit}" width="${unit + 0.02}" height="${unit + 0.02}" fill="${c}"/>`;
    }
  });
  return `<g shape-rendering="crispEdges">${out}</g>`;
}

/* ═════════════ Ask · chat glyphs ═════════════ */

export const CHAT_GLYPHS: ChatGlyph[] = [
  {
    id: "c1", label: "Pixel bubble", note: "Same 16-bit language as the snake icon",
    svg: pixels([
      "................",
      "..KKKKKKKKKKKK..",
      ".KHHHGGGGGGGGGK.",
      "KHHGGGGGGGGGGGGK",
      "KHGGGGGGGGGGGGGK",
      "KGGWWGGWWGGWWGGK",
      "KGGWWGGWWGGWWGGK",
      "KGGGGGGGGGGGGGSK",
      "KGGGGGGGGGGGGSSK",
      ".KGGGGGGGGGGSSK.",
      "..KGGKKKKKKKKK..",
      "..KGK...........",
      "..KK............",
      "..K.............",
    ], { K: INK, G: "#06C268", H: "#5FE09A", S: "#049650", W: "#ffffff" }, 2, 0, 3),
  },
  {
    id: "c2", label: "Pixel duo", note: "Two bubbles = a conversation",
    svg: pixels([
      ".....KKKKKKKKK..",
      "....KYYYYYYYYYK.",
      "....KYYYYYYYYYK.",
      "....KYYYYYYYYYK.",
      ".KKKKKKKKKYYYYK.",
      "KGGGGGGGGGKYYYK.",
      "KGWWGWWGWWKYYK..",
      "KGWWGWWGWWKKKK..",
      "KGGGGGGGGGK.K...",
      "KGGGGGGGGSK.....",
      ".KGKKKKKKK......",
      ".KK.............",
      ".K..............",
    ], { K: INK, G: "#06C268", S: "#049650", Y: "#F5B027", W: "#ffffff" }, 2, 0, 4),
  },
  {
    id: "c3", label: "Line bubble", note: "Geometric, matches the OS chrome",
    svg: `<path d="M9 4.5h14a6 6 0 0 1 6 6v7a6 6 0 0 1-6 6h-9l-5.5 4.5v-4.5H9a6 6 0 0 1-6-6v-7a6 6 0 0 1 6-6Z" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="10.5" cy="14" r="1.9" fill="${INK}"/><circle cx="16" cy="14" r="1.9" fill="${INK}"/><circle cx="21.5" cy="14" r="1.9" fill="${INK}"/>`,
  },
  {
    id: "c4", label: "Duo, filled", note: "Brand green + ink, geometric",
    svg: `<path d="M15 3h10a5 5 0 0 1 5 5v4.5a5 5 0 0 1-5 5h-.5v3.5l-4-3.5H15a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Z" fill="${INK}"/>
      <path d="M7 11h11a5 5 0 0 1 5 5v5a5 5 0 0 1-5 5h-7l-5 4v-4.2A5 5 0 0 1 2 21v-5a5 5 0 0 1 5-5Z" fill="#06C268" stroke="#fff" stroke-width="2"/>
      <circle cx="7.5" cy="18.5" r="1.6" fill="#fff"/><circle cx="12.5" cy="18.5" r="1.6" fill="#fff"/><circle cx="17.5" cy="18.5" r="1.6" fill="#fff"/>`,
  },
];

/* ═════════════ Glasses (art-house) ═════════════ */

const EYE_X = 13.75, EYE_Y = 9.24;
// arms run back along both sides of the head to a little ear hook
const arms = (stroke: string, w: number, from: number) =>
  [-1, 1].map((s) => `<path d="M${EYE_X - 1} ${s * from} L-5 ${s * 19.4} l-2.6 ${-s * 1.6}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
const lensTint = (r: number) => [-1, 1].map((s) => `<circle cx="${EYE_X}" cy="${s * EYE_Y}" r="${r}" fill="rgba(255,255,255,.16)"/>`).join("");
const glint = (r: number) => [-1, 1].map((s) => `<path d="M${EYE_X + r * 0.15} ${s * EYE_Y - r * 0.72} a${r * 0.75} ${r * 0.75} 0 0 1 ${r * 0.58} ${r * 0.42}" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1" stroke-linecap="round"/>`).join("");

function octagon(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 8) + (i * Math.PI) / 4;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  });
  return pts.join(" ");
}

const GOLD = "#C99A3B", GOLD_HI = "#F1D488";

const GLASSES: HatDesign[] = [
  {
    id: "g1", group: "glasses", label: "Gold round", note: "Thin gold wire, keyhole bridge",
    svg: `${arms(GOLD, 1.5, 16.6)}${lensTint(7.4)}
      ${[-1, 1].map((s) => `<circle cx="${EYE_X}" cy="${s * EYE_Y}" r="7.4" fill="none" stroke="${GOLD}" stroke-width="1.7"/><circle cx="${EYE_X}" cy="${s * EYE_Y}" r="7.4" fill="none" stroke="${GOLD_HI}" stroke-width=".6" stroke-dasharray="6 40" transform="rotate(-120 ${EYE_X} ${s * EYE_Y})"/>`).join("")}
      <path d="M${EYE_X + 2.6} -2.3 q 2.6 2.3 0 4.6" fill="none" stroke="${GOLD}" stroke-width="1.6" stroke-linecap="round"/>${glint(7.4)}`,
  },
  {
    id: "g2", group: "glasses", label: "Tortoiseshell", note: "Chunky round acetate, warm brown",
    svg: `${arms("#5A3418", 2.2, 16.8)}${lensTint(7.2)}
      ${[-1, 1].map((s) => `<circle cx="${EYE_X}" cy="${s * EYE_Y}" r="7.4" fill="none" stroke="#6B3D1A" stroke-width="2.9"/><circle cx="${EYE_X}" cy="${s * EYE_Y}" r="7.4" fill="none" stroke="#C47A35" stroke-width="2.9" stroke-dasharray="2.2 3.4 1.2 4" stroke-linecap="round"/>`).join("")}
      <rect x="${EYE_X - 1.3}" y="-2.4" width="2.6" height="4.8" rx="1.1" fill="#6B3D1A"/>${glint(7)}`,
  },
  {
    id: "g3", group: "glasses", label: "Gold octagon", note: "Faceted wire frame, a bit Parisian",
    svg: `${arms(GOLD, 1.5, 16.4)}${lensTint(7.2)}
      ${[-1, 1].map((s) => `<polygon points="${octagon(EYE_X, s * EYE_Y, 7.8)}" fill="none" stroke="${GOLD}" stroke-width="1.7" stroke-linejoin="round"/>`).join("")}
      <path d="M${EYE_X + 1.8} -2.6 L${EYE_X + 1.8} 2.6" stroke="${GOLD}" stroke-width="1.6" stroke-linecap="round"/>${glint(7)}`,
  },
  {
    id: "g4", group: "glasses", label: "Browline", note: "Dark brow + gold rim — the architect pair",
    svg: `${arms("#2A211C", 1.9, 16.8)}${lensTint(7.2)}
      ${[-1, 1].map((s) => `<circle cx="${EYE_X}" cy="${s * EYE_Y}" r="7.2" fill="none" stroke="${GOLD}" stroke-width="1.1"/><path d="M${EYE_X} ${s * EYE_Y - 7.4} A7.4 7.4 0 0 0 ${EYE_X} ${s * EYE_Y + 7.4}" fill="none" stroke="#2A211C" stroke-width="3.4" stroke-linecap="round"/>`).join("")}
      <path d="M${EYE_X} -2.2 L${EYE_X} 2.2" stroke="${GOLD}" stroke-width="1.5" stroke-linecap="round"/>${glint(7)}`,
  },
];

/* ═════════════ Headphones ═════════════ */

function headphones(o: { band: string; bandEdge: string; cup: string; cupEdge: string; pad: string; accent?: string; bandW?: number }) {
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

const HEADPHONES: HatDesign[] = [
  {
    id: "h1", group: "headphones", label: "Silver", note: "Aluminium cups, mesh band — studio quiet",
    svg: headphones({ band: "#E3E6EA", bandEdge: "#9AA0A8", cup: "#D4D8DD", cupEdge: "#8D939B", pad: "#5B6068" }),
  },
  {
    id: "h2", group: "headphones", label: "Retro foam", note: "Wire band + orange foam, cassette era",
    svg: `<path d="M-1 -24 Q-12 0 -1 24" fill="none" stroke="#2A2A2E" stroke-width="2.2" stroke-linecap="round"/>
      ${[-1, 1].map((s) => `<rect x="-4.4" y="${s * 23 - 2.2}" width="6.8" height="4.4" rx="1.4" fill="#2A2A2E"/>
        <circle cx="-1" cy="${s * 27.2}" r="6.4" fill="#FF8A1F"/><circle cx="-1" cy="${s * 27.2}" r="6.4" fill="none" stroke="#E06A00" stroke-width="1"/>
        <circle cx="-2.6" cy="${s * 27.2 - 1.8}" r="1.6" fill="#FFB66B"/>`).join("")}`,
  },
  {
    id: "h3", group: "headphones", label: "Studio black", note: "Matte black, red accent line",
    svg: headphones({ band: "#232428", bandEdge: "#0F0F11", cup: "#1E1F23", cupEdge: "#0F0F11", pad: "#3A3B41", accent: "#E53935", bandW: 5.4 }),
  },
  {
    id: "h4", group: "headphones", label: "Cream & mint", note: "Soft pastel, very desk-setup",
    svg: headphones({ band: "#F6F1E7", bandEdge: "#CFC6B5", cup: "#8FD9BD", cupEdge: "#5DB896", pad: "#F6F1E7", accent: "#F6F1E7" }),
  },
];

/* ═════════════ Grad cap · Michigan ═════════════ */

const NAVY = "#00274C", MAIZE = "#FFCB05";
// Michigan-style block M, 16 × 12, centred on (0,0)
const BLOCK_M = "M-8 -6H-3L0 -1.4L3 -6H8V-3.6H6.6V3.6H8V6H2.4V3.6H3.6V-0.9L0 4.1L-3.6 -0.9V3.6H-2.4V6H-8V3.6H-6.6V-3.6H-8Z";
const tassel = (x: number, y: number) =>
  `<rect x="${x - 1.4}" y="${y}" width="2.8" height="7" rx="1" fill="${MAIZE}"/><rect x="${x - 1.8}" y="${y - 1.2}" width="3.6" height="2" rx="1" fill="#E0A800"/>`;

const CAPS: HatDesign[] = [
  {
    id: "m1", group: "cap", label: "Diamond + M", note: "Board on the diagonal, block M, maize tassel",
    svg: (ang) => `<polygon points="-6,-21 15,0 -6,21 -27,0" fill="${NAVY}" stroke="rgba(255,255,255,.22)" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M-6 0 Q-14 8 -17.5 10.5" fill="none" stroke="${MAIZE}" stroke-width="1.5"/>${tassel(-17.5, 10)}
      <path d="${BLOCK_M}" transform="translate(-6 0) rotate(${-ang}) scale(.82)" fill="${MAIZE}"/>`,
  },
  {
    id: "m2", group: "cap", label: "Square + M", note: "Board square to the head, tassel off the back",
    svg: (ang) => `<rect x="-24" y="-15" width="30" height="30" rx="2" fill="${NAVY}" stroke="rgba(255,255,255,.22)" stroke-width="1.2"/>
      <path d="M-9 0 Q-18 -6 -24 -9" fill="none" stroke="${MAIZE}" stroke-width="1.5"/>${tassel(-24.5, -9.5)}
      <path d="${BLOCK_M}" transform="translate(-9 0) rotate(${-ang}) scale(.95)" fill="${MAIZE}"/>`,
  },
];

/* ═════════════ Bow ═════════════ */

function bow(o: { fill: string; shade: string; hi: string; knot: string; extra?: string }) {
  const loop = (s: number) => `<path d="M0 0 C${s * 4} -9.5 ${s * 13.5} -10.5 ${s * 13.5} -3 C${s * 13.5} 4 ${s * 4.5} 5 0 0Z" fill="${o.fill}"/>
    <path d="M0 0 C${s * 4} -3.5 ${s * 8} -4.5 ${s * 11} -3" fill="none" stroke="${o.shade}" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M${s * 5} -6.8 C${s * 8} -8 ${s * 10.5} -7 ${s * 11.5} -5" fill="none" stroke="${o.hi}" stroke-width="1.2" stroke-linecap="round"/>`;
  const tails = `<polygon points="-1,1 -5.6,10.6 -3.3,9.7 -2.5,12.2 1.2,2" fill="${o.shade}"/><polygon points="1,1 5.4,10.8 3.1,10 2.3,12.4 -1,2" fill="${o.fill}"/>`;
  return `<g transform="translate(-7 -14) rotate(-20)">${tails}${loop(-1)}${loop(1)}${o.extra ?? ""}<rect x="-2.7" y="-3.3" width="5.4" height="6.6" rx="1.9" fill="${o.knot}"/></g>`;
}

const BOWS: HatDesign[] = [
  { id: "b1", group: "bow", label: "Satin pink", note: "Classic loops, soft sheen", svg: bow({ fill: "#FF5C8A", shade: "#D63A69", hi: "#FFB3C8", knot: "#E84677" }) },
  {
    id: "b2", group: "bow", label: "Red polka", note: "Cherry red, white dots",
    svg: bow({
      fill: "#E8333A", shade: "#B71C24", hi: "#FF8A8E", knot: "#C8232B",
      extra: [[-9, -4], [-5.5, -1], [-11.5, -1.2], [9, -4], [5.5, -1], [11.5, -1.2], [-7, -6.8], [7, -6.8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".95" fill="#fff"/>`).join(""),
    }),
  },
  { id: "b3", group: "bow", label: "Black velvet", note: "Evening black, gold knot", svg: bow({ fill: "#202026", shade: "#0B0B0E", hi: "#4A4A55", knot: "#D4AF37" }) },
  {
    id: "b4", group: "bow", label: "Lilac geometric", note: "Two soft triangles, minimal",
    svg: `<g transform="translate(-7 -14) rotate(-20)">
      <path d="M-1 0 L-12 -6.5 Q-13.5 -7.2 -13.5 -5.5 V5.5 Q-13.5 7.2 -12 6.5Z" fill="#B79CFF" stroke="#B79CFF" stroke-width="2" stroke-linejoin="round"/>
      <path d="M1 0 L12 -6.5 Q13.5 -7.2 13.5 -5.5 V5.5 Q13.5 7.2 12 6.5Z" fill="#9F80F5" stroke="#9F80F5" stroke-width="2" stroke-linejoin="round"/>
      <circle r="3.4" fill="#7E5BE8"/></g>`,
  },
];

/* ═════════════ New idea 1 · Crown ═════════════ */

const CROWN = "-13,-10 -13,-24 -6.5,-17 0,-28 6.5,-17 13,-24 13,-10";
const CROWNS: HatDesign[] = [
  {
    id: "k1", group: "crown", label: "Royal gold", note: "King snake. Gold, ruby, pearl tips",
    svg: `<g transform="translate(-3 -1)"><polygon points="${CROWN}" fill="#F5B027" stroke="#C98A0C" stroke-width="1.1" stroke-linejoin="round"/>
      <rect x="-13" y="-13.5" width="26" height="4.5" fill="#E09A12"/>
      <circle cx="-13" cy="-24.6" r="1.8" fill="#FFF3C4"/><circle cx="0" cy="-28.6" r="1.8" fill="#FFF3C4"/><circle cx="13" cy="-24.6" r="1.8" fill="#FFF3C4"/>
      <circle cx="0" cy="-11.3" r="1.9" fill="#E5384A"/><circle cx="-7" cy="-11.3" r="1.3" fill="#2F7BEA"/><circle cx="7" cy="-11.3" r="1.3" fill="#2F7BEA"/>
      <path d="M-10 -21 L-10 -15" stroke="#FFE08A" stroke-width="1.2" stroke-linecap="round"/></g>`,
  },
  {
    id: "k2", group: "crown", label: "Line gold", note: "Outline only — quiet luxury",
    svg: `<g transform="translate(-3 -1)"><polygon points="${CROWN}" fill="rgba(245,176,39,.18)" stroke="#E7A21C" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-13 -13.5 H13" stroke="#E7A21C" stroke-width="1.6"/>
      <circle cx="-13" cy="-25.4" r="1.6" fill="#E7A21C"/><circle cx="0" cy="-29.4" r="1.6" fill="#E7A21C"/><circle cx="13" cy="-25.4" r="1.6" fill="#E7A21C"/></g>`,
  },
  {
    id: "k3", group: "crown", label: "Pixel crown", note: "8-bit, matches the desktop icons",
    svg: pixels([
      "K.....K.....K",
      "YK...KYK...KY",
      "YYK.KYYYK.KYY",
      "YYYKYYRYYKYYY",
      "YYYYYYYYYYYYY",
      "OOOOOOOOOOOOO",
      "OBOOOOROOOOBO",
      "OOOOOOOOOOOOO",
    ], { K: "#FFF3C4", Y: "#F5B027", O: "#D98E0B", R: "#E5384A", B: "#2F7BEA" }, 2.1, -16.6, -31),
  },
  {
    id: "k4", group: "crown", label: "Tilted mini", note: "Small and askew, worn with attitude",
    svg: `<g transform="translate(-9 -19) rotate(-18) scale(.72) translate(0 17)"><polygon points="${CROWN}" fill="#F5B027" stroke="#C98A0C" stroke-width="1.3" stroke-linejoin="round"/>
      <rect x="-13" y="-13.5" width="26" height="4.5" fill="#E09A12"/>
      <circle cx="-13" cy="-24.6" r="2" fill="#FFF3C4"/><circle cx="0" cy="-28.6" r="2" fill="#FFF3C4"/><circle cx="13" cy="-24.6" r="2" fill="#FFF3C4"/>
      <circle cx="0" cy="-11.3" r="2.1" fill="#E5384A"/></g>`,
  },
];

/* ═════════════ New idea 2 · Shades ═════════════ */

const SHADES: HatDesign[] = [
  {
    id: "s1", group: "shades", label: "Deal with it", note: "Pixel meme shades — instant cool",
    svg: pixels([
      "KKKK....",
      "KKKK....",
      "KKKKK...",
      "KWKKK...",
      "KKWKK...",
      "KKKKK...",
      "KKKK....",
      "KKKK....",
      "KKK.....",
      "KKK.....",
      "KKKKK...",
      "KWKKK...",
      "KKWKK...",
      "KKKKK...",
      "KKKK....",
      "KKKK....",
    ], { K: "#0E0E10", W: "#ffffff" }, 2.3, 7.4, -18.4)
      + [-1, 1].map((s) => `<path d="M8 ${s * 17.2} L-12 ${s * 19.4}" stroke="#0E0E10" stroke-width="2.3"/>`).join(""),
  },
  {
    id: "s2", group: "shades", label: "Aviator", note: "Gold frame, smoky teardrop lenses",
    svg: `${arms(GOLD, 1.4, 17)}
      ${[-1, 1].map((s) => `<path d="M${EYE_X + 7} ${s * 2.6} C${EYE_X + 8} ${s * 10} ${EYE_X + 5} ${s * 17} ${EYE_X - 1} ${s * 17} C${EYE_X - 6} ${s * 17} ${EYE_X - 7} ${s * 11} ${EYE_X - 6} ${s * 6} C${EYE_X - 5} ${s * 2.4} ${EYE_X + 1} ${s * 1.8} ${EYE_X + 7} ${s * 2.6}Z" fill="#3B4250" fill-opacity=".9" stroke="${GOLD}" stroke-width="1.4"/>
        <path d="M${EYE_X + 3.6} ${s * 5} L${EYE_X + 1} ${s * 9}" stroke="rgba(255,255,255,.55)" stroke-width="1.2" stroke-linecap="round"/>`).join("")}
      <path d="M${EYE_X + 6.6} -2.6 L${EYE_X + 6.6} 2.6 M${EYE_X - 4} -3.6 Q${EYE_X - 5} 0 ${EYE_X - 4} 3.6" fill="none" stroke="${GOLD}" stroke-width="1.3" stroke-linecap="round"/>`,
  },
  {
    id: "s3", group: "shades", label: "Vision headset", note: "Glossy visor + strap. Very AI PM",
    svg: `${[-1, 1].map((s) => `<path d="M8 ${s * 18.6} L-9 ${s * 19.6}" stroke="#2A2B30" stroke-width="3.4" stroke-linecap="round"/>`).join("")}
      <rect x="6.5" y="-20.5" width="15" height="41" rx="7.5" fill="#15161A"/>
      <rect x="9" y="-18" width="11" height="36" rx="5.5" fill="#2B3A55"/>
      <path d="M11.5 -14 Q14 -4 11.5 6" fill="none" stroke="rgba(160,200,255,.55)" stroke-width="2" stroke-linecap="round"/>
      <rect x="6.5" y="-20.5" width="15" height="41" rx="7.5" fill="none" stroke="#C9CDD4" stroke-width="1"/>`,
  },
  {
    id: "s4", group: "shades", label: "Neon visor", note: "Cyber bar, cyan to pink",
    svg: `<defs><linearGradient id="snk-neon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3EE6FF"/><stop offset="1" stop-color="#FF4FD8"/></linearGradient></defs>
      ${[-1, 1].map((s) => `<path d="M10 ${s * 18} L-12 ${s * 19.6}" stroke="#E9ECF2" stroke-width="2"/>`).join("")}
      <path d="M10.5 -19.5 L19.5 -17 Q21 -16.5 21 -15 V15 Q21 16.5 19.5 17 L10.5 19.5 Q9 20 9 18.4 V-18.4 Q9 -20 10.5 -19.5Z" fill="url(#snk-neon)" fill-opacity=".92"/>
      <path d="M12 -15 V15" stroke="rgba(255,255,255,.6)" stroke-width="1.2" stroke-linecap="round"/>`,
  },
];

/* ═════════════ New idea 3 · Flowers ═════════════ */

const petals = (n: number, rx: number, ry: number, d: number, fill: string) =>
  Array.from({ length: n }, (_, i) => `<ellipse cx="0" cy="${-d}" rx="${rx}" ry="${ry}" fill="${fill}" transform="rotate(${(360 / n) * i})"/>`).join("");
const sakura = (fill: string, edge: string) =>
  Array.from({ length: 5 }, (_, i) => `<path d="M0 0 C-3.6 -2.4 -3.4 -7.6 -1 -8.2 L0 -6.8 L1 -8.2 C3.4 -7.6 3.6 -2.4 0 0Z" fill="${fill}" stroke="${edge}" stroke-width=".5" transform="rotate(${72 * i})"/>`).join("");

const FLOWERS: HatDesign[] = [
  {
    id: "f1", group: "flower", label: "Sprout", note: "A tiny idea growing",
    svg: `<path d="M-2 -20 C-2 -24 -1 -27 0 -29" fill="none" stroke="#2E8B4A" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M0 -28 C-3 -33.5 -11 -33 -12.5 -27.5 C-7 -25 -2.5 -25.5 0 -28Z" fill="#B6F27A" stroke="#4FA63A" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M0 -28 C3 -32.5 10.5 -32 11.5 -27 C6.5 -24.8 2.5 -25.4 0 -28Z" fill="#8EE05E" stroke="#4FA63A" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M-1.5 -27.8 L-8.5 -28.2 M1.5 -27.8 L8 -28" stroke="#4FA63A" stroke-width=".8" stroke-linecap="round"/>`,
  },
  {
    id: "f2", group: "flower", label: "Daisy", note: "Tucked behind the ear",
    svg: `<g transform="translate(-10 -19) rotate(12)">${petals(10, 2.3, 5, 5.2, "#FFFFFF")}
      <circle r="3.6" fill="#F5B027"/><circle r="3.6" fill="none" stroke="#DB8E12" stroke-width=".8"/><circle cx="-1" cy="-1" r="1" fill="#FFD66B"/></g>`,
  },
  {
    id: "f3", group: "flower", label: "Sakura sprig", note: "Cherry blossom + bud, spring",
    svg: `<path d="M-17 -15 Q-8 -24 4 -24" fill="none" stroke="#6B4A3A" stroke-width="1.6" stroke-linecap="round"/>
      <g transform="translate(-9 -22)">${sakura("#FFC2D6", "#F08FB0")}<circle r="1.6" fill="#E85C8C"/></g>
      <g transform="translate(4.5 -24.5) scale(.7) rotate(20)">${sakura("#FFD7E4", "#F08FB0")}<circle r="1.6" fill="#E85C8C"/></g>
      <ellipse cx="-16" cy="-17" rx="2.2" ry="3" transform="rotate(-40 -16 -17)" fill="#F7A6C2"/>
      <ellipse cx="-3" cy="-20.5" rx="2.4" ry="1.3" transform="rotate(-25 -3 -20.5)" fill="#7CC47F"/>`,
  },
  {
    id: "f4", group: "flower", label: "Flower crown", note: "A little garland across the top",
    svg: `<path d="M-19 -19 Q0 -25 19 -19" fill="none" stroke="#4FA63A" stroke-width="1.6" stroke-linecap="round"/>
      ${[[-16, -19.5, "#FF8FB1"], [-5.5, -22.5, "#FFD34F"], [5.5, -22.5, "#B79CFF"], [16, -19.5, "#FF8FB1"]].map(([x, y, c]) =>
        `<g transform="translate(${x} ${y})">${petals(5, 2.4, 3, 2.8, c as string)}<circle r="1.6" fill="#fff"/></g>`).join("")}
      <ellipse cx="-11" cy="-22" rx="2.4" ry="1.2" transform="rotate(-20 -11 -22)" fill="#6FC060"/>
      <ellipse cx="11" cy="-22" rx="2.4" ry="1.2" transform="rotate(20 11 -22)" fill="#6FC060"/>
      <ellipse cx="0" cy="-24.6" rx="2.2" ry="1.1" fill="#6FC060"/>`,
  },
];

export const HAT_GROUPS: { id: string; title: string; brief: string; designs: HatDesign[] }[] = [
  { id: "glasses", title: "Glasses", brief: "Art-house frames — pick one", designs: GLASSES },
  { id: "headphones", title: "Headphones", brief: "Redesigned: real cups, cushions, a proper band", designs: HEADPHONES },
  { id: "cap", title: "Grad cap", brief: "University of Michigan block M, nothing clipped", designs: CAPS },
  { id: "bow", title: "Bow", brief: "Four new bows", designs: BOWS },
  { id: "crown", title: "New · Crown", brief: "King snake", designs: CROWNS },
  { id: "shades", title: "New · Shades", brief: "Cool eyewear — hides the eyes", designs: SHADES },
  { id: "flower", title: "New · Flowers", brief: "Something growing on the head", designs: FLOWERS },
];
