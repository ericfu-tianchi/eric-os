import type { Project } from "./projects";
import type { AppKey } from "./apps";
import { metaOf } from "./projects";
import { EXTRA } from "./casesContent";
import { howIAI } from "./cases/howIAI";
import { soulBlade, twistSolver, legoWorld } from "./cases/sideProjects";
import { homesoffcampus } from "./cases/homesoffcampus";
import { neurobot } from "./cases/neurobot";
import { connectr } from "./cases/connectr";
import { subtension } from "./cases/subtension";
import { rutabagga } from "./cases/rutabagga";
import { refugeeone } from "./cases/refugeeone";

/**
 * Full case-study content, migrated verbatim from tianchi-fu.com, built natively
 * so new projects can be authored the same way. A case = ordered sections, each
 * an ordered list of typed blocks (matches the old-site detail design system).
 */
/** Text fields accept inline marks: **bold**, ==highlight== (accent-tinted marker) and [link](https://…).
    Block vocabulary and spacing rules: docs/LAYOUT_GUIDE.md. */
export type CaseBlock =
  | { t: "p"; text: string }
  | { t: "h"; text: string } // label, e.g. "QUICK BACKGROUND"
  | { t: "sub"; text: string } // sub-heading, ink with a pixel-square marker
  | { t: "callout"; label?: string; text: string } // full-width accent band
  | { t: "quote"; text: string } // pull quote: centered, between two short hairlines
  | { t: "list"; items: string[]; plain?: boolean } // bullets; tinted panel unless plain
  | { t: "status"; items: { s: "done" | "partly" | "todo"; text: string }[] } // priority-ordered plan with a status per row + summary bar
  | { t: "stat"; value: string; label: string } // big-number highlight
  | { t: "feature"; src: string; title: string; text: string } // screen + caption, sides alternate
  | { t: "step"; title: string; text: string } // numbered step (01, 02 …) for how-to sequences
  | { t: "link"; text: string; href: string } // accent pill button (external)
  | { t: "embed"; src: string; kind: "youtube" | "figma" | "web"; caption?: string; ratio?: number } // live iframe; ratio = w/h
  | { t: "row"; items: { src: string; w: number }[]; caption?: string } // 2–3 images side by side at their old-site widths
  | { t: "img"; src: string; caption?: string; w?: number } // src = "<slug>/NN.png"; w = display width in px at 1440 (old-site size)
  | { t: "item"; title: string; text: string; src?: string; apps?: AppKey[]; plus?: boolean }; // numbered text + visual row, sides alternate; no src = the apps as big linked icons (plus: joined by "+"), else linked app chips under the text; "\n\n" splits paragraphs
export interface CaseSection { id: string; label: string; blocks: CaseBlock[]; white?: boolean } // white: keep the band white (white-background slides)
export interface CaseStudy {
  accent: string;
  sub?: string;
  role?: string;
  timeline?: string;
  tools?: string;
  sections: CaseSection[];
}

/** Populated from the old-site extraction (verbatim). Missing entries fall back below. */
export const CASES: Record<string, CaseStudy> = {
  ...EXTRA,
  "how-i-ai": howIAI,
  "soul-blade": soulBlade,
  "twist-solver": twistSolver,
  homesoffcampus, neurobot, connectr, subtension, rutabagga,
  ...(refugeeone.sections.length ? { refugeeone } : {}),
  "lego-world": legoWorld,
  huawei: {
    accent: "#e71b23",
    sub: "Designing a window-management mechanism for foldable PCs.",
    role: "UX Designer",
    timeline: "May 2022 – Sep 2022",
    tools: "Figma",
    sections: [
      { id: "overview", label: "Overview", blocks: [
        { t: "h", text: "Quick Background" },
        { t: "p", text: "In summer 2022, I interned at Huawei in Shenzhen, China." },
        { t: "p", text: "During the internship, I conducted paper and patent research on window management mechanisms for traditional PCs, duo screen PCs, foldable devices, and other multi-screen scenarios, and also conducted competitive analysis for existing window management solutions including Windows, MacOS, and productivity tools like Groupy." },
        { t: "p", text: "For the final deliverable, I designed a window management mechanism for foldable PCs that helps users better focus on tasks that involve multiple windows and apps." },
        { t: "callout", label: "NDA", text: "More details to come — this project is under NDA while the patent is in application." },
      ] },
    ],
  },
  ece: {
    accent: "#0c2649",
    sub: "Optimizing the SUGS application process for U-M's ECE department.",
    role: "UX Consultant",
    timeline: "Sep 2021 – Dec 2021",
    tools: "Miro",
    sections: [
      { id: "overview", label: "Overview", blocks: [
        { t: "h", text: "Quick Background" },
        { t: "p", text: "I worked in a team of five to optimize the application process for the SUGS program for the ECE department at U-M." },
        { t: "p", text: "We researched Master's program application processes to study stakeholders and industry trends, conducted 6 one-on-one interviews with SUGS advisors and students to identify problems, and finally wrote an 18-page report with 6 recommended strategies for the client." },
      ] },
    ],
  },
  handcoded: {
    accent: "#494949",
    sub: "My first personal site — hand-coded before I moved to Wix.",
    role: "Frontend Developer",
    timeline: "Nov 2021 – Aug 2022",
    tools: "HTML · CSS · JavaScript",
    sections: [
      { id: "overview", label: "Overview", blocks: [
        { t: "h", text: "Background" },
        { t: "p", text: "Before I built the Wix version of my personal website, I hand-coded my first personal website using HTML/CSS + JavaScript." },
        { t: "p", text: "Building a website by myself was fun but also quite time-consuming — I spent 50% of the time coding and the other 50% thinking about how to design it (which is also why I later switched to Wix, so I could focus more on the design)." },
        { t: "p", text: "Nevertheless, looking at this old iteration of my personal website still gives me a sense of fulfillment." },
        { t: "h", text: "A Few Fun Details" },
        { t: "p", text: "Hover the intro text on the About page for color-changing effects; in Interest, the Kobe portrait shakes on hover; a bouncing ball, swaying guitar notes, a floating island; and try clicking the yellow Question Mark in the Mario section." },
      ] },
    ],
  },
};

/** A case for any project: the real migrated one if present, else built from its fields. */
export function caseOf(p: Project): CaseStudy {
  const c = CASES[p.slug];
  if (c) return c;
  const m = metaOf(p.slug);
  const sections: CaseSection[] = [];
  if (p.overview) sections.push({ id: "overview", label: "Overview", blocks: [{ t: "p", text: p.overview }] });
  if (p.process) sections.push({ id: "process", label: "Process", blocks: [{ t: "p", text: p.process }] });
  if (p.outcome) sections.push({ id: "outcome", label: "Outcome", blocks: [{ t: "p", text: p.outcome }] });
  return { accent: m.accent, sub: m.sub, role: m.role, timeline: m.timeline, tools: m.tools, sections };
}
