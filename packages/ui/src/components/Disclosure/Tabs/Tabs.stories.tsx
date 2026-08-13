import type { Meta, StoryObj } from '@storybook/react-vite'

import Tabs from '@/components/Disclosure/Tabs'

const indicators = [
  { value: 'gdp', label: 'GDP' },
  { value: 'gdp-cap', label: 'GDP/cap' },
  { value: 'inflation', label: 'Inflation' },
  { value: 'unemployment', label: 'Unemployment' }
]

const meta = {
  component: Tabs.Root,
  title: 'Disclosure/Tabs',
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
  render: (args) => (
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
          {label} panel content
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  )
}
