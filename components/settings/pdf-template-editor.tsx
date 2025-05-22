'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Save, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateFormData {
  name: string;
  type: string;
  language: string;
  content: string;
}

export default function PDFTemplateEditor() {
  const { toast } = useToast();
  const [template, setTemplate] = useState<TemplateFormData>({
    name: '',
    type: 'invoice',
    language: 'en',
    content: ''
  });
  const [errors, setErrors] = useState<Partial<TemplateFormData>>({});
  const [previewHtml, setPreviewHtml] = useState('');

  const validateForm = () => {
    const newErrors: Partial<TemplateFormData> = {};
    if (!template.name) newErrors.name = 'Name is required';
    if (!template.content) newErrors.content = 'Template content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = async () => {
    try {
      const response = await fetch('/api/invoices/preview/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      });

      if (response.ok) {
        const html = await response.text();
        setPreviewHtml(html);
      }
    } catch (error) {
      toast({
        title: "Preview Failed",
        description: "Could not generate preview",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2">
        <div>
          <Label>Template Name</Label>
          <Input 
            value={template.name}
            onChange={(e) => setTemplate({...template, name: e.target.value})}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label>Language</Label>
          <select 
            className="w-full px-3 py-2 border rounded-md"
            value={template.language}
            onChange={(e) => setTemplate({...template, language: e.target.value})}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="gu">Gujarati</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <div className="min-h-[500px] border rounded-md p-4">
            <textarea
              className="w-full h-full min-h-[480px] p-4 font-mono text-sm"
              value={template.content}
              onChange={(e) => setTemplate({...template, content: e.target.value})}
              placeholder="Enter your template HTML here..."
            />
          </div>
        </TabsContent>
        <TabsContent value="preview">
          <div className="min-h-[500px] border rounded-md p-4 bg-white">
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handlePreview}>
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button onClick={() => {
          if (validateForm()) {
            // Save template
            toast({
              title: "Success",
              description: "Template saved successfully"
            });
          }
        }}>
          <Save className="w-4 h-4 mr-2" />
          Save Template
        </Button>
      </div>
    </div>
  );
}