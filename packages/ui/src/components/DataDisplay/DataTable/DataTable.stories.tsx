import { configureStore, createSlice } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef } from '@tanstack/react-table'
import { Provider, useSelector } from 'react-redux'

import DataTable from '@/components/DataDisplay/DataTable'
import type { RootState } from '@/store'
import type { CountryData } from '@/types/country.types'

const columns: ColumnDef<CountryData>[] = [
  { accessorKey: 'id', header: 'Code' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'region', header: 'Region' }
]

const countries: CountryData[] = [
  { id: 'UA', name: 'Ukraine', region: 'Europe' },
  { id: 'FR', name: 'France', region: 'Europe' },
  { id: 'JP', name: 'Japan', region: 'Asia' }
]

const meta = {
  component: DataTable,
  title: 'Data Display/DataTable',
  args: {
    state: { status: 'loading' },
    columns: []
  }
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <DataTable state={{ status: 'ready', data: countries }} columns={columns} />
}

export const Loading: Story = {
  render: () => <DataTable state={{ status: 'loading' }} columns={columns} />
}

export const Empty: Story = {
  render: () => (
    <DataTable state={{ status: 'empty', message: 'No countries found' }} columns={columns} />
  )
}

export const ErrorState: Story = {
  render: () => (
    <DataTable
      state={{ status: 'error', error: new Error('Failed to load countries') }}
      columns={columns}
    />
  )
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
  const data = useSelector((state: RootState) => state.countries.countries)
  const { status, error } = useSelector((state: RootState) => state.countries)

  const tableState =
    status === 'loading'
      ? { status: 'loading' as const }
      : status === 'failed'
        ? { status: 'error' as const, error: error ?? 'Unknown error' }
        : data.length === 0
          ? { status: 'empty' as const, message: 'No countries' }
          : { status: 'ready' as const, data }

  return <DataTable state={tableState} columns={columns} />
}

export const ConnectedToStore: Story = {
  render: () => (
    <Mockstore countriesState={{ countries, status: 'succeeded', error: null }}>
      <ConnectedDataTable />
    </Mockstore>
  )
}
