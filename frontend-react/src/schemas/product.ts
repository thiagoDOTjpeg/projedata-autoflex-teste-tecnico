import { z } from "zod";

export const materialSchema = z.object({
  materialId: z.string(),
  name: z.string(),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
});

export const productCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be greater than 0"),
  materials: z.array(materialSchema).min(1, "At least one raw material is required"),
});

export const productMaterialsUpdateSchema = z.object({
  materials: z.array(materialSchema).min(1, "A product must have at least one raw material."),
});

export const productEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number({ message: "Price is required" }).min(0, "Price must be non-negative"),
});

export type ProductCreateFormValues = z.infer<typeof productCreateSchema>;
export type ProductMaterialsUpdateFormValues = z.infer<typeof productMaterialsUpdateSchema>;
export type ProductEditFormValues = z.infer<typeof productEditSchema>;
