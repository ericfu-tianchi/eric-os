import type { CaseStudy } from "../cases";

/* The three AI side projects. Each one started as a test of what a model could do. Short on purpose. */

export const soulBlade: CaseStudy = {
  accent: "#c8324a",
  sub: "A KOF-style pixel fighter that began as a one-line wish to a new model.",
  role: "Solo builder, directing AI",
  timeline: "Jul 2026 · 10 days",
  tools: "Fable 5 · Claude Code · Gemini · Lyria · Canvas",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "How It Started" },
      { t: "p", text: "Fable 5 had just come out, and I wanted to see what it could do. So I made a wish: ==a King of Fighters–style game, one shot, every mechanic included.==" },
      { t: "p", text: "The first version was already playable. That was the hook. Ten days and 26 commits later it was a real game: two fighters, three AI levels, a training mode and its own soundtrack." },
      { t: "img", src: "soul-blade/08.png", caption: "The move guide runs the real engine", w: 820 },
      { t: "link", text: "Play Soul Blade", href: "https://soul-blade.pages.dev" },
    ] },
    { id: "tools", label: "The Tools", blocks: [
      { t: "h", text: "Tools to Build With AI" },
      { t: "p", text: "The turning point came on day two. Checking one animation meant playing a whole match, so I asked for tools instead. ==I had the AI build its own game-dev tools, so we could work on the game together.==" },
      { t: "feature", src: "soul-blade/05.png", title: "Action lab", text: "Runs the real engine with slow motion, frame-by-frame stepping and hitboxes drawn on. I reviewed every move frame by frame and sent notes as character, move and tick." },
      { t: "feature", src: "soul-blade/04.png", title: "Hitbox lab", text: "Slashes were hitting thin air. This lab freezes the hit frame so I can drag the hit range and blade tip by hand, then exports straight into the game data." },
      { t: "feature", src: "soul-blade/06.png", title: "UI asset library", text: "Every Gemini-made asset (title screens, banners, frames) with where it's used. 101 assets, compared side by side before anything ships." },
      { t: "feature", src: "soul-blade/07.png", title: "Design labs", text: "For every screen, four options on one page. I pick, the AI builds. Supers were storyboarded the same way: I describe the move, it redraws the slash." },
    ] },
    { id: "game", label: "The Game", blocks: [
      { t: "h", text: "The Game" },
      { t: "row", items: [{ src: "soul-blade/02.png", w: 480 }, { src: "soul-blade/03.png", w: 480 }], caption: "Round start and the results screen" },
      { t: "sub", text: "As a game" },
      { t: "list", plain: true, items: [
        "Two fighters: Kenji, a power samurai, and Hayato, a fast ninja with shuriken.",
        "Best of three against the AI, at three levels. Hard mode reads your inputs.",
        "Blocking, a guard gauge that breaks, chain cancels, air juggles and a super meter.",
        "A training mode and an interactive move guide.",
      ] },
      { t: "sub", text: "As tech" },
      { t: "list", plain: true, items: [
        "Plain JavaScript on Canvas: no engine, no dependencies, no build step. About 6,500 lines.",
        "Free CC0 character sprites; the engine recolors the artist's slash arcs into trails.",
        "UI art by Gemini, music by Lyria, sound effects synthesized in the browser.",
        "Hosted on Cloudflare Pages.",
      ] },
    ] },
  ],
};

export const twistSolver: CaseStudy = {
  accent: "#2f8f4e",
  sub: "I used to solve the cube. I'd forgotten how, and didn't want to relearn it.",
  role: "Solo builder, with Claude Code",
  timeline: "Jul 2026 · 5 days",
  tools: "Claude Code · three.js · cubejs · HTML / CSS / JS",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "The Problem" },
      { t: "p", text: "I could solve a Rubik's cube once. Years later I could only do one face. I didn't want to sit through tutorials again, so I asked Claude Code to build ==something I could just follow, one move at a time.==" },
      { t: "img", src: "twist-solver/01.png", caption: "The layer to turn glows, and black arrows show which way", w: 880 },
      { t: "link", text: "Try Twist Solver", href: "https://twist-solver.pages.dev" },
    ] },
    { id: "build", label: "How It Came Together", blocks: [
      { t: "h", text: "How It Came Together" },
      { t: "step", title: "A cube you can trust", text: "Day one: a 3D cube you can turn, a model that rejects impossible cubes, and a layer-by-layer solver tested on 2,000 random scrambles." },
      { t: "step", title: "Make it followable", text: "Moves on the back were invisible, so the camera settled on a fixed three-quarter view. A second mode gives the shortest solution, about 20 moves." },
      { t: "step", title: "Design by test page", text: "Throwaway lab pages compared ways to show a move, until we landed on dimming everything except the turning layer." },
      { t: "step", title: "Ship it, on phones too", text: "Name, logo, a polished desktop UI, a separate mobile layout, then live on Cloudflare Pages." },
      { t: "img", src: "twist-solver/02.png", caption: "Mid-solve on a phone: step 59 of 118", w: 320 },
    ] },
    { id: "takeaway", label: "What Surprised Me", blocks: [
      { t: "h", text: "What Surprised Me" },
      { t: "p", text: "How good the modelling was. Claude built a cube state that always matches the animation, a checker that knows which cubes can't exist, and two solvers, then checked its own work with screenshots before showing me." },
      { t: "p", text: "I never relearned the cube. ==I learned that I didn't have to.==" },
    ] },
  ],
};

