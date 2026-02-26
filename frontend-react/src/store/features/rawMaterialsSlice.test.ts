import type { RawMaterial } from '@/types/product';
import { describe, expect, it } from 'vitest';
import rawMaterialsReducer, {
  createRawMaterial,
  deleteRawMaterial,
  fetchRawMaterials,
  updateRawMaterial
} from './rawMaterialsSlice';

describe('Raw Materials Slice', () => {
  const initialState = {
    rawMaterials: [],
    loading: false,
    error: null,
  };

  const mockMaterial: RawMaterial = { id: '1', name: 'Iron', stockQuantity: 50 };

  it('should return the initial state', () => {
    expect(rawMaterialsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set loading to true and clear error when actions are pending', () => {
    const action = { type: fetchRawMaterials.pending.type };
    const state = rawMaterialsReducer({ ...initialState, error: 'Old Error' }, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update rawMaterials list when fetchRawMaterials is fulfilled', () => {
    const action = { type: fetchRawMaterials.fulfilled.type, payload: [mockMaterial] };
    const state = rawMaterialsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.rawMaterials).toEqual([mockMaterial]);
  });

  it('should add a new material to the list when createRawMaterial is fulfilled', () => {
    const action = { type: createRawMaterial.fulfilled.type, payload: mockMaterial };
    const state = rawMaterialsReducer(initialState, action);

    expect(state.rawMaterials).toContainEqual(mockMaterial);
    expect(state.rawMaterials).toHaveLength(1);
  });

  it('should update an existing material when updateRawMaterial is fulfilled', () => {
    const existingState = { ...initialState, rawMaterials: [mockMaterial] };
    const updatedMaterial = { ...mockMaterial, name: 'Steel' };

    const action = { type: updateRawMaterial.fulfilled.type, payload: updatedMaterial };
    const state = rawMaterialsReducer(existingState, action);

    expect(state.rawMaterials[0].name).toBe('Steel');
    expect(state.rawMaterials).toHaveLength(1);
  });

  it('should remove a material from the list when deleteRawMaterial is fulfilled', () => {
    const existingState = { ...initialState, rawMaterials: [mockMaterial] };

    const action = { type: deleteRawMaterial.fulfilled.type, payload: '1' };
    const state = rawMaterialsReducer(existingState, action);

    expect(state.rawMaterials).toHaveLength(0);
  });

  it('should set error to null when a rejected action has status 400 (validation error)', () => {
    const errorPayload = { status: 400, message: 'Invalid data' };
    const action = { type: createRawMaterial.rejected.type, payload: errorPayload };
    const state = rawMaterialsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set a critical error message for other rejected statuses', () => {
    const errorPayload = { status: 500, message: 'Database failure' };
    const action = { type: fetchRawMaterials.rejected.type, payload: errorPayload };
    const state = rawMaterialsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Database failure');
  });

  it('should use fallback error message when rejected payload has no message', () => {
    const action = { type: fetchRawMaterials.rejected.type, payload: {} };
    const state = rawMaterialsReducer(initialState, action);

    expect(state.error).toBe('Critical system error');
  });
});