import { useEffect, useMemo, useRef, useState } from "react";
import { GROUPS, PROJECTS, byGroup, metaOf, type Group, type Category } from "../data/projects";
import { caseOf, type CaseBlock } from "../data/cases";
import { useOS } from "../store";
import { PixIcon } from "../components/Pixel";
import { useWindowChrome } from "../components/WindowChrome";
import { coverOf, heroOf, detailImg } from "../data/projectAssets";

const CAT_COLOR: Record<Category, string> = {
  AI: "var(--green)",
  DESIGN: "var(--pink)",
  PLAY: "var(--teal)",
  LIFE: "var(--blue)",
};

/** Projects — a file-system: folders → project files → detail windows (Finder metaphor). */
export function ProjectsApp() {
  const [group, setGroup] = useState<Group | null>(null);
  const open = useOS((s) => s.open);
  const meta = group ? GROUPS.find((g) => g.id === group)! : null;
  const list = group ? byGroup(group) : [];
  const chrome = useMemo(
    () => group && meta
      ? { trail: [{ label: "Projects", onClick: () => setGroup(null) }, { label: meta.label }], meta: `${list.length} items` }
      : { trail: [{ label: "Projects" }], meta: `${GROUPS.length} folders` },
    [group, list.length, meta],
  );
  useWindowChrome(chrome);

  if (group === null) {
    return (
      <div className="win-pad">
        <div className="folder-grid">
          {GROUPS.map((g) => (
            <button key={g.id} className="folder-tile" onDoubleClick={() => setGroup(g.id)} title="双击打开">
              <PixIcon name="folder" size={54} />
              <span className="fname">{g.label}</span>
              <span className="fcount">{byGroup(g.id).length} items · {g.blurb}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="win-pad">
      <div className="finder-grid" role="list">
        {list.map((p) => {
          const thumb = coverOf(p.slug) ?? heroOf(p.slug);
          const m = metaOf(p.slug);
          return (
            <button
              key={p.slug}
              role="listitem"
              className="file"
              title={p.desc}
              onDoubleClick={() => open("project-detail", { title: p.name, payload: p.slug })}
            >
              {thumb ? (
                <span className="file-thumb"><img src={thumb} alt="" draggable={false} /></span>
              ) : (
                <span className="file-thumb fallback" style={{ background: m.accent }}>{p.cat}</span>
              )}
              <span className="file-name">{p.name}</span>
              <span className="file-tags">
                <span className="file-dot" style={{ background: CAT_COLOR[p.cat] }} aria-hidden />
                <span className="file-year">{p.year}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Inline marks inside case text: **bold** and ==highlight==. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|==[^=]+==)/g).map((part, i) =>
        part.startsWith("**") ? <b key={i}>{part.slice(2, -2)}</b>
          : part.startsWith("==") ? <mark key={i}>{part.slice(2, -2)}</mark>
          : part
      )}
    </>
  );
}

function CaseBlockView({ b, flip, n }: { b: CaseBlock; flip: boolean; n: number }) {
  if (b.t === "p") return <p className="cs-p"><Rich text={b.text} /></p>;
  if (b.t === "h") return <h3 className="cs-label">{b.text}</h3>;
  if (b.t === "sub") return <h4 className="cs-sub">&gt;&gt; {b.text}</h4>;
  if (b.t === "callout")
    return <div className="cs-callout">{b.label && <p className="cs-callout-label">{b.label}</p>}<p><Rich text={b.text} /></p></div>;
  if (b.t === "quote") return <blockquote className="cs-quote"><Rich text={b.text} /></blockquote>;
  if (b.t === "list")
    return <ul className="cs-list">{b.items.map((item, i) => <li key={i}><Rich text={item} /></li>)}</ul>;
  if (b.t === "step")
    return <div className="cs-step"><span className="n">{String(n).padStart(2, "0")}</span><div><h4>{b.title}</h4><p><Rich text={b.text} /></p></div></div>;
  if (b.t === "stat")
    return <div className="cs-stat"><span className="n">{b.value}</span><span className="l">{b.label}</span></div>;
  if (b.t === "link")
    return <a className="cs-pill" href={b.href} target="_blank" rel="noopener noreferrer">{b.text}</a>;
  if (b.t === "feature") {
    const src = detailImg(b.src);
    return (
      <div className={`cs-feature ${flip ? "flip" : ""}`}>
        {src && <img src={src} alt={b.title} loading="lazy" decoding="async" draggable={false} />}
        <div><h4>{b.title}</h4><p><Rich text={b.text} /></p></div>
      </div>
    );
  }
  if (b.t === "img") {
    const src = detailImg(b.src);
    return src ? (
      <figure className={`cs-fig ${b.w && b.w > 880 ? "wide" : ""}`} style={b.w ? ({ "--w": `${b.w}px` } as React.CSSProperties) : undefined}>
        <img src={src} alt={b.caption ?? ""} loading="lazy" decoding="async" draggable={false} />
        {b.caption && <figcaption>{b.caption}</figcaption>}
      </figure>
    ) : null;
  }
  return null;
}

/** Project detail: one renderer for every case study, following docs/LAYOUT_GUIDE.md
    (the old tianchi-fu.com system: poster hero, <Section/> bands, 880px reading column). */
export function ProjectDetailApp({ slug }: { slug?: string }) {
  const p = PROJECTS.find((x) => x.slug === slug);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Scroll spy: the nav follows the section that has crossed the upper third of the window.
  useEffect(() => {
    const root = rootRef.current;
    const scroller = root?.closest<HTMLElement>(".win-body");
    if (!root || !scroller) return;
    const onScroll = () => {
      const sections = [...root.querySelectorAll<HTMLElement>(".cs-section[data-i]")];
      const line = scroller.getBoundingClientRect().top + scroller.clientHeight * 0.35;
      const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4;
      let current = 0;
      sections.forEach((s) => { if (atBottom || s.getBoundingClientRect().top <= line) current = Number(s.dataset.i); });
      setActive(current);
    };
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (!p) return <div className="win-pad">项目不存在。</div>;
  const cs = caseOf(p);
  const hero = heroOf(p.slug);
  const jump = (id: string) => {
    document.getElementById(`sec-${p.slug}-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const meta = [["My Role", cs.role], ["Timeline", cs.timeline], ["Tools", cs.tools]].filter(([, v]) => v);

  return (
    <div className="cs" ref={rootRef} style={{ "--cs": cs.accent } as React.CSSProperties}>
      {hero ? (
        <img className="cs-hero" src={hero} alt={p.name} draggable={false} />
      ) : (
        <div className="cs-hero solid"><h1>{p.name}</h1>{cs.sub && <p>{cs.sub}</p>}</div>
      )}
      {cs.sections.length > 1 && (
        <nav className="cs-nav" aria-label="Sections">
          <div>
            {cs.sections.map((s, i) => (
              <button key={s.id} className={i === active ? "on" : ""} onClick={() => jump(s.id)}>{s.label}</button>
            ))}
          </div>
        </nav>
      )}
      {cs.sections.map((s, si) => {
        let features = 0, steps = 0;
        const blocks = s.blocks.map((b, i) => (
          <CaseBlockView key={i} b={b} flip={b.t === "feature" && features++ % 2 === 1} n={b.t === "step" ? ++steps : 0} />
        ));
        // The meta rail sits beside the opening text only; the first band/figure goes full width.
        const split = si === 0 && meta.length > 0 ? s.blocks.findIndex((b) => !["h", "sub", "p"].includes(b.t)) : 0;
        const introEnd = split === -1 ? blocks.length : split;
        return (
          <section key={s.id} id={`sec-${p.slug}-${s.id}`} className="cs-section" data-i={si}>
            <h2 className="cs-title">&lt;{s.label}/&gt;</h2>
            {introEnd > 0 && (
              <div className="cs-intro">
                <div className="cs-col">{blocks.slice(0, introEnd)}</div>
                <aside className="cs-meta">
                  {meta.map(([k, v]) => <div key={k}><h3>{k}</h3><p>{v}</p></div>)}
                </aside>
              </div>
            )}
            {introEnd < blocks.length && <div className="cs-col">{blocks.slice(introEnd)}</div>}
          </section>
        );
      })}
      {p.link && !cs.sections.some((s) => s.blocks.some((b) => b.t === "link")) && (
        <section className="cs-section cs-end"><a className="cs-pill" href={p.link} target="_blank" rel="noopener noreferrer">Open live project</a></section>
      )}
    </div>
  );
}
