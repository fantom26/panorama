import type { Meta, StoryObj } from '@storybook/react-vite'

import Typography from '@/components/DataDisplay/Typography'
import ExpandableSearch from '@/components/Forms/ExpandableSearch'

const meta = {
  component: ExpandableSearch,
  title: 'Forms/ExpandableSearch',
  args: {
    placeholder: 'Search countries'
  }
} satisfies Meta<typeof ExpandableSearch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithResults: Story = {
  render: (args) => (
    <ExpandableSearch {...args}>
      <Typography component='p' variant='body-sm' color='subtle'>
        Germany, France, Japan
      </Typography>
    </ExpandableSearch>
  )
}
