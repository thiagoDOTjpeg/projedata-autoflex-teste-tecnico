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

export const updateRawMaterial = createAsyncThunk(
  "rawMaterials/updateRawMaterial",
  async (material: RawMaterial) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/raw-materials/${material.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: material.name,
          stockQuantity: material.stockQuantity,
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to update raw material");

    const data = await response.json();
    return data as RawMaterial;
  }
);

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
      .addCase(updateRawMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.rawMaterials.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.rawMaterials[index] = action.payload;
        }
      })
      .addCase(updateRawMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update raw material";
      });
  }
})


export default rawMtaerialsSlice.reducer;