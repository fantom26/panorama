import type { Meta, StoryObj } from '@storybook/react-vite'
import { HttpResponse, http } from 'msw'
import { Provider } from 'react-redux'
import { waitFor } from 'storybook/test'

import InboxScreen from '@/pages/InboxScreen'
import store from '@/store'
import type { TaskData } from '@/types/task.types'

const tasks: TaskData[] = [
  { id: '1', title: 'Buy groceries', state: 'TASK_INBOX' },
  { id: '2', title: 'Write quarterly report', state: 'TASK_INBOX' },
  { id: '3', title: 'Clean the house', state: 'TASK_INBOX' }
]

const meta = {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>]
} satisfies Meta<typeof InboxScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return HttpResponse.json(tasks)
        })
      ]
    }
  },
  play: async ({ canvas }) => {
    await waitFor(() => canvas.getByText('Buy groceries'))
  }
}

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return new HttpResponse(null, {
            status: 403
          })
        })
      ]
    }
  },
  play: async ({ canvas }) => {
    await waitFor(() => canvas.getByText('Something went wrong'))
  }
}
