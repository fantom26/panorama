import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { expect, fn, userEvent } from 'storybook/test'

import IconButton from '@/components/Buttons/IconButton'
import Icon from '@/components/DataDisplay/Icon'

const meta = {
  component: IconButton,
  render: (args) => {
    const { t } = useTranslation()
    return (
      <IconButton {...args} aria-label={t('iconButton.searchAriaLabel')}>
        <Icon name='search' />
      </IconButton>
    )
  }
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onClick: fn()
  },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Search' })
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  }
}

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
    disabled: true,
    onClick: fn()
  },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Search' })
    await expect(button).toBeDisabled()

    await userEvent.click(button)
    await expect(args.onClick).not.toHaveBeenCalled()
  }
}
