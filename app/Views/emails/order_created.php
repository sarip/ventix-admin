<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesanan Baru – Venntix</title>
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
            background: linear-gradient(135deg, #696cff 0%, #9155fd 100%);
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
            color: rgba(255, 255, 255, 0.8);
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
            background: #f5f3ff;
            border-left: 4px solid #696cff;
            border-radius: 8px;
            padding: 16px 20px;
            margin: 20px 0;
        }

        .order-box .order-code {
            font-size: 20px;
            font-weight: 700;
            color: #696cff;
            letter-spacing: 1px;
        }

        .order-box .order-meta {
            font-size: 13px;
            color: #6b7280;
            margin-top: 4px;
        }

        table.items {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        table.items th {
            background: #f9fafb;
            font-size: 12px;
            font-weight: 600;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 10px 12px;
            text-align: left;
            border-bottom: 1px solid #f3f4f6;
        }

        table.items td {
            font-size: 14px;
            color: #374151;
            padding: 10px 12px;
            border-bottom: 1px solid #f3f4f6;
            vertical-align: top;
        }

        table.items tr:last-child td {
            border-bottom: none;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 0 0;
            border-top: 2px solid #e5e7eb;
            margin-top: 8px;
        }

        .total-row .label {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
        }

        .total-row .amount {
            font-size: 20px;
            font-weight: 700;
            color: #696cff;
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
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                </div>
                <h1>Pesanan Baru Diterima 🎉</h1>
                <p>Terima kasih telah memesan tiket di Venntix</p>
            </div>

            <!-- Body -->
            <div class="card-body">
                <p class="greeting">Halo,
                    <?= esc($user->name) ?>! 👋
                </p>
                <p>Pesanan Anda telah berhasil dibuat. Berikut adalah detail pesanan Anda:</p>

                <div class="order-box">
                    <div class="order-code">
                        <?= esc($order->order_code) ?>
                    </div>
                    <div class="order-meta">Kode Pesanan ·
                        <?= date('d M Y, H:i', strtotime($order->created_at ?? 'now')) ?> WIB
                    </div>
                </div>

                <!-- Order Items -->
                <?php if (!empty($items)): ?>
                    <table class="items">
                        <thead>
                            <tr>
                                <th>Tiket / Event</th>
                                <th>Tgl Event</th>
                                <th style="text-align:right">Qty</th>
                                <th style="text-align:right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($items as $item): ?>
                                <tr>
                                    <td>
                                        <strong>
                                            <?= esc($item->event_ticket->name ?? 'Tiket') ?>
                                        </strong><br>
                                        <span style="font-size:12px;color:#9ca3af">
                                            <?= esc($item->event_ticket->event->name ?? '') ?>
                                        </span>
                                    </td>
                                    <td>
                                        <?= $item->event_date ? date('d M Y', strtotime($item->event_date)) : '-' ?>
                                    </td>
                                    <td style="text-align:right">
                                        <?= $item->quantity ?>
                                    </td>
                                    <td style="text-align:right">Rp
                                        <?= number_format($item->subtotal, 0, ',', '.') ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <?php if (!empty($order->total_amount) && $order->total_amount > 0): ?>
                    <div class="total-row">
                        <span class="label">Total Pembayaran</span>
                        <span class="amount">Rp
                            <?= number_format($order->total_amount, 0, ',', '.') ?>
                        </span>
                    </div>
                    <?php endif; ?>
                <?php endif; ?>

                <?php if (!empty($order->total_amount) && $order->total_amount > 0): ?>
                <div class="info-box">
                    ⏳ &nbsp;Pesanan Anda belum dikonfirmasi. Silakan lakukan pembayaran sesuai metode yang dipilih:
                    <strong>
                        <?= esc($order->payment_method ?? '-') ?>
                    </strong>.
                </div>
                <?php endif; ?>

                <hr class="divider">
                <p style="font-size:13px;color:#9ca3af">Jika Anda tidak merasa melakukan pemesanan ini, abaikan email
                    ini atau hubungi support kami.</p>
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