
import * as z from "zod";

export const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  content: z.string().min(1, "Template content is required"),
  type: z.enum(["invoice", "receipt", "report"]),
  version: z.number(),
  isDefault: z.boolean(),
  fields: z.array(z.object({
    name: z.string(),
    type: z.enum(["text", "number", "date", "currency"]),
    required: z.boolean(),
  })),
});
