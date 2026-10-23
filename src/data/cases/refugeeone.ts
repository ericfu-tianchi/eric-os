import type { CaseBlock, CaseStudy } from "../cases";

/**
 * RefugeeOne job platform (SI 699, winter 2023). Sources: the team's Drive (proposal, client notes,
 * midterm/final decks, poster, handoff), the SI 501 affinity wall, the repo (RefugeeOne699/refugee-one)
 * and the outcome numbers on Eric's resume. Screens are the shipped app, run locally with sample data.
 */

const meta = {
  accent: "#e8650f", // RefugeeOne's brand orange, one step deeper so labels read on white
  sub: "A job platform for refugees, employers and the RefugeeOne team.",
  role: "Product Designer\nFrontend Developer\nScrum Master",
  timeline: "Jan – May 2023",
  tools: "Figma · Jira\nReact · Tailwind · Firebase",
};

// ---------- shared pieces ----------

const intro: CaseBlock[] = [
  { t: "p", text: "[RefugeeOne](https://www.refugeeone.org/) is a nonprofit resettlement agency in Chicago. It helps people who have fled war, terror and persecution build new lives of safety, dignity and self-reliance, and a steady job is where that starts." },
  { t: "p", text: "Families arrive with about three and a half months of government support, so the first job has to come fast, and it has to fit: ==pay that covers rent, a shift the bus can reach, a workplace where limited English is fine.==" },
];

const links: CaseBlock = { t: "links", items: [
  { text: "Watch the demo", href: "https://www.youtube.com/watch?v=YzZrsk8REAc", primary: true },
  { text: "Source code on GitHub", href: "https://github.com/RefugeeOne699/refugee-one" },
] };

const built: CaseBlock = {
  t: "p", text: "Over one semester, six of us from the University of Michigan School of Information built RefugeeOne ==a job platform with a workspace for each side==: employers post jobs, RefugeeOne's staff review them, and refugees search on their own phones. The team: Neha Kumari, Mike (Jiayao) Wu, Ken DeBacker, Yipeng Lin, Annie (Mingyu) Li and me.",
};

const problem: CaseBlock = {
  t: "callout", label: "The problem",
  text: "Refugees couldn't search for jobs on their own. Employers sent openings through a Google Form into a spreadsheet nobody could filter, often without pay or shift times, so RefugeeOne staff had to walk each refugee through them in hour-long one-on-ones.",
};

const results: CaseBlock = {
  t: "stats",
  items: [
    { value: "600+", label: "jobs posted in the first year" },
    { value: "150+", label: "listings open at any time" },
    { value: "75+", label: "employers posting directly" },
    { value: "80%", label: "more efficient job matching for staff" },
  ],
  note: "Reported by RefugeeOne a year after launch. The project also won [second prize at the 2023 UMSI Student Project Exposition](https://www.si.umich.edu/about-umsi/news/2023-umsi-student-project-exposition-award-recipients-announced).",
};

const researchIntro: CaseBlock[] = [
  { t: "p", text: "We built on an SI 501 team's study from the year before: interviews with two RefugeeOne staff members and two refugees, sorted onto an affinity wall. Then we walked through RefugeeOne's own tools with its employment team: a Google Form, two spreadsheets and a hand-kept map." },
  { t: "img", src: "refugeeone/affinity.png", caption: "One cluster of the SI 501 affinity wall: interview notes in yellow, the themes they add up to in blue and pink, the insight in green", w: 707 },
];

const findings: CaseBlock = {
  t: "cards", items: [
    { title: "The details that decide a job are the ones missing", text: "Pay, shift times, English level and the commute decide whether a job can work. Job boards rarely show them. One refugee quit a job that took ==two buses and a train==; another got home at 2 a.m. after the buses had stopped." },
    { title: "Staff time is the bottleneck", text: "Each RefugeeOne job counselor carries about 30 clients, up to 50 in busy months. A one-on-one takes about an hour, and much of it goes to ==walking through listings one by one== and checking addresses on a map." },
    { title: "Refugees want to search on their own", text: "About 60% of clients can use an app without help, and staff wanted exactly that: ==show clients the tool, let them research, then come back together== to talk about what looked good." },
  ],
};

const problemStatement: CaseBlock = {
  t: "quote", derived: true, label: "So the problem became",
  text: "How might refugees find jobs near them on their own, with the details that decide whether a job can work for them?",
};

