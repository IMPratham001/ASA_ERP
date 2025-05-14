
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoiceSummaryProps {
  items: Array<{
    quantity: number;
    unitPrice: number;
    discount?: number;
  }>;
}

export function InvoiceSummary({ items }: InvoiceSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalDiscount = items.reduce((sum, item) => sum + (item.discount || 0), 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal - totalDiscount + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Discount</span>
            <span>₹{totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax (18%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
