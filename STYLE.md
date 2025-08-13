# STYLEGUIDE.md

**Baseline:** dark, minimalist UI in the spirit of Gasoline Radio. **Square geometry only** (no rounded corners). **Black background, white text.** Buttons are black with a thin white border and turn gray on hover.

---

## 1) Design Principles

- Content-first, high-contrast, low-chrome.
- Rectangular blocks, thin 1px borders, no shadows unless needed for separation.
- Subtle, fast transitions; avoid flashy motion.
- Mobile-first; scale up to a centered, fixed-width layout on desktop.
- Accessibility: visible focus, sufficient contrast, keyboard-friendly.

---

## 2) Core Palette

|          Token | Hex                                 | Use                                |
| -------------: | :---------------------------------- | :--------------------------------- |
|      `bg.base` | `#000000`                           | Page background, buttons (default) |
|  `bg.surface1` | `#0A0A0A`                           | Panels, cards                      |
|  `bg.surface2` | `#121212`                           | Hovered cards/rows                 |
|   `fg.primary` | `#FFFFFF`                           | Headlines, button text             |
| `fg.secondary` | `#B3B3B3`                           | Body copy                          |
|     `fg.muted` | `#8A8A8A`                           | Placeholders, meta                 |
|       `border` | `#FFFFFF` (buttons), `#262626` (UI) | 1px outlines                       |
|    `btn.hover` | `#333333`                           | Button hover background            |

> Keep UI largely monochrome. Use accent color only if absolutely needed; otherwise stick to black/white/gray.

---

## 3) Typography

- **Family:** `"Inter", "Space Grotesk", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semibold)
- **Sizes:**
  - Display: 44px
  - XL: 28px
  - L: 22px
  - Base: 16px
  - S: 14px

- **Line-height:** 1.25–1.5
- **Links:** white text, no underline by default; underline on hover/focus.

---

## 4) Layout & Spacing

- **Container:** max-width 1200–1280px, centered; side padding 24px.
- **Grid:** simple single column on mobile; up to 12 columns on desktop with 16–24px gutters.
- **Vertical rhythm:** sections spaced 64–80px.
- **Dividers:** 1px `#262626`.

---

## 5) Components (Square Only)

### 5.1 Buttons — “Load More” Pattern (canonical)

**Visual summary:** rectangular, black background, thin **white** border (1px), **white** all-caps label; on hover the background turns **gray** while border and text remain **white**.

**States**

- **Default:** bg `#000`, text `#FFF`, border `#FFF`
- **Hover:** bg `#333`, text `#FFF`, border `#FFF`
- **Active (Pressed):** bg `#2A2A2A`
- **Focus-visible:** 2px white outline offset (or inner ring) in addition to the white border
- **Disabled:** bg `#0A0A0A`, border `#262626`, text `#8A8A8A`, cursor not-allowed

**Sizing**

- Height: S `36px`, M `42px` (default), L `48px`
- Padding: S `8px 12px`, M `10px 16px`, L `12px 20px`
- Letter-spacing: `0.02em`
- Text-transform: `uppercase`

**Do**

- Keep corners square (border-radius: 0)
- Maintain high contrast
- Center the label both axes

**Don’t**

- Don’t add drop shadows or gradients
- Don’t change text color on hover
- Don’t round corners

### 5.2 Inputs (text/select/textarea)

- Square corners, height `42px` (textarea auto).
- bg `#0A0A0A`, text `#FFF`, border `#262626`.
- Placeholder `#8A8A8A`.
- Focus: border `#FFF` + subtle 2px outline (or inner ring).

### 5.3 Cards / Panels

- bg `#0A0A0A`, border `#262626`, padding `24px`, square corners.
- Hoverable cards may shift bg to `#121212`.

### 5.4 Badges / Tags

- Inline-block, 1px border `#262626`, uppercase 12–14px, square corners.
- Use monochrome; avoid color fills.

### 5.5 Header / Nav

- Height `64px`, border-bottom `#262626`, sticky optional.
- Nav links: white → underline on hover/focus.

---

## 6) Motion

- Transition properties: background-color, color, border-color.
- Duration: 120–180ms, ease-out.
- Avoid transforms for core interactions; keep motion minimal.

