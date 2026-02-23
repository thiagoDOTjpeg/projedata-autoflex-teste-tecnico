import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { systemService } from '../../services/systemService';

interface SystemState {
  hostname: string;
  isHealthy: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: SystemState = {
  hostname: typeof window !== "undefined" ? window.location.hostname : "localhost",
  isHealthy: true,
  loading: false,
  error: null,
};

export const fetchWhoami = createAsyncThunk(
  'system/fetchWhoami',
  async () => await systemService.getWhoami()
);

export const checkSystemHealth = createAsyncThunk(
  'system/checkHealth',
  async () => await systemService.checkHealth()
);

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWhoami.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWhoami.fulfilled, (state, action) => {
        state.loading = false;
        state.hostname = action.payload;
      })
      .addCase(fetchWhoami.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch whoami';
      })
      .addCase(checkSystemHealth.fulfilled, (state, action) => {
        state.isHealthy = action.payload;
      });
  },
});

export default systemSlice.reducer;
