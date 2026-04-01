import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        window.location.href = process.env.NEXT_PUBLIC_SITE_URL + '/dashboard';
    }, [router]);

    return null; // Tidak perlu menampilkan apa pun saat mengalihkan.
}
