import { useEffect, useRef } from "react";
import { useOS } from "../store";
import portrait from "../assets/about/portrait.webp";
import portraitShadow from "../assets/about/portrait-shadow.png";

/**
 * About_Me.md: a dark, one-page profile (design picked in public/about-study/v2.html:
 * walnut guitar, faint white pixel shadow, green accent, "big years" path).
 * Copy follows Tianchi's LinkedIn About; the philosophy line is verbatim.
 */

const PHIL = "Tech is never the end, but a powerful means. I'm driven by the positive human impact tech enables.";
const KEY = new Set(["positive", "human", "impact"]);

const BRING = [
  { h: "Tech × Design", p: "A bilingual PM where tech meets design. I dig into the why, turn complex logic into something intuitive, and get R&D, design and business pulling the same way.", chip: "PRD + prototype" },
  { h: "AI, full stack", p: "Three years turning model capability into product: enterprise AI at Huawei Cloud, creative AI for video, image and audio at OpusClip.", chip: "PaaS → SaaS → consumer" },
  { h: "Model eval", p: "I build the frameworks that test LLM, video and image models, then let the results decide what ships.", chip: "LLM · video · image" },
];

type Stop = { org: string; role: string; x: string; folder?: { id: string; title: string } };
const PATH: { year: string; now?: boolean; stops: Stop[] }[] = [
  { year: "2026", now: true, stops: [
    { org: "OpusClip", role: "AI Product Manager · Singapore", x: "Owns model eval for video & image generation; ships AI music in Agent Opus.", folder: { id: "opus", title: "Work at Opus Clip" } },
    { org: "NUS", role: "MSc, AI & Innovation · Singapore", x: "Back in school, part time, on the AI side." },
  ] },
  { year: "2023", stops: [
    { org: "Huawei Cloud", role: "AI Product Manager · Shenzhen", x: "Prompt Studio 3.7× MAU · Copilot Builder 0→1 · Model Eval Center.", folder: { id: "huawei", title: "Work at Huawei" } },
  ] },
  { year: "2021", stops: [
    { org: "University of Michigan", role: "MSc, HCI · Ann Arbor", x: "RefugeeOne 0→1 · Subtension shipped on Steam · Huawei UX intern (patent).", folder: { id: "school", title: "School Projects" } },
  ] },
  { year: "2017", stops: [
    { org: "Shanghai Jiao Tong University", role: "BEng, ECE · Shanghai", x: "Where the engineer half comes from." },
  ] },
];

const ICON = {
  mail: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><rect x="1.5" y="3" width="13" height="10" rx="1.5" /><path d="M2 4l6 5 6-5" /></svg>,
  li: <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M0 1.15C0 .52.52 0 1.18 0h13.64C15.48 0 16 .52 16 1.15v13.7c0 .63-.52 1.15-1.18 1.15H1.18C.52 16 0 15.48 0 14.85V1.15zm4.94 12.24V6.17H2.54v7.22h2.4zM3.74 5.18c.84 0 1.36-.55 1.36-1.25-.02-.71-.52-1.25-1.34-1.25-.82 0-1.36.54-1.36 1.25 0 .7.52 1.25 1.33 1.25h.01zm4.91 8.21V9.36c0-.22.02-.43.08-.59.17-.43.57-.88 1.23-.88.87 0 1.22.66 1.22 1.63v3.87h2.4V9.25c0-2.22-1.18-3.25-2.76-3.25-1.27 0-1.84.7-2.16 1.19v.03h-.02l.02-.03V6.17h-2.4c.03.68 0 7.22 0 7.22h2.4z" /></svg>,
  gh: <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>,
};

export function AboutApp() {
  const open = useOS((s) => s.open);
  const philRef = useRef<HTMLParagraphElement>(null);

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
          <div className="am-meta"><span>About_Me.md</span><span className="now"><i />Now · AI PM at OpusClip · Singapore</span></div>
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
            <i className="am-shadow" style={{ WebkitMaskImage: `url(${portraitShadow})`, maskImage: `url(${portraitShadow})` }} />
            <img src={portrait} alt="Tianchi playing guitar" draggable={false} />
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
            <article key={b.h}><span className="n">{String(i + 1).padStart(2, "0")}</span><h3>{b.h}</h3><p>{b.p}</p><span className="am-chip">{b.chip}</span></article>
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

      <section className="am-sec am-outro">
        <div className="off"><span>OFF-SCREEN</span><span className="am-chip">🎸 Guitar</span><span className="am-chip">20+ countries, rebuilt in LEGO</span><span className="am-chip">A 50,000-word personal wiki</span><span className="am-chip">EN · 中文 · 日本語</span></div>
        <div className="sign"><span>Tianchi (Eric) Fu</span><span>Singapore · 2026</span></div>
      </section>
    </div>
  );
}
