import type { CaseBlock, CaseStudy } from "../cases";

/**
 * Neurobot (UMSI Design Clinic × Backyard Brains, winter 2022). Sources: the team's Drive (kickoff and client
 * notes, the teacher interview, test scripts, both rounds' scoring sheets, the heuristic evaluation, workshop
 * photos, prototype recordings, the expo deck), the 2022 NeuroRobot code on GitHub, and SpikerBot as shipped
 * in 2026 (recorded from its web app, October 2026).
 */

const meta = {
  accent: "#1A8CF0", // SpikerBot's canvas blue, one step deeper so labels read on white
  sub: "A brain-building app for a robot that teaches neuroscience.",
  role: "UX Designer\nUsability Researcher",
  timeline: "Jan – Apr 2022",
  tools: "Figma · Miro\nMATLAB",
};

// ---------- shared pieces ----------

const intro: CaseBlock[] = [
  { t: "p", text: "[Backyard Brains](https://backyardbrains.com) makes hands-on neuroscience kits for classrooms. Its [Neurorobot](https://backyardbrains.com/products/spikerbot) pairs a palm-sized robot, with cameras for eyes, a microphone, a speaker and wheels, with an app where students build the robot's brain out of virtual neurons." },
  { t: "p", text: "Wire its eyes to its wheels and it chases anything red. Add a distance sensor and it backs away before it bumps into you. Reward it with dopamine and it picks up a habit. Each lab teaches one idea about how real brains work, and high schoolers were the first students." },
  { t: "p", text: "In winter 2022, five of us from UMSI (Milly Dai, Bahar Shahmammadova, Emma West, Fan Xu and I) redesigned the app with Backyard Brains." },
];

const problem: CaseBlock = {
  t: "callout", label: "The problem",
  text: "The app was built by engineers, for engineers: every feature was there, but nothing guided a student through it. So students spent class learning the interface instead of the brain, and told us it was hard to use. One teacher had to give up a full 55-minute period just to get his class through the first lab, before anyone built a brain.",
};

const whatWeDid: CaseBlock = {
  t: "p", text: "We tested the old app with students to find exactly where they got stuck, then rebuilt it around one idea: **point at it, change it.** Place a neuron, draw an arrow to wire it, click anything to tune it. Then we tested the redesign on the same tasks, ==building each screen live, Wizard of Oz style==.",
};

const beforeAfter: CaseBlock = {
  t: "compare",
  before: { src: "neurobot/07.png", label: "The MATLAB app: every neuron looks the same" },
  after: { src: "neurobot/proto-build-still.webp", label: "Our redesign: one toolbar, arrows on every connection" },
};

const results: CaseBlock = {
  t: "stats",
  items: [
    { value: "5.6 → 6.4", label: "average task ease, out of 7" },
    { value: "~60%", label: "fewer steps to build a lab's brain" },
    { value: "#1", label: "Best Project, [2022 UMSI Student Project Exposition](https://www.si.umich.edu/about-umsi/news/2022-umsi-student-project-exposition-award-recipients-announced)" },
    { value: "2026", label: "SpikerBot ships, built on our redesign" },
  ],
};

const spikerbotIntro: CaseBlock = {
  t: "p", text: "In 2026, Backyard Brains launched **SpikerBot**, the Neurorobot's successor, free on the web, Windows, Mac, iPhone, iPad, Android and Chromebook. ==It has a fresh, hand-drawn look, and underneath it carries what we found and fixed in 2022==: point at any part of the brain and change it right there, arrows that show where every signal goes, a library of example brains to start from, and a separate mode to run the brain.",
};

const spikerbotGif: CaseBlock = {
  t: "img", src: "neurobot/spikerbot-build.webp", w: 880,
  caption: "SpikerBot's web app, recorded in October 2026: add a neuron, wire the eye to it and choose what it looks for, then wire it to a wheel and the speaker and pick a note",
};

const spikerbotLinks: CaseBlock = { t: "links", items: [
  { text: "Try SpikerBot", href: "https://backyardbrains.com/app/spikerbot", primary: true },
  { text: "SpikerBot on Kickstarter", href: "https://www.kickstarter.com/projects/backyardbrains/spikerbot-build-a-brain-create-a-creature" },
] };

// ---------- research ----------

const teacher: CaseBlock[] = [
  { t: "p", text: "We started with Bill, a high school teacher who had piloted the robot in his classroom. He needed ==a full 55-minute period== to demo the robot and explain the app before anyone could design a brain. When the robot didn't do what a group expected on the first try, the group checked out; some groups explored freely, others were afraid to touch anything." },
  { t: "p", text: "Bill also holds a PhD in neuroscience and helped write the curriculum. If he needed a whole class, a typical teacher would need more." },
];

