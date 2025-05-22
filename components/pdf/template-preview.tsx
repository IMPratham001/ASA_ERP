
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TemplatePreview() {
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Template Preview</h3>
        <div className="space-x-2">
          <Button onClick={zoomOut} variant="outline" size="sm">-</Button>
          <Button onClick={zoomIn} variant="outline" size="sm">+</Button>
        </div>
      </div>
      <Card className="p-4 overflow-auto h-[600px]">
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <div className="w-[794px] h-[1123px] bg-white shadow-lg">
            {/* Preview content will be rendered here */}
          </div>
        </div>
      </Card>
    </div>
  );
}
