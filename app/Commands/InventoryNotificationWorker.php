<?php

/**
 * Inventory Notification Worker Command
 * Check and notify low stock inventory items
 * 
 * Run: php spark notify:inventory
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2025-12-11
 */

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\InventoryItem;
use App\Libraries\RedisNotification;
use App\Libraries\NotificationService;

class InventoryNotificationWorker extends BaseCommand
{
    protected $group = 'Notifications';
    protected $name = 'notify:inventory';
    protected $description = 'Check and notify low stock inventory items';
    protected $usage = 'notify:inventory [--verbose]';
    protected $options = [
        '--verbose' => 'Show detailed output',
    ];

    public function run(array $params)
    {
        $verbose = array_key_exists('verbose', $params) || CLI::getOption('verbose');

        CLI::write('===========================================', 'green');
        CLI::write('Inventory Notification Worker - ' . date('Y-m-d H:i:s'), 'green');
        CLI::write('===========================================', 'green');
        CLI::newLine();

        $inventoryModel = new InventoryItem();
        $redis = new RedisNotification('inventory');
        $notificationService = new NotificationService();

        $notificationsSent = 0;
        $errors = 0;

        // Check low stock items
        CLI::write('Checking low stock items...', 'cyan');

        $db = \Config\Database::connect();
        $builder = $db->table('inventory_items');
        $builder->where('stock < reorder_point');
        $lowStockItems = $builder->get()->getResult();

        foreach ($lowStockItems as $item) {
            try {
                if ($verbose) {
                    CLI::write("  → Item: {$item->name} (SKU: {$item->sku}) - Stock: {$item->stock}, Reorder Point: {$item->reorder_point}", 'red');
                }

                // TODO: Get procurement staff user IDs from database
                // For now, notify admin (user_id = 1)
                $procurementStaffIds = [1]; // Placeholder

                foreach ($procurementStaffIds as $userId) {
                    // Create database notification
                    $notificationService->create(
                        $userId,
                        'inventory_low_stock',
                        'inventory_item',
                        $item->id,
                        'Stock Rendah!',
                        "Item '{$item->name}' (SKU: {$item->sku}) stock tersisa {$item->stock} {$item->unit}. Reorder point: {$item->reorder_point}"
                    );
                }

                // Publish to Redis
                $redis->publishInventoryLowStock($item);
                $notificationsSent++;

            } catch (\Exception $e) {
                $errors++;
                CLI::write("  ERROR: {$e->getMessage()}", 'red');
                log_message('error', "Inventory notification error: {$e->getMessage()}");
            }
        }

        // Summary
        CLI::newLine();
        CLI::write('===========================================', 'green');
        CLI::write('Summary:', 'white');
        CLI::write("  Low stock items: " . count($lowStockItems), 'white');
        CLI::write("  Notifications sent: {$notificationsSent}", 'green');
        CLI::write("  Errors: {$errors}", $errors > 0 ? 'red' : 'green');
        CLI::write('===========================================', 'green');

        log_message('info', "Inventory Notification Worker completed: {$notificationsSent} sent, {$errors} errors");
    }
}
