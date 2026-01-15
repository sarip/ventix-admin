<?php

/**
 * Attendance Service
 * 
 * Handles clock-in/out logic, GPS validation, shift validation, and attendance tracking
 * 
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @date 2025-12-12
 */

namespace App\Libraries;

use App\Models\Attendance;
use App\Models\UserShift;
use App\Models\DutyAssignment;
use App\Models\Shift;

class AttendanceService
{
    protected $attendanceModel;
    protected $userShiftModel;
    protected $dutyModel;
    protected $shiftModel;
    protected $notificationService;

    public function __construct()
    {
        $this->attendanceModel = new Attendance();
        $this->userShiftModel = new \App\Models\UserShift();
        $this->dutyModel = new DutyAssignment();
        $this->shiftModel = new Shift();
        $this->notificationService = new NotificationService();
    }

    /**
     * Clock in a user with GPS validation
     * 
     * @param int $userId
     * @param float $lat
     * @param float $lon
     * @return array
     */
    public function clockIn($userId, $lat, $lon)
    {
        $today = date('Y-m-d');
        $now = date('Y-m-d H:i:s');

        // Check if already clocked in today
        $existing = $this->attendanceModel
            ->where('user_id', $userId)
            ->where('attendance_date', $today)
            ->first();

        if ($existing && $existing->clock_in) {
            return [
                'success' => false,
                'message' => 'Anda sudah clock-in hari ini pada ' . $existing->clock_in
            ];
        }

        // Get user's shift for today
        $userShift = $this->userShiftModel->getUserShiftOnDate($userId, $today);

        if (!$userShift) {
            return [
                'success' => false,
                'message' => 'Anda tidak memiliki shift hari ini'
            ];
        }

        // Get active duty assignment
        $duty = $this->dutyModel
            ->where('user_id', $userId)
            ->where('start_date <=', $today)
            ->where('end_date >=', $today)
            ->first();



        // Determine status (present/late)
        $clockInTime = date('H:i:s', strtotime($now));
        $status = 'present';

        if ($clockInTime > $userShift->start_time) {
            // Late by more than 15 minutes
            $lateMinutes = (strtotime($clockInTime) - strtotime($userShift->start_time)) / 60;
            if ($lateMinutes > 15) {
                $status = 'late';
            }
        }

        $data = [
            'user_id' => $userId,
            'shift_id' => $userShift->shift_id,
            'duty_assignment_id' => $duty->id ?? null,
            'attendance_date' => $today,
            'clock_in' => $now,
            'geo_in' => "{$lat},{$lon}",
            'status' => $status,
        ];

        if ($existing) {
            // Update existing record
            $this->attendanceModel->update($existing->id, $data);
            $attendanceId = $existing->id;
        } else {
            // Create new record
            $attendanceId = $this->attendanceModel->insert($data);
        }

        // Send notification
        $this->notificationService->create(
            $userId,
            'clock_in_success',
            'attendance',
            $attendanceId,
            'Clock-In Berhasil',
            "Anda telah clock-in pada {$now}" . ($status === 'late' ? ' (Terlambat)' : '')
        );

        return [
            'success' => true,
            'message' => 'Clock-in berhasil',
            'status' => $status,
            'attendance_id' => $attendanceId,
            'shift' => $userShift
        ];
    }

    /**
     * Clock out a user
     * 
     * @param int $userId
     * @param float $lat
     * @param float $lon
     * @param string $notes
     * @return array
     */
    public function clockOut($userId, $lat, $lon, $notes = '')
    {
        $today = date('Y-m-d');
        $now = date('Y-m-d H:i:s');

        $attendance = $this->attendanceModel
            ->where('user_id', $userId)
            ->where('attendance_date', $today)
            ->first();

        if (!$attendance) {
            return [
                'success' => false,
                'message' => 'Anda belum clock-in hari ini'
            ];
        }

        if ($attendance->clock_out) {
            return [
                'success' => false,
                'message' => 'Anda sudah clock-out pada ' . $attendance->clock_out
            ];
        }

        $this->attendanceModel->update($attendance->id, [
            'clock_out' => $now,
            'geo_out' => "{$lat},{$lon}",
            'notes' => $notes
        ]);

        // Send notification
        $this->notificationService->create(
            $userId,
            'clock_out_success',
            'attendance',
            $attendance->id,
            'Clock-Out Berhasil',
            "Anda telah clock-out pada {$now}. Terima kasih atas kerja keras Anda hari ini!"
        );

        return [
            'success' => true,
            'message' => 'Clock-out berhasil',
            'attendance_id' => $attendance->id
        ];
    }

