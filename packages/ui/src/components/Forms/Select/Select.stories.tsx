import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { expect, screen, userEvent, waitFor } from 'storybook/test'

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
  { label: 'Inflation, CPI', value: 'inflation', disabled: true },
  { label: 'Unemployment', value: 'unemp' }
]

const meta = {
  component: Select,
  args: {
    options: regionOptions
  },
  render: (args) => {
    const { t } = useTranslation()
    return <Select {...args} placeholder={t('select.allRegions')} aria-label={t('select.region')} />
  }
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox')
    await userEvent.click(trigger)

    const option = await screen.findByRole('option', { name: 'Europe' })
    await userEvent.click(option)

    await expect(trigger).toHaveTextContent('Europe')
  }
}

export const WithValue: Story = {
  args: {
    options: indicatorOptions,
    defaultValue: 'gdp'
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox')
    await expect(trigger).toHaveTextContent('GDP, nominal USD')

    await userEvent.click(trigger)
    const disabledOption = await screen.findByRole('option', { name: 'Inflation, CPI' })
    await expect(disabledOption).toHaveAttribute('aria-disabled', 'true')

    await userEvent.click(disabledOption)
    await expect(trigger).toHaveTextContent('GDP, nominal USD')

    const unemploymentOption = screen.getByRole('option', { name: 'Unemployment' })
    await userEvent.click(unemploymentOption)
    await expect(trigger).toHaveTextContent('Unemployment')

    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
  }
}

export const Error: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <Field label={t('select.locale')} error={t('select.unsupportedLocale')}>
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
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox')
    await expect(trigger).toHaveAttribute('data-disabled')

    await userEvent.click(trigger)
    await expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  }
}

export const InField: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <Field label={t('select.region')}>
        <Select options={regionOptions} placeholder={t('select.allRegions')} />
      </Field>
    )
  }
}
