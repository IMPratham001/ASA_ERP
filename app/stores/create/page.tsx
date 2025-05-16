
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Mail, Users, DollarSign, Clock } from "lucide-react";

export default function CreateStorePage() {
  const router = useRouter();
  const { addStore } = useStore();
  const [storeData, setStoreData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    region: "",
    type: "retail",
    operatingHours: {
      start: "09:00",
      end: "18:00"
    },
    staffCapacity: "",
    monthlySalesTarget: "",
    status: "active",
    facilities: [],
    inventory: {
      capacity: "",
      currentValue: 0
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addStore({
      id: Math.random().toString(),
      ...storeData,
      createdAt: new Date().toISOString(),
    });
    router.push("/stores");
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Store</h1>
        <p className="text-muted-foreground">Add a new store location to your network</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Store Information</CardTitle>
                <CardDescription>Enter the fundamental details about your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Store Name</Label>
                    <Input
                      placeholder="Enter store name"
                      value={storeData.name}
                      onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Store Type</Label>
                    <Select
                      value={storeData.type}
                      onValueChange={(value) => setStoreData({...storeData, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select store type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail Store</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="outlet">Outlet Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      placeholder="Store address"
                      value={storeData.address}
                      onChange={(e) => setStoreData({...storeData, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Input
                      placeholder="Store region"
                      value={storeData.region}
                      onChange={(e) => setStoreData({...storeData, region: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      placeholder="Contact number"
                      value={storeData.phone}
                      onChange={(e) => setStoreData({...storeData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Store email"
                      value={storeData.email}
                      onChange={(e) => setStoreData({...storeData, email: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations">
            <Card>
              <CardHeader>
                <CardTitle>Operational Details</CardTitle>
                <CardDescription>Configure store operations and capacity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Operating Hours Start</Label>
                    <Input
                      type="time"
                      value={storeData.operatingHours.start}
                      onChange={(e) => setStoreData({
                        ...storeData,
                        operatingHours: {...storeData.operatingHours, start: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Operating Hours End</Label>
                    <Input
                      type="time"
                      value={storeData.operatingHours.end}
                      onChange={(e) => setStoreData({
                        ...storeData,
                        operatingHours: {...storeData.operatingHours, end: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Staff Capacity</Label>
                    <Input
                      type="number"
                      placeholder="Maximum staff capacity"
                      value={storeData.staffCapacity}
                      onChange={(e) => setStoreData({...storeData, staffCapacity: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Inventory Capacity</Label>
                    <Input
                      type="number"
                      placeholder="Maximum inventory capacity"
                      value={storeData.inventory.capacity}
                      onChange={(e) => setStoreData({
                        ...storeData,
                        inventory: {...storeData.inventory, capacity: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Financial Targets</CardTitle>
                <CardDescription>Set financial goals and targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Monthly Sales Target</Label>
                    <Input
                      type="number"
                      placeholder="Target amount"
                      value={storeData.monthlySalesTarget}
                      onChange={(e) => setStoreData({...storeData, monthlySalesTarget: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push("/stores")}>
            Cancel
          </Button>
          <Button type="submit">Create Store</Button>
        </div>
      </form>
    </div>
  );
}
