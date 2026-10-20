/**
 * Screen saver engines: plain canvas, no React. Each `make(W, H)` returns a
 * stepper (`step(dt)` in seconds) and a painter (`draw(ctx, now)`), in CSS
 * pixels. ScreenSaver.tsx runs them; motion-study.html previews them.
 * Look matches the desktop: 44px-style cells with a hairline gap, brand-green
 * snake, the apple icon, Geist type, and the smooth F mark (never pixelated).
 */
import fuWingMark from "../assets/fu-wing-mark.png";
import appleIcon from "../assets/icons/b/apple.png";
import { PROJECTS } from "../data/projects";
import heroRefugee from "../assets/old-site/heroes/refugeeone.webp";
import heroLego from "../assets/old-site/heroes/lego-world.webp";
import heroNeurobot from "../assets/old-site/heroes/neurobot.png";
import heroHomes from "../assets/old-site/heroes/homesoffcampus.png";
import heroHuawei from "../assets/old-site/heroes/huawei.png";
import heroSub from "../assets/old-site/heroes/subtension.png";
import heroConnectr from "../assets/old-site/heroes/connectr.png";
import heroRutabagga from "../assets/old-site/heroes/rutabagga.png";
export type { SaverId };

export type Saver = { step: (dt: number) => void; draw: (ctx: CanvasRenderingContext2D, now: number) => void };
import type { SaverId } from "../store";

const GREEN = "#06C268", PINK = "#FF4D7E", PAPER = "#1c1d21", GRIDL = "rgba(255,255,255,.045)", MUTED = "#8a8b92";
const GEMS = [GREEN, PINK, "#21C4C4", "#4D8BFF", "#F5B027", "#A77BFF"];
type P = [number, number];

const load = (src: string) => { const i = new Image(); i.src = src; return i; };
const FMARK = typeof Image !== "undefined" ? load(fuWingMark) : null;
const APPLE = typeof Image !== "undefined" ? load(appleIcon) : null;

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const ri = (n: number) => Math.floor(Math.random() * n);
const DIRS: P[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

// ---------- drawing ----------
function bg(ctx: CanvasRenderingContext2D, W: number, H: number) { ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H); }
function grid(ctx: CanvasRenderingContext2D, W: number, H: number, c: number, oy = 0) {
  ctx.strokeStyle = GRIDL; ctx.lineWidth = 1; ctx.beginPath();
  for (let x = 0; x <= W; x += c) { ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, H); }
  for (let y = oy % c; y <= H; y += c) { ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(W, Math.round(y) + 0.5); }
  ctx.stroke();
}
export function cell(ctx: CanvasRenderingContext2D, x: number, y: number, c: number, color = GREEN, s = 1) {
  const g = c * 0.023, w = (c - 2 * g) * s;
  ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x + c / 2 - w / 2, y + c / 2 - w / 2, w, w, w * 0.105); ctx.fill();
}
function head(ctx: CanvasRenderingContext2D, x: number, y: number, c: number, dx: number, dy: number, color: string, look?: P) {
  cell(ctx, x, y, c, color);
  const cx = x + c / 2, cy = y + c / 2, px = -dy, py = dx, er = c * 0.125;
  const lx = look ? look[0] : dx, ly = look ? look[1] : dy, m = Math.hypot(lx, ly) || 1;
  for (const k of [-1, 1]) {
    const ex = cx + dx * c * 0.3 + px * c * 0.21 * k, ey = cy + dy * c * 0.3 + py * c * 0.21 * k;
    ctx.fillStyle = "#fafafa"; ctx.beginPath(); ctx.arc(ex, ey, er, 0, 7); ctx.fill();
    ctx.fillStyle = "#363636"; ctx.beginPath(); ctx.arc(ex + (lx / m) * er * 0.42, ey + (ly / m) * er * 0.42, er * 0.42, 0, 7); ctx.fill();
  }
}
function drawSnake(ctx: CanvasRenderingContext2D, body: P[], c: number, oy: number, color: string, look?: P) {
  for (let i = body.length - 1; i >= 1; i--) cell(ctx, body[i][0] * c, oy + body[i][1] * c, c, color);
  const [hx, hy] = body[0], nb = body[1] ?? [hx - 1, hy];
  head(ctx, hx * c, oy + hy * c, c, Math.sign(hx - nb[0]), Math.sign(hy - nb[1]), color, look);
}
function apple(ctx: CanvasRenderingContext2D, x: number, y: number, c: number, t: number) {
  if (!APPLE?.naturalWidth) { cell(ctx, x, y, c, "#F04E38", 0.6); return; }
  const s = c * (0.86 + Math.sin(t * 5) * 0.03);
  ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(APPLE, x + (c - s) / 2, y + (c - s) / 2, s, s); ctx.restore();
}

