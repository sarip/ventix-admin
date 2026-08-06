<?php

namespace App\Controllers\Api;

use App\Libraries\CertificateGeneratorService;
use App\Libraries\WhatsAppNotificationService;
use App\Models\Certificate;
use App\Models\CertificateLog;
use App\Models\CertificateTemplate;
use App\Models\Event;
use App\Models\User;
use App\Models\UserTicket;

class CertificateController extends ApiController
{
    /**
     * List certificates
     */
    public function index()
    {
        $certModel = new Certificate();
        $eventId = $this->request->getGet('event_id');
        $userId  = $this->request->getGet('user_id');

        $builder = $certModel->select('certificates.*, events.title as event_title, users.name as user_name, users.email as user_email, users.phone as user_phone')
                             ->join('events', 'events.id = certificates.event_id', 'left')
                             ->join('users', 'users.id = certificates.user_id', 'left');

        if ($eventId) {
            $builder->where('certificates.event_id', $eventId);
        }
        if ($userId) {
            $builder->where('certificates.user_id', $userId);
        }

        $certificates = $builder->orderBy('certificates.id', 'DESC')->findAll();

        foreach ($certificates as &$c) {
            $c->download_url = base_url($c->certificate_file);
        }

        return $this->successOutput($certificates);
    }

    /**
     * List eligible participants (Present / checked-in or USED ticket)
     */
    public function participants($eventId)
    {
        $db = \Config\Database::connect();
        
        $query = $db->query("
            SELECT DISTINCT 
                ut.id as ticket_id,
                ut.user_id,
                u.name as user_name,
                u.email as user_email,
                u.phone as user_phone,
                ut.status as ticket_status,
                ut.check_in_at,
                c.id as certificate_id,
                c.certificate_number,
                c.certificate_file,
                c.status as certificate_status
            FROM user_tickets ut
            JOIN event_ticket et ON et.id = ut.event_ticket_id
            JOIN users u ON u.id = ut.user_id
            LEFT JOIN event_ticket_checkins etc ON etc.user_ticket_id = ut.id
            LEFT JOIN certificates c ON c.event_id = et.event_id AND c.user_id = ut.user_id AND c.ticket_id = ut.id
            WHERE et.event_id = ?
              AND (ut.status = 'USED' OR etc.status = 'SUCCESS')
        ", [$eventId]);

        $participants = $query->getResult();

        foreach ($participants as &$p) {
            $p->download_url = !empty($p->certificate_file) ? base_url($p->certificate_file) : null;
        }

        return $this->successOutput($participants);
    }

    /**
     * POST /api/v1/certificates/generate
     */
    public function generate()
    {
        $eventId = $this->request->getJsonVar('event_id') ?? $this->request->getPost('event_id');
        $userId  = $this->request->getJsonVar('user_id') ?? $this->request->getPost('user_id');
        $templateId = $this->request->getJsonVar('template_id') ?? $this->request->getPost('template_id');

        if (empty($eventId) || empty($userId)) {
            return $this->errorOutput('event_id and user_id are required', 400);
        }

        // Verify participant eligible
        $db = \Config\Database::connect();
        $eligible = $db->query("
            SELECT ut.id as ticket_id
            FROM user_tickets ut
            JOIN event_ticket et ON et.id = ut.event_ticket_id
            LEFT JOIN event_ticket_checkins etc ON etc.user_ticket_id = ut.id
            WHERE et.event_id = ? AND ut.user_id = ?
              AND (ut.status = 'USED' OR etc.status = 'SUCCESS')
            LIMIT 1
        ", [$eventId, $userId])->getRow();

        if (!$eligible) {
            return $this->errorOutput('Participant has not attended the event. Certificate cannot be generated.', 400);
        }

        try {
            $service = new CertificateGeneratorService();
            $certificate = $service->generate((int)$eventId, (int)$userId, (int)$eligible->ticket_id, $templateId ? (int)$templateId : null);

            return $this->successOutput([
                'status'          => 'SUCCESS',
                'certificate_id'  => $certificate->id,
                'certificate_number' => $certificate->certificate_number,
                'download_url'    => base_url($certificate->certificate_file),
            ], 'Certificate generated successfully');
        } catch (\Throwable $e) {
            log_message('error', '[CertificateController:generate] Error: ' . $e->getMessage());
            return $this->errorOutput('Failed to generate certificate: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/v1/certificates/generate-bulk
     */
    public function generateBulk()
    {
        $eventId = $this->request->getJsonVar('event_id') ?? $this->request->getPost('event_id');
        $templateId = $this->request->getJsonVar('template_id') ?? $this->request->getPost('template_id');

        if (empty($eventId)) {
            return $this->errorOutput('event_id is required', 400);
        }

        $db = \Config\Database::connect();
        $participants = $db->query("
            SELECT DISTINCT ut.id as ticket_id, ut.user_id
            FROM user_tickets ut
            JOIN event_ticket et ON et.id = ut.event_ticket_id
            LEFT JOIN event_ticket_checkins etc ON etc.user_ticket_id = ut.id
            WHERE et.event_id = ?
              AND (ut.status = 'USED' OR etc.status = 'SUCCESS')
        ", [$eventId])->getResult();

        if (empty($participants)) {
            return $this->errorOutput('No present participants found for this event.', 404);
        }

        $service = new CertificateGeneratorService();
        $count = 0;
        foreach ($participants as $p) {
            try {
                $service->generate((int)$eventId, (int)$p->user_id, (int)$p->ticket_id, $templateId ? (int)$templateId : null);
                $count++;
            } catch (\Throwable $e) {
                log_message('error', "[CertificateController:generateBulk] Failed for user {$p->user_id}: " . $e->getMessage());
            }
        }

        return $this->successOutput([
            'generated_count' => $count,
            'total_eligible'  => count($participants),
        ], 'Bulk certificate generation completed');
    }

    /**
     * GET /api/v1/certificates/{id}/download
     */
    public function download($id)
    {
        $certModel = new Certificate();
        $cert = $certModel->find($id);

        if (!$cert || empty($cert->certificate_file)) {
            return $this->errorOutput('Certificate file not found', 404);
        }

        $filePath = FCPATH . $cert->certificate_file;
        if (!file_exists($filePath)) {
            return $this->errorOutput('Physical certificate file missing on server', 404);
        }

        // Log audit
        (new CertificateLog())->insert([
            'certificate_id' => $cert->id,
            'channel'        => 'DOWNLOAD',
            'status'         => 'SUCCESS',
            'message'        => 'Certificate PDF downloaded',
            'created_at'     => date('Y-m-d H:i:s'),
        ]);

        return $this->response->download($filePath, null)->inline();
    }

    /**
     * POST /api/v1/certificates/{id}/send
     */
    public function send($id)
    {
        $channel = strtoupper($this->request->getJsonVar('channel') ?? $this->request->getPost('channel') ?? '');

        if (!in_array($channel, ['EMAIL', 'WHATSAPP'])) {
            return $this->errorOutput('Invalid channel. Use EMAIL or WHATSAPP.', 400);
        }

        $certModel = new Certificate();
        $cert = $certModel->find($id);

        if (!$cert) {
            return $this->errorOutput('Certificate not found', 404);
        }

        $user  = (new User())->find($cert->user_id);
        $event = (new Event())->find($cert->event_id);

        if (!$user) {
            return $this->errorOutput('Recipient user info not found', 404);
        }

        $logModel = new CertificateLog();
        $fileUrl  = base_url($cert->certificate_file);
        $filePath = FCPATH . $cert->certificate_file;

        if ($channel === 'WHATSAPP') {
            $waService = new WhatsAppNotificationService();
            $message = "Halo " . ($user->name ?? 'Peserta') . ",\n\nTerima kasih telah mengikuti event " . ($event->title ?? 'kami') . ".\n\nSertifikat digital Anda dapat diakses melalui link berikut:\n" . $fileUrl . "\n\nTerima kasih.";

            $sent = $waService->sendMessage($user->phone ?? '', $message, $fileUrl);

            $logModel->insert([
                'certificate_id' => $cert->id,
                'channel'        => 'WHATSAPP',
                'status'         => $sent ? 'SUCCESS' : 'FAILED',
                'message'        => $sent ? 'WhatsApp sent successfully' : 'Failed to send WhatsApp message',
                'created_at'     => date('Y-m-d H:i:s'),
            ]);

            if ($sent) {
                $certModel->update($id, ['status' => 'SENT', 'sent_at' => date('Y-m-d H:i:s')]);
                return $this->successOutput(['status' => 'SUCCESS'], 'WhatsApp sent successfully');
            }
            return $this->errorOutput('Failed to send WhatsApp notification', 500);
        }

        if ($channel === 'EMAIL') {
            $mailer = \Config\Services::email();
            $mailer->clear(true);
            $mailer->setFrom(env('MAIL_FROM_ADDRESS', 'veentixindo@gmail.com'), env('MAIL_FROM_NAME', 'Veentix'));
            $mailer->setTo($user->email);
            $mailer->setSubject("Sertifikat " . ($event->title ?? 'Event'));

            $html = view('emails/certificate_email', [
                'name'               => $user->name ?? 'Peserta',
                'event_name'         => $event->title ?? 'Event',
                'certificate_number' => $cert->certificate_number,
            ]);

            $mailer->setMessage($html);
            if (file_exists($filePath)) {
                $mailer->attach($filePath, 'attachment', "Certificate-{$cert->certificate_number}.pdf", 'application/pdf');
            }

            if ($mailer->send()) {
                $logModel->insert([
                    'certificate_id' => $cert->id,
                    'channel'        => 'EMAIL',
                    'status'         => 'SUCCESS',
                    'message'        => 'Email sent successfully with PDF attachment',
                    'created_at'     => date('Y-m-d H:i:s'),
                ]);
                $certModel->update($id, ['status' => 'SENT', 'sent_at' => date('Y-m-d H:i:s')]);
                return $this->successOutput(['status' => 'SUCCESS'], 'Email sent successfully');
            }

            $logModel->insert([
                'certificate_id' => $cert->id,
                'channel'        => 'EMAIL',
                'status'         => 'FAILED',
                'message'        => 'Email failed: ' . $mailer->printDebugger(['headers']),
                'created_at'     => date('Y-m-d H:i:s'),
            ]);
            return $this->errorOutput('Failed to send Email notification', 500);
        }
    }

    /**
     * Public verification endpoint
     */
    public function verify($certNumber)
    {
        $certModel = new Certificate();
        $cert = $certModel->select('certificates.*, events.title as event_title, events.start_date, events.end_date, users.name as user_name')
                          ->join('events', 'events.id = certificates.event_id', 'left')
                          ->join('users', 'users.id = certificates.user_id', 'left')
                          ->where('certificates.certificate_number', $certNumber)
                          ->first();

        if (!$cert) {
            return $this->errorOutput('Certificate invalid or not found', 404);
        }

        return $this->successOutput([
            'is_valid'           => true,
            'certificate_number' => $cert->certificate_number,
            'recipient_name'     => $cert->recipient_name ?? $cert->user_name,
            'event_title'        => $cert->event_title,
            'issue_date'         => date('d F Y', strtotime($cert->generated_at ?? $cert->created_at)),
            'download_url'       => base_url($cert->certificate_file),
        ], 'Certificate verification success');
    }
}
