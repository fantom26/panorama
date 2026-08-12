import { useEffect } from 'react'

import type { ColumnDef } from '@tanstack/react-table'
import { useDispatch, useSelector } from 'react-redux'

import DataTable, { type TableState } from '@/components/DataTable'
import type { AppDispatch, RootState } from '@/store'
import { fetchTasks } from '@/store'
import type { TaskData } from '@/types/task.types'

const columns: ColumnDef<TaskData>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'title', header: 'Title' },
  {
    accessorKey: 'state',
    header: 'State',
    cell: (info) => info.getValue<TaskData['state']>().replace('TASK_', '')
  }
]

export default function InboxScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const { tasks, status, error } = useSelector((state: RootState) => state.taskbox)

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  const state: TableState<TaskData> =
    status === 'loading'
      ? { status: 'loading' }
      : status === 'failed'
        ? { status: 'error', error }
        : tasks.length === 0
          ? { status: 'empty' }
          : { status: 'ready', data: tasks }

  return (
    <div className='page lists-show'>
      <nav>
        <h1 className='title-page'>Taskbox</h1>
      </nav>
      <DataTable state={state} columns={columns} />
    </div>
  )
}
