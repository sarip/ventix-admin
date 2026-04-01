import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Axios from 'axios';
import swal from 'sweetalert2';
import Head from 'next/head';
import Swal from "sweetalert2";
import {showToast} from '@/utils/toast'
import { setCookie } from 'cookies-next';


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e:any) => {
        e.preventDefault();
        Axios.post(process.env.NEXT_PUBLIC_BASE_URL + 'login', {
            username : username,
            password : password
        }).then((response) => {
            showToast('Login Berhasil, silahkan tunggu ...', 'success')
            let key = response.data.key;
            // SET COOKIE
            const now = new Date();
            const tonight = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
                0, 0, 0
            );
            const secondsUntilMidnight = Math.floor((tonight - now) / 1000);
            setCookie('key', key, { maxAge: secondsUntilMidnight });
            localStorage.setItem('key', key);
            setTimeout(()=> {
                router.replace('/dashboard')
            }, 1000)

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
    const [isClient, setIsClient] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <>
            <Head>
                <title>Login | {process.env.NEXT_PUBLIC_APP_NAME}</title>
                <meta name="description" content=""/>
                <link rel="stylesheet" href="/assets/vendor/css/pages/page-auth.css"/>
            </Head>
            <script src="/assets/js/pages-auth.js"></script>
            <div className="container-xxl">
            <div className="authentication-wrapper authentication-basic container-p-y">
                    <div className="authentication-inner py-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="mb-3 mt-2 text-center">Selamat Datang Di {process.env.NEXT_PUBLIC_APP_NAME} 👋</h5>
                                <p className="mb-4 text-center">Silakan masuk untuk mengakses akun dan melanjutkan aktivitas Anda</p>
                                <form id="formAuthentication" className="mb-3" onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input type="text" className="form-control" id="username" name="username" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus/>
                                    </div>
                                    <div className="mb-3 form-password-toggle">
                                        <div className="d-flex justify-content-between">
                                            <label className="form-label" htmlFor="password">Password</label>
                                            {/*<a href="/auth-forgot-password-basic.html">*/}
                                            {/*    <small>Forgot Password?</small>*/}
                                            {/*</a>*/}
                                        </div>
                                        <div className="input-group input-group-merge">
                                            <input type={showPassword ? "text" : "password"} id="password" className="form-control" name="password" placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" aria-describedby="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                            <span
                                                className="input-group-text cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{cursor: "pointer"}}
                                            >
                                                <i className={showPassword ? "bx bx-show" : "bx bx-hide"}></i>
                                            </span>
                                        </div>
                                    </div>
                                    {/*<div className="mb-3">*/}
                                    {/*    <div className="form-check">*/}
                                    {/*        <input className="form-check-input" type="checkbox" id="remember-me"/>*/}
                                    {/*        <label className="form-check-label" htmlFor="remember-me"> Remember*/}
                                    {/*            Me </label>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    <div className="mb-3">
                                        <button className="btn btn-primary d-grid w-100" type="submit" onClick={handleLogin} >Login</button>
                                    </div>
                                </form>
                                {/*<p className="text-center">*/}
                                {/*    <span>Belum mempunyai akun? klik </span>*/}
                                {/*    <a href="/auth-register-basic.html">*/}
                                {/*        <span>Disini</span>*/}
                                {/*    </a>*/}
                                {/*</p>*/}
                                {/*<div className="divider my-4">*/}
                                {/*    <div className="divider-text">or</div>*/}
                                {/*</div>*/}
                                {/*<div className="d-flex justify-content-center">*/}
                                {/*    <a href="" className="btn btn-icon btn-label-facebook me-3">*/}
                                {/*        <i className="tf-icons bx bxl-facebook"></i>*/}
                                {/*    </a>*/}
                                {/*    <a href="" className="btn btn-icon btn-label-google-plus me-3">*/}
                                {/*        <i className="tf-icons bx bxl-google-plus"></i>*/}
                                {/*    </a>*/}
                                {/*    <a href="" className="btn btn-icon btn-label-twitter">*/}
                                {/*        <i className="tf-icons bx bxl-twitter"></i>*/}
                                {/*    </a>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
