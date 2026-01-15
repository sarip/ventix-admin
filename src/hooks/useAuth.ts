import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useAuth = (setLoading:any) => {
    const router = useRouter();
    const { pathname } = router;

    useEffect(() => {
        // Define pages where authentication is not required
        const noAuthRequiredPages = ['/login'];
        // Check if the current page requires authentication
        if (!noAuthRequiredPages.includes(pathname)) {
            const token = localStorage.getItem('key');
            if (!token) {
                router.push('/login');
                return; // Early return to avoid setting loading to false if redirect occurs
            }
        }

        // Ensure that loading is set to false after checks are complete
        setLoading(false);
    }, [pathname, router, setLoading]);
};

export default useAuth;
