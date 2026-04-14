<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tiket Anda Siap – Veentix</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: #f0f2f5;
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #374151;
            padding: 40px 16px;
        }

        .wrapper {
            max-width: 600px;
            margin: 0 auto;
        }

        .brand-bar {
            text-align: center;
            margin-bottom: 24px;
        }

        .brand-bar .logo-text {
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #696cff;
        }

        .card {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        }

        .card-header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 48px 40px 40px;
            text-align: center;
        }

        .card-header .icon-circle {
            width: 72px;
            height: 72px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }

        .card-header .icon-circle svg {
            width: 36px;
            height: 36px;
            fill: none;
            stroke: #fff;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .card-header h1 {
            font-size: 24px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 6px;
        }

        .card-header p {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.85);
        }

        .card-body {
            padding: 40px 40px 32px;
        }

        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 16px;
        }

        .card-body p {
            font-size: 15px;
            line-height: 1.7;
            color: #6b7280;
            margin-bottom: 14px;
        }

        .order-box {
            background: #ecfdf5;
            border-left: 4px solid #10b981;
            border-radius: 8px;
            padding: 16px 20px;
            margin: 20px 0;
        }

        .order-box .order-code {
            font-size: 18px;
            font-weight: 700;
            color: #059669;
            letter-spacing: 1px;
        }

        .order-box .order-meta {
            font-size: 13px;
            color: #6b7280;
            margin-top: 4px;
        }

        /* Ticket cards */
        .ticket-list {
            margin: 24px 0;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .ticket-card {
            border: 2px dashed #d1fae5;
            border-radius: 12px;
            overflow: hidden;
        }

        .ticket-card-header {
            background: #059669;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .ticket-card-header .event-name {
            font-size: 14px;
            font-weight: 700;
            color: #fff;
        }

        .ticket-card-header .ticket-type {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
        }

        .ticket-card-body {
            padding: 16px 20px;
            background: #fff;
        }

        .ticket-code-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #9ca3af;
            margin-bottom: 4px;
        }

        .ticket-code {
            font-size: 22px;
            font-weight: 800;
            color: #111827;
            letter-spacing: 3px;
            font-family: 'Courier New', monospace;
        }

        .ticket-meta {
            display: flex;
            gap: 24px;
            margin-top: 12px;
            flex-wrap: wrap;
        }

        .ticket-meta-item {
            font-size: 13px;
            color: #6b7280;
        }

        .ticket-meta-item strong {
            display: block;
            font-size: 12px;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
            font-weight: 600;
        }

        .ticket-card-footer {
            background: #f0fdf4;
            padding: 10px 20px;
            border-top: 1px solid #d1fae5;
            font-size: 12px;
            color: #059669;
        }

        .info-box {
            background: #f5f3ff;
            border-left: 4px solid #696cff;
            border-radius: 8px;
            padding: 14px 18px;
            margin: 20px 0;
            font-size: 14px;
            color: #5b5ea6;
            line-height: 1.6;
        }

        .divider {
            border: none;
            border-top: 1px solid #f3f4f6;
            margin: 24px 0;
        }

        .card-footer {
            background: #f9fafb;
            border-top: 1px solid #f3f4f6;
            padding: 24px 40px;
            text-align: center;
        }

        .card-footer p {
            font-size: 13px;
            color: #9ca3af;
            line-height: 1.6;
        }

        @media (max-width: 480px) {

            .card-header,
            .card-body,
            .card-footer {
                padding-left: 24px;
                padding-right: 24px;
            }

            .ticket-meta {
                gap: 12px;
            }
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="brand-bar">
            <div class="logo-text">Veentix</div>
        </div>
        <div class="card">
            <!-- Header -->
            <div class="card-header">
                <div class="icon-circle">
                    <svg viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h1>Pembayaran Dikonfirmasi! 🎟️</h1>
                <p>Tiket Anda siap digunakan — selamat menikmati event!</p>
            </div>

            <!-- Body -->
            <div class="card-body">
                <p class="greeting">Selamat,
                    <?= esc($user->name) ?>! 🎉
                </p>
                <p>Pembayaran Anda telah berhasil diverifikasi. Berikut adalah tiket-tiket Anda. Tunjukkan kode tiket
                    saat check-in di lokasi event.</p>

                <div class="order-box">
                    <div class="order-code">
                        <?= esc($order->order_code) ?>
                    </div>
                    <div class="order-meta">
                        Metode Pembayaran: <strong>
                            <?= esc($order->payment_method ?? '-') ?>
                        </strong> ·
                        Total: <strong>Rp
                            <?= number_format($order->total_amount, 0, ',', '.') ?>
                        </strong>
                    </div>
                </div>

                <!-- Ticket Cards -->
                <?php if (!empty($tickets)): ?>
                    <div class="ticket-list">
                        <?php foreach ($tickets as $ticket): ?>
                            <div class="ticket-card">
                                <div class="ticket-card-header">
                                    <div>
                                        <div class="event-name">
                                            <?= esc($ticket->event_name ?? 'Event') ?>
                                        </div>
                                        <div class="ticket-type">
                                            <?= esc($ticket->ticket_type ?? 'Regular') ?>
                                        </div>
                                    </div>
                                    <div style="font-size:24px">🎟️</div>
                                </div>
                                <div class="ticket-card-body">
                                    <div class="ticket-code-label">Kode Tiket</div>
                                    <div class="ticket-code">
                                        <?= esc($ticket->ticket_code) ?>
                                    </div>
                                    <div class="ticket-meta">
                                        <div class="ticket-meta-item">
                                            <strong>Status</strong>
                                            <?= esc($ticket->status) ?>
                                        </div>
                                        <?php if (!empty($ticket->event_date)): ?>
                                            <div class="ticket-meta-item">
                                                <strong>Tanggal Event</strong>
                                                <?= date('d M Y', strtotime($ticket->event_date)) ?>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                <div class="ticket-card-footer">
                                    ✓ &nbsp;Tunjukkan kode ini saat check-in. Satu kode hanya untuk satu orang.
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>

                <div class="info-box">
                    📱 &nbsp;Simpan email ini atau screenshot kode tiket Anda. Anda mungkin juga dapat melihat tiket
                    melalui aplikasi atau website Veentix.
                </div>

                <hr class="divider">
                <p style="font-size:13px;color:#9ca3af">
                    Jika ada pertanyaan, hubungi panitia event atau support Veentix.
                </p>
            </div>

            <!-- Footer -->
            <div class="card-footer">
                <p>
                    &copy;
                    <?= date('Y') ?> Veentix. All rights reserved.<br>
                    Ini adalah email otomatis, jangan balas email ini.
                </p>
            </div>
        </div>
    </div>
</body>

</html>