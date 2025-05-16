
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Http\Request;

class PDFController extends Controller
{
    public function generateInvoicePDF(Request $request)
    {
        $data = $request->validate([
            'invoice_id' => 'required',
            'type' => 'required|in:download,preview,email',
            'language' => 'required|in:en,hi,gu',
            'watermark' => 'nullable|string'
        ]);

        $invoice = Invoice::with(['items', 'customer'])->findOrFail($data['invoice_id']);
        
        // Generate QR code
        $qrCode = base64_encode(QrCode::format('png')
            ->size(100)
            ->generate(route('invoice.verify', $invoice->id)));

        $pdf = PDF::loadView("pdf.invoice.{$data['language']}", [
            'invoice' => $invoice,
            'qrCode' => $qrCode,
            'watermark' => $data['watermark'] ?? null
        ]);

        // Set font for Indian languages
        if ($data['language'] !== 'en') {
            $pdf->setOption('defaultFont', 'Noto Sans');
        }

        switch ($data['type']) {
            case 'preview':
                return $pdf->stream('invoice.pdf');
            case 'email':
                return $pdf->output();
            default:
                return $pdf->download('invoice.pdf');
        }
    }
}
