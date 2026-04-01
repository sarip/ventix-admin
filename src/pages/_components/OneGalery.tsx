import React, { useRef, useEffect } from 'react';
import lightGallery from 'lightgallery';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

import { proxyUrl } from '@/utils/image';
import {mediaUrl} from "@/lib/media";

interface Attachment {
    url: string;
}

interface OneGaleryProps {
    attachments: Attachment[] | string;
    style?: any;
}

const OneGalery: React.FC<OneGaleryProps> = ({ attachments, style }) => {
    const galleryRef = useRef<HTMLDivElement | null>(null);
    const lgInstance = useRef<any>(null);




    // const firstUrl = proxyUrl(attachments);

    return (
        <div ref={galleryRef} className="position-relative d-inline-block">
            <style>{`
                .lg-backdrop,
                .lg-outer {
                  z-index: 2000 !important;
                }
            `}</style>

            {/* Thumbnail utama */}
            <a
                href={mediaUrl(attachments)}
                className="position-relative d-inline-block rounded overflow-hidden shadow-sm"
                style={style}
            >
                {/* Thumbnail */}
                <img
                    src={mediaUrl(attachments)}
                    alt="Attachment Preview"
                    className="w-100 h-100 object-fit-cover border rounded"
                />

                {/* Badge sisa attachments */}

            </a>


            {/*/!* Item lainnya (hidden) *!/*/}
            {/*{validAttachments.slice(1).map((item, idx) => {*/}
            {/*    const url = proxyUrl(item.url);*/}
            {/*    return (*/}
            {/*        <a key={idx} href={url} style={{display: 'none'}}>*/}
            {/*            <img src={url} alt={`Attachment ${idx + 2}`}/>*/}
            {/*        </a>*/}
            {/*    );*/}
            {/*})}*/}
        </div>
    );
};

export default OneGalery;