const benchmark: CaseBlock[] = [
  { t: "p", text: "Next we tested the old app with five University of Michigan students from non-STEM majors, standing in for high schoolers. The tasks came straight from the curriculum's first two labs. Students thought aloud and rated every task from 1 to 7." },
  { t: "gallery", cols: 2, items: [
    { src: "neurobot/lab-1.webp", caption: "Lab 1: wire one active neuron to four quiet ones, and find the weakest connection that makes them fire" },
    { src: "neurobot/lab-2.webp", caption: "Lab 2: make the robot chase a red ball, back away when it gets too close, and beep while it does" },
  ] },
  { t: "p", text: "Then we ranked every problem we saw by how much it hurt:" },
  { t: "formula", result: { name: "Severity" }, terms: [
    { name: "Criticality", note: "how essential the task is, 1–4" },
    { name: "Impact", note: "how badly it breaks, 1–5" },
    { name: "Frequency", note: "share of students hit" },
  ] },
  { t: "table", head: ["Problem", "Criticality", "Impact", "Frequency", "Severity"], num: 1, rows: [
    ["Can't tell active neurons from quiet ones", "4", "4", "5 of 5", "16"],
    ["Can't see which way a signal flows", "4", "5", "4 of 5", "16"],
    ["Must redraw a connection to change its strength", "3", "5", "5 of 5", "15"],
    ["A stray click adds a neuron", "4", "3", "5 of 5", "12"],
  ], more: "… 39 more" },
  { t: "p", text: "A heuristic evaluation against Nielsen's ten principles ran alongside it. Together: 43 usability problems, ranked." },
  { t: "links", items: [
    { text: "Test script", href: "https://docs.google.com/document/d/1OfInRc5aOTu1itdyAQXb96eSmhNhu0IL5P7XVCrXchE/edit?usp=sharing" },
    { text: "Scoring sheet", href: "https://docs.google.com/spreadsheets/d/1MZRLX3JZAVq5ntOn1JgLvpdQ60CPk12m4TxH-xNmpTE/edit?usp=sharing" },
  ] },
];

const findings: CaseBlock = {
  t: "cards", items: [
    { title: "Mistakes cost the lesson", text: "One stray click dropped a new neuron into the brain. Changing a connection meant drawing it again; deleting one meant setting it to 0. With no undo, ==every slip had to be rebuilt by hand==." },
    { title: "Memory did all the work", text: "Every neuron looked the same and connections had no arrows, so students had to remember which was which and where signals went. ==Most lost track and rewired from scratch==." },
    { title: "Labels spoke engineer", text: "\"Add many neurons\" replaced the whole brain. \"Edit its properties\" edited the neuron, not the connection. \"Stop\" closed the brain without a word. ==The labels led students straight into mistakes==." },
  ],
};

const question: CaseBlock = {
  t: "quote", derived: true, label: "So the question became",
  text: "How might we make building a brain so direct that students think about behaviors, not buttons, and try ideas without paying for every mistake?",
};

// ---------- brainstorm ----------

const workshop: CaseBlock[] = [
  { t: "p", text: "We ran a brainstorming workshop with Backyard Brains' CEO and the engineer who built the app. With Google's and IDEO's methods and rounds of Crazy 8s, the room produced ==more than 100 ideas==, then dot-voted for the ones to pursue." },
  { t: "row", items: [{ src: "neurobot/workshop-room.webp", w: 500 }, { src: "neurobot/workshop-wall.webp", w: 374 }], caption: "The workshop: one wall per question, sketches on sticky notes, votes on top" },
  { t: "p", text: "Some ideas went straight into the design: a library of example brains, filters for groups of neurons, a separate play mode. Others ran ahead of our prototype, like an AI assistant on the side, or hovering a behavior to see, step by step, which neurons make it happen." },
  { t: "p", text: "That last one looked out of reach in 2022, so we kept it as a far-reach goal. ==In 2026, SpikerBot shipped it==: annotations that take a brain apart and walk through it one step at a time." },
  { t: "p", text: "We then split into two groups for parallel low-fi designs, critiqued each other's, and merged the strongest parts into one flow: connect the robot, build a brain, play it." },
  { t: "img", src: "neurobot/15.png", w: 939, caption: "The merged low-fi flow: connect the robot, build a brain, play it" },
];

// ---------- the redesign ----------

const redesignLead: CaseBlock = { t: "p", text: "One idea holds the design together: **point at it, change it.** The brain is a canvas. Tools live in one toolbar, and whatever you click opens its settings right where it is." };

