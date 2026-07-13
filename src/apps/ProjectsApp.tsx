import { useState } from "react";
import { GROUPS, PROJECTS, byGroup, type Group } from "../data/projects";
import { useOS } from "../store";
import { ThemedIcon } from "../components/ThemedIcon";

/** PROJECTS.DIR — folder metaphor, mirroring the old site's three tabs. */
export function ProjectsApp() {
  const [group, setGroup] = useState<Group | null>(null);
  const open = useOS((s) => s.open);

  if (group === null) {
    return (
      <div className="win-pad">
        <p className="mono-label">3 FOLDERS · {PROJECTS.length} ITEMS</p>
        <h1 className="h-display">WORK</h1>
        <div className="folder-grid">
          {GROUPS.map((g) => (
            <button key={g.id} className="folder-tile" onClick={() => setGroup(g.id)}>
              <ThemedIcon name="folder" size={54} />
              <span className="fname">{g.label}</span>
              <span className="fcount">{byGroup(g.id).length} items · {g.blurb}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const meta = GROUPS.find((g) => g.id === group)!;
  const list = byGroup(group);
  return (
    <div className="win-pad">
      <div className="crumb">
        <button onClick={() => setGroup(null)}>← PROJECTS.DIR</button>
        <span className="sep">/</span>
        <span>{meta.label}</span>
      </div>
      <h1 style={{ fontSize: 30, fontWeight: 900, margin: "4px 0 12px", letterSpacing: "-0.02em" }}>
        {meta.label}
      </h1>
      <div role="list">
        {list.map((p) => (
          <button
            key={p.slug}
            role="listitem"
            className="proj-row"
            onClick={() => open("project-detail", { title: p.name.toUpperCase(), payload: p.slug })}
          >
            <span className={`chip ${p.cat.toLowerCase()}`}>{p.cat}</span>
            <span>
              <span className="name">{p.name}</span>
              <div className="desc">{p.desc}</div>
            </span>
            <span className="year">{p.year}</span>
            <span className={`status ${p.status ?? ""}`}>
              {p.status && <i aria-hidden />}
              {p.statusLabel ?? ""}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Project detail — the old site's case-study layout: left nav + <Section/> headers. */
export function ProjectDetailApp({ slug }: { slug?: string }) {
  const p = PROJECTS.find((x) => x.slug === slug);
  const [sec, setSec] = useState("overview");
  if (!p) return <div className="win-pad">项目不存在。</div>;

  const sections = [
    { id: "overview", label: "Overview", text: p.overview },
    { id: "process", label: "Process", text: p.process },
    { id: "outcome", label: "Outcome", text: p.outcome },
  ].filter((s) => s.text);

  return (
    <div className="detail-layout">
      <aside className="side-nav">
        <div className="meta">
          <span className={`chip ${p.cat.toLowerCase()}`}>{p.cat}</span>
          <span className={`status ${p.status ?? ""}`}>
            {p.status && <i aria-hidden />}
            {p.statusLabel}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--faint)" }}>{p.year}</span>
          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: 0, color: "var(--green-deep)", fontWeight: 700 }}
            >
              LIVE ↗
            </a>
          )}
        </div>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${p.slug}-${s.id}`}
            onClick={() => setSec(s.id)}
            style={sec === s.id ? { background: "var(--surface-2)", color: "var(--ink)" } : undefined}
          >
            <span className="lt">&lt;</span>{s.label}<span className="lt">/&gt;</span>
          </a>
        ))}
      </aside>
      <div className="detail-body">
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{p.name}</h1>
        <p style={{ marginTop: 0 }}>{p.desc}</p>
        {sections.map((s) => (
          <section key={s.id} id={`${p.slug}-${s.id}`}>
            <h2 className="sec-tag">
              <span className="lt">&lt;</span>{s.label}<span className="lt">/&gt;</span>
            </h2>
            <p>{s.text}</p>
          </section>
        ))}
        <div className="media-slot">[ SCREENSHOTS — 资产迁移中 ]</div>
      </div>
    </div>
  );
}
