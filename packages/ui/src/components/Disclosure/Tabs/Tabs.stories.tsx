import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { expect, userEvent } from 'storybook/test'

import Tabs from '@/components/Disclosure/Tabs'

const indicators = [
  { value: 'gdp', label: 'GDP' },
  { value: 'gdp-cap', label: 'GDP/cap' },
  { value: 'inflation', label: 'Inflation' },
  { value: 'unemployment', label: 'Unemployment' }
]

const meta = {
  component: Tabs.Root,
  argTypes: {
    defaultValue: {
      control: { type: 'select' },
      options: indicators.map(({ value }) => value)
    }
  }
} satisfies Meta<typeof Tabs.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: 'gdp'
  },
  render: (args) => {
    const { t } = useTranslation()
    return (
      <Tabs.Root key={args.defaultValue} defaultValue={args.defaultValue}>
        <Tabs.List>
          {indicators.map(({ value, label }) => (
            <Tabs.Tab key={value} value={value}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {indicators.map(({ value, label }) => (
          <Tabs.Panel key={value} value={value}>
            {t('tabs.panelContent', { label })}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    )
  },
  play: async ({ canvas }) => {
    const gdpTab = canvas.getByRole('tab', { name: 'GDP' })
    await expect(gdpTab).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByText('GDP panel content')).toBeVisible()

    const inflationTab = canvas.getByRole('tab', { name: 'Inflation' })
    await userEvent.click(inflationTab)
    await expect(inflationTab).toHaveAttribute('aria-selected', 'true')
    await expect(gdpTab).toHaveAttribute('aria-selected', 'false')
    await expect(canvas.getByText('Inflation panel content')).toBeVisible()
  }
}

export const Disabled: Story = {
  args: {
    defaultValue: 'gdp'
  },
  render: (args) => {
    const { t } = useTranslation()
    return (
      <Tabs.Root key={args.defaultValue} defaultValue={args.defaultValue}>
        <Tabs.List>
          {indicators.map(({ value, label }, index) => (
            <Tabs.Tab key={value} value={value} disabled={index === 1}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {indicators.map(({ value, label }) => (
          <Tabs.Panel key={value} value={value}>
            {t('tabs.panelContent', { label })}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    )
  },
  play: async ({ canvas }) => {
    const gdpTab = canvas.getByRole('tab', { name: 'GDP' })
    const gdpCapTab = canvas.getByRole('tab', { name: 'GDP/cap' })
    await expect(gdpCapTab).toHaveAttribute('aria-disabled', 'true')

    await userEvent.click(gdpCapTab)
    await expect(gdpTab).toHaveAttribute('aria-selected', 'true')
    await expect(gdpCapTab).toHaveAttribute('aria-selected', 'false')
  }
}
