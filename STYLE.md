Here’s a **simplified, universal `STYLEGUIDE.md`** version of the Gasoline Radio style rules, so another LLM can easily apply it to any design project.

---

# STYLEGUIDE.md

## 1. Design Principles

- **Dark, high-contrast, minimal** UI.
- **Square corners** everywhere — no rounding.
- Monochrome base + bold accent colors.
- Thin borders, clear grids, simple typography.
- Subtle, fast hover/focus effects.

---

## 2. Colors

| Purpose          | Hex       |
| ---------------- | --------- |
| Background       | `#0A0A0A` |
| Surface 1        | `#121212` |
| Surface 2        | `#1A1A1A` |
| Text Primary     | `#FFFFFF` |
| Text Secondary   | `#B3B3B3` |
| Text Muted       | `#8A8A8A` |
| Border Subtle    | `#262626` |
| Border Strong    | `#2F2F2F` |
| Accent Primary   | `#FFD400` |
| Accent Secondary | `#00FFE1` |
| Danger           | `#FF3B3B` |
| Success          | `#3BFF8A` |
| Warning          | `#FFC02E` |

---

## 3. Typography

- **Font**: `"Inter", "Space Grotesk", system-ui, sans-serif`
- **Weights**: 400 / 500 / 600 / 700
- **Sizes**:
  - Display: 44px
  - XL: 28px
  - L: 22px
  - Base: 16px
  - Small: 14px

- **Links**: Accent color, underline on hover/focus.

---

## 4. Layout

- Max width: 1200–1280px.
- 12-column grid, 16–24px gutters.
- Sections: 64–80px vertical spacing.
- 1px borders using subtle border color.

---

## 5. Components

### Buttons

- Square corners, uppercase text.
- Primary: Accent primary background, black text.
- Ghost: Transparent background, subtle border.
- Hover: Slight darken or subtle overlay.
- Sizes: S (36px), M (42px), L (48px).

### Inputs

- Square, 1px subtle border, surface background.
- Placeholder: muted text color.
- Focus: Accent secondary border glow.

### Cards

- Surface 1 background, subtle border.
- Interactive hover: Surface 2 background.

### Badges

- Small uppercase text, 1px border.
- Accent badge: accent color border and text.

---

## 6. Motion

- Fast (100–180ms) ease-out transitions.
- Hover: background or border-color change.
- Avoid heavy animations.

---

## 7. Imagery

- High-contrast images.
- Square corners, 1px subtle border.
- Hover: Slight contrast/brightness increase.

---

## 8. Accessibility

- Maintain WCAG AA contrast.
- Visible focus outlines.
- Avoid color-only indicators.
