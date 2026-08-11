---
name: ui-components
description: Conventions for building and editing shared UI components in the @packages/ui package. Use this whenever you implement a new component, refactor an existing one, add props, or translate a Claude Design file into code — even if the request doesn't explicitly say "component." Covers the required stack (Base UI + CSS Modules), design-token usage, naming standards, and Storybook theme coverage.
---

# UI Components (@packages/ui)

Conventions for building shared components in `@packages/ui`. Apply these any time you create, refactor, or restyle a component in this package.

## Working from Claude Design files

Claude Design files are a **visual reference only** — they communicate the intended look and behavior, not how to build it. Do not copy or mirror their implementation (markup, class names, inline styles, or component structure). Reproduce the *visual result* using this package's own stack and conventions below.

## Stack

- Build behavior and accessibility primitives with **Base UI**.
- Style with **CSS Modules** — one `.module.css` per component. No inline styles and no other styling libraries.

## Design tokens

- Source every value (color, spacing, radius, typography, shadow, etc.) from the tokens in `@packages/ui/src/tokens/`.
- **Do not introduce new tokens or variables.** Reuse an existing token. If there's no exact match, use the closest existing token with a near-identical value instead of adding one — new tokens fragment the system and cause visual drift, whereas a "close enough" existing token keeps the design coherent.
- If nothing reasonable exists, stop and flag it rather than inventing a variable.

## Naming

- Name components and props with widely recognized, standard terminology — use **Material UI**'s vocabulary as the reference point.
- Avoid project jargon, invented abbreviations, or bespoke names. Standard names make the API predictable for anyone who has used a mainstream component library.

**Examples:**
- Prefer `variant`, `size`, `color`, `disabled`, `startIcon` / `endIcon` over custom equivalents.
- Prefer `Button`, `TextField`, `Menu` over invented names for the same concept.

### CSS Module class names

- Use `camelCase` for class names in `.module.css` files — the first letter of each word capitalized except the first, e.g. `myButton`, `mainContainer`, `headerTitle`.

## Storybook

Every component in `@packages/ui/` **must** ship with Storybook stories, and those stories must render across all **3 themes**. Use the package's existing theming mechanism (decorator / global) rather than inventing one. Multi-theme coverage surfaces token, contrast, and dark/light issues that a single-theme story would hide.