/**
 * The F mark at a given on-screen height, smooth like the menubar's <img>:
 * canvas drawImage aliases on big downscales, so halve it step by step first
 * (and tint at full resolution when a colour is asked for). Cached per size.
 */
const markCache = new Map<string, HTMLCanvasElement>();
export function markBitmap(hDevice: number, tint?: string): HTMLCanvasElement | null {
  if (!FMARK?.naturalWidth) return null;
  const h = Math.max(4, Math.round(hDevice)), key = `${h}|${tint ?? ""}`;
  const hit = markCache.get(key); if (hit) return hit;
  let src = document.createElement("canvas");
  src.width = FMARK.naturalWidth; src.height = FMARK.naturalHeight;
  let x = src.getContext("2d")!; x.drawImage(FMARK, 0, 0);
  if (tint) { x.globalCompositeOperation = "source-in"; x.fillStyle = tint; x.fillRect(0, 0, src.width, src.height); }
  while (src.height / 2 > h) {
    const n = document.createElement("canvas"); n.width = Math.round(src.width / 2); n.height = Math.round(src.height / 2);
    x = n.getContext("2d")!; x.imageSmoothingQuality = "high"; x.drawImage(src, 0, 0, n.width, n.height); src = n;
  }
  const out = document.createElement("canvas"); out.height = h; out.width = Math.round((h * FMARK.naturalWidth) / FMARK.naturalHeight);
  x = out.getContext("2d")!; x.imageSmoothingQuality = "high"; x.drawImage(src, 0, 0, out.width, out.height);
  markCache.set(key, out); return out;
}
export const MARK_RATIO = 545 / 886;

// ---------- pathfinding ----------
function bfs(cols: number, rows: number, from: P, to: P, blocked: Uint8Array): P | null {
  const prev = new Int32Array(cols * rows).fill(-1), start = from[1] * cols + from[0], goal = to[1] * cols + to[0], q = [start];
  prev[start] = start;
  for (let qi = 0; qi < q.length; qi++) {
    const v = q[qi]; if (v === goal) break;
    const x = v % cols, y = (v / cols) | 0;
    for (const [dx, dy] of DIRS) {
      const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const n = ny * cols + nx; if (prev[n] !== -1 || blocked[n]) continue; prev[n] = v; q.push(n);
    }
  }
  if (prev[goal] === -1) return null;
  let v = goal; while (prev[v] !== start) v = prev[v];
  return [v % cols, (v / cols) | 0];
}
function freeSpace(cols: number, rows: number, from: P, blocked: Uint8Array) {
  const seen = new Uint8Array(cols * rows), q = [from[1] * cols + from[0]]; seen[q[0]] = 1;
  for (let qi = 0; qi < q.length && q.length < 400; qi++) {
    const v = q[qi], x = v % cols, y = (v / cols) | 0;
    for (const [dx, dy] of DIRS) {
      const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const n = ny * cols + nx; if (seen[n] || blocked[n]) continue; seen[n] = 1; q.push(n);
    }
  }
  return q.length;
}
/** Head for the apple; if that path leads into a pocket, take the roomiest safe step instead. */
function autoStep(cols: number, rows: number, body: P[], target: P, blocked: Uint8Array): P | null {
  const h = body[0];
  let next = bfs(cols, rows, h, target, blocked);
  if (next && freeSpace(cols, rows, next, blocked) < body.length) next = null;
  if (!next) {
    let bs = -1;
    for (const [dx, dy] of DIRS) {
      const nx = h[0] + dx, ny = h[1] + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || blocked[ny * cols + nx]) continue;
      const s = freeSpace(cols, rows, [nx, ny], blocked) + Math.random(); if (s > bs) { bs = s; next = [nx, ny]; }
    }
  }
  return next;
}
function placeApple(cols: number, rows: number, blocked: Uint8Array, margin = 2): P {
  for (let k = 0; k < 300; k++) { const x = margin + ri(cols - 2 * margin), y = margin + ri(rows - 2 * margin); if (!blocked[y * cols + x]) return [x, y]; }
  return [margin, margin];
}

