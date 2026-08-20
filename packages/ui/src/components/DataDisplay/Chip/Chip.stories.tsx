import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { expect, fn, userEvent } from 'storybook/test'

import Chip from '@/components/DataDisplay/Chip'
import Icon from '@/components/DataDisplay/Icon'

const meta = {
  component: Chip
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'GDP'
  }
}

export const WithIcon: Story = {
  args: {
    startIcon: <Icon name='inbox' />,
    label: 'Inbox'
  }
}

export const Deletable: Story = {
  args: {
    label: 'GDP',
    onDelete: fn()
  },
  play: async ({ args, canvas }) => {
    const chip = canvas.getByRole('button', { name: 'GDP' })
    const deleteControl = chip.querySelector('[aria-hidden="true"]') as HTMLElement

    await userEvent.click(deleteControl)
    await expect(args.onDelete).toHaveBeenCalledOnce()

    chip.focus()
    await userEvent.keyboard('{Backspace}')
    await expect(args.onDelete).toHaveBeenCalledTimes(2)
  }
}

export const Clickable: Story = {
  args: {
    label: 'GDP',
    onClick: fn()
  },
  play: async ({ args, canvas }) => {
    const chip = canvas.getByRole('button', { name: 'GDP' })
    await userEvent.click(chip)
    await expect(args.onClick).toHaveBeenCalledOnce()
  }
}

export const Disabled: Story = {
  args: {
    label: 'GDP',
    onDelete: fn(),
    disabled: true
  },
  play: async ({ args, canvas }) => {
    const chip = canvas.getByRole('button', { name: 'GDP' })
    await expect(chip).toBeDisabled()

    const deleteControl = chip.querySelector('[aria-hidden="true"]') as HTMLElement
    await userEvent.click(deleteControl, { pointerEventsCheck: 0 })
    await expect(args.onDelete).not.toHaveBeenCalled()
  }
}

export const FilterList: Story = {
  args: {
    label: ''
  },
  render: () => {
    const { t } = useTranslation()
    const [indicators, setIndicators] = useState(['GDP', 'GDP/cap', 'Inflation', 'Unemployment'])

    const handleDelete = (indicator: string) => {
      setIndicators((current) => current.filter((item) => item !== indicator))
    }

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {indicators.map((indicator) => (
          <Chip key={indicator} label={indicator} onDelete={() => handleDelete(indicator)} />
        ))}
        {indicators.length === 0 && t('chip.noIndicatorsSelected')}
      </div>
    )
  },
  play: async ({ canvas }) => {
    const gdpChip = canvas.getByRole('button', { name: 'GDP' })
    const deleteControl = gdpChip.querySelector('[aria-hidden="true"]') as HTMLElement
    await userEvent.click(deleteControl)
    await expect(canvas.queryByRole('button', { name: 'GDP' })).not.toBeInTheDocument()

    const inflationChip = canvas.getByRole('button', { name: 'Inflation' })
    inflationChip.focus()
    await userEvent.keyboard('{Delete}')
    await expect(canvas.queryByRole('button', { name: 'Inflation' })).not.toBeInTheDocument()
  }
}
