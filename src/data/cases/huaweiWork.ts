import type { CaseStudy } from "../cases";

/**
 * Huawei, 2023–2026: the Work Overview page. One page, organised by the three layers of enterprise AI.
 * Screens are design files with mock data: top bars cropped, no customer names, no revenue.
 */
export const huaweiWork: CaseStudy = {
  accent: "#c60a26",
  sub: "Enterprise AI products, across all three layers of the stack.",
  role: "Product Manager\nProduct Designer",
  timeline: "Sep 2023 – Feb 2026",
  sections: [
    { id: "overview", label: "Overview", blocks: [
      { t: "h", text: "Background" },
      { t: "p", text: "For two and a half years at Huawei, I built AI products for enterprises. My role ==spanned Product Manager and Product Designer==: finding the problem, setting priorities, designing the product and seeing it ship." },
      { t: "p", text: "I had the chance to work on ==all three layers of enterprise AI==: from AI PaaS, where models are made, to AI orchestration, where they become assistants, to AI SaaS, where they reach people at work." },
      { t: "h", text: "Three layers of enterprise AI" },
      { t: "layers", items: [
        { term: "AI SaaS", name: "Do the Work", tag: "AI apps people use at work · Huawei Cloud", plate: "huawei-ai/plate1.png", icon: "saas", to: "work", products: [
          { name: "DataArts Insight", href: "https://www.huaweicloud.com/product/dataartsinsight.html" }, { name: "KooSearch", href: "https://www.huaweicloud.com/intl/en-us/product/css.html" },
        ] },
        { term: "AI Orchestration", name: "Build the App", tag: "Tools to build AI assistants · Inside Huawei", plate: "huawei-ai/plate2.png", icon: "orchestration", to: "build", products: [
          { name: "Prompt Engineering Platform" }, { name: "Assistant Maker" },
        ] },
        { term: "AI PaaS", name: "Make the Model", tag: "Data, training and evaluation · Huawei Cloud", plate: "huawei-ai/plate3.png", icon: "paas", to: "make", products: [
          { name: "ModelArts Studio", href: "https://www.huaweicloud.com/intl/en-us/product/pangu.html" },
        ] },
      ] },
    ] },

    { id: "make", label: "AI PaaS", sub: "Make the Model", icon: "paas", blocks: [
      { t: "p", text: "[ModelArts Studio](https://www.huaweicloud.com/intl/en-us/product/pangu.html) is where enterprises make large models their own: prepare the data, fine-tune, evaluate and deploy. I worked across all of it, and led data engineering and model evaluation." },
      { t: "img", src: "huawei-ai/modelarts-studio.png", w: 1040, frame: true, caption: "ModelArts Studio: where enterprises choose, fine-tune, evaluate and build on large models" },
      { t: "h", text: "What I worked on" },
      { t: "flow", items: [
        { who: "Owned", title: "Data Engineering", text: "Import, process, label and publish training data. 7 months, 5 releases." },
        { who: "Worked on", title: "Model Training", text: "Pre-training, fine-tuning and reinforcement learning, with the team." },
        { who: "Led the rebuild", title: "Model Evaluation", text: "From a sub-page to a full evaluation center, comparable and reusable." },
      ], also: { title: "Model Square & Playground", text: "Choosing and trying models, upgraded for the DeepSeek wave." } },

      { t: "h", text: "Data Engineering", nav: "Data Engineering" },
      { t: "sub", text: "Data Modules" },
      { t: "p", text: "Over ==5 releases and 15+ enterprise deliveries==, I improved every data module (import, processing, labeling, synthesis and publishing) and turned one-off setups into a 200+ operator library with reusable templates." },
      { t: "showcase", items: [
        { title: "Import", text: "Multi-modal data: text, images, video, audio and more.", shots: [{ src: "huawei-ai/de-import.png" }] },
        { title: "Process", text: "A cleaning pipeline built from a customizable library of operators.", shots: [{ src: "huawei-ai/de-process.png" }] },
        { title: "Label", text: "Human or AI labeling across modalities.", shots: [{ src: "huawei-ai/de-label-text.png", label: "Text" }, { src: "huawei-ai/de-label-image.png", label: "Image" }] },
      ] },
      { t: "sub", text: "Data Workflow" },
      { t: "p", text: "Each module worked well on its own, but they were isolated: every project started from zero, with data carried between them by hand. After 20+ customer interviews, I connected them into one human-in-the-loop workflow and ==set the 2.0 roadmap==." },
      { t: "img", src: "huawei-ai/wf-demo.mp4", w: 880, device: true, caption: "The 2.0 design behind the roadmap, tested with users: one run from start to finish, pausing at evaluation until a person approves." },

      { t: "h", text: "Model Training", nav: "Model Training" },
      { t: "p", text: "I worked with the team on model training, across pre-training, fine-tuning and reinforcement learning, turning each job's dense configuration into a simple, guided setup. Seeing what training needs shaped how I designed the data going in and the evaluation coming out." },
      { t: "img", src: "huawei-ai/model-training.png", w: 880, frame: true, caption: "Fine-tune a model or bring your own training job. Adapted from Huawei Cloud's product page" },

      { t: "h", text: "Model Evaluation", nav: "Model Evaluation" },
      { t: "p", text: "Evaluation used to be one-off: pick a model, a dataset and a scoring rule, run it, start over. ==I led a rebuild around the evaluation set==, which made every run easy to manage and compare, and added LLM-as-a-judge scoring and a leaderboard for each set." },
      { t: "versus",
        before: { label: "Before", title: "Every run starts from zero", items: ["Pick model, dataset and rule each time", "Runs can't be compared", "Re-run old models to rank them"] },
        after: { label: "After", title: "Every run starts from a set", items: ["The set carries its scoring rule", "Every run on it is comparable", "Each set gets a leaderboard"] },
      },
      { t: "img", src: "huawei-ai/eval-concept.png", w: 880, trim: 11, caption: "Evaluation sets as scenarios, each with its own scores and leaderboard" },

      { t: "h", text: "Model Square & Playground", nav: "Model Square & Playground" },
      { t: "feature", device: true, src: "huawei-ai/model-square.png", title: "Model Square", text: "Choose Huawei's own Pangu models or third-party ones, filter them easily and open any model's details." },
      { t: "feature", device: true, src: "huawei-ai/playground.png", title: "Playground", text: "A revamped Playground: adjust the settings easily and see the quality of a model's answers in real time." },
      { t: "h", text: "Results" },
      { t: "impact", value: "15+", title: "enterprise projects delivered", text: "Across finance, energy, manufacturing, automotive and education." },
    ] },

    { id: "build", label: "AI Orchestration", sub: "Build the App", icon: "orchestration", blocks: [
      { t: "p", text: "As Huawei brought AI into its own work, every department wanted an AI assistant. These two products were the foundation for building them. Both are internal, so I desensitized the screens here and adapted them for this page." },

      { t: "h", text: "Prompt Engineering Platform", nav: "Prompt Platform" },
      { t: "p", text: "Prompts sit under almost every AI application at Huawei, and people tune them for weeks. The old tool got in their way twice: a prompt had to be published before it could be tested, and with no real version management, developers kept their versions in OneNote. ==I led the redesign== from research through launch, around one goal: ==write good prompts, faster==." },
      { t: "part", title: "Write and test, without leaving the page", text: "Write on the left, test on the right: add variables, improve the draft in one click (==a 70% adoption rate==), add few-shot examples and run. The edit-to-result loop went from 7 steps to 2." },
      { t: "img", src: "huawei-ai/prompt-write.mp4", w: 880, device: true, caption: "Adapted from the internal product screens." },
      { t: "part", title: "Every version, side by side", text: "Every tested edit saves a minor version, like V0.3, and every publish moves up a major one, like V1.0. Pick any two to compare their prompts and answers." },
      { t: "img", src: "huawei-ai/prompt-versions.mp4", w: 880, device: true, caption: "Adapted from the internal product screens." },
      { t: "impact", value: "10M+", title: "prompt calls a month", more: [{ value: "3.7×", label: "monthly active users" }, { value: "4.2×", label: "prompts on the platform" }, { value: "7.2 → 8.3", label: "satisfaction" }] },

      { t: "h", text: "Assistant Maker", nav: "Assistant Maker" },
      { t: "p", text: "Each team was hand-coding its own assistant, on its own stack, with its own look. Meanwhile the AI capabilities they needed were scattered across different internal platforms. Assistant Maker is a low-code platform that packages those capabilities as skills, routes each question to the right one, and gives every assistant the same interface." },
      { t: "p", text: "I worked on the platform from zero to one, through design and launch. The first version shipped in two months." },
      { t: "img", src: "huawei-ai/maker-concept.png", w: 880, trim: 25, caption: "Skills from different platforms go in; one assistant, with one consistent interface, comes out" },
      { t: "img", src: "huawei-ai/maker-demo.mp4", w: 880, device: true, caption: "Set up the basics, add and configure skills, then talk to it on the right. Rebuilt with sample content." },
      { t: "impact", value: "80+", title: "assistants built in the first year", more: [{ value: "5,400+", label: "monthly active users" }, { value: "1.1M+", label: "questions answered" }, { value: "Months → days", label: "to build an assistant" }] },
      { t: "aside", label: "What came next", text: "A year after launch, Maker gave way to a new Agent platform. In 2024, agents weren't reliable enough to plan on their own, and routing to fixed skills was the simple, stable choice. By 2025 they were. Maker's skills and interface paved the way." },
    ] },

    { id: "work", label: "AI SaaS", sub: "Do the Work", icon: "saas", blocks: [
      { t: "p", text: "The top layer is where AI meets people who don't care how it works: they have a question and want the answer." },

      { t: "h", text: "DataArts Insight", nav: "DataArts Insight" },
      { t: "p", text: "[DataArts Insight](https://www.huaweicloud.com/product/dataartsinsight.html) is Huawei Cloud's business intelligence product. I went on site with customers in Beijing and Shanghai to find what it was missing before commercial launch, then shipped new charts, one shared configuration framework and a template market." },
      { t: "sub", text: "From dashboards to asking" },
      { t: "p", text: "As AI arrived, the first thing you see became a chat box. I contributed to Data Agent: ask in plain language and get the chart, the anomaly and what to do next." },
      { t: "img", src: "huawei-ai/bi-demo.mp4", w: 880, device: true, caption: "Rebuilt from the high-fidelity design with sample data." },

      { t: "h", text: "KooSearch", nav: "KooSearch" },
      { t: "p", text: "[KooSearch](https://www.huaweicloud.com/intl/en-us/product/css.html) is Huawei Cloud's enterprise AI search, built on RAG: admins connect a knowledge base, and employees get answers with sources. Over three releases I designed the setup flow and the search experience, including deep research." },
      { t: "img", src: "huawei-ai/ks-demo.mp4", w: 880, device: true, caption: "Every claim links back to its source. Rebuilt from the high-fidelity design with a sample question." },
    ] },

    { id: "reflection", label: "Reflection", blocks: [
      { t: "step", title: "A generalist early", text: "I feel lucky to have started as a generalist. At Huawei I could decide what a feature should be and then design how it works, as a product manager and a product designer at once. ==I found I love defining a product as much as designing it.==" },
      { t: "step", title: "Taking systems apart", text: "A large AI platform is a system of many parts. ==I love taking one apart==, seeing what each part does and how they can run better together. Data Engineering, Model Evaluation, Prompt Engineering and Assistant Maker all started that way." },
      { t: "step", title: "Moving fast", text: "AI moved faster than our roadmaps. Assistant Maker gave way to agents a year after launch. Prompt engineering, once the hard part, settled into infrastructure as models got stronger, and the focus moved on. Much of what I built became a step toward something else. So I've learned to ==ship what works now, learn fast and be ready to start again.==" },
    ] },
  ],
};
