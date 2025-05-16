
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Picqer\Barcode\BarcodeGeneratorPNG;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class BarcodeController extends Controller
{
    public function generateBarcode(Request $request)
    {
        $generator = new BarcodeGeneratorPNG();
        $barcode = base64_encode($generator->getBarcode($request->code, $generator::TYPE_CODE_128));
        
        return response()->json([
            'barcode' => 'data:image/png;base64,' . $barcode
        ]);
    }

    public function generateQRCode(Request $request)
    {
        $qr = base64_encode(QrCode::format('png')->size(300)->generate($request->data));
        
        return response()->json([
            'qrcode' => 'data:image/png;base64,' . $qr
        ]);
    }
}
