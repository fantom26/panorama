import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { expect } from 'storybook/test'

import Progress from '@/components/Feedback/Progress'

const meta = {
  component: Progress.Root
} satisfies Meta<typeof Progress.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 40
  },
  render: (args) => {
    const { t } = useTranslation()
    return (
      <Progress.Root {...args} aria-label={t('stories.progress.ariaLabel')}>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
    )
  },
  play: async ({ canvas }) => {
    const progressbar = canvas.getByRole('progressbar')
    await expect(progressbar).toHaveAttribute('aria-valuenow', '40')
    await expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    await expect(progressbar).toHaveAttribute('aria-valuemax', '100')
  }
}

export const Complete: Story = {
  args: {
    value: 100
  },
  render: Default.render,
  play: async ({ canvas }) => {
    const progressbar = canvas.getByRole('progressbar')
    await expect(progressbar).toHaveAttribute('aria-valuenow', '100')
    await expect(progressbar).toHaveAttribute('data-complete', '')
  }
}

export const Indeterminate: Story = {
  args: {
    value: null
  },
  render: Default.render,
  play: async ({ canvas }) => {
    const progressbar = canvas.getByRole('progressbar')
    await expect(progressbar).not.toHaveAttribute('aria-valuenow')
    await expect(progressbar).toHaveAttribute('data-indeterminate', '')
  }
}

export const WithLabelAndValue: Story = {
  args: {
    value: 80
  },
  render: (args) => (
    <Progress.Root {...args}>
      <Progress.Label>Asia</Progress.Label>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
      <Progress.Value>{() => '$38.4T'}</Progress.Value>
    </Progress.Root>
  )
}
