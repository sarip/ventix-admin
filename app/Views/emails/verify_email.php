<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email – Veentix</title>
    <style>
        /* Reset */
        * { margin: 0; padding: 0; box-sizing: border-box; }

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

        /* Top brand bar */
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

        .brand-bar .logo-text span {
            color: #111827;
        }

        /* Card */
        .card {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        }

        /* Header gradient */
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
            stroke: #ffffff;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .card-header h1 {
            font-size: 26px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
            letter-spacing: -0.3px;
        }

        .card-header p {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.80);
        }

        /* Body */
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

        /* Info box */
        .info-box {
            background: #f5f3ff;
            border-left: 4px solid #696cff;
            border-radius: 8px;
            padding: 14px 18px;
            margin: 24px 0;
            font-size: 14px;
            color: #5b5ea6;
            line-height: 1.6;
        }

        /* CTA button */
        .btn-wrap {
            text-align: center;
            margin: 32px 0 24px;
        }

        .btn-verify {
            display: inline-block;
            background: linear-gradient(135deg, #696cff 0%, #9155fd 100%);
            color: #ffffff !important;
            text-decoration: none;
            font-size: 16px;
            font-weight: 600;
            padding: 14px 40px;
            border-radius: 50px;
            letter-spacing: 0.3px;
            box-shadow: 0 4px 14px rgba(105, 108, 255, 0.45);
            transition: opacity 0.2s;
        }

        /* Expiry note */
        .expiry-note {
            text-align: center;
            font-size: 13px;
            color: #9ca3af;
            margin-bottom: 24px;
        }

        .expiry-note strong {
            color: #6b7280;
        }

        /* Divider */
        .divider {
            border: none;
            border-top: 1px solid #f3f4f6;
            margin: 24px 0;
        }

        /* Fallback URL */
        .fallback {
            font-size: 13px;
            color: #9ca3af;
            line-height: 1.6;
        }

        .fallback a {
            color: #696cff;
            word-break: break-all;
        }

        /* Footer */
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

        .card-footer a {
            color: #696cff;
            text-decoration: none;
        }

        @media (max-width: 480px) {
            .card-header, .card-body, .card-footer { padding-left: 24px; padding-right: 24px; }
            .card-header { padding-top: 36px; padding-bottom: 28px; }
            .btn-verify { padding: 13px 28px; font-size: 15px; }
        }
    </style>
</head>

<body>
    <div class="wrapper">

        <!-- Brand -->
        <div class="brand-bar">
            <div class="logo-text">Veentix</div>
        </div>

        <div class="card">

            <!-- Header -->
            <div class="card-header">
                <div class="icon-circle">
                    <!-- Mail icon (inline SVG) -->
                    <svg viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                </div>
                <h1>Verify Your Email Address</h1>
                <p>One last step to activate your Event Organizer account</p>
            </div>

            <!-- Body -->
            <div class="card-body">
                <p class="greeting">Hello, <?= esc($user->name) ?>! 👋</p>

                <p>
                    Thank you for registering on
                    <strong><?= esc(env('NEXT_PUBLIC_APP_NAME', 'Veentix')) ?></strong>.
                    We're excited to have you on board.
                </p>

                <p>
                    To complete your registration and start creating events, please verify
                    your email address by clicking the button below.
                </p>

                <div class="info-box">
                    🔒 &nbsp;For your security, this verification link is unique to your account
                    and cannot be shared with others.
                </div>

                <div class="btn-wrap">
                    <a href="<?= $verification_url ?>" class="btn-verify">Verify Email Address</a>
                </div>

                <p class="expiry-note">
                    ⏱ &nbsp;This link will expire in <strong>24 hours</strong>.
                </p>

                <hr class="divider">

                <p class="fallback">
                    If the button above doesn't work, copy and paste the link below into your browser:<br>
                    <a href="<?= $verification_url ?>"><?= $verification_url ?></a>
                </p>

                <hr class="divider">

                <p style="font-size:14px; color:#9ca3af;">
                    If you did not create an account with <?= esc(env('NEXT_PUBLIC_APP_NAME', 'Veentix')) ?>,
                    you can safely ignore this email. No action is required.
                </p>
            </div>

            <!-- Footer -->
            <div class="card-footer">
                <p>
                    &copy; <?= date('Y') ?> <?= esc(env('NEXT_PUBLIC_APP_NAME', 'Veentix')) ?>. All rights reserved.<br>
                    This is an automated message. Please do not reply to this email.
                </p>
            </div>

        </div>
    </div>
</body>

</html>