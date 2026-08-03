
import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from '.';

const meta = {
  component: Button,
  title: 'Button', // how to group or categorize the component in the Storybook sidebar
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/, // additional information required by the story but should not be rendered in Storybook
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Submit'
  },
};