export const legoWorld: CaseStudy = {
  accent: "#c91a09",
  sub: "Every country I've been to, rebuilt in real LEGO bricks by AI.",
  role: "Solo builder, directing Claude agents",
  timeline: "Sep 2026 – Present",
  tools: "Claude Code · TypeScript · three.js · LDraw · Cloudflare Pages",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Why LEGO" },
      { t: "p", text: "I started this to find a model's limit. Building LEGO is hard: every part has to be real, and every brick has to click onto something. I was sure models couldn't do it well." },
      { t: "p", text: "Each country I've been to becomes a floating island of ==3,000 to 11,000 real parts==, pinned on a brick-built globe. Pick a pin and the city builds itself." },
      { t: "stat", value: "20", label: "countries visited, each one a pin on the globe" },
      { t: "stat", value: "9", label: "already built in LEGO, with more on the way" },
      { t: "link", text: "Explore the globe", href: "https://ericfu-lego-world.pages.dev/" },
    ] },
    { id: "models", label: "The Model Race", blocks: [
      { t: "h", text: "The Model Race" },
      { t: "step", title: "One shot, two models", text: "I gave Fable 5 and Astra the same brief. Fable built on a real brick grid with real colors; Astra had the better app. We kept Fable's core and Astra's shell." },
      { t: "step", title: "A judge, then rules", text: "\"You're both the athlete and the referee.\" A separate judge agent now scores every set, and every lesson became a rule in the pipeline so I didn't have to coach twice." },
      { t: "step", title: "Opus 5.5", text: "Opus 5 fell short and was rolled back. Opus 5.5 was the leap: Singapore went from v7 to v10 in one day." },
      { t: "row", items: [{ src: "lego-world/05.png", w: 480 }, { src: "lego-world/06.png", w: 480 }], caption: "Singapore, round one (left) and after Opus 5.5 (right)" },
      { t: "row", items: [{ src: "lego-world/07.png", w: 480 }, { src: "lego-world/08.png", w: 480 }], caption: "Kyoto, first judged round (4.6 / 9) and the version I signed off" },
    ] },
    { id: "sets", label: "The Sets", blocks: [
      { t: "feature", src: "lego-world/01.webp", title: "Singapore · Marina Bay", text: "Marina Bay Sands, the Supertrees, the Merlion and a row of shophouses. 3,418 bricks in 29 colors." },
      { t: "feature", src: "lego-world/02.webp", title: "France · Paris", text: "The Eiffel Tower, Notre-Dame, the quays and a Haussmann corner. 6,309 bricks in 23 colors." },
      { t: "feature", src: "lego-world/03.webp", title: "Japan · Kyoto", text: "Tea by the water, a five-storey pagoda and a cherry blossom lane. 2,645 bricks in 19 colors." },
      { t: "feature", src: "lego-world/04.webp", title: "Czechia · Prague", text: "Charles Bridge, Týn Church, the Astronomical Clock and Old Town Square. 5,386 bricks in 25 colors." },
    ] },
    { id: "pipeline", label: "The Pipeline", blocks: [
      { t: "h", text: "The Pipeline" },
      { t: "list", items: [
        "**Every part is real.** Each brick is an actual LEGO part and color, with geometry from the LDraw library.",
        "**Everything is buildable.** Every piece clicks onto a real stud, clip or pin. A validator blocks anything that floats or overlaps.",
        "**Every brick stays a brick.** Angled sub-builds are taken apart back into individual pieces.",
      ] },
      { t: "step", title: "Research", text: "Real photos, a palette, and how official sets and fan builds solve each landmark. One page, signed off before any brick." },
      { t: "step", title: "Blockout, then build in parallel", text: "Plain boxes for scale, then each landmark built by its own agent in its own git worktree." },
      { t: "step", title: "Check, judge, review", text: "Typecheck, stud and collision checks, close-up renders, a judge score of 8 or more, and finally my own review, which outranks the score." },
      { t: "p", text: "The pipeline is now open source as [lego-forge](https://github.com/ericfu-tianchi/lego-forge), so any agent can build LEGO the same way." },
    ] },
    { id: "learned", label: "What I Learned", blocks: [
      { t: "h", text: "What I Learned" },
      { t: "p", text: "I set out to find the ceiling, and it kept moving. Part of that was new models. The bigger part was the pipeline: every failure became a rule, every rule made the next build better." },
      { t: "quote", text: "The model sets what's possible. The process decides how much of it you get." },
      { t: "p", text: "Designed, built and directed with Claude. LEGO® is a trademark of the LEGO Group, which does not sponsor or endorse this project. Part geometry: LDraw.org, CC BY 2.0." },
    ] },
  ],
};
