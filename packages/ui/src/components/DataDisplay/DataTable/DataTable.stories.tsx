import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { expect, userEvent, waitFor } from 'storybook/test'

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

const manyCountries: CountryData[] = [
  { id: 'UA', name: 'Ukraine', region: 'Europe' },
  { id: 'FR', name: 'France', region: 'Europe' },
  { id: 'JP', name: 'Japan', region: 'Asia' },
  { id: 'DE', name: 'Germany', region: 'Europe' },
  { id: 'BR', name: 'Brazil', region: 'Americas' },
  { id: 'IN', name: 'India', region: 'Asia' },
  { id: 'ZA', name: 'South Africa', region: 'Africa' },
  { id: 'CA', name: 'Canada', region: 'Americas' },
  { id: 'AU', name: 'Australia', region: 'Oceania' },
  { id: 'EG', name: 'Egypt', region: 'Africa' },
  { id: 'MX', name: 'Mexico', region: 'Americas' },
  { id: 'CN', name: 'China', region: 'Asia' }
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
    // 1 header + DEFAULT_LOADING_ROW_COUNT (8) skeleton rows.
    await expect(canvas.getAllByRole('row')).toHaveLength(9)
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

export const Paginated: Story = {
  render: () => (
    <DataTable
      state={{ status: 'ready', data: manyCountries }}
      columns={useColumns()}
      enablePagination
      pageSize={5}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('row')).toHaveLength(6) // header + 5 data rows
    await expect(canvas.getByText('Page 1 of 3')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Prev' })).toBeDisabled()

    await userEvent.click(canvas.getByRole('button', { name: 'Next' }))
    await waitFor(() => expect(canvas.getByText('Page 2 of 3')).toBeVisible())
    await expect(canvas.getByRole('button', { name: 'Prev' })).toBeEnabled()
  }
}

export const Filterable: Story = {
  render: () => (
    <DataTable
      state={{ status: 'ready', data: manyCountries }}
      columns={useColumns()}
      enableColumnFilters
    />
  ),
  play: async ({ canvas }) => {
    const nameFilter = canvas.getByRole('textbox', { name: 'Filter Name' })
    await userEvent.type(nameFilter, 'an')

    await waitFor(() => {
      expect(canvas.getByRole('cell', { name: 'Germany' })).toBeVisible()
      expect(canvas.getByRole('cell', { name: 'France' })).toBeVisible()
      expect(canvas.queryByRole('cell', { name: 'Ukraine' })).not.toBeInTheDocument()
    })
  }
}

export const PaginatedAndFilterable: Story = {
  render: () => (
    <DataTable
      state={{ status: 'ready', data: manyCountries }}
      columns={useColumns()}
      enablePagination
      enableColumnFilters
      pageSize={5}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Filter Name' })).toBeVisible()
    await expect(canvas.getByText(/Page 1 of/)).toBeVisible()
  }
}
