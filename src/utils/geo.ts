// utils/geo.ts
export const isInsideIndonesia = (lat: number, lng: number) => {
    return (
        lat >= -11.5 &&
        lat <= 6.5 &&
        lng >= 95 &&
        lng <= 141
    );
};
