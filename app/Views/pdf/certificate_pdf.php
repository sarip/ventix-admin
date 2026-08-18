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
        * {
            box-sizing: border-box;
        }
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-family: 'Helvetica', 'Arial', sans-serif;
            background: transparent;
            color: #1e293b;
        }

        /* Fixed background image covering entire A4 page in Dompdf.
           Dompdf does not reliably auto-stretch replaced elements sized only via
           top/right/bottom/left insets - it falls back to the image's native pixel
           size (converted via DPI), which is far larger than the page and makes the
           background appear "zoomed in". Explicit 100% width/height forces Dompdf to
           size the image against its containing block instead. */
        .bg-full-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

        /* Default Layout fallback when no custom JSON template */
        .cert-card {
            position: absolute;
            top: 15pt;
            left: 15pt;
            right: 15pt;
            bottom: 15pt;
            border: 3pt solid #1e3a8a;
            padding: 10pt;
            background: transparent;
        }
        .cert-inner-border {
            border: 1pt solid #94a3b8;
            height: 100%;
            padding: 30pt 40pt;
            position: relative;
            background: transparent;
        }

        /* Corner decorations */
        .corner {
            position: absolute;
            width: 30pt;
            height: 30pt;
            border-color: #d97706;
            border-style: solid;
        }
        .corner-tl { top: 8pt; left: 8pt; border-width: 3pt 0 0 3pt; }
        .corner-tr { top: 8pt; right: 8pt; border-width: 3pt 3pt 0 0; }
        .corner-bl { bottom: 8pt; left: 8pt; border-width: 0 0 3pt 3pt; }
        .corner-br { bottom: 8pt; right: 8pt; border-width: 0 3pt 3pt 0; }

        .cert-header-badge {
            text-align: center;
            margin-top: 15pt;
        }
        .cert-header-badge span {
            font-size: 11pt;
            letter-spacing: 4pt;
            text-transform: uppercase;
            color: #64748b;
            font-weight: bold;
        }

        .cert-title {
            text-align: center;
            margin-top: 10pt;
            font-size: 34pt;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 3pt;
            font-family: 'Georgia', serif;
        }

        .cert-subtitle {
            text-align: center;
            font-size: 14pt;
            color: #64748b;
            margin-top: 15pt;
            letter-spacing: 1pt;
            text-transform: uppercase;
        }

        .recipient-name {
            text-align: center;
            font-size: 36pt;
            font-weight: bold;
            color: #1e3a8a;
            margin: 18pt auto 8pt auto;
            padding-bottom: 8pt;
            border-bottom: 2pt dashed #cbd5e1;
            width: 75%;
            font-family: 'Georgia', serif;
        }

        .cert-desc {
            text-align: center;
            font-size: 14pt;
            color: #334155;
            line-height: 1.6;
            margin: 15pt auto;
            width: 82%;
        }

        .cert-event-name {
            font-size: 22pt;
            font-weight: bold;
            color: #0f172a;
            margin: 6pt 0;
            display: block;
        }

        .cert-footer-table {
            width: 100%;
            margin-top: 35pt;
            position: absolute;
            bottom: 30pt;
            left: 0;
            padding: 0 40pt;
        }

        .sign-line {
            border-top: 1pt solid #64748b;
            width: 160pt;
            margin: 0 auto;
            padding-top: 5pt;
        }

        .element-custom {
            position: absolute;
            box-sizing: border-box;
            background: transparent;
            padding: 2pt;
        }
    </style>
