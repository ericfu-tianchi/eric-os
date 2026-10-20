import type { CaseStudy } from "../cases";

/** Built from the team's Notion write-up (SI 699 capstone) plus the outcome numbers on Eric's resume. */
export const refugeeone: CaseStudy = {
  accent: "#f36c12", // RefugeeOne's own brand orange, the primary color in the product's style guide
  sub: "A three-sided hiring platform for refugees, employers and the RefugeeOne team.",
  role: "Product Owner & Frontend Developer",
  timeline: "Jan 2023 – May 2023",
  tools: "Figma · Jira · React (Vite) · Tailwind + daisyUI · Firebase",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Quick Background" },
      { t: "p", text: "[RefugeeOne](https://www.refugeeone.org/) is a non-profit resettlement agency in Chicago. Its mission is to help refugees fleeing war, terror and persecution build new lives of safety, dignity and self-reliance, and a steady job is where that starts." },
      { t: "p", text: "For our User-Centered Agile Development capstone at the University of Michigan, I led a ==7-person team as Product Owner== and worked on the frontend. In 4 sprints we took RefugeeOne's job screening from a spreadsheet to a live platform." },
      { t: "callout", label: "Problem", text: "Job listings arrived through a Google Form and piled up in a Google Sheet. Refugees couldn't search or filter it, employers held back pay and shift details, and the RefugeeOne team had to ==walk every refugee through openings one by one==." },
      { t: "h", text: "Results" },
      { t: "stat", value: "600+", label: "job listings hosted within the first year" },
      { t: "stat", value: "75+", label: "employers posting directly on the platform" },
      { t: "stat", value: "80%", label: "higher job-matching efficiency for the RefugeeOne team" },
    ] },
    { id: "research", label: "Research", blocks: [
      { t: "p", text: "We interviewed the RefugeeOne team and reviewed a UX consulting report done with them the year before. Three findings shaped everything after:" },
      { t: "list", items: [
        "Refugees care most about ==work location, language requirements, pay and shift schedule==, and mainstream job sites often leave exactly these out.",
        "Refugees had little autonomy in their search and depended on the RefugeeOne team for every step, yet that ==independence matters for their future success==.",
        "The shared spreadsheet was hard for everyone: ==no way to search or filter== for refugees, and a heavy manual load for staff.",
      ] },
      { t: "quote", text: "Refugees need to find job opportunities in their area in an ==interactive, accessible way==, with the details that decide whether a job can work for them." },
      { t: "sub", text: "From a mobile app to a three-sided website" },
      { t: "p", text: "RefugeeOne first asked for a mobile app, since most refugees use a phone rather than a laptop. Once we mapped the whole workflow, it was clear the problem had three sides: refugees looking for work, employers posting it, and staff in between." },
      { t: "img", src: "refugeeone/initial-ask.webp", caption: "The original request: an app for refugees", w: 420 },
      { t: "p", text: "So we built one ==responsive website with a tailored space for each user==. It works on any phone, while employers and staff get the full desktop tools they need." },
      { t: "img", src: "refugeeone/three-users.webp", caption: "Three users, one platform: refugees, employers and the RefugeeOne team", w: 880 },
    ] },
    { id: "product", label: "The Product", blocks: [
      { t: "feature", src: "refugeeone/feature-1.webp", title: "For refugees · Filters that matter", text: "Filter listings by pay, English level, shift time and distance, the criteria refugees told us they care about most." },
      { t: "feature", src: "refugeeone/feature-2.webp", title: "For refugees · Know the commute", text: "Distance from home is calculated automatically, and the job location opens in Google Maps in one tap." },
      { t: "feature", src: "refugeeone/feature-3.webp", title: "For employers · Post and track", text: "Employers post jobs with every required field, then follow each listing's review status and edit it when needed." },
      { t: "feature", src: "refugeeone/feature-4.webp", title: "For RefugeeOne · One dashboard", text: "Staff approve, edit or reject postings and manage accounts for all three user types in one place, instead of a spreadsheet." },
      { t: "embed", kind: "youtube", src: "https://www.youtube-nocookie.com/embed/YzZrsk8REAc?rel=0", caption: "Product demo" },
    ] },
    { id: "process", label: "How We Built It", blocks: [
      { t: "p", text: "We ran the project as 4 Agile sprints on a Jira board, with standups three times a week and a sprint review with RefugeeOne at the end of each one." },
      { t: "step", title: "Scope with the client", text: "Met RefugeeOne to agree on goals, users and what “done” meant for the semester." },
      { t: "step", title: "UX research", text: "Interviews with the RefugeeOne team plus last year's consulting report, distilled into the three findings above." },
      { t: "step", title: "Design and iterate", text: "Low-fi wireframes for each user type, then a style guide built on RefugeeOne's brand and high-fi prototypes, revised after every client review." },
      { t: "step", title: "Build", text: "React on Vite with Tailwind and daisyUI for speed, Firebase Firestore and Hosting for a serverless backend, GitHub Actions for deploys." },
      { t: "step", title: "Review every sprint", text: "We demoed new user stories to the client before closing them; new requests became new tickets, and unfinished ones rolled into the next sprint." },
      { t: "step", title: "Hand off", text: "A handoff guide covering the codebase, hosting, authentication and the database, plus a job description to help RefugeeOne hire someone to maintain it." },
      { t: "img", src: "refugeeone/jira.webp", caption: "The Jira board for one sprint", w: 720 },
    ] },
    { id: "reflection", label: "Reflection", blocks: [
      { t: "p", text: "The biggest call was saying no to the app we were asked for. Seeing the problem from all three sides gave refugees more control over their own search, and gave the RefugeeOne team back the hours they had spent walking each person through listings one by one." },
      { t: "p", text: "Want the full detail? The team's write-up covers the wireframes, style guide and every sprint, and the [live site](https://refugee-one-368a9.web.app/signIn) is still up." },
      { t: "link", text: "Full project notes on Notion", href: "https://silver-glove-b38.notion.site/Refugee-One-Job-Search-Application-0957119955b7439486c2271b35b0a114" },
    ] },
  ],
};
