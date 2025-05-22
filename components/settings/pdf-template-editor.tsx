
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PDFTemplateEditor() {
  const [template, setTemplate] = useState({
    name: '',
    type: 'invoice',
    language: 'en',
    content: ''
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-3">
        <div>
          <Label>Template Name</Label>
          <Input 
            value={template.name}
            onChange={(e) => setTemplate({...template, name: e.target.value})}
            placeholder="e.g. Standard Invoice"
          />
        </div>
        <div>
          <Label>Type</Label>
          <Select value={template.type} onValueChange={(value) => setTemplate({...template, type: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Document Types</SelectLabel>
                <SelectItem value="invoice">Sales Invoice</SelectItem>
                <SelectItem value="challan">Delivery Challan</SelectItem>
                <SelectItem value="estimate">Estimate/Quotation</SelectItem>
                <SelectItem value="label">Product Label</SelectItem>
                <SelectItem value="receipt">Payment Receipt</SelectItem>
                <SelectItem value="statement">Account Statement</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Language</Label>
          <Select value={template.language} onValueChange={(value) => setTemplate({...template, language: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Languages</SelectLabel>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="gu">Gujarati</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">HTML Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="min-h-[500px]">
          <textarea 
            className="w-full h-[500px] font-mono p-4 border rounded-md"
            value={template.content}
            onChange={(e) => setTemplate({...template, content: e.target.value})}
            placeholder="Enter HTML template content..."
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="border rounded-md p-4 min-h-[500px]">
            Preview will be rendered here
          </div>
        </TabsContent>
        <TabsContent value="variables">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Company Variables</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded">
                {`{company_name}
{address}
{gstin}
{phone}
{email}
{logo}`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Customer Variables</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded">
                {`{customer_name}
{address}
{contact}
{gstin}
{city}
{state}`}
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Template</Button>
      </div>
    </div>
  );
}
