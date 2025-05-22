
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Save } from 'lucide-react';

interface Version {
  id: string;
  name: string;
  date: string;
}

export function TemplateVersionControl() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [versionName, setVersionName] = useState('');

  const saveVersion = () => {
    if (!versionName) return;
    const newVersion = {
      id: Date.now().toString(),
      name: versionName,
      date: new Date().toISOString()
    };
    setVersions([newVersion, ...versions]);
    setVersionName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Version name"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
            />
            <Button onClick={saveVersion}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
          <div className="space-y-2">
            {versions.map((version) => (
              <div key={version.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-medium">{version.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(version.date).toLocaleString()}
                  </div>
                </div>
                <Button variant="outline" size="sm">Restore</Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
