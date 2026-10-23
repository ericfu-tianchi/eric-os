import type { CaseBlock, CaseStudy } from "../cases";

/**
 * RefugeeOne job platform (SI 699, winter 2023). Sources: the team's Drive (proposal, client notes,
 * midterm/final decks, poster, handoff), the SI 501 affinity wall, the repo (RefugeeOne699/refugee-one)
 * and the outcome numbers on Eric's resume. Screens are the shipped app, run locally with sample data.
 *
 * Three narrative structures share the same facts and screens; pick one with ?rv=a|b|c while reviewing.
 */

const meta = {
  accent: "#e8650f", // RefugeeOne's brand orange, one step deeper so labels read on white
  sub: "A job platform for refugees, employers and the RefugeeOne team.",
  role: "Product Designer\nFrontend Developer\nScrum Master",
  timeline: "Jan – May 2023",
  tools: "Figma · Jira\nReact · Tailwind · Firebase",
};

// ---------- shared pieces ----------

const hook: CaseBlock[] = [
  { t: "p", text: "[RefugeeOne](https://www.refugeeone.org/) resettles refugees in Chicago. A family arrives with about three and a half months of government support, so the first job has to come fast, and it has to actually work: ==pay that covers rent, a shift the bus can reach, a workplace where limited English is fine.==" },
];

const team = "In winter 2023, six of us from the University of Michigan School of Information built RefugeeOne a job platform. Employers post jobs, RefugeeOne's staff review them, and refugees find them on their own phones. I designed the product, wrote a good part of the frontend, ran our Scrum, and led every demo.";

const problem: CaseBlock = {
  t: "callout", label: "The problem",
  text: "Every job had to pass through a person. Listings came in through a Google Form and piled up in a spreadsheet that nobody could filter, so staff spent hour-long one-on-ones walking each client through openings one by one, plotting addresses on a map by hand.",
};

const results: CaseBlock = {
  t: "stats",
  items: [
    { value: "600+", label: "jobs posted in the first year" },
    { value: "150+", label: "listings open at any time" },
    { value: "75+", label: "employers posting directly" },
    { value: "80%", label: "more efficient job matching for staff" },
  ],
  note: "Reported by RefugeeOne a year after launch. The project also won **Second Prize at the 2023 Student Project Expo**.",
};

const researchIntro: CaseBlock[] = [
  { t: "p", text: "We didn't start from zero. A year earlier, an SI 501 team had interviewed two RefugeeOne staff members and two refugees for the same client and sorted every quote onto an affinity wall. We read all of it, then held our own kickoff with RefugeeOne's employment team and walked through what they used every day: a Google Form, two spreadsheets and a map they kept up by hand." },
  { t: "img", src: "refugeeone/affinity.png", caption: "One cluster of the SI 501 affinity wall: interview notes in yellow, the themes they add up to in blue and pink, the insight in green", w: 735 },
];

const findings: CaseBlock = {
  t: "cards", items: [
    { title: "The details that decide a job are the ones missing", text: "Pay, shift times, English level and the commute decide whether a job can work. Job boards rarely show them. One refugee quit a job that took ==two buses and a train==; another got home at 2 a.m. after the buses had stopped." },
    { title: "Staff time is the bottleneck", text: "Each counselor carries about 30 clients, up to 50 in busy months. A one-on-one takes about an hour, and much of it goes to ==walking through listings one by one== and checking addresses on a map." },
    { title: "Refugees want to search on their own", text: "About 60% of clients can use an app without help, and staff wanted exactly that: ==show clients the tool, let them research, then come back together== to talk about what looked good." },
  ],
};

const problemStatement: CaseBlock = {
  t: "quote", text: "Refugees need to find jobs near them in an ==interactive, accessible way==, with the details that decide whether a job can work for them.",
};

const brief: CaseBlock = {
  t: "versus",
  before: {
    label: "The brief", title: "A multilingual smartphone app for refugees",
    items: ["One user: the refugee", "Installs, app stores and updates", "Translation built into the product", "Employers still email staff, and the spreadsheet stays"],
  },
  after: {
    label: "What we built", title: "One responsive website with a workspace for each role",
    items: ["Refugees search on their phones, nothing to install", "Employers post jobs from a laptop", "Staff review every job and account in one dashboard", "Icons on every field, plus the browser's own translation"],
  },
};

