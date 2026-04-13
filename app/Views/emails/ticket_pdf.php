<!DOCTYPE html>
<html>
<head>
    <style>
        @page {
            margin: 0;
            size: 180mm 260mm;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            background: #ffffff;
        }

        .container {
            width: 100%;
        }

        .ticket-card {
            border: 2px solid #333;
            border-radius: 10px;
            overflow: hidden;
        }

        /* HEADER */
        .header {
            background-color: #667eea;
            color: white;
            text-align: center;
            padding: 20px;
        }

        .title {
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 2px;
        }

        .ticket-code {
            margin-top: 10px;
            font-family: monospace;
            background: rgba(255,255,255,0.3);
            display: inline-block;
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 14px;
        }

        /* BODY */
        .body {
            padding: 20px;
        }

        .col-left {
            width: 65%;
            display: inline-block;
            vertical-align: top;
        }

        .col-right {
            width: 34%;
            display: inline-block;
            text-align: center;
        }

        .section {
            margin-bottom: 15px;
        }

        .section-title {
            font-size: 11px;
            font-weight: bold;
            color: #666;
            border-bottom: 1px solid #eee;
            margin-bottom: 6px;
            padding-bottom: 3px;
            text-transform: uppercase;
        }

        .item {
            font-size: 12px;
            margin-bottom: 5px;
        }

        .label {
            font-weight: bold;
            display: inline-block;
            width: 90px;
            color: #555;
        }

        /* STATUS */
        .status {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: bold;
        }

        .status-valid {
            background: #d4edda;
            color: #155724;
        }

        .status-used {
            background: #d1ecf1;
            color: #0c5460;
        }

        /* QR */
        .qr-box {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 6px;
        }

        .qr-box img {
            width: 120px;
            height: 120px;
        }

        .qr-text {
            font-size: 10px;
            color: #777;
        }

        /* SPONSOR */
        .sponsors {
            border-top: 2px dashed #ddd;
            padding: 15px;
            text-align: center;
        }

        .sponsor-title {
            font-size: 11px;
            font-weight: bold;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .sponsor-table {
            width: 100%;
        }

        .sponsor-table td {
            text-align: center;
            padding: 5px;
        }

        .sponsor-table img {
            max-height: 40px;
            max-width: 100px;
        }

        /* FOOTER */
        .footer {
            background: #f8f9fa;
            padding: 10px;
            border-top: 2px dashed #ccc;
            text-align: center;
            font-size: 10px;
            color: #666;
        }

        /* TEAR LINE */
        .tear {
            border-top: 2px dashed #ccc;
            margin: 15px 0;
        }

        /* STUB */
        .stub {
            border: 1px solid #ddd;
            padding: 10px;
            background: #fafafa;
        }

        .stub-left {
            display: inline-block;
            width: 20%;
        }

        .stub-right {
            display: inline-block;
            width: 75%;
            vertical-align: top;
        }

        .stub img {
            width: 70px;
        }

        .stub-code {
            font-family: monospace;
            font-size: 12px;
            color: #666;
        }

        .stub-name {
            font-size: 11px;
            color: #888;
        }

        .stub-sponsor img {
            max-height: 20px;
            margin-right: 5px;
        }

    </style>
</head>

<body>

<div class="container">

    <div class="ticket-card">

        <!-- HEADER -->
        <div class="header">
            <div class="title">EVENT TICKET</div>
            <div class="ticket-code">
                <?= $ticket->ticket_code ?>
            </div>
        </div>

        <!-- BODY -->
        <div class="body">

            <div class="col-left">

                <div class="section">
                    <div class="section-title">Event Details</div>
                    <div class="item"><span class="label">Event:</span> <?= $ticket->ticket_type ?> <?= $ticket->event_name ?></div>
                    <div class="item"><span class="label">Category:</span> <?= $ticket->event_category ?></div>
                </div>

                <div class="section">
                    <div class="section-title">Attendee Information</div>
                    <div class="item"><span class="label">Name:</span> <?= $user->name ?></div>
                    <div class="item"><span class="label">Email:</span> <?= $user->email ?></div>
                </div>

                <div class="section">
                    <div class="section-title">Ticket Info</div>
                    <div class="item">
                        <span class="label">Status:</span>
                        <span class="status status-valid"><?= strtoupper($ticket->status ?? 'VALID') ?></span>
                    </div>
                    <div class="item">
                        <span class="label">Date:</span>
                        <?= $ticket->event_date ? date('d M Y', strtotime($ticket->event_date)) : '-' ?>
                    </div>
                </div>

            </div>

            <div class="col-right">
                <div class="qr-box">
                    <img src="<?= $qr_data_uri ?>" />
                    <div class="qr-text">Scan this code at the venue</div>
                </div>
            </div>

        </div>

        <!-- SPONSOR -->
        <?php if (!empty($sponsors)) : ?>
            <div class="sponsors">
                <div class="sponsor-title">Sponsored By</div>
                <table class="sponsor-table">
                    <tr>
                        <?php foreach ($sponsors as $sp) : ?>
                            <td>
                                <img src="<?= $sp['base64'] ?>" />
                            </td>
                        <?php endforeach; ?>
                    </tr>
                </table>
            </div>
        <?php endif; ?>

        <!-- FOOTER -->
        <div class="footer">
            Please bring a valid ID • This ticket is non-transferable • Arrive 30 minutes early
        </div>

    </div>

    <!-- TEAR -->
    <div class="tear"></div>

    <!-- STUB -->
    <div class="stub">

        <div class="stub-left">
            <img src="<?= $qr_data_uri ?>" />
        </div>

        <div class="stub-right">
            <strong><?= $ticket->event_name ?></strong><br>
            <div class="stub-code"><?= $ticket->ticket_code ?></div>
            <div class="stub-name"><?= $user->name ?></div>

            <?php if (!empty($sponsors)) : ?>
                <div class="stub-sponsor">
                    <?php foreach ($sponsors as $sp) : ?>
                        <img src="<?= $sp['base64'] ?>" />
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

        </div>

    </div>

</div>

</body>
</html>