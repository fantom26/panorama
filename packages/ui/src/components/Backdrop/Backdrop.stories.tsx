import type { Meta, StoryObj } from '@storybook/react-vite'

import Backdrop from '@/components/Backdrop'

const meta = {
  component: Backdrop,
  title: 'Overlays/Backdrop'
} satisfies Meta<typeof Backdrop>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ position: 'relative', height: 240 }}>
      <Backdrop style={{ position: 'absolute' }} />
    </div>
  )
}
