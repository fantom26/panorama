import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import clsx from 'clsx'

import Icon from '@/components/Icon'
import styles from '@/components/DataTable/index.module.css'

const LOADING_ROW_COUNT = 5

export type TableStateLoading = { status: 'loading' }
export type TableStateError = { status: 'error'; error: unknown; message?: string }
export type TableStateEmpty = { status: 'empty'; message?: string }
export type TableStateReady<TData> = { status: 'ready'; data: TData[] }

export type TableState<TData> = TableStateLoading | TableStateError | TableStateEmpty | TableStateReady<TData>

export type DataTableProps<TData> = {
  state: TableState<TData>
  columns: ColumnDef<TData>[]
  className?: string
}

export default function DataTable<TData>({ state, columns, className }: DataTableProps<TData>) {
  const data = state.status === 'ready' ? state.data : []
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })
  const columnCount = table.getAllLeafColumns().length
  const isEmpty = state.status === 'empty' || (state.status === 'ready' && data.length === 0)

  let body: React.ReactNode

  if (state.status === 'loading') {
    body = Array.from({ length: LOADING_ROW_COUNT }).map((_, rowIndex) => (
      <tr key={rowIndex} className={styles.Row}>
        {Array.from({ length: columnCount }).map((_, cellIndex) => (
          <td key={cellIndex} className={styles.Cell}>
            <span className={styles.Skeleton} />
          </td>
        ))}
      </tr>
    ))
  } else if (state.status === 'error') {
    body = (
      <tr className={styles.Row}>
        <td className={styles.StateCell} colSpan={columnCount} role='alert'>
          <div className={styles.State}>
            <Icon name='circle-alert' size={20} className={styles.errorIcon} />
            <span>{state.message ?? (typeof state.error === 'string' ? state.error : state.error instanceof Error ? state.error.message : 'Something went wrong')}</span>
          </div>
        </td>
      </tr>
    )
  } else if (isEmpty) {
    body = (
      <tr className={styles.Row}>
        <td className={styles.StateCell} colSpan={columnCount}>
          <div className={styles.State}>
            <Icon name='inbox' size={20} className={styles.emptyIcon} />
            <span>{state.status === 'empty' ? state.message ?? 'No data' : 'No data'}</span>
          </div>
        </td>
      </tr>
    )
  } else {
    body = table.getRowModel().rows.map((row) => (
      <tr key={row.id} className={styles.Row}>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} className={styles.Cell}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))
  }

  return (
    <div className={clsx(styles.Root, className)} aria-busy={state.status === 'loading' || undefined}>
      <table className={styles.Table}>
        <thead className={styles.Head}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={styles.Row}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={styles.HeaderCell}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  )
}
