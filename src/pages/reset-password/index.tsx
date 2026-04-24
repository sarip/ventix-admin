import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function ResetPassword() {
    const router = useRouter();
    const { token } = router.query;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [tokenReady, setTokenReady] = useState(false);

    useEffect(() => {
        if (router.isReady) {
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Link Tidak Valid',
                    text: 'Token reset password tidak ditemukan. Silakan minta link baru.',
                }).then(() => router.replace('/forgot-password'));
            } else {
                setTokenReady(true);
            }
        }
    }, [router.isReady, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Password minimal 8 karakter.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Konfirmasi password tidak cocok.' });
            return;
        }

        setLoading(true);
        try {
            await Axios.post(process.env.NEXT_PUBLIC_BASE_URL + 'reset-password', {
                otp: token,
                new_password: newPassword,
            });
            setSuccess(true);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
            Swal.fire({ icon: 'error', title: 'Gagal', text: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Reset Password | {process.env.NEXT_PUBLIC_APP_NAME}</title>
                <meta name="description" content="Set a new password for your account" />
                <link rel="stylesheet" href="/assets/vendor/css/pages/page-auth.css" />
            </Head>

            <div className="container-xxl">
                <div className="authentication-wrapper authentication-basic container-p-y">
                    <div className="authentication-inner py-4">
                        <div className="card">
                            <div className="card-body">

                                {/* Icon */}
                                <div className="text-center mb-3 mt-2">
                                    <span
                                        className="badge bg-label-primary rounded-circle"
                                        style={{ width: 64, height: 64, fontSize: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <i className="bx bx-shield-quarter" />
                                    </span>
                                </div>

                                <h5 className="mb-2 text-center">Buat Password Baru 🔑</h5>
                                <p className="mb-4 text-center text-muted" style={{ fontSize: 14 }}>
                                    Password baru harus berbeda dari password yang pernah digunakan sebelumnya.
                                </p>

                                {success ? (
                                    <div className="alert alert-success text-center" role="alert">
                                        <i className="bx bx-check-circle me-2" />
                                        <strong>Password berhasil direset!</strong>
                                        <br />
                                        <small className="text-muted">Silakan login dengan password baru Anda.</small>
                                        <div className="mt-3">
                                            <Link href="/login" className="btn btn-sm btn-primary">
                                                <i className="bx bx-log-in me-1" /> Login Sekarang
                                            </Link>
                                        </div>
                                    </div>
                                ) : tokenReady ? (
                                    <form onSubmit={handleSubmit} className="mb-3">
                                        {/* New Password */}
                                        <div className="mb-3 form-password-toggle">
                                            <label htmlFor="new_password" className="form-label">Password Baru</label>
                                            <div className="input-group input-group-merge">
                                                <input
                                                    type={showNew ? 'text' : 'password'}
                                                    id="new_password"
                                                    className="form-control"
                                                    placeholder="Min. 8 karakter"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    autoFocus
                                                    required
                                                />
                                                <span
                                                    className="input-group-text cursor-pointer"
                                                    onClick={() => setShowNew(!showNew)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <i className={showNew ? 'bx bx-show' : 'bx bx-hide'} />
                                                </span>
                                            </div>
                                            {newPassword.length > 0 && newPassword.length < 8 && (
                                                <small className="text-danger">Password minimal 8 karakter.</small>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="mb-3 form-password-toggle">
                                            <label htmlFor="confirm_password" className="form-label">Konfirmasi Password</label>
                                            <div className="input-group input-group-merge">
                                                <input
                                                    type={showConfirm ? 'text' : 'password'}
                                                    id="confirm_password"
                                                    className="form-control"
                                                    placeholder="Ulangi password baru"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                                <span
                                                    className="input-group-text cursor-pointer"
                                                    onClick={() => setShowConfirm(!showConfirm)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <i className={showConfirm ? 'bx bx-show' : 'bx bx-hide'} />
                                                </span>
                                            </div>
                                            {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                                                <small className="text-danger">Password tidak cocok.</small>
                                            )}
                                        </div>

                                        {/* Password Strength Hints */}
                                        <ul className="list-unstyled text-muted mb-3" style={{ fontSize: 12 }}>
                                            <li>
                                                <i className={`bx me-1 ${newPassword.length >= 8 ? 'bx-check text-success' : 'bx-x text-danger'}`} />
                                                Minimal 8 karakter
                                            </li>
                                            <li>
                                                <i className={`bx me-1 ${/[A-Z]/.test(newPassword) ? 'bx-check text-success' : 'bx-x text-danger'}`} />
                                                Huruf kapital (A–Z)
                                            </li>
                                            <li>
                                                <i className={`bx me-1 ${/[0-9]/.test(newPassword) ? 'bx-check text-success' : 'bx-x text-danger'}`} />
                                                Angka (0–9)
                                            </li>
                                        </ul>

                                        <button
                                            type="submit"
                                            className="btn btn-primary d-grid w-100"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? <><span className="spinner-border spinner-border-sm me-2" role="status" /> Menyimpan...</>
                                                : <><i className="bx bx-save me-2" />Simpan Password Baru</>
                                            }
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center py-4">
                                        <span className="spinner-border text-primary" role="status" />
                                        <p className="mt-2 text-muted">Memvalidasi token...</p>
                                    </div>
                                )}

                                {!success && (
                                    <p className="text-center mt-2" style={{ fontSize: 14 }}>
                                        <Link href="/forgot-password" className="text-muted">
                                            <i className="bx bx-refresh me-1" />Minta Link Baru
                                        </Link>
                                        {' · '}
                                        <Link href="/login" className="text-muted">
                                            <i className="bx bx-arrow-back me-1" />Login
                                        </Link>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
