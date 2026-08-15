import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

import Button from '@/components/Buttons/Button'
import Toast from '@/components/Feedback/Toast'
import { useToastManager } from '@/components/Feedback/Toast/useToastManager'

const meta = {
  component: Toast.Provider,
  title: 'Feedback/Toast'
} satisfies Meta<typeof Toast.Provider>

export default meta
type Story = StoryObj<typeof meta>

function useSampleToasts() {
  const { t } = useTranslation()
  return [
    {
      type: 'info',
      title: t('stories.toast.syncingTitle'),
      description: t('stories.toast.syncingDescription')
    },
    {
      type: 'success',
      title: t('stories.toast.syncedTitle'),
      description: t('stories.toast.syncedDescription')
    },
    {
      type: 'error',
      title: t('stories.toast.requestFailedTitle'),
      description: t('stories.toast.requestFailedDescription'),
      actionProps: { children: t('common.actions.retry'), onClick: () => {} }
    },
    {
      type: 'warning',
      title: t('stories.toast.staleTitle'),
      description: t('stories.toast.staleDescription')
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
        {t('common.actions.showAll')}
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
  )
}

export const Stacked: Story = {
  render: () => (
    <Toast.Provider limit={4}>
      <StackedToastsDemo />
    </Toast.Provider>
  )
}
