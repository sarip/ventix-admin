import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Axios from 'axios';
import swal from 'sweetalert2';
import Head from 'next/head';
import Swal from "sweetalert2";
import { showToast } from '@/utils/toast'
import { setCookie } from 'cookies-next';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google'
import Link from "next/link";


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const onLoginSuccess = (key: string) => {
        showToast('Login Berhasil, silahkan tunggu ...', 'success')
        // SET COOKIE
        const now = new Date();
        const tonight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            0, 0, 0
        );
        const secondsUntilMidnight = Math.floor((tonight.getTime() - now.getTime()) / 1000);
        setCookie('key', key, { maxAge: secondsUntilMidnight });
        localStorage.setItem('key', key);
        setTimeout(() => {
            window.location.href = process.env.NEXT_PUBLIC_SITE_URL + '/dashboard';
        }, 1000)
    }

    const handleLogin = async (e: any) => {
        e.preventDefault();
        Axios.post(process.env.NEXT_PUBLIC_BASE_URL + 'login?role=SUPERADMIN', {
            username: username,
            password: password
        }).then((response) => {
            onLoginSuccess(response.data.key);
        }).catch((error) => {
            const audio = new Audio("/assets/audio/danger.mp3");
            audio.play().catch((error) => {
                console.error('Error playing audio:', error);
            });
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.message || "Something went wrong!",
            })

        });
    };


    const handleGoogleSuccess = useGoogleLogin({
        scope: 'openid profile email',
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);

            Axios.post(process.env.NEXT_PUBLIC_BASE_URL + 'auth/google?role=SUPERADMIN', {
                credential: tokenResponse.access_token
            }).then((response) => {
                onLoginSuccess(response.data.key);
            }).catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Login Gagal",
                    text: error.response?.data?.message || "Google login gagal",
                });
            });
        },
        onError: () => {
            console.log('Google Login Failed');
        }
    });
    const [isClient, setIsClient] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <>
            <Head>
                <title>Login | {process.env.NEXT_PUBLIC_APP_NAME}</title>
                <meta name="description" content="" />
                <link rel="stylesheet" href="/assets/vendor/css/pages/page-auth.css" />
            </Head>
            <script src="/assets/js/pages-auth.js"></script>
            <div className="container-xxl min-vh-100 d-flex align-items-center justify-content-center py-5">
                <div className="authentication-wrapper authentication-basic w-100" style={{ maxWidth: '440px' }}>
                    <div className="authentication-inner py-4">
                        <div className="card auth-glow-card border-0 shadow-lg">
                            <div className="card-body p-4 p-sm-5">
                                <div className="app-brand justify-content-center mb-4">
                                    <a href="/" className="app-brand-link gap-2 text-decoration-none">
                                        <div className="avatar avatar-md bg-primary rounded-3 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: '40px', height: '40px' }}>
                                            <i className="bx bx-purchase-tag-alt fs-4"></i>
                                        </div>
                                        <span className="app-brand-text demo menu-text fw-bold fs-3 text-heading" style={{ color: 'var(--vx-primary)' }}>Veentix</span>
                                    </a>
                                </div>
                                
                                <h5 className="mb-2 text-center fw-bold">Selamat Datang 👋</h5>
                                <p className="mb-4 text-center text-muted fs-7">Silakan masuk untuk mengakses akun Veentix Admin Anda</p>
                                
                                <form id="formAuthentication" className="mb-3" onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label fw-semibold fs-7">Username</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-transparent border-end-0">
                                                <i className="bx bx-user text-muted"></i>
                                            </span>
                                            <input type="text" className="form-control border-start-0" id="username" name="username"
                                                   placeholder="Masukkan username" value={username}
                                                   onChange={(e) => setUsername(e.target.value)} autoFocus required/>
                                        </div>
                                    </div>
                                    <div className="mb-3 form-password-toggle">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <label className="form-label fw-semibold fs-7 mb-0" htmlFor="password">Password</label>
                                            <a href={process.env.NEXT_PUBLIC_SITE_URL + '/forgot-password'} className="text-primary text-decoration-none fs-7">
                                                Lupa Password?
                                            </a>
                                        </div>
                                        <div className="input-group">
                                            <span className="input-group-text bg-transparent border-end-0">
                                                <i className="bx bx-lock-alt text-muted"></i>
                                            </span>
                                            <input type={showPassword ? "text" : "password"} id="password"
                                                   className="form-control border-start-0 border-end-0" name="password"
                                                   placeholder="••••••••••••"
                                                   aria-describedby="password" value={password}
                                                   onChange={(e) => setPassword(e.target.value)} required/>
                                            <span
                                                className="input-group-text bg-transparent border-start-0 cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{cursor: "pointer"}}
                                            >
                                                <i className={showPassword ? "bx bx-show text-muted" : "bx bx-hide text-muted"}></i>
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 mb-3">
                                        <button className="btn btn-primary d-grid w-100 py-2 fs-6 fw-semibold shadow-sm" type="submit">
                                            Masuk ke Dashboard
                                        </button>
                                    </div>
                                </form>

                                <div className="divider my-4">
                                    <div className="divider-text text-uppercase text-muted fs-8">atau masuk dengan</div>
                                </div>

                                <div className="d-flex flex-column gap-2 mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center py-2"
                                        onClick={() => handleGoogleSuccess()}
                                    >
                                        <i className="tf-icons bx bxl-google fs-5 me-2"></i>Login dengan Google
                                    </button>

                                    <Link href={process.env.NEXT_PUBLIC_API_BASE_URL as string || "#"} className="w-100 text-decoration-none">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center py-2"
                                        >
                                            <i className="tf-icons bx bx-arrow-back fs-5 me-2"></i>Kembali ke Landing Page
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
