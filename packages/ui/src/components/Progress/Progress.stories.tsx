import type { Meta, StoryObj } from '@storybook/react-vite'

import Progress from '@/components/Progress'

const meta = {
  component: Progress.Root,
  title: 'Progress'
} satisfies Meta<typeof Progress.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 40,
    'aria-label': 'Amount of countries with a specific language'
  },
  render: (args) => (
    <Progress.Root {...args}>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
    </Progress.Root>
  )
}

export const Complete: Story = {
  args: {
    value: 100,
    'aria-label': 'Amount of countries with a specific language'
  },
  render: Default.render
}
