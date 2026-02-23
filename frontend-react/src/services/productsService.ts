import type { Product, ProductMaterial, ProductMaterialUpdate, ProductRequest, ProductUpdate, ProductionSuggestion } from '../types/product';
import { apiClient } from './apiClient';

export const productsService = {
  getProducts: () =>
    apiClient.get<Product[]>('/products'),

  createProduct: (payload: ProductRequest) =>
    apiClient.post<Product>('/products', payload),

  updateProduct: (productId: string, payload: ProductUpdate) =>
    apiClient.put<Product>(`/products/${productId}`, payload),

  deleteProduct: (productId: string) =>
    apiClient.delete<void>(`/products/${productId}`),

  updateProductMaterials: (productId: string, payload: ProductMaterialUpdate) =>
    apiClient.put<ProductMaterial[]>(`/product-materials/${productId}`, payload),

  deleteProductMaterial: (productId: string, materialId: string) =>
    apiClient.delete<void>(`/product-materials/${productId}/${materialId}`),

  getProductionSuggestions: () =>
    apiClient.get<ProductionSuggestion[]>('/production/suggestions')
};
