import { configureStore, createSlice } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ColumnDef } from '@tanstack/react-table'
import { Provider, useSelector } from 'react-redux'

import DataTable from '@/components/DataDisplay/DataTable'
import type { RootState } from '@/store'
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

const tasks: TaskData[] = [
  { id: '1', title: 'Buy groceries', state: 'TASK_INBOX' },
  { id: '2', title: 'Write quarterly report', state: 'TASK_PINNED' },
  { id: '3', title: 'Clean the house', state: 'TASK_ARCHIVED' }
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
  render: () => <DataTable state={{ status: 'ready', data: tasks }} columns={columns} />
}

export const Loading: Story = {
  render: () => <DataTable state={{ status: 'loading' }} columns={columns} />
}

export const Empty: Story = {
  render: () => (
    <DataTable state={{ status: 'empty', message: 'No tasks found' }} columns={columns} />
  )
}

export const ErrorState: Story = {
  render: () => (
    <DataTable
      state={{ status: 'error', error: new Error('Failed to load tasks') }}
      columns={columns}
    />
  )
}

type TaskBoxState = {
  tasks: TaskData[]
  status: 'idle' | 'loading' | 'failed' | 'succeeded'
  error: string | null
}

function Mockstore({
  taskboxState,
  children
}: {
  taskboxState: TaskBoxState
  children: React.ReactNode
}) {
  return (
    <Provider
      store={configureStore({
        reducer: {
          taskbox: createSlice({
            name: 'taskbox',
            initialState: taskboxState,
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
  const data = useSelector((state: RootState) => state.taskbox.tasks)
  const { status, error } = useSelector((state: RootState) => state.taskbox)

  const tableState =
    status === 'loading'
      ? { status: 'loading' as const }
      : status === 'failed'
        ? { status: 'error' as const, error: error ?? 'Unknown error' }
        : data.length === 0
          ? { status: 'empty' as const, message: 'No tasks' }
          : { status: 'ready' as const, data }

  return <DataTable state={tableState} columns={columns} />
}

export const ConnectedToStore: Story = {
  render: () => (
    <Mockstore taskboxState={{ tasks, status: 'succeeded', error: null }}>
      <ConnectedDataTable />
    </Mockstore>
  )
}
