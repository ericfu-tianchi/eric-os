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

/** Accent bands carry white text: a light accent (Connectr's mint) is deepened until white reads on it (just enough for large white text; deeper looked heavy). */
function bandColor(hex: string) {
  const ch = (i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  let [r, g, b] = [ch(0), ch(1), ch(2)];
  for (let k = 0; k < 20; k++) {
    const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    if (1.05 / (L + 0.05) >= 2.6) break;
    r *= 0.96; g *= 0.96; b *= 0.96;
  }
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

/** Round white glyphs for the old-site feature panels (Connectr), drawn to match the originals. */
const PANEL_ICON: Record<"mbti" | "group" | "puzzle" | "compass", React.ReactNode> = {
  // a head in profile with "MBTI" on the brain
  mbti: <svg viewBox="0 0 40 40"><path d="M14.5 33v-5.2c-3.4-2.1-5.4-5.5-5.4-9.6C9.1 11.3 14.2 6.5 20.6 6.5c6.3 0 11 4.4 11 10.4 0 1.3.8 2.3 1.8 3.8.4.6.1 1.3-.6 1.4l-1.3.3v3.5c0 1.6-1.3 2.9-2.9 2.9h-2.4V33z" fill="#fff" /><text x="19.8" y="19.3" textAnchor="middle" fontSize="6" fontWeight="800" fill="var(--pc)" fontFamily="Montserrat, sans-serif">MBTI</text></svg>,
  // a chat bubble (even corners, tail at the lower left) holding four people
  group: <svg viewBox="0 0 40 40"><path d="M13 9.5h14a3.5 3.5 0 0 1 3.5 3.5v11a3.5 3.5 0 0 1-3.5 3.5H15.5L10 31.5V13a3.5 3.5 0 0 1 3-3.5z" fill="#fff" />{[[16.6, 15.3], [23.4, 15.3], [16.6, 21.9], [23.4, 21.9]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.5" fill="var(--pc)" />)}</svg>,
  // one classic jigsaw piece: knobs out on the top and right, sockets on the left and bottom
  puzzle: <svg viewBox="0 0 40 40"><path d="M10 13h6.2a3.6 3.6 0 1 1 6.4 0H29v6.4a3.6 3.6 0 1 1 0 6.4V31h-6.4a3.6 3.6 0 1 0-6.4 0H10v-5.2a3.6 3.6 0 1 0 0-6.4z" fill="#fff" /></svg>,
  compass: <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="12.5" fill="#fff" /><path d="m25.5 14.5-3.6 7.4-7.4 3.6 3.6-7.4z" fill="var(--pc)" /><circle cx="20" cy="20" r="1.6" fill="#fff" /></svg>,
};

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
        {src && <img className={b.bare ? "bare" : undefined} src={src} alt={b.title} loading="lazy" decoding="async" draggable={false} />}
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
  if (b.t === "links")
    return <div className="cs-links">{b.items.map((l) => <a key={l.href} className={l.primary ? "primary" : ""} href={l.href} target="_blank" rel="noopener noreferrer">{l.text}<span aria-hidden>↗</span></a>)}</div>;
  if (b.t === "gallery")
    return (
      <div className={`cs-gallery c${b.cols ?? 2}`}>
        {b.items.map((x) => <figure key={x.src}><img src={detailImg(x.src)} alt={x.caption ?? ""} loading="lazy" decoding="async" draggable={false} />{x.caption && <figcaption>{x.caption}</figcaption>}</figure>)}
      </div>
    );
  if (b.t === "evolve") {
    const last = b.items[b.items.length - 1];
    return (
      <div className="cs-evolve">
        <ol>{b.items.slice(0, -1).map((x, i) => (
          <li key={x.src}><img src={detailImg(x.src)} alt="" loading="lazy" decoding="async" draggable={false} /><span className="n">{String(i + 1).padStart(2, "0")}</span><b>{x.label}</b>{x.note && <small>{x.note}</small>}</li>
        ))}</ol>
        <figure className="final"><img src={detailImg(last.src)} alt={last.label} loading="lazy" decoding="async" draggable={false} /><figcaption><span className="tag">Shipped</span><b>{last.label}</b>{last.note && <small>{last.note}</small>}</figcaption></figure>
      </div>
    );
  }
  if (b.t === "compare")
    return (
      <div className="cs-compare">
        {[b.before, b.after].map((x, i) => <figure key={x.src}><img src={detailImg(x.src)} alt={x.label} loading="lazy" decoding="async" draggable={false} /><figcaption><span className={i ? "tag on" : "tag"}>{i ? "After" : "Before"}</span>{x.label}</figcaption></figure>)}
      </div>
    );
  if (b.t === "beats") {
    let n = 0;
    return (
      <div className="cs-beats">
        {b.chapters.map((c, ci) => (
          <section key={c.title}>
            <h5><span>Act {ci + 1}</span>{c.title}</h5>
            <ol>{c.steps.map((st) => <li key={st}><span className="n">{++n}</span>{st}</li>)}</ol>
          </section>
        ))}
      </div>
    );
  }
  if (b.t === "script")
    return (
      <div className="cs-script">
        {b.title && <p className="slug">{b.title}</p>}
        {b.lines.map((l, i) => l.act
          ? <p key={i} className="act">({l.act})</p>
          : <p key={i} className="line">{l.who && <b>{l.who}</b>}<span>“{l.say}”</span></p>)}
      </div>
    );
  if (b.t === "cards")
    return <div className="cs-cards">{b.items.map((c, i) => <article key={c.title}><span className="n">{String(i + 1).padStart(2, "0")}</span><h4>{c.title}</h4><p><Rich text={c.text} /></p></article>)}</div>;
  if (b.t === "sprints") {
    const tpl = { gridTemplateColumns: `120px repeat(${b.weeks.length}, minmax(0, 1fr))` };
    const at = (from: number, to: number, row = 1) => ({ gridColumn: `${from + 2} / ${to + 3}`, gridRow: row });
    return (
      <div className="cs-sprints">
        <div className="scroll">
          <div className="head" style={tpl}>
            {b.phases.map((ph) => <span key={ph.name} className="phase" style={at(ph.from, ph.to, 1)}>{ph.name}</span>)}
            {b.weeks.map((w, i) => <span key={w} className="week" style={at(i, i, 2)}>{w}</span>)}
          </div>
          {b.rows.map((r) => (
            <div key={r.track} className="trow" style={tpl}>
              <span className="track">{r.track}</span>
              {r.bars.map((x) => <span key={x.text + x.from} className={`bar ${x.mine ? "mine" : ""}`} style={at(x.from, x.to, (x.line ?? 0) + 1)}>{x.text}</span>)}
            </div>
          ))}
        </div>
        {b.note && <p className="note">{b.note}</p>}
      </div>
    );
  }
  if (b.t === "metrics")
    return (
      <div className="cs-metrics">
        <ol>{b.primary.map((m, i) => <li key={m.title}><span className="n">{String(i + 1).padStart(2, "0")}</span><b>{m.title}</b>{m.note && <small>{m.note}</small>}</li>)}</ol>
        <p className="also"><span>Also tracked</span>{b.secondary.map((x) => <i key={x}>{x}</i>)}</p>
      </div>
    );
  if (b.t === "chat")
    return (
      <div className="cs-chat">
        <div className="q"><span className="face" aria-hidden>{b.qFace}</span><p className="bubble"><Rich text={b.q} /></p></div>
        <div className="a">
          <div className="bubble">{b.a.map((x) => <div key={x.h}><h4>{x.h}</h4><p><Rich text={x.text} /></p></div>)}</div>
          <span className="face" aria-hidden>{b.aFace}</span>
        </div>
      </div>
    );
  if (b.t === "panels")
    return (
      <div className="cs-panels">
        {b.items.map((x) => (
          <section key={x.title} style={{ "--pc": x.color } as React.CSSProperties}>
            <span className="ic" aria-hidden>{PANEL_ICON[x.icon]}</span>
            <div className="body">
              <h4>{x.title}</h4>
              <p><Rich text={x.text} /></p>
              {x.subs?.map((y) => <div key={y.h}><h5>&gt;&gt; {y.h}</h5><p><Rich text={y.text} /></p></div>)}
            </div>
          </section>
        ))}
      </div>
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
          ? <img className={b.bare ? "bare" : undefined} src={src} alt="" loading="lazy" decoding="async" draggable={false} />
          : <div className="cs-apps">{b.apps?.map((k, i) => <Fragment key={k}>{i > 0 && b.plus && <span className="plus" aria-hidden>+</span>}{app(k, true)}</Fragment>)}</div>}
      </div>
    );
  }
  if (b.t === "stats")
    return (
      <div className="cs-stats">
        <dl>{b.items.map((x) => <div key={x.label}><dt>{x.value}</dt><dd><Rich text={x.label} /></dd></div>)}</dl>
        {b.note && <p className="note"><Rich text={b.note} /></p>}
      </div>
    );
  if (b.t === "timeline")
    return <ol className="cs-timeline">{b.items.map((x) => <li key={x.date + x.title}><time>{x.date}</time><div><h4>{x.title}</h4><p><Rich text={x.text} /></p></div></li>)}</ol>;
  if (b.t === "versus")
    return (
      <div className="cs-versus">
        {[b.before, b.after].map((x, i) => (
          <section key={x.label} className={i ? "after" : "before"}>
            <span className="tag">{x.label}</span>
            <h4>{x.title}</h4>
            <ul>{x.items.map((it) => <li key={it}><Rich text={it} /></li>)}</ul>
          </section>
        ))}
      </div>
    );
  if (b.t === "flow")
    return <ol className="cs-flow">{b.items.map((x, i) => <li key={x.title}><span className="who">{String(i + 1).padStart(2, "0")} · {x.who}</span><h4>{x.title}</h4><p><Rich text={x.text} /></p></li>)}</ol>;
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
  const hero = heroOf(cs.hero ?? p.slug);
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
    <div className="cs" ref={rootRef} style={{ "--cs": cs.accent, "--cs-band": bandColor(cs.accent) } as React.CSSProperties}>
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
        const split = si === 0 && meta.length > 0 ? s.blocks.findIndex((b) => !["h", "sub", "p", "links"].includes(b.t)) : 0;
        const introEnd = split === -1 ? blocks.length : split;
        return (
          <section key={s.id} id={`sec-${p.slug}-${s.id}`} className={`cs-section ${s.white ? "white" : ""} ${s.dark ? "dark" : ""}`} data-i={si}>
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
