import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

import Chip from '@/components/DataDisplay/Chip'
import Icon from '@/components/DataDisplay/Icon'

const meta = {
  component: Chip,
  title: 'Data Display/Chip'
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
    onDelete: () => {}
  }
}

export const Clickable: Story = {
  args: {
    label: 'GDP',
    onClick: () => {}
  }
}

export const Disabled: Story = {
  args: {
    label: 'GDP',
    onDelete: () => {},
    disabled: true
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
        {indicators.length === 0 && t('stories.chip.noIndicatorsSelected')}
      </div>
    )
  }
}
