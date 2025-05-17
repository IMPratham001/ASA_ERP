
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

class PDFController extends Controller
{
    public function generateInvoicePDF(Request $request)
    {
        try {
            $data = $request->validate([
                'invoice_id' => 'required',
                'type' => 'required|in:download,preview,email',
                'language' => 'required|in:en,hi,gu',
                'watermark' => 'nullable|string'
            ]);

            $invoice = Invoice::with(['items', 'customer'])->findOrFail($data['invoice_id']);
            
            // Generate QR code with invoice verification URL
            $qrCode = base64_encode(QrCode::format('png')
                ->size(100)
                ->generate(url("/verify-invoice/{$invoice->id}")));

            $pdf = PDF::loadView("pdf.invoice.{$data['language']}", [
                'invoice' => $invoice,
                'qrCode' => $qrCode,
                'watermark' => $data['watermark'] ?? null
            ]);

            // Set font for non-English languages
            if ($data['language'] !== 'en') {
                $pdf->setOption('defaultFont', 'Noto Sans');
            }

            // Set paper size and orientation
            $pdf->setPaper('A4', 'portrait');

            switch ($data['type']) {
                case 'preview':
                    return Response::make($pdf->output(), 200, [
                        'Content-Type' => 'application/pdf',
                        'Content-Disposition' => 'inline; filename="invoice.pdf"'
                    ]);
                case 'email':
                    // Store PDF temporarily and return path
                    $path = storage_path('app/temp/') . "invoice_{$invoice->id}.pdf";
                    $pdf->save($path);
                    return response()->json(['path' => $path]);
                default:
                    return $pdf->download("invoice_{$invoice->id}.pdf");
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'PDF generation failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function viewPDF($path)
    {
        try {
            if (!Storage::exists($path)) {
                return response()->json(['error' => 'PDF not found'], 404);
            }
            
            $file = Storage::get($path);
            return Response::make($file, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="document.pdf"'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to load PDF',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
