---
name: repo-conventions
description: Use when writing imports, adding files/packages, or wiring tsconfig/build in the panorama monorepo. Defines path-alias and workspace conventions.
---

# Repo conventions

## Imports
- Cross-package: import by package name (`@panorama/ui`, `@panorama/tokens`) — resolves
  via the pnpm workspace. Never reach into another package with a relative path.
- Intra-package: use the `@/` alias to the package's `src` (`@/components/Field`), not
  deep relative paths like `../../components/Field`.
- Never use `.` / `../` imports to cross a folder or module boundary; same-folder
  siblings may be relative.
- Exception: style imports (`.css`/`.module.css`) are always relative, never `@/`, even
  across folders. `tsc-alias` (used to compile `@panorama/ui` for consumers) only
  rewrites JS/TS module specifiers — it silently leaves `@/`-aliased CSS imports
  unresolved in the compiled output.
- Prefer namespace-qualified React types over importing each one by name, e.g.
  `React.ReactNode` instead of `import { ReactNode } from 'react'`.

## Wiring
- Internal deps use `workspace:*`, never version ranges.
- Path aliases live in the root `tsconfig.base.json` so every package inherits them. New
  intra-package aliases must be mirrored to tools that don't read tsconfig (Storybook,
  Vitest — e.g. via `vite-tsconfig-paths`).
- New internal package: scope it `@panorama/<name>` and add it as a `workspace:*` dep
  where consumed.

## Enforcement
`tsconfig` paths and the `no-restricted-imports` lint rule are the source of truth. If an
import triggers a lint error, switch it to the `@` form — don't disable the rule.