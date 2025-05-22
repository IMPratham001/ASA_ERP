
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InvoiceSummary({ items }) {
  const subtotal = items.reduce((acc, item) => {
    const itemTotal = item.quantity * item.price;
    const discountAmount = itemTotal * (item.discount / 100);
    return acc + (itemTotal - discountAmount);
  }, 0);

  const totalTax = items.reduce((acc, item) => {
    const itemTotal = item.quantity * item.price * (1 - item.discount / 100);
    return acc + (itemTotal * (item.tax / 100));
  }, 0);

  const total = subtotal + totalTax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${totalTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
