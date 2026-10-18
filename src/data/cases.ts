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
  | { t: "step"; title: string; text: string } // numbered step (01, 02 …) for how-to sequences
  | { t: "link"; text: string; href: string } // accent pill button (external)
  | { t: "img"; src: string; caption?: string; w?: number }; // src = "<slug>/NN.png"; w = display width in px at 1440 (old-site size)
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
  "lego-world": {
    accent: "#c91a09",
    sub: "Every country I've been to, rebuilt in real LEGO bricks.",
    role: "Solo builder, directing Claude agents",
    timeline: "Sep 2026 – Present",
    tools: "TypeScript · three.js · LDraw · Rapier · Cloudflare Pages",
    sections: [
      { id: "overview", label: "Overview", blocks: [
        { t: "h", text: "The Idea" },
        { t: "p", text: "Each country I've been to becomes a floating LEGO island of ==3,000–11,000 real parts==, pinned on a brick-built desk globe. Spin the globe, pick a red pin, and watch the city build itself." },
        { t: "p", text: "This page covers the two halves: how a set gets built, and how the app presents it." },
        { t: "stat", value: "20", label: "countries visited, each one a pin on the globe" },
        { t: "stat", value: "9", label: "already built in LEGO, with more on the way" },
        { t: "link", text: "Explore the globe", href: "https://ericfu-lego-world.pages.dev/" },
      ] },
      { id: "sets", label: "The Sets", blocks: [
        { t: "feature", src: "lego-world/01.webp", title: "Singapore · Marina Bay", text: "Marina Bay Sands, the Supertrees, the Merlion and a row of shophouses. 3,418 bricks in 29 colors." },
        { t: "feature", src: "lego-world/02.webp", title: "France · Paris", text: "The Eiffel Tower, Notre-Dame, the quays and a Haussmann corner. 6,309 bricks in 23 colors." },
        { t: "feature", src: "lego-world/03.webp", title: "Japan · Kyoto", text: "Tea by the water, a five-storey pagoda and a cherry blossom lane. 2,645 bricks in 19 colors." },
        { t: "feature", src: "lego-world/04.webp", title: "Czechia · Prague", text: "Charles Bridge, Týn Church, the Astronomical Clock and Old Town Square. 5,386 bricks in 25 colors." },
      ] },
      { id: "building", label: "Building a Set", blocks: [
        { t: "p", text: "Every country follows the same playbook. Three rules hold throughout:" },
        { t: "list", items: [
          "**Every part is real.** Each brick maps to an actual LEGO part number and official color, with geometry imported from the LDraw library. No invented shapes.",
          "**Everything is buildable.** Every piece clicks onto a real stud, clip, hinge or pin, and nothing passes through anything else. A validator enforces this as a build gate.",
          "**Prints are code.** Signs, faces and graffiti are flat vector drawings on real parts, at most 12 designs per set. No generated images in the product.",
        ] },
        { t: "step", title: "Research the real place", text: "Pick four or five places everyone knows the city by, each paired with a minifigure doing something. Palette from photos of the real place, an island outline from its real geography, a height table for the whole set. One page, signed off before any brick." },
        { t: "step", title: "Study how others built it", text: "For every landmark, collect five or more existing LEGO versions (official sets, LEGOLAND Miniland, Rebrickable MOCs, LEGO Masters), note what each does for the signature detail, and identify the exact parts. If two attempts of our own fail, copy the best proven build." },
        { t: "step", title: "Blockout and scheme", text: "Plain boxes at each element's footprint and height, rendered from the hero camera and compared with a composition reference, so layering and scale are right before any detail. Then a level-by-level build scheme per landmark, signed off." },
        { t: "step", title: "Build elements in parallel", text: "Each landmark is built alone in its own test scene and git worktree, by its own agent. Angled and studs-out sub-builds are written as LDraw models, then exploded back into individual bricks so every piece stays a piece." },
        { t: "step", title: "Check, render, compare", text: "The gate runs a typecheck, a stud-map check against each mould, an assembly connection check and the validator. Close-ups from two angles catch what geometry checks cannot: a hand passing through a prop, a crooked roof." },
        { t: "step", title: "Assemble the island", text: "Two bricks of earth, a stone plinth, water two plates below the land, the elements placed with enforced spacing. Target 8,000 parts, hard cap 10,000." },
        { t: "step", title: "Judge, then the owner", text: "A judge agent scores the render pack against reference sets (Los Angeles = 9, Prague = 8), up to three rounds of fixes. The owner's own review outranks the score." },
      ] },
      { id: "app", label: "The App", blocks: [
        { t: "p", text: "A single-page TypeScript app on three.js, bundled with Vite and hosted on Cloudflare Pages." },
        { t: "sub", text: "Parts pipeline" },
        { t: "p", text: "A bake step loads each LDraw part, keeps its smooth normals, fixes the winding of mirrored parts, quantises the mesh and writes it as a compact module. The geometry ships in a few chunks so every file stays under the host's size limit." },
        { t: "sub", text: "Scenes and validator" },
        { t: "p", text: "A set is a TypeScript file that places parts on an integer grid of studs and plates. The validator rebuilds stud connectivity from the moulds and checks collisions with each part's real baked bounds." },
        { t: "sub", text: "Rendering 11,000 bricks" },
        { t: "p", text: "One instanced mesh per part type, color and print, so a whole island draws in a few hundred calls. When the camera moves but the set does not, the shadow map is drawn once and reused, which keeps phones smooth." },
        { t: "sub", text: "The globe" },
        { t: "p", text: "A desk globe after LEGO Ideas 21332: sea tiles laid on latitude rings, coasts in round tiles, land a plate higher and mountains higher again, on a 23.4° axis in a grey meridian and a stepped stand. Dragging turns the ball, not the camera." },
        { t: "sub", text: "Entering a set" },
        { t: "p", text: "Tapping a pin turns and zooms the globe and sinks it until a sliver shows under the set. The bricks then rain in from above the screen, lowest first, each on its own eased path, on a clock that starts slow and speeds up as the zoom lands." },
        { t: "sub", text: "Take it apart" },
        { t: "p", text: "A zero-gravity burst. Under linear and angular damping each brick's flight has a closed form, x(t) = x₀ + v·(1 − e⁻ᵗ), so the burst is computed by formula instead of a physics step: smooth even at 11,000 bricks. After two seconds it hands over to a slow, endless drift. Rebuild plays the gathering in reverse." },
        { t: "p", text: "Designed, built and directed with Claude. LEGO® is a trademark of the LEGO Group, which does not sponsor or endorse this project. Part geometry: LDraw.org, CC BY 2.0." },
      ] },
    ],
  },
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
