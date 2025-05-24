
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
        
        if (!empty($options['language'])) {
            $html = $this->setFonts($html, $options['language']);
        }
        
        if (!empty($options['watermark'])) {
            $html = $this->addWatermark($html, $options['watermark']);
        }
        
        if (!empty($options['qr'])) {
            $qrCode = QrCode::size(100)->generate($options['qr']);
            $html = $this->embedQR($html, $qrCode);
        }

        $pdf = PDF::loadHTML($html);
        $pdf->setPaper('a4');
        $pdf->setWarnings(false);
        
        // Configure PDF options based on language
        if (!empty($options['language'])) {
            $this->configurePDFLanguage($pdf, $options['language']);
        }
        
        return $pdf;
    }
    
    protected function bindData($template, $data)
    {
        return preg_replace_callback('/{{(.*?)}}/', function($matches) use ($data) {
            $key = trim($matches[1]);
            return $data[$key] ?? '';
        }, $template);
    }

    protected function setFonts($html, $language)
    {
        if (!isset($this->fontPaths[$language])) {
            return $html;
        }

        $fonts = $this->fontPaths[$language];
        $fontStyles = "
            @font-face {
                font-family: 'MainFont';
                src: url({$fonts['regular']}) format('truetype');
            }
            @font-face {
                font-family: 'MainFontBold';
                src: url({$fonts['bold']}) format('truetype');
            }
            body { font-family: 'MainFont', sans-serif; }
        ";

        return str_replace('</head>', "<style>{$fontStyles}</style></head>", $html);
    }

    protected function configurePDFLanguage($pdf, $language)
    {
        $config = [];
        if (in_array($language, ['gu', 'hi'])) {
            $config['isRemoteEnabled'] = true;
            $config['isPhpEnabled'] = true;
            $config['defaultFont'] = 'MainFont';
        }
        $pdf->setOptions($config);
    }

    protected function getTemplate($templateId)
    {
        // Implement template retrieval from database
        return '';
    }
}
