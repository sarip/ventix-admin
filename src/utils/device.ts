// utils/detect.ts
export function detectBrowser(userAgent: string): string {
    let browser = "Unknown Browser";

    if (userAgent.includes("Chrome")) {
        browser = "Chrome";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
        browser = "Safari";
    } else if (userAgent.includes("Firefox")) {
        browser = "Firefox";
    } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
        browser = "Internet Explorer";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
        browser = "Opera";
    }

    return browser;
}

export function detectDevice(userAgent: string): string {
    let device = "Unknown Device";

    if (userAgent.includes("Linux")) {
        device = "Linux";
    } else if (userAgent.includes("Windows")) {
        device = "Windows";
    } else if (userAgent.includes("Macintosh")) {
        device = "Mac";
    } else if (userAgent.includes("Android")) {
        device = "Android";
    } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        device = "iOS";
    }

    return device;
}

export function detectBrowserIcon(userAgent: string): string {
    const browser = detectBrowser(userAgent);
    let iconClass = '';

    switch (browser) {
        case 'Chrome':
            iconClass = 'bx bxl-chrome text-info';
            break;
        case 'Safari':
            iconClass = 'bx bxl-safari text-info';
            break;
        case 'Firefox':
            iconClass = 'bx bxl-firefox text-info';
            break;
        case 'Internet Explorer':
            iconClass = 'bx bxl-internet-explorer text-info';
            break;
        case 'Opera':
            iconClass = 'bx bxl-opera text-info';
            break;
        default:
            iconClass = 'bx bxl-windows text-info';
            break;
    }

    return `<i className='${iconClass} me-3'></i> <span className="fw-medium">${browser}</span>`;
}

export function detectDeviceIcon(userAgent: string): string {
    const device = detectDevice(userAgent);
    let iconClass = '';

    switch (device) {
        case 'Linux':
            iconClass = 'bxl-tux text-warning';
            break;
        case 'Windows':
            iconClass = 'bxl-windows text-info';
            break;
        case 'Mac':
            iconClass = 'bxl-apple text-light';
            break;
        case 'Android':
            iconClass = 'bxl-android text-warning';
            break;
        case 'iOS':
            iconClass = 'bxl-apple text-light';
            break;
        default:
            iconClass = 'bxs-device-unknown';
            break;
    }

    return iconClass;
}
