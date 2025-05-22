
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

export interface BarcodeOptions {
  format: 'EAN-13' | 'CODE128' | 'QR';
  width?: number;
  height?: number;
  background?: string;
}

export async function generateBarcode(text: string, options: BarcodeOptions): Promise<string> {
  if (options.format === 'QR') {
    return await QRCode.toDataURL(text, {
      width: options.width || 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: options.background || '#ffffff'
      }
    });
  }

  const canvas = document.createElement('canvas');
  JsBarcode(canvas, text, {
    format: options.format,
    width: options.width || 2,
    height: options.height || 100,
    background: options.background || '#ffffff'
  });
  
  return canvas.toDataURL('image/png');
}

export function validateBarcode(barcode: string, format: string): boolean {
  switch (format) {
    case 'EAN-13':
      return /^\d{13}$/.test(barcode);
    case 'CODE128':
      return /^[A-Z0-9]{1,}$/.test(barcode);
    default:
      return true;
  }
}
