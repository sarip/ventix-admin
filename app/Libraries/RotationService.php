<?php

/**
 * Rotation Service
 * 
 * Handles automation of staff rotation and finding replacements for absent staff
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2025-12-12
 */

namespace App\Libraries;

use App\Models\User;
use App\Models\UserShift;
use App\Models\Attendance;
use App\Models\DutyAssignment;
use App\Models\UserSkill;
use App\Models\WorkOrder;

class RotationService
{
    protected $userModel;
    protected $userShiftModel;
    protected $attendanceModel;
    protected $dutyModel;
    protected $userSkillModel;
    protected $workOrderModel;
    protected $notificationService;
    protected $attendanceService;

    public function __construct()
    {
        $this->userModel = new User();
        $this->userShiftModel = new \App\Models\UserShift();
        $this->attendanceModel = new Attendance();
        $this->dutyModel = new DutyAssignment();
        $this->userSkillModel = new \App\Models\UserSkill();
        $this->workOrderModel = new WorkOrder();
        $this->notificationService = new NotificationService();
        $this->attendanceService = new AttendanceService();
    }

    /**
     * Find and assign replacement for absent staff
     * 
     * @param int $absentUserId
     * @param string $date
     * @return array
     */
    public function findReplacement($absentUserId, $date = null)
    {
        $date = $date ?? date('Y-m-d');

        // Get absent user's duty assignment for today
        $absentDuty = $this->dutyModel
            ->where('user_id', $absentUserId)
            ->where('start_date <=', $date)
            ->where('end_date >=', $date)
            ->first();

        if (!$absentDuty) {
            return [
                'success' => false,
                'message' => 'Tidak ada duty assignment untuk user yang absen'
            ];
        }

        // Get absent user's shift
        $absentShift = $this->userShiftModel->getUserShiftOnDate($absentUserId, $date);

        if (!$absentShift) {
            return [
                'success' => false,
                'message' => 'Tidak ada shift assignment untuk user yang absen'
            ];
        }

        // Get absent user's skills
        $absentSkills = $this->userSkillModel
            ->where('user_id', $absentUserId)
            ->findAll();

        $skillIds = array_column($absentSkills, 'skill_id');

        // Find replacement candidates
        $candidates = $this->findReplacementCandidates(
            $absentShift->shift_id,
            $skillIds,
            $absentDuty->duty_type,
            $date,
            $absentUserId
        );

        if (empty($candidates)) {
            // Notify supervisor - no replacement found
            $this->notifySupervisorNoReplacement($absentUserId, $absentDuty);

            return [
                'success' => false,
                'message' => 'Tidak ada pengganti yang tersedia'
            ];
        }

        // Select best candidate (lowest workload)
        $replacement = $this->selectBestReplacement($candidates);

        // Create temporary duty assignment for replacement
        $newDutyId = $this->assignReplacement(
            $replacement['user_id'],
            $absentDuty,
            $date
        );

        // Notify replacement and supervisor
        $this->notifyReplacement($replacement['user_id'], $absentUserId, $absentDuty, $newDutyId);
        $this->notifySupervisor($absentUserId, $replacement, $absentDuty);

        return [
            'success' => true,
            'replacement_user_id' => $replacement['user_id'],
            'replacement_name' => $replacement['fullname'],
            'duty_id' => $newDutyId,
            'message' => "Pengganti ditemukan: {$replacement['fullname']}"
        ];
    }

    /**
     * Find candidates for replacement
     */
    private function findReplacementCandidates($shiftId, $skillIds, $dutyType, $date, $excludeUserId)
    {
        $candidates = [];

        // Step 1: Get users on the same shift
        $usersOnShift = $this->userShiftModel->getUsersByShift($shiftId, $date);

        foreach ($usersOnShift as $user) {
            // Skip the absent user
            if ($user->user_id == $excludeUserId) {
                continue;
            }

            // Step 2: Check if user has clocked in
            $attendance = $this->attendanceModel
                ->where('user_id', $user->user_id)
                ->where('attendance_date', $date)
                ->where('clock_in IS NOT NULL')
                ->where('clock_out IS NULL')
                ->first();

            if (!$attendance) {
                continue; // User not clocked in or already clocked out
            }

            // Step 3: Check if user has similar skills
            $userSkills = $this->userSkillModel
                ->select('skill_id')
                ->where('user_id', $user->user_id)
                ->whereIn('skill_id', $skillIds)
                ->findAll();

            $matchingSkills = count($userSkills);

            if ($matchingSkills == 0 && !empty($skillIds)) {
                continue; // No matching skills
            }

            // Step 4: Check if user already has duty assignment today
            $existingDuty = $this->dutyModel
                ->where('user_id', $user->user_id)
                ->where('start_date <=', $date)
                ->where('end_date >=', $date)
                ->first();

            // Prefer users without existing duty
            $hasDuty = $existingDuty ? true : false;

            // Step 5: Calculate current workload
            $workload = $this->workOrderModel
                ->where('assigned_to', $user->user_id)
                ->whereNotIn('status', ['done', 'cancelled'])
                ->countAllResults();

            $candidates[] = [
                'user_id' => $user->user_id,
                'fullname' => $user->fullname,
                'email' => $user->email,
                'matching_skills' => $matchingSkills,
                'has_duty' => $hasDuty,
                'workload' => $workload
            ];
        }

        return $candidates;
    }