// =====================================================================
// Snake duel: two AI snakes race for one apple.
//  · An apple is +1. Running into a wall, yourself or the rival = you burst,
//    the rival gets +3, and you respawn small in your home corner.
//  · They never step next to the rival's head, so they can't meet head-on.
//  · First to 20 wins the round; a banner, then 0–0 and a fresh round.
// =====================================================================
function makeDuel(W: number, H: number): Saver {
  const cols = 36, c = W / cols, rows = Math.floor(H / c), oy = (H - rows * c) / 2, WIN = 20;
  const S = [{ color: GREEN, name: "Green", score: 0, body: [] as P[] }, { color: PINK, name: "Pink", score: 0, body: [] as P[] }];
  let ap: P, acc = 0, booms: { x: number; y: number; life: number; c: string }[] = [], winner = -1, winT = 0;
  const spawn = (i: number) => {
    const y = i ? rows - 4 : 3, x = i ? cols - 4 : 3, dx = i ? 1 : -1;
    S[i].body = [[x, y], [x + dx, y], [x + 2 * dx, y], [x + 3 * dx, y]];
  };
  const mask = () => { const m = new Uint8Array(cols * rows); for (const s of S) for (const [x, y] of s.body) m[y * cols + x] = 1; return m; };
  spawn(0); spawn(1); ap = placeApple(cols, rows, mask());
  return {
    step(dt) {
      booms.forEach((b) => (b.life -= dt)); booms = booms.filter((b) => b.life > 0);
      if (winner >= 0) { winT += dt; if (winT > 3.2) { winner = -1; S.forEach((s, i) => { s.score = 0; spawn(i); }); ap = placeApple(cols, rows, mask()); } return; }
      acc += dt;
      while (acc > 0.11 && winner < 0) {
        acc -= 0.11;
        S.forEach((s, i) => {
          if (winner >= 0) return;
          const m = mask(), tail = s.body[s.body.length - 1]; m[tail[1] * cols + tail[0]] = 0;
          const o = S[1 - i].body[0];
          for (const [dx, dy] of DIRS) { const nx = o[0] + dx, ny = o[1] + dy; if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) m[ny * cols + nx] = 1; }
          const nx = autoStep(cols, rows, s.body, ap, m);
          if (!nx) { booms.push(...s.body.map(([x, y]) => ({ x, y, life: 0.8, c: s.color }))); S[1 - i].score += 3; spawn(i); }
          else {
            s.body.unshift(nx);
            if (nx[0] === ap[0] && nx[1] === ap[1]) { s.score++; ap = placeApple(cols, rows, mask()); if (s.body.length > 22) s.body.length = 12; }
            else s.body.pop();
          }
          const w = S.findIndex((q) => q.score >= WIN); if (w >= 0) { winner = w; winT = 0; }
        });
      }
    },
    draw(ctx, now) {
      bg(ctx, W, H); grid(ctx, W, H, c, oy);
      for (const b of booms) { ctx.globalAlpha = b.life / 0.8; cell(ctx, b.x * c, oy + b.y * c, c, b.c, 0.4 + b.life * 0.6); }
      ctx.globalAlpha = 1;
      if (winner < 0) apple(ctx, ap[0] * c, oy + ap[1] * c, c, now);
      S.forEach((s) => drawSnake(ctx, s.body, c, oy, s.color, winner < 0 ? [ap[0] - s.body[0][0], ap[1] - s.body[0][1]] : undefined));
      ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const y = oy + c * 0.9; ctx.font = `650 ${c * 0.75}px Geist, sans-serif`;
      ctx.fillStyle = GREEN; ctx.fillText(String(S[0].score), W / 2 - c * 1.2, y);
      ctx.fillStyle = MUTED; ctx.fillText("–", W / 2, y);
      ctx.fillStyle = PINK; ctx.fillText(String(S[1].score), W / 2 + c * 1.2, y);
      if (winner >= 0) {
        const a = clamp(winT / 0.3) * (1 - clamp((winT - 2.8) / 0.4));
        ctx.globalAlpha = a; ctx.fillStyle = "rgba(14,15,17,.72)"; ctx.fillRect(0, H / 2 - c * 1.6, W, c * 3.2);
        ctx.font = `700 ${c * 1.3}px Geist, sans-serif`; ctx.fillStyle = S[winner].color; ctx.fillText(`${S[winner].name} wins`, W / 2, H / 2 - c * 0.2);
        ctx.font = `500 ${c * 0.5}px Geist, sans-serif`; ctx.fillStyle = MUTED; ctx.fillText(`${S[winner].score} – ${S[1 - winner].score} · new round coming up`, W / 2, H / 2 + c * 0.85);
      }
      ctx.restore();
    },
  };
}

