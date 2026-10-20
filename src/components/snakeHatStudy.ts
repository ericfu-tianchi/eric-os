/**
 * Wardrobe study set for /hat-study.html (dev only, never imported by the site).
 * Builds on the helpers and shipped picks in snakeHats.ts.
 */
import {
  INK, ASK_GLYPH, EYE_X, EYE_Y, MAIZE, arms, lensTint, glint, headphones, HAT_PHONES, NAVY, BLOCK_M, BLK, blackHi, HAT_GLASSES, capBoard, sideTassel, M, HAT_CAP, LOOP, BOW_B1, HAT_BOW, memeShades, PK, LENS, HAT_SHADES, CAT_EAR, CAT_INNER, catEars, HAT_CAT, NY_LOGO_D, nyCap, HAT_NYCAP, SNAKE_HATS,
  type HatDesign, type ChatGlyph, type CapColors,
} from "./snakeHats";

export { hatSvg } from "./snakeHats";

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
  ASK_GLYPH,
  {
    id: "c4", label: "Duo, filled", note: "Brand green + ink, geometric",
    svg: `<path d="M15 3h10a5 5 0 0 1 5 5v4.5a5 5 0 0 1-5 5h-.5v3.5l-4-3.5H15a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Z" fill="${INK}"/>
      <path d="M7 11h11a5 5 0 0 1 5 5v5a5 5 0 0 1-5 5h-7l-5 4v-4.2A5 5 0 0 1 2 21v-5a5 5 0 0 1 5-5Z" fill="#06C268" stroke="#fff" stroke-width="2"/>
      <circle cx="7.5" cy="18.5" r="1.6" fill="#fff"/><circle cx="12.5" cy="18.5" r="1.6" fill="#fff"/><circle cx="17.5" cy="18.5" r="1.6" fill="#fff"/>`,
  },
];

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
  HAT_PHONES,
];

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

const BLACK_GLASSES: HatDesign[] = [
  {
    id: "bg1", group: "glasses", label: "Black wire round", note: "Thin black wire, keyhole bridge — the quiet one",
    svg: `${arms(BLK, 1.4, 16.6)}${lensTint(7.4)}
      ${[-1, 1].map((s) => `<circle cx="${EYE_X}" cy="${s * EYE_Y}" r="7.4" fill="none" stroke="${BLK}" stroke-width="1.6"/>`).join("")}
      <path d="M${EYE_X + 2.6} -2.3 q 2.6 2.3 0 4.6" fill="none" stroke="${BLK}" stroke-width="1.5" stroke-linecap="round"/>${glint(7.4)}`,
  },
  HAT_GLASSES,
  {
    id: "bg3", group: "glasses", label: "Black rounded square", note: "Soft-square optical frame, a bit studio",
    svg: `${arms(BLK, 2.2, 17.2)}
      ${[-1, 1].map((s) => `<rect x="${EYE_X - 7.4}" y="${s * EYE_Y - 7.4}" width="14.8" height="14.8" rx="4.6" fill="rgba(255,255,255,.16)" stroke="${BLK}" stroke-width="2.6"/>`).join("")}
      <rect x="${EYE_X - 1.3}" y="-2.2" width="2.6" height="4.4" rx="1" fill="${BLK}"/>${glint(6.6)}`,
  },
  {
    id: "bg4", group: "glasses", label: "Black octagon", note: "Faceted thin frame",
    svg: `${arms(BLK, 1.4, 16.4)}${lensTint(7.2)}
      ${[-1, 1].map((s) => `<polygon points="${octagon(EYE_X, s * EYE_Y, 7.8)}" fill="none" stroke="${BLK}" stroke-width="1.7" stroke-linejoin="round"/>`).join("")}
      <path d="M${EYE_X + 1.8} -2.6 L${EYE_X + 1.8} 2.6" stroke="${BLK}" stroke-width="1.5" stroke-linecap="round"/>${glint(7)}`,
  },
  {
    id: "bg5", group: "glasses", label: "Black oversized", note: "Big round lenses, thick rim — bookish",
    svg: `${arms(BLK, 2.4, 18.4)}${lensTint(8.4)}
      ${[-1, 1].map((s) => `<circle cx="${EYE_X - 0.4}" cy="${s * 9.8}" r="8.6" fill="none" stroke="${BLK}" stroke-width="2.6"/>`).join("")}
      <path d="M${EYE_X - 0.4} -1.2 L${EYE_X - 0.4} 1.2" stroke="${BLK}" stroke-width="2.6"/>${glint(7.6)}`,
  },
];

