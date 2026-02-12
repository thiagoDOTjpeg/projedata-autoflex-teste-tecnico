import type { RawMaterial } from "@/types/product";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface RawMaterialsState {
  rawMaterials: RawMaterial[];
  loading: boolean;
  error: string | null
}

const initialState: RawMaterialsState = {
  rawMaterials: [],
  loading: false,
  error: null
}

export const fetchRawMaterials = createAsyncThunk(
  "rawMaterials/fetchRawMaterials",
  async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8081"}/raw-materials`);
    if (!response.ok) throw new Error("Failed to fetch raw materials");
    const data = await response.json();
    return data as RawMaterial[];
  }
)

export const rawMtaerialsSlice = createSlice({
  name: "rawMaterials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.rawMaterials = action.payload;
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch raw materials";
      })
  }
})