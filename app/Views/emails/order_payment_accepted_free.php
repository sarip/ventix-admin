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

        .logo-text {
            font-size: 26px;
            font-weight: 800;
            color: #696cff;
        }

        .card {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        }

        .card-header {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            padding: 48px 40px;
            text-align: center;
            color: #fff;
        }

        .icon-circle {
            width: 72px;
            height: 72px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }

        .icon-circle svg {
            width: 36px;
            height: 36px;
            stroke: #fff;
            stroke-width: 2;
        }

        .card-header h1 {
            font-size: 24px;
            font-weight: 700;
        }

        .card-header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .card-body {
            padding: 40px;
        }

        .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #111827;
        }

        .card-body p {
            font-size: 15px;
            color: #6b7280;
            line-height: 1.7;
            margin-bottom: 12px;
        }

        .info-box {
            background: #ecfeff;
            border-left: 4px solid #06b6d4;
            padding: 14px 18px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
            color: #0e7490;
        }

        .ticket-list {
            margin-top: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .ticket-card {
            border: 2px dashed #bfdbfe;
            border-radius: 12px;
            overflow: hidden;
        }

        .ticket-card-header {
            background: #2563eb;
            color: #fff;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
        }

        .ticket-card-body {
            padding: 16px 20px;
        }

        .ticket-code {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 3px;
            font-family: monospace;
        }

        .ticket-meta {
            margin-top: 10px;
            font-size: 13px;
            color: #6b7280;
        }

        .ticket-footer {
            background: #eff6ff;
            padding: 10px 20px;
            font-size: 12px;
            color: #1d4ed8;
            border-top: 1px solid #bfdbfe;
        }

        .divider {
            margin: 24px 0;
            border: none;
            border-top: 1px solid #e5e7eb;
        }

        .card-footer {
            text-align: center;
            padding: 24px 40px;
            background: #f9fafb;
            font-size: 13px;
            color: #9ca3af;
        }

        @media (max-width: 480px) {
            .card-header, .card-body, .card-footer {
                padding: 24px;
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

        <!-- HEADER -->
        <div class="card-header">
            <div class="icon-circle">
                <svg viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            <h1>Tiket Anda Siap! 🎉</h1>
            <p>Selamat! Tiket Anda berhasil dikonfirmasi</p>
        </div>

        <!-- BODY -->
        <div class="card-body">

            <p class="greeting">Halo, <?= esc($user->name) ?>! 👋</p>

            <p>Tiket Anda telah berhasil diterbitkan. Silakan gunakan kode tiket berikut saat check-in di lokasi acara.</p>

            <div class="info-box">
                🎟️ Pastikan Anda menyimpan tiket ini dan menunjukkannya saat masuk ke area event.
            </div>

            <?php if (!empty($tickets)): ?>
                <div class="ticket-list">
                    <?php foreach ($tickets as $ticket): ?>
                        <div class="ticket-card">

                            <div class="ticket-card-header">
                                <div>
                                    <div style="font-weight:700">
                                        <?= esc($ticket->event_name ?? 'Event') ?>
                                    </div>
                                    <div style="font-size:12px;opacity:0.9">
                                        <?= esc($ticket->ticket_type ?? 'Ticket') ?>
                                    </div>
                                </div>
                                <div>🎟️</div>
                            </div>

                            <div class="ticket-card-body">
                                <div style="font-size:11px;color:#9ca3af">Kode Tiket</div>
                                <div class="ticket-code">
                                    <?= esc($ticket->ticket_code) ?>
                                </div>

                                <div class="ticket-meta">
                                    Status: <strong><?= esc($ticket->status) ?></strong><br>

                                    <?php if (!empty($ticket->event_date)): ?>
                                        Tanggal Event:
                                        <strong><?= date('d M Y', strtotime($ticket->event_date)) ?></strong>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <div class="ticket-footer">
                                ✔ Gunakan kode ini untuk check-in. 1 tiket hanya berlaku untuk 1 orang.
                            </div>

                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <hr class="divider">

            <p style="font-size:13px;color:#9ca3af">
                Simpan email ini atau screenshot tiket Anda untuk digunakan saat acara.
            </p>

        </div>

        <!-- FOOTER -->
        <div class="card-footer">
            © <?= date('Y') ?> Veentix. Email otomatis, mohon tidak dibalas.
        </div>

    </div>
</div>
</body>

</html>