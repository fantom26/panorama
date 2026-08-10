---
name: design-system-tokens
description: Use when building, editing, or styling any UI component, CSS, or style in this repo. Enforces consuming design tokens from the tokens package, and flags — but never fixes — accessibility issues in the tokens themselves.
---

# Design-system token usage

When writing or modifying any component, style, or CSS:

- Consume values only from the `@panorama/tokens` package — reference the CSS custom properties (`var(--…)`) or the exported TS tokens. Never hardcode colors, spacing, radii, type sizes, or shadows.
- Do not introduce new token values or one-off variants. If no existing token covers the need, stop and ask which token to use (or whether to add one) — don't invent one.
- Follow existing conventions: light/dark via `[data-theme]`, CSS Modules against Base UI `data-*` state attributes, logical properties for RTL.

## Accessibility issues in tokens
- If you notice an a11y problem in the tokens themselves (e.g. a foreground/background pair that fails contrast, or a focus-ring token that's too weak), report it: name the exact tokens, the measured issue, and a suggested fix.
- Do NOT modify any token value to fix it. Wait for my explicit approval before changing anything in `@panorama/tokens`.