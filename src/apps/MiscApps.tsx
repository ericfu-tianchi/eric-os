import { useOS, DOCK_SIZE, type Theme, type AppId, type SaverId } from "../store";
import { HatPicker } from "../components/SnakeGuide";
import { SaverPicker } from "../components/ScreenSaver";
import { PixIcon, type PixIconName } from "../components/Pixel";
import resumePage from "../assets/resume-page.png";
import resume from "../data/resumeLinks.json";

/** The real resume PDF, read like a document viewer: a centered page on a quiet stage. */
export function ResumeApp() {
  return (
    <div className="pdf-viewer">
      <div className="pdf-toolbar">
        <a className="btn" href="/resume.pdf" target="_blank" rel="noopener">Open in new tab</a>
        <a className="btn" href="/resume.pdf" download="Tianchi-Fu-Resume-2026.pdf">Download PDF</a>
      </div>
      <div className="pdf-stage">
        <div className="pdf-page" style={{ aspectRatio: resume.aspect }}>
          <img src={resumePage} alt="Tianchi (Eric) Fu — Resume 2026" draggable={false} />
          {resume.links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener"
              aria-label={link.href}
              style={{ left: `${link.left}%`, top: `${link.top}%`, width: `${link.width}%`, height: `${link.height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type DiskItem = { name: string; kind: string; icon: PixIconName; app: AppId };

const DISK_ITEMS: DiskItem[] = [
  { name: "Projects", kind: "Folder · portfolio work", icon: "folder", app: "projects" },
  { name: "About Me", kind: "Profile", icon: "doc", app: "about" },
  { name: "resume.pdf", kind: "PDF document", icon: "pdf", app: "resume" },
  { name: "Snake", kind: "Playable application", icon: "snake", app: "snake" },
  { name: "Settings", kind: "System preferences", icon: "gear", app: "prefs" },
];

/** Tianchintosh HD is the disk; this app is its lightweight Finder-style root. */
export function ReadmeApp() {
  const open = useOS((s) => s.open);
  const setSnakeMode = useOS((s) => s.setSnakeMode);
  return (
    <div className="disk-browser">
      <div className="disk-browser-head">
        <div>
          <p className="mono-label">VOLUME · 5 ITEMS</p>
          <h1>Tianchintosh HD</h1>
        </div>
        <span className="disk-free">11 GB AVAILABLE</span>
      </div>
      <div className="disk-list" role="list">
        {DISK_ITEMS.map((item) => (
          <button
            key={item.name}
            className="disk-row"
            role="listitem"
            onClick={() => (item.app === "snake" ? setSnakeMode(true) : open(item.app, { title: item.name }))}
          >
            <PixIcon name={item.icon} size={34} />
            <span className="disk-name">{item.name}</span>
            <span className="disk-kind">{item.kind}</span>
            <span className="disk-open">OPEN ↗</span>
          </button>
        ))}
      </div>
    </div>
  );
}


const SAVER_DESC: Record<SaverId, string> = {
  duel: "Two snakes race for apples. First to 20 wins.",
  corner: "The F bounces around. Wait for the corner.",
  crazy: "Here's to the crazy ones. Apple, 1997.",
  reel: "Slow pans across Tianchi's projects.",
};
const DELAYS = [
  { id: "1", label: "1 min" }, { id: "3", label: "3 min" }, { id: "5", label: "5 min" }, { id: "0", label: "Never" },
];

const THEMES: { id: Theme; label: string; desc: string }[] = [
  { id: "dark", label: "Dark", desc: "Charcoal desk under white windows." },
  { id: "light", label: "Light", desc: "Cool gray desk, same white windows." },
];

/** A macOS-style segmented control: one choice of a few. */
function Segmented<T extends string>({ value, options, onChange, label }: {
  value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string;
}) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className={value === o.id ? "on" : ""} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A macOS-style switch for one on/off setting. On is ink, never a colour. */
function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={`switch${on ? " on" : ""}`} onClick={() => onChange(!on)} />;
}

/** A macOS-style slider that snaps to a few fixed stops, with a tick under each and the two end labels. */
function Slider<T extends number>({ value, stops, onChange, label, ends }: {
  value: T; stops: readonly T[]; onChange: (v: T) => void; label: string; ends: [string, string];
}) {
  const i = Math.max(0, stops.indexOf(value) === -1 ? stops.findIndex((s) => s >= value) : stops.indexOf(value));
  return (
    <div className="slider">
      <input type="range" min={0} max={stops.length - 1} step={1} value={i} aria-label={label}
        aria-valuetext={`${i + 1} of ${stops.length}`}
        style={{ "--fill": `${(i / (stops.length - 1)) * 100}%` } as React.CSSProperties}
        onChange={(e) => onChange(stops[Number(e.target.value)])} />
      <div className="slider-ticks" aria-hidden>{stops.map((s) => <i key={s} />)}</div>
      <div className="slider-ends"><span>{ends[0]}</span><span>{ends[1]}</span></div>
    </div>
  );
}

export function PrefsApp() {
  const { theme, setTheme, resetDesktop, dockSize, setDockSize, dockAutoHide, setDockAutoHide, open, saver, saverDelay, setSaverDelay, setSaverActive } = useOS();
  return (
    <div className="settings">
      <header>
        <h1>Settings</h1>
        <p>Make Tianchi OS yours. Everything saves on this device.</p>
      </header>

      <section className="set-group">
        <div className="set-row">
          <div className="set-label"><b>Appearance</b><span>{THEMES.find((t) => t.id === theme)?.desc}</span></div>
          <Segmented label="Appearance" value={theme} options={THEMES} onChange={setTheme} />
        </div>
      </section>

      <section className="set-group">
        <div className="set-row stack">
          <div className="set-label"><b>Snake accessory</b><span>What the snake wears on your desktop.</span></div>
          <HatPicker />
        </div>
      </section>

      <section className="set-group">
        <div className="set-row stack">
          <div className="set-row-head">
            <div className="set-label"><b>Screen saver</b><span>{SAVER_DESC[saver]}</span></div>
            <button type="button" className="btn" onClick={() => setSaverActive(true)}>Preview</button>
          </div>
          <SaverPicker />
        </div>
        <div className="set-row">
          <div className="set-label"><b>Start after</b><span>{saverDelay ? "Idle time before the screen saver starts." : "The screen saver never starts on its own."}</span></div>
          <Segmented label="Start after" value={String(saverDelay)} options={DELAYS} onChange={(v) => setSaverDelay(Number(v))} />
        </div>
      </section>

      <section className="set-group">
        <div className="set-row">
          <div className="set-label"><b>Dock size</b><span>Five sizes. The dock follows along.</span></div>
          <Slider label="Dock size" value={dockSize} stops={DOCK_SIZE.stops} onChange={setDockSize} ends={["Small", "Large"]} />
        </div>
        <div className="set-row">
          <div className="set-label"><b>Automatically hide and show the Dock</b><span>Move the pointer to the bottom edge to bring it back.</span></div>
          <Switch label="Automatically hide and show the Dock" on={dockAutoHide} onChange={setDockAutoHide} />
        </div>
      </section>

      <section className="set-group">
        <div className="set-row">
          <div className="set-label"><b>Reset desktop</b><span>Puts every icon and window back where it started.</span></div>
          <button
            type="button"
            className="btn"
            onClick={() => {
              resetDesktop();
              window.location.reload();
            }}
          >
            Reset
          </button>
        </div>
        <div className="set-row">
          <div className="set-label"><b>About Tianchi OS</b><span>Version, credits and who's behind it.</span></div>
          <button type="button" className="btn" onClick={() => open("about-os", { title: "About Tianchi OS" })}>About…</button>
        </div>
      </section>
    </div>
  );
}
