
<?php

namespace App\Services\PDF;

use TCPDF;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class TemplateService
{
    private $pdf;
    private $fonts = [
        'gujarati' => 'Lohit-Gujarati.ttf',
        'hindi' => 'Lohit-Devanagari.ttf',
        'english' => 'DejaVuSans.ttf'
    ];

    public function __construct()
    {
        $this->pdf = new TCPDF();
        $this->initializePDF();
        $this->registerFonts();
    }

    private function initializePDF()
    {
        $this->pdf->SetCreator('ASA ERP');
        $this->pdf->SetAuthor('Aanshi Shringar Art');
        $this->pdf->SetTitle('Document');
        $this->pdf->SetAutoPageBreak(true, 15);
    }

    private function registerFonts()
    {
        foreach ($this->fonts as $name => $font) {
            $fontPath = storage_path('fonts/' . $font);
            $this->pdf->AddFont($name, '', $fontPath, true);
        }
    }

    public function setFont($language, $size = 12)
    {
        $fontMap = [
            'gu' => 'gujarati',
            'hi' => 'hindi',
            'en' => 'english'
        ];
        
        $font = $fontMap[$language] ?? 'english';
        $this->pdf->SetFont($font, '', $size);
    }

    public function addWatermark($text, $options = [])
    {
        $defaults = [
            'alpha' => 0.2,
            'color' => [128, 128, 128],
            'size' => 40,
            'angle' => 45,
        ];
        
        $options = array_merge($defaults, $options);
        
        $this->pdf->SetAlpha($options['alpha']);
        $this->pdf->SetTextColor($options['color'][0], $options['color'][1], $options['color'][2]);
        $this->pdf->SetFontSize($options['size']);
        
        $this->pdf->StartTransform();
        $this->pdf->Rotate($options['angle'], $this->pdf->getPageWidth()/2, $this->pdf->getPageHeight()/2);
        $this->pdf->Text(0, $this->pdf->getPageHeight()/2, $text);
        $this->pdf->StopTransform();
        
        $this->pdf->SetAlpha(1);
    }

    public function addQRCode($data, $x = 0, $y = 0, $w = 30, $h = 30)
    {
        if (!filter_var($data, FILTER_VALIDATE_URL)) {
            if (is_array($data)) {
                $data = json_encode($data);
            }
            $data = 'https://asaerp.in/view/' . urlencode($data);
        }
        
        $style = [
            'border' => false,
            'vpadding' => 0,
            'hpadding' => 0,
            'fgcolor' => [0, 0, 0],
            'bgcolor' => false,
            'module_width' => 1,
            'module_height' => 1,
        ];
        
        $this->pdf->write2DBarcode($data, 'QRCODE,H', $x, $y, $w, $h, $style);
    }

    public function generate($template, $data)
    {
        $this->pdf->AddPage();
        
        if (isset($data['watermark'])) {
            $this->addWatermark($data['watermark']);
        }

        if (isset($data['language'])) {
            $this->setFont($data['language']);
        }
        
        $html = view($template, $data)->render();
        $this->pdf->writeHTML($html, true, false, true, false, '');
        
        if (isset($data['qr_data'])) {
            $this->addQRCode($data['qr_data']);
        }
        
        return $this->pdf->Output('', 'S');
    }
}
