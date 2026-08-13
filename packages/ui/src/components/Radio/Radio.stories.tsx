import { RadioGroup } from '@base-ui/react/radio-group'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Radio from '@/components/Radio'

const meta = {
  component: Radio,
  title: 'Forms/Radio',
  args: {
    value: 'log',
    label: 'Logarithmic'
  }
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  args: {
    hint: 'Default — spreads small economies'
  }
}

export const Error: Story = {
  args: {
    error: true
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}

export const Group: Story = {
  render: () => (
    <RadioGroup
      name='scale'
      defaultValue='log'
      aria-label='Map scale'
      style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <Radio value='log' label='Logarithmic' hint='Default — spreads small economies' />
      <Radio value='linear' label='Linear' />
      <Radio value='quantile' label='Quantile' disabled />
    </RadioGroup>
  )
}
