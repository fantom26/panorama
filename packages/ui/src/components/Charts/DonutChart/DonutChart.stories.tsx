import type { Meta, StoryObj } from '@storybook/react-vite'

import DonutChart from '@/components/Charts/DonutChart'

const popByRegion = [
  { label: 'Asia', value: 4720 },
  { label: 'Africa', value: 1480 },
  { label: 'Americas', value: 1050 },
  { label: 'Europe', value: 745 },
  { label: 'Oceania', value: 45 }
]

const meta = {
  component: DonutChart,
  title: 'Charts/DonutChart',
  args: {
    data: popByRegion,
    size: 190
  }
} satisfies Meta<typeof DonutChart>

export default meta
type Story = StoryObj<typeof meta>

export const Row: Story = {}

export const Column: Story = {
  args: {
    size: 140,
    layout: 'column'
  }
}
