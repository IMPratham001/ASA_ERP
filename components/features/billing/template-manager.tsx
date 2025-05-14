
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TemplateManager() {
  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [templates, setTemplates] = useState([
    { id: "default", name: "Default Invoice", type: "invoice" },
    { id: "minimal", name: "Minimal Invoice", type: "invoice" },
    { id: "detailed", name: "Detailed Invoice", type: "invoice" },
    { id: "quote", name: "Standard Quote", type: "quote" },
    { id: "po", name: "Purchase Order", type: "purchase_order" },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="select">
          <TabsList>
            <TabsTrigger value="select">Select Template</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Template Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="quote">Quote</SelectItem>
                    <SelectItem value="po">Purchase Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Template</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input id="templateName" placeholder="Enter template name" />
              </div>
              
              <div className="space-y-2">
                <Label>Base Template</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select base template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">Blank</SelectItem>
                    <SelectItem value="default">Default Invoice</SelectItem>
                    <SelectItem value="minimal">Minimal Invoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>Create Template</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
