
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\PDF\TemplateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PDFController extends Controller
{
    protected $templateService;

    public function __construct(TemplateService $templateService)
    {
        $this->templateService = $templateService;
    }

    public function generate(Request $request)
    {
        try {
            $pdf = $this->templateService->generatePDF(
                $request->input('data'),
                $request->input('template'),
                $request->input('options', [])
            );

            return response($pdf, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="document.pdf"'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function preview(Request $request)
    {
        try {
            $pdf = $this->templateService->generatePDF(
                $request->input('data'),
                $request->input('template'),
                array_merge($request->input('options', []), ['preview' => true])
            );

            return response($pdf, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="preview.pdf"'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function download(Request $request)
    {
        try {
            $pdf = $this->templateService->generatePDF(
                $request->input('data'),
                $request->input('template'),
                $request->input('options', [])
            );

            return response($pdf, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="document.pdf"'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
