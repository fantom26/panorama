import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

import Typography from '@/components/DataDisplay/Typography'
import ExpandableSearch from '@/components/Forms/ExpandableSearch'

const meta = {
  component: ExpandableSearch,
  title: 'Forms/ExpandableSearch',
  render: (args) => {
    const { t } = useTranslation()
    return <ExpandableSearch {...args} placeholder={t('stories.expandableSearch.placeholder')} />
  }
} satisfies Meta<typeof ExpandableSearch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithResults: Story = {
  render: (args) => {
    const { t } = useTranslation()
    return (
      <ExpandableSearch {...args} placeholder={t('stories.expandableSearch.placeholder')}>
        <Typography component='p' variant='body-sm' color='subtle'>
          Germany, France, Japan
        </Typography>
      </ExpandableSearch>
    )
  }
}