const briefWhy: CaseBlock[] = [
  { t: "p", text: "Refugees mostly have phones; employers and staff work at computers. One responsive website served all three from a single codebase, needed nothing installed, stayed close to free to host, and let RefugeeOne decide who gets in. When we put it to the client at the kickoff, the answer was simple: ==a responsive website is fine.==" },
  { t: "p", text: "Translation followed the same logic. Rather than translate the product ourselves, we put an icon on every field and showed staff how the browser's built-in translation turns the whole site into Kinyarwanda, Arabic or Ukrainian. RefugeeOne's staff speak more than 30 languages between them and could walk clients through it." },
];

const journey: CaseBlock = {
  t: "flow", items: [
    { who: "Employer", title: "Posts a job", text: "Pay range, shift, English level and address are required, so the details refugees need are never left out." },
    { who: "RefugeeOne", title: "Reviews it", text: "Staff approve it, fix it, or send it back with a note. When an employer edits a job, it goes back in the queue." },
    { who: "Refugee", title: "Finds it", text: "Filters by pay, shift and language, sees how far it is from home, and saves it for the next meeting." },
    { who: "RefugeeOne", title: "Helps apply", text: "Application steps stay with staff, who keep the relationship with each employer's HR team." },
  ],
};

const clientChanges: CaseBlock = {
  t: "list", plain: true, items: [
    "Say **Pay**, not Salary or Wage, and fold tips or piece rates into the range as an estimate.",
    "Say **Shift**, not Job Timing, and let refugees filter by real start and end times: ==6 a.m. and 8 a.m. are different jobs== when you ride the bus.",
    "Make employers answer the medical-benefits question instead of skipping it.",
    "Keep phone numbers and emails with staff. Clients see the job, not the contact.",
    "Add more icons, everywhere: “What if they don't understand English at all?”",
  ],
};

const workflows: CaseBlock[] = [
  { t: "p", text: "Before drawing screens, we mapped every task for each role: sign up, post, review, approve, search, save. Each flow became a set of user stories on the board, and each set became a wireframe." },
  { t: "img", src: "refugeeone/flows.png", caption: "Low-fi wireframes grouped by role: sign-in, refugee, RefugeeOne staff and employer", w: 1040 },
  { t: "p", text: "We started in grayscale, then built a small style guide on RefugeeOne's own orange and took every screen to high fidelity. Each version went in front of the client before it went into code." },
  { t: "row", items: [{ src: "refugeeone/lofi-list.png", w: 200 }, { src: "refugeeone/lofi-detail.png", w: 200 }, { src: "refugeeone/ship-list.png", w: 200 }, { src: "refugeeone/ship-detail.png", w: 200 }], caption: "The job list and job page: low-fi wireframes, then the shipped screens" },
];

const screensRefugee: CaseBlock[] = [
  { t: "feature", bare: true, src: "refugeeone/client-cards.png", title: "The facts first", text: "Every card leads with what refugees check first: the role, the employer, the address, starting pay and whether medical is included. One tap opens the rest, each field with its own icon." },
  { t: "feature", bare: true, src: "refugeeone/client-filter.png", title: "Filters built around a day", text: "Pay floor, English level, 22 languages, a shift window and distance from home. A refugee can ask for ==full-time, $17 an hour or more, between 6 a.m. and 6 p.m., within five miles, with medical==." },
  { t: "feature", bare: true, src: "refugeeone/client-distance.png", title: "How far is it?", text: "Distance from home is worked out from the client's address, so every job says how many miles away it is, and the location opens in Google Maps with one tap. A star saves the job for the next meeting with staff." },
];

const screensEmployer: CaseBlock[] = [
  { t: "sub", text: "Post once, track it" },
  { t: "p", text: "Employers post from a laptop, save a long form as a draft, and follow each job through Pending, Approved and Action Required. When staff send a job back, their note shows up right on it." },
  { t: "img", src: "refugeeone/employer.png", caption: "An employer's dashboard: a job sent back with feedback from RefugeeOne, on a laptop and a phone", w: 1040 },
];

