import type { Meta, StoryObj } from '@storybook/react-vite'

import StatCard from '@/components/StatCard'

const meta = {
  component: StatCard,
  title: 'StatCard'
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Total population',
    value: '7.95B',
    trend: '+0.87% YoY',
    trendColor: 'success'
  }
}

export const NegativeTrend: Story = {
  args: {
    label: 'Unemployment rate',
    value: '4.2%',
    trend: '−0.3pp YoY',
    trendColor: 'error'
  }
}

export const DefaultTrend: Story = {
  args: {
    label: 'Median age',
    value: '38.9',
    trend: 'nominal, USD'
  }
}

export const NoTrend: Story = {
  args: {
    label: 'GDP per capita',
    value: '$68,300'
  }
}

export const Loading: Story = {
  args: {
    label: 'Total population',
    value: '7.95B',
    trend: '+0.87% YoY',
    loading: true
  }
}
