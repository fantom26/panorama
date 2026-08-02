# Design Token System

A production-ready design token system built with Style Dictionary, featuring a two-tier architecture (Core and Semantic tokens) with multi-theme support.

## Overview

This token system follows industry best practices and demonstrates a professional design system architecture:

- **Tier 1 (Core)**: Theme-agnostic foundational tokens (colors, typography, spacing, shadows, borders, animation, z-index)
- **Tier 2 (Semantic)**: Theme-specific semantic tokens that reference Tier 1 tokens
- **Multi-theme support**: Light, Dark, and High Contrast themes
- **Multiple output formats**: CSS custom properties, JavaScript/TypeScript modules, and JSON

## Usage

This is an internal workspace package (`@repo/tokens`), not published to npm. To use it from another package in this monorepo, add it as a workspace dependency:

```json
"dependencies": {
  "@repo/tokens": "workspace:*"
}
```

## Quick Start

### CSS Usage

Import the CSS file for your theme:

```css
@import '@repo/tokens/light/build/css/tokens.css';
```

Or use the theme class variant:

```css
@import '@repo/tokens/light/build/css/light.css';
```

Then use the tokens in your CSS:

```css
.button {
  background-color: var(--ds-theme-color-background-brand);
  color: var(--ds-theme-color-content-brand);
  padding: var(--ds-theme-spacing-md);
  border-radius: var(--ds-theme-border-radius-md);
}
```

### JavaScript/TypeScript Usage

```javascript
import tokens from '@repo/tokens/light/build/js/tokens.js';

console.log(tokens.DsThemeColorBackgroundBrand);
console.log(tokens.DsThemeSpacingMd);
```

With TypeScript, you'll get full type safety:

```typescript
import tokens from '@repo/tokens/light/build/js/tokens.js';

const spacing: string = tokens.DsThemeSpacingMd; // Type-safe!
```

### JSON Usage

```javascript
import tokens from '@repo/tokens/light/build/json/tokens.json';

console.log(tokens['ds-theme-color-background-brand']);
```

## Token Structure

### Tier 1: Core Tokens

Core tokens are theme-agnostic foundational values:

- **Colors**: Neutral palette, utility colors (shared in `core/`)
- **Z-index**: Layering scale (shared in `core/`)
- **Typography**: Font families, sizes, weights, line heights, letter spacing
- **Spacing**: Global dimension scale
- **Shadows**: Shadow definitions with individual properties
- **Borders**: Border radius and width scales
- **Animation**: Duration and easing values

### Tier 2: Semantic Tokens

Semantic tokens reference Tier 1 tokens and are theme-specific:

- **Colors**: Background, content, and border colors organized by semantic purpose
- **Typography**: Text styles (display, headline, title, label, body, meta) with mobile variants
- **Spacing**: Semantic spacing aliases (none, 3xs, 2xs, xs, sm, md, lg, xl, 2xl, 3xl)
- **Shadows**: Semantic shadow tokens (box-shadow)
- **Borders**: Semantic border tokens
- **Animation**: Semantic animation tokens

## Themes

### Light Theme

Default light theme with neutral colors and standard contrast.

```css
@import '@repo/tokens/light/build/css/tokens.css';
```

### Dark Theme

Dark theme optimized for low-light environments.

```css
@import '@repo/tokens/dark/build/css/tokens.css';
```

### High Contrast Theme

High contrast theme for improved accessibility.

```css
@import '@repo/tokens/high-contrast/build/css/tokens.css';
```

## Building Tokens

To build all themes:

```bash
pnpm build:tokens
```

To build a specific theme:

```bash
pnpm build:tokens:light
pnpm build:tokens:dark
pnpm build:tokens:high-contrast
```

Build outputs are generated in `{theme}/build/` directories:
- `css/` - CSS custom properties
- `js/` - JavaScript/TypeScript modules
- `json/` - Flattened JSON

## Token Naming Conventions

### CSS Output

- Tier 1 tokens: `--ds-{token-name}` (kebab-case)
- Tier 2 tokens: `--ds-theme-{token-name}` (kebab-case with theme prefix)

Example:
```css
--ds-color-neutral-100
--ds-theme-color-background-brand
```

### JavaScript/TypeScript Output

- Tier 1 tokens: `Ds{TokenName}` (PascalCase)
- Tier 2 tokens: `DsTheme{TokenName}` (PascalCase with theme prefix)

Example:
```javascript
DsColorNeutral100
DsThemeColorBackgroundBrand
```

## Architecture

The token system uses a two-tier architecture:

1. **Core Tier 1 tokens** (`core/tier-1-definitions/`): Shared foundational values
2. **Theme-specific Tier 1 tokens** (`{theme}/tier-1-definitions/`): Theme-specific foundational values
3. **Semantic Tier 2 tokens** (`{theme}/tier-2-usage/`): Semantic tokens that reference Tier 1

This architecture ensures:
- Consistency across themes
- Easy theme customization
- Clear separation of concerns
- Maintainable token structure

## File Organization

```
packages/tokens/
├── core/                        # Shared Tier 1 tokens
│   └── tier-1-definitions/
│       ├── colors.json
│       └── z-index.json
├── light/                       # Light theme
│   ├── tier-1-definitions/
│   └── tier-2-usage/
├── dark/                        # Dark theme
│   ├── tier-1-definitions/
│   └── tier-2-usage/
└── high-contrast/               # High contrast theme
    ├── tier-1-definitions/
    └── tier-2-usage/
```

## Contributing

When contributing tokens:

1. Always reference Tier 1 tokens from Tier 2 using `{token.path}` syntax
2. Never hardcode values in Tier 2 tokens
3. Maintain consistent token structure across all themes
4. Follow the naming conventions (kebab-case for CSS, PascalCase for JS)
