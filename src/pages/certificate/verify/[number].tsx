import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Spinner, Badge, Button } from 'react-bootstrap';
import CertificateModel from '@/models/CertificateModel';

const CertificateVerifyPage: React.FC = () => {
    const router = useRouter();
    const { number } = router.query;
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (number) {
            verifyCert(String(number));
        }
    }, [number]);

    const verifyCert = async (certNum: string) => {
        setLoading(true);
        try {
            const res: any = await CertificateModel.verify(certNum);
            if (res?.data) {
                setResult(res.data);
            }
        } catch (err: any) {
            setError(err?.message || 'Certificate verification failed or invalid certificate number.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
            <Card className="border-0 shadow-sm rounded-4 p-4 text-center bg-white" style={{ maxWidth: '500px', width: '100%' }}>
                <h4 className="fw-bold text-dark mb-1">Certificate Verification</h4>
                <p className="text-muted small mb-4">Official Veentix Event Digital Certificate Authenticator</p>

                {loading ? (
                    <div className="py-4"><Spinner animation="border" variant="primary" /></div>
                ) : error ? (
                    <div className="py-3">
                        <div className="text-danger fs-1 mb-2"><i className="bx bx-x-circle"></i></div>
                        <h5 className="fw-bold text-danger">Invalid Certificate</h5>
                        <p className="text-muted small">{error}</p>
                    </div>
                ) : (
                    <div className="py-2">
                        <div className="text-success fs-1 mb-2"><i className="bx bx-check-shield"></i></div>
                        <Badge bg="success" className="px-3 py-2 rounded-pill mb-3" style={{ fontSize: '0.85rem' }}>
                            ✓ VERIFIED VALID
                        </Badge>
                        <h5 className="fw-bold text-dark mb-1">{result?.recipient_name}</h5>
                        <p className="text-muted small mb-3">Event: <strong>{result?.event_title}</strong></p>

                        <div className="bg-light p-3 rounded-3 text-start mb-3 border">
                            <div className="small text-muted mb-1">Certificate Number:</div>
                            <div className="fw-bold text-dark mb-2">{result?.certificate_number}</div>
                            <div className="small text-muted mb-1">Issue Date:</div>
                            <div className="fw-bold text-dark">{result?.issue_date}</div>
                        </div>

                        {result?.download_url && (
                            <Button href={result.download_url} target="_blank" variant="primary" className="rounded-pill w-100">
                                <i className="bx bx-download me-1"></i> Download Original PDF
                            </Button>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default CertificateVerifyPage;
