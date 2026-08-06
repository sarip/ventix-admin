<?php

namespace App\Controllers\Api;

use App\Models\UserTicket;
use App\Models\EventTicket;
use App\Models\EventTicketCheckin;
use App\Models\Event;
use App\Models\User;

class CheckinController extends ApiController
{
    /**
     * API 1 - Generate Ticket QR Token
     * GET /api/v1/tickets/{id}/qr
     */
    public function generateQr($id)
    {
        $userTicketModel = new UserTicket();
        $ticket = $userTicketModel->find($id);

        if (!$ticket) {
            return $this->errorOutput('Ticket tidak ditemukan', 404);
        }

        // Generate persistent token if null
        if (empty($ticket->qr_token)) {
            $qrToken = bin2hex(random_bytes(16)) . '-' . bin2hex(random_bytes(8));
            $userTicketModel->update($id, [
                'qr_token'        => $qrToken,
                'qr_generated_at' => date('Y-m-d H:i:s'),
            ]);
        } else {
            $qrToken = $ticket->qr_token;
        }

        return $this->successOutput([
            'ticket_id' => (int) $ticket->id,
            'qr_token'  => $qrToken,
            'status'    => $ticket->status,
        ]);
    }

    /**
     * API 2 - Scan Ticket Validation Process
     * POST /api/v1/checkin/scan
     */
    public function scan()
    {
        $qrToken  = $this->request->getJsonVar('qr_token') ?? $this->request->getVar('qr_token');
        $eventId  = $this->request->getJsonVar('event_id') ?? $this->request->getVar('event_id');
        $deviceId = $this->request->getJsonVar('device_id') ?? $this->request->getVar('device_id');

        if (empty($qrToken)) {
            return $this->errorOutput('qr_token mandatory', 400);
        }

        $currentUser = $this->request->current_user ?? [];
        $scannedBy   = $currentUser['id'] ?? null;
        $ipAddress   = $this->request->getIPAddress();

        $db                  = \Config\Database::connect();
        $userTicketModel     = new UserTicket();
        $checkinHistoryModel = new EventTicketCheckin();
        $userModel           = new User();

        $db->transStart();

        // Execute raw query with lock for update
        $ticketRow = $db->query(
            "SELECT ut.*, et.event_id, et.name as ticket_name 
             FROM user_tickets ut 
             LEFT JOIN event_ticket et ON et.id = ut.event_ticket_id 
             WHERE (ut.qr_token = ? OR ut.ticket_code = ?) 
             LIMIT 1 FOR UPDATE",
            [$qrToken, $qrToken]
        )->getRow();

        // Rule 1 - Invalid QR / Token not found
        if (!$ticketRow) {
            $checkinHistoryModel->insert([
                'ticket_id'  => 0,
                'event_id'   => (int) ($eventId ?? 0),
                'scan_token' => $qrToken,
                'status'     => 'INVALID',
                'message'    => 'Ticket tidak valid',
                'scanned_by' => $scannedBy,
                'device_id'  => $deviceId,
                'ip_address' => $ipAddress,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
            $db->transComplete();

            return $this->successOutput([
                'status'  => 'INVALID',
                'message' => 'Ticket tidak valid',
            ]);
        }

        // Rule 2 - Duplicate Check-in
        if ($ticketRow->status === 'USED') {
            $checkinHistoryModel->insert([
                'ticket_id'  => $ticketRow->id,
                'event_id'   => $ticketRow->event_id ?? ($eventId ?? 0),
                'scan_token' => $qrToken,
                'status'     => 'ALREADY_CHECKED',
                'message'    => 'Ticket sudah digunakan',
                'scanned_by' => $scannedBy,
                'device_id'  => $deviceId,
                'ip_address' => $ipAddress,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
            $db->transComplete();

            return $this->successOutput([
                'status'  => 'ALREADY_CHECKED',
                'message' => 'Ticket sudah digunakan',
            ]);
        }

        // Rule 3 - Event Validation
        if (!empty($eventId) && (int) $ticketRow->event_id !== (int) $eventId) {
            $checkinHistoryModel->insert([
                'ticket_id'  => $ticketRow->id,
                'event_id'   => (int) $eventId,
                'scan_token' => $qrToken,
                'status'     => 'INVALID',
                'message'    => 'Ticket tidak sesuai event',
                'scanned_by' => $scannedBy,
                'device_id'  => $deviceId,
                'ip_address' => $ipAddress,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
            $db->transComplete();

            return $this->successOutput([
                'status'  => 'INVALID',
                'message' => 'Ticket tidak sesuai event',
            ]);
        }

        // Success Process
        $now = date('Y-m-d H:i:s');
        $userTicketModel->update($ticketRow->id, [
            'status'          => 'USED',
            'check_in_at'     => $now,
            'check_in_by'     => $scannedBy,
            'check_in_device' => $deviceId,
        ]);

        $checkinHistoryModel->insert([
            'ticket_id'  => $ticketRow->id,
            'event_id'   => $ticketRow->event_id,
            'scan_token' => $qrToken,
            'status'     => 'SUCCESS',
            'message'    => 'Check-in berhasil',
            'scanned_by' => $scannedBy,
            'device_id'  => $deviceId,
            'ip_address' => $ipAddress,
            'created_at' => $now,
        ]);

        $db->transComplete();

        // Guest info lookup
        $guestName = $ticketRow->guest_name;
        if (empty($guestName) && !empty($ticketRow->user_id)) {
            $userObj = $userModel->find($ticketRow->user_id);
            $guestName = $userObj->name ?? 'Guest';
        }

        return $this->successOutput([
            'status'      => 'SUCCESS',
            'guest_name'  => $guestName ?? 'Guest',
            'ticket'      => $ticketRow->ticket_name ?? 'Standard',
            'ticket_code' => $ticketRow->ticket_code,
            'check_in_at' => $now,
        ]);
    }

    /**
     * API 3 - Check-in Dashboard Data
     * GET /api/v1/checkin/dashboard
     */
    public function dashboard()
    {
        $eventId = $this->request->getVar('event_id');
        $db      = \Config\Database::connect();

        $builder = $db->table('user_tickets ut')
            ->join('event_ticket et', 'et.id = ut.event_ticket_id', 'left');

        if (!empty($eventId)) {
            $builder->where('et.event_id', $eventId);
        }

        $totalTickets = $builder->countAllResults(false);

        $checkedInBuilder = clone $builder;
        $checkedIn = $checkedInBuilder->where('ut.status', 'USED')->countAllResults();

        $remaining = $totalTickets - $checkedIn;
        $attendanceRate = $totalTickets > 0 ? round(($checkedIn / $totalTickets) * 100, 1) : 0;

        // Recent scan activity table
        $historyBuilder = $db->table('event_ticket_checkins etc')
            ->select('etc.*, ut.ticket_code, ut.guest_name, u.name as user_name, staff.name as staff_name, et.name as ticket_name')
            ->join('user_tickets ut', 'ut.id = etc.ticket_id', 'left')
            ->join('users u', 'u.id = ut.user_id', 'left')
            ->join('users staff', 'staff.id = etc.scanned_by', 'left')
            ->join('event_ticket et', 'et.id = ut.event_ticket_id', 'left')
            ->orderBy('etc.created_at', 'DESC')
            ->limit(20);

        if (!empty($eventId)) {
            $historyBuilder->where('etc.event_id', $eventId);
        }

        $recentHistory = $historyBuilder->get()->getResult();

        return $this->successOutput([
            'total_tickets'   => $totalTickets,
            'checked_in'      => $checkedIn,
            'remaining'       => $remaining,
            'attendance_rate' => $attendanceRate,
            'recent_history'  => $recentHistory,
        ]);
    }
}
