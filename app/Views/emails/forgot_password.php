<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password – Veentix</title>
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

        .brand-bar .logo-text span {
            color: #111827;
        }

        .card {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        }

        .card-header {
            background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
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

        .info-box {
            background: #fff7ed;
            border-left: 4px solid #f97316;
            border-radius: 8px;
            padding: 14px 18px;
            margin: 24px 0;
            font-size: 14px;
            color: #9a3412;
            line-height: 1.6;
        }

        .btn-wrap {
            text-align: center;
            margin: 32px 0 24px;
        }

        .btn-reset {
            display: inline-block;
            background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
            color: #ffffff !important;
            text-decoration: none;
            font-size: 16px;
            font-weight: 600;
            padding: 14px 40px;
            border-radius: 50px;
            letter-spacing: 0.3px;
            box-shadow: 0 4px 14px rgba(249, 115, 22, 0.45);
        }

        .expiry-note {
            text-align: center;
            font-size: 13px;
            color: #9ca3af;
            margin-bottom: 24px;
        }

        .expiry-note strong {
            color: #6b7280;
        }

        .divider {
            border: none;
            border-top: 1px solid #f3f4f6;
            margin: 24px 0;
        }

        .fallback {
            font-size: 13px;
            color: #9ca3af;
            line-height: 1.6;
        }

        .fallback a {
            color: #f97316;
            word-break: break-all;
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

        .card-footer a {
            color: #f97316;
            text-decoration: none;
        }

        @media (max-width: 480px) {

            .card-header,
            .card-body,
            .card-footer {
                padding-left: 24px;
                padding-right: 24px;
            }

            .card-header {
                padding-top: 36px;
                padding-bottom: 28px;
            }

            .btn-reset {
                padding: 13px 28px;
                font-size: 15px;
            }
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
                    <!-- Lock icon -->
                    <svg viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>
                <h1>Reset Your Password</h1>
                <p>We received a request to reset your account password</p>
            </div>

            <!-- Body -->
            <div class="card-body">
                <p class="greeting">Hello, <?= esc($user->name) ?>! 👋</p>

                <p>
                    We received a request to reset the password for your
                    <strong><?= esc(env('NEXT_PUBLIC_APP_NAME', 'Veentix')) ?></strong> account
                    associated with <strong><?= esc($user->email) ?></strong>.
                </p>

                <p>
                    Click the button below to set a new password. If you didn't request this,
                    you can safely ignore this email — your password will not be changed.
                </p>

                <div class="info-box">
                    🔒 &nbsp;For your security, this reset link can only be used <strong>once</strong>
                    and will expire in <strong>1 hour</strong>.
                </div>

                <div class="btn-wrap">
                    <a href="<?= $reset_url ?>" class="btn-reset">Reset My Password</a>
                </div>

                <p class="expiry-note">
                    ⏱ &nbsp;This link will expire in <strong>1 hour</strong>.
                </p>

                <hr class="divider">

                <p class="fallback">
                    If the button above doesn't work, copy and paste the link below into your browser:<br>
                    <a href="<?= $reset_url ?>"><?= $reset_url ?></a>
                </p>

                <hr class="divider">

                <p style="font-size:14px; color:#9ca3af;">
                    If you did not request a password reset for <?= esc(env('NEXT_PUBLIC_APP_NAME', 'Veentix')) ?>,
                    please ignore this email or contact our support team if you have concerns.
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