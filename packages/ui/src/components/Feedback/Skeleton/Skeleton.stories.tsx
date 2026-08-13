import type { Meta, StoryObj } from '@storybook/react-vite'

import Skeleton from '@/components/Feedback/Skeleton'

const meta = {
  component: Skeleton,
  title: 'Feedback/Skeleton',
  args: {
    variant: 'text'
  }
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {
  args: {
    variant: 'text'
  }
}

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 100
  }
}
