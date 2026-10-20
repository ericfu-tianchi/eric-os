# Tianchi OS

Eric Fu 的个人网站——一个桌面操作系统形状的作品集。
现代为体,街机像素为佐料。

## 跑起来

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 产物在 dist/,纯静态,可部署任何静态托管
```

窄屏(<820px)自动切换为移动卡片流;加 `?forceDesktop=1` 可强制桌面模式。

## 已实装

- 菜单栏:像素字标 + 下拉菜单(About/README/偏好设置/简历/重启),实时时钟
- 桌面:可拖拽像素图标(位置持久化),双击开窗;三款可切换壁纸(含贪吃蛇壁纸)
- 窗口:拖拽/最大化/关闭/焦点管理,左上红绿方形控制键(hover 显示图标)
- Dock:像素图标 + steps() 像素跳 hover + 运行指示点
- 应用:PROJECTS.DIR(分类标签+状态灯+详情窗)· ABOUT.TXT · RESUME.PDF · README.md · 系统偏好 · **SNAKE.SYS(可玩,最高分持久化)**
- 开机动画(1 秒,可点击跳过),一切状态刷新不丢

## 技术

Vite · React 19 · TypeScript · Tailwind v4 · zustand(persist)。
全部像素图标为手绘网格 → SVG,零图片、零字体文件。
详见 [CLAUDE.md](./CLAUDE.md)(施工手册)。
