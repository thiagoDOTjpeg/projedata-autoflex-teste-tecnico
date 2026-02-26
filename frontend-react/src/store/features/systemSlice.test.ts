import { describe, expect, it } from 'vitest';
import systemReducer, { checkSystemHealth, fetchWhoami } from './systemSlice';

describe('System Slice', () => {
  const initialState = {
    hostname: 'localhost',
    isHealthy: true,
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    const state = systemReducer(undefined, { type: 'unknown' });
    expect(state).toBeDefined();
    expect(state.isHealthy).toBe(true);
    expect(state.loading).toBe(false);
  });

  it('should handle fetchWhoami.pending', () => {
    const action = { type: fetchWhoami.pending.type };
    const state = systemReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchWhoami.fulfilled', () => {
    const mockHostname = 'athens-vps';
    const action = { type: fetchWhoami.fulfilled.type, payload: mockHostname };
    const state = systemReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.hostname).toBe(mockHostname);
  });

  it('should handle fetchWhoami.rejected', () => {
    const errorMessage = 'Network error';
    const action = {
      type: fetchWhoami.rejected.type,
      error: { message: errorMessage }
    };
    const state = systemReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should use default error message when fetchWhoami.rejected has no message', () => {
    const action = { type: fetchWhoami.rejected.type, error: {} };
    const state = systemReducer(initialState, action);

    expect(state.error).toBe('Failed to fetch whoami');
  });

  it('should handle checkSystemHealth.fulfilled', () => {
    const action = { type: checkSystemHealth.fulfilled.type, payload: false };
    const state = systemReducer(initialState, action);

    expect(state.isHealthy).toBe(false);
  });
});