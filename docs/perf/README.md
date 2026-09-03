# Performance & Core Web Vitals

Baseline benchmarks for `apps/web`, captured **before** any optimization work, plus the
place where the post-optimization "after" numbers will land.

- `baseline/` — the pre-optimization snapshot (this PR). Do not regenerate.
- `after/` — the post-optimization snapshot (added by the optimization PR), same routes,
  same method.

## Method

| | |
| --- | --- |
| Build | `pnpm --filter web build` — Next.js 16.3.0, Turbopack, production |
| Server | `next start -p 4311` on `localhost`, warm (server already running, data un-cached per navigation — React Query cache is per page load) |
| Lighthouse | `npx lighthouse@13`, `--only-categories=performance --form-factor=mobile --throttling-method=simulate`, headless Chrome 152 |
| Runs | 3 per route. All 3 runs' headline metrics → `<snapshot>/lighthouse/summary.tsv`. One representative run's `*.report.json` per route is kept, trimmed to score + metric audits (screenshots, filmstrip, and opportunity/table drill-downs stripped — re-run Lighthouse for those). The tables below use the **per-metric median** across the 3 runs. |
| Machine | macOS 26.5 arm64, Node 24.15, LH benchmarkIndex ≈ 4100 |

Routes (params from `apps/web/src/shared/routes.ts` + model data):

| Label | URL |
| --- | --- |
| home | `/` |
| country | `/countries/USA` |
| rankings | `/rankings/gdp` |
| region | `/region/europe-central-asia` |
| compare | `/compare?countries=USA,CHN,DEU` |

Reproduce: `scripts` in the optimization PR's plan, or re-run
`npx lighthouse http://localhost:4311<route> --only-categories=performance --form-factor=mobile --throttling-method=simulate`.

### Regenerating the metric table

```bash
jq -rn '[inputs | {route:(input_filename|sub(".*/lighthouse/";"")|sub("(-run[0-9])?\\.report\\.json$";"")),
  perf:(.categories.performance.score*100), lcp:.audits["largest-contentful-paint"].numericValue,
  cls:.audits["cumulative-layout-shift"].numericValue, tbt:.audits["total-blocking-time"].numericValue,
  fcp:.audits["first-contentful-paint"].numericValue, ttfb:.audits["server-response-time"].numericValue,
  si:.audits["speed-index"].numericValue}] | group_by(.route)
  | map({route:.[0].route, perf:(map(.perf)|sort|.[length/2|floor]), lcp:(map(.lcp)|sort|.[length/2|floor]),
    cls:(map(.cls)|sort|.[length/2|floor]), tbt:(map(.tbt)|sort|.[length/2|floor]),
    fcp:(map(.fcp)|sort|.[length/2|floor]), ttfb:(map(.ttfb)|sort|.[length/2|floor]), si:(map(.si)|sort|.[length/2|floor])})
  | (.[] | [.route,(.perf|round),(.lcp|round),(.cls*1000|round/1000),(.tbt|round),(.fcp|round),(.ttfb|round),(.si|round)] | @tsv)' \
  <baseline|after>/lighthouse/*.report.json | column -t
```

---

## Lighthouse — lab metrics (median of 3, mobile / simulated throttling)

Targets: LCP < 2500 ms · CLS < 0.1 · TBT < 200 ms (INP proxy) · FCP < 1800 ms · TTFB < 800 ms.

| Route | Perf | LCP (ms) | CLS | TBT (ms) | FCP (ms) | TTFB (ms) | Speed Index (ms) |
| --- | --: | --: | --: | --: | --: | --: | --: |
| home `/` | **90** | 3024 ⚠️ | 0.040 ✅ | 228 ⚠️ | 1365 ✅ | 16 ✅ | 2148 |
| country `/countries/USA` | **69** | 6764 ❌ | 0.170 ❌ | 86 ✅ | 1358 ✅ | 24 ✅ | 1969 |
| rankings `/rankings/gdp` | **68** | 5735 ❌ | 0.211 ❌ | 49 ✅ | 1359 ✅ | 8 ✅ | 2306 |
| region `/region/europe-central-asia` | **92** | 3163 ⚠️ | 0.026 ✅ | 119 ⚠️ | 1360 ✅ | 20 ✅ | 2199 |
| compare `/compare?countries=USA,CHN,DEU` | **87** | 3012 ⚠️ | 0.172 ❌ | 46 ✅ | 1359 ✅ | 20 ✅ | 1359 |

