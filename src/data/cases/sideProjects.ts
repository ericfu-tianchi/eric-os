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
  role: "Solo builder",
  timeline: "Sep – Oct 2026",
  tools: "Claude Code · LDraw",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Why LEGO" },
      { t: "p", text: "It started as a test. I wanted to see where today's models break, and LEGO looked like a good place to look: every part has to exist, and every brick has to click onto another. I gave a few models the same brief and expected a mess." },
      { t: "p", text: "The results got good enough that I wanted to keep them. So the test became a real project: every country I've been to, rebuilt as a floating island of ==3,000 to 11,000 real LEGO parts== on a brick-built globe. Pick a pin and the city builds itself." },
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
      { t: "p", text: "Before building anything for real, I ran a race: same brief, different models. It turned out to be an unusual benchmark, and a fun one. You can't bluff your way through LEGO. A brick either clicks or it floats, and you can see the answer at a glance." },
      { t: "cards", numbers: false, items: [
        { src: "lego-world/race-astra.webp", title: "Astra", text: "The prettiest app of the three. But its pieces sat on free coordinates, not a brick grid, so none of it could be built." },
        { src: "lego-world/race-fable.webp", title: "Fable 5", text: "Real bricks on a real grid, but only about 60 basic shapes. Its Marina Bay Sands was three plain slabs." },
        { src: "lego-world/race-opus.webp", title: "Opus 5.5", text: "Studied photos and real LEGO builds first, then reached for curved slopes, hinges and side studs." },
      ] },
      { t: "p", text: "Opus 5.5 had the most LEGO talent by a distance. When its first Marina Bay Sands came back, my note to it was one line: ==“This is so much better than before!”== Every set from then on was built with Opus 5.5." },
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
      { t: "p", text: "Here is Paris, from first reference to final set, in 80 seconds." },
      { t: "video", src: "lego-world/howto-paris.mp4", poster: "lego-world/howto-paris-poster.jpg", caption: "How a city becomes LEGO, with Paris as the example" },
      { t: "item", src: "lego-world/pipe-research.webp", title: "Research the place", text: "Pick four or five landmarks the island can hold, each with a minifigure doing something local. Colors come from real photos, heights from real proportions.\n\nThen study how others built them: official sets, LEGOLAND, fan builds. If our own attempt fails twice, borrow the technique that already works." },
      { t: "item", src: "lego-world/pipe-blockout.webp", title: "Block it out", text: "Before any detail, plain boxes at the right heights, viewed from the same camera as the reference. It's the cheapest moment to catch a tower that's too short or a river in the wrong place." },
      { t: "item", src: "lego-world/pipe-eiffel.webp", title: "Build every landmark at once", text: "Each landmark gets its own agent and its own copy of the code, so five build in parallel without stepping on each other.\n\nSome take a while. The Eiffel Tower took 26 versions before it looked right." },
      { t: "item", src: "lego-world/pipe-check.webp", title: "Check every brick", text: "Code checks that every piece is a real part, sits on a real stud and passes through nothing. A tree that floats one plate above the ground fails the build, however good it looks." },
      { t: "item", src: "lego-world/pipe-judge.webp", title: "The judge, then me", text: "A separate judge agent sees only renders, never code, and scores eight things from silhouette to buildability. Paris scored 6.97 in round two, with notes like “the Wallace fountain reads as a mailbox.” Below 8, it goes back to build.\n\nMy review comes last, and it outranks the score." },
      { t: "sub", text: "Lego Forge" },
      { t: "p", text: "Afterwards I packed the method into [Lego Forge](https://github.com/ericfu-tianchi/lego-forge), an open-source skill that lets any coding agent turn an idea or a photo into a buildable LEGO set: a garden, an F1 car, even my two cats." },
    ] },
    { id: "learned", label: "What I Learned", blocks: [
      { t: "h", text: "What I Learned" },
      { t: "sub", text: "Try it anyway" },
      { t: "p", text: "I started out sure that models couldn't build LEGO. If I had trusted that, there would be no project. The only way to find a model's limit is to walk up to it, and it was further away than I thought. A month later there were nine cities." },
      { t: "sub", text: "When building is solved, the fun is what's left" },
      { t: "p", text: "Models get better every few months. I expect that within a year or two, AI will build any LEGO set simply and perfectly. When that happens, building stops being the hard part. What gets rare is the feeling of building: watching a city come together brick by brick, taking it apart, putting it back. Designing for that feeling takes human judgment about experience, not just output, and ==that's the part I want to work on.==" },
      { t: "p", text: "LEGO® is a trademark of the LEGO Group, which does not sponsor or endorse this project. Part geometry: LDraw.org, CC BY 2.0." },
    ] },
  ],
};
