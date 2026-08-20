import { configureStore, createSlice } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Provider, useSelector } from 'react-redux'
import { expect } from 'storybook/test'

import DataTable from '@/components/DataDisplay/DataTable'
import type { RootState } from '@/store'
import type { CountryData } from '@/types/country.types'

function useColumns(): ColumnDef<CountryData>[] {
  const { t } = useTranslation()
  return [
    { accessorKey: 'id', header: t('common.tableColumns.code') },
    { accessorKey: 'name', header: t('common.tableColumns.name') },
    { accessorKey: 'region', header: t('common.tableColumns.region') }
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
        state={{ status: 'empty', message: t('stories.dataTable.noCountriesFound') }}
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
        state={{ status: 'error', error: new Error(t('stories.dataTable.failedToLoadCountries')) }}
        columns={useColumns()}
      />
    )
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Failed to load countries')
  }
}

type CountriesState = {
  countries: CountryData[]
  status: 'idle' | 'loading' | 'failed' | 'succeeded'
  error: string | null
}

function Mockstore({
  countriesState,
  children
}: {
  countriesState: CountriesState
  children: React.ReactNode
}) {
  return (
    <Provider
      store={configureStore({
        reducer: {
          countries: createSlice({
            name: 'countries',
            initialState: countriesState,
            reducers: {}
          }).reducer
        }
      })}
    >
      {children}
    </Provider>
  )
}

function ConnectedDataTable() {
  const { t } = useTranslation()
  const data = useSelector((state: RootState) => state.countries.countries)
  const { status, error } = useSelector((state: RootState) => state.countries)

  const tableState =
    status === 'loading'
      ? { status: 'loading' as const }
      : status === 'failed'
        ? { status: 'error' as const, error: error ?? t('stories.dataTable.unknownError') }
        : data.length === 0
          ? { status: 'empty' as const, message: t('stories.dataTable.noCountries') }
          : { status: 'ready' as const, data }

  return <DataTable state={tableState} columns={useColumns()} />
}

export const ConnectedToStore: Story = {
  render: () => (
    <Mockstore countriesState={{ countries, status: 'succeeded', error: null }}>
      <ConnectedDataTable />
    </Mockstore>
  )
}
