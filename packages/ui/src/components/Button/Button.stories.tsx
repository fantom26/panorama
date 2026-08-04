import type { Meta, StoryObj } from '@storybook/react-vite'

import Button from '.'

const meta = {
  component: Button,
  title: 'Button'
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Submit'
  }
}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: '← Back'
  }
}

export const Contained: Story = {
  args: {
    variant: 'contained',
    children: '+ Add to Compare'
  }
}

export const Disabled: Story = {
  args: {
    variant: 'contained',
    children: 'Submit',
    disabled: true
  }
}