    /**
     * Get real-time staff status for supervisor dashboard
     * 
     * @param array $filters
     * @return array
     */
    public function getStaffStatus($filters = [])
    {
        $today = date('Y-m-d');
        $now = date('Y-m-d H:i:s');

        $query = $this->attendanceModel
            ->select('attendances.*, users.fullname, users.email, shifts.name as shift_name, shifts.start_time, shifts.end_time')
            ->join('users', 'users.id = attendances.user_id')
            ->join('shifts', 'shifts.id = attendances.shift_id', 'left')
            ->where('attendances.attendance_date', $today);

        if (isset($filters['duty_type'])) {
            $query->join('duty_assignments', 'duty_assignments.id = attendances.duty_assignment_id')
                ->where('duty_assignments.duty_type', $filters['duty_type']);
        }

        $attendances = $query->findAll();

        $result = [
            'total_staff' => count($attendances),
            'clocked_in' => 0,
            'clocked_out' => 0,
            'on_shift' => 0,
            'late' => 0,
            'absent' => 0,
            'staff' => []
        ];

        foreach ($attendances as $att) {
            $isOnShift = false;
            $currentTime = date('H:i:s');

            if ($att->start_time && $att->end_time) {
                $isOnShift = ($currentTime >= $att->start_time && $currentTime <= $att->end_time);
            }

            if ($att->clock_in)
                $result['clocked_in']++;
            if ($att->clock_out)
                $result['clocked_out']++;
            if ($isOnShift)
                $result['on_shift']++;
            if ($att->status === 'late')
                $result['late']++;
            if ($att->status === 'absent')
                $result['absent']++;

            $result['staff'][] = [
                'user_id' => $att->user_id,
                'fullname' => $att->fullname,
                'email' => $att->email,
                'shift_name' => $att->shift_name,
                'clock_in' => $att->clock_in,
                'clock_out' => $att->clock_out,
                'geo_in' => $att->geo_in,
                'geo_out' => $att->geo_out,
                'status' => $att->status,
                'is_on_shift' => $isOnShift
            ];
        }

        return $result;
    }

    /**
     * Detect absent staff (no clock-in 30min after shift start)
     * 
     * @return array
     */
    public function detectAbsentStaff()
    {
        $today = date('Y-m-d');
        $currentTime = date('H:i:s');
        $absentStaff = [];

        // Get all active shifts
        $activeShifts = $this->userShiftModel
            ->select('user_shifts.*, users.fullname, shifts.start_time')
            ->join('users', 'users.id = user_shifts.user_id')
            ->join('shifts', 'shifts.id = user_shifts.shift_id')
            ->where('user_shifts.effective_date <=', $today)
            ->where('user_shifts.is_active', 1)
            ->groupStart()
            ->where('user_shifts.end_date >=', $today)
            ->orWhere('user_shifts.end_date IS NULL')
            ->groupEnd()
            ->findAll();

        foreach ($activeShifts as $userShift) {
            // Check if 30 minutes past shift start time
            $shiftStart = strtotime($userShift->start_time);
            $graceTime = $shiftStart + (30 * 60); // 30 minutes grace period

            if (strtotime($currentTime) > $graceTime) {
                // Check if user has clocked in
                $attendance = $this->attendanceModel
                    ->where('user_id', $userShift->user_id)
                    ->where('attendance_date', $today)
                    ->first();

                if (!$attendance || !$attendance->clock_in) {
                    // Mark as absent
                    if ($attendance) {
                        $this->attendanceModel->update($attendance->id, ['status' => 'absent']);
                    } else {
                        $this->attendanceModel->insert([
                            'user_id' => $userShift->user_id,
                            'shift_id' => $userShift->shift_id,
                            'attendance_date' => $today,
                            'status' => 'absent'
                        ]);
                    }

                    $absentStaff[] = [
                        'user_id' => $userShift->user_id,
                        'fullname' => $userShift->fullname,
                        'shift_id' => $userShift->shift_id,
                        'shift_start' => $userShift->start_time
                    ];
                }
            }
        }

        return $absentStaff;
    }
}
