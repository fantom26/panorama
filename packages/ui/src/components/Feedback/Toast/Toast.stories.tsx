import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { expect, screen, userEvent, waitFor } from 'storybook/test'

import Button from '@/components/Buttons/Button'
import Toast from '@/components/Feedback/Toast'
import { useToastManager } from '@/components/Feedback/Toast/useToastManager'

const meta = {
  component: Toast.Provider
} satisfies Meta<typeof Toast.Provider>

export default meta
type Story = StoryObj<typeof meta>

function useSampleToasts() {
  const { t } = useTranslation()
  return [
    {
      type: 'info',
      title: t('toast.syncingTitle'),
      description: t('toast.syncingDescription')
    },
    {
      type: 'success',
      title: t('toast.syncedTitle'),
      description: t('toast.syncedDescription')
    },
    {
      type: 'error',
      title: t('toast.requestFailedTitle'),
      description: t('toast.requestFailedDescription'),
      actionProps: { children: t('actions.retry'), onClick: () => {} }
    },
    {
      type: 'warning',
      title: t('toast.staleTitle'),
      description: t('toast.staleDescription')
    }
  ] as const
}

function ToastDemo() {
  const { toasts, add } = useToastManager()
  const sampleToasts = useSampleToasts()

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {sampleToasts.map((sample) => (
        <Button key={sample.type} onClick={() => add(sample)}>
          {sample.title}
        </Button>
      ))}

      <Toast.Viewport>
        {toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast} />
        ))}
      </Toast.Viewport>
    </div>
  )
}

function StackedToastsDemo() {
  const { toasts, add } = useToastManager()
  const { t } = useTranslation()
  const sampleToasts = useSampleToasts()

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button onClick={() => sampleToasts.forEach((sample) => add({ ...sample, timeout: 0 }))}>
        {t('actions.showAll')}
      </Button>

      <Toast.Viewport>
        {toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast} />
        ))}
      </Toast.Viewport>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <Toast.Provider>
      <ToastDemo />
    </Toast.Provider>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Syncing' })
    await userEvent.click(trigger)

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Syncing' })).toBeVisible())
    await expect(screen.getByText('Fetching World Bank indicators…')).toBeVisible()

    const closeButton = document.querySelector('[aria-label="Close"]') as HTMLElement
    await userEvent.click(closeButton)
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Syncing' })).not.toBeInTheDocument()
    )
  }
}

export const Stacked: Story = {
  render: () => (
    <Toast.Provider limit={4}>
      <StackedToastsDemo />
    </Toast.Provider>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Show all' })
    await userEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Syncing' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'Synced' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'Request failed' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'Data may be stale' })).toBeVisible()
    })
  }
}
