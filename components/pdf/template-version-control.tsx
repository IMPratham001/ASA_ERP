
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, RotateCcw } from "lucide-react";

interface Version {
  id: string;
  version: number;
  timestamp: string;
  changes: string;
}

export function TemplateVersionControl() {
  const [versions, setVersions] = useState<Version[]>([]);

  const handleRestore = (versionId: string) => {
    // Implement version restore logic
    console.log("Restoring version:", versionId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {versions.map((version) => (
            <div key={version.id} className="flex items-center justify-between p-4 border-b">
              <div>
                <div className="font-medium">Version {version.version}</div>
                <div className="text-sm text-gray-500">{version.timestamp}</div>
                <div className="text-sm">{version.changes}</div>
              </div>
              <Button variant="outline" onClick={() => handleRestore(version.id)}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore
              </Button>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
