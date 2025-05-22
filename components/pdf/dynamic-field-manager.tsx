
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from 'lucide-react';

export function DynamicFieldManager() {
  const [fields, setFields] = useState<Array<{id: string, name: string, type: string}>>([]);

  const addField = () => {
    setFields([...fields, { id: Date.now().toString(), name: '', type: 'text' }]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dynamic Fields</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input 
                placeholder="Field name"
                value={field.name}
                onChange={(e) => {
                  const newFields = fields.map(f => 
                    f.id === field.id ? { ...f, name: e.target.value } : f
                  );
                  setFields(newFields);
                }}
              />
              <Button variant="destructive" size="icon" onClick={() => removeField(field.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addField} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Field
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
