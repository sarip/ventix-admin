import React, { useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/router';
import $ from 'jquery';

interface RouteChangeBlockerProps {
    children: ReactNode;
}

const RouteChangeBlocker: React.FC<RouteChangeBlockerProps> = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        // Pastikan jQuery sudah ada sebelum memuat blockUI
        if (typeof $.blockUI === 'undefined') {
            require('block-ui');
        }
    }, []);

    const handleRouteChangeStart = useCallback(() => {
        $.blockUI({
            message: `
                <div class="sk-wave mx-auto">
                    <div class="sk-rect sk-wave-rect"></div>
                    <div class="sk-rect sk-wave-rect"></div>
                    <div class="sk-rect sk-wave-rect"></div>
                    <div class="sk-rect sk-wave-rect"></div>
                    <div class="sk-rect sk-wave-rect"></div>
                </div>`,
            css: {
                position: 'fixed',
                backgroundColor: 'transparent',
                border: '0',
                width: '100%',
                height: '100%',
                left: '0',
                textAlign: 'center',
                zIndex: '9999',
            },
            overlayCSS: {
                opacity: 0.5,
                backgroundColor: '#000',
                cursor: 'wait',
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
            },
        });
    }, []);

    const handleRouteChangeComplete = useCallback(() => {
        $.unblockUI();
    }, []);

    useEffect(() => {
        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);
        router.events.on('routeChangeError', handleRouteChangeComplete);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
            router.events.off('routeChangeError', handleRouteChangeComplete);
        };
    }, [router, handleRouteChangeStart, handleRouteChangeComplete]);

    return <>{children}</>;
};

export default RouteChangeBlocker;
