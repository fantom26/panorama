import { DesignTokenDocBlock } from 'storybook-design-token'

const THEMES = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' }
] as const

type TokenThemeSectionsProps = {
  categoryName: string
  splitByTheme?: boolean
}

export const TokenThemeSections = ({
  categoryName,
  splitByTheme = false
}: TokenThemeSectionsProps) => {
  if (!splitByTheme) {
    return <DesignTokenDocBlock categoryName={categoryName} viewType='table' />
  }

  return (
    <>
      {THEMES.map(({ key, label }) => (
        <div key={key}>
          <h3>{label}</h3>
          <DesignTokenDocBlock categoryName={categoryName} theme={key} viewType='table' />
        </div>
      ))}
    </>
  )
}
