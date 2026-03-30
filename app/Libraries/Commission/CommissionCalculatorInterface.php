<?php

namespace App\Libraries\Commission;

interface CommissionCalculatorInterface
{
    /**
     * Calculate commission for a given amount based on rules.
     *
     * @param float $baseAmount
     * @param array $rules
     * @return array Array of calculated results: ['rule_key' => amount]
     */
    public function calculate(float $baseAmount, array $rules): array;
}
