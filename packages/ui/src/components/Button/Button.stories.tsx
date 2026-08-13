import type { Meta, StoryObj } from '@storybook/react-vite'

import Button from '@/components/Button'
import Icon from '@/components/Icon'

const meta = {
  component: Button,
  title: 'Buttons/Button'
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
        <Icon name='arrow-left' />
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
        <Icon name='plus' />
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
