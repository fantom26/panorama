import { Fragment } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

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
    color: 'brand'
  },
  render: (args) => {
    const { t } = useTranslation()
    return <Typography {...args}>{t('stories.typography.sample')}</Typography>
  }
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AllVariants: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {variants.map((variant, index) => (
          <Fragment key={variant}>
            {index > 0 && <Divider />}
            <Typography variant={variant}>
              {variant} — {t('stories.typography.sample')}
            </Typography>
          </Fragment>
        ))}
      </div>
    )
  }
}

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Typography variant='label-default' color='brand'>
        content-brand
      </Typography>
      <Divider />
      <Typography variant='label-default' color='subtle'>
        content-subtle
      </Typography>
      <Divider />
      <Typography variant='label-default' color='knockout'>
        content-knockout
      </Typography>
      <Divider />
      <Typography variant='label-default' color='utility-error'>
        content-utility-error
      </Typography>
      <Divider />
      <Typography variant='label-default' color='utility-success'>
        content-utility-success
      </Typography>
    </div>
  )
}

export const ComponentOverride: Story = {
  args: {
    variant: 'title-sm',
    component: 'h2'
  },
  render: (args) => {
    const { t } = useTranslation()
    return <Typography {...args}>{t('stories.typography.componentOverride')}</Typography>
  }
}
