import { useCallback, useEffect } from 'react';
import $ from 'jquery';

// Define the type for blockUI options
interface BlockUIOptions {
    message?: string;
    css?: {
        backgroundColor?: string;
        border?: string;
    };
    overlayCSS?: {
        opacity?: number;
    };
}

const useBlockUI = () => {
    useEffect(() => {

        // @ts-ignore
        if (typeof $.blockUI === 'undefined') {
            require('block-ui');
        }
    }, []);

    // Define the blockUI function with optional message
    const blockUI = useCallback((message?: string) => {
        const options: BlockUIOptions = {
            message: message || (
                '<div class="sk-wave mx-auto">' +
                '<div class="sk-rect sk-wave-rect"></div>' +
                '<div class="sk-rect sk-wave-rect"></div>' +
                '<div class="sk-rect sk-wave-rect"></div>' +
                '<div class="sk-rect sk-wave-rect"></div>' +
                '<div class="sk-rect sk-wave-rect"></div>' +
                '</div>'
            ),
            css: {
                backgroundColor: 'transparent',
                border: '0',
            },
            overlayCSS: {
                opacity: 0.5,
            },
        };

        // @ts-ignore
        $.blockUI(options);
    }, []);

    // Define the unblockUI function
    const unblockUI = useCallback(() => {
        // @ts-ignore
        $.unblockUI();
    }, []);

    return { blockUI, unblockUI };
};

export default useBlockUI;
