import guitar from "../assets/old-site/guitar-portrait.png";

const bio: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.7,
  color: "var(--muted)",
  margin: "0 0 12px",
  maxWidth: "62ch",
};

export function AboutApp() {
  return (
    <div className="win-pad">
      <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
        <img
          src={guitar}
          alt="Eric playing guitar"
          style={{ width: 250, height: "auto", display: "block", flex: "0 0 auto", filter: "drop-shadow(7px 8px 0 #ff1256)" }}
          draggable={false}
        />
        <div style={{ flex: 1, minWidth: 250 }}>
          <p className="mono-label">About_Me.md</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05, margin: "6px 0 10px" }}>
            Hi, I&rsquo;m Eric.
          </h1>
          <p style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)", margin: 0 }}>
            A Tech-Savvy UX Designer, Product Manager &amp; Life Enthusiast.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <p style={bio}>
          As a product designer coming from a computer engineering background, I fluently speak the
          language of both engineers and designers, and enjoy the process of both problem-solving and
          creative invention.
        </p>
        <p style={bio}>
          I&rsquo;ve always been driven by the intersection of <b style={{ color: "var(--ink)" }}>Technology</b> and{" "}
          <b style={{ color: "var(--ink)" }}>Design</b>, aiming to craft meaningful and enjoyable experiences using tech.
        </p>
        <p style={bio}>
          To me, technology isn&rsquo;t just cold math and code, but something that brings people{" "}
          <b style={{ color: "var(--ink)" }}>happiness and joy</b>.
        </p>
      </div>

      <div className="contact-row" style={{ marginTop: 18 }}>
        <a className="btn" href="https://github.com/ericfu-tianchi" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a className="btn" href="https://www.linkedin.com/in/tianchi-fu-60821b228" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a className="btn primary" href="mailto:ericfu-tianchi@outlook.com">🍎 Email me</a>
      </div>
    </div>
  );
}
