export type Category = "AI" | "DESIGN" | "PLAY" | "LIFE";
export type Status = "live" | "beta" | "award";
export type Group = "selected" | "tech" | "school";

export interface Project {
  slug: string;
  name: string;
  desc: string;
  year: string;
  cat: Category;
  group: Group;
  status?: Status;
  statusLabel?: string;
  overview?: string;
  process?: string;
  outcome?: string;
  link?: string;
}

export const GROUPS: { id: Group; label: string; blurb: string }[] = [
  { id: "selected", label: "SELECTED WORK", blurb: "代表作:AI 产品与设计" },
  { id: "tech", label: "TECH STUFF", blurb: "自己写代码做出来的东西" },
  { id: "school", label: "SCHOOL PROJECTS", blurb: "UMich HCI 时期作品" },
];

/**
 * Real projects, grouped like the old tianchi-fu.com tabs.
 * Add a project = add an object. Detail window renders
 * overview/process/outcome as old-site style case sections.
 */
export const PROJECTS: Project[] = [
  // ---------- SELECTED WORK ----------
  {
    slug: "model-eval",
    name: "Opus Model-Eval",
    desc: "AI 视频模型评测体系:rubrics · taxonomy · WLT/Elo 报告管线",
    year: "2026",
    cat: "AI",
    group: "selected",
    status: "live",
    statusLabel: "SHIPPED",
    overview:
      "在 Opus 实习期间主导的模型评测插件。AI 视频模型迭代极快,团队需要一套可复用的评测基建来回答『新模型值不值得切』。",
    process:
      "从评测维度设计、标注规范到自动化报告(胜负平/Elo)搭完整条管线,先后跑通 Gemini、Seedance、Vidu 等模型的横向评测。",
    outcome: "成为团队模型决策的默认工具,也是我最能代表 AI PM 能力的作品。",
  },
  {
    slug: "jyi",
    name: "JYI · AI 面试 SaaS",
    desc: "ATS + AI 面试产品,我的 AI PM 起源故事",
    year: "2021",
    cat: "AI",
    group: "selected",
    statusLabel: "ORIGIN",
    overview: "在 AI 还不时髦的 2021 年,做 AI 面试 SaaS 的产品实习生。",
    process: "负责 AI 面试引导流程的重设计,用 SQL 做用户画像分析驱动迭代。",
    outcome: "学生满意度 +20%,产品两个月内签下 30+ 付费企业。",
  },
  {
    slug: "huawei",
    name: "Huawei 折叠屏窗口管理",
    desc: "折叠屏 PC 的窗口管理机制设计,专利申请中",
    year: "2022",
    cat: "DESIGN",
    group: "selected",
    statusLabel: "PATENT",
    overview: "华为 UX 设计实习(深圳):为折叠屏设备设计窗口管理机制。",
    process: "研究 Windows/macOS/Groupy 的窗口范式,推导折叠形态下的分屏与拖拽交互。",
    outcome: "方案进入专利申请流程。(内容受 NDA 限制,细节略)",
  },
  {
    slug: "neurobot",
    name: "Neurobot",
    desc: "神经科学教育机器人 App 重设计,HCI Expo 一等奖",
    year: "2022",
    cat: "DESIGN",
    group: "selected",
    status: "award",
    statusLabel: "AWARD",
    overview: "Backyard Brains 客户项目:面向高中生的神经科学教育机器人 App 重设计。",
    process: "五人团队,完整可用性测试循环:高严重度可用性问题从 13 个降到 1 个,SEQ 5.6→6.4。",
    outcome: "方案进入开发,获 2022 U-M HCI Design Expo Best Project(一等奖)。",
  },
  {
    slug: "refugeeone",
    name: "RefugeeOne 求职 App",
    desc: "为难民安置机构设计并开发的求职应用",
    year: "2021",
    cat: "DESIGN",
    group: "selected",
    statusLabel: "CLIENT",
    overview: "为芝加哥难民安置机构 RefugeeOne 做的求职 App,设计+开发一起上。",
    process: "低数字素养用户的无障碍设计;多语言;从访谈到可用性测试完整走完。",
    outcome: "交付客户;这是『设计给真实弱势用户』给我上的最重要一课。",
  },
  // ---------- TECH STUFF ----------
  {
    slug: "twist-solver",
    name: "Twist Solver",
    desc: "跟练式三阶魔方求解 Web App,3D 演示逐步还原",
    year: "2026",
    cat: "PLAY",
    group: "tech",
    status: "live",
    statusLabel: "LIVE",
    link: "https://twist-solver.pages.dev/",
    overview: "从零 vibe-code 的魔方求解器:输入打乱状态,生成最短/新手两种解法。",
    process: "3D 跟练动画逐步演示;Tianchi OS 的『现代为体』审美基线就来自这个项目。",
    outcome: "已上线 Cloudflare Pages,点左侧 LIVE 直达。",
  },
  {
    slug: "soul-blade",
    name: "SOUL BLADE 刀魂",
    desc: "KOF 式像素格斗游戏,纯手写 Canvas 引擎",
    year: "2026",
    cat: "PLAY",
    group: "tech",
    status: "beta",
    statusLabel: "BETA",
    overview: "手写游戏循环、碰撞检测、连招系统的像素格斗游戏。",
    process: "无引擎纯 Canvas;角色状态机 + 帧数据驱动的打击感调教。",
    outcome: "可玩 Beta;Tianchi OS 的像素审美一部分是在这里练出来的。",
  },
  {
    slug: "homesoffcampus",
    name: "HomesOffCampus",
    desc: "留学生租房平台:独立完成研究、设计与 React Native 开发",
    year: "2021",
    cat: "DESIGN",
    group: "tech",
    statusLabel: "SOLO",
    overview: "被租房骗局坑过之后做的解决方案:调研、设计、开发一个人全包。",
    process: "React Native + Firebase;房源搜索 + 论坛 + Buddy Program 三大模块。",
    outcome: "我 designer-who-codes 的第一份完整证明。",
  },
  {
    slug: "handcoded",
    name: "Handcoded Website",
    desc: "前 Wix 时代的手写作品集(HTML/CSS/JS)",
    year: "2021",
    cat: "PLAY",
    group: "tech",
    statusLabel: "ARCHIVE",
    link: "https://ericfu666.github.io/portfolio/index.html",
    overview: "2021-2022 年间手写的第一版个人网站。",
    process: "原生三件套,AOS 滚动动画,自制交互彩蛋(马里奥砖块点击出星星)。",
    outcome: "Tianchi OS 的史前史;源码在 GitHub 存档。",
  },
  // ---------- SCHOOL PROJECTS ----------
  {
    slug: "subtension",
    name: "SubTension",
    desc: "2D 潜艇 RTS 游戏 UX(WolverineSoft 40 人团队)",
    year: "2022",
    cat: "PLAY",
    group: "school",
    statusLabel: "SHIPPED",
    overview: "受 FTL 启发的 2D 潜艇 RTS,在 40 人的 WolverineSoft Studio 做游戏 UX。",
    process: "叙事、场景流程、新手教程、商店/背包 UI,两个学期的完整开发周期。",
    outcome: "已发布 itch.io 可玩。",
  },
  {
    slug: "connectr",
    name: "Connectr",
    desc: "MBTI 导向的小组制交友 App(3 周 Tech & Business Jam)",
    year: "2021",
    cat: "DESIGN",
    group: "school",
    statusLabel: "CONCEPT",
    overview: "三周冲刺:UX 主导 + 商业计划一起做的交友产品概念。",
    process: "Persona、线框、高保真;市场/竞品/收入模型分析。",
    outcome: "完整的『设计×商业』双面案例。",
  },
  {
    slug: "rutabagga",
    name: "Rutabagga",
    desc: "素食时令饮食 App 的品牌与 logo 设计",
    year: "2022",
    cat: "DESIGN",
    group: "school",
    statusLabel: "BRAND",
    overview: "虚构素食 App 的完整品牌设计(Illustrator)。",
    process: "字体、可缩放性、变体、留白规范,一整套 brand sheet。",
    outcome: "纯视觉肌肉展示。",
  },
  {
    slug: "ece",
    name: "ECE/SUGS 咨询",
    desc: "UMich 硕士项目申请流程的 UX 咨询",
    year: "2021",
    cat: "DESIGN",
    group: "school",
    statusLabel: "REPORT",
    overview: "为 UMich ECE 硕士项目做申请流程优化咨询。",
    process: "6 场访谈,18 页报告,6 条落地建议。",
    outcome: "研究方法论的规范练习。",
  },
];