const redesignParts = [
  { src: "neurobot/proto-build.webp", title: "Build a brain on a canvas", text: "Pick the neuron tool and click to place one. Draw from an eye to a neuron and choose the color it should see; draw to a wheel and drag the strength. Every connection is an arrow, and undo is one click away." },
  { src: "neurobot/proto-library.webp", title: "Start from a working brain", text: "A brain library replaces the dropdown of cryptic names: templates for each lab next to your own brains, each with a preview, and a name and description for every new one." },
  { src: "neurobot/proto-filter.webp", title: "Find any neuron, change many at once", text: "A layers panel lists every neuron. Filter it by circuit or by type, select several, and edit them together." },
  { src: "neurobot/proto-play.webp", title: "Play is its own mode", text: "Building and running are kept apart. Press Play and the brain takes over the robot: its two camera views sit beside the brain, with just the charts the lesson asks about and the dopamine button for the reward lab." },
];

// alternating rows, like RefugeeOne (the 2×2 alternative: { t: "cards", cols: 2, items: redesignParts })
const redesign: CaseBlock[] = [redesignLead, ...redesignParts.map((x): CaseBlock => ({ t: "feature", ...x }))];

// ---------- wizard of oz ----------

const oz: CaseBlock[] = [
  { t: "p", text: "Our canvas was too open for a clickable Figma prototype: every student builds a different brain, in a different order. So instead of wiring every possible path, ==we became the computer==." },
  { t: "flow", items: [
    { who: "Moderator", title: "Reads the task", text: "Reads each task from the benchmark script, word for word, and nothing more." },
    { who: "Student", title: "Thinks aloud", text: "\"I'd pick the neuron tool and click on the left side of the brain.\"" },
    { who: "Wizards", title: "Build it live", text: "Drag the matching neuron, arrow or menu in from our library." },
    { who: "Student", title: "Rates it", text: "Sees the new screen, carries on, and rates the task 1 to 7." },
  ] },
  { t: "p", text: "I proposed the method and led it. ==Milly and I built the component library behind it==: every neuron, connection, menu and state, ready to drag in. It only works if the wizards are fast enough that the student forgets anyone is there, so I ran our rehearsals, and the two of us practiced every task until each new screen took seconds. On April 2 we ran it with four students over Zoom." },
  { t: "img", src: "neurobot/oz-session.webp", w: 1040, caption: "One real session, sped up: everything on this screen was placed by hand, live, as the student described it" },
];

// ---------- results ----------

const scores: CaseBlock = {
  t: "scores", scale: [1, 7], legend: ["Old MATLAB app, 5 students", "Our prototype, 3 students"],
  items: [
    { label: "Change a connection's strength", before: 2.2, after: 5.0 },
    { label: "Connect the eyes to neurons", before: 4.0, after: 6.7 },
    { label: "Delete a connection", before: 4.0, after: 7.0 },
    { label: "Add four quiet neurons", before: 3.2, after: 5.0 },
    { label: "Connect neurons to the wheels", before: 4.2, after: 5.7 },
    { label: "Run the brain and watch it", before: 4.8, after: 7.0 },
    { label: "Add the first neuron", before: 4.8, after: 2.7 },
    { label: "Make a new brain", before: 7.0, after: 4.7 },
  ],
  note: "Single Ease Question per task, 1 = very difficult, 7 = very easy. Four students tested the prototype; three scored these tasks.",
};

const outcome: CaseBlock[] = [
  { t: "p", text: "Across all 25 tasks, the average ease score rose from **5.6 to 6.4**, and the biggest gains landed where the benchmark hurt most." },
  scores,
  { t: "p", text: "Problems with a severity above 5 fell from **14 to 6**, and five of the six had a one-line fix: a missing label, a menu without a title, a hover hint that never fired in Figma." },
  { t: "sub", text: "Two steps got harder" },
  { t: "p", text: "Adding the first neuron fell to 2.7: students didn't know to pick the neuron tool first, and the hover hint meant to tell them didn't fire in our prototype. Making a new brain fell to 4.7, because design mode had no way back home. Both went on the fix list we handed over." },
  { t: "sub", text: "Handoff and recognition" },
  { t: "p", text: "We gave Backyard Brains everything they needed to keep testing without us: the script, the note-taking template, the scoring sheet, the heuristic evaluation and the prototype. The project won **Best Project** at the [2022 UMSI Student Project Exposition](https://si.umich.edu/about-umsi/news/2022-umsi-student-project-exposition-award-recipients-announced), out of more than 60 projects." },
];

// ---------- four years later ----------

