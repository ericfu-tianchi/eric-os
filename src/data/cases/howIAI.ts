import type { CaseStudy } from "../cases";

/** How I AI: the setup and three beliefs. Short on purpose. */
export const howIAI: CaseStudy = {
  accent: "#079a55",
  sub: "My setup, and three things I believe about building with AI.",
  role: "Daily practice",
  timeline: "2026",
  tools: "Claude Code · cmux · Typeless · Obsidian",
  sections: [
    { id: "setup", label: "The Setup", blocks: [
      { t: "h", text: "The Setup" },
      { t: "p", text: "Four pieces, used every day, for work and for everything else." },
      { t: "step", title: "Voice first: Typeless", text: "I dictate almost everything. If I don't have to type, I don't." },
      { t: "step", title: "Many Claudes at once: cmux + Claude Code", text: "One window, a column of Claude Code sessions on the left, each on its own task. Voice in, several agents out." },
      { t: "step", title: "A second brain: Obsidian + Claude", text: "Notes, plans and a 50,000-word personal wiki live in Obsidian, readable by Claude and backed up to GitHub." },
      { t: "step", title: "Not just work", text: "Fitness, a new subject, a trip, a tax form: if I'm learning something, an AI is teaching me. It's the OS for my life, not a tool for my job." },
    ] },
    { id: "beliefs", label: "What I Believe", blocks: [
      { t: "h", text: "What I Believe" },
      { t: "sub", text: "Be a kid about it" },
      { t: "p", text: "Kids don't know what's impossible, so they try everything. Models keep getting better, so I try to hand AI even the things I'm sure it can't do yet." },
      { t: "quote", text: "“Instead of writing code yourself and asking Claude to review it, you describe what you want and Claude figures out how to build it.” — [Claude Code best practices](https://code.claude.com/docs/en/best-practices)" },
      { t: "p", text: "Every side project in this folder started as a test of what a model could do. ==None of them were supposed to become projects.==" },
      { t: "sub", text: "The bottleneck is my attention" },
      { t: "p", text: "With worktrees I run four or five agents on different features at once, then come back to review what they've made. The slow part is no longer building. It's me reading." },
      { t: "p", text: "So I ask for work the way a decision-maker would: product calls, research and anything I need to review arrive as a visual page or an artifact, not a wall of text. ==When execution gets cheap, presentation has to get better.==" },
      { t: "sub", text: "AI sets the floor; care sets the ceiling" },
      { t: "p", text: "AI gets you a first version in minutes, often a 40 or 50 out of 100. Models will push that to 60 or 70. The rest still comes from a person with taste, iterating again and again." },
      { t: "callout", text: "AI has made starting almost free and raised the floor for everyone. The ceiling is still set by the quality of your iterations, your patience, and whether you ==care about the thing you're building==." },
    ] },
  ],
};
