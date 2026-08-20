import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { expect, screen, userEvent, waitFor } from 'storybook/test'

import Button from '@/components/Buttons/Button'
import Icon from '@/components/DataDisplay/Icon'
import Typography from '@/components/DataDisplay/Typography'
import Drawer, { type DrawerAnchor } from '@/components/Overlays/Drawer'

function DrawerDemo({ anchor = 'right' }: { anchor?: DrawerAnchor }) {
  const { t } = useTranslation()

  return (
    <Drawer.Root anchor={anchor}>
      <Drawer.Trigger render={<Button variant='contained' />}>
        <Icon name='plus' />
        {t('common.actions.openDrawer')}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup>
            <Drawer.Header>
              <div>
                <Typography variant='meta-sm' color='subtle'>
                  {t('stories.drawer.compareLabel')}
                </Typography>
                <Drawer.Title>{t('stories.drawer.selectedTitle')}</Drawer.Title>
              </div>
              <Drawer.Close aria-label={t('stories.drawer.closeAriaLabel')} />
            </Drawer.Header>
            <Drawer.Content style={{ padding: 16 }}>
              <Typography variant='body-sm'>Germany — GDP $4.5T</Typography>
              <Typography variant='body-sm'>France — GDP $3.0T</Typography>
            </Drawer.Content>
            <Drawer.Footer>
              <Button variant='contained' style={{ flex: 1 }}>
                {t('common.actions.apply')}
              </Button>
            </Drawer.Footer>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

const meta = {
  component: Drawer.Root,
  argTypes: {
    anchor: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right']
    }
  },
  args: {
    anchor: 'right'
  },
  render: (args) => <DrawerDemo anchor={args.anchor} />
} satisfies Meta<typeof Drawer.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Open drawer' })
    await userEvent.click(trigger)

    const dialog = await screen.findByRole('dialog')
    await waitFor(() => expect(dialog).toBeVisible())
    await expect(screen.getByRole('heading', { name: 'Selected' })).toBeVisible()
    await expect(screen.getByRole('button', { name: 'Apply' })).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'Close drawer' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    await userEvent.click(trigger)
    await screen.findByRole('dialog')

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  }
}

export const Top: Story = {
  args: {
    anchor: 'top'
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Open drawer' })
    await userEvent.click(trigger)

    const dialog = await screen.findByRole('dialog')
    await waitFor(() => expect(dialog).toBeVisible())
    await expect(dialog).toHaveAttribute('data-swipe-direction', 'up')
  }
}

export const Bottom: Story = {
  args: {
    anchor: 'bottom'
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Open drawer' })
    await userEvent.click(trigger)

    const dialog = await screen.findByRole('dialog')
    await waitFor(() => expect(dialog).toBeVisible())
    await expect(dialog).toHaveAttribute('data-swipe-direction', 'down')
  }
}

export const Left: Story = {
  args: {
    anchor: 'left'
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Open drawer' })
    await userEvent.click(trigger)

    const dialog = await screen.findByRole('dialog')
    await waitFor(() => expect(dialog).toBeVisible())
    await expect(dialog).toHaveAttribute('data-swipe-direction', 'left')
  }
}
