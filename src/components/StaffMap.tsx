import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with Leaflet + webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface StaffLocation {
    user_id: number;
    fullname: string;
    lat: number;
    lon: number;
    status: string;
    clock_in?: string;
}   

interface StaffMapProps {
    locations: StaffLocation[];
    height?: string;
}

export default function StaffMap({ locations, height = '400px' }: StaffMapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<L.Marker[]>([]);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize map only once
        if (!mapRef.current) {
            // Default center (Jakarta)
            const defaultCenter: [number, number] = [-6.2088, 106.8456];

            mapRef.current = L.map(mapContainerRef.current).setView(defaultCenter, 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(mapRef.current);
        }

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new markers
        if (locations && locations.length > 0) {
            const bounds: [number, number][] = [];

            locations.forEach(loc => {
                const statusColor = getMarkerColor(loc.status);

                const customIcon = L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="
            background-color: ${statusColor};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
          ">${loc.fullname.charAt(0)}</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                });

                const marker = L.marker([loc.lat, loc.lon], { icon: customIcon })
                    .bindPopup(`
            <div style="min-width: 200px;">
              <h6 style="margin: 0 0 10px 0; font-weight: bold;">${loc.fullname}</h6>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${statusColor};">${loc.status.toUpperCase()}</span></p>
              <p style="margin: 5px 0;"><strong>Clock In:</strong> ${loc.clock_in ? new Date(loc.clock_in).toLocaleTimeString('id-ID') : 'N/A'}</p>
              <p style="margin: 5px 0;"><strong>Location:</strong> ${loc.lat.toFixed(6)}, ${loc.lon.toFixed(6)}</p>
            </div>
          `);

                if (mapRef.current) {
                    marker.addTo(mapRef.current);
                    markersRef.current.push(marker);
                    bounds.push([loc.lat, loc.lon]);
                }
            });

            // Fit bounds to show all markers
            if (bounds.length > 0 && mapRef.current) {
                mapRef.current.fitBounds(bounds, { padding: [50, 50] });
            }
        }

        return () => {
            // Cleanup on unmount
            markersRef.current.forEach(marker => marker.remove());
        };
    }, [locations]);

    const getMarkerColor = (status: string): string => {
        const colors: Record<string, string> = {
            present: '#28a745',
            late: '#ffc107',
            absent: '#dc3545',
            on_leave: '#17a2b8',
        };
        return colors[status] || '#6c757d';
    };

    return (
        <div>
            <div
                ref={mapContainerRef}
                style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}
            />
            <div style={{ marginTop: '10px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#28a745' }}></div>
                    <small>Present</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#ffc107' }}></div>
                    <small>Late</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#dc3545' }}></div>
                    <small>Absent</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#17a2b8' }}></div>
                    <small>On Leave</small>
                </div>
            </div>
        </div>
    );
}
