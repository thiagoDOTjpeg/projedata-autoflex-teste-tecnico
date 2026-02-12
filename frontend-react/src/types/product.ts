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

export interface ProductMaterial {
  id: number;
  rawMaterial: RawMaterial;
  requiredQuantity: number;
}