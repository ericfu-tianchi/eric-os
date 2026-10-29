import type { CaseStudy } from "../cases";

/* The three AI side projects. Each one started as a test of what a model could do. Short on purpose. */

export const soulBlade: CaseStudy = {
  accent: "#c8324a",
  sub: "A King of Fighters–style pixel fighter, built with AI in ten days.",
  role: "Solo builder",
  timeline: "Jul 2026 · 10 days",
  tools: "Claude Code · Gemini",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "How It Started" },
      { t: "p", text: "Fable 5 had just come out, and everyone was talking about how good it was, so I wanted to try it myself. I typed one sentence: “Make me a game like The King of Fighters.” It built the whole thing: two fighters, an AI opponent, combos, supers." },
      { t: "p", text: "The first version was playable, and full of bugs. So I fixed a little here and patched a little there, and ==ten days later I had actually made a game.==" },
      { t: "links", items: [
        { text: "Play Soul Blade", href: "https://soul-blade.pages.dev", primary: true, app: "soul-blade" },
        { text: "GitHub", href: "https://github.com/ericfu-tianchi/soul-blade" },
      ] },
      { t: "img", src: "soul-blade/sb-fight.mp4", caption: "A real match: Hayato lands his super, Afterimage · Iai Slash", frame: true, w: 880 },
    ] },
    { id: "lab", label: "The Lab", blocks: [
      { t: "h", text: "Tools to Build With AI" },
      { t: "p", text: "A fighting game lives on feel: how far a slash reaches, how long a hit freezes, how a super lands. AI can't feel any of that, and I couldn't judge it inside a live match. So on day two I stopped asking for features and ==asked the AI to build its own game-dev tools.== We worked in them together from then on." },
      { t: "feature", src: "soul-blade/sb-actionlab.mp4", title: "Action Lab", text: "The real game engine, slowed to a quarter speed, one frame at a time, with hitboxes drawn on. I reviewed every move this way and sent notes as character, move and frame." },
      { t: "feature", src: "soul-blade/sb-hitboxlab.mp4", title: "Hitbox Lab", text: "Slashes looked like they hit and still missed. This lab freezes the hit frame so I can stretch the hit range against the blade by hand, then exports it straight into the game." },
      { t: "feature", src: "soul-blade/sb-assets.webp", title: "UI Asset Library", text: "Every piece of art Gemini made, about 100 in all: title emblems, portraits, banners, frames and result screens, compared side by side before anything shipped." },
      { t: "feature", src: "soul-blade/sb-titles.webp", title: "Design Labs", text: "Big decisions came as options on one page. Four title screens, four banners, four results screens, six ways to draw one sword swing. I picked, the AI built." },
      { t: "cards", numbers: false, items: [
        { title: "Layout editor", text: "Drag and scale portraits on the select, results and HUD screens, then export the layout." },
        { title: "Sound labs", text: "Sixteen music tracks in four moods to choose from, and synthesized hit sounds to compare." },
        { title: "Character lab", text: "Research on a third fighter. We built a spear-wielding priestess as a prototype, and I cut her." },
        { title: "Freeze hunter", text: "AI fights AI for hours in the background to find bugs and freezes nobody would play long enough to hit." },
      ] },
    ] },
    { id: "game", label: "The Game", blocks: [
      { t: "h", text: "The Game" },
      { t: "p", text: "A one-on-one sword fighter in modern pixel art, set in a Japanese town at dusk. Best of three, against an AI that gets very good." },
      { t: "sub", text: "As a game" },
      { t: "item", frame: true, src: "soul-blade/sb-fighters.webp", title: "Two fighters, two styles", text: "Kenji is a heavy-sword samurai: slow, and he hits hard. Hayato is a swift ninja with longer reach and shuriken. Each has a super with its own cinematic." },
      { t: "item", frame: true, src: "soul-blade/sb-super.webp", title: "Real fighting-game depth", text: "Blocking, a guard that breaks if you only defend, combos that cancel into each other, air juggles and a super meter. Twenty-four moves in all." },
      { t: "item", frame: true, src: "soul-blade/sb-result.webp", title: "An AI that reads you", text: "Easy, normal and hard. Hard blocks the moment you press attack and punishes every jump. When the AI said it was maxed out, I asked for something absurd, and got it." },
      { t: "sub", text: "Under the hood" },
      { t: "stats", items: [
        { value: "6,600", label: "lines of plain JavaScript, no engine" },
        { value: "24", label: "moves built from two attack animations" },
        { value: "60s → 3s", label: "first load, after fixing it for launch" },
      ] },
      { t: "cards", numbers: false, items: [
        { title: "One slash, many moves", text: "The artist drew one white sword arc. The engine cuts it out, recolors it by power and reuses it in every move." },
        { title: "Art and sound by AI", text: "Gemini drew the UI art and Lyria wrote the music. Every hit sound is synthesized live in the browser." },
        { title: "Free to play", text: "Free CC0 character sprites, no libraries and no build step. It runs in any browser, hosted on Cloudflare Pages." },
      ] },
    ] },
    { id: "learned", label: "What I Learned", blocks: [
      { t: "h", text: "What I Learned" },
      { t: "sub", text: "When AI can't feel it, build it a lab" },
      { t: "p", text: "AI is bad at the parts of a game that need a hand on the controls: timing, reach, the weight of a hit. Instead of fighting that, I had it build tools for tuning feel, UI and moves. ==Those labs became where the AI and I actually worked together==, and they made everything after them fast." },
      { t: "sub", text: "From player to game director" },
      { t: "p", text: "I had only ever played games. Here I wrote no code, but I set the vision, the art direction and every call that mattered, down to storyboarding the supers shot by shot. ==With AI, anyone can step up a level and lead the work, not just do it.==" },
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
      { t: "img", src: "lego-world/race-kyoto.webp" },
      { t: "cards", numbers: false, items: [
        { title: "Astra", text: "The prettiest app of the three. But its pieces sat on free coordinates, not a brick grid, so none of it could be built." },
        { title: "Fable 5", text: "Real bricks on a real grid and a proper pagoda. But it used only basic shapes, and one part in twelve was floating." },
        { title: "Opus 5.5", text: "Real LDraw parts in official colors: a pagoda, a hill of torii and a golden pavilion on a pond, in one go." },
      ] },
      { t: "p", text: "Opus 5.5 came out later, so it got the same brief in a rematch. Side by side, it had the best modeling and ==the most LEGO talent of the three==, so every set after that was built with Opus 5.5." },
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
