<?php

/**
 * Email Notification Service
 * Sends transactional emails for Order and Facility Booking events.
 *
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2026-04-08
 */

namespace App\Libraries;

use App\Models\EventsSponsor;
use App\Models\EventTicket;
use App\Models\Event;
use Dompdf\Dompdf;
use Dompdf\Options;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelLow;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Logo\Logo;
use Endroid\QrCode\RoundBlockSizeMode\RoundBlockSizeModeMargin;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Writer\SvgWriter;


class EmailNotificationService
{
    /** @var \CodeIgniter\Email\Email */
    protected $mailer;

    /** From address */
    protected string $fromEmail;

    /** From name */
    protected string $fromName;

    public function __construct()
    {
        $this->mailer = \Config\Services::email();
        $this->fromEmail = env('MAIL_FROM_ADDRESS', 'veentixindo@gmail.com');
        $this->fromName = env('MAIL_FROM_NAME', 'Veentix');
    }

    // =========================================================================
    // ORDER NOTIFICATIONS
    // =========================================================================

    /**
     * Email: Order berhasil dibuat (buyer).
     *
     * @param object $order   Order object (order_code, total_amount, payment_method, user_id, created_at)
     * @param object $user    User object (name, email)
     * @param array  $items   Array of OrderItem objects with event_ticket and event relations
     */
    public function sendOrderCreated(object $order, object $user, array $items = []): bool
    {
        // Enrich items with relations if not already present
        $enrichedItems = $this->enrichOrderItems($items);

        $html = view('emails/order_created', [
            'user' => $user,
            'order' => $order,
            'items' => $enrichedItems,
        ]);

        return $this->send(
            $user->email,
            "Pesanan Baru #{$order->order_code} – Veentix",
            $html,
            "sendOrderCreated"
        );
    }

    /**
     * Email: Pembayaran telah dikirim / menunggu verifikasi.
     *
     * @param object $order   Order object
     * @param object $user    User object
     */
    public function sendOrderPaymentSubmitted(object $order, object $user): bool
    {
        $html = view('emails/order_payment_submitted', [
            'user' => $user,
            'order' => $order,
        ]);

        return $this->send(
            $user->email,
            "Pembayaran Sedang Diverifikasi – #{$order->order_code}",
            $html,
            "sendOrderPaymentSubmitted"
        );
    }

    /**
     * Email: Pembayaran dikonfirmasi + tiket.
     *
     * @param object $order   Order object
     * @param object $user    User object
     * @param string $template
     * @param array  $tickets Array of UserTicket objects (ticket_code, status, event_name, ticket_type, event_date)
     */
    public function sendOrderPaymentAccepted(object $order, object $user, array $tickets = [], $template = 'order_payment_accepted'): bool
    {
        // Enrich tickets with event / ticket type names
        $enrichedTickets = $this->enrichUserTickets($tickets);

        $html = view('emails/'.$template, [
            'user' => $user,
            'order' => $order,
            'tickets' => $enrichedTickets,
        ]);

        $this->mailer->clear(true);
        $this->mailer->setFrom($this->fromEmail, $this->fromName);
        $this->mailer->setTo($user->email);
        if($template === 'order_payment_accepted') {
            $this->mailer->setSubject("Pembayaran Dikonfirmasi – Tiket #{$order->order_code} Siap!");
        }else{
            $this->mailer->setSubject("Order Dikonfirmasi – Tiket #{$order->order_code} Siap!");
        }
        $this->mailer->setMessage($html);

        // Generate and attach PDF for each ticket
        foreach ($enrichedTickets as $ticket) {
            try {
                $pdfContent = $this->generateTicketPdf($ticket, $user);

                if ($pdfContent) {
//                    log_message('debug', "[PDF OK] {$pdfFilePath}");
//                    $this->mailer->attach($pdfFilePath, "Ticket-{$ticket->ticket_code}.pdf", 'application/pdf', 'attachment');
//                    $pdfContent = file_get_contents($pdfFilePath);
                    $this->mailer->attach(
                        $pdfContent,
                        'attachment',
                        "Ticket-{$ticket->ticket_code}.pdf",
                        'application/pdf'
                    );
                } else {
                    log_message('error', "[EmailNotification] PDF file not created for ticket {$ticket->ticket_code}");
                }
            } catch (\Throwable $e) {
                log_message('error', "[EmailNotification] Failed to generate/attach PDF for ticket {$ticket->ticket_code}: " . $e->getMessage());
                log_message('error', $e->getTraceAsString());
            }
        }

        if ($this->mailer->send()) {
            log_message('info', "[EmailNotification:sendOrderPaymentAccepted] Sent to {$user->email} with attachments");
            return true;
        }

        log_message('error', "[EmailNotification:sendOrderPaymentAccepted] Failed to {$user->email}: " . $this->mailer->printDebugger(['headers']));
        return false;
    }

    /**
     * Generate Ticket PDF and return file path.
     */
    protected function generateTicketPdf($ticket, $user): string
    {
        // 1. Generate QR Code Data URI (Using SvgWriter to avoid GD dependency)
        ob_start();

        $writer = new SvgWriter();
        $qrCode = QrCode::create($ticket->ticket_code)
            ->setEncoding(new Encoding('UTF-8'))
            ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
            ->setSize(200) ->setMargin(10)
            ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin())
            ->setForegroundColor(new Color(0, 0, 0))
            ->setBackgroundColor(new Color(255, 255, 255));
        $result = $writer->write($qrCode);
        $qrDataUri = $result->getDataUri();
        // 2. Render PDF HTML

        $Sponsor = new EventsSponsor();
        $sponsorData = $Sponsor->where('events_id', $ticket->event_id)->findAll();


