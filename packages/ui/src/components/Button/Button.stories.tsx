
import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from '.';

const meta = {
  component: Button,
  title: 'Button',
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Submit'
  },
};