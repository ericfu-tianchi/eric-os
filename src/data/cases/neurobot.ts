import type { CaseBlock, CaseStudy } from "../cases";

/**
 * Neurobot (UMSI Design Clinic × Backyard Brains, winter 2022). Sources: the team's Drive (kickoff and client
 * notes, the teacher interview, test scripts, both rounds' scoring sheets, the heuristic evaluation, workshop
 * photos, prototype recordings, the expo deck), the 2022 NeuroRobot code on GitHub, and SpikerBot as shipped
 * in 2026 (recorded from its web app, October 2026).
 */

const meta = {
  accent: "#ff9d1f",
  sub: "A brain-building app for a robot that teaches neuroscience.",
  role: "UX Designer\nUsability Researcher",
  timeline: "Jan – Apr 2022",
  tools: "Figma · Miro\nMATLAB",
};

// ---------- shared pieces ----------

const intro: CaseBlock[] = [
  { t: "p", text: "[Backyard Brains](https://backyardbrains.com) makes neuroscience kits for students. Its **Neurorobot** is a small rover with cameras, a speaker and wheels, and no code inside: students give it a brain by wiring virtual neurons in an app, then watch it chase a red cup or back away from a wall." },
  { t: "p", text: "That app ran in MATLAB, built by the engineers who built the robot. In winter 2022, five of us from the University of Michigan (Milly Dai, Bahar Shahmammadova, Emma West, Fan Xu and I) took on its redesign through UMSI's Design Clinic." },
];

const problem: CaseBlock = {
  t: "callout", label: "The problem",
  text: "Students spent the lesson learning the interface, not the brain. One teacher needed a full 55-minute class just to walk students through the first lab, and groups that got it wrong early gave up.",
};

const whatWeDid: CaseBlock = {
  t: "p", text: "We measured the old app with students, rebuilt it as ==a canvas where you point at any part of the brain and change it==, like a Miro board, and tested the new design on the same tasks. The canvas was too open-ended to prototype, so we ran that test Wizard of Oz style, building each student's next screen live as they spoke.",
};

const beforeAfter: CaseBlock = {
  t: "compare",
  before: { src: "neurobot/07.png", label: "The MATLAB app: every neuron looks the same" },
  after: { src: "neurobot/proto-build-still.webp", label: "Our redesign: one toolbar, arrows on every connection" },
};

const results: CaseBlock = {
  t: "stats",
  items: [
    { value: "5.6 → 6.4", label: "average ease score across 25 tasks, out of 7" },
    { value: "2.2 → 5.0", label: "the hardest task: changing a connection's strength" },
    { value: "#1", label: "Best Project, 2022 UMSI Student Project Exposition" },
    { value: "2026", label: "Backyard Brains ships SpikerBot on the same ideas" },
  ],
  note: "Ease scores are the Single Ease Question (1 = very difficult, 7 = very easy), asked after every task: five students on the old app, then the same tasks on our prototype.",
};

const spikerbotIntro: CaseBlock = {
  t: "p", text: "In 2026 Backyard Brains launched **SpikerBot**, the Neurorobot's successor, with a free app for the web, Windows, Mac, iPhone, iPad, Android and Chromebook. It looks nothing like our grayscale prototype. It works the way we argued it should: drag neurons onto a brain, pull an arrow to connect them, tune a neuron right beside it, start from a library of example brains, then press Play.",
};

const spikerbotGif: CaseBlock = {
  t: "img", src: "neurobot/spikerbot-build.webp", w: 880,
  caption: "SpikerBot's web app, recorded in October 2026: drag in a neuron, select it, pull an arrow to the next one and on to a wheel",
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
  { t: "p", text: "Next we tested the old app with five University of Michigan students from non-STEM majors, standing in for high schoolers. The tasks came straight from the curriculum's first two labs: wire one highly active neuron to four quiet ones and find the weakest connection that makes them fire, then make the robot chase a red object, back away when it gets too close, and beep while it does. Students thought aloud and rated every task from 1 to 7." },
  { t: "p", text: "We scored each problem by **criticality × impact × frequency**, and ran a heuristic evaluation against Nielsen's ten principles alongside it: 43 usability problems, ranked." },
  { t: "links", items: [
    { text: "Test script", href: "https://docs.google.com/document/d/1OfInRc5aOTu1itdyAQXb96eSmhNhu0IL5P7XVCrXchE/edit?usp=sharing" },
    { text: "Scoring sheet", href: "https://docs.google.com/spreadsheets/d/1MZRLX3JZAVq5ntOn1JgLvpdQ60CPk12m4TxH-xNmpTE/edit?usp=sharing" },
  ] },
];