const screensStaff: CaseBlock[] = [
  { t: "sub", text: "One queue for every job" },
  { t: "p", text: "Staff see every new posting in one place and approve, edit or reject it. A rejection can carry a reason, which the employer sees as feedback." },
  { t: "img", src: "refugeeone/admin-queue.png", caption: "Rejecting a posting with a reason the employer will see", w: 1040 },
  { t: "sub", text: "RefugeeOne holds the keys" },
  { t: "p", text: "Staff create refugee accounts themselves and approve each employer who signs up. Nobody hands out passwords: new users get an email and set their own." },
  { t: "img", src: "refugeeone/admin-accounts.png", caption: "Manage Accounts: employers waiting for approval sort to the top", w: 1040 },
];

const demo: CaseBlock = { t: "embed", kind: "youtube", src: "https://www.youtube-nocookie.com/embed/YzZrsk8REAc?rel=0", caption: "The walkthrough video our team made for the expo" };

const stack: CaseBlock = {
  t: "p", text: "The stack was chosen so all six of us could ship in week one: **React** on Vite, **Tailwind** with daisyUI components, and **Firebase** for sign-in, the database and hosting. Addresses are geocoded once when a job or profile is saved, and distances are computed in the browser. Every pull request built its own preview link, and every merge went live: ==94 pull requests in nine weeks.==",
};

const myCode: CaseBlock[] = [
  { t: "sub", text: "What I built" },
  { t: "list", plain: true, items: [
    "**Search and filters** for refugees: the search bar, the full-screen filter panel and the logic behind its eight filters, with a teammate's distance check plugged in.",
    "**Account onboarding**: first-time password, forgot password and the “check your email” screens.",
    "**Mobile layout**: a sticky search bar, a pinned Show Results button and a page that fits a phone's real screen height, which took me eight tries in one evening.",
  ] },
  { t: "sub", text: "Reading free text as time" },
  { t: "p", text: "Employers type shifts in their own words, like “Mon–Fri 10 PM to 6 AM”. To let refugees filter by start and end time, I pulled the times out of the text, handled shifts that run past midnight, and kept any job I couldn't read in the results instead of hiding it. The real fix was upstream: a structured shift picker in the form. ==Building it myself is how I learned that.==" },
];

const agile: CaseBlock[] = [
  { t: "p", text: "We ran Scrum on Jira: user stories grouped by role, acceptance criteria on every ticket, and five columns from To Do to Done. As Scrum Master I ran our standups, 15 minutes three times a week, and RefugeeOne joined every sprint review. Whatever the client asked for in a review became a ticket for the next sprint." },
  { t: "img", src: "refugeeone/jira.png", caption: "Our Jira board: stories for every role, tracked from To Do to Done", w: 880 },
];

const milestones: CaseBlock = {
  t: "timeline", items: [
    { date: "Feb 2", title: "Kickoff with RefugeeOne", text: "Walked through the form, the spreadsheets and the map, and agreed on a responsive website instead of an app." },
    { date: "Feb 9", title: "Three logins, one gatekeeper", text: "Every role signs in, staff send the invitations, and contact details stay with staff." },
    { date: "Feb 20", title: "First commit", text: "Sign-in, roles and an automatic deploy pipeline, ready before the first feature." },
    { date: "March", title: "Midterm demo", text: "The first working flows for all three roles, demoed to the class." },
    { date: "Mar 28–30", title: "Client reviews", text: "Pay instead of Salary, real shift times, more icons, distance from home and a saved-jobs page." },
    { date: "Apr 19", title: "Polish day", text: "More than 20 pull requests merged in one day, from wording to mobile scrolling." },
    { date: "Late April", title: "Launch and handoff", text: "A live site, a handoff guide and a job description so RefugeeOne could hire someone to run it." },
  ],
};

const handoff: CaseBlock = {
  t: "p", text: "We handed off more than code: a guide to hosting, accounts, the database, backups and the free-tier limits, plus a web developer job description so RefugeeOne could hire someone to keep improving it.",
};

