"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { isInsideIndonesia } from "@/utils/geo";

interface Props {
    latitude?: string;
    longitude?: string;
    onChange: (lat: string, lng: string, label?: string) => void;
}

export default function MapPicker({ latitude, longitude, onChange }: Props) {
    const mapRef = useRef<any>(null);
    const [mapLib, setMapLib] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const center = useMemo<[number, number]>(() => [
        latitude ? +latitude : -6.2,
        longitude ? +longitude : 106.816,
    ], [latitude, longitude]);

    // ✅ LOAD LEAFLET ONLY IN CLIENT
    useEffect(() => {
        Promise.all([
            import("leaflet"),
            import("react-leaflet")
        ]).then(([L, RL]) => {

            // FIX marker icon
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            setMapLib({ L, ...RL });
        });
    }, []);

    /* SEARCH */
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
            } catch {
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
        mapRef.current?.setView([lat, lng], 15);
    };

    if (!mapLib) {
        return <div>Loading map...</div>;
    }

    const { MapContainer, TileLayer, Marker, useMapEvents } = mapLib;

    const MapClick = () => {
        useMapEvents({
            click(e: any) {
                setLocation(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    return (
        <MapContainer center={center} zoom={13} ref={mapRef} style={{ height: 400 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={center} />
            <MapClick />
        </MapContainer>
    );
}