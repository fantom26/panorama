import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

import StatCard from '@/components/DataDisplay/StatCard'

const meta = {
  component: StatCard
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: '',
    value: '7.95B',
    trend: '+0.87% YoY',
    trendColor: 'success'
  },
  render: (args) => {
    const { t } = useTranslation()
    return <StatCard {...args} label={t('statCard.totalPopulation')} />
  }
}

export const NegativeTrend: Story = {
  args: {
    label: '',
    value: '4.2%',
    trend: '−0.3pp YoY',
    trendColor: 'error'
  },
  render: (args) => {
    const { t } = useTranslation()
    return <StatCard {...args} label={t('statCard.unemploymentRate')} />
  }
}

export const DefaultTrend: Story = {
  args: {
    label: '',
    value: '38.9',
    trend: 'nominal, USD'
  },
  render: (args) => {
    const { t } = useTranslation()
    return <StatCard {...args} label={t('statCard.medianAge')} />
  }
}

export const NoTrend: Story = {
  args: {
    label: '',
    value: '$68,300'
  },
  render: (args) => {
    const { t } = useTranslation()
    return <StatCard {...args} label={t('statCard.gdpPerCapita')} />
  }
}

export const RowVariant: Story = {
  args: {
    label: '',
    value: '7.95B',
    trend: '+0.87% YoY',
    trendColor: 'success',
    variant: 'row'
  },
  render: (args) => {
    const { t } = useTranslation()
    return (
      <div style={{ display: 'flex' }}>
        <StatCard {...args} label={t('statCard.totalPopulation')} />
        <StatCard {...args} label={t('statCard.gdpPerCapita')} value='$68,300' trend={undefined} />
      </div>
    )
  }
}

export const Loading: Story = {
  args: {
    label: '',
    value: '7.95B',
    trend: '+0.87% YoY',
    loading: true
  },
  render: (args) => {
    const { t } = useTranslation()
    return <StatCard {...args} label={t('statCard.totalPopulation')} />
  }
}
