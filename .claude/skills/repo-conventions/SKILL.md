---
name: repo-conventions
description: Use when writing imports, adding files/packages, or wiring tsconfig/build in the panorama monorepo. Defines path-alias and workspace conventions.
---

# Repo conventions

## Imports
- Cross-package: import by package name (`@repo/ui`, `@repo/tokens`, `@repo/i18n`) — resolves
  via the pnpm workspace. Never reach into another package with a relative path.
- Intra-package: use the `@/` alias to the package's `src` (`@/components/Field`), not
  deep relative paths like `../../components/Field`.
- The `@/` alias is package-local. It resolves to the current package's `src` directory
  and must not be used by consuming applications or another package.
- Public package entry points must use relative imports so consumers can resolve them
  without inheriting the package's private alias configuration.
- Never use `.` / `../` imports to cross a folder or module boundary; same-folder
  siblings may be relative.
- Exception: style imports (`.css`/`.module.css`) are always relative, never `@/`, even
  across folders. CSS aliases are not rewritten for consumers.
- Prefer namespace-qualified React types over importing each one by name, e.g.
  `React.ReactNode` instead of `import { ReactNode } from 'react'`.

## Wiring
- Internal deps use `workspace:*`, never version ranges.
- Each package owns its `@/*` alias in its local TypeScript configuration, typically
  `tsconfig.app.json` with `"baseUrl": "."` and `"paths": { "@/*": ["src/*"] }`.
- Tools that do not automatically read TypeScript path mappings must define the alias
  separately. For example, Vite and Storybook should map `@` to the package's `src`
  directory.
- When changing an alias, verify TypeScript, Vite, Storybook, Vitest, and ESLint
  resolution.
- New internal package: scope it `@repo/<name>` and add it as a `workspace:*` dep
  where consumed.

## Enforcement
`tsconfig` paths and the `no-restricted-imports` lint rule are the source of truth. If an
import triggers a lint error, switch it to the `@` form — don't disable the rule.