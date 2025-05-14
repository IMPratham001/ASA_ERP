
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
    { id: "default-business", name: "Business Invoice", type: "invoice", category: "business" },
    { id: "default-retail", name: "Retail Invoice", type: "invoice", category: "retail" },
    { id: "tax-invoice", name: "Tax Invoice", type: "invoice", category: "business" },
    { id: "proforma", name: "Proforma Invoice", type: "invoice", category: "business" },
    { id: "quote-business", name: "Business Quote", type: "quote", category: "business" },
    { id: "quote-retail", name: "Retail Quote", type: "quote", category: "retail" },
    { id: "po", name: "Purchase Order", type: "purchase_order", category: "business" },
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    type: "invoice",
    category: "business",
    baseTemplate: "",
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.type || !newTemplate.category) return;
    
    const template = {
      id: `custom-${Date.now()}`,
      name: newTemplate.name,
      type: newTemplate.type,
      category: newTemplate.category,
    };

    setTemplates([...templates, template]);
    setNewTemplate({
      name: "",
      type: "invoice",
      category: "business",
      baseTemplate: "",
    });
  };

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
                <Label>Business Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Document Type</Label>
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
                <Input 
                  id="templateName" 
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  placeholder="Enter template name" 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Business Type</Label>
                <Select
                  value={newTemplate.category}
                  onValueChange={(value) => setNewTemplate({...newTemplate, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select
                  value={newTemplate.type}
                  onValueChange={(value) => setNewTemplate({...newTemplate, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="quote">Quote</SelectItem>
                    <SelectItem value="po">Purchase Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Base Template</Label>
                <Select
                  value={newTemplate.baseTemplate}
                  onValueChange={(value) => setNewTemplate({...newTemplate, baseTemplate: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select base template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">Blank</SelectItem>
                    <SelectItem value="default-business">Default Business Invoice</SelectItem>
                    <SelectItem value="default-retail">Default Retail Invoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreateTemplate}>Create Template</Button>
            </div>
          </TabsContent>

          <TabsContent value="customize" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Template to Customize</Label>
                <Select>
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
              
              <Button>Open Template Editor</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
