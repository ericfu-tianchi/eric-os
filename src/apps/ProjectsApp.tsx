import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { GROUPS, PROJECTS, byGroup, metaOf, type Group, type Category } from "../data/projects";
import { caseOf, type CaseBlock } from "../data/cases";
import { useOS } from "../store";
import { PixIcon } from "../components/Pixel";
import { useWindowChrome } from "../components/WindowChrome";
import { coverOf, heroOf, detailImg } from "../data/projectAssets";
import { APPS, appIcon, type AppKey } from "../data/apps";

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
            <button key={g.id} className="folder-tile" onDoubleClick={() => setGroup(g.id)} title="Double-click to open">
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

/** Inline marks inside case text: **bold**, ==highlight== and [link](url). */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|==[^=]+==|\[[^\]]+\]\((?:[^()\s]|\([^()\s]*\))+\))/g).map((part, i) => {
        if (part.startsWith("**")) return <b key={i}>{part.slice(2, -2)}</b>;
        if (part.startsWith("==")) return <mark key={i}>{part.slice(2, -2)}</mark>;
        const link = part.match(/^\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)$/); // URLs may hold one level of (parens)
        if (link) return <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]}</a>;
        return part;
      })}
    </>
  );
}

function CaseBlockView({ b, flip, n }: { b: CaseBlock; flip: boolean; n: number }) {
  if (b.t === "p") return <p className="cs-p"><Rich text={b.text} /></p>;
  if (b.t === "h") return <h3 className="cs-label">{b.text}</h3>;
  if (b.t === "sub") return <h4 className="cs-sub">{b.text}</h4>;
  if (b.t === "callout")
    return <div className="cs-callout">{b.label && <p className="cs-callout-label">{b.label}</p>}<p><Rich text={b.text} /></p></div>;
  if (b.t === "quote") return <blockquote className="cs-quote"><Rich text={b.text} /></blockquote>;
  if (b.t === "list")
    return <ul className={`cs-list ${b.plain ? "plain" : ""}`}>{b.items.map((item, i) => <li key={i}><Rich text={item} /></li>)}</ul>;
  if (b.t === "status") {
    const LABEL = { done: "Done", partly: "Partly", todo: "Not yet" } as const;
    const count = (k: keyof typeof LABEL) => b.items.filter((x) => x.s === k).length;
    return (
      <div className="cs-status">
        <div className="cs-status-sum">
          <div className="bar" aria-hidden>{(["done", "partly", "todo"] as const).map((k) => <i key={k} className={k} style={{ flex: count(k) }} />)}</div>
          <div className="legend">{(["done", "partly", "todo"] as const).map((k) => <span key={k} className={k}><i />{count(k)} {LABEL[k].toLowerCase()}</span>)}</div>
        </div>
        <ol>
          {b.items.map((x, i) => (
            <li key={i} className={x.s}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <span className="t"><Rich text={x.text} /></span>
              <span className="pill">{LABEL[x.s]}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }
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
  if (b.t === "embed")
    return (
      <figure className={`cs-embed ${b.kind}`}>
        <div style={{ aspectRatio: b.ratio ?? (b.kind === "youtube" ? 16 / 9 : 16 / 10) }}>
          <iframe src={b.src} title={b.caption ?? b.kind} loading="lazy" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
        </div>
        {b.caption && <figcaption>{b.caption}</figcaption>}
      </figure>
    );
  if (b.t === "row")
    return (
      <figure className="cs-row">
        <div>
          {b.items.map((item, i) => {
            const src = detailImg(item.src);
            return src ? <img key={i} src={src} alt="" loading="lazy" decoding="async" draggable={false} style={{ flexBasis: item.w, maxWidth: item.w }} /> : null;
          })}
        </div>
        {b.caption && <figcaption>{b.caption}</figcaption>}
      </figure>
    );
  if (b.t === "item") {
    const src = b.src ? detailImg(b.src) : undefined;
    const app = (k: AppKey, big: boolean) => (
      <a key={k} className={big ? "cs-app" : "cs-chip"} href={APPS[k].href} target="_blank" rel="noopener noreferrer" data-name={big ? APPS[k].name : undefined}>
        <img src={appIcon(k)} alt={big ? APPS[k].name : ""} draggable={false} />{!big && <>{APPS[k].name}<span aria-hidden>↗</span></>}
      </a>
    );
    return (
      <div className={`cs-item ${flip ? "flip" : ""}`}>
        <div>
          <span className="n">{String(n).padStart(2, "0")}</span>
          <h4>{b.title}</h4>
          {b.text.split("\n\n").map((t, i) => <p key={i}><Rich text={t} /></p>)}
          {src && b.apps && <div className="cs-chips">{b.apps.map((k) => app(k, false))}</div>}
        </div>
        {src
          ? <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
          : <div className="cs-apps">{b.apps?.map((k, i) => <Fragment key={k}>{i > 0 && b.plus && <span className="plus" aria-hidden>+</span>}{app(k, true)}</Fragment>)}</div>}
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

  if (!p) return <div className="win-pad">This project doesn't exist.</div>;
  const cs = caseOf(p);
  const hero = heroOf(p.slug);
  // Jumping past lazy images used to stop short: they load mid-scroll and push the target down.
  // Load everything above the target first, then keep correcting until the section sits at the top.
  const jump = (id: string) => {
    const root = rootRef.current;
    const scroller = root?.closest<HTMLElement>(".win-body");
    const target = document.getElementById(`sec-${p.slug}-${id}`);
    if (!root || !scroller || !target) return;
    root.querySelectorAll<HTMLImageElement>("img[loading='lazy']").forEach((img) => {
      if (img.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING) img.loading = "eager";
    });
    const offset = () => target.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    scroller.scrollTo({ top: scroller.scrollTop + offset(), behavior: "smooth" });
    let last = -1, checks = 0;
    const settle = () => {
      if (++checks > 12) return;
      const moving = Math.abs(scroller.scrollTop - last) > 1;
      last = scroller.scrollTop;
      if (!moving && Math.abs(offset()) > 2) scroller.scrollTo({ top: scroller.scrollTop + offset(), behavior: "smooth" });
      else if (!moving) return;
      window.setTimeout(settle, 250);
    };
    window.setTimeout(settle, 250);
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
        let features = 0, steps = 0, items = 0;
        const blocks = s.blocks.map((b, i) => {
          const n = b.t === "step" ? ++steps : b.t === "item" ? ++items : 0;
          return <CaseBlockView key={i} b={b} flip={(b.t === "feature" && features++ % 2 === 1) || (b.t === "item" && n % 2 === 0)} n={n} />;
        });
        // The meta rail sits beside the opening text only; the first band/figure goes full width.
        const split = si === 0 && meta.length > 0 ? s.blocks.findIndex((b) => !["h", "sub", "p"].includes(b.t)) : 0;
        const introEnd = split === -1 ? blocks.length : split;
        return (
          <section key={s.id} id={`sec-${p.slug}-${s.id}`} className={`cs-section ${s.white ? "white" : ""}`} data-i={si}>
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
