import { useEffect, useRef } from "react";
import { useOS } from "../store";
import fuWingMark from "../assets/fu-wing-mark.png";
import portrait from "../assets/about/portrait.webp";
import portraitShadow from "../assets/about/shadow.png";

/**
 * About Me: a dark, one-page profile (design picked in public/about-study/v2.html:
 * walnut guitar, faint pixel shadow, green accent, "big years" path).
 * "What I bring" and the philosophy line are Tianchi's LinkedIn About, verbatim.
 */


const PHIL = "Tech is never the end, but a powerful means. I'm driven by the positive human impact tech enables.";
const KEY = new Set(["positive", "human", "impact"]);

const BRING = [
  { h: "Tech × Design", p: "A bilingual PM where tech meets design. I dig into the “why”, make complex logic intuitive, and bridge R&D, design, and business.", tags: ["PRD + Prototype"] },
  { h: "AI Full-Stack", p: "3 years turning model capability into product: enterprise AI at Huawei Cloud, creative AI at OpusClip.", tags: ["PaaS → SaaS → Consumer"] },
  { h: "Model Eval", p: "Building framework and platform for evaluating LLM, video, and image models, and using the results to drive what ships.", tags: ["LLM", "Video / Image", "Agent"] },
];

type Stop = { org: string; role: string; x: string; folder?: { id: string; title: string } };

