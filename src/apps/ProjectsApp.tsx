import { useMemo, useState } from "react";
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

function CaseBlockView({ b }: { b: CaseBlock }) {
  if (b.t === "p") return <p>{b.text}</p>;
  if (b.t === "h") return <h3 className="cs-h">{b.text}</h3>;
  if (b.t === "callout")
    return <div className="cs-callout">{b.label && <p className="cs-label">{b.label}</p>}<p>{b.text}</p></div>;
  if (b.t === "stat")
    return <div className="cs-stat"><span className="n">{b.value}</span><span className="l">{b.label}</span></div>;
  if (b.t === "link")
    return <a className="cs-link" href={b.href} target="_blank" rel="noopener noreferrer">{b.text} ↗</a>;
  if (b.t === "img") {
    const src = detailImg(b.src);
    return src ? (
      <figure className="cs-fig"><img src={src} alt={b.caption ?? ""} draggable={false} />{b.caption && <figcaption>{b.caption}</figcaption>}</figure>
    ) : null;
  }
  return null;
}

/** Project detail — the old tianchi-fu.com case-study spec, rendered from migrated content. */
export function ProjectDetailApp({ slug }: { slug?: string }) {
  const p = PROJECTS.find((x) => x.slug === slug);
  const [active, setActive] = useState(0);
  if (!p) return <div className="win-pad">项目不存在。</div>;
  const cs = caseOf(p);
  const hero = heroOf(p.slug) ?? coverOf(p.slug);
  const jump = (i: number, id: string) => {
    setActive(i);
    document.getElementById(`sec-${p.slug}-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="cs" style={{ "--cs": cs.accent } as React.CSSProperties}>
      <div className={`cs-hero ${hero ? "" : "solid"}`}>
        {hero && <img className="cs-bg" src={hero} alt="" draggable={false} />}
        <div className="h">{p.name}</div>
        {cs.sub && <div className="s">{cs.sub}</div>}
      </div>
      {(cs.role || cs.timeline || cs.tools) && (
        <div className="cs-meta">
          {cs.role && <div><span className="cs-label">My Role</span><span className="v">{cs.role}</span></div>}
          {cs.timeline && <div><span className="cs-label">Timeline</span><span className="v">{cs.timeline}</span></div>}
          {cs.tools && <div><span className="cs-label">Tools</span><span className="v">{cs.tools}</span></div>}
        </div>
      )}
      <div className="cs-layout">
        {cs.sections.length > 1 && (
          <nav className="cs-nav">
            {cs.sections.map((s, i) => (
              <button key={s.id} className={i === active ? "on" : ""} onClick={() => jump(i, s.id)}>{s.label}</button>
            ))}
          </nav>
        )}
        <div className="cs-main">
          {cs.sections.map((s) => (
            <section key={s.id} id={`sec-${p.slug}-${s.id}`}>
              <div className="cs-sec-title">&lt;{s.label}/&gt;</div>
              {s.blocks.map((b, i) => <CaseBlockView key={i} b={b} />)}
            </section>
          ))}
          {p.link && (
            <a className="btn primary" href={p.link} target="_blank" rel="noopener noreferrer">LIVE ↗</a>
          )}
        </div>
      </div>
    </div>
  );
}
