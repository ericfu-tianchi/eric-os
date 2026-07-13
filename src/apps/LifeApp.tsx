const INTERESTS = [
  {
    tag: "BASKETBALL",
    text: "十年以上的 NBA 老球迷,从 LeBron 看到 Westbrook。看球是我理解『团队怎么赢』的第一课。",
  },
  {
    tag: "GUITAR",
    text: "高中为了耍帅学的吉他,后来成了最好的朋友。About 里那张照片就是它。",
  },
  {
    tag: "SUPER MARIO",
    text: "从 2D 横版到 Mario Kart、Odyssey 全都玩过。这个系统里的像素审美,一半是马里奥教的。",
  },
  {
    tag: "YOUTUBE",
    text: "重度观看者,梦想有一天从 viewer 变成 creator。做 AI 视频产品算是曲线圆梦。",
  },
  {
    tag: "TRAVEL",
    text: "去过 20 个国家,下一站土耳其。",
  },
];

export function LifeApp() {
  return (
    <div className="win-pad">
      <p className="mono-label">INTERESTS · IMPORTED FROM TIANCHI-FU.COM</p>
      <h1 style={{ fontSize: 28, fontWeight: 900, margin: "4px 0 8px", letterSpacing: "-0.02em" }}>LIFE.APP</h1>
      <div>
        {INTERESTS.map((i) => (
          <div className="life-row" key={i.tag}>
            <span className="ltag">{i.tag}</span>
            <p>{i.text}</p>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--faint)", letterSpacing: "0.06em" }}>
        // 老站的动画版(会弹的篮球/点砖出星星)迁移中
      </p>
    </div>
  );
}

const ARTWORKS = [
  "Super Mario Alphabet",
  "Comic",
  "Poster Design I",
  "Poster Design II",
  "Mr. BadAss",
  "Some Random Stuff",
  "人类高质量男性",
  "parrot_bee_owl",
  "Old Castle",
  "Andy Warhol",
  "Glass",
];

export function PlaygroundApp() {
  return (
    <div className="win-pad">
      <p className="mono-label">VISUAL WORK · {ARTWORKS.length} PIECES</p>
      <h1 style={{ fontSize: 28, fontWeight: 900, margin: "4px 0 4px", letterSpacing: "-0.02em" }}>PLAYGROUND</h1>
      <p className="small" style={{ margin: "4px 0 0" }}>
        插画 / 海报 / 像素画。图片资产从老站迁移中,先看清单。
      </p>
      <div className="pg-grid">
        {ARTWORKS.map((a) => (
          <div className="pg-tile" key={a}>
            <div className="art">IMG</div>
            <div className="pname" title={a}>{a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
