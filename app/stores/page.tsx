"use client";

import { useState } from "react";
import { useStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Store, MapPin, Phone } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StoresPage() {
  const { stores, addStore } = useStore();
  const [newStore, setNewStore] = useState({
    name: "",
    address: "",
    phone: "",
    region: "",
    isMainBranch: false,
    status: "active",
  });

  const regions = Array.from(
    new Set((stores || []).map((store) => store.region)),
  );

  const handleAddStore = () => {
    addStore({
      id: Math.random().toString(),
      ...newStore,
      createdAt: new Date().toISOString(),
    });
    setNewStore({
      name: "",
      address: "",
      phone: "",
      region: "",
      isMainBranch: false,
      status: "active",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Store Management</h2>
        <Button onClick={() => window.location.href = '/stores/create'}>
          <Plus className="w-4 h-4 mr-2" />
          Add Store
        </Button>
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
              <Select
                value={newStore.region}
                onValueChange={(value) =>
                  setNewStore({ ...newStore, region: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Add New Region</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddStore}>Add Store</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {regions.map((region) => (
          <div key={region}>
            <h3 className="mb-4 text-lg font-semibold">{region}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stores
                .filter((store) => store.region === region)
                .map((store) => (
                  <Card key={store.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <Store className="w-4 h-4 mr-2" />
                          {store.name}
                        </CardTitle>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            store.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {store.status}
                        </span>
                      </div>
                      <CardDescription className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {store.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 mr-2" />
                        {store.phone}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
