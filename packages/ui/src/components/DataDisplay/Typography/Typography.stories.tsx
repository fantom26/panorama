import { Fragment } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import Typography, { type TypographyVariant } from '@/components/DataDisplay/Typography'
import Divider from '@/components/Layout/Divider'

const variants: TypographyVariant[] = [
  'display-sm',
  'headline-default',
  'headline-sm',
  'title-lg',
  'title-default',
  'title-sm',
  'label-lg',
  'label-default',
  'label-sm',
  'body-lg',
  'body-default',
  'body-sm',
  'meta-default',
  'meta-sm'
]

const meta = {
  component: Typography,
  title: 'Data Display/Typography',
  args: {
    variant: 'body-default',
    color: 'default',
    children: 'Global GDP grew 3.2% in the fourth quarter'
  }
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {variants.map((variant, index) => (
        <Fragment key={variant}>
          {index > 0 && <Divider />}
          <Typography variant={variant}>
            {variant} — Global GDP grew 3.2% in the fourth quarter
          </Typography>
        </Fragment>
      ))}
    </div>
  )
}

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Typography variant='label-default' color='default'>
        content-default
      </Typography>
      <Divider />
      <Typography variant='label-default' color='subtle'>
        content-subtle
      </Typography>
      <Divider />
      <Typography variant='label-default' color='brand'>
        content-brand
      </Typography>
      <Divider />
      <Typography variant='label-default' color='disabled'>
        content-disabled
      </Typography>
      <Divider />
      <Typography variant='label-default' color='utility-error'>
        content-utility-error
      </Typography>
      <Divider />
      <Typography variant='label-default' color='utility-warning'>
        content-utility-warning
      </Typography>
      <Divider />
      <Typography variant='label-default' color='utility-success'>
        content-utility-success
      </Typography>
      <Divider />
      <Typography variant='label-default' color='utility-info'>
        content-utility-info
      </Typography>
    </div>
  )
}

export const ComponentOverride: Story = {
  args: {
    variant: 'title-sm',
    component: 'h2',
    children: 'Rendered as an h2 despite title-sm defaulting to h5'
  }
}
