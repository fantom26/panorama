import type { Meta, StoryObj } from '@storybook/react-vite'

import Icon from '@/components/DataDisplay/Icon'
import { icons } from '@/components/DataDisplay/Icon/icons'

const meta = {
  component: Icon,
  title: 'Data Display/Icon',
  args: {
    name: 'plus'
  },
  argTypes: {
    name: {
      control: { type: 'select' },
      options: Object.keys(icons)
    }
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
