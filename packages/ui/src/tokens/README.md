# Design token docs

This folder holds the Storybook "Design Tokens" pages — one `.mdx` file per token category (`Colors.mdx`, `Typography.mdx`, `Spacing.mdx`, `BorderRadius.mdx`, `BorderWidth.mdx`, `Animation.mdx`, `ZIndex.mdx`). Each page renders its category's tokens as a table via `storybook-design-token`, through the shared `<TokenThemeSections categoryName='...' />` component (`TokenThemeSections.tsx`). Pass `splitByTheme` to render separate Light/Dark tables for a category, as `Colors.mdx` does for brand colors.

The tokens themselves are built by `@repo/tokens` (Style Dictionary) and consumed here purely for display — this folder doesn't define or transform any token values. See [`packages/tokens/README.md`](../../../tokens/README.md) for the full build system, naming conventions, and file organization.

## Two-tier architecture

**Tier 1 (core/primitive)** tokens define the raw values available to the system — colors, type sizes, spacing steps, etc. — with no meaning attached.

```
Figma:  color/neutral/100
Code:   --ds-color-neutral-100
```

**Tier 2 (semantic/theme)** tokens map Tier 1 values to a specific role in the UI, and are theme-specific.

```
Figma:  color/background/brand
Code:   --ds-theme-color-background-brand
```

Tier 2 token names follow a fixed anatomy: `--ds` (global prefix) → `theme` (tier identifier) → category (`color`, `typography`, `spacing`, `border`, `animation`) → property (`content`, `background`, `border`) → variant (`default`, `brand`, `subtle`, `utility-error`, ...) → state, appended as a suffix rather than a separate segment (e.g. `-hover`, `-disabled`). A bare variant with no suffix means the default state — e.g. `--ds-theme-color-background-brand` is default, `--ds-theme-color-background-brand-hover` is its hover state, `--ds-theme-color-background-brand-disabled` is its disabled state.

## Tier 1 categories

- **Core/Shared** — neutral, utility, and dataviz colors, spacing, and other tokens shared across all themes.
- **Colors** — the primitive color ramp per option (e.g. `brand/gray/500`), categorized (`brand`, `neutral`, `utility`) or uncategorized.
- **Typography** — `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-transform`.
- **Spacing** — raw pixel values on an 8-point grid (e.g. `spacing-16`), managed as core/shared tokens.
- **Border** — `border-radius`, `border-width`, `border-style`.
- **Shadow** — composite tokens referencing transparent colors from the color category, plus `x`, `y`, `blur`, `spread`.
- **Animation** — `duration`, `ease`, and `property` (the style property being animated).
- **Viewports/Breakpoints** — design-only (`small`, `medium`, `large` or `mobile`/`desktop`); not exported to code.
- **z-index** — dev-only stacking order values; managed as core/shared tokens, not applicable in Figma.

## Tier 2 anatomy

`--ds` (global prefix) → `theme`/`semantic` (tier identifier) → category (`color`, `typography`, `spacing`, `border`, `box-shadow`, `animation`) → property (`content`, `background`, `border`) → variant (`default`, `brand`, `subtle`, `utility-error`, `utility-success`, `utility-warning`, `utility-information`, ...) → state (`default`, `hover`, `focus`, `pressed-active`, `disabled`).

- `default` is exclusive to the initial/default variant, and can be omitted so no name infers the default state.
- `hover` describes the hover state; `focus` describes the focus state (the outline `focus` ring itself is handled globally, not per-token).
- `pressed-active` describes the clicked/pressed state.
- `disabled` is technically a state, but is managed as a **variant** rather than a separate state layer — it renders consistently across variants, so folding it into the variant segment avoids duplicating disabled styles per state.
