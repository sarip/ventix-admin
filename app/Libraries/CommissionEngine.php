<?php

namespace App\Libraries;

use App\Models\CommissionRule;
use App\Models\OrderCommission;
use App\Libraries\Commission\CommissionCalculatorInterface;
use App\Libraries\Commission\EventCommissionCalculator;
use App\Libraries\Commission\FacilityCommissionCalculator;

class CommissionEngine
{
    protected $ruleModel;
    protected $orderCommissionModel;

    public function __construct()
    {
        $this->ruleModel = new CommissionRule();
        $this->orderCommissionModel = new OrderCommission();
    }

    /**
     * Calculate and save commissions for an order.
     *
     * @param int $orderId
     * @param string $module
     * @param float $baseAmount
     * @return array Calculated results
     */
    public function processOrder(int $orderId, string $module, float $baseAmount): array
    {
        $rules = $this->ruleModel->getRulesByModule($module);
        if (empty($rules)) {
            return [];
        }

        $calculator = $this->getCalculator($module);
        $calculations = $calculator->calculate($baseAmount, $rules);

        // Persist to database
        foreach ($calculations as $calc) {
            $this->orderCommissionModel->insert([
                'order_id' => $orderId,
                'module' => $module,
                'rule_key' => $calc['rule_key'],
                'base_amount' => $baseAmount,
                'calculated_amount' => $calc['calculated_amount'],
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        }

        return $calculations;
    }

    /**
     * Get calculated results without saving (for simulation or preview)
     */
    public function previewCommission(string $module, float $baseAmount): array
    {
        $rules = $this->ruleModel->getRulesByModule($module);
        if (empty($rules)) {
            return [];
        }

        $calculator = $this->getCalculator($module);
        return $calculator->calculate($baseAmount, $rules);
    }

    /**
     * Strategy factory
     */
    protected function getCalculator(string $module): CommissionCalculatorInterface
    {
        switch ($module) {
            case 'event':
                return new EventCommissionCalculator();
            case 'facility':
                return new FacilityCommissionCalculator();
            default:
                throw new \Exception("Unsupported commission module: {$module}");
        }
    }
}
