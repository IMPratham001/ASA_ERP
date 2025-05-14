
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomerSelect } from "@/components/features/billing/customer-select";

export function InvoiceForm() {
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0 }]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Customer</Label>
            <CustomerSelect />
          </div>
          <div>
            <Label>Invoice Number</Label>
            <Input defaultValue="INV-000001" disabled />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <table className="w-full">
            <thead>
              <tr>
                <th>Item Details</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td><Input placeholder="Type or click to select an item" /></td>
                  <td><Input type="number" defaultValue={1} /></td>
                  <td><Input type="number" defaultValue={0} /></td>
                  <td>₹0.00</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="outline" className="mt-4" onClick={() => setItems([...items, { description: "", quantity: 1, rate: 0 }])}>
            Add New Row
          </Button>
        </div>

        <div>
          <Label>Customer Notes</Label>
          <Textarea defaultValue="Thanks for your business." />
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">Save as Draft</Button>
          <Button>Save and Send</Button>
        </div>
      </div>
    </div>
  );
}
