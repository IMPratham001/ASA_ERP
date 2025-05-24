
<?php

namespace App\Services\PDF;

use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;

class TemplateService
{
    protected $fontPaths = [
        'en' => [
            'regular' => 'fonts/Roboto-Regular.ttf',
            'bold' => 'fonts/Roboto-Bold.ttf'
        ],
        'gu' => [
            'regular' => 'fonts/NotoSansGujarati-Regular.ttf',
            'bold' => 'fonts/NotoSansGujarati-Bold.ttf'
        ],
        'hi' => [
            'regular' => 'fonts/NotoSansDevanagari-Regular.ttf',
            'bold' => 'fonts/NotoSansDevanagari-Bold.ttf'
        ]
    ];

    public function generatePDF($templateId, $data, $options = [])
    {
        $template = $this->getTemplate($templateId);
        $html = $this->bindData($template, $data);
        
        // Apply RTL if needed
        if (!empty($options['rtl'])) {
            $html = $this->applyRTL($html);
        }
        
        // Apply language-specific fonts
        if (!empty($options['language'])) {
            $html = $this->setFonts($html, $options['language']);
        }
        
        // Add watermark if specified
        if (!empty($options['watermark'])) {
            $html = $this->addWatermark($html, $options['watermark']);
        }
        
        // Generate QR code if needed
        if (!empty($options['qr'])) {
            $qrCode = QrCode::size(100)
                          ->errorCorrection('H')
                          ->format('svg')
                          ->generate($options['qr']);
            $html = $this->embedQR($html, $qrCode);
        }

        $pdf = PDF::loadHTML($html);
        
        // Configure PDF settings
        $pdf->setPaper($options['paper'] ?? 'a4', $options['orientation'] ?? 'portrait');
        $this->configurePDFOptions($pdf, $options);
        
        return $pdf;
    }

    protected function configurePDFOptions($pdf, $options)
    {
        $config = [
            'isRemoteEnabled' => true,
            'isPhpEnabled' => true,
            'isHtml5ParserEnabled' => true,
            'isFontSubsettingEnabled' => true
        ];
        
        if ($options['language'] ?? false) {
            $config['defaultFont'] = $this->getDefaultFont($options['language']);
        }
        
        $pdf->setOptions($config);
    }

    protected function getDefaultFont($language)
    {
        $fonts = [
            'gu' => 'NotoSansGujarati',
            'hi' => 'NotoSansDevanagari',
            'en' => 'Roboto'
        ];
        
        return $fonts[$language] ?? 'Roboto';
    }

    protected function bindData($template, $data)
    {
        return preg_replace_callback('/{{(.*?)}}/', function($matches) use ($data) {
            $key = trim($matches[1]);
            return $data[$key] ?? '';
        }, $template);
    }

    protected function applyRTL($html)
    {
        return str_replace('<body>', '<body dir="rtl">', $html);
    }

    protected function embedQR($html, $qrCode)
    {
        return str_replace('</body>', $qrCode . '</body>', $html);
    }

    protected function addWatermark($html, $text)
    {
        $watermarkStyle = "
            .watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 72px;
                opacity: 0.2;
                z-index: 1000;
            }
        ";
        
        $watermarkDiv = "<div class='watermark'>$text</div>";
        
        $html = str_replace('</head>', "<style>$watermarkStyle</style></head>", $html);
        $html = str_replace('<body>', "<body>$watermarkDiv", $html);
        
        return $html;
    }
}
