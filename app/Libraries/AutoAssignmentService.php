<?php

/**
 * Auto Assignment Service
 * 
 * Handles skill-based automatic assignment of tickets/work orders to technicians
 * Filters by: skill match, active shift, clocked-in status, duty location, and workload
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2025-12-12
 */

namespace App\Libraries;

use App\Models\User;
use App\Models\UserSkill;
use App\Models\UserShift;
use App\Models\Attendance;
use App\Models\DutyAssignment;
use App\Models\WorkOrder;
use App\Models\Skill;

class AutoAssignmentService
{
    protected $userModel;
    protected $userSkillModel;
    protected $userShiftModel;
    protected $attendanceModel;
    protected $dutyModel;
    protected $workOrderModel;
    protected $skillModel;
    protected $notificationService;

    public function __construct()
    {
        $this->userModel = new User();
        $this->userSkillModel = new \App\Models\UserSkill();
        $this->userShiftModel = new \App\Models\UserShift();
        $this->attendanceModel = new Attendance();
        $this->dutyModel = new DutyAssignment();
        $this->workOrderModel = new WorkOrder();
        $this->skillModel = new Skill();
        $this->notificationService = new NotificationService();
    }

    /**
     * Auto-assign a ticket/work order to the best available technician
     * 
     * @param int $ticketId
     * @param array $requiredSkills Array of skill IDs or names
     * @param int|null $locationId (asset_id, space_id, or zone_id)
     * @param string|null $locationType ('asset', 'space', 'zone')
     * @return array
     */
    public function autoAssign($ticketId, $requiredSkills = [], $locationId = null, $locationType = null)
    {
        $today = date('Y-m-d');
        $now = date('Y-m-d H:i:s');

        // Step 1: Get technicians with matching skills
        $candidates = $this->filterBySkills($requiredSkills);

        if (empty($candidates)) {
            return [
                'success' => false,
                'message' => 'Tidak ada teknisi dengan skill yang sesuai'
            ];
        }

        // Step 2: Filter by active shift
        $candidates = $this->filterByActiveShift($candidates, $now);

        if (empty($candidates)) {
            return [
                'success' => false,
                'message' => 'Tidak ada teknisi yang sedang bertugas (on shift)'
            ];
        }

        // Step 3: Filter by clocked-in status
        $candidates = $this->filterByClockedIn($candidates, $today);

        if (empty($candidates)) {
            return [
                'success' => false,
                'message' => 'Tidak ada teknisi yang sudah clock-in hari ini'
            ];
        }

        // Step 4: Filter by duty location (if applicable)
        if ($locationId && $locationType) {
            $candidates = $this->filterByDutyLocation($candidates, $locationId, $locationType, $today);

            if (empty($candidates)) {
                // Relaxed: if no exact location match, continue with all clocked-in candidates
                log_message('info', "No technicians assigned to {$locationType}:{$locationId}, using all available");
            }
        }

        // Step 5: Calculate workload for each candidate
        $candidates = $this->calculateWorkload($candidates);

        // Step 6: Select the best candidate (highest skill level + lowest workload)
        $bestCandidate = $this->selectBestCandidate($candidates);

        if (!$bestCandidate) {
            return [
                'success' => false,
                'message' => 'Tidak dapat menemukan teknisi yang sesuai'
            ];
        }

        // Send notification to assigned technician
        $this->notificationService->create(
            $bestCandidate['user_id'],
            'wo_assigned',
            'ticket',
            $ticketId,
            'Work Order Baru Ditugaskan',
            "Anda telah ditugaskan untuk menangani tiket #{$ticketId}"
        );

        return [
            'success' => true,
            'assigned_to' => $bestCandidate['user_id'],
            'technician_name' => $bestCandidate['fullname'],
            'skill_level' => $bestCandidate['skill_level'],
            'current_workload' => $bestCandidate['workload'],
            'message' => "Berhasil assign ke {$bestCandidate['fullname']}"
        ];
    }

