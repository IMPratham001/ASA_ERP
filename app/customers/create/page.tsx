
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateCustomer() {
  const router = useRouter();
  const [customerType, setCustomerType] = useState("business");
  const [allowPortalAccess, setAllowPortalAccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/customers");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Customer</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 space-y-4">
            <div className="flex gap-4 mb-6">
              <RadioGroup
                defaultValue="business"
                onValueChange={setCustomerType}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business">Business</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual">Individual</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Primary Contact</Label>
                <div className="flex gap-2 mt-2">
                  <Input placeholder="Salutation" className="w-1/4" />
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
              </div>
              <div>
                <Label>Company Name</Label>
                <Input className="mt-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Display Name*</Label>
                <Input className="mt-2" required />
              </div>
              <div>
                <Label>Customer Email</Label>
                <Input type="email" className="mt-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Phone</Label>
                <div className="flex gap-2 mt-2">
                  <Input placeholder="Work Phone" />
                  <Input placeholder="Mobile" />
                </div>
              </div>
              <div>
                <Label>Website</Label>
                <Input className="mt-2" />
              </div>
            </div>
          </div>

          <Tabs defaultValue="other-details" className="mt-6">
            <TabsList>
              <TabsTrigger value="other-details">Other Details</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="contact-persons">Contact Persons</TabsTrigger>
              <TabsTrigger value="custom-fields">Custom Fields</TabsTrigger>
              <TabsTrigger value="remarks">Remarks</TabsTrigger>
            </TabsList>

            <TabsContent value="other-details" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Currency*</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Terms</Label>
                  <Select defaultValue="due">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="due">Due on Receipt</SelectItem>
                      <SelectItem value="net15">Net 15</SelectItem>
                      <SelectItem value="net30">Net 30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Portal Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="portal-access"
                  checked={allowPortalAccess}
                  onCheckedChange={setAllowPortalAccess}
                />
                <Label htmlFor="portal-access">
                  Allow portal access for this customer
                </Label>
              </div>
            </TabsContent>

            <TabsContent value="address" className="mt-4">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-medium">Billing Address</h3>
                  <Input placeholder="Attention" />
                  <Input placeholder="Country/Region" />
                  <Input placeholder="Street 1" />
                  <Input placeholder="Street 2" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="City" />
                    <Input placeholder="State" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="ZIP Code" />
                    <Input placeholder="Fax" />
                  </div>
                  <Input placeholder="Phone" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Shipping Address</h3>
                    <Button variant="link" size="sm">Copy Billing Address</Button>
                  </div>
                  <Input placeholder="Attention" />
                  <Input placeholder="Country/Region" />
                  <Input placeholder="Street 1" />
                  <Input placeholder="Street 2" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="City" />
                    <Input placeholder="State" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="ZIP Code" />
                    <Input placeholder="Fax" />
                  </div>
                  <Input placeholder="Phone" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact-persons" className="mt-4">
              <Button variant="link" className="mb-4">+ Add Contact Person</Button>
              <div className="grid grid-cols-6 gap-4 text-sm font-medium">
                <div>SALUTATION</div>
                <div>FIRST NAME</div>
                <div>LAST NAME</div>
                <div>EMAIL</div>
                <div>WORK PHONE</div>
                <div>MOBILE</div>
              </div>
            </TabsContent>

            <TabsContent value="custom-fields" className="mt-4">
              <p className="text-sm text-muted-foreground">No custom fields available</p>
            </TabsContent>

            <TabsContent value="remarks" className="mt-4">
              <textarea
                className="w-full h-32 p-2 border rounded-md"
                placeholder="Remarks (For Internal Use)"
              />
            </TabsContent>
          </Tabs>
        </form>
      </Card>
    </div>
  );
}
