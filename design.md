# Git Blame — Design System Documentation
> Extracted from Stitch Project: "Among us for coders" (ID: 10349796043570877876)
> Theme: **"The High-Tech Toybox"** — Tactical Vibrancy / Neobrutalist Chunky

---

## 1. Font System

### Font Families

| Role | Font | Source |
|---|---|---|
| **Primary / Display / Headlines** | Plus Jakarta Sans | Google Fonts |
| **Body / Titles / UI Text** | Be Vietnam Pro | Google Fonts |
| **Mono / Code Editor** | JetBrains Mono | Google Fonts (fallback: Fira Code) |

### Font Imports (Google Fonts)
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

### Font Weights
- **Plus Jakarta Sans:** 700 (Bold), 800 (ExtraBold) — headlines only
- **Be Vietnam Pro:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **JetBrains Mono:** 400 (Regular), 500 (Medium)

### Font Sizes

| Use Case | Size | Weight | Font |
|---|---|---|---|
| Display / Hero Title | `3rem` (48px) | 800 | Plus Jakarta Sans |
| Headline LG (Screen Title) | `2rem` (32px) | 700 | Plus Jakarta Sans |
| Headline MD (Section Title) | `1.5rem` (24px) | 700 | Plus Jakarta Sans |
| Headline SM (Card Title) | `1.25rem` (20px) | 700 | Plus Jakarta Sans |
| Body LG (Standard UI Text) | `1rem` (16px) | 400/500 | Be Vietnam Pro |
| Body MD | `0.875rem` (14px) | 400 | Be Vietnam Pro |
| Body SM / Labels | `0.75rem` (12px) | 500/600 | Be Vietnam Pro |
| Button Text | `0.875rem` (14px) | 700 | Plus Jakarta Sans |
| Timer Display | `2.5rem` (40px) | 800 | Plus Jakarta Sans |
| Timer Warning (<10s) | `2.5rem` (40px) | 800 + pulse animation | Plus Jakarta Sans |
| Code Snippets | `0.875rem` (14px) | 400 | JetBrains Mono |
| Code Line Numbers | `0.75rem` (12px) | 400 | JetBrains Mono |

### Typography Rules
- Headlines: minimum **2x size** differential vs. body text
- Headlines ≥ `headline-lg`: apply text-stroke or heavy drop-shadow for "bubble font" effect
- `body-lg` (1rem) is standard — keeps the chunky, accessible feel

---

## 2. Color Palette

### Primary Colors

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#ba0209` | Red — Impostor accent, danger, primary CTAs |
| `primary-bright` | `#C51111` | Among Us brand red |
| `primary-container` | `#ff7766` | Red highlight / gradient end |
| `primary-dim` | `#a40006` | Darker red for hover states |
| `on-primary` | `#ffefed` | Text on red backgrounds |
| `on-primary-container` | `#4f0001` | Dark red for 3D button border |

### Secondary Colors (Crewmate)

| Token | Hex | Usage |
|---|---|---|
| `secondary` | `#3046e3` | Blue — Crewmate accent, action buttons |
| `secondary-bright` | `#132ED1` | Among Us brand blue |
| `secondary-container` | `#caceff` | Blue highlight, selected states |
| `secondary-dim` | `#1f37d7` | Darker blue for hover |
| `on-secondary` | `#f3f1ff` | Text on blue backgrounds |
| `on-secondary-container` | `#0e2bcf` | Text on blue containers |

### Tertiary Colors (Accent / Warning)

| Token | Hex | Usage |
|---|---|---|
| `tertiary` | `#5f5f00` | Dark yellow/olive |
| `tertiary-bright` | `#F6F657` | Among Us brand yellow |
| `tertiary-container` | `#fefe5e` | Yellow highlight |
| `on-tertiary-container` | `#616100` | Text on yellow |

### Surface / Background Colors

| Token | Hex | Usage |
|---|---|---|
| `surface` | `#f3f6ff` | **Background Primary** — base page background |
| `surface-lowest` | `#ffffff` | Card backgrounds, highest contrast |
| `surface-low` | `#e9f1ff` | **Background Secondary** — secondary sections |
| `surface-container` | `#dde9fc` | Interactive container backgrounds |
| `surface-high` | `#d6e4f8` | Slightly elevated containers |
| `surface-highest` | `#cfdef4` | Input fields, top-level containers |
| `surface-dim` | `#c6d6ec` | Slightly darker tone (replaces dark-mode grey) |
| `surface-bright` | `#f3f6ff` | Same as surface |

