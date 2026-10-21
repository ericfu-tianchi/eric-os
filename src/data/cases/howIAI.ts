import type { CaseStudy } from "../cases";

/** How I AI: the setup and three beliefs. Short on purpose; every row has a picture. */
export const howIAI: CaseStudy = {
  accent: "#079a55",
  sub: "My setup, and three things I believe about building with AI.",
  sections: [
    { id: "setup", label: "The Setup", blocks: [
      { t: "p", text: "Five pieces, open all day, for work and everything else." },
      { t: "item", title: "Voice first: Typeless", src: "how-i-ai/01.png", apps: ["typeless"],
        text: "I dictate almost everything. If I don't have to type, I don't. It's about four times faster than my keyboard, and my thinking stops waiting for my fingers." },
      { t: "item", title: "Many agents at once: cmux\u00a0+ Claude Code", src: "how-i-ai/02.png", apps: ["cmux", "claudecode"],
        text: "One window, a column of Claude Code sessions on the left, each on its own task. Voice in, several agents out." },
      { t: "item", title: "Check in from the notch: Vibe Island", src: "how-i-ai/03.png", apps: ["vibe"],
        text: "With several agents running, I don't watch any of them. Vibe Island turns the MacBook notch into a Dynamic Island for agents: who's done, who's waiting for approval. I approve from there or jump straight to that terminal. ==I\u00a0just come by to harvest.==" },
      { t: "item", title: "A second brain: Obsidian\u00a0+ Claude\u00a0+ GitHub", apps: ["obsidian", "claude", "github"], plus: true,
        text: "Notes, plans and a 50,000-word personal wiki live in Obsidian, readable by Claude and backed up to GitHub." },
      { t: "item", title: "Not just work", apps: ["claudecode", "codex", "gemini"],
        text: "Fitness, a new subject, a trip, a tax form: if I'm learning something, an AI is teaching me. It's the OS for my life, not a tool for my job." },
    ] },
    { id: "beliefs", label: "What I Believe", blocks: [
      { t: "p", text: "Three things I keep coming back to." },
      { t: "item", title: "Be a kid about it", src: "how-i-ai/04.png",
        text: "Kids don't know what's impossible, so they try everything. Models keep getting better, so I try to hand AI even the things I'm sure it can't do yet.\n\nEvery side project in this folder started as a test of what a model could do. ==None of them were supposed to become projects.==" },
      { t: "item", title: "The bottleneck is my attention", src: "how-i-ai/05.png",
        text: "I usually have three or four agents running at once, each on a different feature, and come back later to review what they've made. The slow part is no longer building. It's me reading.\n\nSo I ask for work the way a decision-maker would: product calls, research and anything I need to review arrive as a visual page or an artifact, not a wall of text. ==When execution gets cheap, presentation has to get better.==" },
      { t: "item", title: "AI sets the floor; care sets the ceiling", src: "how-i-ai/06.png",
        text: "AI can hand you a 50 or 60 out of 100 in minutes, and as models improve, that first pass will land closer to 60 or 70. The rest still comes from a person with taste, iterating again and again.\n\nThe ceiling is set by the quality of your iterations, your patience, and whether you ==care about the thing you're building==." },
    ] },
  ],
};
