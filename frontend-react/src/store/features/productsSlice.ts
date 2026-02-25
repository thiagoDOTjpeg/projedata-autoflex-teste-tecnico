import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import { productsService } from '../../services/productsService';
import type { Product, ProductMaterialUpdate, ProductRequest, ProductUpdate } from '../../types/product';

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
  async () => await productsService.getProducts()
);

export const updateProductMaterials = createAsyncThunk(
  'products/updateProductMaterials',
  async ({ productId, payload }: { productId: string, payload: ProductMaterialUpdate }, { rejectWithValue }) => {
    try {
      const materials = await productsService.updateProductMaterials(productId, payload);
      return { productId, materials };
    } catch (error: any) {
      return rejectWithValue({
        status: error.status,
        message: error.message,
        problemDetail: error.problemDetail
      });
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, payload }: { productId: string, payload: ProductUpdate }, { rejectWithValue }) => {
    try {
      const product = await productsService.updateProduct(productId, payload);
      return { productId, product };
    } catch (error: any) {
      return rejectWithValue({
        status: error.status,
        message: error.message,
        problemDetail: error.problemDetail
      });
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (payload: ProductRequest, { rejectWithValue }) => {
    try {
      const product = await productsService.createProduct(payload);
      return product;
    } catch (error: any) {
      return rejectWithValue({
        status: error.status,
        message: error.message,
        problemDetail: error.problemDetail
      });
    }
  }
);

export const deleteProductMaterials = createAsyncThunk(
  'products/deleteProductMaterials',
  async ({ productId, materialId }: { productId: string, materialId: string }, { rejectWithValue }) => {
    try {
      await productsService.deleteProductMaterial(productId, materialId);
      return { productId, materialId };
    } catch (error: any) {
      return rejectWithValue({
        status: error.status,
        message: error.message,
        problemDetail: error.problemDetail
      });
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: string, { rejectWithValue }) => {
    try {
      await productsService.deleteProduct(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue({
        status: error.status,
        message: error.message,
        problemDetail: error.problemDetail
      });
    }
  }
);

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(updateProductMaterials.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, materials } = action.payload;

        const index = state.products.findIndex(p => p.id === productId);
        if (index !== -1) {
          state.products[index].materials = materials;
        }
      })
      .addCase(deleteProductMaterials.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, materialId } = action.payload;

        const index = state.products.findIndex(p => p.id === productId);
        if (index !== -1) {
          state.products[index].materials = state.products[index].materials.filter(m => m.rawMaterial.id !== materialId);
        }
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, product } = action.payload;

        const index = state.products.findIndex(p => p.id === productId);
        if (index !== -1) {
          state.products[index] = product;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const productId = action.payload;

        state.products = state.products.filter(p => p.id !== productId);
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addMatcher(
        isPending(fetchProducts, updateProductMaterials, updateProduct, createProduct, deleteProductMaterials, deleteProduct),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isRejected(fetchProducts, updateProductMaterials, updateProduct, createProduct, deleteProductMaterials, deleteProduct),
        (state, action) => {
          state.loading = false;
          const errorPayload = action.payload as any;

          if (errorPayload?.status === 400) {
            state.error = null;
          } else {
            state.error = errorPayload?.message || "Critical system error";
          }
        }
      );
  },
});

export default productsSlice.reducer;