// =====================================================================
// Corner hit: the F mark and the name bounce like the old DVD logo and change
// colour on every wall. A true corner is rare (as it should be): simulated over
// 20 hours, about one every 2 min on a 1440×900 screen and every 4 min at 1080p.
// =====================================================================
function makeCorner(W: number, H: number): Saver {
  const s = Math.max(18, H * 0.055), dpr = window.devicePixelRatio || 1;
  const mh = s * 1.6, mw = mh * MARK_RATIO, gap = s * 0.5;
  const VY = W * 0.11 * 0.73;
  let tw = s * 5, x = rnd(0, W * 0.5), y = rnd(0, H * 0.5), vx = W * 0.11, vy = VY, ci = 0, corners = 0, since = 0;
  let party: { x: number; y: number; vx: number; vy: number; life: number; c: string }[] = [];
  return {
    step(dt) {
      const w = mw + gap + tw, h = mh;
      x += vx * dt; y += vy * dt; since += dt;
      let hx = false, hy = false;
      if (x < 0) { x = 0; vx = Math.abs(vx); hx = true; } if (x + w > W) { x = W - w; vx = -Math.abs(vx); hx = true; }
      if (y < 0) { y = 0; vy = Math.abs(vy); hy = true; } if (y + h > H) { y = H - h; vy = -Math.abs(vy); hy = true; }
      if (hx || hy) {
        ci = (ci + 1) % GEMS.length;
        // ±4% on every bounce keeps the path from locking into a loop (one that misses every corner forever,
        // or, after a corner, one that hits a corner every 7s). Natural rate: a corner every ~7–11 min.
        vy = Math.sign(vy) * VY * rnd(0.96, 1.04);
        if (since > 180 && Math.random() < 0.1) { // the rare nudge: about one corner every 2–4 min overall
          const tx = (vx > 0 ? W - w - x : x) / Math.abs(vx), need = (vy > 0 ? H - h - y : y) / tx;
          if (need > Math.abs(vy) * 0.75 && need < Math.abs(vy) * 1.3) vy = Math.sign(vy) * need;
        }
      }
      const near = 3;
      if ((hx && hy) || (hx && (y < near || y + h > H - near)) || (hy && (x < near || x + w > W - near))) {
        corners++; since = 0;
        for (let i = 0; i < 70; i++) party.push({ x: x + w / 2, y: y + h / 2, vx: rnd(-1, 1) * W * 0.4, vy: rnd(-1.2, 0.2) * H * 0.6, life: rnd(1, 2), c: GEMS[ri(GEMS.length)] });
      }
      party.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += H * 0.9 * dt; p.life -= dt; });
      party = party.filter((p) => p.life > 0);
    },
    draw(ctx) {
      bg(ctx, W, H);
      const col = GEMS[ci], bmp = markBitmap(mh * dpr, col);
      if (bmp) ctx.drawImage(bmp, x, y, mw, mh);
      ctx.save(); ctx.font = `650 ${s}px Geist, sans-serif`; tw = ctx.measureText("Tianchi OS").width;
      ctx.fillStyle = col; ctx.textBaseline = "middle"; ctx.fillText("Tianchi OS", x + mw + gap, y + mh / 2 + s * 0.04); ctx.restore();
      for (const p of party) { ctx.globalAlpha = clamp(p.life); cell(ctx, p.x, p.y, s * 0.28, p.c); }
      ctx.globalAlpha = 1;
      if (corners) { ctx.save(); ctx.font = `600 ${s * 0.32}px Geist, sans-serif`; ctx.fillStyle = MUTED; ctx.textAlign = "right"; ctx.fillText(`Corner hits: ${corners}`, W - s * 0.5, H - s * 0.5); ctx.restore(); }
    },
  };
}


