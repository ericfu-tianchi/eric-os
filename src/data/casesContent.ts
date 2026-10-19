import type { CaseStudy } from "./cases";

/** Case studies migrated verbatim from tianchi-fu.com (work cases not yet split into src/data/cases/). */
export const EXTRA: Record<string, CaseStudy> = {
  jyi: {
    accent: "#326ef6",
    sub: "Product & UX for an AI-interview / ATS SaaS in Shanghai.",
    role: "Product Manager & UX Designer",
    timeline: "Jan 2021 – Apr 2021",
    tools: "Axure · Figma · SQL",
    sections: [
      { id: "overview", label: "Overview", blocks: [
        { t: "h", text: "Quick Background" },
        { t: "p", text: "In winter 2021, I interned at Jinyu Intelligence Technology Co. in Shanghai — a SaaS company providing ATS and AI-interview services for businesses. I designed 7 features in total and oversaw the development of 2 from inception to implementation." },
        { t: "h", text: "Some of my work" },
        { t: "p", text: "Improved the onboarding experience of AI interviews, resulting in a 20% increase in student satisfaction." },
        { t: "p", text: "Launched the interview-appointment feature to help hiring managers organize interviews more easily, gaining 30+ paid companies in the first two months." },
        { t: "p", text: "Created target-customer personas by performing data analysis (company info + product-feature usage) with SQL." },
        { t: "p", text: "Updated the product's user manual and led online training sessions on product functions for 10+ sales staff." },
        { t: "stat", value: "+20%", label: "student satisfaction after onboarding redesign" },
        { t: "stat", value: "30+", label: "paid companies in the first two months" },
      ] },
    ],
  },
};
