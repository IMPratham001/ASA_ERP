import * as z from "zod";

export const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.number().min(0, "Amount must be positive"),
  period: z.enum(["monthly", "quarterly", "yearly"]),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(["active", "inactive"]),
});

export const taxSettingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  percentage: z.number().min(0).max(100),
  isDefault: z.boolean(),
  status: z.enum(["active", "inactive"]),
});

import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().min(0),
  description: z.string().min(1),
  type: z.enum(['credit', 'debit']),
  accountId: z.string().uuid(),
  date: z.date()
});