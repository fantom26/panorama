import type { Meta, StoryObj } from '@storybook/react-vite'

import Field from '@/components/Field'
import Select from '@/components/Select'

const regionOptions = [
  { label: 'Africa', value: 'africa' },
  { label: 'Americas', value: 'americas' },
  { label: 'Asia', value: 'asia' },
  { label: 'Europe', value: 'europe' },
  { label: 'Oceania', value: 'oceania' }
]

const indicatorOptions = [
  { label: 'GDP, nominal USD', value: 'gdp' },
  { label: 'GDP per capita', value: 'gdppc' },
  { label: 'Inflation, CPI', value: 'inflation' },
  { label: 'Unemployment', value: 'unemp' }
]

const meta = {
  component: Select,
  title: 'Select',
  args: {
    options: regionOptions,
    placeholder: 'All regions'
  }
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: {
    options: indicatorOptions,
    defaultValue: 'gdp'
  }
}

export const Error: Story = {
  render: () => (
    <Field label='Locale' error='Unsupported locale'>
      <Select error defaultValue='zz' options={[{ label: 'zz — unknown', value: 'zz' }]} />
    </Field>
  )
}

export const Disabled: Story = {
  args: {
    options: [{ label: 'DEU', value: 'deu' }],
    defaultValue: 'deu',
    disabled: true
  }
}

export const InField: Story = {
  render: () => (
    <Field label='Region'>
      <Select options={regionOptions} placeholder='All regions' />
    </Field>
  )
}
