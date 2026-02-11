<?php

namespace App\Libraries;

use CodeIgniter\Database\BaseConnection;
use Config\Database;
use Exception;
use Throwable;

class UserPointService
{
    protected BaseConnection $db;

    public function __construct()
    {
        $this->db = Database::connect();
    }

    /* =====================================================
     * PUBLIC API
     * ===================================================== */

//     UPDATE userpoint_rules SET activity_group = 'PURCHASE'
//     WHERE activity_name IN ('PURCHASE_BASIC','PURCHASE_VIP','PURCHASE_MEGA');

//     UPDATE userpoint_rules SET activity_group = 'FACILITY'
//     WHERE activity_name LIKE 'Facility_%';

//     UPDATE userpoint_rules SET activity_group = 'SYSTEM'
//     WHERE activity_name IN ('USER_REGISTRATION','DAILY_LOGIN','NEW_YEAR_SURPRISE');

    /**
     * @throws Throwable
     */
    public function earn(array $payload): int
    {
        if (empty($payload['user_id']) || empty($payload['activity_group'])) {
            throw new Exception('user_id and activity_group are required');
        }

        $rules = $this->getEligibleRules($payload);
        if (!$rules) {
            return 0;
        }

        $this->db->transBegin();
        $granted = 0;

        try {
            foreach ($rules as $rule) {
                if (!$this->validateRule($payload['user_id'], $rule)) {
                    continue;
                }


                $this->grantPoint($payload, $rule);
                $granted++;
            }

            $this->db->transCommit();
            return $granted;

        } catch (Throwable $e) {
            $this->db->transRollback();
            throw $e;
        }
    }

    /**
     * @throws Exception
     */
    public function redeem(int $userId, int $amount, ?string $description = null): void
    {
        if ($amount <= 0) {
            throw new Exception('Invalid redeem amount');
        }

        $this->db->transBegin();

        $point = $this->db->table('user_points')
            ->where('user_id', $userId)
            ->get()
            ->getRow();


        if (!$point || $point->current_balance < $amount) {
            throw new Exception('Insufficient point');
        }

        $this->insertLog([
            'user_id'        => $userId,
            'activity_type'  => 'POINT_REDEEM',
            'point_cat'      => 'REDEEM',
            'amount'         => -$amount,
            'point_status'   => 'Redeem',
            'description'    => $description
        ]);

        echo json_encode($point); die();

        $this->db->query(
            "UPDATE user_points SET current_balance = current_balance - ? WHERE user_id = ?",
            [$amount, $userId]
        );

        $this->db->transCommit();
    }

    public function expire(): int
    {
        $this->db->transBegin();

        $logs = $this->db->table('userpoint_logs')
            ->where('point_status', 'Active')
            ->where('amount >', 0)
            ->where('expiry_date <', date('Y-m-d'))
            ->get()
            ->getResult();

        foreach ($logs as $log) {
            $this->db->table('userpoint_logs')
                ->where('id', $log->id)
                ->update(['point_status' => 'Expired']);

            $this->db->query(
                "UPDATE user_points SET current_balance = current_balance - ? WHERE user_id = ?",
                [$log->amount, $log->user_id]
            );
        }

        $this->db->transCommit();
        return count($logs);
    }

    /* =====================================================
     * INTERNAL
     * ===================================================== */

    protected function getEligibleRules(array $payload): array
    {
        return $this->db->table('userpoint_rules')
            ->where('is_active', 1)
            ->where('activity_group', $payload['activity_group'])
            ->where('min_transaction_amount <=', $payload['transaction_amount'] ?? 0)
            ->groupStart()
            ->where('start_date IS NULL')
            ->orWhere('start_date <=', date('Y-m-d H:i:s'))
            ->groupEnd()
            ->groupStart()
            ->where('end_date IS NULL')
            ->orWhere('end_date >=', date('Y-m-d H:i:s'))
            ->groupEnd()
            ->get()
            ->getResult();
    }

    protected function validateRule(int $userId, object $rule): bool
    {
        if ($rule->max_times_per_day !== null) {
            $todayCount = $this->db->table('userpoint_logs')
                ->where('user_id', $userId)
                ->where('activity_type', $rule->activity_name)
                ->where('DATE(created_at)', date('Y-m-d'))
                ->countAllResults();

            if ($todayCount >= $rule->max_times_per_day) {
                return false;
            }
        }

        if ($rule->cooldown_minutes > 0) {
            $lastLog = $this->db->table('userpoint_logs')
                ->where('user_id', $userId)
                ->where('activity_type', $rule->activity_name)
                ->orderBy('created_at', 'DESC')
                ->get(1)
                ->getRow();

            if ($lastLog && (time() - strtotime($lastLog->created_at)) < ($rule->cooldown_minutes * 60)) {
                return false;
            }
        }

        return true;
    }

    protected function grantPoint(array $payload, object $rule): void
    {
        $expiryDate = $rule->point_expiry_days
            ? date('Y-m-d', strtotime("+{$rule->point_expiry_days} days"))
            : null;


        $this->insertLog([
            'user_id'        => $payload['user_id'],
            'source_id'      => $payload['source_id'] ?? null,
            'source_type'    => $payload['source_type'] ?? 'S',
            'source_code'    => $payload['source_code'] ?? 'S',
            'activity_type'  => $rule->activity_name,
            'point_cat'      => 'EARNED',
            'amount'         => $rule->points,
            'point_status'   => 'Active',
            'description'    => $payload['description'] ?? null,
            'expiry_date'    => $expiryDate,
            'activated_at'   => date('Y-m-d H:i:s')
        ]);

        $this->db->query(
            "INSERT INTO user_points (user_id, current_balance, total_earned)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE
               current_balance = current_balance + VALUES(current_balance),
               total_earned    = total_earned + VALUES(total_earned)",
            [$payload['user_id'], $rule->points, $rule->points]
        );
    }

    /**
     * @throws Exception
     */
    protected function insertLog(array $data): void
    {
        $this->db->table('userpoint_logs')->insert($data);
        if ($this->db->error()['code'] !== 0) {
            throw new \Exception(
                'DB Error: ' . $this->db->error()['message']
            );
        }
    }
}

