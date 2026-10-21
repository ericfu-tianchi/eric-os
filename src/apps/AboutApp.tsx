import { useEffect, useRef, useState } from "react";
import { useOS } from "../store";
import fuWingMark from "../assets/fu-wing-mark.png";

/**
 * About Me: a dark, one-page profile (design picked in public/about-study/v2.html:
 * walnut guitar, faint pixel shadow, green accent, "big years" path).
 * "What I bring" and the philosophy line are Tianchi's LinkedIn About, verbatim.
 * Open with ?aboutstudy to get a small picker for the options still being chosen.
 */

const PORTRAITS = import.meta.glob("../assets/about/portrait-*.webp", { eager: true, import: "default" }) as Record<string, string>;
const SHADOWS = import.meta.glob("../assets/about/shadow-*.png", { eager: true, import: "default" }) as Record<string, string>;
const portraitOf = (k: string) => PORTRAITS[`../assets/about/portrait-${k}.webp`];
const shadowOf = (k: string) => SHADOWS[`../assets/about/shadow-${k}.png`];

const PHIL = "Tech is never the end, but a powerful means. I'm driven by the positive human impact tech enables.";
const KEY = new Set(["positive", "human", "impact"]);

const BRING = [
  { h: "Tech × Design", p: "A bilingual product manager at the intersection of technology and design, I dig into the “why”, turn complex logic into intuitive experiences, and bridge R&D, design, and business.", tags: ["PRD + prototype"] },
  { h: "AI Full-Stack", p: "3 years turning model capability into product — enterprise AI at Huawei Cloud (AI PaaS, Agent/Prompt/RAG, BI & Search) and consumer creative AI at OpusClip (generative video, image, and audio).", tags: ["PaaS → SaaS → consumer"] },
  { h: "Model Eval", p: "Building framework and platform for evaluating LLM, video, and image models, and using the results to drive what ships.", tags: ["LLM", "Video / Image", "Agent"] },
];

/* ---- options still being picked (?aboutstudy); the first of each is the default ---- */
const OPT = {
  face: [["f1", "Face +10%"], ["f0", "Face as is"], ["f2", "Face +18%"], ["f3", "Face +26%"]],
  shadow: [["r2", "Right · up"], ["l-up", "Left · up"], ["l-down8", "Left · down, chunky"], ["l-rough", "Left · down, rough"], ["l-fine", "Left · down, fine"], ["l-smooth", "Left · down, smooth"]],
  nus: [
    ["a", "Back in school for AI, and still building with it on the side."],
    ["b", "Back in school, still working on the AI side."],
    ["c", "Studying AI by day, shipping it on the side."],
    ["d", "Back in school, learning AI while building with it."],
  ],
  offLabel: [["Off the clock", "Off the clock"], ["Away from the desk", "Away from the desk"], ["Also me", "Also me"], ["When I'm not shipping", "When I'm not shipping"]],
  offLayout: [["cards", "Cards"], ["rows", "Rows"], ["sentence", "Sentence"], ["chips", "Chips"]],
} as const;
type Pick = { [K in keyof typeof OPT]: string };
const DEFAULT: Pick = { face: "f1", shadow: "r2", nus: "a", offLabel: "Off the clock", offLayout: "cards" };
const STORE = "about-study-picks";

type Stop = { org: string; role: string; x: string; folder?: { id: string; title: string } };

const ICON = {
  mail: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><rect x="1.5" y="3" width="13" height="10" rx="1.5" /><path d="M2 4l6 5 6-5" /></svg>,
  li: <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M0 1.15C0 .52.52 0 1.18 0h13.64C15.48 0 16 .52 16 1.15v13.7c0 .63-.52 1.15-1.18 1.15H1.18C.52 16 0 15.48 0 14.85V1.15zm4.94 12.24V6.17H2.54v7.22h2.4zM3.74 5.18c.84 0 1.36-.55 1.36-1.25-.02-.71-.52-1.25-1.34-1.25-.82 0-1.36.54-1.36 1.25 0 .7.52 1.25 1.33 1.25h.01zm4.91 8.21V9.36c0-.22.02-.43.08-.59.17-.43.57-.88 1.23-.88.87 0 1.22.66 1.22 1.63v3.87h2.4V9.25c0-2.22-1.18-3.25-2.76-3.25-1.27 0-1.84.7-2.16 1.19v.03h-.02l.02-.03V6.17h-2.4c.03.68 0 7.22 0 7.22h2.4z" /></svg>,
  gh: <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>,
};

