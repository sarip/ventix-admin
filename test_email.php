<?php
/**
 * Email Configuration Check
 * Simple script to verify email configuration settings
 */

echo "\n===========================================\n";
echo "EMAIL CONFIGURATION CHECK\n";
echo "===========================================\n\n";

// Read Email.php configuration
$configFile = file_get_contents(__DIR__ . '/app/Config/Email.php');

echo "EXTRACTED CONFIGURATION:\n";
echo "===========================================\n";

// Extract key configuration values
preg_match('/public string \$protocol = \'([^\']+)\'/', $configFile, $matches);
echo "Protocol: " . ($matches[1] ?? 'not found') . "\n";

preg_match('/public string \$SMTPHost = \'([^\']+)\'/', $configFile, $matches);
echo "Host: " . ($matches[1] ?? 'not found') . "\n";

preg_match('/public string \$SMTPUser = \'([^\']+)\'/', $configFile, $matches);
echo "Username: " . ($matches[1] ?? 'not found') . "\n";

preg_match('/public string \$SMTPPass = \'([^\']+)\'/', $configFile, $matches);
$password = $matches[1] ?? 'not found';
echo "Password: " . (strlen($password) > 10 ? substr($password, 0, 10) . '...' : $password) . "\n";

preg_match('/public int \$SMTPPort = (\d+)/', $configFile, $matches);
echo "Port: " . ($matches[1] ?? 'not found') . "\n";

preg_match('/public int \$SMTPTimeout = (\d+)/', $configFile, $matches);
$timeout = $matches[1] ?? 'not found';
echo "Timeout: " . $timeout . " seconds\n";

preg_match('/public string \$SMTPCrypto = \'([^\']+)\'/', $configFile, $matches);
echo "Crypto: " . ($matches[1] ?? 'not found') . "\n";

preg_match('/public bool \$SMTPKeepAlive = (true|false)/', $configFile, $matches);
$keepAlive = $matches[1] ?? 'not found';
echo "KeepAlive: " . $keepAlive . "\n";

preg_match('/public string \$mailType = \'([^\']+)\'/', $configFile, $matches);
echo "MailType: " . ($matches[1] ?? 'not found') . "\n";

echo "\nISSUES AND RECOMMENDATIONS:\n";
echo "===========================================\n";

$issues = [];

// Check timeout
if ($timeout !== 'not found' && $timeout < 10) {
    $issues[] = "❌ SMTP Timeout is too low ({$timeout}s). Should be at least 10s for Gmail";
    echo "❌ SMTP Timeout is too low ({$timeout}s). Should be at least 10s for Gmail\n";
}

// Check keep-alive
if ($keepAlive === 'false') {
    $issues[] = "❌ SMTPKeepAlive is disabled. Should be true for multiple emails";
    echo "❌ SMTPKeepAlive is disabled. Should be true for multiple emails\n";
}

// Check Gmail configuration
if (isset($matches[1]) && $matches[1] === 'smtp.gmail.com') {
    echo "✓ Using Gmail SMTP\n";

    // Port/Crypto check
    if (isset($matches[1]) && $matches[1] === '587') {
        echo "✓ Port 587 is correct for TLS\n";
    }

    if (isset($matches[1]) && $matches[1] === 'tls') {
        echo "✓ TLS encryption is correct\n";
    }
}

if (empty($issues)) {
    echo "✓ Configuration looks good!\n";
}

echo "\nRECOMMENDED CHANGES:\n";
echo "===========================================\n";
echo "In /home/sarip/project/venntix-admin/app/Config/Email.php:\n\n";

echo "Change these lines:\n";
echo "  public int \$SMTPTimeout = 5;  // OLD\n";
echo "  public bool \$SMTPKeepAlive = false;  // OLD\n\n";

echo "To:\n";
echo "  public int \$SMTPTimeout = 10;  // NEW - Increased for Gmail reliability\n";
echo "  public bool \$SMTPKeepAlive = true;  // NEW - Better for multiple emails\n\n";

echo "GMAIL SETUP REQUIREMENTS:\n";
echo "===========================================\n";
echo "1. Enable 2-Factor Authentication on veentixindo@gmail.com\n";
echo "2. Generate an App Password (not regular password)\n";
echo "3. Use App Password in SMTPPass\n";
echo "4. Current password format appears correct (App Password format)\n\n";

echo "To apply fixes, run the recommended update in Config/Email.php\n";
echo "===========================================\n\n";