const ICON = {
  xhs: <svg className="xhs" viewBox="0 6 24 12" fill="currentColor" aria-hidden><path d="M22.405 9.879c.002.016.01.02.07.019h.725a.797.797 0 0 0 .78-.972.794.794 0 0 0-.884-.618.795.795 0 0 0-.692.794c0 .101-.002.666.001.777zm-11.509 4.808c-.203.001-1.353.004-1.685.003a2.528 2.528 0 0 1-.766-.126.025.025 0 0 0-.03.014L7.7 16.127a.025.025 0 0 0 .01.032c.111.06.336.124.495.124.66.01 1.32.002 1.981 0 .01 0 .02-.006.023-.015l.712-1.545a.025.025 0 0 0-.024-.036zM.477 9.91c-.071 0-.076.002-.076.01a.834.834 0 0 0-.01.08c-.027.397-.038.495-.234 3.06-.012.24-.034.389-.135.607-.026.057-.033.042.003.112.046.092.681 1.523.787 1.74.008.015.011.02.017.02.008 0 .033-.026.047-.044.147-.187.268-.391.371-.606.306-.635.44-1.325.486-1.706.014-.11.021-.22.03-.33l.204-2.616.022-.293c.003-.029 0-.033-.03-.034zm7.203 3.757a1.427 1.427 0 0 1-.135-.607c-.004-.084-.031-.39-.235-3.06a.443.443 0 0 0-.01-.082c-.004-.011-.052-.008-.076-.008h-1.48c-.03.001-.034.005-.03.034l.021.293c.076.982.153 1.964.233 2.946.05.4.186 1.085.487 1.706.103.215.223.419.37.606.015.018.037.051.048.049.02-.003.742-1.642.804-1.765.036-.07.03-.055.003-.112zm3.861-.913h-.872a.126.126 0 0 1-.116-.178l1.178-2.625a.025.025 0 0 0-.023-.035l-1.318-.003a.148.148 0 0 1-.135-.21l.876-1.954a.025.025 0 0 0-.023-.035h-1.56c-.01 0-.02.006-.024.015l-.926 2.068c-.085.169-.314.634-.399.938a.534.534 0 0 0-.02.191.46.46 0 0 0 .23.378.981.981 0 0 0 .46.119h.59c.041 0-.688 1.482-.834 1.972a.53.53 0 0 0-.023.172.465.465 0 0 0 .23.398c.15.092.342.12.475.12l1.66-.001c.01 0 .02-.006.023-.015l.575-1.28a.025.025 0 0 0-.024-.035zm-6.93-4.937H3.1a.032.032 0 0 0-.034.033c0 1.048-.01 2.795-.01 6.829 0 .288-.269.262-.28.262h-.74c-.04.001-.044.004-.04.047.001.037.465 1.064.555 1.263.01.02.03.033.051.033.157.003.767.009.938-.014.153-.02.3-.06.438-.132.3-.156.49-.419.595-.765.052-.172.075-.353.075-.533.002-2.33 0-4.66-.007-6.991a.032.032 0 0 0-.032-.032zm11.784 6.896c0-.014-.01-.021-.024-.022h-1.465c-.048-.001-.049-.002-.05-.049v-4.66c0-.072-.005-.07.07-.07h.863c.08 0 .075.004.075-.074V8.393c0-.082.006-.076-.08-.076h-3.5c-.064 0-.075-.006-.075.073v1.445c0 .083-.006.077.08.077h.854c.075 0 .07-.004.07.07v4.624c0 .095.008.084-.085.084-.37 0-1.11-.002-1.304 0-.048.001-.06.03-.06.03l-.697 1.519s-.014.025-.008.036c.006.01.013.008.058.008 1.748.003 3.495.002 5.243.002.03-.001.034-.006.035-.033v-1.539zm4.177-3.43c0 .013-.007.023-.02.024-.346.006-.692.004-1.037.004-.014-.002-.022-.01-.022-.024-.005-.434-.007-.869-.01-1.303 0-.072-.006-.071.07-.07l.733-.003c.041 0 .081.002.12.015.093.025.16.107.165.204.006.431.002 1.153.001 1.153zm2.67.244a1.953 1.953 0 0 0-.883-.222h-.18c-.04-.001-.04-.003-.042-.04V10.21c0-.132-.007-.263-.025-.394a1.823 1.823 0 0 0-.153-.53 1.533 1.533 0 0 0-.677-.71 2.167 2.167 0 0 0-1-.258c-.153-.003-.567 0-.72 0-.07 0-.068.004-.068-.065V7.76c0-.031-.01-.041-.046-.039H17.93s-.016 0-.023.007c-.006.006-.008.012-.008.023v.546c-.008.036-.057.015-.082.022h-.95c-.022.002-.028.008-.03.032v1.481c0 .09-.004.082.082.082h.913c.082 0 .072.128.072.128V11.19s.003.117-.06.117h-1.482c-.068 0-.06.082-.06.082v1.445s-.01.068.064.068h1.457c.082 0 .076-.006.076.079v3.225c0 .088-.007.081.082.081h1.43c.09 0 .082.007.082-.08v-3.27c0-.029.006-.035.033-.035l2.323-.003c.098 0 .191.02.28.061a.46.46 0 0 1 .274.407c.008.395.003.79.003 1.185 0 .259-.107.367-.33.367h-1.218c-.023.002-.029.008-.028.033.184.437.374.871.57 1.303a.045.045 0 0 0 .04.026c.17.005.34.002.51.003.15-.002.517.004.666-.01a2.03 2.03 0 0 0 .408-.075c.59-.18.975-.698.976-1.313v-1.981c0-.128-.01-.254-.034-.38 0 .078-.029-.641-.724-.998z" /></svg>,
  mail: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><rect x="1.5" y="3" width="13" height="10" rx="1.5" /><path d="M2 4l6 5 6-5" /></svg>,
  li: <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M0 1.15C0 .52.52 0 1.18 0h13.64C15.48 0 16 .52 16 1.15v13.7c0 .63-.52 1.15-1.18 1.15H1.18C.52 16 0 15.48 0 14.85V1.15zm4.94 12.24V6.17H2.54v7.22h2.4zM3.74 5.18c.84 0 1.36-.55 1.36-1.25-.02-.71-.52-1.25-1.34-1.25-.82 0-1.36.54-1.36 1.25 0 .7.52 1.25 1.33 1.25h.01zm4.91 8.21V9.36c0-.22.02-.43.08-.59.17-.43.57-.88 1.23-.88.87 0 1.22.66 1.22 1.63v3.87h2.4V9.25c0-2.22-1.18-3.25-2.76-3.25-1.27 0-1.84.7-2.16 1.19v.03h-.02l.02-.03V6.17h-2.4c.03.68 0 7.22 0 7.22h2.4z" /></svg>,
  doc: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M4 1.5h5.5L12.5 4.5v10h-8.5z" /><path d="M9.5 1.5v3h3M6.5 8h4M6.5 11h4" /></svg>,
  gh: <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>,
};

