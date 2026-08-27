import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import LanguageSwitcher from '@/components/Forms/LanguageSwitcher'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' }
]

const meta = {
  component: LanguageSwitcher,
  args: {
    languages,
    value: 'en',
    onChange: () => {}
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)
    return <LanguageSwitcher {...args} value={value} onChange={setValue} />
  }
} satisfies Meta<typeof LanguageSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ControlledValue: Story = {
  args: {
    value: 'ar'
  }
}
