<?php

namespace App\Services\PDF;

use TCPDF;
use QRCode;
use Exception;
use Illuminate\Support\Facades\Storage;

class TemplateService
{
    protected $pdf;
    protected $lang;
    protected $fonts;
    protected $fontPaths;

    public function __construct($lang = 'en')
    {
        $this->pdf = new TCPDF();
        $this->lang = $lang;
        $this->fontPaths = [
            'hi' => storage_path('fonts/Lohit-Devanagari.ttf'),
            'gu' => storage_path('fonts/Lohit-Gujarati.ttf'),
        ];
        $this->fonts = [
            'en' => 'helvetica',
            'hi' => 'lohit_hi',
            'gu' => 'lohit_gu'
        ];
        
        // Register custom fonts
        $this->registerFonts();
    }

    protected function registerFonts()
    {
        foreach ($this->fontPaths as $lang => $path) {
            $fontName = "lohit_$lang";
            $this->pdf->AddFont($fontName, '', $path, true);
        }
    }

    public function generatePDF(array $data, string $template, array $options = [])
    {
        try {
            $this->initializePDF($options);
            $this->applyTemplate($template, $data);

            if (!empty($options['watermark'])) {
                $this->addWatermark($options['watermark']);
            }

            if (!empty($options['qr'])) {
                $this->addQRCode($options['qr']);
            }

            return $this->pdf->Output('', 'S');
        } catch (Exception $e) {
            throw new Exception("PDF generation failed: " . $e->getMessage());
        }
    }

    protected function initializePDF(array $options)
    {
        $this->pdf->SetCreator('ASA ERP');
        $this->pdf->SetAuthor($options['author'] ?? 'System');
        $this->pdf->SetFont($this->fonts[$this->lang]);

        if (!empty($options['margins'])) {
            $this->pdf->SetMargins(
                $options['margins']['left'] ?? 15,
                $options['margins']['top'] ?? 15,
                $options['margins']['right'] ?? 15
            );
        }
    }

    protected function applyTemplate(string $template, array $data)
    {
        // Add dynamic content based on template and data
        $this->pdf->AddPage();
        $this->pdf->writeHTML($this->parseTemplate($template, $data));
    }

    protected function parseTemplate(string $template, array $data)
    {
        // Replace placeholders with actual data
        foreach ($data as $key => $value) {
            $template = str_replace('{{' . $key . '}}', $value, $template);
        }
        return $template;
    }

    protected function addWatermark(string $text)
    {
        // Implement watermark logic
        $this->pdf->SetAlpha(0.2);
        $this->pdf->Rotate(45);
        $this->pdf->Text(60, 60, $text);
        $this->pdf->Rotate(0);
        $this->pdf->SetAlpha(1);
    }

    protected function addQRCode(string $data)
    {
        // Implement QR code generation
        $style = [
            'border' => 2,
            'vpadding' => 'auto',
            'hpadding' => 'auto',
            'fgcolor' => [0, 0, 0],
            'bgcolor' => [255, 255, 255]
        ];

        $this->pdf->write2DBarcode($data, 'QRCODE,H', 15, 15, 30, 30, $style);
    }
}