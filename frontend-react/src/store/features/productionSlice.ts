import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import { productsService } from '../../services/productsService';
import type { ProductionSuggestion } from '../../types/product';

interface ProductionState {
  suggestions: ProductionSuggestion[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductionState = {
  suggestions: [],
  loading: false,
  error: null,
};

export const fetchProductionSuggestions = createAsyncThunk(
  'production/fetchSuggestions',
  async () => await productsService.getProductionSuggestions()
);

export const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addMatcher(
        isPending(fetchProductionSuggestions),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isRejected(fetchProductionSuggestions),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Operation failed';
        }
      );
  },
});

export default productionSlice.reducer;