### Text Colors

| Token | Hex | Usage |
|---|---|---|
| `on-surface` | `#262f3b` | **Text Primary** — all body text |
| `on-surface-variant` | `#525c6a` | **Text Secondary** — labels, placeholders |
| `outline` | `#6e7886` | **Border Color** — default borders |
| `outline-variant` | `#a4aebd` | **Border Color (soft)** — subtle separators |

### Semantic Colors

| Role | Hex | Token |
|---|---|---|
| **Accent (Crewmate)** | `#3046e3` | `secondary` |
| **Accent (Impostor)** | `#ba0209` | `primary` |
| **Error / Danger** | `#b41340` | `error` |
| **Error Bright** | `#f74b6d` | `error-container` |
| **Success** | `#3046e3` (blue) | `secondary` |
| **Warning** | `#fefe5e` | `tertiary-container` |
| **Editor Background** | `#1e1e2e` | Custom (VS Code dark) |
| **Editor Text** | `#cdd6f4` | Custom (Catppuccin mocha) |
| **Editor Line Numbers** | `#585b70` | Custom |

### Gradients

| Name | Value | Usage |
|---|---|---|
| Primary CTA | `linear-gradient(160deg, #ba0209 0%, #ff7766 100%)` | Main action buttons |
| Secondary CTA | `linear-gradient(160deg, #3046e3 0%, #caceff 100%)` | Secondary buttons |
| Impostor Reveal | `linear-gradient(160deg, #ba0209, #4f0001)` | Role reveal overlay |

---

## 3. Neobrutalist Styling System

### Border Thickness
```
- Default Border:     3px solid #262f3b (on-surface)
- Thick Border:       4px solid #262f3b
- Thin/Soft Border:   2px solid #a4aebd (outline-variant)
- Input Border:       3px solid #6e7886 (outline)
- Input Focus:        3px solid #3046e3 (secondary)
- RULE: Never use 1px lines. Minimum 3px or use color shifts.
```

### Border Radius
```
- Buttons:            9999px (fully rounded / pill)
- Cards:              16px (rounded-2xl)
- Inputs:             12px (rounded-xl)
- Modals:             20px (rounded-3xl)
- Avatar:             9999px (circle)
- Badges:             9999px (pill)
- Code Editor:        16px (rounded-2xl)
- Player Cards:       12px (rounded-xl)
- Speech Bubbles:     24px (rounded-3xl) + triangle tail
```

### Box Shadows (3D Push-Button Effect)

| Name | Value | Usage |
|---|---|---|
| `chunky` | `4px 4px 0px 0px #262f3b` | Standard cards |
| `chunky-sm` | `2px 2px 0px 0px #262f3b` | Player cards, small elements |
| `chunky-lg` | `6px 6px 0px 0px #262f3b` | Modals, hero cards |
| `chunky-red` | `4px 4px 0px 0px #ba0209` | Impostor-themed elements |
| `chunky-blue` | `4px 4px 0px 0px #3046e3` | Crewmate-themed elements |
| `float` | `0 8px 32px 0 rgba(38,47,59,0.12)` | Floating modals |
| `glow-red` | `0 0 20px rgba(186,2,9,0.4)` | Impostor glow effect |
| `glow-blue` | `0 0 20px rgba(48,70,227,0.4)` | Crewmate glow effect |

### Button Styles

#### Primary Button (Red — Impostor/CTA)
```
Default:
  background: linear-gradient(160deg, #ba0209, #ff7766)
  border: 3px solid #4f0001
  border-radius: 9999px
  box-shadow: 3px 3px 0px #4f0001      ← 3D push effect
  color: #ffefed
  padding: 12px 24px
  font: 700 14px Plus Jakarta Sans

Hover:
  background: linear-gradient(160deg, #a40006, #ff5b4b)
  box-shadow: 4px 4px 0px #4f0001
  transform: translate(-1px, -1px)

Active:
  box-shadow: none
  transform: translate(3px, 3px)        ← simulates button press

Disabled:
  background: #cfdef4
  border-color: #a4aebd
  box-shadow: none
  color: #6e7886
  cursor: not-allowed
  opacity: 0.6
```

