import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import ThemeToggle, { type ThemePreference } from '@/components/Buttons/ThemeToggle'

const meta = {
  component: ThemeToggle,
  args: { value: 'light', onChange: () => {} },
  render: function Render(args) {
    const [value, setValue] = useState<ThemePreference>(args.value)
    return <ThemeToggle {...args} value={value} onChange={setValue} />
  }
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Light: Story = { args: { value: 'light' } }
export const Dark: Story = { args: { value: 'dark' } }
