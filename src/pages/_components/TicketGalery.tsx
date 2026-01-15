import React, { useRef, useEffect } from 'react';
import lightGallery from 'lightgallery';   // ⚡ lowercase, bukan LightGallery
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

import { proxyUrl } from '@/utils/image';

interface Attachment {
    url: string;
}

interface TicketGalleryProps {
    attachments: Attachment[];
    modalId?: string;
}

const TicketGallery: React.FC<TicketGalleryProps> = ({ attachments, modalId = "modal-work-order" }) => {
    const galleryRef = useRef<HTMLDivElement | null>(null);
    const lgInstance = useRef<any>(null);

    const validAttachments = attachments.filter(item => item?.url?.trim());

    useEffect(() => {
        if (!galleryRef.current || validAttachments.length === 0) return;

        // destroy jika ada instance sebelumnya
        if (lgInstance.current) {
            lgInstance.current.destroy();
            lgInstance.current = null;
        }

        lgInstance.current = lightGallery(galleryRef.current, {
            plugins: [lgThumbnail, lgZoom],
            speed: 500,
            download: false,
            selector: 'a'
        });

        return () => {
            if (lgInstance.current) {
                lgInstance.current.destroy();
                lgInstance.current = null;
            }
        };
    }, [validAttachments]);

    return (
        <div ref={galleryRef} className="d-flex flex-wrap gap-2">
            <style>{`
                .lg-backdrop,
                .lg-outer {
                  z-index: 2000 !important;
                }
            `}</style>

            {validAttachments.map((item, idx) => {
                const url = proxyUrl(item.url);
                return (
                    <a
                        key={idx}
                        href={url}
                        className="border rounded-3 overflow-hidden"
                        style={{ width: '100px', height: '100px' }}
                    >
                        <img
                            src={url}
                            alt={`Attachment ${idx + 1}`}
                            className="img-fluid h-100 w-100 object-fit-cover"
                        />
                    </a>
                );
            })}
        </div>
    );
};

export default TicketGallery;
