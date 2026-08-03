import type { Meta, StoryObj } from '@storybook/react-vite'
import { HttpResponse, http } from 'msw'
import { Provider } from 'react-redux'
import { waitFor, waitForElementToBeRemoved } from 'storybook/test'

import { MockedState } from '@/components/TaskList/TaskList.stories'
import store from '@/store'

import InboxScreen from '.'

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
          return HttpResponse.json(MockedState.tasks)
        })
      ]
    }
  },
  play: async ({ canvas, userEvent }) => {
    // Waits for the component to transition from the loading state
    await waitForElementToBeRemoved(await canvas.findByTestId('loading'))
    // Waits for the component to be updated based on the store
    await waitFor(async () => {
      await userEvent.click(canvas.getByLabelText('pinTask-1'))
      await userEvent.click(canvas.getByLabelText('pinTask-3'))
    })
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
  }
}
