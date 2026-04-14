import React, { useRef, useState } from 'react';

export interface AdImage {
    id?: number | null;
    file?: File | null;
    preview_url?: string | null;
    _isNew?: boolean;
    _isDeleted?: boolean;
}

interface EventAdsStepProps {
    eventId: number | null;
    ads: AdImage[];
    onChange: (ads: AdImage[]) => void;
}

const EventAdsStep: React.FC<EventAdsStepProps> = ({ ads, onChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newAds: AdImage[] = Array.from(e.target.files).map((file) => ({
            id: null,
            file,
            preview_url: URL.createObjectURL(file),
            _isNew: true,
            _isDeleted: false,
        }));
        onChange([...ads, ...newAds]);
        // reset input so same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemove = (index: number) => {
        const updated = ads.map((ad, i) =>
            i === index ? { ...ad, _isDeleted: true } : ad
        );
        onChange(updated);
    };

    const handleRestore = (index: number) => {
        const updated = ads.map((ad, i) =>
            i === index ? { ...ad, _isDeleted: false } : ad
        );
        onChange(updated);
    };

    const visible = ads.filter((ad) => !ad._isDeleted);
    const deleted = ads.filter((ad) => ad._isDeleted);

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="mb-0">
                    <i className="bx bx-image-add me-1 text-primary"></i>
                    Gambar Iklan Event
                </h6>
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <i className="bx bx-plus me-1"></i>
                    Tambah Gambar
                </button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="d-none"
                onChange={handleFilesSelected}
            />

            {visible.length === 0 && (
                <div className="text-center py-5 border rounded bg-light">
                    <i className="bx bx-image text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="text-muted mt-2 mb-3">Belum ada gambar iklan.</p>
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <i className="bx bx-upload me-1"></i>
                        Upload Gambar
                    </button>
                </div>
            )}

            <div className="row g-3">
                {ads.map((ad, index) => {
                    if (ad._isDeleted) return null;
                    const src = ad.preview_url ?? undefined;
                    return (
                        <div className="col-6 col-md-4 col-lg-3" key={index}>
                            <div className="card h-100 shadow-sm position-relative">
                                {src ? (
                                    <img
                                        src={src}
                                        alt={`Ad ${index + 1}`}
                                        className="card-img-top object-fit-cover"
                                        style={{ height: 160 }}
                                    />
                                ) : (
                                    <div
                                        className="card-img-top bg-secondary d-flex align-items-center justify-content-center"
                                        style={{ height: 160 }}
                                    >
                                        <i className="bx bx-image text-white" style={{ fontSize: '2rem' }}></i>
                                    </div>
                                )}
                                <div className="card-body p-2 d-flex align-items-center justify-content-between">
                                    <small className="text-muted text-truncate" style={{ maxWidth: '80%' }}>
                                        {ad.file?.name ?? `Image #${(ad.id ?? index) + 1}`}
                                    </small>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm p-1"
                                        title="Hapus"
                                        onClick={() => handleRemove(index)}
                                    >
                                        <i className="bx bx-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {deleted.length > 0 && (
                <div className="mt-4">
                    <p className="text-muted small mb-2">
                        <i className="bx bx-trash me-1"></i>
                        {deleted.length} gambar akan dihapus saat disimpan.
                        {deleted.map((ad, i) => {
                            const realIndex = ads.findIndex(
                                (a) => a === ad
                            );
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    className="btn btn-link btn-sm p-0 ms-2"
                                    onClick={() => handleRestore(realIndex)}
                                >
                                    Pulihkan "{ad.file?.name ?? `Image #${ad.id ?? i}`}"
                                </button>
                            );
                        })}
                    </p>
                </div>
            )}
        </div>
    );
};

export default EventAdsStep;
