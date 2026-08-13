import type { Meta, StoryObj } from '@storybook/react-vite'

import IconButton from '@/components/Buttons/IconButton'
import Icon from '@/components/DataDisplay/Icon'

const meta = {
  component: IconButton,
  title: 'Buttons/IconButton',
  args: {
    'aria-label': 'Search',
    children: <Icon name='search' />
  }
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Contained: Story = {
  args: {
    variant: 'contained'
  }
}

export const Small: Story = {
  args: {
    size: 'sm'
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}