const hats: CaseBlock = {
  t: "cards", items: [
    { title: "Product designer", text: "Research synthesis, workflows for three roles, wireframes through high fidelity, and the style guide." },
    { title: "Frontend developer", text: "Search and filters, the shift-time logic, the onboarding screens and the mobile layout." },
    { title: "Scrum master", text: "Standups three times a week, the Jira board, and sprint planning with the team." },
    { title: "Demo lead", text: "Every demo, to the team, the class and RefugeeOne, and turning what the client said into tickets." },
  ],
};

const lessons: CaseBlock[] = [
  { t: "sub", text: "Solve the problem, not the brief" },
  { t: "p", text: "The biggest call we made was not building the app we were asked for. Looking at the whole workflow, not just the refugee's screen, is what let refugees search on their own and gave staff back the hours they had spent walking clients through listings one by one." },
  { t: "sub", text: "Walk through the data model with the client" },
  { t: "p", text: "RefugeeOne discovered what it needed as it saw each screen, and every change rippled through the UI, the database and the logic. Next time I'd walk through the data model and each role's workflow with the client before the first sprint, not just the mockups." },
  { t: "sub", text: "A design isn't done until it's built" },
  { t: "p", text: "Writing the filters showed me where my own form design was weak. A free-text shift field looked friendly in Figma and became a parser in code. Designing and building the same feature made me a better designer of both." },
];

const closing: CaseBlock[] = [
  { t: "h", text: "The whole loop" },
  { t: "p", text: "This was the first time I went all the way around the loop, from interviews to designs, code, sprints, a live launch and a handoff, with a hand in every part of it. ==It's still the project I'm proudest of from my time at Michigan.==" },
  { t: "p", text: "Built with Neha Kumari, Mike (Jiayao) Wu, Ken DeBacker, Yipeng Lin and Annie (Mingyu) Li." },
  { t: "links", items: [
    { text: "Source code on GitHub", href: "https://github.com/RefugeeOne699/refugee-one", primary: true },
    { text: "RefugeeOne", href: "https://www.refugeeone.org/" },
  ] },
];

// ---------- A · The classic arc: research → rethink → design → build → impact ----------

const a: CaseStudy = {
  ...meta,
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Background" },
      ...hook,
      { t: "p", text: team },
      problem,
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
    { id: "rethink", label: "The Brief", blocks: [
      { t: "p", text: "RefugeeOne asked for a multilingual smartphone app for refugees. Mapping everyone who touches a job listing changed the shape of the product." },
      brief,
      ...briefWhy,
      { t: "h", text: "One job, three sides" },
      journey,
    ] },
    { id: "design", label: "Design", blocks: [
      { t: "h", text: "Workflows first" },
      ...workflows,
      { t: "h", text: "What the client changed" },
      { t: "p", text: "RefugeeOne reviewed the designs and the build at the end of every sprint. Their notes were small and specific, and they shaped the product:" },
      clientChanges,
    ] },
    { id: "product", label: "The Product", blocks: [
      { t: "p", text: "Screens are from the shipped app, shown with sample data." },
      { t: "h", text: "For refugees" },
      ...screensRefugee,
      { t: "h", text: "For employers" },
      ...screensEmployer,
      { t: "h", text: "For RefugeeOne" },
      ...screensStaff,
      demo,
    ] },
    { id: "build", label: "How We Built It", blocks: [
      { t: "h", text: "The stack" },
      stack,
      ...myCode,
      { t: "h", text: "Agile, with the client in the room" },
      ...agile,
      milestones,
      handoff,
    ] },
    { id: "reflection", label: "Reflection", blocks: [
      { t: "h", text: "Many hats" },
      { t: "p", text: "On a team of six, I covered four roles at once:" },
      hats,
      { t: "h", text: "What I took away" },
      ...lessons,
      ...closing,
    ] },
  ],
};

// ---------- B · One job, three sides: the system first, then why and how ----------

