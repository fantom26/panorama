import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'

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
      <Typography
        component='a'
        href='/global'
        variant='body-sm'
        color='subtle'
        onClick={(event) => event.preventDefault()}
      >
        Global
      </Typography>
      <Typography
        component='a'
        href='/global/europe'
        variant='body-sm'
        color='subtle'
        onClick={(event) => event.preventDefault()}
      >
        Europe
      </Typography>
      <Typography
        component='a'
        href='/global/europe/western'
        variant='body-sm'
        color='subtle'
        onClick={(event) => event.preventDefault()}
      >
        Western Europe
      </Typography>
      <Typography variant='label-sm' color='brand' aria-current='page'>
        Germany
      </Typography>
    </Breadcrumbs>
  ),
  play: async ({ canvas }) => {
    const europeLink = canvas.getByRole('link', { name: 'Europe' })
    await expect(europeLink).toHaveAttribute('href', '/global/europe')
    await userEvent.click(europeLink)

    const currentPage = canvas.getByText('Germany')
    await expect(currentPage).toHaveAttribute('aria-current', 'page')
    await expect(canvas.queryByRole('link', { name: 'Germany' })).not.toBeInTheDocument()
  }
}
