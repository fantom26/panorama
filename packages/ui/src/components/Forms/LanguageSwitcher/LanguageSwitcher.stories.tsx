import type { Meta, StoryObj } from '@storybook/react-vite'

import LanguageSwitcher from '@/components/Forms/LanguageSwitcher'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'uk', label: 'УК' },
  { code: 'ar', label: 'ع' }
]

const meta = {
  component: LanguageSwitcher,
  args: {
    languages
  }
} satisfies Meta<typeof LanguageSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ControlledValue: Story = {
  args: {
    value: 'uk'
  }
}
