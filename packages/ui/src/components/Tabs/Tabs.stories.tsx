import type { Meta, StoryObj } from '@storybook/react-vite'

import Tabs from '@/components/Tabs'

const meta = {
  component: Tabs.Root,
  title: 'Tabs'
} satisfies Meta<typeof Tabs.Root>

export default meta
type Story = StoryObj<typeof meta>

const indicators = [
  { value: 'gdp', label: 'GDP' },
  { value: 'gdp-cap', label: 'GDP/cap' },
  { value: 'inflation', label: 'Inflation' },
  { value: 'unemployment', label: 'Unemployment' }
]

export const Default: Story = {
  args: {
    defaultValue: 'gdp'
  },
  render: (args) => (
    <Tabs.Root {...args}>
      <Tabs.List>
        {indicators.map(({ value, label }) => (
          <Tabs.Tab key={value} value={value}>
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {indicators.map(({ value, label }) => (
        <Tabs.Panel key={value} value={value}>
          {label} panel content
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  )
}

export const Disabled: Story = {
  args: {
    defaultValue: 'gdp'
  },
  render: (args) => (
    <Tabs.Root {...args}>
      <Tabs.List>
        {indicators.map(({ value, label }, index) => (
          <Tabs.Tab key={value} value={value} disabled={index === 1}>
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {indicators.map(({ value, label }) => (
        <Tabs.Panel key={value} value={value}>
          {label} panel content
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  )
}
