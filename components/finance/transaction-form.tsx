
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Transaction } from "@/types/finance";
import { transactionSchema } from "@/lib/validation/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { financeAPI } from "@/lib/api/finance/transactions";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

export function TransactionForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(transactionSchema)
  });

  const onSubmit = async (data: Partial<Transaction>) => {
    try {
      setLoading(true);
      await financeAPI.create(data);
      toast({
        title: "Success",
        description: "Transaction created successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create transaction",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register("amount")} type="number" placeholder="Amount" />
      <Input {...form.register("description")} placeholder="Description" />
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Transaction"}
      </Button>
    </form>
  );
}
