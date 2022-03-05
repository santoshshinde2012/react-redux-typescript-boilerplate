import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LandingDetails } from '../../pages/landing/types'
import httpclient from '../../utils/api'

interface LandingPageState {
  data ? : LandingDetails | null;
  loading: boolean;
  error ? : any;
}

const initialState: LandingPageState = {
  data: null,
  loading: false,
  error: null
}

export const getLandingPageDetails = createAsyncThunk('landing/gerDetails', async (dispatch, getState) => {
  try {
    const response = await httpclient().get('/global/mock-data/landing.json')
    return response.data
  } catch (err: any) {
    return err.message
  }
}
)

const slice = createSlice({
  name: 'landing',
  initialState,
  reducers: {},
  extraReducers (builder): void {
    builder.addCase(getLandingPageDetails.pending, (state) => {
      state.loading = true
    }
    )
    builder.addCase(getLandingPageDetails.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
    }
    )
    builder.addCase(getLandingPageDetails.rejected, (state, action) => {
      state.loading = false
      // action.payload contains error information
      state.error = action.payload
    }
    )
  }
})

export default slice.reducer
