import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { expect, userEvent } from 'storybook/test'

import Checkbox from '@/components/Forms/Checkbox'

const meta = {
  component: Checkbox,
  args: {
    label: ''
  },
  render: (args) => {
    const { t } = useTranslation()
    return <Checkbox {...args} label={t('checkbox.includeDisputedTerritories')} />
  }
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).not.toBeChecked()

    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()

    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
  }
}

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
        label={t('checkbox.showNullIndicators')}
        hint={t('checkbox.showNullIndicatorsHint')}
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
    return <Checkbox {...args} label={t('checkbox.allRows')} />
  }
}

export const Error: Story = {
  render: (args) => {
    const { t } = useTranslation()
    return (
      <Checkbox
        {...args}
        label={t('checkbox.acceptTerms')}
        error={t('checkbox.acceptTermsError')}
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
        label={t('checkbox.aggregateRegions')}
        hint={t('checkbox.aggregateRegionsHint')}
      />
    )
  },
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).toHaveAttribute('aria-disabled', 'true')

    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
  }
}
