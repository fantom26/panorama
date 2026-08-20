import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

import Checkbox from '@/components/Forms/Checkbox'

const meta = {
  component: Checkbox,
  args: {
    label: ''
  },
  render: (args) => {
    const { t } = useTranslation()
    return <Checkbox {...args} label={t('stories.checkbox.includeDisputedTerritories')} />
  }
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: {
    defaultChecked: true
  }
}

export const WithHint: Story = {
  args: {
    defaultChecked: true
  },
  render: (args) => {
    const { t } = useTranslation()
    return (
      <Checkbox
        {...args}
        label={t('stories.checkbox.showNullIndicators')}
        hint={t('stories.checkbox.showNullIndicatorsHint')}
      />
    )
  }
}

export const Indeterminate: Story = {
  args: {
    indeterminate: true
  },
  render: (args) => {
    const { t } = useTranslation()
    return <Checkbox {...args} label={t('stories.checkbox.allRows')} />
  }
}

export const Error: Story = {
  render: (args) => {
    const { t } = useTranslation()
    return (
      <Checkbox
        {...args}
        label={t('stories.checkbox.acceptTerms')}
        error={t('stories.checkbox.acceptTermsError')}
      />
    )
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  },
  render: (args) => {
    const { t } = useTranslation()
    return (
      <Checkbox
        {...args}
        label={t('stories.checkbox.aggregateRegions')}
        hint={t('stories.checkbox.aggregateRegionsHint')}
      />
    )
  }
}
