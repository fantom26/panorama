import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { expect } from 'storybook/test'

import DataTable from '@/components/DataDisplay/DataTable'
import type { CountryData } from '@/types/country.types'

function useColumns(): ColumnDef<CountryData>[] {
  const { t } = useTranslation()
  return [
    { accessorKey: 'id', header: t('tableColumns.code') },
    { accessorKey: 'name', header: t('tableColumns.name') },
    { accessorKey: 'region', header: t('tableColumns.region') }
  ]
}

const countries: CountryData[] = [
  { id: 'UA', name: 'Ukraine', region: 'Europe' },
  { id: 'FR', name: 'France', region: 'Europe' },
  { id: 'JP', name: 'Japan', region: 'Asia' }
]

const meta = {
  component: DataTable,
  args: {
    state: { status: 'loading' },
    columns: []
  }
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <DataTable state={{ status: 'ready', data: countries }} columns={useColumns()} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('columnheader', { name: 'Code' })).toBeVisible()
    await expect(canvas.getByRole('columnheader', { name: 'Name' })).toBeVisible()
    await expect(canvas.getByRole('columnheader', { name: 'Region' })).toBeVisible()

    await expect(canvas.getByRole('cell', { name: 'Ukraine' })).toBeVisible()
    await expect(canvas.getByRole('cell', { name: 'France' })).toBeVisible()
    await expect(canvas.getByRole('cell', { name: 'Japan' })).toBeVisible()
  }
}

export const Loading: Story = {
  render: () => <DataTable state={{ status: 'loading' }} columns={useColumns()} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('table').parentElement).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getAllByRole('row')).toHaveLength(6)
  }
}

export const Empty: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <DataTable
        state={{ status: 'empty', message: t('dataTable.noCountriesFound') }}
        columns={useColumns()}
      />
    )
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No countries found')).toBeVisible()
  }
}

export const ErrorState: Story = {
  render: () => {
    const { t } = useTranslation()
    return (
      <DataTable
        state={{ status: 'error', error: new Error(t('dataTable.failedToLoadCountries')) }}
        columns={useColumns()}
      />
    )
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Failed to load countries')
  }
}
