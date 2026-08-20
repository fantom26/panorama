import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

import Icon from '@/components/DataDisplay/Icon'
import Field from '@/components/Forms/Field'
import TextField from '@/components/Forms/TextField'

const meta = {
  component: Field
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <Field label={t('field.searchLabel')}>
        <TextField
          startAdornment={<Icon name='search' />}
          placeholder={t('field.searchPlaceholder')}
        />
      </Field>
    )
  }
}

export const WithHint: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <Field label={t('field.gdpFloorLabel')} hint={t('field.gdpFloorHint')}>
        <TextField tabular endAdornment={t('field.gdpFloorAdornment')} defaultValue='1000' />
      </Field>
    )
  }
}

export const WithError: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <Field label={t('field.yearLabel')} error={t('field.yearError')}>
        <TextField tabular defaultValue='20244' />
      </Field>
    )
  }
}

export const Required: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <Field label={t('field.isoCodeLabel')} required>
        <TextField placeholder='DEU' />
      </Field>
    )
  }
}
