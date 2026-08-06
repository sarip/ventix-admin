<?php

namespace App\Libraries;

class WhatsAppNotificationService
{
    /**
     * Send WhatsApp Message (Dummy / Integrated Vendor endpoint)
     */
    public function sendMessage(string $phone, string $message, ?string $attachmentUrl = null): bool
    {
        // Sanitize phone
        $phone = preg_replace('/[^0-9]/', '', $phone);
        if (substr($phone, 0, 1) === '0') {
            $phone = '62' . substr($phone, 1);
        }

        $apiUrl = env('WHATSAPP_API_URL');
        $apiKey = env('WHATSAPP_API_KEY');

        if ($apiUrl && $apiKey) {
            try {
                $client = \Config\Services::curlrequest();
                $response = $client->post($apiUrl, [
                    'headers' => [
                        'Authorization' => $apiKey,
                        'Content-Type'  => 'application/json',
                    ],
                    'json' => [
                        'target'  => $phone,
                        'message' => $message,
                        'url'     => $attachmentUrl,
                    ],
                    'http_errors' => false,
                ]);

                if ($response->getStatusCode() === 200) {
                    log_message('info', "[WhatsAppService] Message sent to {$phone}");
                    return true;
                }
                log_message('error', "[WhatsAppService] Failed code {$response->getStatusCode()}: {$response->getBody()}");
                return false;
            } catch (\Throwable $e) {
                log_message('error', "[WhatsAppService] Exception: " . $e->getMessage());
                return false;
            }
        }

        // Mock / Simulation mode if no external WA provider configured
        log_message('info', "[WhatsAppService MOCK] Sent to {$phone}: {$message} | Attachment: {$attachmentUrl}");
        return true;
    }
}