const brief: CaseBlock = {
  t: "versus",
  before: {
    label: "What they asked for", title: "A multilingual smartphone app for refugees",
    items: ["One user: the refugee", "Installs, app stores and updates", "Translation built into the product", "Employers still email staff, and the spreadsheet stays"],
  },
  after: {
    label: "What we proposed", title: "One responsive website with a workspace for each role",
    items: ["Refugees search on their phones, nothing to install", "Employers post jobs from a laptop", "Staff review every job and account in one dashboard", "Icons on every field, plus the browser's own translation"],
  },
};

const briefWhy: CaseBlock[] = [
  { t: "p", text: "**Why a website?** Refugees use phones; employers and staff use computers. One responsive website works on both, with nothing to install and almost nothing to host." },
  { t: "p", text: "**Why not translate it?** Icons on every field carry the meaning, and the browser's built-in translator covers the rest." },
];

const journey: CaseBlock = {
  t: "flow", items: [
    { who: "Employer", title: "Posts a job", text: "Pay range, shift, English level and address are required, so the details refugees need are never left out." },
    { who: "RefugeeOne", title: "Reviews it", text: "Staff approve it, fix it, or send it back with a note. When an employer edits a job, it goes back in the queue." },
    { who: "Refugee", title: "Finds it", text: "Filters by pay, shift and language, sees how far it is from home, and saves it for the next meeting." },
    { who: "RefugeeOne", title: "Helps apply", text: "Staff meet with the refugee, talk through the jobs they saved, and help them apply." },
  ],
};

const workflows: CaseBlock[] = [
  { t: "p", text: "Before drawing screens, we mapped every task for each role: sign up, post, review, approve, search, save. Each flow became a set of user stories on the board, and each set became a wireframe." },
  { t: "img", src: "refugeeone/flows.png", caption: "Low-fi wireframes grouped by role: sign-in, refugee, RefugeeOne staff and employer", w: 1040 },
  { t: "p", text: "We settled structure in grayscale first, then built a style guide on RefugeeOne's brand orange and took every screen to high fidelity." },
  { t: "img", src: "refugeeone/lofi-hifi.png", caption: "From wireframe to shipped: the job list and the job page", w: 1000 },
];

const screensRefugee: CaseBlock[] = [
  { t: "feature", bare: true, src: "refugeeone/client-cards.png", title: "The facts first", text: "Each card shows the role, employer, address, starting pay and medical, with a star to save it for later. Tap a card for every detail, each with its own icon." },
  { t: "feature", bare: true, src: "refugeeone/client-filter.png", title: "Filters built around a day", text: "Refugees filter by what decides a job for them: pay, shift times, English level, language, distance and benefits." },
  { t: "feature", bare: true, src: "refugeeone/client-distance.png", title: "How far is it?", text: "Every job shows how many miles it is from home, and opens in Google Maps in one tap to check the commute." },
];

const screensEmployer: CaseBlock[] = [
  { t: "feature", bare: true, src: "refugeeone/employer.png", title: "Post once, track it", text: "Employers post from a laptop, save long forms as drafts, and follow each job through Pending, Approved and Action Required. When staff send a job back, their note appears right on it." },
];

const screensStaff: CaseBlock[] = [
  { t: "feature", bare: true, src: "refugeeone/admin-queue.png", title: "One queue for every job", text: "Every new posting lands in one queue. Staff approve, edit or reject it, and a rejection can carry a note the employer sees." },
  { t: "feature", bare: true, src: "refugeeone/admin-accounts.png", title: "RefugeeOne holds the keys", text: "Staff create refugee accounts and approve every employer who signs up. New users get an email and set their own password." },
];

const demo: CaseBlock = { t: "embed", kind: "youtube", src: "https://www.youtube-nocookie.com/embed/YzZrsk8REAc?rel=0", caption: "The walkthrough video our team made for the expo" };

const agile: CaseBlock[] = [
  { t: "p", text: "We ran the semester as Scrum on Jira: user stories for each role, acceptance criteria on every ticket, and a sprint review with RefugeeOne at the end of every sprint. ==As Scrum Master, I ran our standups three times a week and led every demo.==" },
  { t: "img", src: "refugeeone/jira.png", caption: "Our Jira board: stories for every role, tracked from To Do to Done", w: 880 },
];

const milestones: CaseBlock = {
  t: "timeline", compact: true, items: [
    { date: "Feb 2", title: "Kickoff" },
    { date: "Feb 20", title: "First commit" },
    { date: "March", title: "Midterm demo" },
    { date: "Apr 19", title: "20+ PRs in a day" },
    { date: "Late April", title: "Launch and handoff" },
  ],
};

