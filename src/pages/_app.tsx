import '../app/globals.css';
import Layout from './_components/Layout';
import { Provider } from 'react-redux';
import React, { useState, useEffect } from 'react';
import RouteChangeBlocker from './_components/RouteChangeBlocker';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import Auth from "@/models/Auth";
import { useUserStore } from "@/store/store";
import LoadingPage from "@/pages/_components/LoadingPage";
import { setCookie, getCookie } from 'cookies-next';
import { GoogleOAuthProvider } from '@react-oauth/google';

function MyApp({ Component, pageProps }: AppProps) {
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [roleActions, setRoleActions] = useState<any[]>([]);
    const router = useRouter();
    const setUser = useUserStore((state) => state.setUser);
    const noLayoutPages = ['/login', '/forgot-password', '/reset-password'];

    useEffect(() => {
        setIsClient(true);
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        const key = localStorage.getItem('key');
        if (router.pathname !== '/login' && (router.pathname === '/forgot-password' || router.pathname === '/reset-password')) {
            setLoading(false);
            return null;
        }

        if (!key) {
            setIsLoggedIn(false);
            setLoading(false);
            router.replace('/login'); // Redirect ke login jika belum login
            return;
        }

        try {
            const response = await Auth.whoami();
            localStorage.setItem('fullname', response.fullname);
            localStorage.setItem('username', response.username);
            const now = new Date();
            const tonight = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
                0, 0, 0
            );
            const secondsUntilMidnight = Math.floor((tonight - now) / 1000);



            setCookie('id', response.id, { maxAge: secondsUntilMidnight });
            setCookie('username', response.username, { maxAge: secondsUntilMidnight });
            setCookie('fullname', response.fullname, { maxAge: secondsUntilMidnight });

            // setRoleActions(response.role_actions || []);

            setUser({
                id: response.id,
                fullname: response.fullname,
                role: response.user.role,
                username: response.username
            })
            setIsLoggedIn(true);
        } catch (error) {
            setIsLoggedIn(false);
            router.replace('/login'); // Redirect ke login jika token tidak valid
        } finally {
            setLoading(false);
        }
    };

    // 🔥 Cegah eksekusi halaman sebelum login dicek
    if (loading) {
        return <LoadingPage />;
    }

    // 🔥 Jika belum login, redirect ke login sebelum merender halaman lain
    if (!isLoggedIn && !noLayoutPages.includes(router.pathname)) {
        router.replace('/login');
        return null;
    }



    const renderComponent = (
        <>
            <Component {...pageProps} />
            <ToastContainer />
        </>
    );

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            {noLayoutPages.includes(router.pathname) ? (
                renderComponent
            ) : (
                <Layout>
                    <RouteChangeBlocker>
                        {renderComponent}
                    </RouteChangeBlocker>
                </Layout>
            )}
        </GoogleOAuthProvider>
    );
}

export default MyApp;
