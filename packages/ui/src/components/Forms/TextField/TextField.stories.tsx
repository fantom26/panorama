import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

import Icon from '@/components/DataDisplay/Icon'
import TextField from '@/components/Forms/TextField'

const meta = {
  component: TextField,
  title: 'Forms/TextField'
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const { t } = useTranslation()
    return <TextField {...args} placeholder={t('stories.textField.searchPlaceholder')} />
  }
}

export const WithStartAdornment: Story = {
  args: {
    startAdornment: <Icon name='search' />
  },
  render: (args) => {
    const { t } = useTranslation()
    return <TextField {...args} placeholder={t('stories.textField.searchPlaceholder')} />
  }
}

export const WithEndAdornment: Story = {
  args: {
    defaultValue: '1000'
  },
  render: (args) => {
    const { t } = useTranslation()
    return <TextField {...args} endAdornment={t('stories.textField.usdBAdornment')} />
  }
}

export const Tabular: Story = {
  args: {
    tabular: true,
    defaultValue: '2.1'
  },
  render: (args) => {
    const { t } = useTranslation()
    return <TextField {...args} endAdornment={t('stories.textField.percentAdornment')} />
  }
}

export const Error: Story = {
  args: {
    error: true,
    defaultValue: '20244'
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'DEU'
  }
}
