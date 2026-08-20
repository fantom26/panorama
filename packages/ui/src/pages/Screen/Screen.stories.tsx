import type { Meta, StoryObj } from '@storybook/react-vite'
import { HttpResponse, http } from 'msw'
import { Provider } from 'react-redux'
import { waitFor } from 'storybook/test'

import Screen from '@/pages/Screen'
import store from '@/store'

const countries = [
  { cca2: 'UA', name: { common: 'Ukraine' }, region: 'Europe' },
  { cca2: 'FR', name: { common: 'France' }, region: 'Europe' },
  { cca2: 'JP', name: { common: 'Japan' }, region: 'Asia' }
]

const meta = {
  component: Screen,
  title: 'Screen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>]
} satisfies Meta<typeof Screen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  beforeEach({ msw }) {
    msw.use(
      http.get(import.meta.env.VITE_REST_COUNTRIES_API_URL, () => {
        return HttpResponse.json(countries)
      })
    )
  },

  play: async ({ canvas }) => {
    await waitFor(() => canvas.getByText('Ukraine'))
  }
}

export const Error: Story = {
  beforeEach({ msw }) {
    msw.use(
      http.get(import.meta.env.VITE_REST_COUNTRIES_API_URL, () => {
        return new HttpResponse(null, {
          status: 403
        })
      })
    )
  },

  play: async ({ canvas }) => {
    await waitFor(() => canvas.getByText('Something went wrong'))
  }
}
