import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

import Button from '@/components/Buttons/Button'
import Icon from '@/components/DataDisplay/Icon'
import Dialog from '@/components/Overlays/Dialog'

const meta = {
  component: Dialog.Root,
  title: 'Overlays/Dialog'
} satisfies Meta<typeof Dialog.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <Dialog.Root>
        <Dialog.Trigger render={<Button variant='contained' />}>
          <Icon name='plus' />
          {t('common.actions.addToCompare')}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Title>{t('stories.dialog.title')}</Dialog.Title>
            <Dialog.Description>{t('stories.dialog.description')}</Dialog.Description>
            <Dialog.Close aria-label={t('stories.dialog.closeAriaLabel')} />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }
}
