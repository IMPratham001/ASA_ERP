"use client";

import { useState } from "react";
import { useStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function InventoryPage() {
  const { products, inventory, addProduct, updateInventory } = useStore();
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    sku: "",
    price: 0,
    cost: 0,
    category: "",
  });

  const handleAddProduct = () => {
    const product = {
      id: Math.random().toString(),
      ...newProduct,
    };
    addProduct(product);
    updateInventory({
      id: Math.random().toString(),
      storeId: "1",
      productId: product.id,
      quantity: 0,
      minQuantity: 5,
    });
    setNewProduct({
      name: "",
      description: "",
      sku: "",
      price: 0,
      cost: 0,
      category: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <Input
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
              />
              <Input
                placeholder="SKU"
                value={newProduct.sku}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sku: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: parseFloat(e.target.value),
                  })
                }
              />
              <Input
                type="number"
                placeholder="Cost"
                value={newProduct.cost}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    cost: parseFloat(e.target.value),
                  })
                }
              />
              <Input
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              />
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const inventoryItem = inventory.find(
              (item) => item.productId === product.id
            );
            return (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>${product.cost}</TableCell>
                <TableCell>{inventoryItem?.quantity || 0}</TableCell>
                <TableCell>
                  {(inventoryItem?.quantity || 0) <= (inventoryItem?.minQuantity || 5)
                    ? "Low Stock"
                    : "In Stock"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}