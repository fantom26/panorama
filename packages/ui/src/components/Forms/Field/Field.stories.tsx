import type { Meta, StoryObj } from '@storybook/react-vite'

import Icon from '@/components/DataDisplay/Icon'
import Field from '@/components/Forms/Field'
import TextField from '@/components/Forms/TextField'

const meta = {
  component: Field,
  title: 'Forms/Field'
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Field label='Search'>
      <TextField startAdornment={<Icon name='search' />} placeholder='Search countries' />
    </Field>
  )
}

export const WithHint: Story = {
  render: () => (
    <Field label='GDP floor' hint='Filters the ranking chart'>
      <TextField tabular endAdornment='USD B' defaultValue='1000' />
    </Field>
  )
}

export const WithError: Story = {
  render: () => (
    <Field label='Year' error='Must be between 1960 and 2024'>
      <TextField tabular defaultValue='20244' />
    </Field>
  )
}

export const Required: Story = {
  render: () => (
    <Field label='ISO code' required>
      <TextField placeholder='DEU' />
    </Field>
  )
}
