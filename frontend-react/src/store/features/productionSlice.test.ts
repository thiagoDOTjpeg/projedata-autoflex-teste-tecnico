import { describe, expect, it } from 'vitest';
import type { ProductionSuggestion } from '../../types/product';
import productionReducer, { fetchProductionSuggestions } from './productionSlice';

describe('Production Slice', () => {
  const initialState = {
    suggestions: [],
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(productionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set loading to true when fetchProductionSuggestions is pending', () => {
    const action = { type: fetchProductionSuggestions.pending.type };
    const state = productionReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update suggestions and set loading to false when fetchProductionSuggestions is fulfilled', () => {
    const mockSuggestions: ProductionSuggestion[] = [
      {
        productId: 'prod-123',
        productName: 'Metallic Cabinet',
        quantityToProduce: 10,
        totalValue: 5000
      }
    ];

    const action = {
      type: fetchProductionSuggestions.fulfilled.type,
      payload: mockSuggestions
    };
    const state = productionReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.suggestions).toEqual(mockSuggestions);
    expect(state.suggestions[0].productId).toBe('prod-123');
  });

  it('should set loading to false and provide an error message when fetchProductionSuggestions is rejected', () => {
    const mockError = { message: 'API failure' };
    const action = {
      type: fetchProductionSuggestions.rejected.type,
      error: mockError
    };
    const state = productionReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('API failure');
  });

  it('should clear error message when a new fetch request starts', () => {
    const stateWithError = { ...initialState, error: 'Previous Error' };
    const action = { type: fetchProductionSuggestions.pending.type };
    const state = productionReducer(stateWithError, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });
});