
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoiceSummaryProps {
  items: Array<{
    quantity: number;
    price: number;
    discount: number;
    tax: number;
  }>;
}

export function InvoiceSummary({ items }: InvoiceSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
  const totalTax = items.reduce((sum, item) => sum + item.tax, 0);
  const total = subtotal - totalDiscount + totalTax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>₹{totalDiscount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{totalTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
