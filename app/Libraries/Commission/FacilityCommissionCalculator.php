<?php

namespace App\Libraries\Commission;

class FacilityCommissionCalculator implements CommissionCalculatorInterface
{
    /**
     * @param float $baseAmount Booking price
     * @param array $rules (e.g., facility_fee: 5%, guest_fee: 8%)
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
