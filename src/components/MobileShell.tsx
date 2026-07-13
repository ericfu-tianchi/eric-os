import { PROJECTS } from "../data/projects";
import { PixelGlyph, PixelWordmark } from "./Pixel";

/**
 * MobileShell — the content survives without the metaphor.
 * Below 820px the OS becomes a clean card stream.
 */
export function MobileShell() {
  return (
    <div className="mobile-shell">
      <nav className="menubar" style={{ position: "fixed" }}>
        <span className="brand" style={{ cursor: "default" }}>
          <PixelGlyph name="logo" size={22} />
          <PixelWordmark text="ERIC OS" cell={2.4} />
        </span>
        <div className="right">
          <span style={{ fontSize: 11 }}>MOBILE</span>
        </div>
      </nav>

      <section className="m-card">
        <div className="m-head">ABOUT.TXT</div>
        <div className="m-body">
          <h1 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 900 }}>Eric Fu</h1>
          <p style={{ margin: "0 0 10px", fontWeight: 700, color: "var(--muted)", fontSize: 12.5 }}>
            PRODUCT MANAGER · DESIGNER · BUILDER
          </p>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.85, color: "var(--muted)" }}>
            工程背景的产品经理,专注 AI 产品。相信技术是给人带来快乐的东西。
          </p>
          <div className="contact-row">
            <a className="arcade-btn" href="https://github.com/ericfu-tianchi" target="_blank" rel="noopener noreferrer">GITHUB</a>
            <a className="arcade-btn primary" href="mailto:ericfu-tianchi@outlook.com">EMAIL</a>
          </div>
        </div>
      </section>

      <section className="m-card">
        <div className="m-head">PROJECTS.DIR</div>
        <div className="m-body" style={{ padding: "6px 8px 10px" }}>
          {PROJECTS.map((p) => (
            <div key={p.slug} className="proj-row" style={{ cursor: "default" }}>
              <span className={`chip ${p.cat.toLowerCase()}`}>{p.cat}</span>
              <span>
                <span className="name">{p.name}</span>
                <div className="desc">{p.desc}</div>
              </span>
              <span className="year">{p.year}</span>
              <span />
            </div>
          ))}
        </div>
      </section>

      <p className="m-note">
        // 完整的 ERIC OS(可拖拽窗口 + 可玩的 SNAKE.SYS)
        <br />
        请用桌面浏览器打开体验
      </p>
    </div>
  );
}
