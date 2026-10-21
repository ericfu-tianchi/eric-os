export type Category = "AI" | "DESIGN" | "PLAY" | "LIFE";
export type Status = "live" | "beta" | "award";
export type Group = "selected" | "tech" | "school";

export interface Project {
  slug: string;
  name: string;
  desc: string;
  year: string;
  cat: Category;
  group: Group;
  status?: Status;
  statusLabel?: string;
  overview?: string;
  process?: string;
  outcome?: string;
  link?: string;
}

export const GROUPS: { id: Group; label: string; blurb: string }[] = [
  { id: "selected", label: "SELECTED WORK", blurb: "Flagship work: AI products and design" },
  { id: "tech", label: "TECH STUFF", blurb: "Things I built and coded myself" },
  { id: "school", label: "SCHOOL PROJECTS", blurb: "Work from my UMich HCI years" },
];

/**
 * Real projects, grouped like the old tianchi-fu.com tabs.
 * Add a project = add an object. Detail window renders
 * overview/process/outcome as old-site style case sections.
 */
export const PROJECTS: Project[] = [
  // ---------- SELECTED WORK ----------
  {
    slug: "model-eval",
    name: "Opus Model-Eval",
    desc: "An AI video model eval system: rubrics · taxonomy · WLT/Elo reporting",
    year: "2026",
    cat: "AI",
    group: "selected",
    status: "live",
    statusLabel: "SHIPPED",
    overview:
      "A model-evaluation plugin I led during my internship at Opus. AI video models ship fast, and the team needed reusable eval infrastructure to answer one question: is the new model worth switching to?",
    process:
      "Built the whole pipeline, from eval dimensions and labeling guidelines to automated win/loss/tie and Elo reports, and ran head-to-head evals of Gemini, Seedance, Vidu and more.",
    outcome: "It became the team's default tool for model decisions, and the work that best shows what I do as an AI PM.",
  },
  {
    slug: "jyi",
    name: "JYI · AI Interview SaaS",
    desc: "An ATS + AI interview product, where my AI PM story began",
    year: "2021",
    cat: "AI",
    group: "selected",
    statusLabel: "ORIGIN",
    overview: "A product intern at an AI interview SaaS in 2021, before AI was fashionable.",
    process: "Redesigned the AI interview guidance flow and used SQL user profiling to drive iterations.",
    outcome: "Student satisfaction +20%; the product signed 30+ paying companies within two months.",
  },
  {
    slug: "huawei",
    name: "Huawei Foldable Window Management",
    desc: "Window management for foldable PCs, patent pending",
    year: "2022",
    cat: "DESIGN",
    group: "selected",
    statusLabel: "PATENT",
    overview: "A UX design internship at Huawei (Shenzhen): designing window management for foldable devices.",
    process: "Studied the window paradigms of Windows, macOS and Groupy, then derived split-screen and drag interactions for foldable postures.",
    outcome: "The design went into the patent process. (Under NDA, so details are omitted.)",
  },
  {
    slug: "neurobot",
    name: "Neurobot",
    desc: "A neuroscience education robot app redesign, HCI Expo first prize",
    year: "2022",
    cat: "DESIGN",
    group: "selected",
    status: "award",
    statusLabel: "AWARD",
    overview: "A client project for Backyard Brains: redesigning a neuroscience education robot app for high-school students.",
    process: "A five-person team running full usability-testing cycles: high-severity issues went from 13 to 1, SEQ from 5.6 to 6.4.",
    outcome: "The design went into development and won Best Project (first prize) at the 2022 U-M HCI Design Expo.",
  },
  {
    slug: "refugeeone",
    name: "RefugeeOne Job Finding App",
    desc: "A job-finding app designed and built for a refugee resettlement agency",
    year: "2023",
    cat: "DESIGN",
    group: "selected",
    statusLabel: "CLIENT",
  },
  // ---------- TECH STUFF ----------
  {
    slug: "twist-solver",
    name: "Twist Solver",
    desc: "A follow-along Rubik's cube solver web app with step-by-step 3D playback",
    year: "2026",
    cat: "PLAY",
    group: "tech",
    status: "live",
    statusLabel: "LIVE",
    link: "https://twist-solver.pages.dev/",
    overview: "A cube solver vibe-coded from scratch: enter a scramble and get both the shortest and a beginner-friendly solution.",
    process: "A 3D follow-along animation walks through each move; Tianchi OS's modern-first look started here.",
    outcome: "Live on Cloudflare Pages.",
  },
  {
    slug: "lego-world",
    name: "My Lego World",
    desc: "Every country I've been to, rebuilt in real LEGO bricks on a 3D globe",
    year: "2026",
    cat: "PLAY",
    group: "tech",
    status: "live",
    statusLabel: "LIVE",
    link: "https://ericfu-lego-world.pages.dev/",
  },
  {
    slug: "soul-blade",
    name: "Soul Blade",
    desc: "A KOF-style pixel fighting game on a hand-written Canvas engine",
    year: "2026",
    cat: "PLAY",
    group: "tech",
    status: "live",
    statusLabel: "LIVE",
    link: "https://soul-blade.pages.dev",
    overview: "A pixel fighting game with a hand-written game loop, collision detection and combo system.",
    process: "No engine, just Canvas: a character state machine and frame data tuned for impact.",
    outcome: "A playable beta; part of Tianchi OS's pixel taste was trained here.",
  },
  {
    slug: "how-i-ai",
    name: "How I AI",
    desc: "My setup, and three things I believe about building with AI",
    year: "2026",
    cat: "AI",
    group: "tech",
  },
  {
    slug: "homesoffcampus",
    name: "HomesOffCampus",
    desc: "A housing platform for international students: research, design and React Native development, solo",
    year: "2021",
    cat: "DESIGN",
    group: "tech",
    statusLabel: "SOLO",
    overview: "Built after getting burned by a rental scam: research, design and development, all by myself.",
    process: "React Native + Firebase, with three parts: listing search, a forum and a Buddy Program.",
    outcome: "My first complete proof of being a designer who codes.",
  },
  {
    slug: "handcoded",
    name: "Handcoded Website",
    desc: "My hand-coded portfolio from before Wix (HTML/CSS/JS)",
    year: "2021",
    cat: "PLAY",
    group: "tech",
    statusLabel: "ARCHIVE",
    link: "https://ericfu666.github.io/portfolio/index.html",
    overview: "The first version of my personal site, hand-coded in 2021–2022.",
    process: "Plain HTML, CSS and JS, AOS scroll animations and a home-made easter egg (click the Mario brick for stars).",
    outcome: "The prehistory of Tianchi OS; the source is archived on GitHub.",
  },
  // ---------- SCHOOL PROJECTS ----------
  {
    slug: "subtension",
    name: "SubTension",
    desc: "UX for a 2D submarine RTS (40-person WolverineSoft team)",
    year: "2022",
    cat: "PLAY",
    group: "school",
    statusLabel: "SHIPPED",
    overview: "An FTL-inspired 2D submarine RTS; I did the game UX in the 40-person WolverineSoft Studio.",
    process: "Narrative, scene flow, the tutorial and the shop and inventory UI, across two full semesters of development.",
    outcome: "Released and playable on itch.io.",
  },
  {
    slug: "connectr",
    name: "Connectr",
    desc: "An MBTI-driven group friend-making app (3-week Tech & Business Jam)",
    year: "2021",
    cat: "DESIGN",
    group: "school",
    statusLabel: "CONCEPT",
    overview: "A three-week sprint: a friend-making product concept, leading UX and writing the business plan together.",
    process: "Personas, wireframes and hi-fi screens, plus market, competitor and revenue-model analysis.",
    outcome: "A complete design-meets-business case.",
  },
  {
    slug: "rutabagga",
    name: "Rutabagga",
    desc: "Brand and logo design for a seasonal vegetarian food app",
    year: "2022",
    cat: "DESIGN",
    group: "school",
    statusLabel: "BRAND",
    overview: "A complete brand for a fictional vegetarian app (Illustrator).",
    process: "Type, scalability, variants and clear-space rules: a full brand sheet.",
    outcome: "Pure visual craft.",
  },
  {
    slug: "ece",
    name: "ECE/SUGS Consulting",
    desc: "UX consulting on UMich's master's application process",
    year: "2021",
    cat: "DESIGN",
    group: "school",
    statusLabel: "REPORT",
    overview: "Consulting to improve the application process for UMich's ECE master's program.",
    process: "6 interviews, an 18-page report and 6 actionable recommendations.",
    outcome: "A by-the-book exercise in research methods.",
  },
];

