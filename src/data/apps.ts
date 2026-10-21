// The tools named on How I AI: app icon + official site, for linked icons on reading pages.
const icons = import.meta.glob("../assets/apps/*.webp", { eager: true, import: "default" }) as Record<string, string>;

export const APPS = {
  typeless: { name: "Typeless", href: "https://www.typeless.com" },
  cmux: { name: "cmux", href: "https://cmux.com" },
  claudecode: { name: "Claude Code", href: "https://claude.com/product/claude-code" },
  codex: { name: "Codex", href: "https://openai.com/codex" },
  gemini: { name: "Gemini", href: "https://gemini.google.com" },
  vibe: { name: "Vibe Island", href: "https://vibeisland.app" },
  obsidian: { name: "Obsidian", href: "https://obsidian.md" },
  claude: { name: "Claude", href: "https://claude.ai" },
  github: { name: "GitHub", href: "https://github.com" },
} as const;

export type AppKey = keyof typeof APPS;
export const appIcon = (k: AppKey): string | undefined => icons[`../assets/apps/${k}.webp`];
