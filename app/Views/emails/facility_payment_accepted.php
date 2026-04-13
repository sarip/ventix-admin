<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Fasilitas Dikonfirmasi – Venntix</title>
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

        .booking-confirmed {
            background: #ecfdf5;
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 20px 24px;
            margin: 20px 0;
        }

        .booking-confirmed .code {
            font-size: 20px;
            font-weight: 700;
            color: #059669;
            letter-spacing: 1px;
            margin-bottom: 8px;
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

        .detail-item.highlight .value {
            color: #059669;
        }

        .total-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #ecfdf5;
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
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h1>Booking Dikonfirmasi! 🏢✅</h1>
                <p>Fasilitas telah berhasil dipesan untuk Anda</p>
            </div>

            <!-- Body -->
            <div class="card-body">
                <p class="greeting">Selamat,
                    <?= esc($user->name) ?>! 🎉
                </p>
                <p>Pembayaran Anda telah diverifikasi dan booking fasilitas Anda telah <strong>dikonfirmasi</strong>.
                    Berikut detail booking Anda.</p>

                <div class="booking-confirmed">
                    <div class="code">
                        <?= esc($booking->facility_code) ?>
                    </div>
                    <div style="font-size:13px;color:#059669;font-weight:600">✓ Status: Confirmed</div>
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
                        <div class="label">Jam Mulai</div>
                        <div class="value">
                            <?= esc(substr($booking->start_time ?? '-', 0, 5)) ?> WIB
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="label">Jam Selesai</div>
                        <div class="value">
                            <?= esc(substr($booking->end_time ?? '-', 0, 5)) ?> WIB
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="label">Durasi</div>
                        <div class="value">
                            <?= esc($booking->total_hours ?? '-') ?> Jam
                        </div>
                    </div>
                    <div class="detail-item highlight">
                        <div class="label">Status</div>
                        <div class="value">Confirmed ✓</div>
                    </div>
                </div>

                <div class="total-box">
                    <span class="label">Total Dibayarkan</span>
                    <span class="amount">Rp
                        <?= number_format($booking->total_price, 0, ',', '.') ?>
                    </span>
                </div>

                <div class="info-box">
                    📋 &nbsp;Tunjukkan kode booking <strong>
                        <?= esc($booking->facility_code) ?>
                    </strong> kepada petugas saat tiba di lokasi. Simpan email ini sebagai bukti konfirmasi.
                </div>

                <hr class="divider">
                <p style="font-size:14px;color:#6b7280">
                    Jika ada pertanyaan mengenai fasilitas, silakan hubungi tim Venntix atau pengelola fasilitas.
                </p>
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