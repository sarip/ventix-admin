<?php
/**
 * Simple Email Test Script
 * Use this to verify email sending is working after configuration changes
 *
 * Usage: php send_test_email.php your-email@example.com
 */

if ($argc < 2) {
    echo "Usage: php send_test_email.php your-email@example.com\n";
    echo "Example: php send_test_email.php test@example.com\n";
    exit(1);
}

$testEmail = $argv[1];

// Basic email validation
if (!filter_var($testEmail, FILTER_VALIDATE_EMAIL)) {
    echo "Error: Invalid email address provided\n";
    exit(1);
}

echo "\n===========================================\n";
echo "SENDING TEST EMAIL\n";
echo "===========================================\n";
echo "To: $testEmail\n";
echo "From: veentixindo@gmail.com\n";
echo "Subject: Veentix Email Test\n";
echo "===========================================\n\n";

// Load CodeIgniter
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/app/Config/Email.php';

// Initialize CodeIgniter
$bootstrap = new \CodeIgniter\CodeIgniter();
$bootstrap->initialize();

// Get email service
$email = \Config\Services::email();

// Configure email
$email->setFrom('veentixindo@gmail.com', 'Veentix Admin System');
$email->setTo($testEmail);
$email->setSubject('Veentix Email Test - ' . date('Y-m-d H:i:s'));

// Create HTML email body
$message = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Test Email</title>
</head>
<body style='font-family: Arial, sans-serif;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
        <h2 style='color: #696cff;'>Veentix Email Test</h2>
        <p>This is a test email from the Veentix system.</p>
        <p><strong>Test Details:</strong></p>
        <ul>
            <li>Sent: " . date('Y-m-d H:i:s') . "</li>
            <li>To: $testEmail</li>
            <li>Server: " . gethostname() . "</li>
        </ul>
        <div style='background: #f0ecff; padding: 15px; border-radius: 5px; margin: 20px 0;'>
            <p style='margin: 0; color: #3d2b99;'>
                If you received this email, the email configuration is working correctly!
            </p>
        </div>
        <p style='color: #888; font-size: 12px;'>
            This is an automated test email. Please do not reply.
        </p>
    </div>
</body>
</html>
";

$email->setMessage($message);
$email->setMailType('html');

// Send email
echo "Attempting to send email...\n";

try {
    $result = $email->send();

    if ($result) {
        echo "✓ SUCCESS: Email sent successfully!\n";
        echo "Please check your inbox (and spam folder) for the test email.\n";
    } else {
        echo "✗ FAILED: Email could not be sent.\n";
        echo "\nDebug Information:\n";
        echo "===========================================\n";
        echo $email->printDebugger(['headers']);
        echo "\n===========================================\n";
        echo "\nCommon issues:\n";
        echo "1. Gmail App Password may need to be regenerated\n";
        echo "2. 2-Factor Authentication must be enabled on the Gmail account\n";
        echo "3. Check if Gmail is blocking 'less secure apps' (use App Password instead)\n";
        echo "4. Network/firewall issues blocking SMTP port 587\n";
    }
} catch (Exception $e) {
    echo "✗ ERROR: " . $e->getMessage() . "\n";
}

echo "\n===========================================\n";
echo "Test completed at: " . date('Y-m-d H:i:s') . "\n";
echo "===========================================\n\n";
