import { useState, useEffect } from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
    permissionGranted: boolean;
}

export const useGeolocation = () => {
    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        error: null,
        loading: false,
        permissionGranted: false,
    });

    const requestLocation = (): Promise<{ lat: number; lon: number }> => {
        return new Promise((resolve, reject) => {
            setState(prev => ({ ...prev, loading: true, error: null }));

            if (!navigator.geolocation) {
                const error = 'Geolocation tidak didukung oleh browser Anda';
                setState(prev => ({ ...prev, loading: false, error }));
                reject(new Error(error));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    setState({
                        latitude: lat,
                        longitude: lon,
                        error: null,
                        loading: false,
                        permissionGranted: true,
                    });

                    resolve({ lat, lon });
                },
                (error) => {
                    let errorMessage = 'Gagal mendapatkan lokasi';

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Izin lokasi ditolak. Mohon izinkan akses lokasi.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Informasi lokasi tidak tersedia.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Request lokasi timeout.';
                            break;
                    }

                    setState({
                        latitude: null,
                        longitude: null,
                        error: errorMessage,
                        loading: false,
                        permissionGranted: false,
                    });

                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        });
    };

    return {
        ...state,
        requestLocation,
    };
};
