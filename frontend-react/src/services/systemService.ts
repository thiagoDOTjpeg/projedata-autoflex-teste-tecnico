import type { HealthCheck } from '@/types/api';
import { apiClient } from './apiClient';

export const systemService = {
  getWhoami: async (): Promise<string> => {
    try {
      const data = await apiClient.get<HealthCheck>('/health/whoami');

      if (typeof data === 'string') {
        return data;
      } else if (data && typeof data === 'object') {
        return data.pod;
      }
      return String(data);
    } catch (error) {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';
      const res = await fetch(`${baseUrl}/production/whoami`);
      if (res.ok) {
        return await res.text();
      }
      throw error;
    }
  },

  checkHealth: async (): Promise<boolean> => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';
      const res = await fetch(`${baseUrl}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
};
