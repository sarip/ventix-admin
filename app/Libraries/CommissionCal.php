<?php

namespace App\Libraries;

use App\Models\CommissionRule;

class CommissionCal
{

    /**
     * Get commission fee amount
     *
     * @param float $amount
     * @param string $module
     * @param string $ruleKey
     * @return float
     */
    public static function total(
        float $amount,
        string $module,
        string $ruleKey
    ): float {

        $Model = new CommissionRule();
        $rule = $Model
            ->where('module', $module)
            ->where('rule_key', $ruleKey)
            ->where('is_active', 1)
            ->first();

        if (!$rule) {
            return 0;
        }

        $percentage = (float) $rule->percentage;
        $fixedAmount = (float) $rule->fixed_amount;

        $percentageAmount = ($amount * $percentage) / 100;

        return round(
            $percentageAmount + $fixedAmount,
            2
        );
    }
}