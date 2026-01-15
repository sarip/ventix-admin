import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface LocationMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    location: {
        lat: number;
        lon: number;
        title: string;
        info?: string;
    } | null;
}

export default function LocationMapModal({ isOpen, onClose, location }: LocationMapModalProps) {
    const mapRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen || !location || !mapContainerRef.current) return;

        // Dynamic import Leaflet untuk avoid SSR issues
        import('leaflet').then((L) => {
            // Fix default icon
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });

            // Clear existing map
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }

            // Create new map
            if (mapContainerRef.current) {
                mapRef.current = L.map(mapContainerRef.current).setView([location.lat, location.lon], 15);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                }).addTo(mapRef.current);

                // Add marker
                L.marker([location.lat, location.lon])
                    .addTo(mapRef.current)
                    .bindPopup(`<strong>${location.title}</strong><br/>${location.info || ''}`)
                    .openPopup();
            }
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [isOpen, location]);

    if (!isOpen || !location) return null;

    return (
        <>
            <div
                className="modal fade show"
                style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                onClick={onClose}
            >
                <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="fas fa-map-marker-alt"></i> {location.title}
                            </h5>
                            <button type="button" className="close" onClick={onClose}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />
                            <div className="mt-3">
                                <p className="mb-1"><strong>Coordinates:</strong></p>
                                <p className="text-muted">
                                    Latitude: {location.lat.toFixed(6)}, Longitude: {location.lon.toFixed(6)}
                                </p>
                                {location.info && (
                                    <>
                                        <p className="mb-1"><strong>Info:</strong></p>
                                        <p className="text-muted">{location.info}</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                            <a
                                href={`https://www.google.com/maps?q=${location.lat},${location.lon}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                <i className="fas fa-external-link-alt"></i> Open in Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        </>
    );
}
