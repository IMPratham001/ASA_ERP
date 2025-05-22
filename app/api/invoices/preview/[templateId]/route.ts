
import { PDFDocument } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { templateId: string } }) {
  try {
    if (!params?.templateId) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    const doc = await PDFDocument.create();
    
    // Add basic template content
    const templateContent = {
      basic: "Basic Invoice Template",
      professional: "Professional Template",
      modern: "Modern Design Template"
    };

    return NextResponse.json({ 
      preview: templateContent[params.templateId as keyof typeof templateContent] || "Default Template"
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
  }
}
