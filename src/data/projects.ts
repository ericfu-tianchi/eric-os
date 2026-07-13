export type Category = "AI" | "DESIGN" | "PLAY" | "LIFE";
export type Status = "live" | "beta" | "award";

export interface Project {
  slug: string;
  name: string;
  desc: string;
  year: string;
  cat: Category;
  status?: Status;
  statusLabel?: string;
  detail?: string;
  link?: string;
}

/**
 * Placeholder-but-real content: these are Eric's actual projects.
 * Each entry becomes a row in PROJECTS.DIR and its own detail window.
 * Add a project = add an object here. Nothing else to wire.
 */
export const PROJECTS: Project[] = [
  {
    slug: "model-eval",
    name: "Opus Model-Eval",
    desc: "AI 视频模型评测体系:rubrics · taxonomy · WLT/Elo 报告管线",
    year: "2026",
    cat: "AI",
    status: "live",
    statusLabel: "SHIPPED",
    detail:
      "在 Opus 实习期间主导的模型评测插件:从评测维度设计、标注规范到自动化报告(胜负平/Elo),先后跑通 Gemini、Seedance、Vidu 等模型的横评。这是我最能代表 AI PM 能力的作品。",
  },
  {
    slug: "twist-solver",
    name: "Twist Solver",
    desc: "跟练式三阶魔方求解 Web App,3D 演示逐步还原",
    year: "2026",
    cat: "PLAY",
    status: "live",
    statusLabel: "LIVE",
    detail:
      "从零 vibe-code 的魔方求解器:输入打乱状态,生成最短/新手两种解法,3D 跟练动画逐步演示。本站 Dock 图标的阴影语言,就来自它的 Primary Button。",
  },
  {
    slug: "soul-blade",
    name: "SOUL BLADE 刀魂",
    desc: "KOF 式像素格斗游戏,纯手写 Canvas 引擎",
    year: "2026",
    cat: "PLAY",
    status: "beta",
    statusLabel: "BETA",
    detail:
      "手写游戏循环、碰撞、连招系统的像素格斗游戏。ERIC OS 的像素审美,一部分就是在这个项目里练出来的。",
  },
  {
    slug: "jyi",
    name: "JYI · AI 面试 SaaS",
    desc: "ATS + AI 面试产品,PM 起源故事(2021 就在做 AI 产品)",
    year: "2021",
    cat: "AI",
    statusLabel: "ORIGIN",
    detail:
      "在 AI 还不时髦的 2021 年做 AI 面试产品的 PM:优化 AI 面试引导流程,学生满意度 +20%,两个月内 30+ 付费企业。我的 AI PM 起源故事。",
  },
  {
    slug: "neurobot",
    name: "Neurobot",
    desc: "神经科学教育机器人 App 重设计,HCI Expo 一等奖",
    year: "2022",
    cat: "DESIGN",
    status: "award",
    statusLabel: "AWARD",
    detail:
      "Backyard Brains 客户项目:高严重度可用性问题 13→1,SEQ 5.6→6.4,获 2022 U-M HCI Design Expo Best Project。",
  },
  {
    slug: "homesoffcampus",
    name: "HomesOffCampus",
    desc: "留学生租房平台:独立完成研究、设计与 React Native 开发",
    year: "2021",
    cat: "DESIGN",
    statusLabel: "SOLO",
    detail:
      "被租房骗局坑过之后做的解决方案:调研、设计、开发一个人全包。是我 designer-who-codes 的第一份完整证明。",
  },
];

export const CATEGORIES: ("ALL" | Category)[] = ["ALL", "AI", "DESIGN", "PLAY", "LIFE"];