const tags: [string, string] = ["2022 · Our prototype", "2026 · SpikerBot"];

const later: CaseBlock[] = [
  { t: "p", text: "SpikerBot's app is free on every screen, and the robot it drives was funded on Kickstarter in under an hour: $38,933 from 122 backers, against a $5,500 goal. The MATLAB install is gone." },
  { t: "stack", items: [
    { logo: "apple", name: "Apple", role: "Mac, iPhone and iPad" },
    { logo: "windows11", name: "Windows", role: "PCs and tablets" },
    { logo: "android", name: "Android", role: "Phones, tablets, Chromebooks" },
    { logo: "chrome", name: "Web", role: "Any laptop browser" },
  ] },
  { t: "p", text: "Its look is new: hand-drawn, playful, bright blue. ==Its bones are the ones we proposed in 2022.==" },
  { t: "compare", tags, before: { src: "neurobot/proto-library-still.webp", label: "A brain library with previews and templates" }, after: { src: "neurobot/spikerbot-library.webp", label: "Example Brains next to My Brains, sorted by complexity" } },
  { t: "compare", tags, before: { src: "neurobot/proto-build-still.webp", label: "Click a connection, edit it where it is" }, after: { src: "neurobot/spikerbot-tune.webp", label: "Select a neuron, tune it beside it, in plain words" } },
  { t: "compare", tags, before: { src: "neurobot/proto-play-still.webp", label: "Play mode: cameras and just the charts you need" }, after: { src: "neurobot/spikerbot-play.webp", label: "Play mode: the camera and the neurons you pin" } },
  { t: "compare", tags, before: { src: "neurobot/brainstorm-steps.webp", label: "Our workshop: hover a behavior to see its steps" }, after: { src: "neurobot/spikerbot-annotations.webp", label: "Annotations walk a brain step by step, lighting up each part" } },
  { t: "p", text: "The problems we measured in 2022 are the ones it solves: arrows on every connection, settings next to whatever you click, and a library to start from instead of a blank brain." },
];

// ---------- reflection ----------

const lessons: CaseBlock[] = [
  { t: "sub", text: "The most fun test I've run" },
  { t: "p", text: "Wizard of Oz is still my favorite usability test. A clickable prototype couldn't carry the design, so we changed the method instead of shrinking the design. ==When the usual tool doesn't fit, find an unusual one==, then do the prep that makes it look effortless." },
  { t: "sub", text: "Bring the client into the room" },
  { t: "p", text: "We invited Backyard Brains' CEO and the engineer behind the app to brainstorm with us. Ideas they helped draw were ideas they wanted to build, and that sense of ownership did more for the project's impact than any slide." },
  { t: "sub", text: "A prototype is part of the test" },
  { t: "p", text: "One of the two steps that got harder came down to a hover hint that didn't fire in Figma. Next time I'd list the details a prototype has to carry before the first session, not after the last." },
  { t: "sub", text: "A team that became friends" },
  { t: "p", text: "Most weeks the five of us worked out of one teammate's home, arguing about neurons and axons until late. We became good friends along the way, and ==it's one of my happiest stretches at Michigan==." },
];

// ---------- overview → research → brainstorm → redesign → wizard of oz → results → four years later → reflection ----------

export const neurobot: CaseStudy = {
  ...meta,
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Background" },
      ...intro,
      problem,
      { t: "h", text: "What we did" },
      whatWeDid,
      beforeAfter,
      { t: "h", text: "Results" },
      results,
      { t: "h", text: "Four years later" },
      spikerbotIntro,
      spikerbotLinks,
      spikerbotGif,
    ] },
    { id: "research", label: "Research", blocks: [
      { t: "h", text: "A teacher's view" },
      ...teacher,
      { t: "h", text: "A benchmark test" },
      ...benchmark,
      { t: "h", text: "What we found" },
      findings,
      question,
    ] },
    { id: "brainstorm", label: "Brainstorm", blocks: [
      { t: "h", text: "The client in the room" },
      ...workshop,
    ] },
    { id: "design", label: "The Redesign", blocks: redesign },
    { id: "testing", label: "Wizard of Oz", blocks: [
      { t: "h", text: "Testing a canvas you can't prototype" },
      ...oz,
    ] },
    { id: "results", label: "Results", blocks: [
      { t: "h", text: "Same tasks, easier" },
      ...outcome,
    ] },
    { id: "later", label: "Four Years Later", blocks: [
      { t: "h", text: "SpikerBot, 2026" },
      ...later,
    ] },
    { id: "reflection", label: "Reflection", blocks: [
      { t: "h", text: "What I took away" },
      ...lessons,
    ] },
  ],
};
