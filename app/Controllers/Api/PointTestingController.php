<?php
/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-19
 */


namespace App\Controllers\Api;

use App\Filters\SearchFilter;
use App\Libraries\UserPointService;
use App\Models\User;
use App\Models\UserPoint;
use App\Models\UserpointLog;
use CodeIgniter\HTTP\ResponseInterface;
use Throwable;

class PointTestingController extends ApiController
{

    protected UserPointService $service;

    public function __construct()
    {
        $this->service = new UserPointService();
    }

    /**
     * =====================================================
     * TEST: EARN POINT
     * =====================================================
     * POST /test/user-point/earn
     */
    public function earn(): ResponseInterface
    {
        try {
            $payload = [
                'user_id'        => 1,
                'activity_group' => 'LOGIN',
                'description'    => '',
//                'transaction_amount' => 50000

            ];

            $result = $this->service->earn($payload);

            return $this->response->setJSON([
                'status'  => 'success',
                'earned'  => $result,
                'payload' => $payload
            ]);

        } catch (Throwable $e) {
            return $this->fail($e->getMessage());
        }
    }

    /**
     * =====================================================
     * TEST: IDEMPOTENCY
     * =====================================================
     * POST /test/user-point/idempotent
     */
    public function idempotent(): ResponseInterface
    {
        try {
            $payload = [
                'user_id'            => (int) $this->request->getPost('user_id'),
                'activity_group'     => $this->request->getPost('activity_group'),
                'transaction_amount' => (int) $this->request->getPost('transaction_amount'),
                'reference_id'       => $this->request->getPost('reference_id'),
                'description'        => 'Idempotency Test'
            ];

            // Call twice (simulate retry / webhook duplicate)
            $first  = $this->service->earn($payload);
            $second = $this->service->earn($payload);

            return $this->response->setJSON([
                'status'  => 'success',
                'first'   => $first,
                'second'  => $second,
                'note'    => 'Second call should not add point again'
            ]);

        } catch (Throwable $e) {
            return $this->fail($e->getMessage());
        }
    }

    /**
     * =====================================================
     * TEST: REDEEM POINT
     * =====================================================
     * POST /test/user-point/redeem
     */
    public function redeem(): ResponseInterface
    {
        try {
            $userId = 1;
            $amount = 500;

            $this->service->redeem($userId, $amount, 'Test Redeem');

            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'Point redeemed',
                'user_id' => $userId,
                'amount'  => $amount
            ]);

        } catch (Throwable $e) {
            return $this->fail($e->getMessage());
        }
    }

    /**
     * =====================================================
     * TEST: EXPIRE POINT
     * =====================================================
     * GET /test/user-point/expire
     */
    public function expire(): ResponseInterface
    {
        try {
            $expired = $this->service->expire();

            return $this->response->setJSON([
                'status'  => 'success',
                'expired' => $expired
            ]);

        } catch (Throwable $e) {
            return $this->fail($e->getMessage());
        }
    }
}
