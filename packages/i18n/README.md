# @repo/i18n

Shared `i18next` resources for Panorama — the production translation strings used by `@repo/ui` components (and any other consumer), kept separate from Storybook-only demo copy.

## Usage

```ts
import { resources } from '@repo/i18n'

i18n.init({
  resources,
  ns: ['common', 'ui'],
  defaultNS: 'common',
  fallbackNS: 'ui'
  // ...
})
```

`resources` is a plain object shaped `{ en: { common, ui }, ar: { common, ui } }` — no HTTP backend or language detector involved, so it can be bundled directly by whatever builds the consumer (Vite, Next.js, etc.) instead of fetched at runtime.

## Namespaces

- **`common`** — generic, app-level strings not owned by a single component (table column headers, shared actions, page titles).
- **`ui`** — strings owned by individual `@repo/ui` components (aria-labels, empty/error states, chart legends).

## What doesn't live here

Storybook-only copy (sample data, story-specific labels) stays local to `@repo/ui` at `.storybook/locales/{en,ar}.ts` — real consumers of `@repo/ui` never see it, so it shouldn't ship in this package.

## Adding a locale

Add an `en`/`ar`-shaped pair of files under `src/<locale>/`, export them from `src/index.ts`, and add the locale key to `resources`.
