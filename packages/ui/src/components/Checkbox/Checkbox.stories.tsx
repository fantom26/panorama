import type { Meta, StoryObj } from '@storybook/react-vite'

import Checkbox from '@/components/Checkbox'

const meta = {
  component: Checkbox,
  title: 'Forms/Checkbox',
  args: {
    label: 'Include disputed territories'
  }
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: {
    defaultChecked: true
  }
}

export const WithHint: Story = {
  args: {
    label: 'Show null indicators',
    hint: 'Countries missing World Bank data',
    defaultChecked: true
  }
}

export const Indeterminate: Story = {
  args: {
    label: 'All rows',
    indeterminate: true
  }
}

export const Error: Story = {
  args: {
    label: 'Accept the data usage terms',
    error: true
  }
}

export const Disabled: Story = {
  args: {
    label: 'Aggregate regions',
    hint: 'Requires the compare flag',
    disabled: true
  }
}
