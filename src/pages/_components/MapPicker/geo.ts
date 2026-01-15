import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

let indonesiaPolygon: any = null;

/**
 * Load polygon sekali saja (cached)
 */
export const loadIndonesiaPolygon = async () => {
    if (indonesiaPolygon) return indonesiaPolygon;

    const res = await fetch("/geo/indonesia.geojson");
    indonesiaPolygon = await res.json();
    return indonesiaPolygon;
};

/**
 * Validasi lokasi
 */
export const isInsideIndonesia = async (lat: number, lng: number) => {
    const polygon = await loadIndonesiaPolygon();
    return booleanPointInPolygon(
        point([lng, lat]),
        polygon
    );
};
