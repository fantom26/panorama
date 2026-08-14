import { useEffect } from 'react'

import type { ColumnDef } from '@tanstack/react-table'
import { useDispatch, useSelector } from 'react-redux'

import DataTable, { type TableState } from '@/components/DataDisplay/DataTable'
import type { AppDispatch, RootState } from '@/store'
import { fetchCountries } from '@/store'
import type { CountryData } from '@/types/country.types'

const columns: ColumnDef<CountryData>[] = [
  { accessorKey: 'id', header: 'Code' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'region', header: 'Region' }
]

export default function Screen() {
  const dispatch = useDispatch<AppDispatch>()
  const { countries, status, error } = useSelector((state: RootState) => state.countries)

  useEffect(() => {
    dispatch(fetchCountries())
  }, [dispatch])

  const state: TableState<CountryData> =
    status === 'loading'
      ? { status: 'loading' }
      : status === 'failed'
        ? { status: 'error', error }
        : countries.length === 0
          ? { status: 'empty' }
          : { status: 'ready', data: countries }

  return (
    <div className='page lists-show'>
      <nav>
        <h1 className='title-page'>Countries</h1>
      </nav>
      <DataTable state={state} columns={columns} />
    </div>
  )
}
