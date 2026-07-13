export function AboutApp() {
  return (
    <div className="win-pad">
      <div className="about-card">
        <div className="portrait-slot" aria-label="头像位,等待像素化照片">
          <span>PORTRAIT</span>
          <span style={{ opacity: 0.55 }}>128 × 128</span>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <p className="mono-label">USER PROFILE</p>
          <h1 style={{ margin: "6px 0 2px", fontSize: 30, fontWeight: 900, letterSpacing: "-0.01em" }}>
            Eric Fu
          </h1>
          <p style={{ margin: "2px 0 10px", fontWeight: 700, color: "var(--muted)", fontSize: 13.5 }}>
            PRODUCT MANAGER · DESIGNER · BUILDER
          </p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            <span className="chip ai">AI PRODUCT</span>
            <span className="chip design">UX DESIGN</span>
            <span className="chip play">VIBE CODING</span>
            <span className="chip life">LIFE ENTHUSIAST</span>
          </div>
        </div>
      </div>

      <p style={{ margin: "18px 0 6px", fontSize: 14, lineHeight: 1.85, color: "var(--muted)" }}>
        工程背景出身的产品经理,做过产品设计师,现在专注 AI 产品。
        相信技术不只是冰冷的数学和代码,而是给人带来快乐的东西——
        这个网站本身,就是这句话的一个证明。
      </p>
      <p style={{ margin: "0 0 4px", fontSize: 12.5, color: "var(--faint)", fontFamily: "var(--font-mono)" }}>
        {"// 照片像素化处理中,即将实装"}
      </p>

      <div className="contact-row">
        <a className="btn" href="https://github.com/ericfu-tianchi" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a className="btn" href="https://www.linkedin.com/in/tianchi-fu-60821b228" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a className="btn primary" href="mailto:ericfu-tianchi@outlook.com">
          Email me
        </a>
      </div>
    </div>
  );
}
