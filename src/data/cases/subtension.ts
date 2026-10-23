import type { CaseStudy } from "../cases";

/** Subtension: a student game that shipped on Steam. Process first: references → layouts → shipped screens. */
export const subtension: CaseStudy = {
  // Old site: #00ED45 on a black page. On white that is 1.6:1, so this keeps the neon hue
  // but deepens it to clear 3:1 for the 18px bold labels.
  accent: "#0fa83f",
  sub: "A 2D real-time-strategy submarine game, inspired by FTL (WolverineSoft, team of 40).",
  role: "Game Designer",
  timeline: "Sep – Dec 2022",
  tools: "Figma",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Background" },
      { t: "p", text: "In Sep 2022 I joined WolverineSoft Studio, the University of Michigan's student game studio, to help make Subtension: a real-time-strategy submarine game inspired by FTL: Faster Than Light." },
      { t: "p", text: "For four months I worked in a ==team of 40== as a game designer. Among other things, I worked on the ==UI layout, the tutorial flow, and the shop and inventory==. The game shipped on Steam in March 2023." },
      { t: "links", items: [
        { text: "Subtension on Steam", href: "https://store.steampowered.com/app/2251660/Subtension/", primary: true },
        { text: "Studio page on itch.io", href: "https://wolverinesoft-studio.itch.io/subtension" },
      ] },
    ] },
    { id: "game", label: "The Game", dark: true, blocks: [
      { t: "p", text: "Outfit, crew and command your submarine to save what's left of humanity beneath the seas of a ruined earth. Man your sub's systems and take aim in this real-time strategy epic." },
      { t: "embed", kind: "youtube", src: "https://www.youtube-nocookie.com/embed/nQlUPwGlQvY", caption: "Official trailer" },
      { t: "gallery", cols: 2, items: [
        { src: "subtension/game-combat.png", caption: "Combat: your sub below, the enemy above, systems and weapons at the bottom" },
        { src: "subtension/game-tutorial.png", caption: "The Old Captain walks you through your first fight" },
        { src: "subtension/game-shop.png", caption: "The shop between encounters" },
        { src: "subtension/game-dialogue.png", caption: "A fully voiced story with multiple endings" },
      ] },
    ] },
    { id: "process", label: "How We Worked", blocks: [
      { t: "h", text: "Project Timeline" },
      { t: "p", text: "Forty people across four squads (Ship, Messaging, Narrative and Expansion) worked in one-week sprints: an onboarding week, three production sprints and a QA sprint. Every squad had design, programming, art and audio; this is the design side." },
      { t: "sprints",
        weeks: ["9/11", "9/18", "9/25", "10/2", "10/9", "10/16", "10/23", "10/30", "11/6", "11/13", "11/20", "11/27"],
        phases: [{ name: "Kickoff", from: 0, to: 0 }, { name: "Sprint 1", from: 1, to: 3 }, { name: "Sprint 2", from: 4, to: 6 }, { name: "Sprint 3", from: 7, to: 8 }, { name: "QA sprint", from: 9, to: 11 }],
        rows: [
          { track: "Ship", bars: [
            { text: "Hazards", from: 0, to: 0 }, { text: "Crew AI", from: 2, to: 3 }, { text: "Revisit", from: 4, to: 4 }, { text: "Walls, doors, ladders", from: 5, to: 6 }, { text: "Revisit", from: 7, to: 7 }, { text: "Balancing", from: 8, to: 11 },
            { text: "Walls, doors, ladders", from: 0, to: 1, line: 1 }, { text: "Crew AI", from: 4, to: 4, line: 1 }, { text: "Sea monster", from: 5, to: 6, line: 1 },
          ] },
          { track: "Messaging", bars: [
            { text: "Messaging", from: 0, to: 1 }, { text: "Revisit", from: 4, to: 4 }, { text: "Revisit", from: 7, to: 7 }, { text: "Adjustments", from: 8, to: 11 },
            { text: "Tutorial: combat & ship", from: 1, to: 3, line: 1, mine: true }, { text: "UI / menu navigation", from: 4, to: 6, line: 1, mine: true },
          ] },
          { track: "Narrative", bars: [
            { text: "2nd encounter", from: 0, to: 0 }, { text: "Tutorial", from: 2, to: 3, mine: true }, { text: "Revisit", from: 4, to: 4 }, { text: "Narrative", from: 5, to: 6, mine: true }, { text: "Revisit", from: 7, to: 7 }, { text: "Narrative adjustments", from: 8, to: 11, mine: true },
            { text: "Narrative system", from: 0, to: 1, line: 1, mine: true }, { text: "Encounters 3–5", from: 3, to: 5, line: 1 },
          ] },
          { track: "Expansion", bars: [
            { text: "Loot / upgrade", from: 0, to: 0 }, { text: "Additional systems", from: 1, to: 3 }, { text: "Revisit", from: 4, to: 4 }, { text: "Weapons, crews, systems", from: 5, to: 6 }, { text: "Revisit", from: 7, to: 7 }, { text: "Balancing", from: 8, to: 11 },
          ] },
        ],
        note: "Design tasks per squad, by week. Highlighted: the tracks I designed for." },
    ] },
    { id: "contributions", label: "Selected Work", blocks: [
      { t: "p", text: "Three of the pieces I worked on, each shaped with the team through many rounds of playtests and reviews." },
      { t: "h", text: "UI Layout" },
      { t: "p", text: "A real-time strategy game puts a lot on one screen: two ships, every room and crew member, weapons charging, hull and shields. Before drawing anything, I studied how ==FTL and other strategy and story games== solve this, then tried layout after layout: where the enemy sits, where the controls live, what pausing looks like, and how story moments take over the screen without hiding the fight." },
      { t: "gallery", cols: 3, items: [
        { src: "subtension/ref-ftl.png", caption: "FTL: the main reference for paused, real-time combat" },
        { src: "subtension/concept-a.png", caption: "Early concept: sonar-style enemy view, crew and weapons as one bar" },
        { src: "subtension/concept-b.png", caption: "Early concept: a green tactical grid" },
      ] },
      { t: "evolve", items: [
        { src: "subtension/wf-blocking.png", label: "Blocking", note: "Two ships, crew left, weapons right" },
        { src: "subtension/wf-combat.png", label: "Combat layout", note: "Hull meter, systems, room grid, jump" },
        { src: "subtension/wf-paused.png", label: "Paused state", note: "Plan moves while time stops" },
        { src: "subtension/wf-story.png", label: "Story on top", note: "Dialogue slides over the bottom bar" },
        { src: "subtension/wf-choices.png", label: "Choices", note: "Branching answers in the same panel" },
        { src: "subtension/game-combat.png", label: "Combat UI in the shipped game", note: "Enemy above, our sub below, controls along the bottom" },
      ] },

      { t: "h", text: "Tutorial Flow" },
      { t: "p", text: "Subtension has a lot of mechanics, and a new player meets all of them at once. The tutorial had to teach pausing, crew, weapons, damage, repair, shields and hazards ==without dragging on==, and still feel like the opening of a story rather than a manual. I turned it into a scripted first battle with the Old Captain as your guide: every mechanic is introduced the moment you need it, and you learn it by doing it." },
      { t: "beats", chapters: [
        { title: "Get your bearings", steps: ["Enter your first combat", "The game pauses: learn the captain's focus", "Meet the UI: hull, systems, crew"] },
        { title: "First shot", steps: ["Send crew to the weapons room", "Charge and fire the weapon", "Hit the enemy ship"] },
        { title: "Take a hit", steps: ["The enemy hits back: a system is destroyed", "Send crew to repair the room", "Heal the injured in the medbay"] },
        { title: "Shields and hazards", steps: ["Man the shields", "The next shot is blocked", "A shield-piercing shot starts a fire", "Meet the weapon types", "Put out the fire, then go fight"] },
      ] },
      { t: "script", title: "Script excerpt · Got hit, learn to pause", lines: [
        { act: "Enemy sub fires and hits our weapons room. Screen shakes. Weapon destroyed, crew member injured." },
        { who: "Old Captain", say: "Argh, now they fight back! We've got a damaged system and a hurt crew member, so now is a good time to mention the captain's focus. You can pause the game by hitting SPACE to focus and assess the situation." },
        { who: "Old Captain", say: "As captains, we can also plan commands and target weapons while paused, and they will take action when unpaused. Let's assess now using SPACE." },
        { act: "Wait for the player to pause." },
      ] },
      { t: "compare", before: { src: "subtension/wf-tut-crew.png", label: "Tutorial wireframe: callouts point at each panel" }, after: { src: "subtension/game-tutorial.png", label: "Shipped: the Old Captain guides, the panel he talks about lights up" } },

      { t: "h", text: "Shop and Inventory" },
      { t: "p", text: "A shop sounds standard, but players use it between every encounter, so small things add up. I worked out what is selected when the shop opens, how items look when hovered or chosen, how buying feels, and how the shop, the inventory and the submarine connect, so that upgrading your sub takes a few clicks and always tells you what just changed." },
      { t: "evolve", items: [
        { src: "subtension/buff1.png", label: "Pick an upgrade", note: "The first item is pre-selected; hover and selected states differ" },
        { src: "subtension/buff2.png", label: "Place it", note: "Rooms that can take it light up on the sub" },
        { src: "subtension/buff3.png", label: "Confirm", note: "The upgrade lands with a clear signal" },
        { src: "subtension/buff6.png", label: "Buy hull", note: "New bars fill one at a time, ~400 ms each, with sound" },
        { src: "subtension/game-shop.png", label: "Shop in the shipped game", note: "Systems, crew and utilities on the left, what you own on the right" },
      ] },
      { t: "list", plain: true, items: [
        "**Auto-select**: entering the shop selects the first item under Systems → All, so the details panel is never empty.",
        "**Three item states**: normal, hover (grey outline) and selected (orange outline).",
        "**One loop**: shop, inventory and submarine always link back to each other, so you never get lost between them.",
      ] },
    ] },
    { id: "takeaways", label: "Takeaways", blocks: [
      { t: "cards", items: [
        { title: "No one ships a game alone", text: "Art, design, programming, direction and sound all had to meet in the middle. Even a small game is ==a whole team's work==, and it taught me how much a team can do that no one person can." },
        { title: "My first real sprints", text: "Each squad met every week to review, decide and plan the next sprint, across design, art, code and audio. It was my first taste of agile development, and ==one of the happiest stretches of my time at Michigan==." },
        { title: "The work you don't see", text: "Every visual, mechanic and number in a game this size was argued over and revisited. Great work rests on ==a lot of invisible thinking==, which is why I sweat the details: what you ship should be finished, not just done." },
      ] },
    ] },
  ],
};
