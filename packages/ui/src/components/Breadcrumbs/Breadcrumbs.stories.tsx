import type { Meta, StoryObj } from '@storybook/react-vite'

import Breadcrumbs from '@/components/Breadcrumbs'
import Typography from '@/components/Typography'

const meta = {
  component: Breadcrumbs,
  title: 'Disclosure/Breadcrumbs'
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
      <Typography variant='label-sm' color='default'>
        Germany
      </Typography>
    </Breadcrumbs>
  )
}
