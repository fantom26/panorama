import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'

import Hint from '@/components/Forms/Hint'

const meta = {
  component: Hint,
  args: {
    text: ''
  },
  render: (args) => {
    const { t } = useTranslation()
    return <Hint {...args} text={t('stories.field.gdpFloorHint')} />
  }
} satisfies Meta<typeof Hint>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Error: Story = {
  args: {
    error: true
  },
  render: (args) => {
    const { t } = useTranslation()
    return <Hint {...args} text={t('stories.field.yearError')} />
  }
}
