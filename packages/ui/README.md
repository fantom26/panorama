# @repo/ui

Shared React UI component library for Panorama — built with Vite, styled with CSS Modules against `@repo/tokens`, and documented in Storybook.

## Installation

This is a private, workspace-only package (pnpm workspaces / Turborepo) — it isn't published to npm. Reference it from another package in this monorepo:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

```tsx
import { Button, TextField } from '@repo/ui'
```

## Import conventions

Use `@repo/<package>` imports when consuming another workspace package, for example
`@repo/ui`, `@repo/tokens`, or `@repo/i18n`. The `@/*` alias is private to this package
and points to `packages/ui/src`; it is available only inside this package's source and
Storybook configuration. Consumers should use the public `@repo/ui` entry point, never
`@repo/ui/src/...` or `@/...` imports.

The package uses Just-in-Time workspace resolution today. The consumer's toolchain
compiles the UI source directly, so the package entry point keeps relative imports even
though internal source files use `@/*`.

## Importing styles

```tsx
import '@repo/ui/styles.css'
```

Import this once, near the app root (e.g. `apps/web/app/layout.tsx`). It bundles the `@repo/tokens` light and dark CSS custom properties, the `@fontsource/geist-sans` font faces, and the package's own `normalize.css`.

## Theme support

Set `data-theme="light"` or `data-theme="dark"` on a root element — every token resolves off that attribute:

```tsx
<html data-theme='dark'>
```

Only `light` and `dark` themes exist today (built by `@repo/tokens`); there's no `system`/auto-detect theme built in, so the consuming app is responsible for setting the attribute. Storybook exposes both via a toolbar toggle, so individual stories don't need dedicated per-theme variants — every story already renders in both.

## i18n support

Many components pull their own copy (aria-labels, empty states, etc.) through `react-i18next`'s `useTranslation()` — e.g. `CloseButton`'s default `aria-label`, `DataTable`'s empty/error text. Those production strings live in `@repo/i18n` (`common` and `ui` namespaces, en/ar), not in this package.

`src/i18n.ts` initializes an `i18next` instance directly from `@repo/i18n`'s bundled `resources` — no HTTP backend or browser language detector, so it's synchronous and has no runtime fetch. It's currently only wired up for Storybook (`.storybook/decorators.tsx`); it is **not** exported from the package's public API (`src/index.ts`). See Known limitations.

Storybook has its own resources for demo-only copy (sample data, story-specific labels) that real consumers never see: `.storybook/locales/{en,ar}.ts`, merged with `@repo/i18n`'s resources by the Storybook-only adapter at `.storybook/i18n.ts` under a `stories` namespace. Don't add production strings there — they belong in `@repo/i18n`.

## Running Storybook

```
pnpm --filter @repo/ui storybook       # dev server on :6006
pnpm --filter @repo/ui build-storybook # static build
```

Stories don't set a `title` in their meta — Storybook derives it from the file's folder hierarchy. See [Configure story loading](https://storybook.js.org/docs/configure/#configure-story-loading).

The sidebar groups components (Forms, Overlays, Disclosure, Feedback, Data Display, etc.) using a categorization inspired by [Chakra UI's component overview](https://chakra-ui.com/docs/components/concepts/overview). The components themselves follow Atomic Design (atoms, molecules, organisms, templates, pages).

## Running interaction tests

```
pnpm --filter @repo/ui test        # vitest --run --project storybook
pnpm --filter @repo/ui test:watch  # watch mode
```

This runs every story's `play` function — written with `storybook/test` (`within`, `userEvent`, `expect`, `fn`, ...) — in a real Chromium browser via `@storybook/addon-vitest` and Playwright. If Chromium isn't installed yet, run `pnpm exec playwright install chromium` first.

## Running the production build

```
pnpm --filter @repo/ui build
```

This runs `vite build` against the package's own `index.html` / `src/main.tsx` — a standalone demo app left over from the original Vite template, output to `dist/`. It is **not** how `@repo/ui` is consumed elsewhere in the monorepo: consumers resolve `./src/index.ts` and `./src/styles/index.css` directly (see `exports` in `package.json`), unbundled, through their own toolchain (e.g. Next.js in `apps/web`). See Known limitations.

## Running Chromatic

```
CHROMATIC_PROJECT_TOKEN=xxx pnpm --filter @repo/ui chromatic
```

Also runs automatically in CI on every push via `.github/workflows/chromatic.yml`, using the `CHROMATIC_PROJECT_TOKEN` repository secret.

## Supported components

- **Brand**: Logo
- **Buttons**: Button, CloseButton, IconButton
- **Charts**: DonutChart, LineChart, MapLegend, WorldMap
- **Data Display**: Chip, DataTable, Icon, StatCard, Typography
- **Disclosure**: Breadcrumbs, Tabs
- **Feedback**: Progress, Skeleton, Toast (+ `useToastManager`)
- **Forms**: Checkbox, Field, Hint, Radio, Select, TextField
- **Layout**: Divider
- **Overlays**: Dialog, Drawer

`Backdrop` also exists under `Overlays` but isn't exported publicly — it's an internal building block used by `Dialog` and `Drawer`.

## Known limitations

- **i18n isn't wired up for consumers.** Components that call `useTranslation()` need an `I18nextProvider` backed by an initialized `i18next` instance somewhere above them in the tree. The package doesn't export one, and `apps/web` doesn't currently set one up — so translated component copy only works inside Storybook today.
- **Only light and dark themes exist.** There's no `system`/auto theme; the consumer must set `data-theme` itself and has no built-in way to follow the OS preference.
- **`pnpm build` doesn't produce a library bundle.** It builds the leftover Vite demo app (`index.html` → `dist/`), which nothing in the monorepo consumes. The real "build" of this package, for consumers, is just its raw TypeScript/CSS source.
- **Chart components render to canvas, not DOM.** `DonutChart`, `LineChart`, and `WorldMap` draw through amCharts5 onto `<canvas>` elements with no per-datum DOM or ARIA nodes — screen readers and automated tests can only reach surrounding elements (legends, labels), not individual data points or regions.
- **Not published.** This package is `private` and workspace-only; it can't be installed outside this monorepo.
