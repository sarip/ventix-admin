<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pembayaran Fasilitas Dalam Verifikasi – Veentix</title>
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
            background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
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

        .booking-box {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            border-radius: 8px;
            padding: 16px 20px;
            margin: 20px 0;
        }

        .booking-box .code {
            font-size: 20px;
            font-weight: 700;
            color: #d97706;
            letter-spacing: 1px;
        }

        .booking-box .meta {
            font-size: 13px;
            color: #6b7280;
            margin-top: 4px;
        }

        .status-steps {
            margin: 24px 0;
        }

        .step {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
        }

        .step-dot {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            font-size: 13px;
            font-weight: 700;
        }

        .step-dot.done {
            background: #d1fae5;
            color: #059669;
        }

        .step-dot.active {
            background: #fef3c7;
            color: #d97706;
        }

        .step-dot.pending {
            background: #f3f4f6;
            color: #9ca3af;
        }

        .step-label {
            font-size: 14px;
            color: #374151;
        }

        .step-label.active {
            font-weight: 600;
            color: #111827;
        }

        .step-label.pending {
            color: #9ca3af;
        }

        .amount-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f9fafb;
            border-radius: 10px;
            padding: 16px 20px;
            margin: 20px 0;
        }

        .amount-box .label {
            font-size: 14px;
            color: #6b7280;
        }

        .amount-box .amount {
            font-size: 22px;
            font-weight: 700;
            color: #111827;
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
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                </div>
                <h1>Pembayaran Sedang Diverifikasi ⏳</h1>
                <p>Bukti pembayaran fasilitas telah kami terima</p>
            </div>

            <!-- Body -->
            <div class="card-body">
                <p class="greeting">Halo,
                    <?= esc($user->name) ?>! 👋
                </p>
                <p>Terima kasih! Bukti pembayaran untuk booking fasilitas berikut telah kami terima dan sedang dalam
                    proses verifikasi.</p>

                <div class="booking-box">
                    <div class="code">
                        <?= esc($booking->facility_code) ?>
                    </div>
                    <div class="meta">
                        Fasilitas: <strong>
                            <?= esc($facility->name ?? '-') ?>
                        </strong> ·
                        <?= $booking->booking_date ? date('d M Y', strtotime($booking->booking_date)) : '-' ?>
                        <?= esc(substr($booking->start_time ?? '', 0, 5)) ?>–
                        <?= esc(substr($booking->end_time ?? '', 0, 5)) ?>
                    </div>
                </div>

                <div class="amount-box">
                    <span class="label">Total Pembayaran</span>
                    <span class="amount">Rp
                        <?= number_format($booking->total_price, 0, ',', '.') ?>
                    </span>
                </div>

                <!-- Progress Steps -->
                <div class="status-steps">
                    <div class="step">
                        <div class="step-dot done">✓</div>
                        <span class="step-label">Booking dibuat</span>
                    </div>
                    <div class="step">
                        <div class="step-dot active">2</div>
                        <span class="step-label active">Pembayaran dalam verifikasi</span>
                    </div>
                    <div class="step">
                        <div class="step-dot pending">3</div>
                        <span class="step-label pending">Booking dikonfirmasi</span>
                    </div>
                </div>

                <hr class="divider">
                <p style="font-size:14px;color:#6b7280">
                    Proses verifikasi biasanya memakan waktu <strong>1×24 jam</strong> pada hari kerja. Anda akan
                    mendapat notifikasi setelah booking dikonfirmasi.
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