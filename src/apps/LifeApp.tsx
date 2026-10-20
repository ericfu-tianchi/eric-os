const INTERESTS = [
  {
    tag: "BASKETBALL",
    text: "An NBA fan for over a decade, from LeBron to Westbrook. Watching games was my first lesson in how teams win.",
  },
  {
    tag: "GUITAR",
    text: "Picked up the guitar in high school to look cool; it became a best friend. That's the one in my About photo.",
  },
  {
    tag: "SUPER MARIO",
    text: "From the 2D side-scrollers to Mario Kart and Odyssey. Half the pixel taste in this OS came from Mario.",
  },
  {
    tag: "YOUTUBE",
    text: "A heavy watcher who wants to go from viewer to creator one day. Building AI video products is the scenic route there.",
  },
  {
    tag: "TRAVEL",
    text: "20 countries so far. Türkiye is next.",
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
        // The animated versions from the old site (bouncing ball, brick stars) are on their way
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
  "High-Quality Human Male",
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
        Illustration, posters and pixel art. Images are still moving over from the old site; here is the list.
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
