import { RadioGroup } from '@base-ui/react/radio-group'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { expect, userEvent } from 'storybook/test'

import Radio from '@/components/Forms/Radio'

const meta = {
  component: Radio,
  args: {
    value: 'log',
    label: ''
  },
  render: (args) => {
    const { t } = useTranslation()
    return <Radio {...args} label={t('radio.logarithmic')} />
  }
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  render: (args) => {
    const { t } = useTranslation()
    return <Radio {...args} label={t('radio.logarithmic')} hint={t('radio.logarithmicHint')} />
  }
}

export const Error: Story = {
  render: (args) => {
    const { t } = useTranslation()
    return <Radio {...args} label={t('radio.logarithmic')} error={t('radio.chooseScaleError')} />
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  },
  play: async ({ canvas }) => {
    const radio = canvas.getByRole('radio')
    await expect(radio).toHaveAttribute('aria-disabled', 'true')

    await userEvent.click(radio)
    await expect(radio).not.toBeChecked()
  }
}

export const Group: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <RadioGroup
        name='scale'
        defaultValue='log'
        aria-label={t('radio.mapScaleAriaLabel')}
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <Radio value='log' label={t('radio.logarithmic')} hint={t('radio.logarithmicHint')} />
        <Radio value='linear' label={t('radio.linear')} />
        <Radio value='quantile' label={t('radio.quantile')} disabled />
      </RadioGroup>
    )
  },
  play: async ({ canvas }) => {
    const [logRadio, linearRadio, quantileRadio] = canvas.getAllByRole('radio') as [
      HTMLElement,
      HTMLElement,
      HTMLElement
    ]

    await expect(logRadio).toBeChecked()
    await expect(linearRadio).not.toBeChecked()

    await userEvent.click(linearRadio)
    await expect(linearRadio).toBeChecked()
    await expect(logRadio).not.toBeChecked()

    await expect(quantileRadio).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(quantileRadio)
    await expect(quantileRadio).not.toBeChecked()
    await expect(linearRadio).toBeChecked()
  }
}
