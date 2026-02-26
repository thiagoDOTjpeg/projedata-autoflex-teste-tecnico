import { ApiError } from "@/lib/api-errors";
import type { ApiErrorPayload } from "@/types/api";
import type { RawMaterial, RawMaterialRequest } from "@/types/product";
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

export const createRawMaterial = createAsyncThunk(
  "rawMaterials/createRawMaterial",
  async (payload: RawMaterialRequest, { rejectWithValue }) => {
    try {
      const response = await rawMaterialsService.createRawMaterial(payload)
      return response
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        return rejectWithValue({
          status: error.status,
          message: error.message,
          problemDetail: error.problemDetail
        });
      }
      return rejectWithValue({ message: error instanceof Error ? error.message : "Critical system error" })
    }
  }
);

export const updateRawMaterial = createAsyncThunk(
  "rawMaterials/updateRawMaterial",
  async (material: RawMaterial, { rejectWithValue }) => {
    try {
      const response = await rawMaterialsService.updateRawMaterial(material)
      return response
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        return rejectWithValue({
          status: error.status,
          message: error.message,
          problemDetail: error.problemDetail
        });
      }
      return rejectWithValue({ message: error instanceof Error ? error.message : "Critical system error" })
    }
  }
);

export const deleteRawMaterial = createAsyncThunk(
  "rawMaterials/deleteRawMaterial",
  async (id: string, { rejectWithValue }) => {
    try {
      await rawMaterialsService.deleteRawMaterial(id);
      return id;
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        return rejectWithValue({
          status: error.status,
          message: error.message,
          problemDetail: error.problemDetail
        });
      }
      return rejectWithValue({ message: error instanceof Error ? error.message : "Critical system error" })
    }
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
      .addCase(createRawMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.rawMaterials.push(action.payload);
      })
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.rawMaterials = state.rawMaterials.filter(m => m.id !== action.payload);
      })
      .addMatcher(
        isPending(fetchRawMaterials, updateRawMaterial, createRawMaterial, deleteRawMaterial),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isRejected(fetchRawMaterials, updateRawMaterial, createRawMaterial, deleteRawMaterial),
        (state, action) => {
          state.loading = false;
          const errorPayload = action.payload as ApiErrorPayload | undefined;

          if (errorPayload?.status === 400) {
            state.error = null;
          } else {
            state.error = errorPayload?.message || "Critical system error";
          }
        }
      );
  }
});

export default rawMaterialsSlice.reducer;