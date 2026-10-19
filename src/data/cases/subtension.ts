import type { CaseStudy } from "../cases";

export const subtension: CaseStudy = {
  accent: "#12b24a",
  sub: "A 2D real-time-strategy submarine game, inspired by FTL (WolverineSoft, team of 40).",
  role: "UX Designer",
  timeline: "Sep 2022 – Dec 2022",
  tools: "Figma",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Background" },
      { t: "p", text: "I joined WolverineSoft Studio, a game-design studio at U-M, in Sep 2022 and took part in creating SubTension: a 2D real-time-strategy game inspired by FTL: Faster Than Light." },
      { t: "p", text: "For 4 months I worked in a team of 40 as a UX designer, mainly responsible for the narrative, game scenes and flows, and tutorials." },
      { t: "link", text: "Check out the game's official page", href: "https://wolverinesoft-studio.itch.io/subtension" },
      { t: "h", text: "Game Preview" },
      { t: "p", text: "Outfit, crew and command your submarine to save what's left of humanity beneath the seas of a ruined earth. Man your sub's systems and take aim in this real-time strategy epic! Inspired by FTL, this subnautic student project is our first two-semester release." },
    ] },
    { id: "design", label: "Design", blocks: [
      { t: "h", text: "Project Timeline" },
      { t: "img", src: "subtension/02.png", caption: "Project timeline — sprints across ship, messaging, narrative and expansion tracks, by discipline" },
      { t: "h", text: "Main Contributions" },
      { t: "sub", text: "UI Layout" },
      { t: "img", src: "subtension/03.png", caption: "UI layout wireframe — enemy ship / our ship submarine grid" },
      { t: "img", src: "subtension/04.png", caption: "Combat UI mockup — Active Items, Hull meter, Pause screen" },
      { t: "sub", text: "Tutorial Flow" },
      { t: "img", src: "subtension/05.png", caption: "Tutorial flow — narrative script frames (Story → Tutorial → Submarine Intro → Shop)" },
      { t: "img", src: "subtension/06.png", caption: "Tutorial UI walkthrough — Hull meter, Systems and Crew panel highlights" },
      { t: "sub", text: "Shop & Inventory" },
      { t: "img", src: "subtension/07.png", caption: "Shop & Inventory — item states: normal, hover (gray outline), selected (orange outline); the first item auto-selects on entering the shop." },
      { t: "img", src: "subtension/08.png", caption: "Buying health points — bars fill one at a time (~400ms each) with sound effects." },
    ] },
  ],
};