const CAPS2: HatDesign[] = [
  {
    id: "mc1", group: "cap", label: "Black + maize M", note: "U-M caps are black; maize M dead centre, tassel over the side corner",
    svg: (ang) => `${capBoard("#16171A")}${M(ang, -5, 0.86, MAIZE)}${sideTassel(MAIZE, MAIZE, "#E0A800")}`,
  },
  HAT_CAP,
  {
    id: "mc3", group: "cap", label: "Button + M up front", note: "Real cap layout: centre button, M in the front half, cord runs back",
    svg: (ang) => `${capBoard("#16171A")}
      <path d="M-5 0 L-18 0" stroke="${MAIZE}" stroke-width="1.4" stroke-linecap="round"/><circle cx="-5" cy="0" r="1.9" fill="${MAIZE}"/>
      <rect x="-27.2" y="-1.6" width="2.2" height="3.2" rx="1" fill="#E0A800"/><path d="M-25.2 -1.4 v2.8 l-7.4 .6 v-4 z" fill="${MAIZE}"/>
      ${M(ang, 4.6, 0.52, MAIZE)}`,
  },
  {
    id: "mc4", group: "cap", label: "Maize + blue M", note: "Inverted Go Blue: maize board, navy M and tassel",
    svg: (ang) => `${capBoard(MAIZE, "rgba(0,0,0,.18)")}${M(ang, -5, 0.86, NAVY)}${sideTassel(NAVY, NAVY, "#001B36")}`,
  },
];

const SHADES2: HatDesign[] = [
  HAT_SHADES,
  {
    id: "s1b", group: "shades", label: "Oversized", note: "Bigger pixels, a touch wider than the head — loud",
    svg: memeShades(LENS.map((r, i) => (i === 1 ? r.replace(/KWK/g, "WWK") : r)), 2.3, PK, PK.K),
  },
  { id: "s1c", group: "shades", label: "Two-tone", note: "Graphite lower rows for depth", svg: memeShades(LENS.map((r, i) => (i >= 4 ? r.replace(/K/g, "G") : r)), 2, PK, PK.K) },
  {
    id: "s1d", group: "shades", label: "Mirror", note: "Rows fade ink → steel, like a mirrored lens",
    svg: memeShades(LENS.map((r, i) => (i === 0 ? r : r.replace(/K/g, "KKSSTT"[i] ?? "K"))), 2, { ...PK, S: "#2B3442", T: "#4A5A70" }, PK.K),
  },
];

const C0 = -3; // a touch behind centre so the eyes stay clear

const spin = (dur: number) => `<animateTransform attributeName="transform" type="rotate" from="0 ${C0} 0" to="360 ${C0} 0" dur="${dur}s" repeatCount="indefinite"/>`;

