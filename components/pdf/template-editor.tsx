
import React from 'react';
import { Editor } from '@/components/ui/editor';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function PDFTemplateEditor() {
  const [language, setLanguage] = React.useState('en');
  const [hasWatermark, setHasWatermark] = React.useState(false);
  
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select
          value={language}
          onValueChange={setLanguage}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="gu">Gujarati</option>
        </Select>
        
        <Input 
          type="text" 
          placeholder="Watermark text"
          disabled={!hasWatermark}
        />
        
        <Button onClick={() => setHasWatermark(!hasWatermark)}>
          Toggle Watermark
        </Button>
      </div>
      
      <Editor />
      
      <div className="flex gap-2">
        <Button>Preview</Button>
        <Button>Save Template</Button>
        <Button>Send as Email</Button>
      </div>
    </div>
  );
}
