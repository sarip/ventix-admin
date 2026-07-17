<?php

namespace App\Models;

use CodeIgniter\Model;

class FacilityStatistic extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'facility_statistics';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'object';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'facility_id',
        'total_bookings',
        'total_revenue',
        'total_visitors',
        'total_events',
        'total_followers',
        'total_reviews',
        'average_rating',
        'last_calculated_at'
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $beforeUpdate   = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterInsert    = [];
    protected $afterUpdate    = [];
    protected $afterDelete    = [];

    /**
     * Get statistics for a facility
     */
    public function getFacilityStatistics($facilityId)
    {
        return $this->where('facility_id', $facilityId)->first();
    }

    /**
     * Calculate and update statistics for a facility
     * This should be called via cron job or realtime event
     */
    public function calculateStatistics($facilityId)
    {
        $db = \Config\Database::connect();

        // Calculate total bookings
        $totalBookings = $db->table('facility_bookings')
                            ->where('facility_id', $facilityId)
                            ->where('status', 'confirmed')
                            ->countAllResults();

        // Calculate total revenue
        $totalRevenue = $db->table('facility_bookings')
                          ->selectSum('final_amount')
                          ->where('facility_id', $facilityId)
                          ->where('status', 'confirmed')
                          ->get()
                          ->getRow()
                          ->final_amount ?? 0;

        // Calculate total unique visitors (from bookings)
        $totalVisitors = $db->table('facility_bookings')
                            ->selectCount('DISTINCT user_id')
                            ->where('facility_id', $facilityId)
                            ->where('status', 'confirmed')
                            ->get()
                            ->getRow()
                            ->{'COUNT(DISTINCT user_id)'} ?? 0;

        // Calculate total events at facility
        $totalEvents = $db->table('events')
                          ->where('facility_id', $facilityId)
                          ->countAllResults();

        // Calculate total followers
        $totalFollowers = $db->table('member_follows')
                             ->where('following_id', $facilityId)
                             ->where('following_type', 'FACILITY')
                             ->countAllResults();

        // Calculate total reviews and average rating
        $reviews = $db->table('member_ratings')
                      ->where('entity_id', $facilityId)
                      ->where('entity_type', 'FACILITY')
                      ->selectCount('id')
                      ->selectAvg('rating')
                      ->get()
                      ->getRow();

        $totalReviews = $reviews->id_count ?? 0;
        $averageRating = $reviews->rating ? round($reviews->rating, 2) : 0.00;

        // Get existing statistics or create new
        $stats = $this->getFacilityStatistics($facilityId);

        $data = [
            'facility_id' => $facilityId,
            'total_bookings' => $totalBookings,
            'total_revenue' => $totalRevenue,
            'total_visitors' => $totalVisitors,
            'total_events' => $totalEvents,
            'total_followers' => $totalFollowers,
            'total_reviews' => $totalReviews,
            'average_rating' => $averageRating,
            'last_calculated_at' => date('Y-m-d H:i:s')
        ];

        if ($stats) {
            return $this->update($stats->id, $data);
        } else {
            return $this->insert($data);
        }
    }

    /**
     * Increment a specific counter
     */
    public function incrementCounter($facilityId, $field, $amount = 1)
    {
        $stats = $this->getFacilityStatistics($facilityId);

        if (!$stats) {
            $this->insert([
                'facility_id' => $facilityId,
                $field => $amount,
                'last_calculated_at' => date('Y-m-d H:i:s')
            ]);
        } else {
            $this->update($stats->id, [
                $field => $stats->$field + $amount,
                'last_calculated_at' => date('Y-m-d H:i:s')
            ]);
        }

        return true;
    }
}
