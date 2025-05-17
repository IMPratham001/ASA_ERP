
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { customerAPI } from "@/lib/api/laravel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function CreateCustomer() {
  const router = useRouter();
  const [customerType, setCustomerType] = useState("business");
  
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    customerType: "business",
    salutation: "",
    firstName: "",
    lastName: "",
    companyName: "",
    displayName: "",
    email: "",
    workPhone: "",
    mobile: "",
    website: "",
    currency: "USD",
    paymentTerms: "due_on_receipt",
    portalLanguage: "english",
    billingAddress: {
      attention: "",
      country: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      fax: ""
    },
    shippingAddress: {
      attention: "",
      country: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      fax: ""
    },
    remarks: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.displayName) {
      toast({
        title: "Error",
        description: "Display name is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await customerAPI.create(customer);
      toast({
        title: "Success",
        description: "Customer created successfully"
      });
      router.push("/customers");
    } catch (error) {
      console.error("Error creating customer:", error);
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Customer</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Save"}
          </Button>
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
                  <Select onValueChange={(value) => setCustomer({...customer, salutation: value})}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                      <SelectItem value="ms">Ms.</SelectItem>
                      <SelectItem value="dr">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    placeholder="First Name"
                    value={customer.firstName}
                    onChange={(e) => setCustomer({...customer, firstName: e.target.value})}
                  />
                  <Input 
                    placeholder="Last Name"
                    value={customer.lastName}
                    onChange={(e) => setCustomer({...customer, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Company Name</Label>
                <Input 
                  className="mt-2"
                  value={customer.companyName}
                  onChange={(e) => setCustomer({...customer, companyName: e.target.value})}
                  disabled={customerType === "individual"}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Display Name*</Label>
                <Input 
                  className="mt-2" 
                  required
                  value={customer.displayName}
                  onChange={(e) => setCustomer({...customer, displayName: e.target.value})}
                />
              </div>
              <div>
                <Label>Customer Email</Label>
                <Input 
                  type="email" 
                  className="mt-2"
                  value={customer.email}
                  onChange={(e) => setCustomer({...customer, email: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Phone</Label>
                <div className="flex gap-2 mt-2">
                  <Input 
                    placeholder="Work Phone"
                    value={customer.workPhone}
                    onChange={(e) => setCustomer({...customer, workPhone: e.target.value})}
                  />
                  <Input 
                    placeholder="Mobile"
                    value={customer.mobile}
                    onChange={(e) => setCustomer({...customer, mobile: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Website</Label>
                <Input 
                  className="mt-2"
                  value={customer.website}
                  onChange={(e) => setCustomer({...customer, website: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="other-details" className="mt-6">
            <TabsList>
              <TabsTrigger value="other-details">Other Details</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="remarks">Remarks</TabsTrigger>
            </TabsList>

            <TabsContent value="other-details" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Currency*</Label>
                  <Select 
                    defaultValue="USD"
                    onValueChange={(value) => setCustomer({...customer, currency: value})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Terms</Label>
                  <Select 
                    defaultValue="due_on_receipt"
                    onValueChange={(value) => setCustomer({...customer, paymentTerms: value})}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                      <SelectItem value="net15">Net 15</SelectItem>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net45">Net 45</SelectItem>
                      <SelectItem value="net60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              
            </TabsContent>

            <TabsContent value="address" className="mt-4">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-medium">Billing Address</h3>
                  <Input 
                    placeholder="Attention"
                    value={customer.billingAddress.attention}
                    onChange={(e) => setCustomer({
                      ...customer, 
                      billingAddress: {...customer.billingAddress, attention: e.target.value}
                    })}
                  />
                  <Input 
                    placeholder="Country/Region"
                    value={customer.billingAddress.country}
                    onChange={(e) => setCustomer({
                      ...customer, 
                      billingAddress: {...customer.billingAddress, country: e.target.value}
                    })}
                  />
                  <Input 
                    placeholder="Street 1"
                    value={customer.billingAddress.street1}
                    onChange={(e) => setCustomer({
                      ...customer, 
                      billingAddress: {...customer.billingAddress, street1: e.target.value}
                    })}
                  />
                  <Input 
                    placeholder="Street 2"
                    value={customer.billingAddress.street2}
                    onChange={(e) => setCustomer({
                      ...customer, 
                      billingAddress: {...customer.billingAddress, street2: e.target.value}
                    })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      placeholder="City"
                      value={customer.billingAddress.city}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        billingAddress: {...customer.billingAddress, city: e.target.value}
                      })}
                    />
                    <Input 
                      placeholder="State"
                      value={customer.billingAddress.state}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        billingAddress: {...customer.billingAddress, state: e.target.value}
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      placeholder="ZIP Code"
                      value={customer.billingAddress.zipCode}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        billingAddress: {...customer.billingAddress, zipCode: e.target.value}
                      })}
                    />
                    <Input 
                      placeholder="Phone"
                      value={customer.billingAddress.phone}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        billingAddress: {...customer.billingAddress, phone: e.target.value}
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Shipping Address</h3>
                    <Button 
                      variant="link" 
                      type="button"
                      onClick={() => setCustomer({
                        ...customer,
                        shippingAddress: {...customer.billingAddress}
                      })}
                    >
                      Copy Billing Address
                    </Button>
                  </div>
                  <Input 
                    placeholder="Attention"
                    value={customer.shippingAddress.attention}
                    onChange={(e) => setCustomer({
                      ...customer, 
                      shippingAddress: {...customer.shippingAddress, attention: e.target.value}
                    })}
                  />
                  <Input 
                    placeholder="Country/Region"
                    value={customer.shippingAddress.country}
                    onChange={(e) => setCustomer({
                      ...customer, 
                      shippingAddress: {...customer.shippingAddress, country: e.target.value}
                    })}
                  />
                  <Input 
                    placeholder="Street 1"
                    value={customer.shippingAddress.street1}
                    onChange={(e) => setCustomer({
                      ...customer, 
                      shippingAddress: {...customer.shippingAddress, street1: e.target.value}
                    })}
                  />
                  <Input 
                    placeholder="Street 2"
                    value={customer.shippingAddress.street2}
                    onChange={(e) => setCustomer({
                      ...customer, 
                      shippingAddress: {...customer.shippingAddress, street2: e.target.value}
                    })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      placeholder="City"
                      value={customer.shippingAddress.city}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        shippingAddress: {...customer.shippingAddress, city: e.target.value}
                      })}
                    />
                    <Input 
                      placeholder="State"
                      value={customer.shippingAddress.state}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        shippingAddress: {...customer.shippingAddress, state: e.target.value}
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      placeholder="ZIP Code"
                      value={customer.shippingAddress.zipCode}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        shippingAddress: {...customer.shippingAddress, zipCode: e.target.value}
                      })}
                    />
                    <Input 
                      placeholder="Phone"
                      value={customer.shippingAddress.phone}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        shippingAddress: {...customer.shippingAddress, phone: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="remarks" className="mt-4">
              <Textarea
                className="w-full h-32"
                placeholder="Remarks (For Internal Use)"
                value={customer.remarks}
                onChange={(e) => setCustomer({...customer, remarks: e.target.value})}
              />
            </TabsContent>
          </Tabs>
        </form>
      </Card>
    </div>
  );
}
