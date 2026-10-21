import portrait from "../assets/about/portrait.webp";
import pdfIcon from "../assets/icons/b/pdf.png";
import snakeIcon from "../assets/icons/b/snake.png";
import gearIcon from "../assets/icons/b/gear.png";
import computerIcon from "../assets/icons/b/computer.png";
import chatIcon from "../assets/icons/b/chat.png";
import soulBladeIcon from "../assets/icons/b/soul-blade.png";
import twistIcon from "../assets/icons/b/twist-solver.png";
import legoIcon from "../assets/icons/b/lego-world.svg";
import folderIcon from "../assets/icons/b/folder.png";
import photosIcon from "../assets/icons/m/photos.png";
import videosIcon from "../assets/icons/m/videos.png";
import robotIcon from "../assets/icons/m/robot.png";
import { coverOf } from "../data/projectAssets";
import type { HomeItem } from "./model";

/**
 * Home Screen icons: one squircle tile per app, the site's own pixel art on a tuned gradient.
 * Case pages without art use their cover; folders show up to nine of their apps, like iOS.
 */
type Tile = { img?: string; bg: string; fit?: "glyph" | "cover" | "pixel"; scale?: number; pos?: string };

const TILES: Record<string, Tile> = {
  about: { img: portrait, bg: "#101113", fit: "cover", pos: "32% 12%" },
  "case:how-i-ai": { img: robotIcon, bg: "linear-gradient(160deg,#16301f,#0b1a11)", scale: 0.74 },
  resume: { img: pdfIcon, bg: "linear-gradient(180deg,#ffffff,#e9ebef)", scale: 0.66 },
  snake: { img: snakeIcon, bg: "linear-gradient(180deg,#2a2c31,#141518)", scale: 0.78 },
  "game:soul-blade": { img: soulBladeIcon, bg: "linear-gradient(160deg,#6b1626,#24060c)", fit: "pixel", scale: 0.8 },
  "game:lego-world": { img: legoIcon, bg: "linear-gradient(180deg,#ffd84a,#f3ae00)", scale: 0.7 },
  "game:twist-solver": { img: twistIcon, bg: "linear-gradient(160deg,#20335a,#0f1a33)", scale: 0.72 },
  videos: { img: videosIcon, bg: "linear-gradient(180deg,#3a3d45,#16171a)", scale: 0.72 },
  photos: { img: photosIcon, bg: "linear-gradient(180deg,#ffffff,#eef0f3)", scale: 0.7 },
  files: { img: computerIcon, bg: "linear-gradient(180deg,#e8f1ff,#bcd3fb)", scale: 0.7 },
  messages: { img: chatIcon, bg: "linear-gradient(180deg,#5ef08a,#0bbf5b)", scale: 0.72 },
  settings: { img: gearIcon, bg: "linear-gradient(180deg,#c9ccd3,#8d929b)", scale: 0.74 },
  folder: { img: folderIcon, bg: "linear-gradient(180deg,#e8f1ff,#bcd3fb)", scale: 0.7 },
};

export function tileFor(id: string): Tile {
  if (TILES[id]) return TILES[id];
  if (id.startsWith("case:")) {
    const cover = coverOf(id.slice(5));
    if (cover) return { img: cover, bg: "#fff", fit: "cover", pos: "50% 0%" };
  }
  if (id.startsWith("files:")) return TILES.folder;
  return { bg: "linear-gradient(180deg,#3a3d45,#16171a)" };
}

export function AppTile({ id, size }: { id: string; size?: number }) {
  const t = tileFor(id);
  return (
    <span className={`ios-ic ${t.fit ?? "glyph"}`} style={{ background: t.bg, width: size, height: size, "--s": t.scale ?? 0.72, "--pos": t.pos } as React.CSSProperties}>
      {t.img && <img src={t.img} alt="" draggable={false} />}
    </span>
  );
}

export function FolderTile({ item, size }: { item: Extract<HomeItem, { kind: "folder" }>; size?: number }) {
  return (
    <span className="ios-ic folder" style={{ width: size, height: size }}>
      {item.items.slice(0, 9).map((x) => <AppTile key={x.id} id={x.id} />)}
    </span>
  );
}

export function ItemTile({ item, size }: { item: HomeItem; size?: number }) {
  return item.kind === "folder" ? <FolderTile item={item} size={size} /> : <AppTile id={item.id} size={size} />;
}
