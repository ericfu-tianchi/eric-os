import { useOS, type Wallpaper, type IconSet, type Theme, type SnakeHat, type AppId } from "../store";
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
  { id: "snake", label: "SNAKE BOARD", desc: "棋盘网格 + 贪吃蛇(默认)" },
  { id: "clean", label: "CLEAN", desc: "纯网格,极简" },
  { id: "noir", label: "NOIR", desc: "老站同款暗色棋盘,夜场模式" },
];

const ICON_SETS: { id: IconSet; label: string; desc: string }[] = [
  { id: "a", label: "SET A · CONSOLE", desc: "经典 16-bit,描边+三阶明暗" },
  { id: "d", label: "SET D · INK", desc: "粗墨版画,单 accent" },
];

const HATS: { id: SnakeHat; label: string; desc: string }[] = [
  { id: "none", label: "无", desc: "素颜蛇" },
  { id: "glasses", label: "眼镜", desc: "黑色板材圆框" },
  { id: "cap", label: "学士帽", desc: "密歇根 M" },
  { id: "phones", label: "耳机", desc: "奶油薄荷" },
  { id: "bow", label: "蝴蝶结", desc: "缎面粉" },
  { id: "shades", label: "墨镜", desc: "Deal with it" },
  { id: "cat", label: "猫耳", desc: "后掠猫耳发箍" },
  { id: "nycap", label: "纽约帽", desc: "反戴的 NY 棒球帽" },
];

const THEMES: { id: Theme; label: string; desc: string }[] = [
  { id: "dark", label: "DARK", desc: "炭灰暗台 + 白窗(默认)" },
  { id: "light", label: "LIGHT", desc: "浅色底 + 白窗孪生" },
];

export function PrefsApp() {
  const { wallpaper, setWallpaper, iconSet, setIconSet, theme, setTheme, snakeHat, setSnakeHat, resetDesktop } = useOS();
  return (
    <div className="win-pad">
      <p className="mono-label">SYSTEM PREFERENCES</p>
      <h1 style={{ fontSize: 24, fontWeight: 900, margin: "6px 0 16px" }}>系统偏好设置</h1>

      <div className="prefs-group">
        <b style={{ fontSize: 14 }}>外观(明暗)</b>
        <div className="options">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`tab ${theme === t.id ? "active" : ""}`}
              onClick={() => setTheme(t.id)}
              title={t.desc}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="prefs-group">
        <b style={{ fontSize: 14 }}>图标风格</b>
        <div className="options">
          {ICON_SETS.map((s) => (
            <button
              key={s.id}
              className={`tab ${iconSet === s.id ? "active" : ""}`}
              onClick={() => setIconSet(s.id)}
              title={s.desc}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="prefs-group">
        <b style={{ fontSize: 14 }}>桌面壁纸</b>
        <div className="options">
          {WALLPAPERS.map((w) => (
            <button
              key={w.id}
              className={`tab ${wallpaper === w.id ? "active" : ""}`}
              onClick={() => setWallpaper(w.id)}
              title={w.desc}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <div className="prefs-group">
        <b style={{ fontSize: 14 }}>蛇头装饰</b>
        <div className="options">
          {HATS.map((h) => (
            <button
              key={h.id}
              className={`tab ${snakeHat === h.id ? "active" : ""}`}
              onClick={() => setSnakeHat(h.id)}
              title={h.desc}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      <div className="prefs-group">
        <b style={{ fontSize: 14 }}>系统音效</b>
        <div className="options">
          <button className="tab" disabled>
            OFF · 下版本再见
          </button>
        </div>
      </div>

      <div className="prefs-group">
        <b style={{ fontSize: 14 }}>危险区</b>
        <div className="options">
          <button
            className="arcade-btn"
            onClick={() => {
              resetDesktop();
              window.location.reload();
            }}
          >
            重置桌面布局
          </button>
        </div>
      </div>
    </div>
  );
}
