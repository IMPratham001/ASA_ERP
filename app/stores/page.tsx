"use client";

import { useState } from "react";
import { useStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function StoresPage() {
  const { stores, addStore } = useStore();
  const [newStore, setNewStore] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const handleAddStore = () => {
    addStore({
      id: Math.random().toString(),
      ...newStore,
    });
    setNewStore({
      name: "",
      address: "",
      phone: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Stores</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Store</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Store Name"
                value={newStore.name}
                onChange={(e) =>
                  setNewStore({ ...newStore, name: e.target.value })
                }
              />
              <Input
                placeholder="Address"
                value={newStore.address}
                onChange={(e) =>
                  setNewStore({ ...newStore, address: e.target.value })
                }
              />
              <Input
                placeholder="Phone"
                value={newStore.phone}
                onChange={(e) =>
                  setNewStore({ ...newStore, phone: e.target.value })
                }
              />
              <Button onClick={handleAddStore}>Add Store</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <Card key={store.id}>
            <CardHeader>
              <CardTitle>{store.name}</CardTitle>
              <CardDescription>{store.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{store.phone}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}