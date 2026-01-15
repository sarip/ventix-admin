import { useState } from 'react';
import axios from 'axios';
import { ClockInRequest, ClockOutRequest, ClockInResponse, ClockOutResponse } from '@/types/attendance';
import { Attendance } from '@/models/Attendance';
import {PostResponse} from "@/types/apiTypes";

export const useAttendance = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const AttendanceModel = new Attendance();

    const clockIn = async (userId: number, lat: number, lon: number): Promise<PostResponse> => {
        setLoading(true);
        setError(null);

        try {
            const payload: ClockInRequest = {
                user_id: userId,
                lat,
                lon,
            };



            const response = await AttendanceModel.ClockIn(payload);

            setLoading(false);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.response?.data?.messages || 'Gagal clock-in';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    const clockOut = async (userId: number, lat: number, lon: number, notes?: string): Promise<PostResponse> => {
        setLoading(true);
        setError(null);

        try {
            const payload: ClockOutRequest = {
                user_id: userId,
                lat,
                lon,
                notes,
            };

            const response = await AttendanceModel.ClockOut(payload);

            setLoading(false);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.response?.data?.messages || 'Gagal clock-out';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };

    const getAttendance = async (userId?: number, date?: string): Promise<Attendance[]> => {
        setLoading(true);
        setError(null);

        try {
            const params: any = {};
            if (userId) params.user_id = userId;
            if (date) params.date = date;

            const response = await AttendanceModel.getAttendance(userId, date);

            setLoading(false);
            return response.attendances || [];
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Gagal mengambil data attendance';
            setError(errorMessage);
            setLoading(false);
            throw new Error(errorMessage);
        }
    };




    return {
        clockIn,
        clockOut,
        getAttendance,
        loading,
        error,
    };
};
