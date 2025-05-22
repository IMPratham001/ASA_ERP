
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Editor } from "@/components/ui/editor";

export default function PDFTemplatesPage() {
  const [templateType, setTemplateType] = useState("invoice");
  const [language, setLanguage] = useState("en");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">PDF Template Management</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Template Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex gap-4">
                <Select value={templateType} onValueChange={setTemplateType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="delivery">Delivery Challan</SelectItem>
                    <SelectItem value="purchase">Purchase Order</SelectItem>
                    <SelectItem value="receipt">Receipt</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="gu">Gujarati</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Editor />

              <div className="flex gap-2">
                <Button>Save Template</Button>
                <Button variant="outline">Preview</Button>
                <Button variant="outline">Download</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