---

## 7) Accessibility

- Contrast: aim ≥ 7:1 for body text on black; links and buttons are white on black.
- Focus: must be clearly visible on all interactive elements (2px outline).
- Hit targets: min 44×44px for touch.
- Don’t rely on color alone—use borders/underline for states.

---

## 8) CSS Variables (Drop-in)

```css
:root {
  /* Color */
  --bg-base: #000000;
  --bg-surface1: #0a0a0a;
  --bg-surface2: #121212;

  --fg-primary: #ffffff;
  --fg-secondary: #b3b3b3;
  --fg-muted: #8a8a8a;

  --border-ui: #262626;
  --border-strong: #ffffff;

  --btn-hover: #333333;

  /* Type & spacing */
  --ff-sans:
    'Inter', 'Space Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  --fs-dsp: 44px;
  --fs-xl: 28px;
  --fs-lg: 22px;
  --fs-base: 16px;
  --fs-sm: 14px;
  --lh-tight: 1.25;
  --lh-normal: 1.5;

  --sp-xs: 4px;
  --sp-sm: 8px;
  --sp-md: 12px;
  --sp-lg: 16px;
  --sp-xl: 24px;
  --sp-xxl: 40px;

  color-scheme: dark;
}

html,
body {
  background: var(--bg-base);
  color: var(--fg-primary);
  font-family: var(--ff-sans);
  line-height: var(--lh-normal);
}
```

---

## 9) Component CSS (Copy-paste)

### 9.1 Button (canonical “LOAD MORE”)

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  height: 42px; /* S: 36px, L: 48px */
  padding: 10px 16px; /* S: 8px 12px, L: 12px 20px */
  border: 1px solid var(--border-strong);
  background: var(--bg-base);
  color: var(--fg-primary);

  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-weight: 600;
  user-select: none;
  cursor: pointer;

  border-radius: 0; /* square */
  transition:
    background-color 0.15s ease-out,
    border-color 0.15s ease-out,
    color 0.15s ease-out;
}

.button:hover {
  background: var(--btn-hover);
}
.button:active {
  background: #2a2a2a;
}
.button:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}

.button[disabled],
.button[aria-disabled='true'] {
  background: var(--bg-surface1);
  color: var(--fg-muted);
  border-color: var(--border-ui);
  cursor: not-allowed;
}
```

### 9.2 Input

```css
.input,
.select,
.textarea {
  width: 100%;
  height: 42px;
  padding: 10px 12px;

  background: var(--bg-surface1);
  color: var(--fg-primary);
  border: 1px solid var(--border-ui);

  border-radius: 0;
  outline: none;
  transition:
    border-color 0.15s ease-out,
    background-color 0.15s ease-out;
}

.input::placeholder,
.textarea::placeholder {
  color: var(--fg-muted);
}
.input:focus,
.select:focus,
.textarea:focus {
  border-color: var(--border-strong);
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}
.textarea {
  height: auto;
  min-height: 120px;
  resize: vertical;
}
```

### 9.3 Card

```css
.card {
  background: var(--bg-surface1);
  border: 1px solid var(--border-ui);
  padding: var(--sp-xl);
  border-radius: 0;
}
.card--interactive:hover {
  background: var(--bg-surface2);
}
```

---

## 10) HTML Examples

```html
<button class="button" type="button">Load More</button>

<input class="input" type="text" placeholder="Search…" />

<div class="card">
  <h3
    style="font-size:var(--fs-lg); line-height:var(--lh-tight); margin:0 0 12px 0;"
  >
    Card Title
  </h3>
  <p style="color:var(--fg-secondary); margin:0;">Body text goes here.</p>
</div>
```

---

## 11) LLM Rules (apply verbatim)

- Use **square corners everywhere** (no `border-radius`).
- Page and buttons are **black** by default; button hover turns **gray** while text and border stay **white**.
- Prefer monochrome; avoid color accents unless explicitly requested.
- Use thin 1px borders to separate elements; use `#FFFFFF` only for the “Load More” button border; use `#262626` elsewhere.
- Keep motion minimal (≤180ms, ease-out), never block content with animations.
- Maintain WCAG-compliant contrast and visible focus outlines on all interactive elements.
