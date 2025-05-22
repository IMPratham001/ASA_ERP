
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Editor } from '@/components/ui/editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DynamicEditor = dynamic(() => import('@/components/ui/editor'), { ssr: false });

interface Template {
  id?: string;
  name: string;
  type: string;
  content: string;
  language: string;
  version: number;
}

export function PDFTemplateEditor() {
  const [template, setTemplate] = useState<Template>({
    name: '',
    type: 'invoice',
    content: '',
    language: 'en',
    version: 1
  });
  const [preview, setPreview] = useState<string>('');
  const [watermark, setWatermark] = useState('');

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'gu', label: 'Gujarati' }
  ];

  const templateTypes = [
    { value: 'invoice', label: 'Invoice' },
    { value: 'delivery', label: 'Delivery Challan' },
    { value: 'purchase', label: 'Purchase Order' },
    { value: 'receipt', label: 'Receipt' }
  ];

  const handlePreview = async () => {
    try {
      const response = await fetch('/api/templates/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...template, watermark })
      });
      const data = await response.text();
      setPreview(data);
    } catch (error) {
      console.error('Preview generation failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label>Template Name</label>
            <Input 
              value={template.name}
              onChange={(e) => setTemplate({...template, name: e.target.value})}
            />
          </div>
          <div>
            <label>Language</label>
            <Select 
              value={template.language}
              onValueChange={(value) => setTemplate({...template, language: value})}
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </Select>
          </div>
        </div>

        <Tabs defaultValue="editor">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor">
            <DynamicEditor 
              value={template.content}
              onChange={(content) => setTemplate({...template, content})}
            />
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="border rounded-lg p-4 min-h-[500px]"
                 dangerouslySetInnerHTML={{ __html: preview }} 
            />
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex gap-2">
          <Input
            placeholder="Watermark Text"
            value={watermark}
            onChange={(e) => setWatermark(e.target.value)}
          />
          <Button onClick={handlePreview}>Preview</Button>
          <Button>Save Template</Button>
          <Button>Export PDF</Button>
        </div>
      </Card>
    </div>
  );
}
