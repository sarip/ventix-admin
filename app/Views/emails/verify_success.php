<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verified – Veentix</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, #f0f2ff 0%, #f5f0ff 100%);
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
            box-shadow: 0 8px 40px rgba(105, 108, 255, 0.12);
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

        /* Success banner */
        .banner {
            background: linear-gradient(135deg, #696cff 0%, #9155fd 100%);
            padding: 48px 40px 36px;
            text-align: center;
        }

        .check-circle {
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

        .check-circle svg {
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
            margin-bottom: 28px;
        }

        .body p strong {
            color: #374151;
        }

        /* Steps */
        .steps {
            background: #f9fafb;
            border-radius: 12px;
            padding: 20px 24px;
            margin-bottom: 28px;
            text-align: left;
        }

        .steps p {
            font-size: 13px;
            font-weight: 600;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 14px;
        }

        .step-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 10px;
        }

        .step-item:last-child {
            margin-bottom: 0;
        }

        .step-num {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: linear-gradient(135deg, #696cff, #9155fd);
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .step-item span {
            font-size: 14px;
            color: #374151;
            line-height: 1.4;
        }

        .btn-login {
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

        .btn-login:hover {
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

            .btn-login {
                padding: 13px 36px;
            }
        }
    </style>
</head>

<body>
    <div class="card">

        <!-- Success Banner -->
        <div class="banner">
            <div class="check-circle">
                <svg viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            <h1>Email Verified!</h1>
            <p>Your account has been successfully activated.</p>
        </div>

        <!-- Body -->
        <div class="body">
            <p>
                Welcome to <strong>Veentix</strong>! 🎉 Your email address has been verified
                and your Event Organizer account is now active.
            </p>

            <div class="steps">
                <p>What's next?</p>
                <div class="step-item">
                    <div class="step-num">1</div>
                    <span>Log in using your registered username &amp; password</span>
                </div>
                <div class="step-item">
                    <div class="step-num">2</div>
                    <span>Start creating and publishing events</span>
                </div>
            </div>

            <?php if($user->role === "EO Admin") : ?>
                <a href="<?= esc(env('NEXT_PUBLIC_SITE_URL', '/')) ?>/login" class="btn-login">Go to Login</a>
            <?php else : ?>
                <a href="<?= esc(env('NEXT_PUBLIC_API_BASE_URL', '/')) ?>/auth/login" class="btn-login">Go to Login</a>
            <?php endif; ?>
        </div>

        <!-- Footer -->
        <div class="foot">
            &copy;
            <?= date('Y') ?> Veentix. All rights reserved.
        </div>

    </div>
</body>

</html>