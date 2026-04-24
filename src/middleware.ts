import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-api.com";

/**
 * Middleware: autentikasi + otorisasi dasar
 * - Memeriksa cookie 'key'
 * - Memanggil endpoint whoami untuk validasi token dan ambil role_actions
 * - Mengecek permission read pada module yang sesuai dengan path
 * - Menyuntikkan header x-user-data (jika perlu) agar bisa diakses di server/edge runtimes
 */
// Routes accessible without authentication
const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password'];

export async function middleware(req: NextRequest) {
    try {
        const token = req.cookies.get("key")?.value;
        const { pathname } = req.nextUrl;

        // early allow for public pages (optional) — matcher already excludes login etc but keep safe checks
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }

        // Build absolute URL safely
        const whoamiUrl = API_URL + '/whoami';


        const apiRes = await fetch(whoamiUrl, {
            method: "GET",
            headers: {
                "key": token,
                "Content-Type": "application/json",
                // add other headers if required (eg: Accept)
            },
        });

        // if token invalid or API returns non-200, redirect to login
        if (!apiRes.ok) {
            console.warn("whoami returned non-ok:", apiRes.status);
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }

        const user = await apiRes.json();

        // defensive checks
        const roleActions = Array.isArray(user?.role_actions) ? user.role_actions : [];

        // normalize path for permission check
        let formattedPage = pathname;
        if (formattedPage.startsWith("/setting_")) formattedPage = "/settings";
        if (formattedPage.startsWith("/report_")) formattedPage = "/report";

        // find permission where module.directory matches (ensure leading slash)
        const rolePermissions = roleActions.find(
            (action: any) => `/${action?.module?.directory}` === formattedPage
        );

        // if module found but no read permission -> redirect to 403
        if (rolePermissions && rolePermissions.can_read !== "Y") {
            return NextResponse.redirect(new URL("/403", req.nextUrl));
        }

        // attach user info to request headers for downstream (be careful with size)
        // prefer storing only essential fields (id, name, roles) to avoid header overflow
        const minimalUser = {
            id: user?.id ?? null,
            name: user?.name ?? null,
            email: user?.email ?? null,
            // add other small fields you need downstream
        };

        const res = NextResponse.next();
        // Important: headers must be small. Don't stringify huge objects here.
        res.headers.set("x-user-data", JSON.stringify(minimalUser));

        return res;
    } catch (err) {
        console.error("Middleware error:", err);
        // On unexpected error, fail-safe: redirect to login
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
}

/**
 * Matcher: jalankan middleware pada semua route kecuali:
 * - /login, /403, /api/*, /_next/*, static files etc.
 * Adjust to your app's public/static path if needed.
 */
export const config = {
    matcher: [
        "/((?!api|_next|static|assets|login|forgot-password|reset-password|403|.*\\..*).*)",
    ],
};

