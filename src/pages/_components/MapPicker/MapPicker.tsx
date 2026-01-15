'use client';

import React, { useMemo, useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Swal from "sweetalert2";
import { isInsideIndonesia } from "@/utils/geo";

/* fix marker icon */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
    latitude?: string;
    longitude?: string;
    onChange: (lat: string, lng: string, label?: string) => void;
}

export default function MapPicker({ latitude, longitude, onChange }: Props) {
    const mapRef = useRef<L.Map | null>(null);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const center = useMemo<[number, number]>(() => [
        latitude ? +latitude : -6.2,
        longitude ? +longitude : 106.816,
    ], [latitude, longitude]);

    /* search lokasi dengan debounce */
    useEffect(() => {
        if (search.length < 3) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const t = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=id&q=${encodeURIComponent(search)}`
                );
                setResults(await res.json());
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(t);
    }, [search]);

    const setLocation = (lat: number, lng: number, label?: string) => {
        if (!isInsideIndonesia(lat, lng)) {
            Swal.fire("Warning", "Lokasi harus di Indonesia", "warning");
            return;
        }

        onChange(lat.toFixed(6), lng.toFixed(6), label);
        mapRef.current?.setView([lat, lng], 15, { animate: true });
    };

    const MapClick = () => {
        useMapEvents({
            click(e) {
                setLocation(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    return (
        <div className="map-picker-container">
            {/* COORDINATE DISPLAY */}
            <div className="alert alert-info mb-3 d-flex align-items-center justify-content-between">
                <div>
                    <i className="bx bx-map-pin me-2"></i>
                    <strong>Koordinat:</strong>
                    <span className="ms-2 font-monospace">
                        {latitude && longitude
                            ? `${parseFloat(latitude).toFixed(6)}, ${parseFloat(longitude).toFixed(6)}`
                            : 'Belum dipilih'}
                    </span>
                </div>
                {latitude && longitude && (
                    <a
                        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                    >
                        <i className="bx bx-link-external me-1"></i>
                        Buka di Google Maps
                    </a>
                )}
            </div>

            {/* SEARCH BAR */}
            <div className="mb-3">
                <div className="input-group">
                    <span className="input-group-text">
                        <i className={`bx ${isSearching ? 'bx-loader bx-spin' : 'bx-search'}`}></i>
                    </span>
                    <input
                        className="form-control"
                        placeholder="Cari lokasi di Indonesia (min. 3 karakter)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setResults([]);
                            }}
                        >
                            <i className="bx bx-x"></i>
                        </button>
                    )}
                </div>

                {results.length > 0 && (
                    <div className="list-group mt-2 shadow-sm" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {results.map((r, i) => (
                            <button
                                key={i}
                                type="button"
                                className="list-group-item list-group-item-action d-flex align-items-start"
                                onClick={() => {
                                    setLocation(+r.lat, +r.lon, r.display_name);
                                    setSearch('');
                                    setResults([]);
                                }}
                            >
                                <i className="bx bx-current-location me-2 mt-1 text-primary"></i>
                                <div className="flex-grow-1">
                                    <div className="fw-semibold">{r.display_name.split(',')[0]}</div>
                                    <small className="text-muted">{r.display_name}</small>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* MAP */}
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <div style={{
                        height: 400,
                        width: "100%",
                        position: "relative",
                        borderRadius: "0.375rem",
                        overflow: "hidden"
                    }}>
                        <MapContainer
                            center={center}
                            zoom={13}
                            ref={mapRef}
                            preferCanvas
                            zoomAnimation={true}
                            fadeAnimation={true}
                            markerZoomAnimation={true}
                            scrollWheelZoom={true}
                            style={{ height: "100%", width: "100%", cursor: 'crosshair' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            <Marker
                                position={center}
                                draggable
                                eventHandlers={{
                                    dragend: (e) => {
                                        const p = e.target.getLatLng();
                                        setLocation(p.lat, p.lng);
                                    },
                                }}
                            />
                            <MapClick />
                        </MapContainer>
                    </div>
                </div>
                <div className="card-footer bg-light">
                    <div className="d-flex flex-wrap gap-2 align-items-center text-muted small">
                        <span><i className="bx bx-info-circle me-1"></i><strong>Tips:</strong></span>
                        <span><i className="bx bx-mouse me-1"></i>Klik peta untuk set lokasi</span>
                        <span><i className="bx bx-move me-1"></i>Drag marker untuk adjust</span>
                        <span><i className="bx bx-zoom-in me-1"></i>Scroll untuk zoom</span>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .map-picker-container .leaflet-container {
                    font-family: inherit;
                }
                .map-picker-container .leaflet-popup-content-wrapper {
                    border-radius: 8px;
                }
                .map-picker-container .list-group-item:hover {
                    background-color: #f8f9fa;
                }
            `}</style>
        </div>
    );
}
