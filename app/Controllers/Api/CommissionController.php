<?php

namespace App\Controllers\Api;

use App\Models\OrderCommission;
use CodeIgniter\API\ResponseTrait;

class CommissionController extends ApiController
{
    use ResponseTrait;

    protected $commissionModel;

    public function __construct()
    {
        $this->commissionModel = new OrderCommission();
    }

    /**
     * Get list of commissions with pagination and filters
     */
    public function index()
    {
        $search = $this->request->getGet('search');
        $module = $this->request->getGet('module');
        $startDate = $this->request->getGet('start_date');
        $endDate = $this->request->getGet('end_date');
        $page = $this->request->getGet('page') ?? 1;
        $perPage = $this->request->getGet('per_page') ?? 10;

        $builder = $this->commissionModel->builder();
        $builder->select('order_commissions.*, orders.order_code, users.username as customer_name');
        $builder->join('orders', 'orders.id = order_commissions.order_id');
        $builder->join('users', 'users.id = orders.user_id');

        if ($search) {
            $builder->groupStart()
                ->like('orders.order_code', $search)
                ->orLike('users.username', $search)
                ->orLike('order_commissions.rule_key', $search)
                ->groupEnd();
        }

        if ($module) {
            $builder->where('order_commissions.module', $module);
        }

        if ($startDate && $endDate) {
            $builder->where('order_commissions.created_at >=', $startDate . ' 00:00:00');
            $builder->where('order_commissions.created_at <=', $endDate . ' 23:59:59');
        }

        $total = $builder->countAllResults(false);
        $data = $builder->orderBy('order_commissions.created_at', 'DESC')
            ->limit($perPage, ($page - 1) * $perPage)
            ->get()
            ->getResult();

        return $this->successOutput([
            'commissions' => $data,
            'pagination' => [
                'total' => $total,
                'filtered_total' => $total,
                'per_page' => (int) $perPage,
                'page_count' => ceil($total / $perPage),
                'current_page' => (int) $page
            ]
        ]);
    }

    /**
     * Aggregated analysis data
     */
    public function analysis()
    {
        $startDate = $this->request->getGet('start_date');
        $endDate = $this->request->getGet('end_date');

        if (!$startDate)
            $startDate = date('Y-m-d', strtotime('-30 days'));
        if (!$endDate)
            $endDate = date('Y-m-d');

        // 1. Summary Totals
        $summary = $this->commissionModel->builder()
            ->select('rule_key, SUM(calculated_amount) as total')
            ->where('created_at >=', $startDate . ' 00:00:00')
            ->where('created_at <=', $endDate . ' 23:59:59')
            ->groupBy('rule_key')
            ->get()
            ->getResult();

        // 2. Module Distribution
        $modules = $this->commissionModel->builder()
            ->select('module, SUM(calculated_amount) as total')
            ->where('created_at >=', $startDate . ' 00:00:00')
            ->where('created_at <=', $endDate . ' 23:59:59')
            ->groupBy('module')
            ->get()
            ->getResult();

        // 3. Trend Data (Daily)
        $trends = $this->commissionModel->builder()
            ->select("DATE(created_at) as date, SUM(calculated_amount) as total")
            ->where('created_at >=', $startDate . ' 00:00:00')
            ->where('created_at <=', $endDate . ' 23:59:59')
            ->groupBy('DATE(created_at)')
            ->orderBy('date', 'ASC')
            ->get()
            ->getResult();

        return $this->successOutput([
            'summary' => $summary,
            'modules' => $modules,
            'trends' => $trends,
            'period' => [
                'start' => $startDate,
                'end' => $endDate
            ]
        ]);
    }
}
