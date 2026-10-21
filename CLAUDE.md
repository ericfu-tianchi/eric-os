# Tianchi OS — 施工手册

Tianchi (Eric) Fu 的个人网站:一个桌面操作系统形状的作品集。
**任何 AI/人在此仓库动工前,先读完本文件。**

## 🎨 设计规范(必读,任何 UI / 内容改动前)

本站的设计规范有两份,**所有 Agent 动工前必须先读对应的那份并严格遵守**;拿不准时宁可先问,不要自创样式:

1. **OS 层** → `docs/OS_DESIGN_SYSTEM.md`:菜单、Settings、Finder、蛇的对话/换装、tooltip、窗口、Dock、桌面。字体、字号、圆角、颜色、按钮、表面、文案、图标规则都在里面。
2. **阅读页** → `docs/LAYOUT_GUIDE.md`:案例研究、About、How I Built It 的排版。

硬规则:
- 只用 `src/styles.css` `:root` 里已有的 token(`--ui-*` 字号、`--r-*` 圆角、颜色、阴影、间距);**不写新的零散数值**。确实缺东西 → 先扩展规范(token + 文档),再实现,并同步更新三处:`src/styles.css`、`docs/OS_DESIGN_SYSTEM.md`、可视化文档 https://claude.ai/artifact/H3kdSW5jdA33qbSXsRWBqn(仅 Eric 可见)。
- UI 零彩色(颜色只给像素图标、蛇、红绿窗控键);`--select` 蓝只代表"访客自己";按钮只用 `.btn` 家族。
- 全站英文,文案写法见规范的 Voice and copy。
- 视觉改动先给 Eric 看图/样稿,确认后再实装;交付前在真实尺寸截图自检。

## ⚠️ 视觉方向 v2(2026-07-15 定调,取代旧的暖 cream/硬阴影方向)

现有代码(v0.4)仍是旧视觉(暖 cream + 绿 + 硬阴影),**已被 Eric 否**。新锁定方向:
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

v2 已实装:炭灰台 `--paper:#1c1d21` + 永远白窗 `--surface:#fff`(Light 主题重绘整个台面层:网格/菜单栏/Dock/菜单,见 `docs/OS_DESIGN_SYSTEM.md` Themes)· 圆角 4px · 柔投影+发丝边 · chrome 黑白灰零用色,仅红绿窗控键。字体自托管:Geist Sans(OS chrome、桌面文件名、Snake HUD)/Montserrat(标题与大数字)/Source Sans Pro(正文,老站原件)/JetBrains Mono(技术性项目元数据)。品牌绿 `#06C268`(蛇/强调),老站粉 `#FF1256`(About 照片偏移)。分类色:AI=green,DESIGN=pink,PLAY=teal,LIFE=blue。

## 贪吃蛇壁纸系统(核心彩蛋,别破坏)

- 网格 44px **双向自适应**(`gridSpec`:行列都整除屏幕,零半格);桌面图标一格一个。
- 壁纸 = Eric 手绘草书 "hello" 蛇(`DesktopSnake.tsx` 的 `ERIC_POSE`,原稿 `pose-drafts/`);`<DesktopSnake frozen>` 静止+眼睛跟鼠标,双击 SNAKE.SYS 同帧唤醒。
- 吃桌面图标 = 图标**原样**骑在蛇身(最新贴头后);蛇头装饰在系统设置(俯视视角)。
- 换姿态流程:Eric 在 `public/spec.html` 自绘 → 导出 JSON 存 `pose-drafts/` → 人工推链序 + python 验证(无重访/相邻/头朝右) → 替换 `ERIC_POSE`。

## 架构(ryOS 验证过的最小内核)

- **栈**:Vite + React 19 + TypeScript(strict) + Tailwind v4(@tailwindcss/vite) + zustand persist。无路由、无 UI 库、无动画库——CSS `steps()` 就是我们的动画语言。
- **四件套**:
  1. `WindowFrame`(src/components)= 唯一窗口 chrome:左上红(关闭)/绿(最大化)方块,hover 才出图标;标题栏拖拽;双击标题栏最大化。
  2. `App.tsx` 里的 `APP_VIEWS` = app 注册表。
  3. `store.ts` zustand + persist = 窗口/图标位/壁纸/蛇最高分,刷新不丢。
  4. z-index = `order` 数组下标,聚焦=挪到数组尾。
- **像素系统**:`src/components/Pixel.tsx` 仍提供网格 SVG 图标与 `PixelWordmark`；当前选用的精致像素 Icon 是 `src/assets/icons/b/` 下的 PNG 资产。新 Icon 先复用 / 替换这套资产，除非 Eric 明确要求回到代码绘制。
- **移动端**:由 `gridSpec` 决定；少于 27 列或 13 行即显示 `MobileShell`，`?forceDesktop=1` 可在窄屏强制桌面调试。

## V0.5 文件系统与内容入口

