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
    public function generate(int $eventId, int $userId, int $ticketId, ?int $templateId = null): object
    {
        $db = \Config\Database::connect();
        
        // 1. Check existing certificate (prevent duplicates)
        $certModel = new Certificate();
        $existing = $certModel->where('event_id', $eventId)
                             ->where('user_id', $userId)
                             ->where('ticket_id', $ticketId)
                             ->first();

        if ($existing) {
            return $existing;
        }

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

        // 4. Generate Certificate Number VNTX-{CODE}-{SEQ}
        $certNumber = $this->generateCertificateNumber($event);

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

        $pdfBinary = $this->renderPdf($template, $placeholders, $qrDataUri);
        file_put_contents($absoluteFilePath, $pdfBinary);

        // 8. Save Certificate Record
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
            'created_at'        => date('Y-m-d H:i:s'),
        ];

        $certId = $certModel->insert($certData);
        return $certModel->find($certId);
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
        $writer = new SvgWriter();
        $qrCode = QrCode::create($content)
            ->setEncoding(new Encoding('UTF-8'))
            ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
            ->setSize(150)
            ->setMargin(5)
            ->setForegroundColor(new Color(0, 0, 0))
            ->setBackgroundColor(new Color(255, 255, 255));

        return $writer->write($qrCode)->getDataUri();
    }

    public function renderPdf(?object $template, array $placeholders, string $qrDataUri): string
    {
        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'Helvetica');
        $options->set('isHtml5ParserEnabled', true);

        $dompdf = new Dompdf($options);

        $width = $template->width ?? 3508;
        $height = $template->height ?? 2480;
        $orientation = strtolower($template->orientation ?? 'landscape');
        $bgImage = $template && !empty($template->background_image) ? base_url($template->background_image) : null;
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
