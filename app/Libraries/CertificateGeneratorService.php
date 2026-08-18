<?php

namespace App\Libraries;

use App\Models\Certificate;
use App\Models\CertificateTemplate;
use App\Models\Event;
use App\Models\EventsOrganizer;
use App\Models\User;
use Dompdf\Dompdf;
use Dompdf\Options;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelLow;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\SvgWriter;

class CertificateGeneratorService
{
    /**
     * Generate Certificate for user & event.
     */
    public function generate(int $eventId, int $userId, int $ticketId, ?int $templateId = null, bool $forceRegenerate = false): object
    {
        $db = \Config\Database::connect();
        
        // 1. Check existing certificate
        $certModel = new Certificate();
        $existing = $certModel->where('event_id', $eventId)
                             ->where('user_id', $userId)
                             ->where('ticket_id', $ticketId)
                             ->first();

        if ($existing && !$forceRegenerate) {
            return (object)$existing;
        }

        $existingObj = $existing ? (object)$existing : null;

        // 2. Load Event & User info
        $event = (new Event())->find($eventId);
        $user  = (new User())->find($userId);

        if (!$event || !$user) {
            throw new \RuntimeException("Event or User not found.");
        }

        $eo = null;
        if (!empty($event->events_organizer_id)) {
            $eo = (new EventsOrganizer())->find($event->events_organizer_id);
        }

        // 3. Select Template
        $templateModel = new CertificateTemplate();
        if ($templateId) {
            $template = $templateModel->find($templateId);
        } else {
            $template = $templateModel->where('is_active', 1)->first();
        }

        // 4. Preserve existing certificate number or generate new VNTX-{CODE}-{SEQ}
        $certNumber = $existingObj ? $existingObj->certificate_number : $this->generateCertificateNumber((object)$event);

        // 5. Generate QR Code verification link Data URI
        $verifyUrl = base_url("certificate/verify/{$certNumber}");
        $qrDataUri = $this->generateQrDataUri($verifyUrl);

        // 6. Data mapping for placeholders
        $placeholders = [
            '{{participant_name}}'  => $user->name ?? $user->full_name ?? 'Participant',
            '{{event_name}}'        => $event->title ?? $event->name ?? 'Event',
            '{{event_date}}'        => !empty($event->start_date) ? date('d F Y', strtotime($event->start_date)) : date('d F Y'),
            '{{organizer_name}}'    => $eo->eo_name ?? $eo->company_name ?? 'Organizer',
            '{{certificate_number}}'=> $certNumber,
            '{{certificate_date}}'  => date('d F Y'),
        ];

        // 7. Render PDF
        $fileName = 'certificate_' . strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', $placeholders['{{participant_name}}'])) . '_' . time() . '.pdf';
        $relativeFilePath = 'uploads/certificates/' . $fileName;
        $absoluteFilePath = FCPATH . $relativeFilePath;

        $uploadDir = FCPATH . 'uploads/certificates';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $pdfBinary = $this->renderPdf($template ? (object)$template : null, $placeholders, $qrDataUri);
        file_put_contents($absoluteFilePath, $pdfBinary);

        // 8. Save/Update Certificate Record
        $certData = [
            'event_id'          => $eventId,
            'ticket_id'         => $ticketId,
            'user_id'           => $userId,
            'certificate_number'=> $certNumber,
            'template_id'       => $template ? $template->id : null,
            'recipient_name'    => $placeholders['{{participant_name}}'],
            'certificate_title' => 'Certificate of Participation',
            'certificate_file'  => $relativeFilePath,
            'status'            => 'GENERATED',
            'generated_at'      => date('Y-m-d H:i:s'),
            'updated_at'        => date('Y-m-d H:i:s'),
        ];

        if ($existingObj) {
            $oldPath = FCPATH . ($existingObj->certificate_file ?? '');
            if (!empty($existingObj->certificate_file) && file_exists($oldPath) && $oldPath !== $absoluteFilePath) {
                @unlink($oldPath);
            }
            $certModel->update($existingObj->id, $certData);
            return (object)$certModel->find($existingObj->id);
        } else {
            $certData['created_at'] = date('Y-m-d H:i:s');
            $certId = $certModel->insert($certData);
            return (object)$certModel->find($certId);
        }
    }

    private function generateCertificateNumber(object $event): string
    {
        $cleanTitle = strtoupper(preg_replace('/[^A-Z0-9]/', '', $event->title ?? 'EVENT'));
        $prefixCode = substr($cleanTitle, 0, 4) . date('Y');
        
        $certModel = new Certificate();
        $count = $certModel->where('event_id', $event->id)->countAllResults() + 1;
        
        return sprintf("VNTX-%s-%06d", $prefixCode, $count);
    }

    public function generateQrDataUri(string $content): string
    {
        if (function_exists('iconv')) {
            try {
                $writer = new SvgWriter();
                $qrCode = QrCode::create($content)
                    ->setEncoding(new Encoding('UTF-8'))
                    ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
                    ->setSize(150)
                    ->setMargin(5)
                    ->setForegroundColor(new Color(0, 0, 0))
                    ->setBackgroundColor(new Color(255, 255, 255));

                return $writer->write($qrCode)->getDataUri();
            } catch (\Throwable $e) {
                log_message('warning', '[CertificateGeneratorService] QrCode lib failed: ' . $e->getMessage());
            }
        }

        // Lightweight fallback SVG QR Code generator (or Data URI) when iconv is unavailable
        $qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' . urlencode($content);
        return $qrApiUrl;
    }

    public function renderPdf(?object $template, array $placeholders, string $qrDataUri): string
    {
        $options = new Options();
        $options->set('chroot', [FCPATH, sys_get_temp_dir()]);
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'Helvetica');
        $options->set('isHtml5ParserEnabled', true);

        $dompdf = new Dompdf($options);

        $width = $template->width ?? 3508;
        $height = $template->height ?? 2480;
        $orientation = strtolower($template->orientation ?? 'landscape');

        $bgImage = null;
        if ($template && !empty($template->background_image)) {
            $localPath = FCPATH . ltrim($template->background_image, '/');
            if (file_exists($localPath)) {
                $ext = strtolower(pathinfo($localPath, PATHINFO_EXTENSION));
                // Dompdf triggers GD extension check only when processing PNG files. Convert PNG to JPG without altering image dimensions.
                if ($ext === 'png' && !extension_loaded('gd')) {
                    $jpgPath = sys_get_temp_dir() . '/' . md5($localPath) . '.jpg';
                    if (!file_exists($jpgPath) || filemtime($localPath) > filemtime($jpgPath)) {
                        exec("convert " . escapeshellarg($localPath) . " -quality 100 " . escapeshellarg($jpgPath));
                    }
                    if (file_exists($jpgPath)) {
                        $bgImage = $jpgPath;
                    } else {
                        $bgImage = $localPath;
                    }
                } else {
                    $bgImage = $localPath;
                }
            } else {
                $bgImage = base_url($template->background_image);
            }
        }

        $elements = $template && !empty($template->template_json) ? json_decode($template->template_json, true) : [];

        $html = view('pdf/certificate_pdf', [
            'width'        => $width,
            'height'       => $height,
            'orientation'  => $orientation,
            'bg_image'     => $bgImage,
            'elements'     => $elements,
            'placeholders' => $placeholders,
            'qr_data_uri'  => $qrDataUri,
        ]);

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', $orientation);
        $dompdf->render();

        return $dompdf->output();
    }
}
