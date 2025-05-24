
<?php

namespace App\Services\PDF;

use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TemplateService
{
    public function generatePDF($templateId, $data, $options = [])
    {
        $template = $this->getTemplate($templateId);
        $html = $this->bindData($template, $data);
        
        if (!empty($options['watermark'])) {
            $html = $this->addWatermark($html, $options['watermark']);
        }
        
        if (!empty($options['qr'])) {
            $qrCode = QrCode::size(100)->generate($options['qr']);
            $html = $this->embedQR($html, $qrCode);
        }
        
        return PDF::loadHTML($html)
            ->setPaper('a4')
            ->setWarnings(false);
    }
    
    protected function bindData($template, $data)
    {
        // Dynamic data binding logic
        return preg_replace_callback('/{{(.*?)}}/', function($matches) use ($data) {
            $key = trim($matches[1]);
            return $data[$key] ?? '';
        }, $template);
    }
}
