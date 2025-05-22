
export interface PDFTemplate {
  id: string;
  name: string;
  type: 'invoice' | 'receipt' | 'report';
  content: string;
  version: number;
  isDefault: boolean;
  fields: PDFField[];
}

export interface PDFField {
  name: string;
  type: 'text' | 'number' | 'date' | 'currency';
  required: boolean;
  defaultValue?: string;
}