function propeller(wedges: string[], blade: string, hub: string, rim: string) {
  const n = wedges.length, r = 14.5;
  const seg = wedges.map((c, i) => {
    const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
    const p = (a: number) => `${(C0 + r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
    return `<path d="M${C0} 0 L${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}Z" fill="${c}"/>`;
  }).join("");
  return `${seg}<circle cx="${C0}" cy="0" r="${r}" fill="none" stroke="${rim}" stroke-width="1.2"/>
    <g>${spin(1.4)}<ellipse cx="${C0 - 7}" cy="0" rx="7" ry="2.5" fill="${blade}"/><ellipse cx="${C0 + 7}" cy="0" rx="7" ry="2.5" fill="${blade}"/></g>
    <circle cx="${C0}" cy="0" r="2.6" fill="${hub}"/>`;
}

const leaf = (x: number, y: number, rot: number, fill: string) => `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="3.8" ry="1.7" transform="rotate(${rot.toFixed(1)} ${x.toFixed(2)} ${y.toFixed(2)})" fill="${fill}"/>`;

function laurel(fill: string, dark: string, R = 24) {
  let out = "";
  for (const s of [-1, 1]) {
    out += `<path d="M${(C0 + R * Math.cos(Math.PI * 0.97)).toFixed(2)} ${(s * R * Math.sin(Math.PI * 0.97)).toFixed(2)} A${R} ${R} 0 0 ${s > 0 ? 0 : 1} ${(C0 + R * Math.cos(Math.PI * 0.27)).toFixed(2)} ${(s * R * Math.sin(Math.PI * 0.27)).toFixed(2)}" fill="none" stroke="${dark}" stroke-width="1.1"/>`;
    for (let k = 0; k < 7; k++) {
      const a = Math.PI * (0.92 - k * 0.1);
      const x = C0 + R * Math.cos(a), y = s * R * Math.sin(a);
      const tan = (Math.atan2(s * Math.cos(a), -Math.sin(a)) * 180) / Math.PI;
      const off = 2.4;
      out += leaf(x + off * Math.cos(a), y + off * s * Math.sin(a), tan + s * 30, k % 2 ? fill : dark);
      out += leaf(x - off * Math.cos(a), y - off * s * Math.sin(a), tan - s * 30, k % 2 ? dark : fill);
    }
  }
  return out;
}

function centreFlower(petalSvg: string, core: string) {
  return `<g transform="translate(${C0} 0)">${petalSvg}${core}</g>`;
}

const CENTRE: HatDesign[] = [
  {
    id: "p1", group: "centre", label: "Propeller beanie", note: "Classic four-colour cap, the propeller spins",
    svg: propeller(["#E8333A", "#F5B027", "#2F7BEA", "#F5B027"], "#2A2B30", "#F5B027", "rgba(0,0,0,.25)"),
  },
  {
    id: "p2", group: "centre", label: "Propeller · Go Blue", note: "Navy and maize segments, white propeller",
    svg: propeller([NAVY, MAIZE, NAVY, MAIZE, NAVY, MAIZE, NAVY, MAIZE], "#FFFFFF", MAIZE, "rgba(0,0,0,.3)"),
  },
  {
    id: "p3", group: "centre", label: "Propeller · rainbow", note: "Six colours, white blades",
    svg: propeller(["#E8333A", "#FF8A1F", "#F5B027", "#3BB273", "#2F7BEA", "#8E6CF0"], "#FFFFFF", "#1E1F23", "rgba(0,0,0,.25)"),
  },
  {
    id: "w1", group: "centre", label: "Gold laurel", note: "A winner's wreath around the head, open at the face",
    svg: laurel("#F2C14E", "#C9962A"),
  },
  {
    id: "w2", group: "centre", label: "Olive laurel", note: "Same wreath in deep olive — calmer",
    svg: laurel("#9CC06A", "#5E8A3A"),
  },
  {
    id: "w3", group: "centre", label: "Angel halo", note: "A glowing gold ring floating over the head",
    svg: `<circle cx="${C0}" cy="0" r="13" fill="none" stroke="rgba(255,214,90,.35)" stroke-width="5"/>
      <circle cx="${C0}" cy="0" r="13" fill="none" stroke="#FFD65A" stroke-width="2.4"/>
      <circle cx="${C0}" cy="0" r="13" fill="none" stroke="#FFF4C2" stroke-width=".9" stroke-dasharray="9 73" transform="rotate(200 ${C0} 0)"/>`,
  },
  {
    id: "fc1", group: "centre", label: "Sakura, centred", note: "One big cherry blossom right on top",
    svg: centreFlower(sakura("#FFC2D6", "#F08FB0").replace(/rotate\(/g, "scale(1.55) rotate("), `<circle r="2.6" fill="#E85C8C"/>${Array.from({ length: 5 }, (_, i) => `<circle cx="${(4.2 * Math.cos((i * 72 - 90) * Math.PI / 180)).toFixed(2)}" cy="${(4.2 * Math.sin((i * 72 - 90) * Math.PI / 180)).toFixed(2)}" r=".8" fill="#C2386B"/>`).join("")}`),
  },
  {
    id: "fc2", group: "centre", label: "Sunflower", note: "Big, warm, unmistakable",
    svg: centreFlower(`${petals(14, 2.6, 5.4, 9.6, "#F5B027")}${petals(14, 2.2, 4.6, 8.6, "#FFCF4A").replace(/rotate\((\S+)\)/g, (_, a) => `rotate(${Number(a) + 12.86})`)}`,
      `<circle r="6.6" fill="#6B3E1F"/><circle r="6.6" fill="none" stroke="#4A2A12" stroke-width="1"/>${Array.from({ length: 8 }, (_, i) => `<circle cx="${(3.4 * Math.cos(i * Math.PI / 4)).toFixed(2)}" cy="${(3.4 * Math.sin(i * Math.PI / 4)).toFixed(2)}" r=".8" fill="#A0652F"/>`).join("")}`),
  },
  {
    id: "fc3", group: "centre", label: "White daisy", note: "Clean white petals, golden heart",
    svg: centreFlower(petals(12, 2.6, 6.2, 8.2, "#FFFFFF") + petals(12, 2.6, 6.2, 8.2, "none").replace(/fill="none"/g, 'fill="none" stroke="#E4E4EA" stroke-width=".6"'),
      `<circle r="4.4" fill="#F5B027"/><circle cx="-1.2" cy="-1.2" r="1.3" fill="#FFD66B"/>`),
  },
];

function viking(o: { dome: string; rim: string; hi: string; horn: string; hornLine: string; long?: boolean }) {
  const t = o.long ? 1.18 : 1;
  const horn = (s: number) => `<path d="M-9 ${s * 10.5} C-12 ${s * 21 * t} -5 ${s * 29 * t} ${7 * t} ${s * 30.5 * Math.min(t, 1.05)} C${1.5 * t} ${s * 25 * t} -1 ${s * 18} -1 ${s * 11.5}Z" fill="${o.horn}" stroke="${o.hornLine}" stroke-width="1" stroke-linejoin="round"/>
    <path d="M-8.4 ${s * 17} Q-5 ${s * 16.4} -2.6 ${s * 15.6} M-6.6 ${s * 22.4} Q-3 ${s * 21.6} -0.4 ${s * 20.4}" fill="none" stroke="${o.hornLine}" stroke-width=".9" stroke-linecap="round"/>`;
  return `${horn(-1)}${horn(1)}
    <circle cx="-4" cy="0" r="13.5" fill="${o.dome}" stroke="${o.rim}" stroke-width="1.4"/>
    <path d="M-17.5 0 H9.5 M-4 -13.5 V13.5" stroke="${o.rim}" stroke-width="2.4" stroke-linecap="round"/>
    ${[[-14, -8], [-14, 8], [6, -8], [6, 8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="${o.rim}"/>`).join("")}
    <path d="M-12.5 -6.5 A10 10 0 0 1 -8 -10.6" fill="none" stroke="${o.hi}" stroke-width="1.6" stroke-linecap="round"/>`;
}

function headlamp(o: { strap: string; lamp: string; beam: string; id: string; pixel?: boolean }) {
  const beam = o.pixel
    ? [0, 1, 2, 3].map((k) => `<rect x="${22 + k * 3}" y="${-4 - k * 2.2}" width="3" height="${8 + k * 4.4}" fill="${o.beam}" opacity="${0.55 - k * 0.11}"/>`).join("")
    : `<defs><linearGradient id="${o.id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${o.beam}" stop-opacity=".75"/><stop offset="1" stop-color="${o.beam}" stop-opacity="0"/></linearGradient></defs>
       <path d="M21 -3.4 L34 -12 L34 12 L21 3.4Z" fill="url(#${o.id})"/>`;
  return `${beam}
    <rect x="-21.6" y="-21.6" width="43.2" height="43.2" rx="5" fill="none" stroke="${o.strap}" stroke-width="2.6"/>
    <rect x="15.4" y="-5.2" width="6.6" height="10.4" rx="2.2" fill="${o.lamp}"/>
    <rect x="19.6" y="-3.6" width="2.6" height="7.2" rx="1.2" fill="#FFF6C9"/>`;
}

const band = (c: string) => `<path d="M-2 -22.5 Q-8 0 -2 22.5" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/>`;

const EARS: HatDesign[] = [
  {
    id: "e1", group: "ears", label: "Cat ears", note: "Black band, pointed ears, pink inside",
    svg: `${band("#1E1F23")}${[-1, 1].map((s) => `<path d="M-11.5 ${s * 19.6} C-11.8 ${s * 24} -11 ${s * 28.5} -8.6 ${s * 31.4} C-3.6 ${s * 29.6} 1.4 ${s * 25.4} 4 ${s * 20.2} Q-3.8 ${s * 17.6} -11.5 ${s * 19.6}Z" fill="#1E1F23" stroke="#1E1F23" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M-8.4 ${s * 21} C-8.6 ${s * 23.8} -8.2 ${s * 26.4} -7.2 ${s * 28} C-4 ${s * 26.6} -1.2 ${s * 24.2} 0.6 ${s * 21.2} Q-4 ${s * 19.8} -8.4 ${s * 21}Z" fill="#FF8FB1"/>`).join("")}`,
  },
  {
    id: "e2", group: "ears", label: "Bunny ears", note: "Long soft ears flopping back",
    svg: `${band("#F4F1EC")}${[-1, 1].map((s) => `<ellipse cx="-9" cy="${s * 26}" rx="11.5" ry="4.6" transform="rotate(${s * 18} -9 ${s * 26})" fill="#FBF9F5" stroke="#D9D2C6" stroke-width="1"/>
      <ellipse cx="-9.6" cy="${s * 26.2}" rx="8" ry="2.2" transform="rotate(${s * 18} -9.6 ${s * 26.2})" fill="#FFB8CC"/>`).join("")}`,
  },
  {
    id: "e3", group: "ears", label: "Bear ears", note: "Round and fuzzy, honey brown",
    svg: `${band("#7A4A25")}${[-1, 1].map((s) => `<circle cx="-3.4" cy="${s * 24.5}" r="6.6" fill="#8A5530" stroke="#6A3E1E" stroke-width="1"/>
      <circle cx="-3.4" cy="${s * 25.2}" r="3.6" fill="#D9A06A"/>`).join("")}`,
  },
];

function aviatorCap(o: { leather: string; seam: string; flap: string; rim: string; lens: string; trim?: string }) {
  return `${[-1, 1].map((s) => `<rect x="-15" y="${s > 0 ? 18.6 : -25.4}" width="14" height="6.8" rx="3.2" fill="${o.flap}" stroke="${o.seam}" stroke-width="1"/>`).join("")}
    <path d="M5 -21.4 L-17 -21.4 Q-21.6 -21.4 -21.6 -17 V17 Q-21.6 21.4 -17 21.4 L5 21.4 Q9.4 0 5 -21.4Z" fill="${o.leather}" stroke="${o.seam}" stroke-width="1.1"/>
    ${o.trim ? `<path d="M5 -21.4 Q9.4 0 5 21.4" fill="none" stroke="${o.trim}" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="0.1 3.2"/>` : ""}
    <path d="M-21.6 0 H4.4" stroke="${o.seam}" stroke-width=".9" stroke-dasharray="2 1.6"/>
    <path d="M-1.5 -21 V21" stroke="${o.seam}" stroke-width="2.6"/>
    ${[-1, 1].map((s) => `<circle cx="-1.5" cy="${s * 7.6}" r="5.6" fill="${o.lens}" stroke="${o.rim}" stroke-width="2"/>
      <path d="M-3.8 ${s * 7.6 - 2.6} a3.4 3.4 0 0 1 3 -1" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1" stroke-linecap="round"/>`).join("")}
    <rect x="-3" y="-2" width="3" height="4" rx="1" fill="${o.rim}"/>`;
}

const ROUND3: { id: string; title: string; brief: string; designs: HatDesign[] }[] = [
  {
    id: "viking", title: "Viking helmet", brief: "Dome behind the eyes, horns sweeping out", designs: [
      { id: "v1", group: "viking", label: "Iron + ivory", note: "Steel dome, cross ridge, rivets, ivory horns", svg: viking({ dome: "#A3ACB7", rim: "#68717D", hi: "#E3E8EE", horn: "#F3E9CF", hornLine: "#C7B48A" }) },
      { id: "v2", group: "viking", label: "Bronze", note: "Warm bronze dome, white horns", svg: viking({ dome: "#C98B45", rim: "#8C5A22", hi: "#F2C88E", horn: "#FBF7EE", hornLine: "#D1C6AE" }) },
      { id: "v3", group: "viking", label: "Dark iron, long horns", note: "Blackened helmet, longer horns — more drama", svg: viking({ dome: "#4A4F57", rim: "#26292E", hi: "#8E959F", horn: "#EFE4C6", hornLine: "#B9A57A", long: true }) },
    ],
  },
  {
    id: "lamp", title: "Headlamp", brief: "Strap round the head, light thrown ahead wherever it goes", designs: [
      { id: "l1", group: "lamp", label: "Classic", note: "Black strap, warm beam", svg: headlamp({ strap: "#1E1F23", lamp: "#2A2B30", beam: "#FFE27A", id: "snk-beam1" }) },
      { id: "l2", group: "lamp", label: "Trail orange", note: "Outdoor orange strap, cool white beam", svg: headlamp({ strap: "#FF7A1A", lamp: "#3A3B40", beam: "#E9F4FF", id: "snk-beam2" }) },
      { id: "l3", group: "lamp", label: "Pixel beam", note: "Stepped 8-bit light cone", svg: headlamp({ strap: "#1E1F23", lamp: "#2A2B30", beam: "#FFE27A", id: "snk-beam3", pixel: true }) },
    ],
  },
  { id: "ears", title: "Ear headbands", brief: "A band across the head, ears lying out to the sides", designs: EARS },
  {
    id: "aviator", title: "Aviator cap + goggles", brief: "Leather cap with ear flaps, goggles pushed up on top", designs: [
      { id: "a1", group: "aviator", label: "Brown + brass", note: "Classic flight leather, brass goggles", svg: aviatorCap({ leather: "#8B5A2B", seam: "#5E3A18", flap: "#7A4C22", rim: "#C99A3B", lens: "#8FB7C9" }) },
      { id: "a2", group: "aviator", label: "Black + chrome", note: "Black leather, chrome rims, green lenses", svg: aviatorCap({ leather: "#2A2B30", seam: "#121316", flap: "#232428", rim: "#C9CDD4", lens: "#5FAF8C" }) },
      { id: "a3", group: "aviator", label: "Tan + shearling", note: "Tan leather with a cream fleece edge", svg: aviatorCap({ leather: "#B98552", seam: "#8A5C30", flap: "#A97644", rim: "#C99A3B", lens: "#8FB7C9", trim: "#F4EBDD" }) },
    ],
  },
];

const CAT_EARS: HatDesign[] = [
  { id: "ce1", group: "ears", label: "Alert", note: "Out to the sides, tips leaning forward — curious", svg: catEars({ x: -3, y: 20, tilt: 28 }) },
  HAT_CAT,
  { id: "ce3", group: "ears", label: "Front corners", note: "Perched on the front corners, angled out at 45°", svg: catEars({ x: 11.5, y: 19.4, tilt: 45, k: 1.05, bandX: 2 }) },
  { id: "ce4", group: "ears", label: "Wide & big", note: "Straight out, bigger ears, slimmer band", svg: catEars({ x: -4, y: 20.5, tilt: 0, k: 1.4, bandW: 2.4 }) },
];

const NY_NAVY = "#0C2340";

const NY_CAPS: HatDesign[] = [
  {
    id: "ny2r", group: "nycap", label: "Navy + gold sticker", note: "Refined NY2: real NY insignia turned to face the button, rounder crown, eyelets, stitched seams and brim",
    svg: nyCap("snk-ny1", { crown: "#0B1D38", crownHi: "#1C3966", seam: "#050E1D", brim: "#0B1D38", brimHi: "#18335C", stitch: "rgba(255,255,255,.26)", logo: "#FFFFFF", eyelet: "#040B17" }, true),
  },
  HAT_NYCAP,
  {
    id: "ny2n", group: "nycap", label: "Navy, no sticker", note: "Clean brim — for comparison",
    svg: nyCap("snk-ny3", { crown: "#0B1D38", crownHi: "#1C3966", seam: "#050E1D", brim: "#0B1D38", brimHi: "#18335C", stitch: "rgba(255,255,255,.26)", logo: "#FFFFFF", eyelet: "#040B17" }, false),
  },
];

const fluff = (cx: number, cy: number, r: number, n: number, br: number, fill: string) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI;
    return `<circle cx="${(cx + r * Math.cos(a)).toFixed(2)}" cy="${(cy + r * Math.sin(a)).toFixed(2)}" r="${br}" fill="${fill}"/>`;
  }).join("");

const XMAS: HatDesign[] = [
  {
    id: "x1", group: "xmas", label: "Santa hat", note: "Red crown, fluffy white band, tip flopping back to a pompom",
    svg: `${fluff(-5, 0, 13.6, 16, 3.2, "#FFFFFF")}<circle cx="-5" cy="0" r="13.6" fill="#FFFFFF"/>
      <circle cx="-5" cy="0" r="10.6" fill="#D7263D"/>
      <path d="M-5 -6 C-12 -8 -20 -12 -26 -16 C-22 -9 -15 -3 -9 2 Z" fill="#B81D31"/>
      <circle cx="-26.5" cy="-16.5" r="4.6" fill="#FFFFFF"/><circle cx="-27.6" cy="-17.6" r="1.6" fill="#EDEFF3"/>
      <path d="M-11 -4.6 C-8 -7 -4 -7.2 -1.2 -5.6" fill="none" stroke="#F0566A" stroke-width="1.2" stroke-linecap="round"/>`,
  },
  {
    id: "x2", group: "xmas", label: "Reindeer antlers", note: "Brown antlers lying out to the sides, a jingle bell on the band",
    svg: `<path d="M-2 -21.5 Q-8 0 -2 21.5" fill="none" stroke="#D7263D" stroke-width="3" stroke-linecap="round"/>
      ${[-1, 1].map((s) => `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <g stroke="#7A4A25" stroke-width="3.4"><path d="M-3 ${s * 19.5} C-3.6 ${s * 25} -7 ${s * 29.5} -12.5 ${s * 32}"/><path d="M-3.8 ${s * 24.4} C-1 ${s * 26.6} 2.4 ${s * 27.4} 5.6 ${s * 26.8}"/><path d="M-6.4 ${s * 28.6} C-5 ${s * 31} -3.6 ${s * 32.4} -1.4 ${s * 33}"/><path d="M-9.4 ${s * 30.6} L-14.6 ${s * 27.4}"/></g>
        <g stroke="#B07A4A" stroke-width="1"><path d="M-3 ${s * 20.5} C-3.6 ${s * 25} -6.6 ${s * 29} -11.6 ${s * 31.4}"/><path d="M-3 ${s * 25.2} C-0.6 ${s * 26.8} 2.2 ${s * 27.2} 4.8 ${s * 26.8}"/></g></g>`).join("")}
      <circle cx="-4.6" cy="0" r="3" fill="#F5B027" stroke="#C98A0C" stroke-width=".8"/><path d="M-6 0.4 H-3.2" stroke="#8A5A08" stroke-width=".8"/>`,
  },
  {
    id: "x3", group: "xmas", label: "Elf hat", note: "Red and white stripes, gold bell at the tip",
    svg: `<defs><clipPath id="snk-elf"><path d="M6 -16 Q-12 -19 -20 -6 L-32 6 L-19 7 Q-12 19 6 16 Q11 0 6 -16Z"/></clipPath></defs>
      <path d="M6 -16 Q-12 -19 -20 -6 L-32 6 L-19 7 Q-12 19 6 16 Q11 0 6 -16Z" fill="#D7263D"/>
      <g clip-path="url(#snk-elf)">${[-28, -21, -14, -7, 0].map((x) => `<path d="M${x} -24 l-8 48" stroke="#FFFFFF" stroke-width="3"/>`).join("")}</g>
      <path d="M6.2 -16 Q11.4 0 6.2 16" fill="none" stroke="#2E9B4F" stroke-width="3.6" stroke-linecap="round"/>
      <circle cx="-32" cy="6" r="3.4" fill="#F5B027" stroke="#C98A0C" stroke-width=".8"/><path d="M-33.6 6.6 H-30.4" stroke="#8A5A08" stroke-width=".8"/>`,
  },
];

const HALLOWEEN: HatDesign[] = [
  {
    id: "hw1", group: "halloween", label: "Witch hat", note: "Wide black brim, purple band, the tip bent over",
    svg: `<circle cx="-10" cy="0" r="21" fill="#1E1F23"/><circle cx="-10" cy="0" r="20.4" fill="none" stroke="#3A3B42" stroke-width="1.2"/>
      <circle cx="-10" cy="0" r="11.5" fill="#26272C"/>
      <circle cx="-11.4" cy="-1.6" r="8" fill="#2E2F35"/><circle cx="-12.8" cy="-3.2" r="4.6" fill="#36373E"/>
      <circle cx="-10" cy="0" r="11.5" fill="none" stroke="#7E4FD8" stroke-width="3"/>
      <rect x="-0.6" y="-3.2" width="4.4" height="6.4" rx=".8" fill="#26272C" stroke="#F5B027" stroke-width="1.3"/>
      <path d="M-14 -4.4 C-18 -9.6 -23.6 -15 -31.6 -19.6 C-26.4 -12.6 -21.6 -7.6 -16.6 -1.2 Z" fill="#3E3F47" stroke="#1E1F23" stroke-width=".8" stroke-linejoin="round"/>
      <path d="M-16.4 -6.6 C-20.4 -10.6 -24.6 -14.4 -29.4 -17.6" fill="none" stroke="#5A5B64" stroke-width=".8" stroke-linecap="round"/>`,
  },
  {
    id: "hw2", group: "halloween", label: "Pumpkin", note: "A little jack-o'-lantern sat on top — ribs and a curly stem",
    svg: `${[0, 1].map((layer) => Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * 2 * Math.PI + Math.PI / 8;
        return `<circle cx="${(-4 + 9.2 * Math.cos(a)).toFixed(2)}" cy="${(9.2 * Math.sin(a)).toFixed(2)}" r="${layer ? 5.6 : 6.5}" fill="${layer ? "#FF8A1F" : "#D96A00"}"/>`;
      }).join("") + `<circle cx="-4" cy="0" r="${layer ? 10 : 10.8}" fill="${layer ? "#FF8A1F" : "#D96A00"}"/>`).join("")}
      ${Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * 2 * Math.PI;
        return `<path d="M${(-4 + 3 * Math.cos(a)).toFixed(2)} ${(3 * Math.sin(a)).toFixed(2)} L${(-4 + 14.6 * Math.cos(a)).toFixed(2)} ${(14.6 * Math.sin(a)).toFixed(2)}" stroke="#E07400" stroke-width="1.1" stroke-linecap="round"/>`;
      }).join("")}
      <path d="M-14.4 -5.4 A11 11 0 0 1 -8.4 -11.6" fill="none" stroke="#FFB15E" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M-4 0 C-3 -3 -1 -4 1.6 -4.4" fill="none" stroke="#3E7F3F" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="-4" cy="0" r="2.6" fill="#4F8F3A"/>
      <path d="M1.6 -4.4 q3 -1 2.4 2 q-.6 2.4 -3 1.4" fill="none" stroke="#5FA35A" stroke-width=".9" stroke-linecap="round"/>`,
  },
  {
    id: "hw3", group: "halloween", label: "Bat headband", note: "Black bat wings spread out to the sides",
    svg: `<path d="M-2 -21.5 Q-8 0 -2 21.5" fill="none" stroke="#1E1F23" stroke-width="3" stroke-linecap="round"/>
      ${[-1, 1].map((s) => `<g transform="scale(1 ${-s})">
        <path d="M-1 -20 C2 -25 5 -30 7 -33.6 C3 -31.4 0 -31 -2.6 -32.4 C-4 -30 -7 -29.4 -9.6 -30.8 C-10.6 -28 -13 -27 -15.6 -27.4 C-13 -24 -10 -21 -7 -20Z" fill="#221C2C" stroke="#8B6CC9" stroke-width="1" stroke-linejoin="round"/>
        <path d="M-4 -21 L-2.6 -32.4 M-5 -21 L-9.6 -30.8" stroke="#5B4785" stroke-width=".8" stroke-linecap="round"/></g>`).join("")}
      <ellipse cx="-4.6" cy="0" rx="2.8" ry="3.6" fill="#221C2C" stroke="#8B6CC9" stroke-width=".8"/><path d="M-6 -3.4 l-1.4 -2.2 l2.2 .8 M-6 3.4 l-1.4 2.2 l2.2 -.8" fill="#1E1F23" stroke="#1E1F23" stroke-width=".8"/>`,
  },
];

const pick = (list: HatDesign[], ids: string[]) => list.filter((d) => ids.includes(d.id));

export const HAT_GROUPS: { id: string; title: string; brief: string; tag: string; designs: HatDesign[] }[] = [
  { id: "nycap", title: "New York cap · backwards", brief: "Rebuilt from NY2: the real NY insignia, rounder crown, every seam stitched", tag: "round 5", designs: NY_CAPS },
  { id: "cat", title: "Cat ears · orientation", brief: "Same ears, four ways to wear them — pick one", tag: "round 4", designs: CAT_EARS },
  { id: "xmas", title: "Christmas", brief: "Pick one", tag: "round 4", designs: XMAS },
  { id: "halloween", title: "Halloween", brief: "Pick one", tag: "round 4", designs: HALLOWEEN },
  {
    id: "locked", title: "Locked", brief: "Already chosen", tag: "locked",
    designs: [...pick(HEADPHONES, ["h4"]), ...pick(BLACK_GLASSES, ["bg2"]), ...pick(CAPS2, ["mc2"]), HAT_BOW, ...pick(SHADES2, ["s1a"])],
  },
  { id: "kept", title: "Still on the table", brief: "From earlier rounds, no decision yet", tag: "kept", designs: [...ROUND3.flatMap((g) => g.designs).filter((d) => d.group !== "ears"), ...pick(FLOWERS, ["f3"]), ...CROWNS, ...CENTRE] },
];