export const byGroup = (g: Group) => PROJECTS.filter((p) => p.group === g);

/**
 * Case-study metadata — mirrors the old tianchi-fu.com detail-page spec:
 * per-project accent, a hero subtitle, and the Role / Timeline / Tools sidebar.
 * (Roles/timelines/tools carried over verbatim from the old site where they existed.)
 */
export interface ProjectMeta {
  accent: string;
  sub?: string;
  role?: string;
  timeline?: string;
  tools?: string;
}
export const META: Record<string, ProjectMeta> = {
  "model-eval": { accent: "#2f9e57", sub: "Reusable infrastructure for evaluating AI video models", role: "AI PM", timeline: "2026 · Opus", tools: "Rubrics · Elo/WLT · Python" },
  jyi: { accent: "#17a89e", sub: "The origin story of an AI interview SaaS", role: "Product Manager & UX Designer", timeline: "Jan–Apr 2021", tools: "Figma · SQL" },
  huawei: { accent: "#e71b23", sub: "Window management for foldable PCs", role: "UX Designer", timeline: "May–Sep 2022", tools: "Figma" },
  neurobot: { accent: "#ff9d1f", sub: "A robot app that gets high-schoolers into neuroscience", role: "UX Designer", timeline: "Jan–Apr 2022", tools: "Figma · Miro · Matlab" },
  refugeeone: { accent: "#f36c12", sub: "A three-sided hiring platform for a Chicago refugee resettlement non-profit", role: "Product Owner & Frontend Developer", timeline: "Jan – May 2023", tools: "Figma · Jira · React · Firebase" },
  "twist-solver": { accent: "#2f8f4e" },
  "lego-world": { accent: "#c91a09" },
  "how-i-ai": { accent: "#079a55", sub: "My setup, and three things I believe about building with AI", role: "Daily practice", timeline: "2026", tools: "Claude Code · cmux · Typeless · Obsidian" },
  "soul-blade": { accent: "#c8324a" },
  homesoffcampus: { accent: "#4f7cac", sub: "A housing website catered to and trusted by students", role: "UX Designer & Researcher, Developer", timeline: "Sep–Dec 2021", tools: "Figma · Miro · React Native + Firebase" },
  handcoded: { accent: "#494949", sub: "My hand-coded portfolio from before Wix", role: "Frontend Developer", timeline: "Nov 2021–Aug 2022", tools: "HTML · CSS · JS" },
  subtension: { accent: "#0fa83f", sub: "An FTL-inspired 2D submarine RTS", role: "UX Designer", timeline: "Sep–Dec 2022", tools: "Figma" },
  connectr: { accent: "#04dac6", sub: "An MBTI-driven group friend-making app", role: "UX Design Lead + Business", timeline: "3-week jam", tools: "Figma" },
  rutabagga: { accent: "#764c99", sub: "Brand design for a seasonal vegetarian food app", role: "UI Designer", timeline: "Mar–Apr 2022", tools: "Illustrator" },
  ece: { accent: "#0c2649", sub: "UX consulting on UMich's master's applications", role: "UX Consultant", timeline: "Sep–Dec 2021", tools: "Miro" },
};
export const metaOf = (slug: string): ProjectMeta => META[slug] ?? { accent: "#4a74d6" };
