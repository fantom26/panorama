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

const meta = {
  component: LineChart,
  title: 'Charts/LineChart',
  args: {
    dataset: gdpHistory,
    xAxis: { dataKey: 'year' },
    series: {
      dataKey: 'value',
      label: 'GDP',
      valueFormatter: (value: number) => `$${value.toFixed(2)}T`
    }
  }
} satisfies Meta<typeof LineChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
