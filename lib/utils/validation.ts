
import { z } from "zod";

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8);
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  sku: z.string().min(1, "SKU is required").max(50),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  cost: z.number().min(0, "Cost must be positive"),
});

export const inventorySchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(0, "Quantity must be positive"),
  minQuantity: z.number().int().min(0, "Minimum quantity must be positive"),
  location: z.string().min(1, "Location is required"),
});

export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["admin", "manager", "user"]),
});

export const validateData = async <T>(
  schema: z.Schema<T>,
  data: unknown
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    const validData = await schema.parseAsync(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Validation failed" };
  }
};
