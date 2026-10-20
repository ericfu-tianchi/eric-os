# Tianchi OS — OS design system

The source of truth for every OS-level surface: menus, Settings, Finder, the snake's thought bubbles, chat and dress-up panels, tooltips, windows, the dock and the desktop. Reading pages (case studies, About, How I Built It) follow `docs/LAYOUT_GUIDE.md` and share these tokens.

- Values live in `src/styles.css` `:root`. Use the tokens; never hard-code a new size, radius or colour.
- Need something the system doesn't have? Extend the system first (tokens + this doc), then build.
- Visual reference with live previews (owner only): https://claude.ai/artifact/H3kdSW5jdA33qbSXsRWBqn — keep it in sync when this doc changes.

Tianchi OS is a portfolio shaped like a desktop computer: white windows floating on a charcoal desk, colourful pixel icons, and a green snake that guides visitors. This system covers the OS level: menus, Settings, Finder, the snake's chat and dress-up panels, tooltips and windows. Reading pages (case studies, About) keep their own layout system and only borrow the tokens.

## Principles

- **Modern first, pixels as seasoning.** Layout, type and controls are modern and quiet. Pixels appear only in icons, the wordmark, the wallpaper snake and game surfaces. Never let the ratio flip.
- **The UI has no colour.** Chrome is black, white and grey (`ink`, `muted`, `faint`, `hairline`, `surface`, `surface-2`). Colour comes from the pixel icons, the snake (`snake`) and the window controls (`red`, `green`).
- **One family, one scale.** Everything at OS level is set in Geist, on the seven `ui-*` styles. No other sizes.
- **One shape language.** Corners come from the radius scale: `r-xs` 4, `r-sm` 6, `r-md` 8, `r-pill`. A nested shape is one step smaller than its container (an `r-xs` item inside an `r-md` menu).
- **English only.** Every label, tooltip, aria-label and game prompt is English. The snake answers a visitor in Chinese only when the visitor writes in Chinese.

## Surfaces

There are four, and every new element belongs to one of them.

| Surface | Look | Used for |
| --- | --- | --- |
| Stage | `paper`, `gridline`, `stage-ink`, `stage-muted`, `menubar-*`, `dock-*` | The desktop, menubar, dock and file labels. The layer the Light theme redraws. |
| Window | `surface`, `ink`, 1px `hairline`, `r-window`, `soft-l` | Every app. White in both themes. Unfocused windows drop to `soft-m` and a `surface-2` titlebar. |
| Menu | `menu-bg` dark glass with backdrop blur, `menu-ink`, 1px `menu-line`, `r-md`, `shadow-menu` | The Tianchi OS menu and the desktop context menu. Both look the same. |
| Panel | `surface`, `r-md`, `soft-l`, an 8px tail pointing at its anchor | Floating cards from the snake: Ask the snake, Dress me up. |

Tooltips are near-black (`tooltip-bg`) with white `ui-meta` text, `r-xs`, padding 4 × 8. Every tooltip in the OS looks like this, from the dock and from the snake's thought bubbles.

## Themes

Dark is the default and the hero. Light is a full twin of the OS layer, not an inverted afterthought:

