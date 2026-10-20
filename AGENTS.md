# Tianchi OS — 施工手册

Eric Fu 的个人网站:一个桌面操作系统形状的作品集。
**任何 AI/人在此仓库动工前,先读完本文件。**

## ⚠️ 视觉方向 v2（V0.5 已实装，取代旧的暖 cream/硬阴影方向）

旧的暖 cream / 硬阴影方向**已被 Eric 否决**。新锁定方向:
- **炭灰暗台 × 彩色像素图标的现代反差**:近黑炭底(非纯黑)+ 亮白窗口 + UI 全程黑白灰**零用色**;**唯一彩色来自精致彩色像素图标**(宝石色 16-bit,参考 Diverse sprites + '90s Artist Pack)。
- **窗口要精致**:柔和真实投影(soft shadow,**不再是硬阴影**)+ 1px 发丝边 + 顶边极淡高光;大圆角。
- **明暗双模式**:同一套 chrome,一个 theme token 切炭灰↔浅冷灰,浅色也要精致。
- **像素度稍低档**(更干净不吵)。现代高级是绝对主角,像素是"克制的第二基因",比例绝不能反。
- 排除项:❌暖黄/米色/纸感/复古印刷 ❌纯像素/幼稚 ❌蓝色蓝灰底 ❌粗黑描边/大硬阴影。

## 北极星(违反即打回)

1. **现代为体,街机为佐料**——比例绝不能反。像素只允许出现在:图标、字标、壁纸、贴纸点缀;正文排版、布局结构永远是现代的。
2. **窗口/卡片用柔和真实投影**(soft shadow + 发丝边),不用硬阴影。~~旧规则(硬阴影)已作废~~。
3. **拒绝廉价感、拒绝低幼/二次元**。怀疑时,问"这像不像一个有品位的成年人做的?"
4. 大标题敢大(font-weight 800+),留白敢留;UI 零用色,颜色只给图标。
5. 少即是多:不加没被要求的配置项、抽象层、依赖。

## 设计 tokens(源:`src/styles.css` :root — 以代码为准)

v2 已实装:炭灰台 `--paper:#1c1d21` + 永远白窗 `--surface:#fff`(明暗模式只翻转台面)· 圆角 4px · 柔投影+发丝边 · chrome 黑白灰零用色,仅红绿窗控键。字体自托管:Geist Sans(OS chrome、桌面文件名、Snake HUD/控制)/Montserrat(标题与大数字)/Source Sans Pro(正文,老站原件)/JetBrains Mono(技术性项目元数据)。品牌绿 `#06C268`(蛇/强调),老站粉 `#FF1256`(About 照片偏移)。分类色:AI=green,DESIGN=pink,PLAY=teal,LIFE=blue。

## 贪吃蛇壁纸系统(核心彩蛋,别破坏)

- 网格 44px **双向自适应**(`gridSpec`:行列都整除屏幕,零半格);桌面图标一格一个。
- 壁纸 = Eric 手绘草书 "hello" 蛇(`DesktopSnake.tsx` 的 `ERIC_POSE`,原稿 `pose-drafts/`);`<DesktopSnake frozen>` 静止+眼睛跟鼠标,双击 SNAKE.SYS 同帧唤醒。
- 吃桌面图标 = 图标**原样**骑在蛇身(最新贴头后);蛇头装饰在系统设置(俯视视角)。
- 换姿态流程:Eric 在 `public/spec.html` 自绘 → 导出 JSON 存 `pose-drafts/` → 人工推链序 + python 验证(无重访/相邻/头朝右) → 替换 `ERIC_POSE`。

## 架构(ryOS 验证过的最小内核)

- **栈**:Vite + React 19 + TypeScript(strict) + zustand persist。Tailwind v4 已接入构建，但主视觉由 `src/styles.css` 的自定义 CSS 提供；无路由、无 UI 库、无动画库。
- **四件套**:
  1. `WindowFrame`(src/components)= 唯一窗口 chrome:左上红(关闭)/绿(最大化)方块,hover 才出图标;标题栏拖拽;双击标题栏最大化。
  2. `App.tsx` 里的 `APP_VIEWS` = app 注册表。
  3. `store.ts` zustand + persist = 窗口/图标位/壁纸/蛇最高分,刷新不丢。
  4. z-index = `order` 数组下标,聚焦=挪到数组尾。
- **像素系统**:`src/components/Pixel.tsx` 提供网格 SVG 图标与 `PixelWordmark`；当前选用的精致像素 Icon 是 `src/assets/icons/b/` 下的 PNG 资产。新 Icon 优先复用 / 替换该资产集，除非 Eric 明确要求回到代码绘制。
- **移动端**:由 `gridSpec` 决定；少于 27 列或 13 行即显示 `MobileShell`。`?forceDesktop=1` 可在窄屏强制桌面调试。

## V0.5 文件系统、内容与游戏（长期约定）

- **统一 Finder**:`src/apps/FileSystemApp.tsx` 是所有文件夹的唯一窗口；左栏根目录为 Tianchintosh HD / Applications / Desktop / Documents / Images / Videos，右侧支持图标 / 列表、前进 / 后退。不要为普通文件夹另造不一致的窗口。
- **文件树真相源**:`src/data/filesystem.ts` 定义节点、根目录、外部游戏 URL 与 ID。每个 `FileNode.id` 必须全局唯一；Desktop 的 13 项由 `src/components/desktopGrid.tsx` 作为桌面入口映射，新增桌面顶级目录时目前需同时检查两处。
- **内容页排版**:所有阅读型页面(项目详情、How I Built It、长文)**动工前先读 `docs/LAYOUT_GUIDE.md`**,并先说明用哪种格式(默认 case blocks 数据 + `ProjectDetailApp` 渲染;HTML 仅限需交互的例外;暂不用 Markdown)。
- **真实内容入口**:项目 case 以 `src/data/projects.ts`、`cases.ts`、`casesContent.ts` 为主；未来批量引入 HTML / Markdown / PDF / 视频前，先建立统一 content manifest + renderer registry，不要把每个类型的判断散落在各 App 内。
- **Snake 主实现**:当前游戏在 `src/components/DesktopSnake.tsx`；`src/apps/SnakeApp.tsx` 是历史窗口版 / 深链遗留，勿误把它当当前主游戏。Snake 从桌面或 Finder 启动时走 `setSnakeMode(true)`。
- **外部应用**:Soul Blade / Twist Solver 的 URL 与 Icon 在 `filesystem.ts` 的 `EXTERNAL_GAMES`；通过 `ExternalGameApp.tsx` 最大化 iframe 打开。目标站若未来拒绝 iframe，需实现新标签页降级。
- **Record 边界**:`src/data/snakeRecord.ts` 仍是 localStorage 预览，不是跨用户全站排行；正式发布前接 Worker / 数据库，并移除 `App.tsx` 的一次性 QA reset。

## 施工配方：新增一个应用 / 内容（按情况选用）

1. `src/apps/XxxApp.tsx` 写内容组件(用 `.win-pad` 包内边距)。
2. `store.ts`:`AppId` 加 id,`DEFAULT_SIZE` 加尺寸。
3. `App.tsx`:`APP_VIEWS` 注册。
4. 应用入口放 `filesystem.ts` 的 Applications；需要桌面入口再同步 `desktopGrid.tsx`，需要 Dock 入口再同步 `Dock.tsx`。
5. 需要新图标时优先复用 / 更新 `src/assets/icons/b/`；保持当前精致彩色像素风，不要临时混入不一致的 SVG。
6. 手测:开窗/拖拽/最大化/关闭/刷新恢复；Finder 内容还要测后退 / 前进与图标 / 列表视图。每次改动至少运行 `npm run build`。

新增一个项目 case = 更新 `projects.ts` / case 内容，并在需要被 Finder 看见时更新 `filesystem.ts`；不是“只改一个文件”了。

## 双 Agent 协作规则

- `AGENTS.md` 是 Codex 与 Claude Code 共用的**长期规范真相源**；`CLAUDE.md` 可保存 Claude 侧补充，但与此冲突时以 `AGENTS.md` 和实际代码为准。
- 每次动工前：完整阅读 `AGENTS.md`，执行 `git status -sb`，不要覆盖另一位 agent 的未提交改动。
- 跨 session 当前状态写入根目录 `HANDOFF.md`；它被忽略，永远不提交。长期设计 / 架构决策才写回本文件。
- 完成实现后：运行 `npm run build`；涉及交互时再在 `http://localhost:5173/?forceDesktop=1` 做核心流程手测。

## 路线图(按优先级)

1. Eric 真人照片像素化 → `AboutApp` 的 portrait-slot(等他发图;做 dither 处理,带 --pink 描边致敬老站)
2. 部署 Cloudflare Pages,绑 tianchi-fu.com
3. 项目详情窗装真实截图与 case study
4. SNAKE.SYS 2.0:果实=项目图标,吃到哪个游戏结束后开哪个窗口
5. ASK-ERIC.AI:聊天窗 + 3 个工具(openApp/openProject/downloadResume),Cloudflare Workers 包 Codex API
6. URL 深链(/projects/model-eval 直达开窗)、开关窗音效(默认关)
7. 简历 PDF 2026 版挂接

## 已定决策(别翻案)

- 不做:账户/云同步/多主题切换/真 Terminal/聊天室/3D/i18n(调研结论,见项目记忆)。
- 窗口控制键只有红绿两个,在左上,方形。
- Dock 无放大效果,hover = `steps()` 像素跳 + 黑底 tip。
- 字体零外链(woff2 自托管)。
- 吃掉的图标保持**原样**(绿色化方案已否)。蛇=贴格无描边+缝隙;眼中大;编辑器画布渲染全量格子(勿用链追踪渲染)。
- **一切文件只进本仓库/系统 scratchpad,严禁在 ~/Desktop 根目录建文件**(Eric 明令)。
- HANDOFF.md 不提交(.gitignore)。
