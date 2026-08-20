import type { Meta, StoryObj } from '@storybook/react-vite'

import Typography from '@/components/DataDisplay/Typography'
import Breadcrumbs from '@/components/Disclosure/Breadcrumbs'

const meta = {
  component: Breadcrumbs
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <Typography component='a' href='#' variant='body-sm' color='subtle'>
        Global
      </Typography>
      <Typography component='a' href='#' variant='body-sm' color='subtle'>
        Europe
      </Typography>
      <Typography component='a' href='#' variant='body-sm' color='subtle'>
        Western Europe
      </Typography>
      <Typography variant='label-sm' color='brand'>
        Germany
      </Typography>
    </Breadcrumbs>
  )
}
