<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Failed – Veentix</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, #fff2f2 0%, #fff5f0 100%);
            font-family: 'Segoe UI', Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px 16px;
        }

        .card {
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 8px 40px rgba(239, 68, 68, 0.10);
            max-width: 480px;
            width: 100%;
            overflow: hidden;
            animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(24px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Error banner */
        .banner {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            padding: 48px 40px 36px;
            text-align: center;
        }

        .icon-circle {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            animation: pop 0.4s ease 0.3s both;
        }

        @keyframes pop {
            0% {
                transform: scale(0.6);
                opacity: 0;
            }

            80% {
                transform: scale(1.1);
            }

            100% {
                transform: scale(1);
                opacity: 1;
            }
        }

        .icon-circle svg {
            width: 40px;
            height: 40px;
            stroke: #ffffff;
            stroke-width: 2.5;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
        }

        .banner h1 {
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
        }

        .banner p {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.82);
        }

        /* Body */
        .body {
            padding: 36px 40px 32px;
            text-align: center;
        }

        .body p {
            font-size: 15px;
            color: #6b7280;
            line-height: 1.7;
            margin-bottom: 24px;
        }

        /* Warning box */
        .warn-box {
            background: #fff7ed;
            border-left: 4px solid #f97316;
            border-radius: 8px;
            padding: 14px 18px;
            text-align: left;
            margin-bottom: 28px;
            font-size: 14px;
            color: #92400e;
            line-height: 1.6;
        }

        .warn-box strong {
            display: block;
            margin-bottom: 4px;
            color: #78350f;
        }

        .btn-back {
            display: inline-block;
            background: linear-gradient(135deg, #696cff 0%, #9155fd 100%);
            color: #ffffff !important;
            text-decoration: none;
            font-size: 16px;
            font-weight: 600;
            padding: 14px 48px;
            border-radius: 50px;
            box-shadow: 0 4px 14px rgba(105, 108, 255, 0.40);
            transition: transform 0.15s, box-shadow 0.15s;
        }

        .btn-back:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(105, 108, 255, 0.50);
        }

        /* Footer */
        .foot {
            background: #f9fafb;
            border-top: 1px solid #f3f4f6;
            padding: 18px 40px;
            text-align: center;
            font-size: 13px;
            color: #9ca3af;
        }

        @media (max-width: 480px) {

            .banner,
            .body {
                padding-left: 24px;
                padding-right: 24px;
            }

            .btn-back {
                padding: 13px 36px;
            }
        }
    </style>
</head>

<body>
    <div class="card">

        <!-- Error Banner -->
        <div class="banner">
            <div class="icon-circle">
                <!-- X icon -->
                <svg viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </div>
            <h1>Verification Failed</h1>
            <p>This link is invalid or has already expired.</p>
        </div>

        <!-- Body -->
        <div class="body">
            <p>
                We were unable to verify your email address. The link you used may be invalid
                or has expired (links are only valid for <strong>24 hours</strong>).
            </p>

            <div class="warn-box">
                <strong>What can I do?</strong>
                Try registering again to receive a fresh verification email, or contact
                our support team if you believe this is an error.
            </div>

            <a href="<?= esc(env('NEXT_PUBLIC_API_BASE_URL', '/')) ?>" class="btn-back">Back to Homepage</a>
        </div>

        <!-- Footer -->
        <div class="foot">
            &copy;
            <?= date('Y') ?> Veentix. All rights reserved.
        </div>

    </div>
</body>

</html>