import { z } from "zod";

export const rawMaterialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  stockQuantity: z.number({ message: "Stock is required" }).min(0, "Stock cannot be negative"),
});

export type RawMaterialFormValues = z.infer<typeof rawMaterialSchema>;
