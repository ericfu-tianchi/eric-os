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
  sub: "A Rubik's cube solver you follow one turn at a time.",
  role: "Solo builder",
  timeline: "Jul 2026 · 7 days",
  tools: "Claude Code",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "The Problem" },
      { t: "p", text: "I used to be able to solve a Rubik's cube. Years later, I picked one up at the office and couldn't get it back. I was about to look up a tutorial, then thought: why relearn it myself when AI could learn it for me? So I built a tool instead. It was ==my first vibe coding project==." },
      { t: "links", items: [
        { text: "Try Twist Solver", href: "https://twist-solver.pages.dev/", primary: true, app: "twist-solver" },
        { text: "GitHub", href: "https://github.com/ericfu-tianchi/twist-solver" },
      ] },
      { t: "stats", items: [
        { value: "7\u00a0days", label: "from the first prompt to a live site" },
        { value: "2", label: "ways to solve: shortest, or layer by layer" },
        { value: "2,000", label: "random scrambles passed in tests" },
      ] },
    ] },
    { id: "build", label: "How It Came Together", blocks: [
      { t: "h", text: "How It Came Together" },
      { t: "item", frame: true, src: "twist-solver/tw-first-draft.webp", title: "A first draft from one wish", text: "I asked for a Rubik's cube solver and had a working one on day one: a 3D cube, a color editor and a solver that passed every test. It also looked like AI slop, all dark navy and glowing blue buttons." },
      { t: "item", frame: true, src: "twist-solver/tw-style.webp", title: "Pick a visual style", text: "We moved toward a Figma-style toolbar: light, quiet panels and borderless actions. A little arcade flavor stayed in the chunky offset shadows and the pixel wordmark." },
      { t: "item", frame: true, src: "twist-solver/tw-methods.webp", title: "Two ways to solve", text: "Shortest gives about 20 moves for people who just want it solved. Beginner goes layer by layer, about 130 moves, the way people learn by hand." },
      { t: "item", frame: true, src: "twist-solver/tw-arrow-lab.webp", title: "Polish every detail", text: "Throwaway test pages compared arrows and highlights side by side until one read instantly: black arrows on the glowing layer. Then came the corner radii, the logo and a long list of small bugs." },
      { t: "item", frame: true, src: "twist-solver/tw-mobile-trio.webp", title: "Then the phone", text: "Last came a separate mobile layout over the same engine: one-thumb controls, pinch to zoom, and a color editor that fits on one screen." },
    ] },
    { id: "devices", label: "Desktop and Mobile", blocks: [
      { t: "h", text: "Desktop and Mobile" },
      { t: "p", text: "One engine, two front ends. On desktop you get a toolbar, the full move list and keyboard shortcuts. On a phone, everything sits under one thumb. Press Auto and the cube solves itself one move at a time." },
      { t: "img", src: "twist-solver/tw-loop-desktop.mp4", caption: "Desktop: the glowing layer turns, the move list follows", frame: true, w: 880 },
      { t: "row", frame: true, items: [{ src: "twist-solver/tw-loop-mobile.mp4", w: 250 }, { src: "twist-solver/tw-mobile-edit.webp", w: 250 }, { src: "twist-solver/tw-mobile-home.webp", w: 250 }], caption: "Mobile: solving on Auto, entering your own cube, and the home screen" },
    ] },
    { id: "learned", label: "What I Learned", blocks: [
      { t: "h", text: "What I Learned" },
      { t: "sub", text: "Iteration is the process" },
      { t: "p", text: "People ask how I built Twist Solver. Honestly, I just kept iterating. The first version came back on day one and looked like AI slop, so I changed one thing, then the next, for seven days. ==Start iterating early. The iterating is the work.==" },
    ] },
  ],
};

