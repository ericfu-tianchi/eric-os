import type { CaseStudy } from "../cases";

export const subtension: CaseStudy = {
  // Old site: #00ED45 on a black page. On white that is 1.6:1, so this keeps the neon hue
  // but deepens it to clear 3:1 for the 18px bold labels.
  accent: "#0fa83f",
  sub: "A 2D real-time-strategy submarine game, inspired by FTL (WolverineSoft, team of 40).",
  role: "UX Designer",
  timeline: "Sep 2022 – Dec 2022",
  tools: "Figma",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Background" },
      { t: "p", text: "I joined WolverineSoft Studio, a game design studio at U-M, in Sep 2022 and took part in the creation of the game SubTension: a 2D real-time-strategy game inspired by FTL: Faster Than Light." },
      { t: "p", text: "For 4 months, I worked in a ==team of 40== as a UX designer and was mainly responsible for designing the ==narrative, game scenes and flows, and tutorials==." },
      { t: "link", text: "Check out the game's official page", href: "https://wolverinesoft-studio.itch.io/subtension" },
      { t: "h", text: "Game Preview" },
      { t: "p", text: "Outfit, crew and command your submarine to save what's left of humanity beneath the seas of a ruined earth. Man your sub's systems and take aim in this real-time strategy epic! Inspired by FTL, this subnautic student project serves as our first 2-semester release." },
      { t: "embed", kind: "youtube", src: "https://www.youtube-nocookie.com/embed/nQlUPwGlQvY", caption: "Subtension – Official Trailer (2023)" },
    ] },
    { id: "design", label: "Design", blocks: [
      { t: "h", text: "Project Timeline" },
      { t: "img", src: "subtension/02.png", w: 854, caption: "Project timeline: sprints across the Ship, Messaging, Narrative and Expansion tracks, by discipline" },
      { t: "h", text: "Main Contributions" },
      { t: "sub", text: "UI Layout" },
      { t: "row", items: [{ src: "subtension/03.png", w: 455 }, { src: "subtension/04.png", w: 485 }], caption: "UI layout wireframe (left) and combat UI with Active Items, Hull meter and the Pause screen (right)" },
      { t: "sub", text: "Tutorial Flow" },
      { t: "img", src: "subtension/05.png", w: 802, caption: "Tutorial flow: narrative script frames (Story → Tutorial Start → Submarine Intro → Shop)" },
      { t: "img", src: "subtension/06.png", w: 655, caption: "UI walkthrough: highlighting the Hull meter, the Systems panel and the Crew panel in turn" },
      { t: "sub", text: "Shop & Inventory" },
      { t: "img", src: "subtension/07.png", w: 710, caption: "Item states in Shop & Inventory: normal, hover (gray outline) and selected (orange outline). The first item auto-selects when the player enters the shop." },
      { t: "img", src: "subtension/08.png", w: 710, caption: "Buying health points: new health bars fill in one at a time (about 400ms each) with sound effects." },
    ] },
  ],
};