        $sponsors = [];
        foreach ($sponsorData as $sponsor) {
            $path = FCPATH . 'uploads/sponsor/' . $sponsor->logo_url;

            if (!empty($sponsor->logo_url) && file_exists($path)) {
                $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));

                // whitelist type (biar aman)
                $mimeTypes = [
                    'jpg'  => 'image/jpeg',
                    'jpeg' => 'image/jpeg',
                    'png'  => 'image/png',
                    'gif'  => 'image/gif',
                    'webp' => 'image/webp'
                ];

                if (isset($mimeTypes[$ext])) {
                    $data = base64_encode(file_get_contents($path));

                    $sponsors[] = [
                        'base64' => 'data:' . $mimeTypes[$ext] . ';base64,' . $data
                    ];
                }
            }
        }


        $html = view('emails/ticket_pdf', [
            'ticket' => $ticket,
            'sponsors' => $sponsors,
            'user' => $user,
            'qr_data_uri' => $qrDataUri
        ]);

        // 3. Generate PDF using Dompdf
        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'Arial');
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);

        $dompdf = new Dompdf($options);
        // 100mm x 200mm in pts (1mm = 2.8346 pts)
        $dompdf->setPaper([0, 0, 283.46, 566.93], 'portrait');


        if (ob_get_length()) {
            ob_end_clean();
        }

        $dompdf->loadHtml($html);
        $dompdf->render();
        return $dompdf->output();
    }

    // =========================================================================
    // FACILITY BOOKING NOTIFICATIONS
    // =========================================================================

    /**
     * Email: Booking fasilitas berhasil dibuat.
     *
     * @param object $booking  FacilityBooking object
     * @param object $user     User object
     * @param object $facility Facilitie object (name)
     */
    public function sendFacilityBookingCreated(object $booking, object $user, object $facility): bool
    {
        $html = view('emails/facility_booking_created', [
            'user' => $user,
            'booking' => $booking,
            'facility' => $facility,
        ]);

        return $this->send(
            $user->email,
            "Booking Fasilitas #{$booking->facility_code} – Veentix",
            $html,
            "sendFacilityBookingCreated"
        );
    }

    /**
     * Email: Pembayaran fasilitas dikirim / menunggu verifikasi.
     *
     * @param object $booking  FacilityBooking object
     * @param object $user     User object
     * @param object $facility Facilitie object
     */
    public function sendFacilityPaymentSubmitted(object $booking, object $user, object $facility): bool
    {
        $html = view('emails/facility_payment_submitted', [
            'user' => $user,
            'booking' => $booking,
            'facility' => $facility,
        ]);

        return $this->send(
            $user->email,
            "Pembayaran Fasilitas Sedang Diverifikasi – #{$booking->facility_code}",
            $html,
            "sendFacilityPaymentSubmitted"
        );
    }

    /**
     * Email: Booking fasilitas dikonfirmasi.
     *
     * @param object $booking  FacilityBooking object
     * @param object $user     User object
     * @param object $facility Facilitie object
     */
    public function sendFacilityPaymentAccepted(object $booking, object $user, object $facility): bool
    {
        $html = view('emails/facility_payment_accepted', [
            'user' => $user,
            'booking' => $booking,
            'facility' => $facility,
        ]);

        return $this->send(
            $user->email,
            "Booking Fasilitas Dikonfirmasi – #{$booking->facility_code}",
            $html,
            "sendFacilityPaymentAccepted"
        );
    }

    // =========================================================================
    // INTERNAL
    // =========================================================================

    /**
     * Send email via CI4 email service.
     */
    protected function send(string $toEmail, string $subject, string $html, string $context = ''): bool
    {
        try {
            $this->mailer->clear(true); // reset previous state
            $this->mailer->setFrom($this->fromEmail, $this->fromName);
            $this->mailer->setTo($toEmail);
            $this->mailer->setSubject($subject);
            $this->mailer->setMessage($html);



            if ($this->mailer->send()) {
                log_message('info', "[EmailNotification:{$context}] Sent to {$toEmail}");
                return true;
            }

            log_message('error', "[EmailNotification:{$context}] Failed to {$toEmail}: " . $this->mailer->printDebugger(['headers']));
            return false;

        } catch (\Throwable $e) {
            log_message('error', "[EmailNotification:{$context}] Exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Enrich order items with event_ticket and event relations.
     */
    protected function enrichOrderItems(array $items): array
    {
        foreach ($items as &$item) {
            if (empty($item->event_ticket) && !empty($item->event_ticket_id)) {
                $et = (new EventTicket())->find($item->event_ticket_id);
                if ($et) {
                    if (empty($et->event) && !empty($et->event_id)) {
                        $et->event = (new Event())->find($et->event_id);
                    }
                    $item->event_ticket = $et;
                }
            }
        }
        unset($item);
        return $items;
    }

    /**
     * Enrich user tickets with event and ticket names for the email view.
     */
    protected function enrichUserTickets(array $tickets): array
    {
        foreach ($tickets as &$ticket) {
            if (empty($ticket->event_name) && !empty($ticket->event_ticket_id)) {
                $et = (new EventTicket())->find($ticket->event_ticket_id);
                if ($et) {
                    $ticket->ticket_type = $et->name ?? 'Regular';
                    if (!empty($et->event_id)) {
                        $ev = (new Event())->find($et->event_id);
                        $ticket->event_name = $ev->name ?? 'Event';
                        $ticket->event_date = $ticket->event_date ?? null;
                    }
                }
            }
        }
        unset($ticket);
        return $tickets;
    }
}