const findings: CaseBlock = {
  t: "cards", items: [
    { title: "Mistakes were expensive", text: "One stray click in the brain added a neuron, and it happened to all five students. Changing a connection's strength meant drawing it again; deleting one meant setting its strength to 0. There was no undo." },
    { title: "Everything lived in memory", text: "Every type of neuron looked the same, so ==all five lost track of which neuron was which==. Connections had no arrows, and four couldn't tell which way a signal flowed." },
    { title: "Buttons named after the code", text: "\"Add many neurons\" loaded a whole other brain, and four of five tried it. \"Edit its properties\" edited the neuron, not the connection. \"Stop\" quietly closed the brain." },
  ],
};

const question: CaseBlock = {
  t: "quote", derived: true, label: "So the question became",
  text: "How might students think about what the robot should do before which neuron to click, and try ideas without paying for every mistake?",
};

// ---------- brainstorm ----------

const workshop: CaseBlock[] = [
  { t: "p", text: "We ran a brainstorming workshop with Backyard Brains' CEO and the engineer who built the app. With Google's and IDEO's methods and rounds of Crazy 8s, the room produced ==more than 100 ideas==, then dot-voted for the ones to pursue." },
  { t: "row", items: [{ src: "neurobot/workshop-room.webp", w: 500 }, { src: "neurobot/workshop-wall.webp", w: 374 }], caption: "The workshop: one wall per question, sketches on sticky notes, votes on top" },
  { t: "p", text: "Some ideas went straight into the design: a library of example brains, filters for groups of neurons, a separate play mode. Others ran ahead of our prototype, like an AI assistant on the side, or ==hovering a behavior to see, step by step, which neurons make it happen==." },
  { t: "p", text: "We then split into two groups for parallel low-fi designs, critiqued each other's, and merged the strongest parts into one." },
  { t: "img", src: "neurobot/15.png", w: 939, caption: "Low-fi screens from the two parallel designs" },
];

// ---------- the redesign ----------

const redesign: CaseBlock[] = [
  { t: "p", text: "One idea holds the design together: **point at it, change it.** The brain is a canvas. Tools live in one toolbar, and whatever you click opens its settings right where it is." },
  { t: "sub", text: "Build a brain on a canvas" },
  { t: "p", text: "Pick the neuron tool and click to place one. Draw from an eye to a neuron and choose the color it should see; draw to a wheel and drag the strength. Every connection is an arrow, and undo is one click away." },
  { t: "img", src: "neurobot/proto-build.webp", w: 1040, caption: "Scenario two from the test, built in the redesign: each eye crosses to the opposite wheel at strength 15" },
  { t: "sub", text: "Start from a working brain" },
  { t: "p", text: "A brain library replaces the dropdown of cryptic names: templates for each lab next to your own brains, each with a preview, and a name and description for every new one." },
  { t: "img", src: "neurobot/proto-library.webp", w: 880 },
  { t: "sub", text: "Find any neuron, change many at once" },
  { t: "p", text: "A layers panel lists every neuron. Filter it by circuit or by type, select several, and edit them together." },
  { t: "img", src: "neurobot/proto-filter.webp", w: 1040, caption: "Filtering by circuit fades everything else" },
  { t: "sub", text: "Play shows only what the lesson needs" },
  { t: "p", text: "Play mode puts the robot's two camera views beside the brain, with just the charts the lesson asks about and the dopamine button for the reward lab." },
  { t: "img", src: "neurobot/proto-play.webp", w: 1040 },
];

// ---------- wizard of oz ----------

const oz: CaseBlock[] = [
  { t: "p", text: "Our canvas was too open for a clickable Figma prototype: every student builds a different brain, in a different order. So instead of wiring every possible path, ==we became the computer==." },
  { t: "flow", items: [
    { who: "Student", title: "Says what they'd do", text: "\"I'd pick the neuron tool and click on the left side.\" They see the prototype on a shared screen." },
    { who: "Moderator", title: "Keeps it on script", text: "Reads the same tasks as the benchmark and keeps the student thinking aloud." },
    { who: "Wizards", title: "Build the next screen live", text: "Drop the matching neuron, arrow or menu into place from a ready-made component library, in seconds." },
    { who: "Student", title: "Sees it, keeps going", text: "And rates every task on the same 1 to 7 scale as before." },
  ] },
  { t: "p", text: "I proposed the method, and a teammate and I built the component library behind it: every neuron, connection, menu and state, ready to drag in. It only works when the wizards are fast enough that the student forgets anyone is there. On April 2 we ran it with four students over Zoom." },
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
  { t: "p", text: "We never saw SpikerBot's design process, and good teams often reach the same answers. Still, the problems we measured in 2022 are the ones it solves: arrows on every connection, settings next to whatever you click, and a library to start from instead of a blank brain." },
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
