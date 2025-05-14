"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { ProductSelect } from "@/components/billing/product-select";

export function ProductTable({ items, setItems }) {
  const [newItem, setNewItem] = useState({
    productId: "",
    quantity: 1,
    price: 0,
    discount: 0,
    tax: 0,
  });

  const addItem = () => {
    if (!newItem.productId) return;
    setItems([...items, { ...newItem, id: Math.random().toString() }]);
    setNewItem({
      productId: "",
      quantity: 1,
      price: 0,
      discount: 0,
      tax: 0,
    });
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <ProductSelect
                  value={item.productId}
                  onChange={(value) => updateItem(item.id, "productId", value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.id, "quantity", parseInt(e.target.value))
                  }
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(item.id, "price", parseFloat(e.target.value))
                  }
                  className="w-24"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={item.discount}
                  onChange={(e) =>
                    updateItem(item.id, "discount", parseFloat(e.target.value))
                  }
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={item.tax}
                  onChange={(e) =>
                    updateItem(item.id, "tax", parseFloat(e.target.value))
                  }
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                {(
                  item.quantity *
                  item.price *
                  (1 - item.discount / 100) *
                  (1 + item.tax / 100)
                ).toFixed(2)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <ProductSelect
                value={newItem.productId}
                onChange={(value) =>
                  setNewItem({ ...newItem, productId: value })
                }
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    quantity: parseInt(e.target.value),
                  })
                }
                className="w-20"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-24"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                min="0"
                max="100"
                value={newItem.discount}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    discount: parseFloat(e.target.value),
                  })
                }
                className="w-20"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                min="0"
                max="100"
                value={newItem.tax}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    tax: parseFloat(e.target.value),
                  })
                }
                className="w-20"
              />
            </TableCell>
            <TableCell>
              {(
                newItem.quantity *
                newItem.price *
                (1 - newItem.discount / 100) *
                (1 + newItem.tax / 100)
              ).toFixed(2)}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={addItem}
                disabled={!newItem.productId}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}