import { RadioGroup } from '@base-ui/react/radio-group'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

import Radio from '@/components/Forms/Radio'

const meta = {
  component: Radio,
  title: 'Forms/Radio',
  args: {
    value: 'log',
    label: ''
  },
  render: (args) => {
    const { t } = useTranslation()
    return <Radio {...args} label={t('stories.radio.logarithmic')} />
  }
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  render: (args) => {
    const { t } = useTranslation()
    return (
      <Radio
        {...args}
        label={t('stories.radio.logarithmic')}
        hint={t('stories.radio.logarithmicHint')}
      />
    )
  }
}

export const Error: Story = {
  render: (args) => {
    const { t } = useTranslation()
    return (
      <Radio
        {...args}
        label={t('stories.radio.logarithmic')}
        error={t('stories.radio.chooseScaleError')}
      />
    )
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}

export const Group: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <RadioGroup
        name='scale'
        defaultValue='log'
        aria-label={t('stories.radio.mapScaleAriaLabel')}
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        <Radio
          value='log'
          label={t('stories.radio.logarithmic')}
          hint={t('stories.radio.logarithmicHint')}
        />
        <Radio value='linear' label={t('stories.radio.linear')} />
        <Radio value='quantile' label={t('stories.radio.quantile')} disabled />
      </RadioGroup>
    )
  }
}
