# Cline Rules

## Mandatory Styleguide Reading

**CRITICAL RULE: Before performing ANY task involving UI/UX, styling, components, or visual design, you MUST first read the project's styleguide located at `STYLE.md`.**

### When to Read the Styleguide

Read `STYLE.md` before:

- Creating or modifying any React components
- Writing or updating CSS/styling code
- Making design decisions
- Implementing UI layouts
- Adding colors, typography, or visual elements
- Creating buttons, forms, cards, or other UI components
- Making accessibility improvements
- Any task that affects the visual appearance of the application

### Implementation Requirements

1. **Always read `STYLE.md` first** using the `read_file` tool
2. **Apply the styleguide principles** from the document:
   - Use the specified color palette (dark theme with accent colors)
   - Follow typography guidelines (Inter/Space Grotesk fonts)
   - Implement square corners (no border-radius)
   - Use proper spacing and layout principles
   - Apply the component styling rules
   - Ensure accessibility standards are met
3. **Reference the styleguide** when making design decisions
4. **Maintain consistency** with existing styled components

### Styleguide Summary (for quick reference after reading full document)

- **Theme**: Dark, high-contrast, minimal UI with square corners
- **Colors**: Dark backgrounds (#0A0A0A, #121212), white text, yellow (#FFD400) and cyan (#00FFE1) accents
- **Typography**: Inter/Space Grotesk, weights 400-700, sizes 14-44px
- **Components**: Square buttons, bordered inputs, subtle hover effects
- **Motion**: Fast transitions (100-180ms), ease-out timing
- **Layout**: Max 1200-1280px width, 12-column grid, proper spacing

### Enforcement

This rule is **mandatory** and **non-negotiable**. Failure to read the styleguide before UI/design tasks will result in inconsistent styling that doesn't match the project's design system.
