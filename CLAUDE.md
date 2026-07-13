# ERIC OS — 施工手册

Eric Fu 的个人网站:一个桌面操作系统形状的作品集。
**任何 AI/人在此仓库动工前,先读完本文件。**

## 北极星(违反即打回)

1. **现代为体,街机为佐料**——比例绝不能反。像素只允许出现在:图标、字标、壁纸、贴纸点缀;正文排版、布局结构永远是现代的。
2. **每个浮起的元素都带硬阴影**:`box-shadow: Npx Npx 0 var(--ink)`,无模糊。参考 Eric 的 Twist Solver primary button。
3. **拒绝廉价感、拒绝低幼/二次元**。怀疑时,问"这像不像一个有品位的成年人做的?"
4. 大标题敢大(font-weight 900),留白敢留;色彩每屏 2-3 个主角。
5. 少即是多:不加没被要求的配置项、抽象层、依赖。

## 设计 tokens(源:`src/styles.css` :root)

| token | 值 | 用途 |
|---|---|---|
| `--paper` | #f4f0e6 | 桌面暖白 |
| `--surface` | #fffdf7 | 窗口面 |
| `--ink` | #1b1a15 | 描边与正文 |
| `--green` | #23bd5f | 最大化键 · 蛇 · AI chip(老站 #06C268 后代) |
| `--red` | #ff5347 | 关闭键 |
| `--lime` | #cde84a | 选中/hover 高亮 |
| `--pink` | #ff3b77 | 稀有强调 · DESIGN chip(老站 #FF1256 后代) |
| `--teal` / `--blue` | #17bebb / #3e6de8 | PLAY / LIFE chip |
| `--shadow-s/m/l` | 3/4/7px 硬阴影 | 一切浮起元素 |

内容四分类固定映射:AI=green,DESIGN=pink,PLAY=teal,LIFE=blue。

## 架构(ryOS 验证过的最小内核)

- **栈**:Vite + React 19 + TypeScript(strict) + Tailwind v4(@tailwindcss/vite) + zustand persist。无路由、无 UI 库、无动画库——CSS `steps()` 就是我们的动画语言。
- **四件套**:
  1. `WindowFrame`(src/components)= 唯一窗口 chrome:左上红(关闭)/绿(最大化)方块,hover 才出图标;标题栏拖拽;双击标题栏最大化。
  2. `App.tsx` 里的 `APP_VIEWS` = app 注册表。
  3. `store.ts` zustand + persist = 窗口/图标位/壁纸/蛇最高分,刷新不丢。
  4. z-index = `order` 数组下标,聚焦=挪到数组尾。
- **像素系统**:`src/components/Pixel.tsx`。所有图标都是字符网格手绘 → SVG rect(crispEdges),零字体文件、零图片资源。新图标=画一个网格。字标用内置 5 行像素字体(`PixelWordmark`)。
- **移动端**(<820px):`MobileShell` 卡片流,内容层独立于 OS 隐喻。`?forceDesktop=1` 可在窄屏强制桌面(调试用)。

## 施工配方:新增一个应用(5 步)

1. `src/apps/XxxApp.tsx` 写内容组件(用 `.win-pad` 包内边距)。
2. `store.ts`:`AppId` 加 id,`DEFAULT_SIZE` 加尺寸。
3. `App.tsx`:`APP_VIEWS` 注册。
4. 入口:桌面图标(`Desktop.tsx` ICONS)或 Dock(`Dock.tsx` DOCK_ITEMS),需要新图标就在 `Pixel.tsx` 画网格。
5. 手测:开窗/拖拽/最大化/关闭/刷新恢复,五项全过才算完。

新增一个项目 = 只改 `src/data/projects.ts`,其余全自动。

## 路线图(按优先级)

1. Eric 真人照片像素化 → `AboutApp` 的 portrait-slot(等他发图;做 dither 处理,带 --pink 描边致敬老站)
2. 部署 Cloudflare Pages,绑 tianchi-fu.com
3. 项目详情窗装真实截图与 case study
4. SNAKE.SYS 2.0:果实=项目图标,吃到哪个游戏结束后开哪个窗口
5. ASK-ERIC.AI:聊天窗 + 3 个工具(openApp/openProject/downloadResume),Cloudflare Workers 包 Claude API
6. URL 深链(/projects/model-eval 直达开窗)、开关窗音效(默认关)
7. 简历 PDF 2026 版挂接

## 已定决策(别翻案)

- 不做:账户/云同步/多主题切换/真 Terminal/聊天室/3D/i18n(调研结论,见项目记忆)。
- 窗口控制键只有红绿两个,在左上,方形。
- Dock 无放大效果,hover = `steps()` 像素跳 + 黑底 tip。
- 字体零外链:像素感靠 SVG 网格,不靠像素字体(Fusion Pixel 支持中文,留作未来选项)。
