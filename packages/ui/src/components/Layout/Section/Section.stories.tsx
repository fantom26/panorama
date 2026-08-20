import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import DonutChart from '@/components/Charts/DonutChart'
import RankingList from '@/components/Charts/RankingList'
import Typography from '@/components/DataDisplay/Typography'
import Section from '@/components/Layout/Section'

const gdpByRegion = [
  { label: 'Asia', value: 38400 },
  { label: 'Americas', value: 31200 },
  { label: 'Europe', value: 24100 },
  { label: 'Africa', value: 3100 },
  { label: 'Oceania', value: 1800 }
]

const populationByRegion = [
  { label: 'Asia', value: 4720 },
  { label: 'Africa', value: 1480 },
  { label: 'Americas', value: 1050 },
  { label: 'Europe', value: 745 },
  { label: 'Oceania', value: 45 }
]

const meta = {
  component: Section,
  args: {
    number: '01',
    title: 'GDP heatmap'
  }
} satisfies Meta<typeof Section>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <Typography variant='body-sm'>Choropleth map placeholder.</Typography>
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('01')).toBeInTheDocument()
    await expect(canvas.getByRole('heading', { name: 'GDP heatmap' })).toBeInTheDocument()
  }
}

export const WithAction: Story = {
  args: {
    number: '02',
    title: 'GDP by region',
    action: 'USD, billions',
    children: (
      <RankingList data={gdpByRegion} formatValue={(value) => `$${(value / 1000).toFixed(1)}T`} />
    )
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('USD, billions')).toBeInTheDocument()
    await expect(canvas.getAllByRole('progressbar')).toHaveLength(gdpByRegion.length)
  }
}

export const WithChartChildren: Story = {
  args: {
    number: '03',
    title: 'Population by region',
    children: <DonutChart data={populationByRegion} size={160} />
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Population by region' })).toBeInTheDocument()
    await expect(canvas.getByText('Asia')).toBeInTheDocument()
  }
}
