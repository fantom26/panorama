import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

import Button from '@/components/Buttons/Button'
import Icon from '@/components/DataDisplay/Icon'

const meta = {
  component: Button
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const { t } = useTranslation()
    return <Button {...args}>{t('common.actions.submit')}</Button>
  }
}

export const Outlined: Story = {
  args: {
    variant: 'outlined'
  },
  render: (args) => {
    const { t } = useTranslation()
    return (
      <Button {...args}>
        <Icon name='arrow-left' />
        {t('common.actions.back')}
      </Button>
    )
  }
}

export const Contained: Story = {
  args: {
    variant: 'contained'
  },
  render: (args) => {
    const { t } = useTranslation()
    return (
      <Button {...args}>
        <Icon name='plus' />
        {t('common.actions.addToCompare')}
      </Button>
    )
  }
}

export const Disabled: Story = {
  args: {
    variant: 'contained',
    disabled: true
  },
  render: (args) => {
    const { t } = useTranslation()
    return <Button {...args}>{t('common.actions.submit')}</Button>
  }
}