#### Secondary Button (Blue — Crewmate/Action)
```
Default:
  background: #3046e3
  border: 3px solid #001aa4
  box-shadow: 3px 3px 0px #001aa4
  color: #f3f1ff

Hover:
  background: #1f37d7
  box-shadow: 4px 4px 0px #001aa4
  transform: translate(-1px, -1px)

Active:
  box-shadow: none
  transform: translate(3px, 3px)
```

#### Danger Button (Error Red)
```
Default:
  background: #b41340
  border: 3px solid #510017
  box-shadow: 3px 3px 0px #510017
  color: #ffefed
```

#### Ghost Button
```
Default:
  background: #ffffff
  border: 3px solid #262f3b
  box-shadow: 3px 3px 0px #6e7886
  color: #262f3b

Hover:
  background: #e9f1ff
```

### Card Styles
```
Standard Card:
  background: #ffffff
  border: 3px solid #262f3b
  border-radius: 16px
  box-shadow: 4px 4px 0px #262f3b
  padding: 20px

Container Card:
  background: #e9f1ff
  border: 3px solid #262f3b
  border-radius: 16px
  box-shadow: 4px 4px 0px #262f3b
  padding: 20px

Modal:
  background: #ffffff
  border: 3px solid #262f3b
  border-radius: 20px
  box-shadow: 6px 6px 0px #262f3b
  padding: 32px
  backdrop: rgba(38,47,59,0.5) blur(8px)
```

### Container Padding / Margins
```
Page padding:          24px (1.5rem)
Section gap:           32px (2rem)  ← "default breathing room"
Card padding:          20px (1.25rem)
Element gap (cards):   16px (1rem)
List item gap:         22.4px (1.4rem)  ← No dividers, use gap
Input padding:         12px 16px
Button padding:        12px 24px
Button padding SM:     8px 16px
```

---

## 4. Component States