export const byGroup = (g: Group) => PROJECTS.filter((p) => p.group === g);

/**
 * Case-study metadata — mirrors the old tianchi-fu.com detail-page spec:
 * per-project accent, a hero subtitle, and the Role / Timeline / Tools sidebar.
 * (Roles/timelines/tools carried over verbatim from the old site where they existed.)
 */
export interface ProjectMeta {
  accent: string;
  sub?: string;
  role?: string;
  timeline?: string;
  tools?: string;
}
export const META: Record<string, ProjectMeta> = {
  "model-eval": { accent: "#2f9e57", sub: "评测 AI 视频模型的可复用基建", role: "AI PM", timeline: "2026 · Opus", tools: "Rubrics · Elo/WLT · Python" },
  jyi: { accent: "#17a89e", sub: "AI 面试 SaaS 的产品起源故事", role: "Product Manager & UX Designer", timeline: "Jan–Apr 2021", tools: "Figma · SQL" },
  huawei: { accent: "#2b5672", sub: "折叠屏 PC 的窗口管理机制", role: "UX Designer", timeline: "May–Sep 2022", tools: "Figma" },
  neurobot: { accent: "#ff9d1f", sub: "让高中生爱上神经科学的机器人 App", role: "UX Designer", timeline: "Jan–Apr 2022", tools: "Figma · Miro · Matlab" },
  refugeeone: { accent: "#e0483a", sub: "为难民安置机构设计并开发的求职 App", role: "UX Designer & Developer", timeline: "2021 · Client", tools: "Figma · React" },
  "twist-solver": { accent: "#3f6fd1", sub: "跟练式三阶魔方求解器", role: "Designer who codes", timeline: "2026", tools: "React · Three.js" },
  "soul-blade": { accent: "#d76a97", sub: "纯手写 Canvas 的像素格斗", role: "Solo dev", timeline: "2026", tools: "Canvas · TS" },
  homesoffcampus: { accent: "#2b5672", sub: "A housing website catered to and trusted by students", role: "UX Designer & Researcher, Developer", timeline: "Sep–Dec 2021", tools: "Figma · Miro · React Native + Firebase" },
  handcoded: { accent: "#6a727e", sub: "前 Wix 时代的手写作品集", role: "Frontend Developer", timeline: "Nov 2021–Aug 2022", tools: "HTML · CSS · JS" },
  subtension: { accent: "#1f9e57", sub: "受 FTL 启发的 2D 潜艇 RTS", role: "UX Designer", timeline: "Sep–Dec 2022", tools: "Figma" },
  connectr: { accent: "#17a89e", sub: "MBTI 导向的小组制交友 App", role: "UX Design Lead + Business", timeline: "3-week jam", tools: "Figma" },
  rutabagga: { accent: "#b3812a", sub: "素食时令饮食 App 的品牌设计", role: "UI Designer", timeline: "Mar–Apr 2022", tools: "Illustrator" },
  ece: { accent: "#4a74d6", sub: "UMich 硕士申请流程的 UX 咨询", role: "UX Consultant", timeline: "Sep–Dec 2021", tools: "Miro" },
};
export const metaOf = (slug: string): ProjectMeta => META[slug] ?? { accent: "#4a74d6" };
