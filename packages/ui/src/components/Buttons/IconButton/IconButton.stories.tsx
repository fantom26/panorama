import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

import IconButton from '@/components/Buttons/IconButton'
import Icon from '@/components/DataDisplay/Icon'

const meta = {
  component: IconButton,
  title: 'Buttons/IconButton',
  render: (args) => {
    const { t } = useTranslation()
    return (
      <IconButton {...args} aria-label={t('stories.iconButton.searchAriaLabel')}>
        <Icon name='search' />
      </IconButton>
    )
  }
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Contained: Story = {
  args: {
    variant: 'contained'
  }
}

export const Small: Story = {
  args: {
    size: 'sm'
  }
}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}
