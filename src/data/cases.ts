import type { Project } from "./projects";
import { metaOf } from "./projects";
import { EXTRA } from "./casesContent";

/**
 * Full case-study content, migrated verbatim from tianchi-fu.com, built natively
 * so new projects can be authored the same way. A case = ordered sections, each
 * an ordered list of typed blocks (matches the old-site detail design system).
 */
/** Text fields accept two inline marks: **bold** and ==highlight== (accent-tinted marker).
    Block vocabulary and spacing rules: docs/LAYOUT_GUIDE.md. */
export type CaseBlock =
  | { t: "p"; text: string }
  | { t: "h"; text: string } // label, e.g. "QUICK BACKGROUND"
  | { t: "sub"; text: string } // sub-heading, rendered ">> Problem"
  | { t: "callout"; label?: string; text: string } // full-width accent band
  | { t: "quote"; text: string } // key statement between corner brackets
  | { t: "list"; items: string[] } // findings in a tinted panel
  | { t: "stat"; value: string; label: string } // big-number highlight
  | { t: "feature"; src: string; title: string; text: string } // screen + caption, sides alternate
  | { t: "link"; text: string; href: string } // accent pill button (external)
  | { t: "img"; src: string; caption?: string; size?: "small" | "medium" | "wide" }; // src = "<slug>/NN.png"
export interface CaseSection { id: string; label: string; blocks: CaseBlock[] }
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
  rutabagga: {
    accent: "#764c99",
    sub: "Local. Natural. Sustainable.",
    role: "UI Designer",
    timeline: "Mar 2022 – Apr 2022",
    tools: "Adobe Illustrator",
    sections: [
      { id: "overview", label: "Overview", blocks: [
        { t: "h", text: "Background" },
        { t: "p", text: "This is a logo design I did for a fictional client called Rutabagga that aims to promote vegan food and products." },
        { t: "h", text: "Client Brief" },
        { t: "callout", text: "Rutabagga app aims to help those trying to reduce their environmental footprint by consuming more vegetarian and vegan products." },
        { t: "p", text: "Better heart health, weight loss, and “good karma” are among the numerous benefits of vegan and vegetarian diets." },
        { t: "callout", text: "Our tagline reads: “Local. Natural. Sustainable.”" },
        { t: "p", text: "We promote seasonal eating — eating sustainably. We teach our users only to eat fruits and vegetables in season for their geographic area: apples in the fall, rutabaga in the winter, radishes in the spring, and peaches in the summer." },
        { t: "h", text: "Logomark" },
        { t: "img", src: "rutabagga/02.png", caption: "Design preview — logomark, logotype, and color palette" },
        { t: "p", text: "I combined the shape of a rutabaga with the shape of a plate to highlight the theme of the food industry and the name of the company. To make the plate unambiguous, I used the figure/ground gestalt principle to put a fork on the plate. The logomark color is inspired by the color of rutabaga, with a gradient for the body." },
        { t: "h", text: "Logotype" },
        { t: "p", text: "I used Gravesend Sans for the logotype, decorating the letter U to look like a root vegetable — a gradient stroke and a small tip at the bottom." },
        { t: "stat", value: "#764C99", label: "Primary · purple" },
        { t: "stat", value: "#E24C95", label: "Primary · pink" },
        { t: "stat", value: "#53B57F", label: "Primary · green" },
      ] },
      { id: "design", label: "Design", blocks: [
        { t: "h", text: "Typography" },
        { t: "img", src: "rutabagga/03.png", caption: "Gravesend Sans (logotype) & Adobe Garamond Pro (body)" },
        { t: "h", text: "Scalability" },
        { t: "img", src: "rutabagga/04.png", caption: "Logo at 3in / 1in / 0.5in" },
        { t: "h", text: "Logo Variation" },
        { t: "img", src: "rutabagga/05.png", caption: "Stacked / extended, with & without tagline, and mark alone" },
        { t: "h", text: "Color Variation" },
        { t: "img", src: "rutabagga/06.png", caption: "Color / black / stroke on white and black grounds" },
        { t: "h", text: "Clear Space" },
        { t: "img", src: "rutabagga/07.png", caption: "Clear-space guidelines" },
        { t: "h", text: "App Screens" },
        { t: "img", src: "rutabagga/09.png", caption: "App screen design" },
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
