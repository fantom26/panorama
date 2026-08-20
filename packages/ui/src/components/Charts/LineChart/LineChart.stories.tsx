import type { Meta, StoryObj } from '@storybook/react-vite'

import LineChart from '@/components/Charts/LineChart'

const gdpHistory = [
  { year: 2015, value: 3.36 },
  { year: 2016, value: 3.47 },
  { year: 2017, value: 3.69 },
  { year: 2018, value: 3.97 },
  { year: 2019, value: 3.89 },
  { year: 2020, value: 3.89 },
  { year: 2021, value: 4.28 },
  { year: 2022, value: 4.08 },
  { year: 2023, value: 4.46 },
  { year: 2024, value: 4.59 }
]

const gdpByCountry = [
  { year: 2015, germany: 3.36, france: 2.44, japan: 4.39 },
  { year: 2016, germany: 3.47, france: 2.47, japan: 4.93 },
  { year: 2017, germany: 3.69, france: 2.59, japan: 4.87 },
  { year: 2018, germany: 3.97, france: 2.78, japan: 4.95 },
  { year: 2019, germany: 3.89, france: 2.72, japan: 5.06 },
  { year: 2020, germany: 3.89, france: 2.63, japan: 5.04 },
  { year: 2021, germany: 4.28, france: 2.96, japan: 5.04 },
  { year: 2022, germany: 4.08, france: 2.79, japan: 4.26 },
  { year: 2023, germany: 4.46, france: 3.03, japan: 4.21 },
  { year: 2024, germany: 4.59, france: 3.18, japan: 4.07 }
]

const meta = {
  component: LineChart,
  args: {
    dataset: gdpHistory,
    xAxis: { dataKey: 'year' },
    series: [
      {
        dataKey: 'value',
        label: 'GDP',
        valueFormatter: (value: number) => `$${value.toFixed(2)}T`
      }
    ]
  }
} satisfies Meta<typeof LineChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MultiSeries: Story = {
  args: {
    dataset: gdpByCountry,
    series: [
      { dataKey: 'germany', label: 'Germany' },
      { dataKey: 'france', label: 'France' },
      { dataKey: 'japan', label: 'Japan' }
    ]
  }
}
