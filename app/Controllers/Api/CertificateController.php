<?php

namespace App\Controllers\Api;

use App\Libraries\CertificateGeneratorService;
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

        return $this->successOutput(['data' => $certificates]);
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
            LEFT JOIN event_ticket_checkins etc ON etc.ticket_id = ut.id
            LEFT JOIN certificates c ON c.event_id = et.event_id AND c.user_id = ut.user_id AND c.ticket_id = ut.id
            WHERE et.event_id = ?
              AND (ut.status = 'USED' OR etc.status = 'SUCCESS')
        ", [$eventId]);

        $participants = $query->getResult();

        foreach ($participants as &$p) {
            $p->download_url = !empty($p->certificate_file) ? base_url($p->certificate_file) : null;
        }

        return $this->successOutput(['data' => $participants]);
    }

    /**
     * POST /api/v1/certificates/generate
     */
    public function generate()
    {
        $eventId = $this->request->getJsonVar('event_id') ?? $this->request->getPost('event_id');
        $userId  = $this->request->getJsonVar('user_id') ?? $this->request->getPost('user_id');
        $templateId = $this->request->getJsonVar('template_id') ?? $this->request->getPost('template_id');
        $forceRegenerate = (bool)($this->request->getJsonVar('force_regenerate') ?? $this->request->getPost('force_regenerate') ?? false);

        if (empty($eventId) || empty($userId)) {
            return $this->errorOutput('event_id and user_id are required', 400);
        }

        // Verify participant eligible
        $db = \Config\Database::connect();
        $eligible = $db->query("
            SELECT ut.id as ticket_id
            FROM user_tickets ut
            JOIN event_ticket et ON et.id = ut.event_ticket_id
            LEFT JOIN event_ticket_checkins etc ON etc.ticket_id = ut.id
            WHERE et.event_id = ? AND ut.user_id = ?
              AND (ut.status = 'USED' OR etc.status = 'SUCCESS')
            LIMIT 1
        ", [$eventId, $userId])->getRow();

        if (!$eligible) {
            return $this->errorOutput('Participant has not attended the event. Certificate cannot be generated.', 400);
        }

        try {
            $service = new CertificateGeneratorService();
            $certificate = $service->generate((int)$eventId, (int)$userId, (int)$eligible->ticket_id, $templateId ? (int)$templateId : null, $forceRegenerate);

            return $this->successOutput([
                'status'          => 'SUCCESS',
                'certificate_id'  => $certificate->id,
                'certificate_number' => $certificate->certificate_number,
                'download_url'    => base_url($certificate->certificate_file),
            ]);
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
        $forceRegenerate = (bool)($this->request->getJsonVar('force_regenerate') ?? $this->request->getPost('force_regenerate') ?? false);

        if (empty($eventId)) {
            return $this->errorOutput('event_id is required', 400);
        }

        $db = \Config\Database::connect();
        $participants = $db->query("
            SELECT DISTINCT ut.id as ticket_id, ut.user_id
            FROM user_tickets ut
            JOIN event_ticket et ON et.id = ut.event_ticket_id
            LEFT JOIN event_ticket_checkins etc ON etc.ticket_id = ut.id
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
                $service->generate((int)$eventId, (int)$p->user_id, (int)$p->ticket_id, $templateId ? (int)$templateId : null, $forceRegenerate);
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

        $result = $this->sendCertificate($cert, $channel);

        if ($result['success']) {
            return $this->successOutput(['status' => 'SUCCESS']);
        }
        return $this->errorOutput($result['message'], $result['http_code'] ?? 500);
    }

    /**
     * POST /api/v1/certificates/send-bulk
     * Body: { certificate_ids: number[], channel: 'EMAIL' | 'WHATSAPP' }
     */
    public function sendBulk()
    {
        $channel = strtoupper($this->request->getJsonVar('channel') ?? $this->request->getPost('channel') ?? '');
        $certificateIds = $this->request->getJsonVar('certificate_ids') ?? $this->request->getPost('certificate_ids') ?? [];

        if (!in_array($channel, ['EMAIL', 'WHATSAPP'])) {
            return $this->errorOutput('Invalid channel. Use EMAIL or WHATSAPP.', 400);
        }
        if (empty($certificateIds) || !is_array($certificateIds)) {
            return $this->errorOutput('certificate_ids is required and must be a non-empty array', 400);
        }

        $certModel = new Certificate();
        $results = [];
        $successCount = 0;

        foreach ($certificateIds as $certId) {
            $cert = $certModel->find((int)$certId);
            if (!$cert) {
                $results[] = ['certificate_id' => $certId, 'success' => false, 'message' => 'Certificate not found'];
                continue;
            }

            $result = $this->sendCertificate($cert, $channel);
            $results[] = ['certificate_id' => $certId, 'success' => $result['success'], 'message' => $result['message']];
            if ($result['success']) {
                $successCount++;
            }
        }

        return $this->successOutput([
            'sent_count'   => $successCount,
            'total'        => count($certificateIds),
            'results'      => $results,
        ], "Bulk send completed: {$successCount}/" . count($certificateIds) . ' successful');
    }

    /**
     * Send a single certificate via the given channel, logging the attempt and updating
     * the certificate status. Shared by send() and sendBulk() so both stay in sync.
     */
    private function sendCertificate(object $cert, string $channel): array
    {
        $user  = (new User())->find($cert->user_id);
        $event = (new Event())->find($cert->event_id);

        if (!$user) {
            return ['success' => false, 'message' => 'Recipient user info not found', 'http_code' => 404];
        }

        $certModel = new Certificate();
        $logModel  = new CertificateLog();
        $fileUrl   = base_url($cert->certificate_file);
        $filePath  = FCPATH . $cert->certificate_file;

        if ($channel === 'WHATSAPP') {
            // WhatsApp has no email-like server-side API without a paid gateway (none configured
            // yet). Actual delivery happens client-side: the frontend opens a wa.me deep link in
            // the admin's browser with the message pre-filled, and the admin presses Send in
            // WhatsApp. This just records that the send was initiated.
            $logModel->insert([
                'certificate_id' => $cert->id,
                'channel'        => 'WHATSAPP',
                'status'         => 'SUCCESS',
                'message'        => 'WhatsApp send initiated via wa.me',
                'created_at'     => date('Y-m-d H:i:s'),
            ]);
            $certModel->update($cert->id, ['status' => 'SENT', 'sent_at' => date('Y-m-d H:i:s')]);
            return ['success' => true, 'message' => 'WhatsApp opened successfully'];
        }

        // EMAIL
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
            // Passing $mime here makes CodeIgniter's Email::attach() treat $filePath as
            // already-in-memory file content instead of a path to read - it base64-encodes
            // the path string itself, producing a corrupt, unopenable attachment. Leaving
            // $mime empty makes it read the real file from disk and auto-detect the mime type.
            $mailer->attach($filePath, 'attachment', "Certificate-{$cert->certificate_number}.pdf");
        }

        if ($mailer->send()) {
            $logModel->insert([
                'certificate_id' => $cert->id,
                'channel'        => 'EMAIL',
                'status'         => 'SUCCESS',
                'message'        => 'Email sent successfully with PDF attachment',
                'created_at'     => date('Y-m-d H:i:s'),
            ]);
            $certModel->update($cert->id, ['status' => 'SENT', 'sent_at' => date('Y-m-d H:i:s')]);
            return ['success' => true, 'message' => 'Email sent successfully'];
        }

        $logModel->insert([
            'certificate_id' => $cert->id,
            'channel'        => 'EMAIL',
            'status'         => 'FAILED',
            'message'        => 'Email failed: ' . $mailer->printDebugger(['headers']),
            'created_at'     => date('Y-m-d H:i:s'),
        ]);
        return ['success' => false, 'message' => 'Failed to send Email notification'];
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
