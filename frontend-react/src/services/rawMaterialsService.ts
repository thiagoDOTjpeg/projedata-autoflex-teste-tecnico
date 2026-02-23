import type { RawMaterial, RawMaterialRequest } from '../types/product';
import { apiClient } from './apiClient';

export const rawMaterialsService = {
  getRawMaterials: () =>
    apiClient.get<RawMaterial[]>('/raw-materials'),

  createRawMaterial: (payload: RawMaterialRequest) =>
    apiClient.post<RawMaterial>('/raw-materials', payload),

  updateRawMaterial: (material: RawMaterial) =>
    apiClient.put<RawMaterial>(`/raw-materials/${material.id}`, {
      name: material.name,
      stockQuantity: material.stockQuantity,
    }),

  deleteRawMaterial: (id: string) =>
    apiClient.delete<void>(`/raw-materials/${id}`),
};
