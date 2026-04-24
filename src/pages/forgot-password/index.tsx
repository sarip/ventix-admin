import React, { useState } from 'react';
import Axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Email wajib diisi.' });
            return;
        }

        setLoading(true);
        try {
            await Axios.post(process.env.NEXT_PUBLIC_BASE_URL + 'forgot-password', { email });
            setSent(true);
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Lupa Password | {process.env.NEXT_PUBLIC_APP_NAME}</title>
                <meta name="description" content="Request password reset link" />
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
                                        className="badge bg-label-warning rounded-circle"
                                        style={{ width: 64, height: 64, fontSize: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <i className="bx bx-lock-open-alt" />
                                    </span>
                                </div>

                                <h5 className="mb-2 text-center">Lupa Password? 🔐</h5>
                                <p className="mb-4 text-center text-muted" style={{ fontSize: 14 }}>
                                    Masukkan email Anda dan kami akan mengirimkan link untuk mereset password.
                                </p>

                                {sent ? (
                                    <div className="alert alert-success text-center" role="alert">
                                        <i className="bx bx-check-circle me-2" />
                                        <strong>Email terkirim!</strong> Periksa kotak masuk Anda dan klik link reset password.
                                        <br />
                                        <small className="text-muted">Link berlaku selama <strong>1 jam</strong>.</small>
                                        <div className="mt-3">
                                            <Link href="/login" className="btn btn-sm btn-primary">
                                                <i className="bx bx-arrow-back me-1" /> Kembali ke Login
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="mb-3">
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="form-control"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                autoFocus
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-warning d-grid w-100"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? <><span className="spinner-border spinner-border-sm me-2" role="status" /> Mengirim...</>
                                                : <><i className="bx bx-send me-2" />Kirim Link Reset Password</>
                                            }
                                        </button>
                                    </form>
                                )}

                                {!sent && (
                                    <p className="text-center mt-2" style={{ fontSize: 14 }}>
                                        <Link href="/login" className="text-muted">
                                            <i className="bx bx-arrow-back me-1" />Kembali ke Login
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
