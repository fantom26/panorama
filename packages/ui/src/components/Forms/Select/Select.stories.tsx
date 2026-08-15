import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

import Field from '@/components/Forms/Field'
import Select from '@/components/Forms/Select'

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
  title: 'Forms/Select',
  args: {
    options: regionOptions
  },
  render: (args) => {
    const { t } = useTranslation()
    return <Select {...args} placeholder={t('stories.select.allRegions')} />
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
  render: () => {
    const { t } = useTranslation()
    return (
      <Field label={t('stories.select.locale')} error={t('stories.select.unsupportedLocale')}>
        <Select error defaultValue='zz' options={[{ label: 'zz — unknown', value: 'zz' }]} />
      </Field>
    )
  }
}

export const Disabled: Story = {
  args: {
    options: [{ label: 'DEU', value: 'deu' }],
    defaultValue: 'deu',
    disabled: true
  }
}

export const InField: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <Field label={t('stories.select.region')}>
        <Select options={regionOptions} placeholder={t('stories.select.allRegions')} />
      </Field>
    )
  }
}