_(After) — filled by the optimization PR:_

| Route | Perf | LCP | CLS | TBT | FCP | TTFB | Speed Index |
| --- | --- | --- | --- | --- | --- | --- | --- |
| home | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| country | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| rankings | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| region | TBD | TBD | TBD | TBD | TBD | TBD | TBD |
| compare | TBD | TBD | TBD | TBD | TBD | TBD | TBD |

---

## Bundle — client JS (real Turbopack production build)

Full per-chunk table (raw + gzip) and the every-route baseline: `baseline/chunks.txt`.
Module-level treemap: `baseline/analyze/client-webpack.html` (open in a browser).

| | Baseline | After |
| --- | --: | --- |
| Total client JS, gzip | **657 KB** (19 chunks) | TBD |
| Total client JS, raw | 2.25 MB | TBD |
| Loaded on **every** route (rootMainFiles + polyfills), gzip | **163 KB** | TBD |
| Largest single chunk `3ea6vetogmc44.js`, gzip | **325 KB** (49.5% of all JS) | TBD |

`3ea6vetogmc44.js` is one shared chunk bundling **amCharts 5 + amcharts5-geodata +
@tanstack/react-table + react-i18next + @base-ui/react + lucide-react** together. It is
not in `rootMainFiles`, but every feature route imports from the `@repo/ui` barrel, so it
is pulled on `/`, `/countries/*`, `/rankings/*`, `/region/*`, `/income/*` alike. amCharts
+ geodata are the bulk of it and never need to be on the critical path.

### Tooling note

Next 16 builds with Turbopack and no longer prints a per-route "First Load JS" table, and
`@next/bundle-analyzer` (a webpack plugin) only runs under `next build --webpack`. So:

- **Authoritative sizes** come from the real Turbopack build — `baseline/chunks.txt`,
  generated by `gzip -c` over `.next/static/chunks/*.js` + `build-manifest.json`.
- **`pnpm --filter web analyze`** (`ANALYZE=true next build --webpack`) produces the
  `@next/bundle-analyzer` treemaps under `apps/web/.next/analyze/` for a module-level
  view. This is a *webpack* build — module boundaries match, absolute bytes drift a few
  percent from the Turbopack build.
- `next experimental-analyze` is the Turbopack-native interactive analyzer if a
  richer view is needed (no committed artifact).

---

## What the optimization PR targets

| Baseline problem | Metric | Fix |
| --- | --- | --- |
| amCharts + geodata on every route's critical path (in `3ea6vetogmc44.js`) | LCP (country 6.8s, rankings 5.7s), total JS 657 KB | `next/dynamic({ssr:false})` per-chart boundary + intersection gate + `@repo/ui/charts/*` subpath exports + `optimizePackageImports` |
| `DataTable` loading rows (5) ≠ page size (8 / 25); no reserved height | CLS — country 0.17, rankings 0.211 | loading rows = `pageSize` + `min-height` while loading |
| Donut skeleton reserves `size` but chart renders `size` + legend | CLS — home/compare | reserve donut+legend height |
| Skeleton shimmer + amCharts entrance animation ignore `prefers-reduced-motion` | a11y, minor paint | `@media (prefers-reduced-motion)` guard + skip Animated theme |
| No `preconnect` for `flagcdn.com`; no web-vitals reporter | LCP tail, observability | `<link rel="preconnect">` + `useReportWebVitals` |
