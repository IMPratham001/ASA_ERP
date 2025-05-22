'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-states';

interface PreviewProps {
  templateId: string;
  data: Record<string, any>;
}

export function TemplatePreview({ templateId, data }: PreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generatePreview = async () => {
      try {
        const response = await fetch(`/api/invoices/preview/${templateId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const blob = await response.blob();
        setPdfUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error('Preview generation failed:', error);
      } finally {
        setLoading(false);
      }
    };

    generatePreview();
  }, [templateId, data]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="w-full h-[600px]">
      <iframe src={pdfUrl} className="w-full h-full" />
    </Card>
  );
}