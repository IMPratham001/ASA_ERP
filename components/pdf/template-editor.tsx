import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { TemplateVersionControl } from './template-version-control';
import { DynamicFieldManager } from './dynamic-field-manager';
import { LanguageSelector } from './language-selector';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Template {
  id?: string;
  name: string;
  type: string;
  content: string;
  language: string;
  version: number;
  watermark?: string;
}

export function PDFTemplateEditor() {
  const [template, setTemplate] = useState<Template>({
    name: '',
    type: 'invoice',
    content: '',
    language: 'en',
    version: 1
  });
  const [watermark, setWatermark] = useState('');
  const [history, setHistory] = useState<Template[]>([]);

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'gu', label: 'Gujarati' }
  ];

  const templateTypes = [
    { value: 'invoice', label: 'Invoice' },
    { value: 'delivery', label: 'Delivery Challan' },
    { value: 'purchase', label: 'Purchase Order' },
    { value: 'receipt', label: 'Receipt' },
    { value: 'custom', label: 'Custom Report' }
  ];

  const handleSave = async () => {
    try {
      // Save template logic
      setHistory([...history, { ...template }]);
      toast({
        title: "Success",
        description: "Template saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive"
      });
    }
  };

  const handleExport = async () => {
    const blob = new Blob([JSON.stringify(template)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template-${template.name}.json`;
    a.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setTemplate(imported);
        } catch (error) {
          toast({
            title: "Error",
            description: "Invalid template file",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const [selectedLanguage, setSelectedLanguage] = useState('en');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <LanguageSelector />
        <DynamicFieldManager />
      </div>
      <div className="space-y-4">
        <TemplateVersionControl />
      <Card>
        <CardHeader>
          <CardTitle>Template Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Template Name"
                value={template.name}
                onChange={(e) => setTemplate({...template, name: e.target.value})}
              />
              <Select
                value={template.language}
                onValueChange={(value) => setTemplate({...template, language: value})}
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </Select>
            </div>

            <Select
              value={template.type}
              onValueChange={(value) => setTemplate({...template, type: value})}
            >
              {templateTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </Select>

            <ReactQuill
              value={template.content}
              onChange={(content) => setTemplate({...template, content})}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'align': [] }],
                  ['link', 'image'],
                  ['clean']
                ]
              }}
            />

            <Input
              placeholder="Watermark Text"
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
            />

            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Template</Button>
              <Button variant="outline" onClick={handleExport}>Export</Button>
              <Input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-template"
              />
              <Button variant="outline" onClick={() => document.getElementById('import-template')?.click()}>
                Import
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {history.map((version, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <span>Version {version.version}</span>
                <Button
                  variant="outline"
                  onClick={() => setTemplate(version)}
                >
                  Restore
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}