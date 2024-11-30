import { z } from "zod";

export const productSchema = z.object({
//   id: z.string().uuid(), 

  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
});

export const orderSchema = z.object({
//   id: z.string().uuid(),
  products: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().positive("Quantity must be greater than 0"),
      })
    )
    .nonempty("At least one product is required"),
});
