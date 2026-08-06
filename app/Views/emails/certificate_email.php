<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Sertifikat Event</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #dddddd;">
        <h2 style="color: #4A00E0; margin-top: 0;">Sertifikat <?= esc($event_name) ?></h2>
        <p>Halo <strong><?= esc($name) ?></strong>,</p>
        <p>Terima kasih telah mengikuti event kami. Berikut kami lampirkan sertifikat digital Anda sebagai bentuk partisipasi.</p>
        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #4A00E0; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #555;">
                <strong>Nomor Sertifikat:</strong> <?= esc($certificate_number) ?><br>
                <strong>Event:</strong> <?= esc($event_name) ?>
            </p>
        </div>
        <p>Sertifikat digital Anda dapat diakses pada attachment email ini atau diunduh langsung via aplikasi/website.</p>
        <p style="color: #888888; font-size: 12px; margin-top: 30px;">
            &copy; <?= date('Y') ?> Veentix. All rights reserved.
        </p>
    </div>
</body>
</html>
