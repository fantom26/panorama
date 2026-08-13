import type { Meta, StoryObj } from '@storybook/react-vite'

import Button from '@/components/Buttons/Button'
import Toast from '@/components/Feedback/Toast'
import { useToastManager } from '@/components/Feedback/Toast/useToastManager'

const meta = {
  component: Toast.Provider,
  title: 'Feedback/Toast'
} satisfies Meta<typeof Toast.Provider>

export default meta
type Story = StoryObj<typeof meta>

const sampleToasts = [
  {
    type: 'info',
    title: 'Syncing',
    description: 'Fetching World Bank indicators…'
  },
  {
    type: 'success',
    title: 'Synced',
    description: '249 countries updated.'
  },
  {
    type: 'error',
    title: 'Request failed',
    description: 'Indicator data unavailable for 3 countries.',
    actionProps: { children: 'Retry', onClick: () => {} }
  },
  {
    type: 'warning',
    title: 'Data may be stale',
    description: 'Last refresh was over 24 hours ago.'
  }
] as const

function ToastDemo() {
  const { toasts, add } = useToastManager()

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

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button onClick={() => sampleToasts.forEach((sample) => add({ ...sample, timeout: 0 }))}>
        Show all
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
