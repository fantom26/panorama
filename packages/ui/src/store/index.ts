import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { TaskData } from '@/types/task.types'

interface TaskBoxState {
  tasks: TaskData[]
  status: 'idle' | 'loading' | 'failed' | 'succeeded'
  error: string | null
}

const TaskBoxData: TaskBoxState = {
  tasks: [],
  status: 'idle',
  error: null
}
/*
 * Creates an asyncThunk to fetch tasks from a remote endpoint.
 * You can read more about Redux Toolkit's thunks in the docs:
 * https://redux-toolkit.js.org/api/createAsyncThunk
 */
export const fetchTasks = createAsyncThunk('taskbox/fetchTasks', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?userId=1')
  const data = await response.json()
  const result = data.map((task: { id: number; title: string; completed: boolean }) => ({
    id: `${task.id}`,
    title: task.title,
    state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX'
  }))
  return result
})

/*
 * The store is created here.
 * You can read more about Redux Toolkit's slices in the docs:
 * https://redux-toolkit.js.org/api/createSlice
 */
const TasksSlice = createSlice({
  name: 'taskbox',
  initialState: TaskBoxData,
  reducers: {},
  /*
   * Extends the reducer for the async actions
   * You can read more about it at https://redux-toolkit.js.org/api/createAsyncThunk
   */
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.tasks = []
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.status = 'failed'
        state.error = 'Something went wrong'
        state.tasks = []
      })
  }
})

const store = configureStore({
  reducer: {
    taskbox: TasksSlice.reducer
  }
})

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