    /**
     * Filter technicians by required skills
     */
    private function filterBySkills($requiredSkills)
    {
        if (empty($requiredSkills)) {
            // No specific skill required, get all technicians
            return $this->userModel
                ->select('users.id as user_id, users.fullname, users.email')
                ->where('users.is_active', 1)
                ->findAll();
        }

        // Normalize skill inputs (could be IDs or names)
        $skillIds = [];
        foreach ($requiredSkills as $skill) {
            if (is_numeric($skill)) {
                $skillIds[] = $skill;
            } else {
                $skillObj = $this->skillModel->where('name', $skill)->first();
                if ($skillObj) {
                    $skillIds[] = $skillObj->id;
                }
            }
        }

        if (empty($skillIds)) {
            return [];
        }

        // Get users with these skills
        $results = $this->userSkillModel
            ->select('user_skills.user_id, user_skills.level, users.fullname, users.email, skills.name as skill_name')
            ->join('users', 'users.id = user_skills.user_id')
            ->join('skills', 'skills.id = user_skills.skill_id')
            ->whereIn('user_skills.skill_id', $skillIds)
            ->where('users.is_active', 1)
            ->findAll();

        // Add skill level score (expert=3, intermediate=2, beginner=1)
        $candidates = [];
        foreach ($results as $result) {
            $skillScore = match ($result->level) {
                'expert' => 3,
                'intermediate' => 2,
                'beginner' => 1,
                default => 1
            };

            $candidates[] = [
                'user_id' => $result->user_id,
                'fullname' => $result->fullname,
                'email' => $result->email,
                'skill_level' => $skillScore,
                'skill_name' => $result->skill_name
            ];
        }

        return $candidates;
    }

    /**
     * Filter by active shift (currently on duty)
     */
    private function filterByActiveShift($candidates, $datetime)
    {
        $filtered = [];

        foreach ($candidates as $candidate) {
            $isOnShift = $this->userShiftModel->isUserOnShift($candidate['user_id'], $datetime);

            if ($isOnShift) {
                $filtered[] = $candidate;
            }
        }

        return $filtered;
    }

    /**
     * Filter by clocked-in status
     */
    private function filterByClockedIn($candidates, $date)
    {
        $userIds = array_column($candidates, 'user_id');

        $clockedIn = $this->attendanceModel
            ->select('user_id')
            ->whereIn('user_id', $userIds)
            ->where('attendance_date', $date)
            ->where('clock_in IS NOT NULL')
            ->where('clock_out IS NULL')
            ->findAll();

        $clockedInIds = array_column($clockedIn, 'user_id');

        return array_filter($candidates, function ($candidate) use ($clockedInIds) {
            return in_array($candidate['user_id'], $clockedInIds);
        });
    }

    /**
     * Filter by duty location
     */
    private function filterByDutyLocation($candidates, $locationId, $locationType, $date)
    {
        $userIds = array_column($candidates, 'user_id');

        $locationField = match ($locationType) {
            'asset' => 'asset_id',
            'space' => 'space_id',
            'zone' => 'zone_id',
            default => 'asset_id'
        };

        $onDuty = $this->dutyModel
            ->select('user_id')
            ->whereIn('user_id', $userIds)
            ->where($locationField, $locationId)
            ->where('start_date <=', $date)
            ->where('end_date >=', $date)
            ->findAll();

        $onDutyIds = array_column($onDuty, 'user_id');

        return array_filter($candidates, function ($candidate) use ($onDutyIds) {
            return in_array($candidate['user_id'], $onDutyIds);
        });
    }

    /**
     * Calculate current workload (number of active work orders)
     */
    private function calculateWorkload($candidates)
    {
        foreach ($candidates as &$candidate) {
            $workload = $this->workOrderModel
                ->where('assigned_to', $candidate['user_id'])
                ->whereNotIn('status', ['done', 'cancelled'])
                ->countAllResults();

            $candidate['workload'] = $workload;
        }

        return $candidates;
    }

    /**
     * Select the best candidate (highest skill + lowest workload)
     */
    private function selectBestCandidate($candidates)
    {
        if (empty($candidates)) {
            return null;
        }

        // Sort by skill level (desc) then workload (asc)
        usort($candidates, function ($a, $b) {
            // First compare by skill level (higher is better)
            if ($a['skill_level'] !== $b['skill_level']) {
                return $b['skill_level'] - $a['skill_level'];
            }

            // If same skill level, compare by workload (lower is better)
            return $a['workload'] - $b['workload'];
        });

        return $candidates[0];
    }
}
