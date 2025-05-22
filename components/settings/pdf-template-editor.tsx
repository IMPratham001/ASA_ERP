
'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PDFTemplateEditor() {
  const [template, setTemplate] = useState({
    name: '',
    type: 'invoice',
    language: 'en',
    content: ''
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2">
        <div>
          <Label>Template Name</Label>
          <Input 
            value={template.name}
            onChange={(e) => setTemplate({...template, name: e.target.value})}
          />
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

      <div className="min-h-[500px] border rounded-md p-4">
        {/* Template editor will be implemented based on your preference */}
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Preview</Button>
        <Button>Save Template</Button>
      </div>
    </div>
  );
}
