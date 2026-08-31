<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Folder structure

`app/` holds only Next.js route files — thin, usually a re-export of a feature
entry (`export { default } from '@/features/region'`). All UI and logic lives in
`src/`.

```
src/
  features/<feat>/     one folder per page-level feature
    index.tsx          the page component
    index.module.css
    hooks/             react-query / view hooks for this feature
    model/             pure, framework-free logic (selectors, guards) — the testable core
    locales/           index.ts (namespace barrel) + en.ts + ar.ts
    components/         feature-local sub-components — ONLY when the feature has them
      <Sub>/index.tsx + index.module.css
  shared/
    ui/<Component>/     one folder per shared component
      index.tsx
      index.module.css
      <helpers>.ts      component-private helpers
    model/  api/  hooks/  utils/  types/  store/   flat module directories
```

## Components — `src/shared/ui/<Component>/`

- Every component gets its own folder, even single-file ones. Entry file is
  `index.tsx`, stylesheet is `index.module.css`. Mirrors `packages/ui`.
- Import via the folder: `import AppHeader from '@/shared/ui/AppHeader'`.
- No category grouping (`Buttons/`, `Forms/` …) — the local set is small; keep the
  folder list flat.

## Features — `src/features/<feat>/`

- The page component is `index.tsx`; route files import the feature root
  (`@/features/<feat>`).
- Put pure logic in `model/` and hooks in `hooks/` so they can be unit-tested
  without rendering. Cross-reference within a feature by alias
  (`@/features/region/model/region-overview`), not deep relative paths.
- Add a `components/` subfolder only once a feature actually has sub-components
  (e.g. `compare` has `components/CompareMatrix/`).

## `src/shared/{model,api,hooks,utils,types,store}`

Plain TypeScript modules, not components — leave them as flat module directories.
Foldering each one adds nesting for no navigation gain.

# Tests

Tests live in a separate `test/` tree that mirrors the source layout — they are
**not** colocated next to source.

- Mirror the **directory** of the file under test and name the file after its
  subject:
  - `src/features/region/model/region-overview.ts` → `test/features/region/model/region-overview.test.ts`
  - `src/shared/ui/CountrySearch/index.tsx` → `test/shared/ui/CountrySearch/CountrySearch.test.tsx`
  - `app/error.tsx` → `test/app/error.test.tsx`
  - `proxy.ts` → `test/proxy.test.ts`
- Import the subject by alias (`@/…`, or `@app/…` for route files). Keep fixtures
  next to the tests that use them (`test/shared/api/__fixtures__/`).
- No `*.test.*` / `*.spec.*` files under `src/` or `app/`.

Why a mirrored tree rather than colocation
([stackoverflow.com/a/42387591](https://stackoverflow.com/a/42387591)):
colocating tests beside source works well for small projects, but a separate tree
that mirrors `src/` keeps `src/` as production-only code, lets the whole test
suite be excluded from builds / bundles / published output in one move instead of
scattered ignore globs, and makes the test for any given file findable by
construction via its parallel path.