</head>
<body>
    <?php if (!empty($bg_image)): ?>
        <img src="<?= $bg_image ?>" class="bg-full-page" alt="Background" />
    <?php endif; ?>

    <?php if (!empty($elements) && is_array($elements)): ?>
        <?php foreach ($elements as $el): ?>
            <?php 
                $content = $el['content'] ?? '';
                foreach ($placeholders as $phKey => $phVal) {
                    $content = str_replace($phKey, $phVal, $content);
                }
                $style = sprintf(
                    "top: %spt; left: %spt; width: %spt; height: %spt; font-size: %spt; line-height: 1.2; color: %s; text-align: %s; font-weight: %s; font-style: %s; font-family: %s; background: transparent;",
                    $el['top'] ?? 0,
                    $el['left'] ?? 0,
                    $el['width'] ?? 200,
                    $el['height'] ?? 50,
                    $el['fontSize'] ?? 16,
                    $el['color'] ?? '#000000',
                    $el['textAlign'] ?? 'left',
                    $el['fontWeight'] ?? 'normal',
                    $el['fontStyle'] ?? 'normal',
                    !empty($el['fontFamily']) ? $el['fontFamily'] : 'Helvetica, Arial, sans-serif'
                );
            ?>
            <div class="element-custom" style="<?= $style ?>">
                <?php if (($el['type'] ?? '') === 'qr'): ?>
                    <img src="<?= $qr_data_uri ?>" style="width: 100%; height: 100%; object-fit: contain;" />
                <?php elseif (($el['type'] ?? '') === 'image' && !empty($el['src'])): ?>
                    <img src="<?= $el['src'] ?>" style="width: 100%; height: 100%; object-fit: contain;" />
                <?php else: ?>
                    <table style="width: 100%; height: 100%; border-collapse: collapse; border: none; padding: 0; margin: 0; background: transparent;">
                        <tr>
                            <td style="vertical-align: middle; text-align: <?= $el['textAlign'] ?? 'left' ?>; padding: 0; margin: 0; font-size: inherit; color: inherit; font-weight: inherit; font-style: inherit; font-family: inherit; background: transparent;">
                                <?= nl2br(esc($content)) ?>
                            </td>
                        </tr>
                    </table>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <!-- Premium Fallback Layout when no custom template background/json is set -->
        <div class="cert-card">
            <div class="cert-inner-border">
                <div class="corner corner-tl"></div>
                <div class="corner corner-tr"></div>
                <div class="corner corner-bl"></div>
                <div class="corner corner-br"></div>

                <div class="cert-header-badge">
                    <span>Official E-Certificate</span>
                </div>

                <div class="cert-title">Certificate of Excellence</div>
                <div class="cert-subtitle">This Certificate is Proudly Presented To</div>
                
                <div class="recipient-name"><?= esc($placeholders['{{participant_name}}']) ?></div>
                
                <div class="cert-desc">
                    for successfully participating in and completing the event
                    <span class="cert-event-name"><?= esc($placeholders['{{event_name}}']) ?></span>
                    held on <strong><?= esc($placeholders['{{event_date}}']) ?></strong>.
                </div>

                <table class="cert-footer-table">
                    <tr>
                        <td style="width: 30%; text-align: center; vertical-align: bottom;">
                            <img src="<?= $qr_data_uri ?>" style="width: 90pt; height: 90pt;" /><br>
                            <span style="font-size: 10pt; color: #64748b; font-family: monospace; text-transform: uppercase;">
                                <?= esc($placeholders['{{certificate_number}}']) ?>
                            </span>
                        </td>
                        <td style="width: 40%; text-align: center; vertical-align: bottom;">
                            <div class="sign-line">
                                <strong style="font-size: 13pt; color: #0f172a;"><?= esc($placeholders['{{organizer_name}}']) ?></strong><br>
                                <span style="font-size: 11pt; color: #64748b;">Organizer Committee</span>
                            </div>
                        </td>
                        <td style="width: 30%; text-align: center; vertical-align: bottom;">
                            <div class="sign-line">
                                <strong style="font-size: 13pt; color: #0f172a;"><?= esc($placeholders['{{certificate_date}}']) ?></strong><br>
                                <span style="font-size: 11pt; color: #64748b;">Issue Date</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    <?php endif; ?>
</body>
</html>
