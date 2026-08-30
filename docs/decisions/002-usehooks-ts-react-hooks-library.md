# 002 — usehooks-ts as the shared React hooks library

## Status

Accepted

## Context

`apps/web` needs a handful of cross-cutting client hooks that aren't domain logic: media-query
matching, `localStorage`-backed preferences (theme, language), intersection observation and
window-size tracking for chart performance, and input debouncing for search. These are solved
problems with well-known edge cases (SSR hydration mismatches, listener cleanup, Safari's older
`MediaQueryList` API, `matchMedia` being absent in tests).

A hand-rolled `useMediaQuery` had already drifted into `src/shared/hooks/`. It reimplemented — slightly
differently — what a library hook already does, and it was the only such hook, so there was no
established answer for "where do the next four come from".

`usehooks-ts` was already a direct dependency (used for `useIsClient` in the compare store).

## Decision

`usehooks-ts` is the sanctioned source for generic client hooks. Import its hooks directly
(`import { useX } from 'usehooks-ts'`).

A thin wrapper in `src/shared/hooks/` is added **only** when there is a real project-specific contract
to encode. The one current case: `useMediaQuery` wraps `usehooks-ts`'s hook with
`{ defaultValue: false, initializeWithValue: false }` so SSR and the first client paint are
mobile-first and hydration-safe — a requirement that comes from amCharts sizing its canvas from a JS
boolean rather than a CSS breakpoint. The wrapper keeps the previous public surface
(`useMediaQuery(query): boolean`), so no callers changed.

Adoption is incremental: a hook is pulled in when a feature first needs it, not preemptively. There is
no re-export barrel.

## Alternatives considered

- **Keep hand-rolling per need.** This is what produced the drift — each hook a slightly different take
  on the same lifecycle, none tested, SSR behaviour inconsistent.
- **`react-use`.** Much larger surface, effectively unmaintained.
- **`@react-hookz/web`.** Well designed and tree-shakeable, but a smaller ecosystem and no existing
  foothold in the repo.
- **A local `@repo/hooks` package.** Over-engineered for a solo project — it would mostly re-export
  `usehooks-ts` anyway.

## Consequences

- `usehooks-ts` ships a single `.` entry point (no subpath exports), so imports go through the root
  barrel. The package is `sideEffects: false`, so the bundler still tree-shakes unused hooks.
- `useMediaQuery`'s behaviour and signature are unchanged; its former implementation is now three lines
  delegating to the library, with a colocated test that pins the SSR-safe contract.
- New generic-hook needs have a clear answer and don't each become a small design decision.
