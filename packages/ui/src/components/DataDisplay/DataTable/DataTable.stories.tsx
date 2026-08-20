import { configureStore, createSlice } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Provider, useSelector } from 'react-redux'

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
  render: () => <DataTable state={{ status: 'ready', data: countries }} columns={useColumns()} />
}

export const Loading: Story = {
  render: () => <DataTable state={{ status: 'loading' }} columns={useColumns()} />
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
