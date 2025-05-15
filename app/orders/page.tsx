"use client";

import { useState } from "react";
import { useStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrdersPage() {
  const { orders, products, addOrder, updateOrderStatus } = useStore();
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerEmail: "",
    items: [] as { productId: string; quantity: number }[],
  });

  const handleAddOrder = () => {
    const orderItems = newOrder.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        id: Math.random().toString(),
        orderId: "",
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product?.price || 0,
      };
    });

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const order = {
      id: Math.random().toString(),
      storeId: "1",
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      status: "pending" as const,
      totalAmount,
      items: orderItems.map((item) => ({ ...item, orderId: Math.random().toString() })),
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    setNewOrder({
      customerName: "",
      customerEmail: "",
      items: [],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Customer Name"
                value={newOrder.customerName}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, customerName: e.target.value })
                }
              />
              <Input
                placeholder="Customer Email"
                value={newOrder.customerEmail}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, customerEmail: e.target.value })
                }
              />
              <Select
                onValueChange={(value) =>
                  setNewOrder({
                    ...newOrder,
                    items: [
                      ...newOrder.items,
                      { productId: value, quantity: 1 },
                    ],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddOrder}>Create Order</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>${order.totalAmount}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value) =>
                    updateOrderStatus(
                      order.id,
                      value as "pending" | "processing" | "completed" | "cancelled"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}