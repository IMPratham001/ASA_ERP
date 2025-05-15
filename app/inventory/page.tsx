
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store/store";

export default function InventoryPage() {
  const { inventory, products, updateInventory } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const updateStock = (itemId: string, quantity: number) => {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      updateInventory({
        ...item,
        quantity,
        lastUpdated: new Date().toISOString()
      });
    }
  };

  const filteredInventory = inventory.filter(item => 
    products.find(p => p.id === item.productId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Stock Control</CardTitle>
          <div className="flex gap-2">
            <Input 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button>Add Product</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>In Stock</TableHead>
                <TableHead>Low Stock Alert</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map(item => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <TableRow key={item.id}>
                    <TableCell>{product?.name}</TableCell>
                    <TableCell>{product?.sku}</TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => updateStock(item.id, parseInt(e.target.value))}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>{item.minQuantity}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