// =====================================================================
// Here's to the crazy ones: Apple's 1997 Think Different, credited.
// A slow teleprompter: each line types out big in the middle of the screen
// behind a blinking green block, then the whole text drifts up and fades as
// the next one arrives. The second-to-last line comes after a short breath,
// a little brighter, same size. Then the screen clears and the last line (the
// tagline) comes in alone, a little larger. Then the F. CRAZY_ONES is the text.
// =====================================================================
export const CRAZY_ONES = [
  "Here's to the crazy ones.",
  "The misfits.",
  "The rebels.",
  "The troublemakers.",
  "The round pegs in the square holes.",
  "The ones who see things differently.",
  "They’re not fond of rules.",
  "And they have no respect for the status quo.",
  "You can quote them, disagree with them, glorify or vilify them.",
  "About the only thing you can’t do is ignore them.",
  "Because they change things.",
  "They push the human race forward.",
  "And while some may see them as the crazy ones, we see genius.",
  "Because the people who are crazy enough to think they can change the world, are the ones who do.",
  "Think different."
];
const CRAZY_CREDIT = "Apple, Think Different, 1997";
function makeCrazy(W: number, H: number): Saver {
  const m = document.createElement("canvas").getContext("2d")!;
  const wrap = (text: string, font: string, maxW: number) => {
    m.font = font; const out: string[] = []; let line = "";
    for (const w of text.split(" ")) { const t = line ? `${line} ${w}` : w; if (m.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; }
    out.push(line); return out.map((r) => ({ r, w: m.measureText(r).width }));
  };
  const n = CRAZY_ONES.length, body = CRAZY_ONES.slice(0, Math.max(0, n - 1)), tag = CRAZY_ONES[n - 1] ?? "", penI = body.length - 1;
  const fs = Math.min(H * 0.072, W * 0.046), lh = fs * 1.4, F1 = `540 ${fs}px Geist, sans-serif`;
  const fsT = fs * 1.4, FT = `650 ${fsT}px Geist, sans-serif`;
  const CPS = 14, HOLD = 1.7; // characters a second, pause after each line

  // body: every line wrapped to rows; a line's block is laid out from its own top
  const blocks = body.map((text) => ({ text, rows: wrap(text, F1, W * 0.78) }));
  let tops: number[] = [], y = 0, t0 = 1.0; const starts: number[] = [];
  blocks.forEach((b, i) => {
    if (i === penI && i > 0) t0 += 1.6; // a breath before the second-to-last line
    tops.push(y); y += b.rows.length * lh + fs * 0.25; starts.push(t0); t0 += b.text.length / CPS + HOLD + (i === penI ? 1.2 : 0);
  });
  const bodyEnd = t0;
  const penStart = bodyEnd + 1.6;
  const tagStart = penStart + 0.4, tagEnd = tagStart + tag.length / 7 + 3.8, endStart = tagEnd + 1.0, total = endStart + 5.5;
  let t = 0;

  // type `count` characters of a wrapped block; each row centred on its final width
  const typeRows = (ctx: CanvasRenderingContext2D, rows: { r: string; w: number }[], count: number, top: number, rowH: number, font: string) => {
    ctx.font = font; let left = count, caret: [number, number] | null = null;
    rows.forEach((row, i) => {
      if (left <= 0) return;
      const shown = row.r.slice(0, left), x = W / 2 - row.w / 2, yy = top + i * rowH;
      ctx.fillText(shown, x, yy); caret = [x + ctx.measureText(shown).width, yy];
      left -= row.r.length + 1;
    });
    return caret as [number, number] | null;
  };
  const block = (ctx: CanvasRenderingContext2D, at: [number, number] | null, size: number, on: boolean) => {
    if (!at || !on) return;
    const s = size * 0.56; ctx.save(); ctx.fillStyle = GREEN; ctx.beginPath();
    ctx.roundRect(at[0] + size * 0.14, at[1] - size * 0.68, s, s * 1.12, s * 0.12); ctx.fill(); ctx.restore();
  };
  const blink = () => Math.floor(t * 1.8) % 2 === 0;

  return {
    step(dt) { t += dt; if (t > total) t = 0; },
    draw(ctx) {
      bg(ctx, W, H);
      ctx.save(); ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#ececef";
      // ---- body: the current line sits at centre; everything glides up as lines arrive
      if (t < penStart) {
        let cur = 0; for (let i = 0; i < blocks.length; i++) if (t >= starts[i]) cur = i;
        // ease the scroll from the previous line's position to the current one over ~1.1s
        const k = blocks.length ? 1 - Math.pow(1 - clamp((t - starts[cur]) / 1.4), 3) : 1;
        const prevTop = cur ? tops[cur - 1] + (blocks[cur - 1].rows.length * lh) / 2 : 0, curTop = blocks.length ? tops[cur] + (blocks[cur].rows.length * lh) / 2 : 0;
        const scroll = prevTop + (curTop - prevTop) * k, fadeAll = 1 - clamp((t - bodyEnd - 0.2) / 1.2);
        const lift = clamp((t - bodyEnd - 0.2) / 1.4) * H * 0.08;
        let caret: [number, number] | null = null;
        blocks.forEach((b, i) => {
          if (t < starts[i]) return;
          const top = H / 2 - scroll + tops[i] + lh * 0.7 - lift, dist = cur - i;
          const a = i === cur ? 1 : Math.max(0, 0.42 - (dist - 1) * 0.1) * clamp((top - H * 0.08) / (H * 0.2));
          ctx.globalAlpha = a * fadeAll; ctx.fillStyle = i === penI && i === cur ? "#ffffff" : "#e2e2e6"; // the last body line is just brighter
          const c = typeRows(ctx, b.rows, Math.floor((t - starts[i]) * CPS), top, lh, F1);
          if (i === cur) caret = c;
        });
        const typing = blocks.length > 0 && (t - starts[cur]) * CPS < blocks[cur].text.length;
        ctx.globalAlpha = fadeAll; block(ctx, caret, fs, typing || blink());
      }
      // ---- finale 2: the tagline, huge, then the credit
      if (t >= tagStart && t < endStart + 0.8) {
        const a = 1 - clamp((t - tagEnd) / 0.9);
        ctx.globalAlpha = a; ctx.fillStyle = "#ffffff";
        const rows = wrap(tag, FT, W * 0.86), top = H / 2 - (rows.length * fsT * 1.1) / 2 + fsT * 0.72;
        const typed = Math.floor((t - tagStart) * 7);
        const c = typeRows(ctx, rows, typed, top, fsT * 1.1, FT);
        block(ctx, c, fsT, typed < tag.length || blink());
        ctx.globalAlpha = a * clamp((t - tagStart - tag.length / 7 - 0.6) / 0.8);
        ctx.font = `500 ${Math.max(13, fsT * 0.24)}px Geist, sans-serif`; ctx.fillStyle = MUTED; ctx.textAlign = "center";
        ctx.fillText(CRAZY_CREDIT, W / 2, top + (rows.length - 1) * fsT * 1.1 + fsT * 0.9);
        ctx.textAlign = "left";
      }
      ctx.restore();
      // ---- the F
      const end = clamp((t - endStart) / 0.9) * (1 - clamp((t - total + 0.7) / 0.7));
      if (end > 0) {
        const bmp = markBitmap(H * 0.15 * (window.devicePixelRatio || 1)), mh = H * 0.15, mw = mh * MARK_RATIO;
        ctx.save(); ctx.globalAlpha = end;
        if (bmp) ctx.drawImage(bmp, W / 2 - mw / 2, H * 0.42 - mh / 2, mw, mh);
        ctx.font = `650 ${H * 0.04}px Geist, sans-serif`; ctx.textBaseline = "middle";
        const a = "Tianchi", b2 = " OS", wa = ctx.measureText(a).width, wb = ctx.measureText(b2).width;
        ctx.fillStyle = "#ececef"; ctx.fillText(a, W / 2 - (wa + wb) / 2, H * 0.42 + H * 0.12);
        ctx.fillStyle = MUTED; ctx.fillText(b2, W / 2 - (wa + wb) / 2 + wa, H * 0.42 + H * 0.12);
        ctx.restore();
      }
    },
  };
}

// =====================================================================
// Project reel: Apple's Aerial, with Tianchi's work. Slow pans across the
// project covers, the name and one line bottom-left, the lockup bottom-right.
// =====================================================================
const REEL_SRC: [string, string][] = [
  ["refugeeone", heroRefugee], ["lego-world", heroLego], ["neurobot", heroNeurobot], ["homesoffcampus", heroHomes],
  ["huawei", heroHuawei], ["subtension", heroSub], ["connectr", heroConnectr], ["rutabagga", heroRutabagga],
];
let REEL: { img: HTMLImageElement; name: string; sub: string }[] | null = null;
function reel() {
  if (!REEL) REEL = REEL_SRC.map(([slug, src]) => {
    const p = PROJECTS.find((q) => q.slug === slug);
    return { img: load(src), name: p?.name ?? slug, sub: p ? `${p.year} · ${p.desc}` : "" };
  });
  return REEL;
}
function makeReel(W: number, H: number): Saver {
  const R = reel(), SLIDE = 7, FADE = 1.2, dpr = window.devicePixelRatio || 1;
  let t = 0;
  const paint = (ctx: CanvasRenderingContext2D, s: (typeof R)[number], k: number, a: number, dir: number) => {
    if (!s.img.naturalWidth) return;
    const sc = Math.max(W / s.img.naturalWidth, H / s.img.naturalHeight) * (1.06 + 0.1 * k);
    const w = s.img.naturalWidth * sc, h = s.img.naturalHeight * sc, dx = (W - w) / 2 + dir * (k - 0.5) * W * 0.04;
    ctx.save(); ctx.globalAlpha = a; ctx.imageSmoothingQuality = "high"; ctx.drawImage(s.img, dx, (H - h) / 2, w, h); ctx.restore();
  };
  return {
    step(dt) { t += dt; },
    draw(ctx) {
      bg(ctx, W, H);
      const i = Math.floor(t / SLIDE) % R.length, local = t % SLIDE, k = local / SLIDE;
      if (local < FADE && t > SLIDE) paint(ctx, R[(i + R.length - 1) % R.length], 1 + local / SLIDE, 1, (i - 1) % 2 ? 1 : -1);
      paint(ctx, R[i], k, t > SLIDE ? clamp(local / FADE) : 1, i % 2 ? 1 : -1);
      const g = ctx.createLinearGradient(0, H * 0.55, 0, H); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.6)");
      ctx.fillStyle = g; ctx.fillRect(0, H * 0.55, W, H * 0.45);
      const ca = clamp((local - 0.8) / 0.6) * (1 - clamp((local - SLIDE + 0.9) / 0.6)), fs = Math.max(13, H * 0.034);
      ctx.save(); ctx.globalAlpha = ca; ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 12;
      ctx.fillStyle = "#fff"; ctx.font = `650 ${fs}px Geist, sans-serif`; ctx.fillText(R[i].name, W * 0.05, H * 0.9);
      ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.font = `500 ${fs * 0.5}px Geist, sans-serif`; ctx.fillText(R[i].sub, W * 0.05, H * 0.9 + fs * 0.95);
      ctx.restore();
      // lockup, bottom-right
      const ls = fs * 0.5, mh = ls * 1.5, mw = mh * MARK_RATIO, bmp = markBitmap(mh * dpr);
      ctx.save(); ctx.globalAlpha = 0.85; ctx.font = `650 ${ls}px Geist, sans-serif`; ctx.textBaseline = "middle";
      const tw = ctx.measureText("Tianchi OS").width, x = W * 0.95 - tw - mw - ls * 0.5, y = H * 0.9 - fs * 0.3;
      if (bmp) ctx.drawImage(bmp, x, y - mh / 2, mw, mh);
      ctx.fillStyle = "#fff"; ctx.fillText("Tianchi OS", x + mw + ls * 0.5, y);
      ctx.restore();
    },
  };
}

export const SAVERS: Record<SaverId, { label: string; make: (W: number, H: number) => Saver }> = {
  duel: { label: "Snake duel", make: makeDuel },
  corner: { label: "Corner hit", make: makeCorner },
  crazy: { label: "Crazy ones", make: makeCrazy },
  reel: { label: "Project reel", make: makeReel },
};
