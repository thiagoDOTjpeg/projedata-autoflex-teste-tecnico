export interface Product {
  id: string;
  name: string;
  price: number;
  materials: ProductMaterial[];
}

export interface RawMaterial {
  id: string;
  name: string;
  stockQuantity: number;
}

export interface RawMaterialRequest {
  name: string;
  stockQuantity: number;
}

export interface ProductMaterial {
  rawMaterial: RawMaterial;
  requiredQuantity: number;
}

export interface ProductMaterialUpdate {
  materials: {
    materialId: string,
    quantity: number
  }[];
}

export interface ProductUpdate {
  name?: string;
  price?: number;
}

export interface ProductRequest {
  name: string;
  price: number;
  materials: {
    materialId: string;
    quantity: number;
  }[];
}

export interface ProductionSuggestion {
  productId: string;
  productName: string;
  quantityToProduce: number;
  totalValue: number;
}

