import type { Meta, StoryObj } from '@storybook/react-vite'

import Icon from '@/components/Icon'
import TextField from '@/components/TextField'

const meta = {
  component: TextField,
  title: 'TextField'
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Search countries'
  }
}

export const WithStartAdornment: Story = {
  args: {
    startAdornment: <Icon name='search' />,
    placeholder: 'Search countries'
  }
}

export const WithEndAdornment: Story = {
  args: {
    endAdornment: 'USD B',
    defaultValue: '1000'
  }
}

export const Tabular: Story = {
  args: {
    tabular: true,
    endAdornment: '%',
    defaultValue: '2.1'
  }
}

export const Error: Story = {
  args: {
    error: true,
    defaultValue: '20244'
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'DEU'
  }
}
