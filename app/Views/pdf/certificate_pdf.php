<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Certificate</title>
    <style>
        @page {
            margin: 0;
            size: A4 <?= $orientation ?>;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            position: relative;
            background-color: #ffffff;
        }
        .bg-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        .bg-container img {
            width: 100%;
            height: 100%;
        }
        .certificate-content {
            padding: 50px;
            box-sizing: border-box;
            text-align: center;
        }
        .cert-header {
            margin-top: 40px;
            font-size: 36px;
            font-weight: bold;
            color: #1a1a2e;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .cert-sub {
            font-size: 18px;
            color: #555555;
            margin-top: 10px;
        }
        .recipient-name {
            font-size: 42px;
            font-weight: bold;
            color: #6C47FF;
            margin: 30px 0 10px 0;
            border-bottom: 2px solid #6C47FF;
            display: inline-block;
            padding-bottom: 5px;
        }
        .cert-body {
            font-size: 16px;
            color: #444444;
            line-height: 1.6;
            margin: 20px auto;
            width: 80%;
        }
        .cert-event {
            font-size: 24px;
            font-weight: bold;
            color: #1a1a2e;
            margin: 10px 0;
        }
        .cert-footer {
            margin-top: 60px;
            width: 100%;
        }
        .footer-table {
            width: 100%;
            margin-top: 40px;
        }
        .qr-code {
            width: 100px;
            height: 100px;
        }
        .element-custom {
            position: absolute;
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <?php if (!empty($bg_image)): ?>
        <div class="bg-container">
            <img src="<?= $bg_image ?>" alt="Background" />
        </div>
    <?php endif; ?>

    <?php if (!empty($elements) && is_array($elements)): ?>
        <?php foreach ($elements as $el): ?>
            <?php 
                $content = $el['content'] ?? '';
                foreach ($placeholders as $phKey => $phVal) {
                    $content = str_replace($phKey, $phVal, $content);
                }
                $style = sprintf(
                    "top: %spx; left: %spx; width: %spx; height: %spx; font-size: %spx; color: %s; text-align: %s;",
                    $el['top'] ?? 0,
                    $el['left'] ?? 0,
                    $el['width'] ?? 200,
                    $el['height'] ?? 50,
                    $el['fontSize'] ?? 16,
                    $el['color'] ?? '#000000',
                    $el['textAlign'] ?? 'left'
                );
            ?>
            <div class="element-custom" style="<?= $style ?>">
                <?php if (($el['type'] ?? '') === 'qr'): ?>
                    <img src="<?= $qr_data_uri ?>" class="qr-code" style="width: 100%; height: 100%;" />
                <?php elseif (($el['type'] ?? '') === 'image' && !empty($el['src'])): ?>
                    <img src="<?= $el['src'] ?>" style="width: 100%; height: 100%; object-fit: contain;" />
                <?php else: ?>
                    <?= nl2br(esc($content)) ?>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <!-- Default Layout fallback if custom template JSON is empty -->
        <div class="certificate-content">
            <div class="cert-header">CERTIFICATE OF PARTICIPATION</div>
            <div class="cert-sub">PROUDLY PRESENTED TO</div>
            
            <div class="recipient-name"><?= esc($placeholders['{{participant_name}}']) ?></div>
            
            <div class="cert-body">
                For successfully attending and completing the event
                <div class="cert-event"><?= esc($placeholders['{{event_name}}']) ?></div>
                held on <?= esc($placeholders['{{event_date}}']) ?>.
            </div>

            <table class="footer-table">
                <tr>
                    <td style="width: 33%; text-align: center;">
                        <img src="<?= $qr_data_uri ?>" class="qr-code" /><br>
                        <small style="color: #777;"><?= esc($placeholders['{{certificate_number}}']) ?></small>
                    </td>
                    <td style="width: 34%; text-align: center;">
                        <br><br>
                        <div style="border-top: 1px solid #333; width: 80%; margin: 0 auto; padding-top: 5px;">
                            <strong><?= esc($placeholders['{{organizer_name}}']) ?></strong><br>
                            <small style="color: #777;">Organizer</small>
                        </div>
                    </td>
                    <td style="width: 33%; text-align: center;">
                        <br><br>
                        <div style="border-top: 1px solid #333; width: 80%; margin: 0 auto; padding-top: 5px;">
                            <strong><?= esc($placeholders['{{certificate_date}}']) ?></strong><br>
                            <small style="color: #777;">Issue Date</small>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    <?php endif; ?>
</body>
</html>
