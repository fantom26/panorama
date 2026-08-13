import type { Meta, StoryObj } from '@storybook/react-vite'

import CloseButton from '@/components/CloseButton'

const meta = {
  component: CloseButton,
  title: 'Buttons/CloseButton'
} satisfies Meta<typeof CloseButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Medium: Story = {
  args: {
    size: 'md'
  }
}

export const Contained: Story = {
  args: {
    variant: 'contained'
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}
