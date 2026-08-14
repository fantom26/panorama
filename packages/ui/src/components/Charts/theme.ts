import * as am5 from '@amcharts/amcharts5'

// Rank-based series ramp: one ink color (textDefault) at five opacity steps, never a
// distinct hue. Clamps rather than wraps — a 6th-ranked slice must reuse the last step,
// never repeat from the top, so callers group anything past index 4 into a single item.
export const CHART_RANK_OPACITIES = [1, 0.68, 0.46, 0.28, 0.13] as const

export type PanoramaChartPalette = {
  primary: am5.Color
  secondary: am5.Color
  tertiary: am5.Color
  surface: am5.Color
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

export function createPanoramaChartTheme(
  root: am5.Root,
  palette: Partial<PanoramaChartPalette>
): am5.Theme {
  class PanoramaChartTheme extends am5.Theme {
    override setupDefaultRules() {
      super.setupDefaultRules()

      const label = this.rule('Label')
      if (palette.fontFamily) label.set('fontFamily', palette.fontFamily)
      if (palette.fontWeight) label.set('fontWeight', palette.fontWeight)
      if (palette.textDefault) label.set('fill', palette.textDefault)

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
