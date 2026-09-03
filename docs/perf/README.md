# Performance & Core Web Vitals

Before / after benchmarks for the `apps/web` performance pass (Phase 19).

- `baseline/` — pre-optimization snapshot (branch `perf/baseline`, PR #35).
- `after/` — post-optimization snapshot (branch `perf/core-web-vitals`).

Neither is regenerated; re-run the method below into a new folder to re-measure.

## Method

|            |                                                                                                                                                                                                                |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build      | `pnpm --filter web build` — Next.js 16.3.0, Turbopack, production                                                                                                                                              |
| Server     | `next start` on `localhost`, warm process; React Query cache is per page load, so data is re-fetched per run                                                                                                   |
| Lighthouse | `npx lighthouse@13`, `--only-categories=performance --form-factor=mobile --throttling-method=simulate`, headless Chrome 152                                                                                    |
| Runs       | 3 per route; tables show the **per-metric median**. Every run's headline metrics: `<snapshot>/lighthouse/summary.tsv`. One representative `*.report.json` per route is kept, trimmed to score + metric audits. |
| Machine    | macOS 26.5 arm64, Node 24.15, LH benchmarkIndex ≈ 4100                                                                                                                                                         |
| Routes     | `/` · `/countries/USA` · `/rankings/gdp` · `/region/europe-central-asia` · `/compare?countries=USA,CHN,DEU`                                                                                                    |

### Regenerate the metric table

```bash
jq -rn '[inputs | {route:(input_filename|sub(".*/lighthouse/";"")|sub("(-run[0-9])?\\.report\\.json$";"")),
  perf:(.categories.performance.score*100), lcp:.audits["largest-contentful-paint"].numericValue,
  cls:.audits["cumulative-layout-shift"].numericValue, tbt:.audits["total-blocking-time"].numericValue}]
  | group_by(.route) | map({route:.[0].route, perf:(map(.perf)|sort|.[length/2|floor]),
    lcp:(map(.lcp)|sort|.[length/2|floor]), cls:(map(.cls)|sort|.[length/2|floor]),
    tbt:(map(.tbt)|sort|.[length/2|floor])})
  | (.[] | [.route,(.perf|round),(.lcp|round),(.cls*1000|round/1000),(.tbt|round)] | @tsv)' \
  <baseline|after>/lighthouse/*.report.json | column -t
```

---

## Lighthouse — median of 3 (mobile / simulated)

Targets: LCP < 2500 ms · CLS < 0.1 · TBT < 200 ms · FCP < 1800 ms.

| Route    |        Perf |        LCP (ms) |              CLS |      TBT (ms) |    FCP (ms) |
| -------- | ----------: | --------------: | ---------------: | ------------: | ----------: |
| home     | 90 → **91** |     3024 → 3311 | 0.040 → 0.040 ✅ | 212 → **104** | 1365 → 1359 |
| country  | 69 → **71** | 6764 → **6043** | 0.170 → 0.170 ❌ |   86 → **16** | 1358 → 1360 |
| rankings | 68 → **70** | 5735 → **5097** | 0.211 → 0.211 ❌ |   52 → **40** | 1359 → 1365 |
| region   |     92 → 90 |     3163 → 3616 | 0.026 → 0.026 ✅ |  119 → **44** | 1360 → 1360 |
| compare  |     90 → 83 |     3012 → 3615 | 0.172 → 0.159 ❌ |    46 → **7** | 1359 → 1361 |

### Reading the numbers

- **TBT down on every route** (home −108 ms, region −75 ms, country −70 ms) — amCharts no
  longer parses/executes on the main thread during initial load.
- **LCP down where it was worst**: country −720 ms, rankings −640 ms — the chart-heavy
  routes that carried amCharts on the critical path.
- **LCP on home / region / compare is API-bound** (the LCP element is the stats strip,
  which waits on the SOTW fetch) and swings ±400 ms between sweeps — the `+300–600 ms`
  there is sweep-to-sweep noise, not a code regression (`baseline/lighthouse/summary.tsv`
  shows a 1126 ms home run pulling that median down). FCP, which is not data-bound, is
  flat at ~1360 ms across both snapshots.
- **CLS is unchanged on country / rankings / compare** and is _not_ from the charts or the
  table. Lighthouse's `layout-shifts` audit attributes ~all of it to the **stats strip**
  (`StatCard` `loading` → loaded height change) and, on chart routes, the
  `useChartHeight` mobile→desktop jump on mount (`useMediaQuery({ initializeWithValue:
false })`, ADR 002). Both are pre-existing and outside this pass's scope — see below.

---

## Bundle — client JS (Turbopack production build)

Per-chunk detail: `baseline/chunks.txt`, `after/chunks.txt`. Per-route initial JS:
`after/initial-js.txt`. Module treemaps: `*/analyze/client-webpack.html`.

|                                                  |                                                             Baseline |                                                                                           After |
| ------------------------------------------------ | -------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------: |
| Total client JS, gzip                            |                                                   657 KB / 19 chunks |                                                                              679 KB / 27 chunks |
| Every-route JS (rootMainFiles + polyfills), gzip |                                                               163 KB |                                                                                          163 KB |
| Per-route **initial** JS, gzip                   |                                                      not measurable¹ |                                                                                         ~417 KB |
| amCharts 5 + geodata                             | in **every** feature route's initial JS (in the 325 KB shared chunk) | **114 KB gzip lazy chunk** — absent from every route's initial HTML, fetched on chart scroll-in |

¹ Next 16 Turbopack prints no per-route table; the baseline's "amCharts everywhere" fact is
from `baseline/chunks.txt` chunk-content analysis. Total JS rises slightly: `next/dynamic`
adds per-boundary boilerplate and the one shared vendor chunk is now split several ways —
the win is _what loads when_, not the sum.

### Tooling note

`@next/bundle-analyzer` is a webpack plugin, so `pnpm --filter web analyze` runs
`next build --webpack` for the treemap. Authoritative sizes come from the real Turbopack
build (`chunks.txt`, `gzip -c` over `.next/static/chunks/*.js`). `next experimental-analyze`
is the Turbopack-native interactive analyzer (no committed artifact).

---

## What landed

| Change                                                                                                                                                                                               | Effect                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Drop the 4 amCharts charts from the `@repo/ui` barrel; `@repo/ui/charts/*` subpath exports; `apps/web` wraps each in `next/dynamic({ ssr:false })` + a viewport gate (`LazyChart` / `useInViewport`) | amCharts (114 KB gz) off every route's critical path → LCP/TBT on chart routes                           |
| `experimental.optimizePackageImports: ['@repo/ui']`                                                                                                                                                  | tree-shakes remaining barrel imports (modest; Turbopack support is partial)                              |
| `DataTable`: skeleton rows = page size, `min-height` reserves them                                                                                                                                   | removes the loading→loaded table jump (was not the dominant CLS source on the measured routes, but real) |
| Donut skeleton reserves chart **+ legend** height (`donutReservedHeight`)                                                                                                                            | prevents a mobile-column layout shift on `/`                                                             |
| `prefers-reduced-motion`: Skeleton shimmer off; amCharts `Animated` theme skipped (`buildChartThemes`)                                                                                               | a11y                                                                                                     |
| `<link rel="preconnect">` for `flagcdn.com`; `<WebVitals>` (`useReportWebVitals` → dev log + `NEXT_PUBLIC_VITALS_URL` beacon)                                                                        | LCP tail; field instrumentation                                                                          |
| `CountrySearch` filter debounced 150 ms (`useDebounceValue`)                                                                                                                                         | fewer full-list re-renders per keystroke (INP)                                                           |

## Not addressed (recommended follow-up)

CLS on `country` / `rankings` / `compare` stays at 0.17–0.21. Root causes, both pre-existing:

1. **`StatCard` `loading` state** renders a `1.75rem` value skeleton; the loaded
   `title-default` value is taller, and `trend` only reserves space when loading — so the
   stats strip grows on hydrate and pushes the page. Fix in `packages/ui`
   `StatCard`: match the loading skeleton to the loaded line box.
2. **`useChartHeight`** returns the mobile height on first paint then jumps to
   tablet/desktop on mount, resizing every chart slot. Fix: drive chart-container height
   from CSS (media-query'd `min-height` / `aspect-ratio`) so the reserved box is correct
   before JS runs.