export const legoWorld: CaseStudy = {
  accent: "#c91a09",
  sub: "Every country I've been to, rebuilt in real LEGO bricks by AI.",
  role: "Solo builder",
  timeline: "Sep – Oct 2026",
  tools: "Claude Code · LDraw",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Why LEGO" },
      { t: "p", text: "It started as a test. Building LEGO felt like exactly the kind of task AI still couldn't do: creative, precise and unforgiving in 3D. Every part has to be real, and every brick has to click onto another. I gave a few models the same brief and expected a mess." },
      { t: "p", text: "The results got good enough that I wanted to keep them. So the test became a real project: every country I've been to, rebuilt as a floating island of ==around 7,000 real LEGO parts== on a brick-built globe. Pick a pin and the city builds itself." },
      { t: "links", items: [
        { text: "Open My Lego World", href: "https://ericfu-lego-world.pages.dev/", primary: true, app: "lego-world" },
        { text: "GitHub", href: "https://github.com/ericfu-tianchi/my-lego-world" },
      ] },
      { t: "stats", items: [
        { value: "9", label: "cities built, with more to come" },
        { value: "63,000+", label: "real LEGO parts across the sets" },
        { value: "1\u00a0month", label: "from the first test to the ninth city" },
      ] },
    ] },
    { id: "models", label: "The Model Race", blocks: [
      { t: "h", text: "The Model Race" },
      { t: "p", text: "Before building anything for real, I ran a race: one brief, build Kyoto in LEGO, given to three models. It turned out to be an unusual benchmark, and a fun one. You can't bluff your way through LEGO. A brick either clicks or it floats, and you can see the answer at a glance." },
      { t: "cards", numbers: false, items: [
        { src: "lego-world/race-astra.webp", title: "Astra", text: "The prettiest app of the three. But its pieces sat on free coordinates, not a brick grid, so none of it could be built." },
        { src: "lego-world/race-fable.webp", title: "Fable 5", text: "Real bricks on a real grid and a proper pagoda. But it used only basic shapes, and one part in twelve was floating." },
        { src: "lego-world/race-opus.webp", title: "Opus 5.5", text: "Real LDraw parts in official colors: a pagoda, a hill of torii and a golden pavilion on a pond, in one go." },
      ] },
      { t: "p", text: "Opus 5.5 came out later, so it got the same brief in a rematch, and it had the most LEGO talent by a distance. When its first Marina Bay Sands came back, my note to it was one line: ==“This is so much better than before!”== Every set after that was built with it." },
    ] },
    { id: "sets", label: "The Sets", blocks: [
      { t: "feature", src: "lego-world/set-prague.mp4", title: "Czechia · Prague", text: "Charles Bridge, Týn Church, the Astronomical Clock and Old Town Square. 5,386 bricks in 25 colors." },
      { t: "feature", src: "lego-world/set-paris.mp4", title: "France · Paris", text: "The Eiffel Tower, Notre-Dame, the quays and a Haussmann corner. 6,309 bricks in 23 colors." },
      { t: "feature", src: "lego-world/set-la.mp4", title: "USA · Los Angeles", text: "Santa Monica Pier, Venice Beach and the Hollywood Hills. 11,177 bricks in 36 colors, the biggest set so far." },
      { t: "feature", src: "lego-world/set-pattaya.mp4", title: "Thailand · Pattaya", text: "The Sanctuary of Truth, Pattaya Beach and Pratumnak Hill. 7,933 bricks in 28 colors." },
      { t: "p", text: "… plus Kyoto, Marina Bay, Neuschwanstein, Seoul and Shanghai. Every set can be taken apart into a cloud of bricks and put back together." },
      { t: "links", items: [{ text: "See all nine sets", href: "https://ericfu-lego-world.pages.dev/", primary: true, app: "lego-world" }] },
    ] },
    { id: "pipeline", label: "The Pipeline", blocks: [
      { t: "h", text: "The Pipeline" },
      { t: "p", text: "Every city goes through the same steps, under three rules: every part is a real LEGO part in an official color, every piece clicks onto something, and nothing is glued into shapes LEGO doesn't make." },
      { t: "video", src: "lego-world/howto-paris.mp4", poster: "lego-world/howto-paris-poster.jpg", caption: "Paris, from first reference to final set, in 80 seconds", steps: [
        { src: "lego-world/step-research.webp", title: "Find references", text: "Real photos, official sets and fan builds show the place and what already works in bricks." },
        { src: "lego-world/step-landmarks.webp", title: "Pick the landmarks", text: "Only four or five fit on the island, so each one has to be iconic and buildable." },
        { src: "lego-world/step-colors.webp", title: "Set colors and heights", text: "Colors come from real photos, heights from real proportions." },
        { src: "lego-world/step-blockout.webp", title: "Block it out", text: "Plain boxes first, checked against the reference before any detail." },
        { src: "lego-world/step-parts.webp", title: "Real parts only", text: "Every piece is a real LEGO part in an official color." },
        { src: "lego-world/step-parallel.webp", title: "Build, compare, rebuild", text: "Each landmark gets its own agent, and gets rebuilt until it matches the reference." },
        { src: "lego-world/step-check.webp", title: "Check and score", text: "Code checks that every brick clicks onto something. An AI judge scores how it looks." },
        { src: "lego-world/step-done.webp", title: "One last human look", text: "It's done when I say it's done." },
      ] },
      { t: "sub", text: "Lego Forge" },
      { t: "p", text: "Afterwards I packed the method into [Lego Forge](https://github.com/ericfu-tianchi/lego-forge), an open-source skill that lets any coding agent turn an idea or a photo into a buildable LEGO set." },
      { t: "img", src: "lego-world/forge.webp", caption: "Built with Lego Forge: a Japanese garden, a treehouse, an F1 car and a bakery" },
    ] },
    { id: "public", label: "Build in Public", blocks: [
      { t: "h", text: "Build in Public" },
      { t: "p", text: "I posted every set on Xiaohongshu as I built it: one post per city, plus the how-to and Lego Forge. People followed along and asked how it worked. Sharing also changed the project. Xiaohongshu rewards posts that help people, so I turned the method into Lego Forge for anyone to use." },
      { t: "posts", href: "https://www.xiaohongshu.com/user/profile/5befd952f7e8b93b68ea98db", items: [
        { src: "lego-world/xhs-astra.webp", title: "From now on, Astra builds my LEGO", likes: 84, video: true },
        { src: "lego-world/xhs-unlimited.webp", title: "AI just gave me unlimited LEGO", likes: 33, video: true },
        { src: "lego-world/xhs-paris.webp", title: "Rebuild Paris in LEGO, with AI", likes: 30, video: true },
        { src: "lego-world/xhs-forge.webp", title: "One sentence, one real LEGO set", likes: 25 },
        { src: "lego-world/xhs-howto.webp", title: "I asked AI how it builds LEGO", likes: 24, video: true },
        { src: "lego-world/xhs-pattaya.webp", title: "I moved Pattaya into LEGO", likes: 15, video: true },
        { src: "lego-world/xhs-neuschwanstein.webp", title: "Can't afford Neuschwanstein? Build it", likes: 14, video: true },
        { src: "lego-world/xhs-la.webp", title: "Missing LA? A LEGO Los Angeles", likes: 12, video: true },
        { src: "lego-world/xhs-prague.webp", title: "AI builds LEGO cities: Prague", likes: 9, video: true },
        { src: "lego-world/xhs-seoul.webp", title: "AI brought BTS to LEGO Seoul", likes: 8, video: true },
      ] },
      { t: "links", items: [{ text: "Follow along on Xiaohongshu", href: "https://www.xiaohongshu.com/user/profile/5befd952f7e8b93b68ea98db" }] },
    ] },
    { id: "learned", label: "What I Learned", blocks: [
      { t: "h", text: "What I Learned" },
      { t: "sub", text: "Try it anyway" },
      { t: "p", text: "I started out sure that models couldn't build LEGO, and if I had trusted that, there would be no project. ==The only way to find a model's limit is to walk up to it.== This one was much further away than I thought: a month after that first test, there were nine cities on the globe." },
      { t: "sub", text: "When building is solved, the fun is what's left" },
      { t: "p", text: "Within a year or two, I expect AI to design any LEGO set simply and perfectly. What matters then is the build itself, the part LEGO cares about most: whether putting a set together by hand feels playful or repetitive. ==Designing that hands-on experience is the part I want to work on.==" },
    ] },
  ],
};