function usePicks(): [Pick, (k: keyof Pick, v: string) => void, boolean] {
  const study = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("aboutstudy");
  const [p, setP] = useState<Pick>(() => {
    if (!study) return DEFAULT;
    try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(STORE) || "{}") }; } catch { return DEFAULT; }
  });
  const set = (k: keyof Pick, v: string) => setP((old) => {
    const next = { ...old, [k]: v };
    try { localStorage.setItem(STORE, JSON.stringify(next)); } catch { /* no storage */ }
    return next;
  });
  return [p, set, study];
}

export function AboutApp() {
  const open = useOS((s) => s.open);
  const philRef = useRef<HTMLParagraphElement>(null);
  const [pick, setPick, study] = usePicks();
  const nusLine = OPT.nus.find(([k]) => k === pick.nus)?.[1] ?? OPT.nus[0][1];

  const PATH: { year: string; now?: boolean; stops: Stop[] }[] = [
    { year: "2026", now: true, stops: [
      { org: "OpusClip", role: "AI Product Manager · Singapore", x: "Own model eval for video and image generation; ship AI music in Agent Opus.", folder: { id: "opus", title: "Work at Opus Clip" } },
      { org: "National University of Singapore", role: "MSc, AI & Innovation · Singapore", x: nusLine },
    ] },
    { year: "2023", stops: [
      { org: "Huawei Cloud", role: "AI Product Manager · Shenzhen", x: "Prompt Studio · Copilot Builder · Model Eval Center · AI SaaS (BI & Enterprise Search)", folder: { id: "huawei", title: "Work at Huawei" } },
    ] },
    { year: "2021", stops: [
      { org: "University of Michigan", role: "MSc, Human-Computer Interaction · Ann Arbor", x: "Where the design half comes from: RefugeeOne · Subtension · Neurobot · HomesOffCampus", folder: { id: "school", title: "School Projects" } },
    ] },
    { year: "2017", stops: [
      { org: "Shanghai Jiao Tong University", role: "BEng, Electrical and Computer Engineering · Shanghai", x: "Where the engineer half comes from." },
    ] },
  ];

  const OFF: { icon: string; t: string; s: string; onClick?: () => void }[] = [
    { icon: "🎸", t: "Guitar", s: "" },
    { icon: "🌍", t: "20+ countries, rebuilt in LEGO", s: "Open My Lego World →", onClick: () => open("lego-world", { title: "My Lego World" }) },
    { icon: "📚", t: "A 50,000-word personal wiki", s: "On tech and philosophy" },
    { icon: "🗣️", t: "English · 中文 · 日本語", s: "Duolingo 700+ day streak" },
  ];

  // philosophy: the words light up one by one when the line scrolls into view
  useEffect(() => {
    const el = philRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.querySelectorAll(".w").forEach((w, i) => window.setTimeout(() => w.classList.add("in"), i * 70));
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="aboutme">
      <section className="am-hero">
        <div className="am-grid" /><div className="am-glow" />
        <div className="am-in">
          <div className="am-meta"><span>About Me</span><span className="now"><i />Now · AI PM · Singapore</span></div>
          <h1 className="am-name">
            <span className="l"><span>Tianchi</span></span>
            <span className="l"><span><span className="eric">(Eric)</span> Fu<span className="dot">.</span></span></span>
          </h1>
          <p className="am-lead">I turn what AI models can do into products people <b>actually enjoy</b>, with an engineer's logic and a designer's hands.</p>
          <div className="am-cta">
            <a className="primary" href="mailto:ericfu-tianchi@outlook.com">{ICON.mail}Email me</a>
            <a href="https://www.linkedin.com/in/tianchi-fu/" target="_blank" rel="noopener noreferrer">{ICON.li}LinkedIn</a>
            <a href="https://github.com/ericfu-tianchi" target="_blank" rel="noopener noreferrer">{ICON.gh}GitHub</a>
          </div>
          <div className="am-photo">
            <i className="am-shadow" style={{ WebkitMaskImage: `url(${shadowOf(pick.shadow)})`, maskImage: `url(${shadowOf(pick.shadow)})` }} />
            <img src={portraitOf(pick.face)} alt="Tianchi playing guitar" draggable={false} />
          </div>
        </div>
      </section>

      <section className="am-sec am-phil">
        <div className="am-label">Philosophy</div>
        <p ref={philRef}>
          {PHIL.split(" ").map((w, i) => <span key={i}><span className={`w${KEY.has(w) ? " k" : ""}`}>{w}</span>{" "}</span>)}
        </p>
      </section>

      <section className="am-sec am-bring">
        <div className="am-label">What I bring</div>
        <div className="cols">
          {BRING.map((b, i) => (
            <article key={b.h}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{b.h}</h3>
              <p>{b.p}</p>
              <div className="tags">{b.tags.map((t) => <span className="am-tag" key={t}>{t}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="am-sec am-path">
        <div className="head"><div className="am-label">Path</div><small>Rows with → open their folder</small></div>
        <div className="years">
          {PATH.map((y) => (
            <div className="yr" key={y.year}>
              <div className="y">{y.year}{y.now && <small>→ NOW</small>}</div>
              <div className="stops">
                {y.stops.map((s) => {
                  const body = (<><div><b>{s.org}</b><div className="r">{s.role}</div><div className="x">{s.x}</div></div>
                    {s.folder && <span className="go">Open {s.folder.title} →</span>}</>);
                  return s.folder
                    ? <button type="button" className="stop link" key={s.org} onClick={() => open("filesystem", { title: s.folder!.title, payload: s.folder!.id })}>{body}</button>
                    : <div className="stop" key={s.org}>{body}</div>;
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="am-sec am-off">
        <div className="am-label">{pick.offLabel}</div>
        {pick.offLayout === "sentence" ? (
          <p className="off-sentence">
            I play guitar, have explored 20+ countries and <button type="button" onClick={OFF[1].onClick}>rebuilt them in LEGO</button>, keep a 50,000-word personal wiki, and speak English, 中文 and a little 日本語 (Duolingo 700+ day streak).
          </p>
        ) : (
          <div className={`off-${pick.offLayout}`}>
            {OFF.map((o) => {
              const inner = <><span className="ic" aria-hidden>{o.icon}</span><span className="tx"><b>{o.t}</b>{o.s && <small>{o.s}</small>}</span></>;
              return o.onClick
                ? <button type="button" className="off-item link" key={o.t} onClick={o.onClick}>{inner}</button>
                : <div className="off-item" key={o.t}>{inner}</div>;
            })}
          </div>
        )}
      </section>

      <footer className="am-foot">
        <img src={fuWingMark} alt="" draggable={false} />
        <span>Tianchi (Eric) Fu</span>
        <span className="sp" />
        <span>Made in Singapore, 2026</span>
      </footer>

      {study && (
        <aside className="am-study" aria-label="About options">
          {(Object.keys(OPT) as (keyof Pick)[]).map((k) => (
            <label key={k}>
              <span>{k}</span>
              <select value={pick[k]} onChange={(e) => setPick(k, e.target.value)}>
                {OPT[k].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
          ))}
          <code>{`face: ${pick.face}, shadow: ${pick.shadow}, nus: ${pick.nus}, label: ${pick.offLabel}, layout: ${pick.offLayout}`}</code>
        </aside>
      )}
    </div>
  );
}
