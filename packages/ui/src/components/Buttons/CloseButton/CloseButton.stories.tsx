import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'

import CloseButton from '@/components/Buttons/CloseButton'

const meta = {
  component: CloseButton
} satisfies Meta<typeof CloseButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onClick: fn()
  },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Close' })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  }
}

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
    disabled: true,
    onClick: fn()
  },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Close' })
    await expect(button).toBeDisabled()

    await userEvent.click(button)
    await expect(args.onClick).not.toHaveBeenCalled()
  }
}