export function AboutApp() {
  const open = useOS((s) => s.open);
  const philRef = useRef<HTMLParagraphElement>(null);

  const PATH: { year: string; now?: boolean; stops: Stop[] }[] = [
    { year: "2026", now: true, stops: [
      { org: "OpusClip", role: "AI Product Manager · Singapore", x: "Own model eval for video and image generation; ship AI music in Agent Opus.", folder: { id: "opus", title: "OpusClip" } },
      { org: "National University of Singapore", role: "MSc, AI & Innovation · Singapore", x: "Back in school, learning AI while building with it." },
    ] },
    { year: "2023", stops: [
      { org: "Huawei Cloud", role: "AI Product Manager · Shenzhen", x: "Prompt Studio · Copilot Builder · Model Eval Center · AI SaaS (BI & Enterprise Search)", folder: { id: "huawei", title: "Huawei" } },
    ] },
    { year: "2021", stops: [
      { org: "University of Michigan", role: "MSc, Human-Computer Interaction · Ann Arbor", x: "Where the design half comes from: RefugeeOne · Subtension · Neurobot · HomesOffCampus", folder: { id: "school", title: "School Projects" } },
    ] },
    { year: "2017", stops: [
      { org: "Shanghai Jiao Tong University", role: "BEng, Electrical and Computer Engineering · Shanghai", x: "Where the engineer half comes from." },
    ] },
  ];

  const OFF: { icon: string; t: string; s: string; onClick?: () => void }[] = [
    { icon: "🎸", t: "Guitar", s: "Learned in high school" },
    { icon: "🌍", t: "20+ countries traveled", s: "Rebuilt in LEGO →", onClick: () => open("lego-world", { title: "My Lego World" }) },
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

  // touch screens have no hover: the row crossing the middle of the screen lights up instead, as you scroll
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !window.matchMedia("(hover: none)").matches) return;
    const scroller = el.closest<HTMLElement>(".win-body, .ios-body");
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("on", e.isIntersecting)),
      { root: scroller, rootMargin: "-50% 0px -49% 0px" });
    el.querySelectorAll(".am-bring article, .am-path .yr, .am-off .off-item.link").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <div className="aboutme" ref={rootRef}>
      <section className="am-hero">
        <div className="am-grid" /><div className="am-glow" />
        <div className="am-in">
          <div className="am-meta"><span>About Me</span><span className="now"><i />Now · AI PM · Singapore</span></div>
          <h1 className="am-name">
            <span className="l"><span>Tianchi</span></span>
            <span className="l"><span><span className="eric">(Eric)</span> Fu<span className="dot">.</span></span></span>
          </h1>
          <p className="am-lead">I turn what AI models can do into products people <b>actually enjoy</b>, with an engineer's logic and a designer's hands.</p>
          <div className="am-cta icons">
            <a className="primary" href="mailto:ericfu-tianchi@outlook.com">{ICON.mail}Email me</a>
            <button type="button" onClick={() => open("resume", { title: "resume.pdf" })}>{ICON.doc}Resume</button>
            <a className="social" href="https://www.linkedin.com/in/tianchi-fu/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-tip="LinkedIn">{ICON.li}</a>
            <a className="social" href="https://github.com/ericfu-tianchi" target="_blank" rel="noopener noreferrer" aria-label="GitHub" data-tip="GitHub">{ICON.gh}</a>
            <a className="social" href="https://www.xiaohongshu.com/user/profile/5befd952f7e8b93b68ea98db" target="_blank" rel="noopener noreferrer" aria-label="Xiaohongshu" data-tip="Xiaohongshu">{ICON.xhs}</a>
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
        <div className="am-label">Off the clock</div>
        <div className="off-cards">
          {OFF.map((o) => {
            const inner = <><span className="ic" aria-hidden>{o.icon}</span><span className="tx"><b>{o.t}</b>{o.s && <small>{o.s}</small>}</span></>;
            return o.onClick
              ? <button type="button" className="off-item link" key={o.t} onClick={o.onClick}>{inner}</button>
              : <div className="off-item" key={o.t}>{inner}</div>;
          })}
        </div>
      </section>

      <footer className="am-foot">
        <img src={fuWingMark} alt="" draggable={false} />
        <span>Tianchi (Eric) Fu</span>
        <span className="sp" />
        <span>Made in Singapore, 2026</span>
      </footer>

    </div>
  );
}
