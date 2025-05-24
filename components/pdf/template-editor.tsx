'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Editor } from "@/components/ui/editor";
import { toast } from "@/components/ui/toast";
import { api } from "@/lib/api/axios";

export function TemplateEditor() {
  const [template, setTemplate] = useState('');
  const [preview, setPreview] = useState(null);
  const [version, setVersion] = useState(1);
  const [history, setHistory] = useState([]);

  const handleSave = async () => {
    try {
      await api.post('/pdf/templates', { template, version });
      toast({
        title: "Success",
        description: "Template saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  const handlePreview = async () => {
    try {
      const response = await api.post('/pdf/preview', {
        template,
        data: { sample: 'data' },
      });
      setPreview(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate preview",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>Template Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <Editor
                value={template}
                onChange={setTemplate}
                className="min-h-[500px]"
              />
              <div className="flex justify-end space-x-2 mt-4">
                <Button onClick={handlePreview}>Preview</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {preview ? (
                <iframe
                  src={`data:application/pdf;base64,${preview}`}
                  className="w-full h-[600px]"
                />
              ) : (
                <div className="text-center py-8">
                  Click preview to generate PDF
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
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
                      onClick={() => setTemplate(version.template)}
                    >
                      Restore
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}