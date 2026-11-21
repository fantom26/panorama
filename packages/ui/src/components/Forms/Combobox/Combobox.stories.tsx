import type { Meta, StoryObj } from '@storybook/react-vite'
import { useTranslation } from 'react-i18next'
import { expect, screen, userEvent, waitFor } from 'storybook/test'

import Combobox from '@/components/Forms/Combobox'

type Country = { value: string; label: string }

const countries: Country[] = [
  { value: 'bra', label: 'Brazil' },
  { value: 'deu', label: 'Germany' },
  { value: 'gha', label: 'Ghana' },
  { value: 'jpn', label: 'Japan' },
  { value: 'usa', label: 'United States' }
]

const meta = {
  component: Combobox.Root,
  render: () => {
    const { t } = useTranslation()

    return (
      <Combobox.Root items={countries}>
        <Combobox.Input placeholder={t('combobox.placeholder')} aria-label={t('combobox.label')} />
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.Empty>{t('combobox.empty')}</Combobox.Empty>
              <Combobox.List>
                {(country: Country) => (
                  <Combobox.Item key={country.value} value={country}>
                    {country.label}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    )
  }
} satisfies Meta<typeof Combobox.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)

    const option = await screen.findByRole('option', { name: 'Germany' })
    await userEvent.click(option)

    await expect(input).toHaveValue('Germany')
    await waitFor(() => expect(screen.queryByRole('option')).not.toBeInTheDocument())
  }
}

export const Filtering: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.type(input, 'gha')

    await waitFor(() => {
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(1)
      expect(options[0]).toHaveTextContent('Ghana')
    })
  }
}

export const NoMatches: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.type(input, 'zzz')

    await expect(await screen.findByText('No countries match')).toBeInTheDocument()
  }
}
