import { useOS, type Wallpaper } from "../store";
import { PixelGlyph } from "../components/Pixel";

export function ResumeApp() {
  return (
    <div className="win-pad" style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
      <p className="mono-label">RESUME.PDF</p>
      <div
        style={{
          alignSelf: "stretch",
          border: "var(--border-thick)",
          borderRadius: "var(--radius-m)",
          boxShadow: "var(--shadow-s)",
          background: "var(--surface-2)",
          padding: "34px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <PixelGlyph name="pdf" size={54} />
        <span style={{ fontWeight: 800, fontSize: 15 }}>简历 · 2026 版整理中</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--muted)", textAlign: "center", lineHeight: 1.8 }}>
          正在把 Opus / AI PM 的新篇章写进去
          <br />
          更新完成后这里一键下载
        </span>
      </div>
      <button className="arcade-btn" disabled>
        DOWNLOAD PDF — SOON
      </button>
    </div>
  );
}

export function ReadmeApp() {
  return (
    <div className="win-pad readme">
      <p className="mono-label">SYSTEM MANUAL</p>
      <h1 style={{ fontSize: 26, fontWeight: 900, margin: "6px 0 2px" }}>README.md</h1>
      <h3>这是什么?</h3>
      <p>
        <b>ERIC OS</b> 是 Eric Fu 的个人网站——一个桌面操作系统形状的作品集。
        项目是文件,双击打开;简历在桌面上;贪吃蛇是真的可以玩的。
      </p>
      <h3>怎么用?</h3>
      <p>
        像用电脑一样用它:拖动图标和窗口、双击打开、绿键最大化、红键关闭。
        Dock 在底部,菜单在左上角。所有状态自动保存,刷新不丢。
      </p>
      <h3>造物志(Colophon)</h3>
      <ul>
        <li>内核:<code>React</code> + <code>TypeScript</code> + <code>zustand</code>,四件套窗口管理</li>
        <li>像素图标与字标:手绘网格,SVG 渲染,一个字体文件都没加载</li>
        <li>设计语言:现代为体,街机为佐料;每个浮起的元素都有一块硬阴影</li>
        <li>由 AI 结对 vibe-code,人类负责品味与否决</li>
      </ul>
      <h3>路线图</h3>
      <ul>
        <li>像素化真人头像(照片处理中)</li>
        <li>ASK-ERIC.AI:能开窗口的 AI 分身</li>
        <li>SNAKE.SYS 2.0:果实=项目,吃到哪个开哪个</li>
        <li>项目详情页装入真实截图与 Case Study</li>
      </ul>
    </div>
  );
}

const WALLPAPERS: { id: Wallpaper; label: string; desc: string }[] = [
  { id: "snake", label: "SNAKE GRID", desc: "点阵 + 贪吃蛇(默认)" },
  { id: "clean", label: "CLEAN", desc: "纯点阵,极简" },
  { id: "sunset", label: "SUNSET", desc: "落日黄,大胆模式" },
];

export function PrefsApp() {
  const { wallpaper, setWallpaper, resetDesktop } = useOS();
  return (
    <div className="win-pad">
      <p className="mono-label">SYSTEM PREFERENCES</p>
      <h1 style={{ fontSize: 24, fontWeight: 900, margin: "6px 0 16px" }}>系统偏好设置</h1>

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
