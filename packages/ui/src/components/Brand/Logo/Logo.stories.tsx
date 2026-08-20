import type { Meta, StoryObj } from '@storybook/react-vite'

import Logo from '@/components/Brand/Logo'

const meta = {
  component: Logo,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['full', 'mark']
    }
  }
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mark: Story = {
  args: {
    variant: 'mark'
  }
}