### Buttons
| State | Visual Change |
|---|---|
| Default | Gradient/color fill + 3px chunky shadow |
| Hover | Darker shade + 4px shadow + translate(-1px,-1px) |
| Active | No shadow + translate(3px,3px) — simulates press |
| Disabled | Grey bg (#cfdef4), no shadow, 60% opacity |
| Loading | Spinner icon replacing text, reduced opacity |

### Modals
| State | Visual Change |
|---|---|
| Closed | `display: none` / `opacity: 0, scale: 0.9` |
| Opening | Framer Motion: `opacity: 0→1, y: 40→0, scale: 0.9→1` (300ms spring) |
| Open | Full opacity, backdrop blur active |
| Voting State | Player grid highlighted, timer pulsing, vote counts visible |
| Closing | Reverse of opening |

### Player Cards
| State | Visual Change |
|---|---|
| Default | White bg, black border, chunky-sm shadow |
| Hover | translate(-2px,-2px), chunky shadow |
| Selected | `secondary-container` (#caceff) bg, blue border (#3046e3), blue shadow |
| Voted | Shows vote pip (red dot) below avatar |
| Suspected | Yellow border (#fefe5e), warning badge |
| Eliminated | 50% opacity, grayscale(0.7), line-through on name |

### Timer
| State | Visual Change |
|---|---|
| Running | Normal display, `on-surface` color |
| Warning (<30s) | `error` color (#b41340) |
| Critical (<10s) | `error` color + `pulse_warning` animation (scale 1→1.05, 0.8s loop) |
| Expired | `0:00` frozen, triggers voting or end state |

### Code Editor
| State | Visual Change |
|---|---|
| Default | Dark Monaco theme, normal cursor |
| Focused | Subtle border glow |
| Sabotage — Flashbang | Full-screen white overlay: `opacity 0→0.95→0` over 1.5s |
| Sabotage — Typo Inject | Random characters inserted, red highlight |
| Sabotage — Cursor Ghost | Fake cursors appear at random positions |
| Sabotage — Lag Spike | Artificial delay on keystrokes (CSS filter + jitter) |

---

## 5. Layout Grid

### Container Max-Widths
```
Full bleed:        100vw
Max page width:    1440px
Standard content:  1280px
Narrow content:    960px
```

### Grid System
```
Main Game Layout (3-column):
  Sidebar Left:    280px fixed
  Editor Center:   flex-1 (fills remaining)
  Sidebar Right:   320px fixed
  Gap:             0 (sections separated by bg color)

Lobby Layout (2-column):
  Player Grid:     flex-1
  Chat Sidebar:    360px fixed
  Gap:             24px

Voting Grid:
  Player Grid:     repeat(auto-fill, minmax(160px, 1fr))
  Gap:             16px

Dashboard Grid:
  Stats Row:       repeat(4, 1fr)
  Gap:             16px
```

### Responsive Breakpoints (Tailwind)
```
sm:   640px   → Stack columns
md:   768px   → Tablet layout
lg:   1024px  → Desktop layout (primary target)
xl:   1280px  → Full design width
2xl:  1536px  → Wide screens
```

### Spacing Scale
```
spacing-1:   4px
spacing-2:   8px
spacing-3:   12px
spacing-4:   16px
spacing-5:   20px
spacing-6:   24px   ← default element gap
spacing-8:   32px   ← section breathing room
spacing-10:  40px
spacing-12:  48px
spacing-16:  64px
```

---

## 6. Screens Reference

| Screen | Title | ID |
|---|---|---|
| 1 | Pre-Game Lobby: The Crew Assembly | `7dfdd3d7` |
| 2 | The Coding Bay: Gameplay Interface | `a1d599fc` |
| 3 | The Coding Bay: Sabotage Active | `89a92b76` |
| 4 | Meeting & Voting: The Deliberation Room | `7b4e97cd` |
| 5 | Main Dashboard: The Mission Command | `a2b2aafb` |
| 6 | Defeat Screen: The Impostor Wins | `e8d5fa6e` |
| 7 | Victory Screen: The Final Outcome | `18bcf24d` |
| 8 | Deliberation Room: Cosmic Vote | `c0304974` |
| 9 | Pre-Game Lobby: Cosmic Assembly | `04feca33` |
| 10 | Main Dashboard: Cosmic Edition | `0ee63f52` |
| 11 | The Coding Bay: Cosmic Interface | `a77054af` |

---

## 7. Special Effects

### Sabotage: Flashbang (Light Mode Flash)
```css
@keyframes flashbang {
  0%   { background: rgba(255,255,255,0); }
  10%  { background: rgba(255,255,255,0.95); }
  100% { background: rgba(255,255,255,0); }
}
/* Apply as fixed full-screen overlay, z-index: 9999, duration: 1.5s */
```

### Screen Shake
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
  20%, 40%, 60%, 80% { transform: translateX(6px); }
}
/* Apply to root container for dramatic moments */
```

### Role Reveal Glitch
```
Framer Motion sequence:
1. Full screen overlay fades in (0.3s)
2. Role text scales from 0.5 → 1.2 → 1.0 (spring)
3. Glitch clip-path animation on text (0.4s)
4. Hold for 2.5s
5. Fade out (0.5s)
```

### Glassmorphism (Nav / Speech Bubbles)
```css
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(12px);
border: 1px solid rgba(164, 174, 189, 0.3);
```

---

## 8. Design Principles (Do's and Don'ts)

### ✅ Do
- Use **chunky 3px+ borders** — never 1px lines
- Use **gap + color shifts** instead of dividers for list items
- Let speech bubbles and elements **overlap card edges** (intentional asymmetry)
- Use `spacing-6` (24px) as default breathing room between major elements
- Use **Lucide** or **Feather** icons with `stroke-width: 2.5–3px`
- Primary CTAs: always use the red gradient, never flat red
- Maintain **2x size differential** between headline and body text

### ❌ Don't
- Don't use **1px borders** — minimum 3px if line is needed
- Don't use **dark grey backgrounds** — use `surface-dim` (#c6d6ec) max
- Don't use **flat icon sets** — thick stroke icons only
- Don't use **horizontal dividers** in lists
- Don't apply **dark mode** — this is a light, vibrant system
- Don't use **plain colors** (flat red, flat blue) for primary CTAs
