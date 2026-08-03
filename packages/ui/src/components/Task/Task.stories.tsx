import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import Task from '.'

export const ActionsData = {
  onArchiveTask: fn(),
  onPinTask: fn()
}

const meta = {
  component: Task,
  title: 'Task', // how to group or categorize the component in the Storybook sidebar
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/, // additional information required by the story but should not be rendered in Storybook
  args: {
    ...ActionsData // define the action args that the component expects to mock out the custom events
  }
} satisfies Meta<typeof Task>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    task: {
      id: '1',
      title: 'Test Task',
      state: 'TASK_INBOX'
    }
  }
}

export const Pinned: Story = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_PINNED'
    }
  }
}

export const Archived: Story = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_ARCHIVED'
    }
  }
}
