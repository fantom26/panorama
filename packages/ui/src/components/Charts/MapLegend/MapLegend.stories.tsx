import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import MapLegend from '@/components/Charts/MapLegend'

const meta = {
  component: MapLegend
} satisfies Meta<typeof MapLegend>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Low')).toBeVisible()
    await expect(canvas.getByText('High')).toBeVisible()
  }
}

export const CustomLabels: Story = {
  args: {
    from: 'Fewer',
    to: 'More'
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Fewer')).toBeVisible()
    await expect(canvas.getByText('More')).toBeVisible()
  }
}

export const WithRange: Story = {
  args: {
    range: '$1.7T ── $27.4T'
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Low')).toBeVisible()
    await expect(canvas.getByText('High')).toBeVisible()
    await expect(canvas.getByText('$1.7T ── $27.4T')).toBeVisible()
  }
}

export const LongLabels: Story = {
  args: {
    from: 'Fewer than 1 million people',
    to: 'More than 1 billion people'
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Fewer than 1 million people')).toBeVisible()
    await expect(canvas.getByText('More than 1 billion people')).toBeVisible()
  }
}
