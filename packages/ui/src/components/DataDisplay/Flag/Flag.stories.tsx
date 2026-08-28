import type { Meta, StoryObj } from '@storybook/react-vite'

import Flag from '@/components/DataDisplay/Flag'
import type { Alpha2Code } from '@/types/country.types'

const meta = {
  component: Flag,
  args: {
    code: 'de'
  }
} satisfies Meta<typeof Flag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Row: Story = {
  render: () => {
    const codes: Alpha2Code[] = ['de', 'fr', 'jp', 'br', 'us', 'za']

    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {codes.map((code) => (
          <Flag key={code} code={code} />
        ))}
      </div>
    )
  }
}

export const MissingFlag: Story = {
  args: {
    code: 'zz'
  }
}
