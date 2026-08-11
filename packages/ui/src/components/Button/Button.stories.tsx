import { ArrowLeft, Plus } from 'lucide-react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import Button from '@/components/Button'

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
    children: (
      <>
        <ArrowLeft size={16} />
        Back
      </>
    )
  }
}

export const Contained: Story = {
  args: {
    variant: 'contained',
    children: (
      <>
        <Plus size={16} />
        Add to Compare
      </>
    )
  }
}

export const Disabled: Story = {
  args: {
    variant: 'contained',
    children: 'Submit',
    disabled: true
  }
}
