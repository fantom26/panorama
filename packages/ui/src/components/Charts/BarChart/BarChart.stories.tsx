import type { Meta, StoryObj } from '@storybook/react-vite'

import BarChart from '@/components/Charts/BarChart'

const gdpByCountry = [
  { id: 'USA', label: 'United States', value: 30507217 },
  { id: 'CHN', label: 'China', value: 19231705 },
  { id: 'DEU', label: 'Germany', value: 4744804 },
  { id: 'JPN', label: 'Japan', value: 4186431 },
  { id: 'IND', label: 'India', value: 4187017 },
  { id: 'GBR', label: 'United Kingdom', value: 3839180 },
  { id: 'FRA', label: 'France', value: 3211292 },
  { id: 'ITA', label: 'Italy', value: 2422855 },
  { id: 'CAN', label: 'Canada', value: 2225341 },
  { id: 'BRA', label: 'Brazil', value: 2125958 }
]

const compactUsd = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

const meta = {
  component: BarChart,
  args: {
    data: gdpByCountry,
    formatValue: (value: number) => compactUsd.format(value * 1e6)
  }
} satisfies Meta<typeof BarChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Clickable: Story = {
  args: {
    onSelect: (id) => console.log(`selected ${id}`)
  }
}

export const Short: Story = {
  args: {
    data: gdpByCountry.slice(0, 4),
    height: 200
  }
}
