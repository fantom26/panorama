# 001 — Replace @trivago/prettier-plugin-sort-imports with eslint-plugin-simple-import-sort

## Status

Accepted

## Context

Snyk (via the `snyk` CI job introduced alongside branch protection on `main`) flagged 7 high-severity
issues in `@trivago/prettier-plugin-sort-imports@6.0.2`'s transitive dependency chain:
`minimatch@9.0.5 > brace-expansion@2.0.2` (ReDoS, inefficient algorithmic complexity, and
allocation-without-limits advisories). No patched release existed within trivago's declared
`minimatch: ^9.0.0` range at the time, and the only upstream PR addressing it had not been merged.
With `--severity-threshold=high`, this blocked the CI gate outright — the choice was between
overriding/ignoring the finding or removing the dependency.

## Decision

Replace `@trivago/prettier-plugin-sort-imports` with `eslint-plugin-simple-import-sort`, configured
once in the shared `@repo/eslint-config/base.js` so every workspace package/app inherits it. Import
order moves from a Prettier plugin (`prettier --write` / `format:check`) to an ESLint rule
(`eslint --fix`, already wired into `lint-staged` and CI's `quality` job). The previous `importOrder`
regex groups (`node: → react/react-dom/react → next → third-party → @repo/* → @/* → relative`) were
translated into `simple-import-sort`'s `groups` array.

## Alternatives considered

- **pnpm override to a patched `minimatch`/`brace-expansion`**, scoped to just the trivago path.
  Would have kept the plugin. Abandoned: pnpm 10 moved `overrides` out of `package.json` (now
  `pnpm-workspace.yaml`) and the multi-segment override selector syntax didn't resolve cleanly —
  removing the plugin was simpler than fighting the override mechanism.
- **`@ianvs/prettier-plugin-sort-imports`** — actively maintained fork, no `minimatch` in its tree,
  near drop-in replacement (same Prettier-plugin model, similar `importOrder` config). Viable, but
  still carries a small transitive tree (Babel packages + `semver`).
- **`eslint-plugin-import` / `eslint-plugin-import-x`** — still depend on `minimatch` and/or a heavier
  resolver tree (`unrs-resolver`, `is-glob`).
- **`eslint-plugin-perfectionist`** — no `minimatch`, broader scope (sorts imports, exports, object
  keys, JSX props). A reasonable alternative, not chosen because its scope is wider than needed.
- **Biome** — would replace Prettier and ESLint entirely, eliminating this class of problem for good
  (compiled binary, no npm dependency tree for formatting/linting logic). Rejected for this fix:
  documented rule-parity gaps (Next.js-specific rules, weaker type-aware linting, a11y rule parity)
  make it a separate, larger migration decision, not a one-off dependency swap.

`eslint-plugin-simple-import-sort` was chosen over the above for having **zero dependencies** — it
can't reintroduce this class of vulnerability in the future — combined with the highest adoption
among the single-purpose options (~5.6M weekly downloads).

## Consequences

- Import ordering is now enforced by `eslint --fix`, not `prettier --write` — `pnpm format` no longer
  touches import order at all.
- `importOrderSeparation` (blank line between groups) is preserved by `simple-import-sort`'s default
  behavior.
- `importOrderSortSpecifiers` (alphabetizing names within one import line, e.g. `{ b, a }` → `{ a, b }`)
  has **no direct equivalent** in `simple-import-sort` and was dropped. Can be restored later via
  ESLint core's `sort-imports` rule with `ignoreDeclarationSort: true`, if wanted.
- Single point of configuration (`@repo/eslint-config/base.js`) applies to every package and app —
  no per-package ESLint config duplication.
