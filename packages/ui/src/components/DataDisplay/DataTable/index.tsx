import { useState } from 'react'

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import Button from '../../Buttons/Button'
import Skeleton from '../../Feedback/Skeleton'
import TextField from '../../Forms/TextField'
import Icon from '../Icon'
import Typography from '../Typography'
import styles from './index.module.css'

export type { ColumnDef } from '@tanstack/react-table'

// Fallback when pagination is off (and thus there is no page size to mirror).
const DEFAULT_LOADING_ROW_COUNT = 8

export type TableStateLoading = { status: 'loading' }
export type TableStateError = { status: 'error'; error: unknown; message?: string }
export type TableStateEmpty = { status: 'empty'; message?: string }
export type TableStateReady<TData> = { status: 'ready'; data: TData[] }

export type TableState<TData> =
  TableStateLoading | TableStateError | TableStateEmpty | TableStateReady<TData>

export type DataTableProps<TData> = {
  state: TableState<TData>
  columns: ColumnDef<TData>[]
  className?: string
  enableColumnFilters?: boolean
  enablePagination?: boolean
  pageSize?: number
}

export default function DataTable<TData>({
  state,
  columns,
  className,
  enableColumnFilters = false,
  enablePagination = false,
  pageSize = 10
}: DataTableProps<TData>) {
  const { t } = useTranslation()
  const data = state.status === 'ready' ? state.data : []
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableColumnFilters ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    initialState: { pagination: { pageSize } }
  })
  const columnCount = table.getAllLeafColumns().length
  const isEmpty = state.status === 'empty' || (state.status === 'ready' && data.length === 0)

  // Reserve a page's worth of rows so the loading -> loaded (and filtered) swap
  // doesn't shift the page. Skeleton rows mirror the same count.
  const reservedRows = enablePagination ? pageSize : DEFAULT_LOADING_ROW_COUNT

  let body: React.ReactNode

  if (state.status === 'loading') {
    body = Array.from({ length: reservedRows }).map((_, rowIndex) => (
      <tr key={rowIndex} className={styles.row}>
        {Array.from({ length: columnCount }).map((_, cellIndex) => (
          <td key={cellIndex} className={styles.cell}>
            <Skeleton />
          </td>
        ))}
      </tr>
    ))
  } else if (state.status === 'error') {
    body = (
      <tr className={styles.row}>
        <td className={styles.stateCell} colSpan={columnCount} role='alert'>
          <div className={styles.state}>
            <Icon name='circle-alert' size={20} className={styles.errorIcon} />
            <span>
              {state.message ??
                (typeof state.error === 'string'
                  ? state.error
                  : state.error instanceof Error
                    ? state.error.message
                    : t('dataTable.error'))}
            </span>
          </div>
        </td>
      </tr>
    )
  } else if (isEmpty) {
    body = (
      <tr className={styles.row}>
        <td className={styles.stateCell} colSpan={columnCount}>
          <div className={styles.state}>
            <Icon name='inbox' size={20} className={styles.emptyIcon} />
            <span>
              {state.status === 'empty'
                ? (state.message ?? t('dataTable.noData'))
                : t('dataTable.noData')}
            </span>
          </div>
        </td>
      </tr>
    )
  } else {
    body = table.getRowModel().rows.map((row) => (
      <tr key={row.id} className={styles.row}>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} className={styles.cell}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))
  }

  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount()

  return (
    <div
      className={clsx(styles.root, className)}
      style={{ '--dt-reserved-rows': reservedRows } as React.CSSProperties}
      aria-busy={state.status === 'loading' || undefined}
    >
      <table className={styles.table}>
        <thead className={styles.head}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={styles.row}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={styles.headerCell}>
                  {header.isPlaceholder ? null : (
                    <Typography variant='label-sm' color='subtle' component='span'>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Typography>
                  )}
                </th>
              ))}
            </tr>
          ))}
          {enableColumnFilters && (
            <tr className={styles.row}>
              {table.getAllLeafColumns().map((column) => (
                <th key={column.id} className={styles.headerCell}>
                  {column.getCanFilter() && (
                    <TextField
                      aria-label={t('dataTable.filterColumnAriaLabel', {
                        column: String(column.columnDef.header)
                      })}
                      placeholder={t('dataTable.filterPlaceholder')}
                      value={(column.getFilterValue() as string) ?? ''}
                      onChange={(event) => column.setFilterValue(event.target.value)}
                    />
                  )}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>{body}</tbody>
      </table>
      {enablePagination && pageCount > 0 && (
        <div className={styles.pagination}>
          <Typography variant='meta-sm' color='muted' component='span'>
            {t('dataTable.pageOf', { page: pageIndex + 1, count: pageCount })}
          </Typography>
          <div className={styles.paginationControls}>
            <Button
              variant='outlined'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {t('dataTable.prev')}
            </Button>
            <Button
              variant='outlined'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t('dataTable.next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
