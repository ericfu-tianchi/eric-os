import { useOS, type Wallpaper, type Theme, type AppId } from "../store";
import { HatPicker } from "../components/SnakeGuide";
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
  { name: "About_Me.md", kind: "Markdown document", icon: "doc", app: "about" },
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

const WALLPAPERS: { id: Wallpaper; label: string; desc: string }[] = [
  { id: "snake", label: "Snake", desc: "The grid, with the hello snake and its guide." },
  { id: "clean", label: "Clean", desc: "Just the grid. The snake takes a day off." },
  { id: "noir", label: "Noir", desc: "The old site's dark board, for night owls." },
];

const THEMES: { id: Theme; label: string; desc: string }[] = [
  { id: "dark", label: "Dark", desc: "Charcoal desk under white windows." },
  { id: "light", label: "Light", desc: "Light gray desk under white windows." },
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

export function PrefsApp() {
  const { wallpaper, setWallpaper, theme, setTheme, resetDesktop } = useOS();
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
        <div className="set-row">
          <div className="set-label"><b>Wallpaper</b><span>{WALLPAPERS.find((w) => w.id === wallpaper)?.desc}</span></div>
          <Segmented label="Wallpaper" value={wallpaper} options={WALLPAPERS} onChange={setWallpaper} />
        </div>
      </section>

      <section className="set-group">
        <div className="set-row stack">
          <div className="set-label"><b>Snake accessory</b><span>What the snake wears on your desktop.</span></div>
          <HatPicker />
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
      </section>
    </div>
  );
}
