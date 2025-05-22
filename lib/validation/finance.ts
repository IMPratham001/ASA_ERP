import * as z from 'zod';

export const accountSchema = z.object({
  code: z.string().min(3).max(10),
  name: z.string().min(3).max(100),
  type: z.enum(['asset', 'liability', 'equity', 'revenue', 'expense']),
  balance: z.number().min(0),
  description: z.string().optional(),
});

export const journalEntrySchema = z.object({
  date: z.date(),
  description: z.string().min(5),
  entries: z.array(z.object({
    accountId: z.string(),
    debit: z.number().min(0),
    credit: z.number().min(0),
  })).min(2),
});

export const budgetSchema = z.object({
  period: z.enum(['monthly', 'quarterly', 'annual']),
  amount: z.number().positive(),
  category: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

export const taxSettingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  percentage: z.number().min(0).max(100),
  isDefault: z.boolean(),
  status: z.enum(["active", "inactive"]),
});