import * as am5 from '@amcharts/amcharts5'
import am5locales_ar from '@amcharts/amcharts5/locales/ar'
import am5locales_en from '@amcharts/amcharts5/locales/en'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

// Rank-based series ramp: one ink color (textDefault) at five opacity steps, never a
// distinct hue. Clamps rather than wraps — a 6th-ranked slice must reuse the last step,
// never repeat from the top, so callers group anything past index 4 into a single item.
export const CHART_RANK_OPACITIES = [1, 0.68, 0.46, 0.28, 0.13] as const

export type PanoramaChartPalette = {
  primary: am5.Color
  secondary: am5.Color
  tertiary: am5.Color
  surface: am5.Color
  noData: am5.Color
  grid: am5.Color
  textSubtle: am5.Color
  textDefault: am5.Color
  knockoutBackground: am5.Color
  knockoutText: am5.Color
  fontFamily: string
  fontWeight: am5.ILabelSettings['fontWeight']
}

const COLOR_TOKENS: Record<
  Exclude<keyof PanoramaChartPalette, 'fontFamily' | 'fontWeight'>,
  string
> = {
  primary: '--ds-theme-color-background-dataviz-primary',
  secondary: '--ds-theme-color-background-dataviz-secondary',
  tertiary: '--ds-theme-color-background-dataviz-tertiary',
  surface: '--ds-theme-color-background-default',
  // No dedicated "no data" token exists — background-default-hover is a near-exact match
  // for a muted, low-contrast wash in both themes and isn't otherwise used inside charts.
  noData: '--ds-theme-color-background-default-hover',
  grid: '--ds-theme-color-content-subtle',
  textSubtle: '--ds-theme-color-content-subtle',
  textDefault: '--ds-theme-color-content-default',
  knockoutBackground: '--ds-theme-color-background-knockout',
  knockoutText: '--ds-theme-color-content-knockout'
}

function resolveColor(raw: string) {
  const value = raw.trim()
  return value.startsWith('#') || value.startsWith('rgb') ? am5.color(value) : undefined
}

export function readPanoramaChartPalette(el: Element): Partial<PanoramaChartPalette> {
  const computed = getComputedStyle(el)
  const palette: Partial<PanoramaChartPalette> = {}

  for (const [key, token] of Object.entries(COLOR_TOKENS) as [
    keyof typeof COLOR_TOKENS,
    string
  ][]) {
    const color = resolveColor(computed.getPropertyValue(token))
    if (color) palette[key] = color
  }

  const fontFamily = computed.getPropertyValue('--ds-theme-typography-body-sm-font-family').trim()
  if (fontFamily) palette.fontFamily = fontFamily

  const fontWeight = computed.getPropertyValue('--ds-theme-typography-body-sm-font-weight').trim()
  if (fontWeight) palette.fontWeight = fontWeight as PanoramaChartPalette['fontWeight']

  return palette
}

// The app only ships two locales, `en` and `ar`, and `ar` is its only RTL one — so
// direction alone is enough to pick the amCharts locale without packages/ui needing to
// know the app's actual i18n language.
export function isRtlContainer(container: Element): boolean {
  return getComputedStyle(container).direction === 'rtl'
}

export function applyPanoramaChartLocale(root: am5.Root, rtl: boolean) {
  root.locale = rtl ? am5locales_ar : am5locales_en
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Theme list for `root.setThemes()` — the Panorama theme plus amCharts' Animated
 * theme, unless the user asked for reduced motion, in which case the entrance/
 * transition animations are dropped.
 */
export function buildChartThemes(
  root: am5.Root,
  palette: Partial<PanoramaChartPalette>,
  rtl: boolean
): am5.Theme[] {
  const themes: am5.Theme[] = [createPanoramaChartTheme(root, palette, rtl)]
  if (!prefersReducedMotion()) themes.unshift(am5themes_Animated.new(root))
  return themes
}

export function createPanoramaChartTheme(
  root: am5.Root,
  palette: Partial<PanoramaChartPalette>,
  rtl: boolean
): am5.Theme {
  class PanoramaChartTheme extends am5.Theme {
    override setupDefaultRules() {
      super.setupDefaultRules()

      const label = this.rule('Label')
      if (palette.fontFamily) label.set('fontFamily', palette.fontFamily)
      if (palette.fontWeight) label.set('fontWeight', palette.fontWeight)
      if (palette.textDefault) label.set('fill', palette.textDefault)
      // amCharts draws labels on <canvas>, whose 2D context direction defaults to
      // "inherit" from the page's ambient CSS `direction` — so under `dir="rtl"` every
      // label silently flips its text-align anchor unless its own `direction` setting is
      // set explicitly, which is what causes axis labels to overflow/clip even with no
      // other RTL chart config. Pin it here for every label instead of leaving it default.
      label.set('direction', rtl ? 'rtl' : 'ltr')

      if (palette.textSubtle) {
        this.rule('AxisLabel').set('fill', palette.textSubtle)
      }

      if (palette.grid) {
        this.rule('Grid').set('stroke', palette.grid)
        this.rule('Grid', ['cursor', 'x']).set('stroke', palette.grid)
        this.rule('Grid', ['cursor', 'y']).set('stroke', palette.grid)
      }

      this.rule('Tooltip').setAll({
        getFillFromSprite: false,
        getStrokeFromSprite: false,
        getLabelFillFromSprite: false,
        autoTextColor: false
      })

      if (palette.knockoutBackground) {
        this.rule('PointedRectangle', ['tooltip', 'background']).setAll({
          fill: palette.knockoutBackground,
          stroke: palette.knockoutBackground
        })
      }
      if (palette.knockoutText) {
        this.rule('Label', ['tooltip']).set('fill', palette.knockoutText)
      }
    }
  }

  return PanoramaChartTheme.new(root)
}

// Storybook's theme decorator sets `data-theme` on <html> from a passive effect, which
// always fires after a descendant's useLayoutEffect — so a chart built immediately on
// mount can briefly read no theme tokens at all (every token is scoped under
// `[data-theme]`, never bare `:root`) and fall back to amCharts5's own default colors.
// Deferring the first build until `data-theme` is actually present avoids that flash;
// real app usage, where `data-theme` is set before React mounts, is unaffected since the
// attribute is already there and the chart builds synchronously as before.
export function mountReactiveChart(
  container: HTMLDivElement,
  build: (container: HTMLDivElement) => am5.Root
): () => void {
  let root: am5.Root | undefined

  // amCharts writes `document.body.style.cursor` from a shape's `cursorOverStyle` on hover
  // and only restores it on `pointerout`. Disposing the root while a shape is still hovered
  // — e.g. a map click that navigates and unmounts the chart before `pointerout` fires —
  // strands the pointer cursor on `<body>` for the rest of the session. Clear it on every
  // dispose so the CSS/UA default takes over.
  function disposeRoot() {
    document.body.style.cursor = ''
    root?.dispose()
  }

  const observer = new MutationObserver(() => {
    disposeRoot()
    root = build(container)
  })
  observer.observe(document.documentElement, {
    attributes: true,
    // `dir` flips when the locale switches to/from RTL, and needs the same rebuild-on-attribute
    // treatment as `data-theme` since RTL axis/label settings are baked in at build time.
    attributeFilter: ['data-theme', 'dir']
  })

  if (document.documentElement.hasAttribute('data-theme')) {
    root = build(container)
  }

  return () => {
    observer.disconnect()
    disposeRoot()
  }
}
