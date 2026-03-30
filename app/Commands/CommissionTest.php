<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class CommissionTest extends BaseCommand
{
    /**
     * The Command's Group
     *
     * @var string
     */
    protected $group = 'App';

    /**
     * The Command's Name
     *
     * @var string
     */
    protected $name = 'test:commission';
    protected $description = 'Verify commission engine calculations';

    public function run(array $params)
    {
        $engine = new \App\Libraries\CommissionEngine();

        CLI::write("--- Commission Engine Verification ---", "yellow");

        // Helper to find amount by key in results array
        $getCalculatedAmount = function ($results, $key) {
            foreach ($results as $item) {
                if ($item['rule_key'] === $key)
                    return $item['calculated_amount'];
            }
            return 0;
        };

        // Example 1: Event ticket price 100,000
        $price1 = 100000;
        $eventResult = $engine->previewCommission('event', $price1);
        $eoFee = $getCalculatedAmount($eventResult, 'eo_fee');
        $guestFee1 = $getCalculatedAmount($eventResult, 'guest_fee');

        CLI::write("Example 1: Event Ticket Price = " . number_format($price1), "cyan");
        CLI::write("Expected EO Fee (6%): 6,000 | Actual: " . number_format($eoFee));
        CLI::write("Expected Guest Fee (5%): 5,000 | Actual: " . number_format($guestFee1));

        if ($eoFee == 6000 && $guestFee1 == 5000) {
            CLI::write("Event Calculation: PASSED", "green");
        } else {
            CLI::write("Event Calculation: FAILED", "red");
        }

        CLI::newLine();

        // Example 2: Facility booking price 200,000
        $price2 = 200000;
        $facilityResult = $engine->previewCommission('facility', $price2);
        $facilityFee = $getCalculatedAmount($facilityResult, 'facility_fee');
        $guestFee2 = $getCalculatedAmount($facilityResult, 'guest_fee');

        CLI::write("Example 2: Facility Booking Price = " . number_format($price2), "cyan");
        CLI::write("Expected Facility Fee (5%): 10,000 | Actual: " . number_format($facilityFee));
        CLI::write("Expected Guest Fee (8%): 16,000 | Actual: " . number_format($guestFee2));

        if ($facilityFee == 10000 && $guestFee2 == 16000) {
            CLI::write("Facility Calculation: PASSED", "green");
        } else {
            CLI::write("Facility Calculation: FAILED", "red");
        }

        CLI::write("--------------------------------------", "yellow");
    }
}
