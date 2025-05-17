
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [companySettings, setCompanySettings] = useState({
    name: "My Company",
    email: "contact@company.com",
    phone: "+1234567890",
    address: "123 Business St",
    taxId: "TAX123456",
    currency: "USD"
  });

  const [ecommerceSettings, setEcommerceSettings] = useState({
    websiteUrl: "https://shop.company.com",
    enableEcommerce: true,
    paymentGateways: ["stripe", "paypal"],
    shippingMethods: ["standard", "express"]
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      
      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={companySettings.name} onChange={(e) => setCompanySettings(prev => ({...prev, name: e.target.value}))} />
                </div>
                <div className="space-y-2">
                  <Label>Business Email</Label>
                  <Input value={companySettings.email} onChange={(e) => setCompanySettings(prev => ({...prev, email: e.target.value}))} />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={companySettings.phone} onChange={(e) => setCompanySettings(prev => ({...prev, phone: e.target.value}))} />
                </div>
                <div className="space-y-2">
                  <Label>Tax ID</Label>
                  <Input value={companySettings.taxId} onChange={(e) => setCompanySettings(prev => ({...prev, taxId: e.target.value}))} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Business Address</Label>
                  <Input value={companySettings.address} onChange={(e) => setCompanySettings(prev => ({...prev, address: e.target.value}))} />
                </div>
              </div>
              <Button className="mt-4">Save Company Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ecommerce">
          <Card>
            <CardHeader>
              <CardTitle>E-commerce Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input value={ecommerceSettings.websiteUrl} onChange={(e) => setEcommerceSettings(prev => ({...prev, websiteUrl: e.target.value}))} />
                </div>
                <div className="space-y-2">
                  <Label>Payment Methods</Label>
                  <div className="grid gap-2">
                    {ecommerceSettings.paymentGateways.map(gateway => (
                      <div key={gateway} className="flex items-center gap-2">
                        <Input type="checkbox" checked /> 
                        <span className="capitalize">{gateway}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Shipping Methods</Label>
                  <div className="grid gap-2">
                    {ecommerceSettings.shippingMethods.map(method => (
                      <div key={method} className="flex items-center gap-2">
                        <Input type="checkbox" checked />
                        <span className="capitalize">{method}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Button className="mt-4">Save E-commerce Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
