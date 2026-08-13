import type { Meta, StoryObj } from '@storybook/react-vite'

import Hint from '@/components/Hint'

const meta = {
  component: Hint,
  title: 'Forms/Hint',
  args: {
    text: 'Filters the ranking chart'
  }
} satisfies Meta<typeof Hint>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Error: Story = {
  args: {
    error: true,
    text: 'Must be between 1960 and 2024'
  }
}
