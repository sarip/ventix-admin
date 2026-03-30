<?php

namespace App\Libraries\Commission;

class EventCommissionCalculator implements CommissionCalculatorInterface
{
    /**
     * @param float $baseAmount Ticket price
     * @param array $rules (e.g., eo_fee: 6%, guest_fee: 5%)
     */
    public function calculate(float $baseAmount, array $rules): array
    {
        $results = [];
        foreach ($rules as $rule) {
            $amount = 0;
            if ($rule->percentage > 0) {
                $amount += ($baseAmount * ($rule->percentage / 100));
            }
            if ($rule->fixed_amount > 0) {
                $amount += $rule->fixed_amount;
            }
            $results[] = [
                'rule_key' => $rule->rule_key,
                'calculated_amount' => $amount
            ];
        }
        return $results;
    }
}
