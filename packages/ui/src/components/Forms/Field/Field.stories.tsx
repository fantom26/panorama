import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

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
  render: () => {
    const { t } = useTranslation()
    return (
      <Field label={t('stories.field.searchLabel')}>
        <TextField
          startAdornment={<Icon name='search' />}
          placeholder={t('stories.field.searchPlaceholder')}
        />
      </Field>
    )
  }
}

export const WithHint: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <Field label={t('stories.field.gdpFloorLabel')} hint={t('stories.field.gdpFloorHint')}>
        <TextField
          tabular
          endAdornment={t('stories.field.gdpFloorAdornment')}
          defaultValue='1000'
        />
      </Field>
    )
  }
}

export const WithError: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <Field label={t('stories.field.yearLabel')} error={t('stories.field.yearError')}>
        <TextField tabular defaultValue='20244' />
      </Field>
    )
  }
}

export const Required: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <Field label={t('stories.field.isoCodeLabel')} required>
        <TextField placeholder='DEU' />
      </Field>
    )
  }
}
