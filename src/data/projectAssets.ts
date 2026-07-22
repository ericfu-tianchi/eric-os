// Project cover thumbnails + case-study hero images, pulled from the old site.
// Vite eager-globs them so a missing slug simply returns undefined → UI falls back.
const covers = import.meta.glob("../assets/old-site/covers/*.png", { eager: true, import: "default" }) as Record<string, string>;
const heroes = import.meta.glob("../assets/old-site/heroes/*.png", { eager: true, import: "default" }) as Record<string, string>;

export const coverOf = (slug: string): string | undefined => covers[`../assets/old-site/covers/${slug}.png`];
export const heroOf = (slug: string): string | undefined => heroes[`../assets/old-site/heroes/${slug}.png`];

// inline case-study section images, referenced as "<slug>/NN.png"
const detail = import.meta.glob("../assets/old-site/detail/**/*.png", { eager: true, import: "default" }) as Record<string, string>;
export const detailImg = (src: string): string | undefined => detail[`../assets/old-site/detail/${src}`];
