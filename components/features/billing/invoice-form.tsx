
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { CustomerSelect } from "./customer-select";
import { ProductSelect } from "./product-select";
import { StoreSelect } from "./store-select";
import { api } from "@/lib/api/axios";
import { format } from "date-fns";

interface InvoiceItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  tax_rate: number;
  tax_amount: number;
  subtotal: number;
  total: number;
}

interface InvoiceFormData {
  customer_id: number;
  store_id: number;
  due_date: Date;
  notes: string;
  items: InvoiceItem[];
}

export function InvoiceForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InvoiceFormData>({
    customer_id: 0,
    store_id: 0,
    due_date: new Date(),
    notes: "",
    items: []
  });

  const addItem = (product: any) => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product_id: product.id,
          product_name: product.name,
          quantity: 1,
          price: product.price,
          tax_rate: product.tax_rate,
          tax_amount: (product.price * product.tax_rate) / 100,
          subtotal: product.price,
          total: product.price + ((product.price * product.tax_rate) / 100)
        }
      ]
    }));
  };

  const updateItem = (index: number, field: string, value: number) => {
    const newItems = [...formData.items];
    const item = newItems[index];
    
    // Update the specified field
    item[field] = value;
    
    // Recalculate amounts
    item.subtotal = item.quantity * item.price;
    item.tax_amount = (item.subtotal * item.tax_rate) / 100;
    item.total = item.subtotal + item.tax_amount;
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = formData.items.reduce((sum, item) => sum + item.tax_amount, 0);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id || !formData.store_id || formData.items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/invoices', {
        ...formData,
        due_date: format(formData.due_date, 'yyyy-MM-dd')
      });
      
      toast({
        title: "Success",
        description: "Invoice created successfully"
      });
      
      router.push(`/invoices/${response.data.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Customer</label>
              <CustomerSelect
                onSelect={(customer) => setFormData(prev => ({ ...prev, customer_id: customer.id }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Store</label>
              <StoreSelect
                onSelect={(store) => setFormData(prev => ({ ...prev, store_id: store.id }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <DatePicker
                selected={formData.due_date}
                onSelect={(date) => setFormData(prev => ({ ...prev, due_date: date }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Items</h3>
              <ProductSelect onSelect={addItem} />
            </div>

          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Tax Rate</TableHead>
                  <TableHead>Tax Amount</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                        min="1"
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(index, "price", parseFloat(e.target.value))}
                        step="0.01"
                        min="0"
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>{item.tax_rate}%</TableCell>
                    <TableCell>${item.tax_amount.toFixed(2)}</TableCell>
                    <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                    <TableCell>${item.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button type="button" variant="outline" onClick={addItem} className="mt-4">
              Add Item
            </Button>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="space-y-2">
              <div className="text-sm">Subtotal: ${calculateTotals().subtotal.toFixed(2)}</div>
              <div className="text-sm">Tax: ${calculateTotals().tax.toFixed(2)}</div>
              <div className="text-xl font-bold">
                Total: ${calculateTotals().total.toFixed(2)}
              </div>
            </div>
            <div className="space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || formData.items.length === 0}
              >
                {loading ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
