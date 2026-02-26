import type { Product } from '@/types/product';
import { describe, expect, it } from 'vitest';
import productsReducer, { deleteProduct, fetchProducts } from './productsSlice';

describe('Products Slice', () => {
  const initialState = {
    products: [],
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set loading to true when fetchProducts is pending', () => {
    const action = { type: fetchProducts.pending.type };
    const state = productsReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update the products list when fetchProducts is fulfilled', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Product A', price: 100, materials: [] }
    ];
    const action = { type: fetchProducts.fulfilled.type, payload: mockProducts };
    const state = productsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.products).toEqual(mockProducts);
  });

  it('should remove a product from the list after deleteProduct.fulfilled', () => {
    const stateWithProducts = {
      ...initialState,
      products: [{ id: '1', name: 'Product A', price: 100, materials: [] }]
    };

    const action = { type: deleteProduct.fulfilled.type, payload: '1' };
    const state = productsReducer(stateWithProducts, action);

    expect(state.products).toHaveLength(0);
  });

  it('should set a global error message for errors other than 400', () => {
    const errorPayload = { status: 500, message: 'Server Crash' };
    const action = { type: fetchProducts.rejected.type, payload: errorPayload };
    const state = productsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Server Crash');
  });
});