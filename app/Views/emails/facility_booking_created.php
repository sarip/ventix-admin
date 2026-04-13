<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Fasilitas Berhasil – Venntix</title>
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
            background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
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
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            border-radius: 8px;
            padding: 16px 20px;
            margin: 20px 0;
        }

        .booking-box .booking-code {
            font-size: 20px;
            font-weight: 700;
            color: #1d4ed8;
            letter-spacing: 1px;
        }

        .booking-box .booking-meta {
            font-size: 13px;
            color: #6b7280;
            margin-top: 4px;
        }

        .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 20px 0;
        }

        .detail-item {
            background: #f9fafb;
            border-radius: 8px;
            padding: 14px 16px;
        }

        .detail-item .label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #9ca3af;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .detail-item .value {
            font-size: 15px;
            font-weight: 600;
            color: #111827;
        }

        .total-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #eff6ff;
            border-radius: 10px;
            padding: 16px 20px;
            margin: 20px 0;
        }

        .total-box .label {
            font-size: 14px;
            color: #6b7280;
        }

        .total-box .amount {
            font-size: 22px;
            font-weight: 700;
            color: #1d4ed8;
        }

        .info-box {
            background: #fff7ed;
            border-left: 4px solid #f97316;
            border-radius: 8px;
            padding: 14px 18px;
            margin: 20px 0;
            font-size: 14px;
            color: #92400e;
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

            .detail-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="brand-bar">
            <div class="logo-text">Venntix</div>
        </div>
        <div class="card">
            <!-- Header -->
            <div class="card-header">
                <div class="icon-circle">
                    <svg viewBox="0 0 24 24">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </div>
                <h1>Booking Fasilitas Berhasil 🏢</h1>
                <p>Permintaan pemesanan fasilitas telah diterima</p>
            </div>

            <!-- Body -->
            <div class="card-body">
                <p class="greeting">Halo,
                    <?= esc($user->name) ?>! 👋
                </p>
                <p>Pemesanan fasilitas Anda telah berhasil dibuat. Silakan lakukan pembayaran untuk mengkonfirmasi
                    booking Anda.</p>

                <div class="booking-box">
                    <div class="booking-code">
                        <?= esc($booking->facility_code) ?>
                    </div>
                    <div class="booking-meta">Kode Booking ·
                        <?= date('d M Y, H:i', strtotime($booking->created_at ?? 'now')) ?> WIB
                    </div>
                </div>

                <!-- Detail Grid -->
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="label">Fasilitas</div>
                        <div class="value">
                            <?= esc($facility->name ?? '-') ?>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="label">Tanggal</div>
                        <div class="value">
                            <?= $booking->booking_date ? date('d M Y', strtotime($booking->booking_date)) : '-' ?>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="label">Mulai</div>
                        <div class="value">
                            <?= esc(substr($booking->start_time ?? '-', 0, 5)) ?>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="label">Selesai</div>
                        <div class="value">
                            <?= esc(substr($booking->end_time ?? '-', 0, 5)) ?>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="label">Durasi</div>
                        <div class="value">
                            <?= esc($booking->total_hours ?? '-') ?> Jam
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="label">Status</div>
                        <div class="value" style="color:#f59e0b">
                            <?= esc($booking->status) ?>
                        </div>
                    </div>
                </div>

                <div class="total-box">
                    <span class="label">Total Pembayaran</span>
                    <span class="amount">Rp
                        <?= number_format($booking->total_price, 0, ',', '.') ?>
                    </span>
                </div>

                <div class="info-box">
                    ⏳ &nbsp;Status booking masih <strong>Pending</strong>. Silakan lakukan pembayaran dan upload bukti
                    transfer untuk melanjutkan proses konfirmasi.
                </div>

                <hr class="divider">
                <p style="font-size:13px;color:#9ca3af">Booking akan otomatis dibatalkan jika pembayaran tidak dilakukan
                    dalam 1×24 jam.</p>
            </div>

            <!-- Footer -->
            <div class="card-footer">
                <p>
                    &copy;
                    <?= date('Y') ?> Venntix. All rights reserved.<br>
                    Ini adalah email otomatis, jangan balas email ini.
                </p>
            </div>
        </div>
    </div>
</body>

</html>