import { useEffect, useMemo } from 'react'

import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import DataTable, { type TableState } from '@/components/DataDisplay/DataTable'
import type { AppDispatch, RootState } from '@/store'
import { fetchCountries } from '@/store'
import type { CountryData } from '@/types/country.types'

export default function Screen() {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { countries, status, error } = useSelector((state: RootState) => state.countries)

  const columns: ColumnDef<CountryData>[] = useMemo(
    () => [
      { accessorKey: 'id', header: t('tableColumns.code') },
      { accessorKey: 'name', header: t('tableColumns.name') },
      { accessorKey: 'region', header: t('tableColumns.region') }
    ],
    [t]
  )

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
        <h1 className='title-page'>{t('screen.title')}</h1>
      </nav>
      <DataTable state={state} columns={columns} />
    </div>
  )
}
