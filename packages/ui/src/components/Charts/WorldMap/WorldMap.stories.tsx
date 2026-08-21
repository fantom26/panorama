import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

import MapLegend from '@/components/Charts/MapLegend'
import WorldMap from '@/components/Charts/WorldMap'

const gdpByCountry = [
  { id: 'US', value: 27.4 },
  { id: 'CN', value: 17.8 },
  { id: 'DE', value: 4.5 },
  { id: 'JP', value: 4.2 },
  { id: 'IN', value: 3.7 },
  { id: 'GB', value: 3.3 },
  { id: 'FR', value: 3.0 },
  { id: 'BR', value: 2.1 },
  { id: 'CA', value: 2.1 },
  { id: 'AU', value: 1.7 }
]

const europe = [
  'DE',
  'FR',
  'GB',
  'IT',
  'ES',
  'PL',
  'NL',
  'BE',
  'SE',
  'AT',
  'IE',
  'PT',
  'GR',
  'FI',
  'DK'
]

const meta = {
  component: WorldMap,
  args: {
    height: 420
  }
} satisfies Meta<typeof WorldMap>

export default meta
type Story = StoryObj<typeof meta>

export const Heat: Story = {
  args: {
    data: gdpByCountry,
    format: (value: number) => `$${value.toFixed(1)}T`
  },
  render: (args) => (
    <div>
      <WorldMap {...args} />
      <div style={{ marginTop: 14 }}>
        <MapLegend range='$1.7T ── $27.4T' />
      </div>
    </div>
  )
}

export const Region: Story = {
  args: {
    mode: 'lit',
    highlight: europe
  }
}
