import { DesignTokenDocBlock } from 'storybook-design-token'

const THEMES = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' }
] as const

type TokenThemeSectionsProps = {
  categoryName: string
}

export const TokenThemeSections = ({ categoryName }: TokenThemeSectionsProps) => (
  <>
    {THEMES.map(({ key, label }) => (
      <div key={key}>
        <h3>{label}</h3>
        <DesignTokenDocBlock categoryName={categoryName} theme={key} viewType='table' />
      </div>
    ))}
  </>
)
