import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import error from "../../utils/error";
import LandingServices, { ILandingInfo } from "../../services/landing";

interface LandingPageState {
  data?: ILandingInfo;
  loading: boolean;
  error?: string;
}

const initialState: LandingPageState = {
  data: undefined,
  loading: false,
  error: undefined,
};

export const getLandingPageDetails = createAsyncThunk(
  "landing/gerDetails",
  async () => {
    try {
      return LandingServices.getLandingPageInfo();
    } catch (error_) {
      return error_;
    }
  },
);

const slice = createSlice({
  name: "landing",
  initialState,
  reducers: {},
  extraReducers(builder): void {
    builder.addCase(getLandingPageDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLandingPageDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getLandingPageDetails.rejected, (state, action) => {
      state.loading = false;
      // action.payload contains error information
      state.error = error(action.payload);
    });
  },
});

export default slice.reducer;