- **Finder 真相源**:`src/data/filesystem.ts` 定义 Tianchintosh HD 的所有节点、外部游戏 URL、根目录与 ID。`FileSystemApp.tsx` 是所有文件夹共用的左右分栏 Finder，支持后退 / 前进、图标 / 列表视图。
- **桌面映射**:`src/components/desktopGrid.tsx` 控制桌面上显示的 9 个入口(School Projects / Work〔OpusClip、Huawei〕/ AI Side Projects;Soul Blade、My Lego World、Snake;About Me、resume.pdf、How I AI,排成 3×3;Tianchintosh HD 只在 Dock)与右侧锚定位置;Settings 只在 Dock 和 Applications;改默认布局时把 `store.ts` 的 `ICON_LAYOUT` 加 1,老访客的图标位置会重置一次；它与 `filesystem.ts` 目前有少量平行配置，新增顶级桌面目录时要同时检查两处。
- **真实游戏**:桌面 Snake 的主实现是 `DesktopSnake.tsx`。Soul Blade / Twist Solver 定义在 `filesystem.ts` 的 `EXTERNAL_GAMES`，通过 `ExternalGameApp.tsx` 最大化 iframe 打开。
- **内容页排版**:所有阅读型页面(项目详情、How I Built It、长文)**动工前先读 `docs/LAYOUT_GUIDE.md`**,并先说明用哪种格式(默认 case blocks 数据 + `ProjectDetailApp` 渲染;HTML 仅限需交互的例外;暂不用 Markdown)。
- **内容扩展**:新增 case 仍以 `src/data/projects.ts` / `cases*.ts` 为主；在批量引入 HTML、Markdown、PDF、视频前，应先建立统一 content manifest + renderer registry，避免分散的 app 判断。
- **Images / Videos**:内容清单在 `src/data/media.ts`(文件放 `public/media/`,图片配 `.thumb.webp`),Finder 自动生成文件夹和文件;双击图片开 `PreviewApp`、视频开 `PlayerApp`(`src/apps/MediaApps.tsx`,仿 macOS Preview / QuickTime:深色台面、悬停控件、←/→ 翻页、F 或双击全屏)。视频可填 `youtube` id 改用 YouTube 播放器。
- **全站纪录**:只存一条全站最高分(分数 + 署名),在 Worker 的 KV(`SNAKE` 命名空间,`/api/record`)。`src/data/snakeRecord.ts` 负责读写并在本地缓存最后一次看到的纪录;Worker 拒绝明显伪造的分数(超过游戏时长可能达到的分数)。个人 BEST 仍存在访客自己的浏览器里。

## OS 设计规范(2026-10-20)

OS 层(菜单、Settings、Finder、蛇的对话/换装、tooltip、窗口)只用一套:字体 Geist;字号只用 `--ui-fine 10.5 / --ui-meta 11.5 / --ui-control 12.5 / --ui-body 13.5 / --ui-title 20`(文件名 12、菜单栏品牌 15 为既有特例);圆角只用 `--r-xs 4 / --r-sm 6 / --r-md 8 / --r-pill`(窗口 4、聊天气泡 12、Dock 14 为特例);四种表面:桌面台面、白窗口、深色玻璃菜单、白色浮层面板;tooltip 一律近黑底白字;按钮一个家族 `.btn`(白底细边 / 墨黑 primary / `.lg`),UI 不用彩色,`--select` 蓝只代表"访客自己"。全站英文。阅读页(案例、About)仍按 `docs/LAYOUT_GUIDE.md`。完整规范:`docs/OS_DESIGN_SYSTEM.md`(可视化版 https://claude.ai/artifact/H3kdSW5jdA33qbSXsRWBqn)

## V0.6 蛇助手(壁纸蛇 = Tianchi 的小跟班)

- **入口**:`SnakeGuide.tsx` 挂在桌面上。蛇头是菜单:悬停/点击 → 扇形三朵想法泡泡(Play / Dress me up / Ask about Tianchi)。没被发现时每次加载 5–10 s 冒第一个,之后每 20–30 s 随机一个;一旦发现(悬停 0.8 s / 点头 / 点泡泡)本次访问不再冒。不跨访问记忆。
- **换装**:`snakeHats.ts` 只放上线的 7 件(BG2 眼镜 / MC2 密歇根帽 / H4 耳机 / B1R 蝴蝶结 / S1A 像素墨镜 / CE2 猫耳 / NY2B 反戴纽约帽)+ Ask 图标 C3;候选与历史方案在 `snakeHatStudy.ts`,审阅页 `/hat-study.html`(仅 dev)。全部 44 单位头部局部坐标,随头转向。
- **对话**:`SnakeChat.tsx`(对话存模块级 store,关窗/玩游戏不丢,刷新清空)→ `POST /api/ask` → `worker/index.ts`(Workers AI Qwen3-30B,免费额度)。人设 A「热心小跟班」;称呼一律 Tianchi。跑题由模型打 `[[off]]` 标签后换固定台词 + 两个推荐问题;越狱/套提示词由 Worker 正则直接拦截。限流:每 IP 8 次/分钟(rate-limit binding)、每次访问 20 问(满了锁 3 分钟,"Play Snake →" 或任何一局游戏立刻消化)。额度用完 → 邮件卡片 + 输入框变写信模式。
- **本地跑**:`npm run dev` + `npx wrangler dev --port 8787`(Vite 已把 `/api` 代理到 8787)。边界情况截图在 `qa/`(不进 git)。

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
5. ~~ASK-ERIC.AI~~ → 已做成 V0.6 蛇助手(见上)
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
