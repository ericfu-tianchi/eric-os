# Tianchi OS — Content Layout Guide

The one layout system for every reading page inside Tianchi OS: project case studies,
"How I Built It" stories, and any future long-form page. It is distilled from the
old tianchi-fu.com (Wix) case studies — measured from the live pages at 1440px — and
tightened where the old site was inconsistent.

**Goal:** every page reads as part of one series by one designer. Generous, confident,
quiet. Structure comes from type and spacing, never from decoration.

Source of truth for the numbers below: `.cs*` rules in `src/styles.css`.
Reference renderer: `ProjectDetailApp` in `src/apps/ProjectsApp.tsx`.

---

## 0. Before building any page: declare the format

Every new page starts by stating which format it uses, and why.

| Format | Use it for | Why |
|---|---|---|
| **Case blocks** (default) — TypeScript data in `src/data/cases*.ts`, rendered by `ProjectDetailApp` | Project case studies, "How I Built It" stories, anything that is text + images + highlights | The renderer enforces this guide. Writing a page = choosing blocks, so pages cannot drift. |
| **Standalone HTML** in `public/` | Only pages that need interaction or a layout the blocks cannot express (live demos, interactive diagrams) | Must still follow §1–§3 by hand. Treat as an exception and say so. |
| **Markdown** | Not used today | Markdown cannot express callouts, feature rows, stats or the meta rail without custom syntax. If we add it later, it must compile to case blocks, never to raw HTML. |

Current inventory:
- Case studies (HomesOffCampus, Neurobot, Connectr, …) → case blocks.
- `About_Me.md` → a hand-built React view (`AboutApp.tsx`); the ".md" is only its file name in the OS.
- My Lego World "How I Built It" → case blocks (`lego-world` in `cases.ts`). It is the reference for non-UX pages: no research/design arc, a set gallery and numbered steps instead.

### Reuse the system, shape the story

The layout is fixed; the structure is not. A UX case study (HomesOffCampus) runs
Overview → Research → Design → Evaluation. A build story (My Lego World) runs
Overview → The Sets → Building a Set → The App. Name sections after what the reader
gets, not after a template. Only include what exists: no role/timeline/tools → no meta
rail; no poster → the solid accent hero; no process → no process section.

---

## 1. Page anatomy

```
┌──────────────────────────────────────────────┐
│ HERO — the project's poster image, as is      │  full bleed, no overlay, no extra title
├──────────────────────────────────────────────┤
│ ○ Overview          <Overview/>               │  section band (white)
│ ○ Research   QUICK BACKGROUND      My Role    │  meta rail beside the opening text only
│ ○ Design     body text …           Timeline   │
│              …                     Tools      │
│              ███ PROBLEM callout ███          │  then the full 880px column
├──────────────────────────────────────────────┤
│                 <Research/>                   │  next band (mist #f6f6f7)
│              …                                │
└──────────────────────────────────────────────┘
```

- **Hero:** the old-site poster (`src/assets/old-site/heroes/<slug>.png`, 1500×589) shown
  full width at its own aspect ratio. Posters already carry the title, so never overlay
  text or gradients on them. No poster → a solid accent band with the project name
  (Montserrat 800, 30–48px) and the subtitle.
- **Sections:** each `CaseSection` is a full-width band. Bands alternate white / mist
  `#f6f6f7`. Every band opens with a centered code-style title: `<Overview/>`.
- **Reading column:** 880px max, centered. Side gutter `clamp(24px, 7cqi, 80px)`.
- **Meta rail (first section only):** My Role / Timeline / Tools in a 200px right rail,
  64px gap, beside the opening text blocks. It stops at the first callout or figure;
  everything after uses the full column. Below 760px the rail becomes a row above the text.
- **Section nav:** dot list floating in the left margin (sticky), only when the window is
  wider than 1180px. Filled dot + accent = current section.
- **Maximized windows** keep this exact measure; never stretch text to the window width.

## 2. Type

| Role | Font | Size / line height | Weight | Color |
|---|---|---|---|---|
| Section title `<Overview/>` | Montserrat | 28 / 1.4 | 700 | `#494949`, centered |
| Label `QUICK BACKGROUND` | Montserrat | 18 / 1.4, uppercase | 700 | accent |
| Sub-heading ■ Problem | Montserrat | 22 / 1.4 | 700 | `#181818`, led by a 9px accent square (12px gap) |
| Body | Source Sans Pro | 16 / 1.7 | 400 | `#181818` |
| Lead / quote / callout text | Source Sans Pro | 19–20 / 1.7 | 400 | `#181818` (white in callouts) |
| Feature title | Montserrat | 28 / 1.3 | 700 | accent |
| Feature text | Source Sans Pro | 18 / 1.7 | 400 | `#494949` |
| Stat number | Montserrat | 36 / 1.2 | 800 | accent |
| Meta label / value | Montserrat 18 700 accent / Source Sans 15 | | | |
| Caption | Source Sans Pro | 14 / 1.5, centered | 400 | `#777` |

