import type { Meta, StoryObj } from '@storybook/react-vite'

import Divider from '@/components/Divider'

const meta = {
  component: Divider,
  title: 'Divider'
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal'
  },
  render: (args) => (
    <div style={{ width: 240 }}>
      <Divider {...args} />
    </div>
  )
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical'
  },
  render: (args) => (
    <div style={{ display: 'flex', height: 120 }}>
      <Divider {...args} />
    </div>
  )
}