const stack: CaseBlock[] = [
  { t: "stack", items: [
    { logo: "react", name: "React", role: "Frontend" },
    { logo: "vite", name: "Vite", role: "Build" },
    { logo: "tailwindcss", name: "Tailwind CSS", role: "Styling" },
    { logo: "daisyui", name: "daisyUI", role: "Components" },
    { logo: "firebase", name: "Firebase", role: "Auth, data, hosting" },
    { logo: "githubactions", name: "GitHub Actions", role: "Deploy on merge" },
    { logo: "jira", name: "Jira", role: "Sprints" },
    { logo: "figma", name: "Figma", role: "Design" },
  ] },
  { t: "p", text: "Every pull request got its own preview link, and every merge went live: ==94 pull requests in nine weeks.==" },
];

const myCode: CaseBlock = {
  t: "list", plain: true, items: [
    "**Job search and filters** for refugees, from the panel to the logic behind it.",
    "**Account onboarding**: set-password and reset-password flows for every new user.",
    "**The mobile layout** of the refugee side, built for the phones refugees actually use.",
  ],
};

const handoff: CaseBlock = {
  t: "p", text: "We handed off more than code: a guide to hosting, accounts, the database, backups and the free-tier limits, plus a web developer job description so RefugeeOne could hire someone to keep improving it.",
};

const hats: CaseBlock = {
  t: "cards", numbers: false, items: [
    { title: "Product designer", text: "Research synthesis, workflows for three roles, wireframes through high fidelity, and the style guide." },
    { title: "Frontend developer", text: "Search and filters, the onboarding screens and the mobile layout." },
    { title: "Scrum master", text: "Standups three times a week, the Jira board, and sprint planning with the team." },
    { title: "Demo lead", text: "Every demo, to the team, the class and RefugeeOne, and turning what the client said into tickets." },
  ],
};

const lessons: CaseBlock[] = [
  { t: "sub", text: "Solve the problem, not the request" },
  { t: "p", text: "The biggest call we made was not building the app we were asked for. Looking at the whole workflow, not just the refugee's screen, is what let refugees search on their own and gave staff back the hours they had spent walking clients through listings one by one." },
  { t: "sub", text: "Walk through the data model with the client" },
  { t: "p", text: "RefugeeOne discovered what it needed as it saw each screen, and every change rippled through the UI, the database and the logic. Next time I'd walk through the data model and each role's workflow with the client before the first sprint, not just the mockups." },
  { t: "sub", text: "Solving it end to end" },
  { t: "p", text: "This was my first time going all the way around the loop, from interviews to designs, code, sprints, a live launch and a handoff. I loved solving a real problem for real users, not stopping at a design file. ==It's still the project I'm proudest of from my time at Michigan.==" },
];

// ---------- research → app to website → design → product → build → reflection ----------

const a: CaseStudy = {
  ...meta,
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Background" },
      ...intro,
      problem,
      { t: "h", text: "What we built" },
      built,
      links,
      { t: "img", src: "refugeeone/teaser.png", w: 1040 },
      { t: "h", text: "Results" },
      results,
    ] },
    { id: "research", label: "Research", blocks: [
      { t: "h", text: "Where we started" },
      ...researchIntro,
      { t: "h", text: "What we learned" },
      findings,
      problemStatement,
    ] },
    { id: "rethink", label: "From App to Website", blocks: [
      { t: "p", text: "RefugeeOne asked us for a smartphone app for refugees. But a job listing passes through three groups: employers post it, staff review it, refugees search it. An app for refugees alone would fix only the last step, so ==we proposed one website with a workspace for each group== instead." },
      brief,
      ...briefWhy,
      { t: "h", text: "One job, three sides" },
      journey,
    ] },
    { id: "design", label: "Design", blocks: [
      { t: "h", text: "Workflows first" },
      ...workflows,
    ] },
    { id: "product", label: "The Product", blocks: [
      { t: "part", title: "For refugees", text: "Find work on their own phones." },
      ...screensRefugee,
      { t: "part", title: "For employers", text: "Post jobs with every detail that matters." },
      ...screensEmployer,
      { t: "part", title: "For RefugeeOne", text: "Review every job and every account." },
      ...screensStaff,
      demo,
    ] },
    { id: "build", label: "How We Built It", blocks: [
      { t: "h", text: "Agile, with the client in the room" },
      ...agile,
      milestones,
      { t: "h", text: "The stack" },
      ...stack,
      { t: "h", text: "What I built" },
      myCode,
      { t: "h", text: "Handoff" },
      handoff,
    ] },
    { id: "reflection", label: "Reflection", blocks: [
      { t: "h", text: "🎩 Many hats" },
      { t: "p", text: "On a team of six, I covered four roles at once, and found I enjoy moving between them." },
      hats,
      { t: "h", text: "What I took away" },
      ...lessons,
    ] },
  ],
};

export const refugeeone: CaseStudy = a;