    /**
     * Select best replacement (most skills, no existing duty, lowest workload)
     */
    private function selectBestReplacement($candidates)
    {
        usort($candidates, function ($a, $b) {
            // Prefer users without existing duty
            if ($a['has_duty'] !== $b['has_duty']) {
                return $a['has_duty'] - $b['has_duty'];
            }

            // Then by matching skills (higher is better)
            if ($a['matching_skills'] !== $b['matching_skills']) {
                return $b['matching_skills'] - $a['matching_skills'];
            }

            // Then by workload (lower is better)
            return $a['workload'] - $b['workload'];
        });

        return $candidates[0];
    }

    /**
     * Assign replacement by creating temporary duty assignment
     */
    private function assignReplacement($userId, $originalDuty, $date)
    {
        $data = [
            'user_id' => $userId,
            'shift_id' => $originalDuty->shift_id,
            'start_date' => $date,
            'end_date' => $date, // Only for today
            'duty_type' => $originalDuty->duty_type,
            'asset_id' => $originalDuty->asset_id,
            'space_id' => $originalDuty->space_id,
            'zone_id' => $originalDuty->zone_id,
            'rotation' => 'none',
            'notes' => "Replacement for absent staff (original duty_id: {$originalDuty->id})"
        ];

        return $this->dutyModel->insert($data);
    }

    /**
     * Notify replacement technician
     */
    private function notifyReplacement($replacementUserId, $absentUserId, $duty, $dutyId)
    {
        $absentUser = $this->userModel->find($absentUserId);

        $this->notificationService->create(
            $replacementUserId,
            'duty_replacement',
            'duty_assignment',
            $dutyId,
            'Anda Menggantikan Petugas yang Absen',
            "Anda ditugaskan menggantikan {$absentUser->fullname} sebagai {$duty->duty_type} hari ini"
        );
    }

    /**
     * Notify supervisor about replacement
     */
    private function notifySupervisor($absentUserId, $replacement, $duty)
    {
        $absentUser = $this->userModel->find($absentUserId);

        // TODO: Get actual supervisor IDs from role/permission system
        $supervisorIds = [1]; // Placeholder

        foreach ($supervisorIds as $supervisorId) {
            $this->notificationService->create(
                $supervisorId,
                'technician_absent',
                'duty_assignment',
                $duty->id,
                'Petugas Absen - Pengganti Ditugaskan',
                "{$absentUser->fullname} tidak hadir. {$replacement['fullname']} telah ditugaskan sebagai pengganti."
            );
        }
    }

    /**
     * Notify supervisor when no replacement found
     */
    private function notifySupervisorNoReplacement($absentUserId, $duty)
    {
        $absentUser = $this->userModel->find($absentUserId);

        // TODO: Get actual supervisor IDs
        $supervisorIds = [1]; // Placeholder

        foreach ($supervisorIds as $supervisorId) {
            $this->notificationService->create(
                $supervisorId,
                'technician_absent',
                'duty_assignment',
                $duty->id,
                'URGENT: Petugas Absen - Tidak Ada Pengganti',
                "{$absentUser->fullname} tidak hadir dan tidak ada pengganti yang tersedia untuk duty {$duty->duty_type}"
            );
        }
    }

    /**
     * Process all absent staff for today and find replacements
     * 
     * @return array
     */
    public function processAbsentStaff()
    {
        $absentStaff = $this->attendanceService->detectAbsentStaff();
        $results = [];

        foreach ($absentStaff as $absent) {
            $result = $this->findReplacement($absent['user_id']);
            $results[] = [
                'absent_user_id' => $absent['user_id'],
                'absent_name' => $absent['fullname'],
                'replacement_result' => $result
            ];
        }

        return $results;
    }
}
