import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { CountryData } from '@/types/country.types'

interface CountriesState {
  countries: CountryData[]
  status: 'idle' | 'loading' | 'failed' | 'succeeded'
  error: string | null
}

const initialState: CountriesState = {
  countries: [],
  status: 'idle',
  error: null
}
/*
 * Creates an asyncThunk to fetch countries from the REST Countries API.
 * You can read more about Redux Toolkit's thunks in the docs:
 * https://redux-toolkit.js.org/api/createAsyncThunk
 */
export const fetchCountries = createAsyncThunk('countries/fetchCountries', async () => {
  const response = await fetch(import.meta.env.VITE_REST_COUNTRIES_API_URL, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_REST_COUNTRIES_API_AUTH_TOKEN}`
    }
  })
  const data = await response.json()
  const result = data.map(
    (country: { cca2: string; name: { common: string }; region: string }) => ({
      id: country.cca2,
      name: country.name.common,
      region: country.region
    })
  )
  return result
})

/*
 * The store is created here.
 * You can read more about Redux Toolkit's slices in the docs:
 * https://redux-toolkit.js.org/api/createSlice
 */
const CountriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  /*
   * Extends the reducer for the async actions
   * You can read more about it at https://redux-toolkit.js.org/api/createAsyncThunk
   */
  extraReducers(builder) {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.countries = []
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.countries = action.payload
      })
      .addCase(fetchCountries.rejected, (state) => {
        state.status = 'failed'
        state.error = 'Something went wrong'
        state.countries = []
      })
  }
})

const store = configureStore({
  reducer: {
    countries: CountriesSlice.reducer
  }
})

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
