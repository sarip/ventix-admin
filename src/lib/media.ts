
// lib/media.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export function mediaUrl(path?: string) {
    if (!path) return ''
    return `${API_BASE_URL}/uploads/${path}`
}
