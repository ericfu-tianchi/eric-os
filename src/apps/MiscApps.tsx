import { useOS, type Wallpaper, type IconSet, type Theme, type SnakeHat, type AppId } from "../store";
import { PixIcon, type PixIconName } from "../components/Pixel";

export function ResumeApp() {
  return (
    <div className="win-pad">
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <p className="mono-label">RESUME · v2023(2026 版更新中)</p>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: "4px 0 2px", letterSpacing: "-0.02em" }}>Tianchi (Eric) Fu</h1>
          <p className="small" style={{ margin: "2px 0 0" }}>Product Manager · UX Designer · Builder</p>
        </div>
        <button className="btn" disabled>DOWNLOAD PDF · SOON</button>
      </div>

      <div className="cv-block" style={{ marginTop: 20 }}>
        <p className="mono-label">EXPERIENCE</p>
        <div className="cv-item">
          <span className="role">UX Design Intern <span className="org">— Huawei,深圳</span></span>
          <span className="when">2022.05–09</span>
          <span className="what">折叠屏 PC 窗口管理机制设计;专利申请中。</span>
        </div>
        <div className="cv-item">
          <span className="role">Game UX Designer <span className="org">— WolverineSoft Studio</span></span>
          <span className="when">2022</span>
          <span className="what">40 人团队,2D 潜艇 RTS《SubTension》:教程/商店/背包 UI。</span>
        </div>
        <div className="cv-item">
          <span className="role">UX Designer <span className="org">— Backyard Brains(客户项目)</span></span>
          <span className="when">2022</span>
          <span className="what">Neurobot 重设计:高危可用性问题 13→1,HCI Expo 一等奖。</span>
        </div>
        <div className="cv-item">
          <span className="role">Product Manager Intern <span className="org">— JYI,上海</span></span>
          <span className="when">2021</span>
          <span className="what">AI 面试 SaaS:引导流程重设计,学生满意度 +20%,两月 30+ 付费企业。</span>
        </div>
      </div>

      <div className="cv-block">
        <p className="mono-label">EDUCATION</p>
        <div className="cv-item">
          <span className="role">M.S. Human-Computer Interaction <span className="org">— University of Michigan</span></span>
          <span className="when">2021–23 · GPA 3.8</span>
        </div>
        <div className="cv-item">
          <span className="role">B.A. ECE + Data Science Minor <span className="org">— Shanghai Jiao Tong University</span></span>
          <span className="when">–2021</span>
        </div>
      </div>

      <div className="cv-block">
        <p className="mono-label">SKILLS</p>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 8 }}>
          {["AI PRODUCT", "UX RESEARCH", "FIGMA", "PYTHON", "REACT", "SQL", "PRD", "VIBE CODING"].map((s) => (
            <span key={s} className="chip">{s}</span>
          ))}
        </div>
      </div>

      <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--faint)", letterSpacing: "0.06em" }}>
        // Opus / AI PM 篇章正在写入 2026 版
      </p>
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
  { id: "glasses", label: "眼镜", desc: "Tech 味" },
  { id: "cap", label: "学士帽", desc: "School 味" },
  { id: "phones", label: "耳机", desc: "听歌的蛇" },
  { id: "bow", label: "蝴蝶结", desc: "精致的蛇" },
  { id: "bubble", label: "星星泡泡", desc: "梦见星星(老站彩蛋)" },
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
