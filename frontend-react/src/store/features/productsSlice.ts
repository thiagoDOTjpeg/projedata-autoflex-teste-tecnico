import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Product, ProductMaterial, ProductMaterialUpdate } from '../../types/product';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data as Product[];
  }
);

export const updateProductMaterials = createAsyncThunk(
  'products/updateProductMaterials',
  async ({ productId, payload }: { productId: string, payload: ProductMaterialUpdate }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/product-materials/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Failed to update product materials');
    }
    const data = await response.json();
    return { productId, materials: data as ProductMaterial[] };
  }
);

export const deleteProductMaterials = createAsyncThunk(
  'products/deleteProductMaterials',
  async ({ productId, materialId }: { productId: string, materialId: string }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/product-materials/${productId}/${materialId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete product material');
    }
    return { productId, materialId };
  }
)

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(updateProductMaterials.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, materials } = action.payload;

        const index = state.products.findIndex(p => p.id === productId);
        if (index !== -1) {
          state.products[index].materials = materials;
        }
      })
      .addCase(updateProductMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update materials';
      })
      .addCase(deleteProductMaterials.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, materialId } = action.payload;

        const index = state.products.findIndex(p => p.id === productId);
        if (index !== -1) {
          state.products[index].materials = state.products[index].materials.filter(m => m.rawMaterial.id !== materialId);
        }
      })
      .addCase(deleteProductMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete material';
      })
  },
});

export default productsSlice.reducer;
