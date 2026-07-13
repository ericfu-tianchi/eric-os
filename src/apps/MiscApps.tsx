import { useOS, type Wallpaper, type IconSet } from "../store";
import { ThemedIcon } from "../components/ThemedIcon";

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
  { id: "snake", label: "SNAKE BOARD", desc: "棋盘网格 + 贪吃蛇(默认)" },
  { id: "clean", label: "CLEAN", desc: "纯网格,极简" },
  { id: "noir", label: "NOIR", desc: "老站同款暗色棋盘,夜场模式" },
];

const ICON_SETS: { id: IconSet; label: string; desc: string }[] = [
  { id: "a", label: "SET A · CONSOLE", desc: "经典 16-bit,描边+三阶明暗" },
  { id: "d", label: "SET D · INK", desc: "粗墨版画,单 accent" },
];

export function PrefsApp() {
  const { wallpaper, setWallpaper, iconSet, setIconSet, resetDesktop } = useOS();
  return (
    <div className="win-pad">
      <p className="mono-label">SYSTEM PREFERENCES</p>
      <h1 style={{ fontSize: 24, fontWeight: 900, margin: "6px 0 16px" }}>系统偏好设置</h1>

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
