
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FieldMapping {
  templateField: string;
  dataField: string;
}

export function FieldMapping() {
  const [mappings, setMappings] = useState<FieldMapping[]>([]);

  const addMapping = () => {
    setMappings([...mappings, { templateField: "", dataField: "" }]);
  };

  const updateMapping = (index: number, field: keyof FieldMapping, value: string) => {
    const newMappings = [...mappings];
    newMappings[index][field] = value;
    setMappings(newMappings);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Field Mapping</h3>
      {mappings.map((mapping, index) => (
        <Card key={index} className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Template Field</Label>
              <Input
                value={mapping.templateField}
                onChange={(e) => updateMapping(index, "templateField", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Data Field</Label>
              <Input
                value={mapping.dataField}
                onChange={(e) => updateMapping(index, "dataField", e.target.value)}
              />
            </div>
          </div>
        </Card>
      ))}
      <Button onClick={addMapping}>Add Field Mapping</Button>
    </div>
  );
}
