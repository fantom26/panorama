import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { expect, screen, userEvent, waitFor } from 'storybook/test'

import Button from '@/components/Buttons/Button'
import Icon from '@/components/DataDisplay/Icon'
import Dialog from '@/components/Overlays/Dialog'

const meta = {
  component: Dialog.Root
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
          {t('actions.addToCompare')}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Title>{t('dialog.title')}</Dialog.Title>
            <Dialog.Description>{t('dialog.description')}</Dialog.Description>
            <Dialog.Close aria-label={t('dialog.closeAriaLabel')} />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    )
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Add to Compare' })
    await userEvent.click(trigger)

    const dialog = await screen.findByRole('dialog')
    await waitFor(() => expect(dialog).toBeVisible())
    await expect(screen.getByRole('heading', { name: 'Add country to compare' })).toBeVisible()
    await expect(
      screen.getByText('Search and select a country to add to the comparison. Up to 5 countries.')
    ).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    await userEvent.click(trigger)
    await screen.findByRole('dialog')

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  }
}
