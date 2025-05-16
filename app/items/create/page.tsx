
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store/store";
import { Textarea } from "@/components/ui/textarea";

export default function CreateItemPage() {
  const router = useRouter();
  const { addProduct } = useStore();
  const [item, setItem] = useState({
    name: "",
    sku: "",
    price: "",
    description: "",
    category: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProduct(item);
    router.push("/items");
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={item.name}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>SKU</Label>
              <Input
                value={item.sku}
                onChange={(e) => setItem({ ...item, sku: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={item.price}
                onChange={(e) => setItem({ ...item, price: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={item.description}
                onChange={(e) => setItem({ ...item, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit">Create Item</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
