import { useState } from "react";
import { CATEGORIES, PROJECTS, type Category } from "../data/projects";
import { useOS } from "../store";

export function ProjectsApp() {
  const [tab, setTab] = useState<"ALL" | Category>("ALL");
  const open = useOS((s) => s.open);
  const list = PROJECTS.filter((p) => tab === "ALL" || p.cat === tab);

  return (
    <div className="win-pad">
      <p className="mono-label">SELECTED PROJECTS · 2021 — NOW</p>
      <h1 className="h-display">WORK</h1>

      <div className="tabs" role="tablist">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={tab === c}
            className={`tab ${tab === c ? "active" : ""}`}
            onClick={() => setTab(c)}
          >
            {c}
          </button>
        ))}
      </div>

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
        {list.length === 0 && (
          <p style={{ color: "var(--faint)", fontFamily: "var(--font-mono)", fontSize: 13, padding: "18px 4px" }}>
            // {tab} 分区施工中,内容即将入驻
          </p>
        )}
      </div>
    </div>
  );
}

export function ProjectDetailApp({ slug }: { slug?: string }) {
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return <div className="win-pad">项目不存在。</div>;
  return (
    <div className="win-pad">
      <div style={{ display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap" }}>
        <span className={`chip ${p.cat.toLowerCase()}`}>{p.cat}</span>
        <span className={`status ${p.status ?? ""}`}>
          {p.status && <i aria-hidden />}
          {p.statusLabel}
        </span>
        <span className="year" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>{p.year}</span>
      </div>
      <h1 style={{ fontSize: 27, fontWeight: 900, margin: "12px 0 8px" }}>{p.name}</h1>
      <p style={{ fontSize: 14, lineHeight: 1.9, color: "var(--muted)" }}>{p.detail ?? p.desc}</p>
      <div
        style={{
          marginTop: 16,
          border: "var(--border)",
          borderRadius: "var(--radius-m)",
          boxShadow: "var(--shadow-s)",
          background: "var(--surface-2)",
          padding: "26px 18px",
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--faint)",
          letterSpacing: "0.08em",
        }}
      >
        [ SCREENSHOTS & CASE STUDY — COMING SOON ]
      </div>
    </div>
  );
}