Rules: no monospace inside case pages (it belongs to OS chrome). No italics for emphasis;
use **bold** or a ==highlight==. Never more than these sizes.

## 3. Spacing (vertical rhythm)

| Between | Space |
|---|---|
| Band padding (top / bottom) | 88px |
| Section title → first block | 56px |
| Before a label (except the first in a column) | 64px |
| Label → its text | 20px |
| Before a sub-heading | 48px; then 18px |
| Paragraph → paragraph | 18px |
| Figure (above / below) | 40px |
| Callout band (above / below) | 56px |
| Feature row (above / below) | 72px |

Whitespace is the design. When unsure, add space rather than a divider line.

## 4. Color

- **Every page gets an accent.** If Eric names one, use it; otherwise pick the one that best
  fits the subject (a brand or signature color of the thing itself, e.g. LEGO brick red) and say so.
- **One accent per project** (`accent` in the case data), taken from the old site where
  one exists: HomesOffCampus `#4f7cac`, Neurobot `#ff9d1f`, Connectr `#04dac6`,
  Rutabagga `#764c99`, Huawei `#e71b23`, ECE `#0c2649`, Hand-coded site `#494949`.
- The accent is used only for: labels, the sub-heading square, meta labels, stat numbers,
  feature titles, the callout band, the pill button, the active nav dot.
- Highlights use a 16% tint of the accent (`--cs-tint`); findings panels use the same tint.
- Everything else is grayscale. No second accent, no gradients.
- Accent text must stay readable on white; if a brand color is neon, use a deeper shade.

## 5. Block vocabulary (case blocks)

Inline marks in any text: `**bold**`, `==highlight==` (use for the one phrase a skimmer must read), `[text](url)` for source links (Miro boards, docs, reports).

| Block | Renders as | Use when |
|---|---|---|
| `h` | Label, uppercase accent | Starting a topic: Quick Background, Persona, Design Preview |
| `sub` | ■ Sub-heading (pixel square + ink text) | Steps inside a topic: Problem, Goal |
| `p` | Body paragraph | Default text. Keep to 2–4 lines in the column. |
| `callout` | Full accent band, white 19px text | The one problem statement per page (max 1–2 per page) |
| `quote` | Pull quote: centered, 20px weight 600, two 48px hairlines above and below | A definition: problem statement, design principle |
| `list` | Bullets in a tinted panel; `plain: true` for ordinary bullets | Panel only when the findings deserve emphasis; most lists are plain |
| `stat` | Big accent number + label | A number that proves the point |
| `feature` | Screenshot + title + text, sides alternate | Showcasing screens, features or a gallery of results |
| `step` | Auto-numbered 01, 02 … with title + text, hairline rules | How-to sequences and pipelines |
| `img` | Centered figure + caption; `w` = display width in px at 1440 | Evidence, diagrams, logos. Copy `w` from the old site; above 880 the figure breaks out of the column (max 1040) |
| `link` | Accent pill button | One call to action (prototype, slides, live site) |
| `embed` | Live iframe, 16:9 (YouTube) or 16:10 (Figma), up to 1040px wide + caption | Videos and clickable prototypes. Use `youtube-nocookie.com/embed/<id>` and Figma's `figma.com/embed?embed_host=share&url=…` |

## 6. Writing a new page (checklist)

1. State the format (§0). Default: case blocks.
2. Pick the accent; add `accent`, `sub`, `role`, `timeline`, `tools`.
3. Sections are the story arc, 3–7 of them: Overview → Research → Design → Evaluation → Retrospective (rename as needed).
4. Open each topic with an `h` label; use `sub` for its steps.
5. One `callout` for the core problem. One `quote` per definition. Highlights sparingly (≤ 1 per paragraph).
6. Screens go in `feature` rows, not stacked `img`s.
7. Images live in `src/assets/old-site/detail/<slug>/` as WebP at 2× their display width (content may still say `NN.png`; the loader prefers the `.webp`). Never upscale a small export: re-export from the source (old-site originals: `static.wixstatic.com/media/<id>` without the `/v1/fill/...` suffix).
8. Check the page at the default window size and maximized (1440px): measure, rhythm, nothing stretched.

## 7. File icons for reading pages

A reading page's icon is its **cover**, cropped to fill a landscape 4:3 card (never the whole
page shrunk: at 1/12 scale nothing reads). Pages without a cover get their name in Montserrat 800
on the accent color; About uses its portrait and greeting. The card sits in the S4 frame
(one-pixel light-gray hairline, stepped corners, small stepped dog-ear top-right); the content
itself is never pixelated.

In Finder icon view these thumbnails get a 104px slot (other icons stay 66px; a folder that
contains thumbnails gives every item the taller slot so labels line up). Desktop and list view
use the normal icon size.

Files: `src/assets/file-icons/<slug>.webp` (416px = 4x of 104, `about.webp` for About), read by
`fileIconOf()`. Regenerate an icon when a page's cover changes.
