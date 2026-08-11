import type { Meta, StoryObj } from '@storybook/react-vite'

import Icon from '@/components/Icon'
import { icons, type IconName } from '@/components/Icon/icons'

const meta = {
  component: Icon,
  title: 'Icon',
  args: {
    name: 'plus'
  },
  parameters: {
    docs: {
      description: {
        component: `
The shared \`Icon\` component uses an internal icon registry instead of exposing \`lucide-react\` directly.

- Consumers only import \`Icon\` from \`@repo/ui\`
- They pass \`name\` prop like \`search\`
- The list of available icons lives in \`packages/ui/src/components/Icon/icons.ts\`
- The shared package owns the icon API and can switch providers later without breaking consumers
`
      }
    }
  }
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AvaliableIcons: Story = {
  tags: ['!dev'],
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {(Object.keys(icons) as IconName[]).map((name) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Icon name={name} size={24} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  )
}

export const CustomSize: Story = {
  args: {
    size: 32
  }
}

export const CustomColor: Story = {
  args: {
    color: 'var(--ds-theme-color-content-utility-error)'
  }
}

export const CustomStrokeWidth: Story = {
  args: {
    strokeWidth: 1
  }
}
