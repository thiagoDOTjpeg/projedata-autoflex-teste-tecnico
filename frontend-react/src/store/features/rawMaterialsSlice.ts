import type { RawMaterial } from "@/types/product";
import { createAsyncThunk, createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import { rawMaterialsService } from "../../services/rawMaterialsService";

interface RawMaterialsState {
  rawMaterials: RawMaterial[];
  loading: boolean;
  error: string | null;
}

const initialState: RawMaterialsState = {
  rawMaterials: [],
  loading: false,
  error: null,
};

export const fetchRawMaterials = createAsyncThunk(
  "rawMaterials/fetchRawMaterials",
  async () => await rawMaterialsService.getRawMaterials()
);

export const updateRawMaterial = createAsyncThunk(
  "rawMaterials/updateRawMaterial",
  async (material: RawMaterial) => await rawMaterialsService.updateRawMaterial(material)
);

export const deleteRawMaterial = createAsyncThunk(
  "rawMaterials/deleteRawMaterial",
  async (id: string) => {
    await rawMaterialsService.deleteRawMaterial(id);
    return id;
  }
);

export const rawMaterialsSlice = createSlice({
  name: "rawMaterials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.rawMaterials = action.payload;
      })
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.rawMaterials.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.rawMaterials[index] = action.payload;
        }
      })
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.rawMaterials = state.rawMaterials.filter(m => m.id !== action.payload);
      })
      .addMatcher(
        isPending(fetchRawMaterials, updateRawMaterial, deleteRawMaterial),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isRejected(fetchRawMaterials, updateRawMaterial, deleteRawMaterial),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Operation failed";
        }
      );
  }
});

export default rawMaterialsSlice.reducer;