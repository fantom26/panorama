import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { expect, screen, userEvent, waitFor } from 'storybook/test'

import Typography from '@/components/DataDisplay/Typography'
import ExpandableSearch from '@/components/Forms/ExpandableSearch'

const meta = {
  component: ExpandableSearch,
  render: (args) => {
    const { t } = useTranslation()
    return <ExpandableSearch {...args} placeholder={t('stories.expandableSearch.placeholder')} />
  }
} satisfies Meta<typeof ExpandableSearch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button')
    await userEvent.click(trigger)

    const input = await screen.findByRole('textbox')
    await expect(input).toHaveFocus()

    await userEvent.type(input, 'Germany')
    await expect(input).toHaveValue('Germany')
  }
}

export const WithResults: Story = {
  render: (args) => {
    const { t } = useTranslation()
    return (
      <ExpandableSearch {...args} placeholder={t('stories.expandableSearch.placeholder')}>
        <Typography component='p' variant='body-sm' color='subtle'>
          Germany, France, Japan
        </Typography>
      </ExpandableSearch>
    )
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button')
    await userEvent.click(trigger)

    const input = await screen.findByRole('textbox')
    await userEvent.type(input, 'Germany')

    await waitFor(() => expect(screen.getByText('Germany, France, Japan')).toBeVisible())
  }
}
