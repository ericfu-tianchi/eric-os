// Project cover thumbnails + case-study hero images, pulled from the old site.
// Vite eager-globs them so a missing slug simply returns undefined → UI falls back.
const covers = import.meta.glob("../assets/old-site/covers/*.png", { eager: true, import: "default" }) as Record<string, string>;
const heroes = import.meta.glob("../assets/old-site/heroes/*.{png,webp}", { eager: true, import: "default" }) as Record<string, string>;

export const coverOf = (slug: string): string | undefined => covers[`../assets/old-site/covers/${slug}.png`];
export const heroOf = (slug: string): string | undefined =>
  heroes[`../assets/old-site/heroes/${slug}.png`] ?? heroes[`../assets/old-site/heroes/${slug}.webp`];

// Page thumbnails: each reading page's real first screen in the S4 file frame
// (fine hairline, stepped corners, small dog-ear). Keyed by project slug, plus "about".
const fileIcons = import.meta.glob("../assets/file-icons/*.webp", { eager: true, import: "default" }) as Record<string, string>;
export const fileIconOf = (key: string): string | undefined => fileIcons[`../assets/file-icons/${key}.webp`];

// inline case-study section images, referenced as "<slug>/NN.png"
// (re-exported originals are .webp; content keeps referencing "<slug>/NN.png")
const detail = import.meta.glob("../assets/old-site/detail/**/*.{png,webp}", { eager: true, import: "default" }) as Record<string, string>;
export const detailImg = (src: string): string | undefined =>
  detail[`../assets/old-site/detail/${src.replace(/\.png$/, ".webp")}`] ?? detail[`../assets/old-site/detail/${src}`];
