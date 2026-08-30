import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent } from 'storybook/test'

import RankingList from '@/components/Charts/RankingList'

const gdpByRegion = [
  { label: 'Asia', value: 38400 },
  { label: 'Americas', value: 31200 },
  { label: 'Europe', value: 24100 },
  { label: 'Africa', value: 3100 },
  { label: 'Oceania', value: 1800 }
]

const meta = {
  component: RankingList,
  args: {
    data: gdpByRegion,
    formatValue: (value: number) => `$${(value / 1000).toFixed(1)}T`
  }
} satisfies Meta<typeof RankingList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const progressbars = canvas.getAllByRole('progressbar')
    await expect(progressbars).toHaveLength(gdpByRegion.length)

    await expect(canvas.getByText('Asia')).toBeInTheDocument()
    await expect(progressbars[0]).toHaveAttribute('aria-valuenow', '100')

    await expect(canvas.getByText('$38.4T')).toBeInTheDocument()
    await expect(canvas.getByText('$1.8T')).toBeInTheDocument()
  }
}

export const SingleItem: Story = {
  args: {
    data: [{ label: 'Asia', value: 38400 }]
  },
  play: async ({ canvas }) => {
    const progressbars = canvas.getAllByRole('progressbar')
    await expect(progressbars).toHaveLength(1)
    await expect(progressbars[0]).toHaveAttribute('aria-valuenow', '100')

    await expect(canvas.getByText('Asia')).toBeInTheDocument()
    await expect(canvas.getByText('$38.4T')).toBeInTheDocument()
  }
}

export const Interactive: Story = {
  args: {
    data: gdpByRegion.map((datum) => ({ ...datum, id: datum.label.toLowerCase() })),
    onSelect: fn()
  },
  play: async ({ args, canvas }) => {
    const rows = canvas.getAllByRole('button')
    await expect(rows).toHaveLength(gdpByRegion.length)

    await userEvent.click(rows[0])
    await expect(args.onSelect).toHaveBeenCalledWith('asia')
  }
}
