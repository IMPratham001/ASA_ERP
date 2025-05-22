
import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from '@react-pdf/renderer';

export async function GET(request: Request, { params }: { params: { templateId: string } }) {
  try {
    const { templateId } = params;
    const doc = await PDFDocument.create();
    
    // Add template-specific styling and content
    const page = doc.addPage();
    const { width, height } = page.getSize();
    
    page.drawText('INVOICE', {
      x: 50,
      y: height - 100,
      size: 30,
      color: rgb(0, 0, 0),
    });
    
    const pdfBytes = await doc.save();
    
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=invoice.pdf',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