- **Desk**: `paper` turns cool gray (#e9e9ec) and the 44px grid stays visible (`gridline` flips to a dark 6% line). The snake, the hello pose and the game play exactly as in Dark.
- **Menubar and dock**: frosted light glass with dark text (`menubar-*`, `dock-*`); the wordmark inverts to ink.
- **Menus**: light glass (`menu-*` light values). Tooltips stay near-black in both themes.
- **Icons**: no drop shadow under desktop icons and no text shadow under their names; selection uses a dark 7% tile and the same `select` pill.
- **Windows and panels**: identical white surfaces; shadows soften (`soft-m`, `soft-l` light values) and white bubbles on the desk get a hairline ring so they don't dissolve.
- **Game**: HUD text uses `menubar-ink` with a deeper green hint (`hud-accent`); the game-over and tutorial cards keep their dark glass.
- Reading pages are not themed: they stay white in both.

## Typography

- Set OS UI in the `ui` family (Geist). Use `ui-control` (12.5) for anything you click, `ui-body` (13.5) for anything you read in a panel, `ui-meta` (11.5) for the caption under it and `ui-fine` (10.5) for fine print.
- File and folder names use `ui-label` (12). The menubar wordmark is `ui-brand` (15). An OS app's own title is `ui-title` (20).
- Weights: 400 for messages, 500–560 for list rows and menus, 600 for buttons and setting labels, 650 for titles.
- Montserrat (`display`), Source Sans Pro (`text`) and JetBrains Mono (`mono`) belong to reading pages. Do not use them in menus, Settings, Finder or the chat. Mono uppercase labels are for technical metadata on reading pages only.

## Colour

- Text on `surface`: `ink` for primary text, `muted` for secondary text. `faint` is for placeholders and decorative captions only.
- `select` is the visitor's colour. Use it for selection pills, the visitor's chat bubbles, the send button and focus inside the chat. Never use it as a generic accent or a primary button.
- Primary buttons are `ink` with white text. Secondary buttons are `surface` with a 1px `hairline` border that turns `ink` on hover.
- Status colours appear as thin progress lines only: `gold` while the snake swallows a fast question, `green` while it digests.
- `red` and `green` are reserved for the window controls.

## Components

- **Button**: one family. Use `.btn` for secondary, `.btn.primary` for the main action, and `.btn.lg` (38px, `ui-body`) for content calls to action in reading pages. In-panel buttons are 28px tall.
- **Menu**: dark glass, items `ui-control` at 560, hover `menu-hover`, separators `menu-line`. Title Case; end an item with `…` when it opens a window with more choices.
- **Segmented control**: for one choice among two to four options (Appearance). A `surface-2`-like track at `r-sm`, the active segment white with `soft-s`.
- **Settings group**: white `r-md` cards on a `#f6f6f8` window body; each row has a `ui-body` 600 label, a `ui-meta` caption and the control on the right.
- **Switch**: one on/off setting, like macOS. 34 × 20 pill: `track` when off, `ink` when on (never a colour), white knob with `soft-s`. Label the row with the full sentence ("Automatically hide and show the Dock").
- **Slider**: one continuous value with live preview (Dock size). 4px `track` with an `ink` fill, a 16px white knob with a `hairline` ring, and the two end labels underneath in `ui-fine` `faint`.
- **About window**: About This Mac, our way. Centered column on `surface`: a hero illustration, the name in `ui-title`, a `ui-meta` `faint` subtitle, a spec list (labels right-aligned `ink` 560, values left-aligned `muted`, `ui-control`), one `.btn`, and `ui-fine` `faint` credits at the bottom.
- **Boot screen** ("Tail chase"): `paper` stage, the smooth F mark (104px, never pixelated), "Tianchi OS" in Geist 650 26px with `stage-muted` "OS", and a 3×3 ring of 14px `snake` cells where a 5-cell snake chases its tail. About 1.5s, once per visit, click to skip.
- **Screen saver**: full screen, always on the dark stage, no cursor. Starts after the idle time set in Settings (default 3 min), never during Snake or inside an embedded game; any move, key or click ends it and that click never reaches the desktop. The F mark in a saver is the real mark (tinted at full resolution), not a pixel version.
- **Chip**: pill, 28px, 1px `hairline`, `ui-control` at 500. For suggested questions only.
- **Chat panel**: header with a `ui-body` 650 title and a `ui-meta` tag, bubbles at `r-bubble`, a pill composer, a round `select` send button and `ui-fine` fine print.
- **Thought bubble**: the snake's idle hint and menu. White ellipses with trailing dots, one pixel icon or glyph inside, a tooltip caption on hover.
- **Window**: `r-window`, titlebar 30px with the square red and green controls on the left and a `ui-label` title.

## Voice and copy

- Menu items use Title Case, like macOS ("Restart Desktop", "Settings…"). Everything else uses sentence case: buttons, labels, captions, tooltips.
- Name things the way visitors see them: "Snake accessory", not "hat config"; "Reset desktop", not "clear state".
- Captions say what happens: "Puts every icon and window back where it started."
- The snake is Tianchi's sidekick: warm, upbeat, a little cheeky. Its snake flavour comes from eating words (swallow, chew, digest, apples), with at most one 🐍 in a reply and none in most. It always calls him Tianchi.
- Errors say what went wrong and what to do: "Couldn't save. Check your connection and try again."

## Iconography

- Desktop and Finder icons are raster pixel art (PNG and WebP), generated with an image model, never hand-drawn in code. Keep a series consistent: the same base asset, the same optical size, clear margins, checked at real size.
- Reading pages get a cover-thumbnail icon in a light hairline frame with four matching stepped corners.
- UI glyphs inside panels (send, close, envelope, chat) are simple 1.4–1.6px line icons in `ink` or white.
- The window controls show their glyph only on hover: an × on red, diagonal arrows on green, both in black at 60%.

## States

- Hover on secondary controls darkens the border to `ink`. Hover on menu items fills `menu-hover`. Icons on the stage hop on hover (steps, no easing).
- Selection: a grey tile behind the icon (`r-md`) and a `select` pill behind the label (`r-xs`), the same on the desktop and in Finder.
- Disabled controls drop to 45% opacity.
- Motion is short and stepped (`steps(2)` for chrome), with soft easing only for panels popping from the snake.

## Tokens

Every token below exists in `src/styles.css` under the same name. Type styles map to `--ui-fine` … `--ui-title` (file labels 12px and the 15px wordmark keep their own `--os-size-*` tokens).

### Colour (Dark is the default theme; Light redraws the stage chrome — see Themes)

| Token | Value | Use |
|---|---|---|
| `--paper` | dark: `#1c1d21` / light: `#ededee` | The desktop stage behind every window. Only this layer flips between themes. |
| `--bar` | dark: `#141517` / light: `#141517` | The dock, the darkest chrome. Stays dark in both themes as a deliberate anchor. |
| `--stage-ink` | dark: `#ececef` / light: `#17171a` | Text and icon labels sitting directly on paper. |
| `--stage-muted` | dark: `#8a8b92` / light: `#5e5e66` | Secondary text on paper. |
| `--stage-line` | dark: `rgba(255, 255, 255, 0.08)` / light: `rgba(0, 0, 0, 0.08)` | Dividers on paper. |
| `--surface` | `#ffffff` | Window bodies, panels and cards. Windows stay white in both themes. |
| `--surface-2` | `#f4f4f6` | Unfocused titlebars, chat bubbles from the snake, picker tiles, segmented tracks. |
| `--ink` | `#17171a` | Text and strokes inside windows; the primary button fill. |
| `--muted` | `#5e5e66` | Secondary text inside windows (6.4:1 on surface). |
| `--faint` | `#9a9aa2` | Captions and placeholders inside windows. Decorative only: 2.8:1 on surface, never for anything a person must read to act. |
| `--hairline` | `#e6e6ea` | 1px window borders, dividers, secondary button and input outlines. |
| `--track` | `#ebebef` | Control tracks: segmented control, switch (off), slider. |
| `--select` | `#0a64e0` | The visitor's own colour: selection pills, the visitor's chat bubbles, the send button, focus inside the chat. |
| `--red` | `#ff5a4d` | Close control only. |
| `--green` | `#2ec16e` | Maximize control, running dot, the digest progress line. |
| `--green-deep` | `#1f9e57` | Pressed state of green. |
| `--gold` | `#f5b027` | Status only: the swallow (rate-limit) progress line, the snake's '!' and sparkles. |
| `--snake` | `#06c268` | The wallpaper snake's body. Brand green, never used for UI controls. |
| `--menu-bg` | `rgba(39, 40, 46, 0.92)` | Menus and context menus: dark glass on the stage. |
| `--menu-ink` | `#f1f1f3` | Menu item text on menu-bg. |
| `--menu-hover` | `rgba(255, 255, 255, 0.11)` | Hovered menu item. |
| `--menu-line` | `rgba(255, 255, 255, 0.12)` | Menu border and separators. |
| `--tooltip-bg` | `#0e0f11` | Every tooltip (dock, thought-bubble captions). White text on it. |
| `--gridline` | dark: `rgba(255, 255, 255, 0.045)` / light: `rgba(0, 0, 0, 0.06)` | The 44px desktop grid lines. Always visible in both themes. |
| `--menubar-bg` | dark: `#2d2e34` / light: `rgba(246, 246, 248, 0.86)` | Menubar fill (dark is a #323339 → #292a30 gradient in code); light is frosted glass. |
| `--menubar-ink` | dark: `#f1f1f3` / light: `#17171a` | Wordmark and status text in the menubar; the Snake HUD in light. |
| `--menubar-muted` | dark: `rgba(241, 241, 243, 0.68)` / light: `rgba(23, 23, 26, 0.62)` | The clock and secondary menubar text. |
| `--menubar-hover` | dark: `rgba(255, 255, 255, 0.14)` / light: `rgba(0, 0, 0, 0.07)` | The Tianchi OS title while its menu is open. |
| `--dock-bg` | dark: `rgba(32, 33, 38, 0.8)` / light: `rgba(255, 255, 255, 0.62)` | Dock glass (dark is a graphite gradient in code). |
| `--dock-border` | dark: `rgba(255, 255, 255, 0.1)` / light: `rgba(0, 0, 0, 0.08)` | Dock edge. |
| `--stage-select-tile` | dark: `rgba(255, 255, 255, 0.14)` / light: `rgba(0, 0, 0, 0.07)` | The tile behind a selected desktop icon. |
| `--marquee-line` | dark: `rgba(255, 255, 255, 0.52)` / light: `rgba(10, 100, 224, 0.55)` | Desktop lasso border. |
| `--hud-accent` | dark: `#3fbf6e` / light: `#1f9e57` | The Snake HUD hint text in the menubar. |

### Type

| Style | Family | Size | Weight | Use |
|---|---|---|---|---|
| `ui-title` | ui | 20px | 650 | An OS app's own title (Settings). One per window. |
| `ui-brand` | ui | 15px | 630 | The menubar wordmark only. |
| `ui-body` | ui | 13.5px | 400 | Chat messages, setting labels (at 600), panel titles (at 650). |
| `ui-control` | ui | 12.5px | 600 | Buttons, menu items, list rows, chips, segmented controls, menubar status. |
| `ui-label` | ui | 12px | 650 | File and folder names on the desktop and in Finder. |
| `ui-meta` | ui | 11.5px | 500 | Captions under setting labels, tooltips, card footers, tags. |
| `ui-fine` | ui | 10.5px | 400 | Fine print and the smallest meta (Finder item kind). |
| `page-title` | display | 40px | 800 | Headings in About and case studies. Owned by docs/LAYOUT_GUIDE.md. |
| `page-body` | text | 16px | 400 | Running text in reading pages. |
| `page-meta` | mono | 11px | 700 | Technical labels above a reading page's title. Never in OS UI. |

Families: `ui` = Geist (`--font-system`), `display` = Montserrat (`--font-display`), `text` = Source Sans Pro (`--font-sans`), `mono` = JetBrains Mono (`--font-mono`). All self-hosted in `src/assets/fonts/`.

### Radius

| Token | Value | Use |
|---|---|---|
| `--r-xs` | 4px | Tooltips, selection pills, menu items, close buttons, segment thumbs. |
| `--r-sm` | 6px | Buttons, tiles, list rows, inner cards (email card), segmented tracks. |
| `--r-md` | 8px | Menus, context menus, floating panels (chat, dress-up), setting groups, icon selection tiles. |
| `--r-pill` | 999px | Chips, the chat composer, the send button. |
| `--r-window` | 4px | Windows: crisp corners by design. Maximized windows go square. |
| `--r-bubble` | 12px | Chat message bubbles only (the tail corner drops to 3px). |
| `--r-dock` | 14px | The dock. |

### Shadow

| Token | Value | Use |
|---|---|---|
| `--soft-s` | `0 1px 2px rgba(0, 0, 0, 0.25)` | The active segment thumb, small raised marks. |
| `--soft-m` | `0 6px 20px rgba(0, 0, 0, 0.3)` | Unfocused windows, tooltips, thought-bubble dots. |
| `--soft-l` | `0 2px 6px rgba(0, 0, 0, 0.2), 0 26px 64px rgba(0, 0, 0, 0.42)` | The focused window and floating panels. |
| `--shadow-menu` | `0 12px 30px rgba(0, 0, 0, 0.3)` | Menus and context menus. |

## Components

### Button

The one button family in Tianchi OS: a hairline secondary and an ink primary.

- Use `.btn` for secondary actions (Reset, Open in new tab, Download PDF) and `.btn.primary` for the one main action in a view.
- Use `.btn.sm` (28px) inside floating panels and chat messages, and `.btn.lg` (38px, 13.5px) for calls to action on reading pages such as About.
- Labels are sentence case and say what happens. Add ` →` only when the button takes the visitor somewhere else.
- Never colour a button: green belongs to the maximize control, blue (`select`) to the visitor's own messages.

### Menu

Dark-glass menus: the Tianchi OS menu under the wordmark and the desktop context menu share one style.

- Items are `ui-control` at weight 560 in Title Case; end an item with `…` when it opens a window with more choices.
- Group items with a `menu-line` separator; keep menus to about six items.
- Hover fills `menu-hover`; items have `r-xs` corners inside the `r-md` menu.
- No keyboard-hint labels or icons inside items.

### Tooltip

Near-black tooltips with white text, the same everywhere: the dock, the snake's thought bubbles.

- Text is `ui-meta` at 600, one short phrase, sentence case, no full stop.
- `tooltip-bg`, `r-xs`, padding 4 × 8, `soft-m`. Use the small tail (`.down`) when the tooltip points at an icon below it.
- Show after a short hover; never put an action inside a tooltip.

### SegmentedControl

A macOS-style segmented control for one choice among two to four options.

- Use it for settings with a few named options (Appearance). Use the hat picker grid for visual choices.
- Labels are one word in sentence case. The active segment is white with `soft-s`; the others are `muted`.
- Put the current option's one-line description in the row's caption, not in a tooltip.

### SettingsGroup

Grouped setting rows for OS apps, on a light grey window body.

- The window body is `#f6f6f8` with `space-panel` padding; the app title is `ui-title`, its subtitle `ui-control` in `muted`.
- Each group is a white `r-md` card with a `hairline` border; rows are separated by hairlines.
- A row has a `ui-body` 600 label, a `ui-meta` caption that says what the setting does or what the current choice means, and its control on the right. Visual pickers stack under the label.
- Only ship settings that work: no placeholders such as "coming soon".

### Chip

Pill chips for suggested questions in the chat.

- Show three on an empty chat and two after the snake declines an off-topic question.
- Write them as the visitor would ask, in sentence case with a question mark.
- Chips send their text when clicked; they are not filters or tags.

### ChatPanel

The snake's chat panel, opened from its head.

- A panel surface: white, `r-md`, `soft-l`, with a tail pointing at the snake's head.
- The snake's bubbles are `surface-2`, the visitor's are `select`; both `r-bubble` with a 3px tail corner, `ui-body` text.
- Actions under an answer are `.btn.sm.primary`; retry is `.btn.sm`; the email hand-off is an inner `r-sm` card.
- The composer is a pill input with a round `select` send button. While locked, the input shows the countdown and a 3px progress line sits above it (`gold` swallowing, `green` digesting).

### ThoughtBubble

The snake's thought bubbles: three on hover (Play, Dress me up, Ask about Tianchi), one at a time when idle.

- White ellipses (60 × 52) fanned over the head, each trailing dots back to it; `soft-l` on clouds, `soft-m` on dots.
- One glyph per cloud: the pixel Snake icon, the dressed-up head, the line chat bubble. No text inside clouds; the caption is a tooltip.
- Idle hints appear 5–10 seconds after load and every 20–30 seconds, and stop for the visit once the visitor finds the menu.

### Window

The window: the one container for every app.

- `surface`, 1px `hairline`, `r-window` (4px, crisp by design), `soft-l` when focused and `soft-m` when not; maximized windows go square with no shadow.
- The titlebar is 30px with only two square controls on the left: `red` close and `green` maximize. Their glyphs (× and diagonal arrows, black at 60%) show on hover.
- The title is `ui-label`; Finder shows a clickable path there instead.
- Maximized reading windows keep a comfortable measure rather than stretching.