const b: CaseStudy = {
  ...meta,
  hero: "refugeeone-2",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Background" },
      ...hook,
      { t: "p", text: team },
      { t: "h", text: "Results" },
      results,
      problem,
    ] },
    { id: "system", label: "One Job, Three Sides", blocks: [
      { t: "p", text: "The product is easiest to understand by following a single job from the employer who posts it to the refugee who finds it. Screens are from the shipped app, shown with sample data." },
      journey,
      { t: "h", text: "1 · The employer posts it" },
      ...screensEmployer.filter((x) => x.t !== "sub"),
      { t: "h", text: "2 · RefugeeOne reviews it" },
      ...screensStaff,
      { t: "h", text: "3 · A refugee finds it" },
      ...screensRefugee,
      demo,
    ] },
    { id: "why", label: "Why It Works This Way", blocks: [
      { t: "h", text: "What research told us" },
      ...researchIntro,
      findings,
      problemStatement,
      { t: "h", text: "Not the app we were asked for" },
      brief,
      ...briefWhy,
      { t: "h", text: "Shaped with the client" },
      ...workflows,
      { t: "p", text: "RefugeeOne reviewed the designs and the build at the end of every sprint. Their notes were small and specific, and they shaped the product:" },
      clientChanges,
    ] },
    { id: "shipping", label: "How We Shipped", blocks: [
      { t: "h", text: "Agile, with the client in the room" },
      ...agile,
      milestones,
      { t: "h", text: "The stack" },
      stack,
      ...myCode,
      { t: "h", text: "Handoff" },
      handoff,
    ] },
    { id: "reflection", label: "Reflection", blocks: [
      { t: "h", text: "Many hats" },
      hats,
      { t: "h", text: "What I took away" },
      ...lessons,
      ...closing,
    ] },
  ],
};

// ---------- C · Five decisions: the PM's view of the same project ----------

const c: CaseStudy = {
  ...meta,
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Background" },
      ...hook,
      { t: "p", text: team },
      problem,
      { t: "h", text: "Results" },
      results,
    ] },
    { id: "research", label: "The Problem", blocks: [
      ...researchIntro,
      findings,
      problemStatement,
    ] },
    { id: "decisions", label: "Five Decisions", blocks: [
      { t: "p", text: "Five calls shaped the product. Each one came from the research, and each was tested with RefugeeOne before it went into code." },
      { t: "item", title: "A website, not an app", src: "refugeeone/system.png", bare: true, text: "RefugeeOne asked for a smartphone app for refugees. But three kinds of people touch a job listing, and two of them work at computers. One responsive website gave each role its own workspace from a single codebase, with nothing to install and almost nothing to host.\n\nThe client agreed at the kickoff: a responsive website is fine." },
      { t: "item", title: "Make the deciding details required", src: "refugeeone/zoom-form.png", bare: true, text: "Job boards leave out exactly what refugees need. Our form doesn't let an employer post without a pay range, a shift, an English level and a real address.\n\nThat is what lets every job be filtered by pay, shift, English level and distance." },
      { t: "item", title: "Keep RefugeeOne in the loop", src: "refugeeone/zoom-reject.png", bare: true, text: "Staff create refugee accounts, approve each employer and review every job. An employer's edit sends a job back for review, and a rejection carries a note.\n\nApplication steps stay with staff too, because their relationships with employers' HR teams help refugees get hired." },
      { t: "item", title: "Filters built around a refugee's day", src: "refugeeone/client-filter.png", bare: true, text: "Pay floor, English level, 22 languages, a shift window and miles from home. These were the questions staff asked in every one-on-one, turned into controls a refugee can set on their own.\n\nI designed and built this part, from the panel to the logic behind it." },
      { t: "item", title: "Icons and plain words over translation", src: "refugeeone/client-cards.png", bare: true, text: "Instead of translating the product ourselves, we put an icon on every field, kept every label short and plain, and showed staff how the browser translates the whole site into Kinyarwanda, Arabic or Ukrainian." },
      demo,
    ] },
    { id: "shipping", label: "Shipping It", blocks: [
      { t: "h", text: "Agile, with the client in the room" },
      ...agile,
      milestones,
      { t: "h", text: "What changed in review" },
      clientChanges,
      { t: "h", text: "The stack" },
      stack,
      ...myCode,
      handoff,
    ] },
    { id: "reflection", label: "Reflection", blocks: [
      { t: "h", text: "Many hats" },
      hats,
      { t: "h", text: "What I took away" },
      ...lessons,
      ...closing,
    ] },
  ],
};

const VARIANTS = { a, b, c };
const pick = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("rv");
export const refugeeone: CaseStudy = VARIANTS[pick as keyof typeof VARIANTS] ?? a;
