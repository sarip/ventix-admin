/**
 * @author Sarip Hidayat <hidayatsarip2210@gmail.com>
 * @copyright Sarip Hidayat 2024
 * @date 2026-01-14
 * 
 * Printable Ticket Component
 * This component renders a print-friendly ticket layout with QR code
 */

import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import QRCode from 'qrcode';
import { InTicketUser } from '@/models/TicketUser';
import {useReactToPrint} from "react-to-print";

interface PrintTicketProps {
    ticket: InTicketUser;
    show: boolean;
    onHide: () => void;
}

const PrintTicket: React.FC<PrintTicketProps> = ({ ticket, show, onHide }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ticket) {
            generateQRCode();
        }
    }, [ticket]);

    const generateQRCode = async () => {
        try {
            const qrUrl = await QRCode.toDataURL(ticket.ticket_code, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            setQrCodeUrl(qrUrl);
        } catch (error) {
            console.error('Failed to generate QR code:', error);
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        onAfterPrint: onHide,
    });




    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Modal show={show} onHide={onHide} size="lg" centered className="print-modal">
                <Modal.Header closeButton className="no-print">
                    <Modal.Title>
                        <i className="bx bx-printer me-2"></i>
                        Print Ticket
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div ref={printRef} className="ticket-print-container">
                        {/* TICKET DESIGN */}
                        <div className="ticket-card">
                            {/* Header */}
                            <div className="ticket-header">
                                <h2 className="ticket-title">EVENT TICKET</h2>
                                <div className={`ticket-code-display status-${ticket.status.toLowerCase()}`}>{ticket.ticket_code}</div>
                            </div>

                            {/* Main Content */}
                            <div className="ticket-body">
                            <div className="row">
                                    {/* Left Side - Details */}
                                    <div className="col-8">
                                        <div className="ticket-section">
                                            <h5 className="section-title">Event Details</h5>
                                            <div className="detail-item">
                                                <span className="label">Event:</span>
                                                <span className="value">{ticket.event_ticket?.name || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Category:</span>
                                                <span className="value">{(ticket.event_ticket as any)?.event?.event_category || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="ticket-section">
                                            <h5 className="section-title">Attendee Information</h5>
                                            <div className="detail-item">
                                                <span className="label">Name:</span>
                                                <span className="value">{ticket.user?.name || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Email:</span>
                                                <span className="value">{ticket.user?.email || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Phone:</span>
                                                <span className="value">{ticket.user?.phone || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="ticket-section">
                                            <h5 className="section-title">Ticket Information</h5>
                                            <div className="detail-item">
                                                <span className="label">Status:</span>
                                                <span className={`badge-status status-${ticket.status.toLowerCase()}`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Purchase Date:</span>
                                                <span className="value">{formatDate(ticket.created_at)}</span>
                                            </div>
                                            {ticket.check_in_at && (
                                                <div className="detail-item">
                                                    <span className="label">Check-in:</span>
                                                    <span className="value">{formatDate(ticket.check_in_at)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Side - QR Code */}
                                    <div className="col-4 text-center">
                                        <div className="qr-section">
                                            <h5 className="section-title">Scan to Verify</h5>
                                            {qrCodeUrl && (
                                                <img
                                                    src={qrCodeUrl}
                                                    alt="Ticket QR Code"
                                                    className="qr-code-image"
                                                />
                                            )}
                                            <small className="qr-instruction">
                                                Scan this code at the venue
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sponsor Section */}
                            <div className="ticket-sponsors">
                                <div className="sponsor-title">Sponsored By</div>
                                <div className="sponsor-list">
                                    {ticket.ticket?.events_sponsors?.length > 0 ? (
                                        ticket.ticket.events_sponsors.map((row, index) => (
                                            <img
                                                key={index}
                                                src={row.url}
                                                alt={`Sponsor ${index + 1}`}
                                            />
                                        ))
                                    ) : (
                                        <>
                                            <img src="/uploads/sponsor/garuda.png" alt="Sponsor 1" />
                                            <img src="/uploads/sponsor/finnet.png" alt="Sponsor 2" />
                                            <img src="/uploads/sponsor/pertamina.png" alt="Sponsor 3" />
                                            <img src="/uploads/sponsor/tokped.png" alt="Sponsor 4" />
                                            <img src="/uploads/sponsor/starbucks.png" alt="Sponsor 5" />
                                        </>
                                    )}
                                </div>
                            </div>


                            {/* Footer */}
                            <div className="ticket-footer">
                                <div className="footer-content">
                                    <div className="footer-item">
                                        <i className="bx bx-info-circle"></i>
                                        <span>Please bring a valid ID</span>
                                    </div>
                                    <div className="footer-item">
                                        <i className="bx bx-shield-alt"></i>
                                        <span>This ticket is non-transferable</span>
                                    </div>
                                    <div className="footer-item">
                                        <i className="bx bx-time"></i>
                                        <span>Arrive 30 minutes early</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tear Line */}
                        <div className="tear-line"></div>

                        {/* Stub Section */}
                        <div className="ticket-stub">
                            <div className="stub-content">
                                <div className="stub-qr">
                                    {qrCodeUrl && (
                                        <img src={qrCodeUrl} alt="QR" width="80"/>
                                    )}
                                </div>
                                <div className="stub-details">
                                    <strong>{ticket.event_ticket?.name}</strong>
                                    <div className="stub-code">{ticket.ticket_code}</div>
                                    <div className="stub-name">{ticket.user?.name}</div>
                                </div>

                                <div className="stub-sponsor">
                                    {ticket.ticket?.events_sponsors?.length > 0 ? (
                                        ticket.ticket.events_sponsors.map((row, index) => (
                                            <img
                                                key={index}
                                                src={row.url}
                                                alt={`Sponsor ${index + 1}`}
                                            />
                                        ))
                                    ) : (
                                        <>
                                            <img src="/uploads/sponsor/garuda.png" alt="Sponsor 1" />
                                            <img src="/uploads/sponsor/finnet.png" alt="Sponsor 2" />
                                            <img src="/uploads/sponsor/pertamina.png" alt="Sponsor 3" />
                                            <img src="/uploads/sponsor/tokped.png" alt="Sponsor 4" />
                                            <img src="/uploads/sponsor/starbucks.png" alt="Sponsor 5" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="no-print">
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handlePrint}>
                    <i className="bx bx-printer me-1"></i>
                        Print Ticket
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* PRINT-SPECIFIC STYLES */}
            <style jsx>{`
                .ticket-print-container {
                    max-width: 800px;
                    margin: 0 auto;
                    font-family: 'Arial', sans-serif;
                }

                .ticket-card {
                    border: 2px solid #333;
                    border-radius: 12px;
                    overflow: hidden;
                    background: white;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .ticket-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    position: relative;
                }

                .ticket-title {
                    font-size: 28px;
                    font-weight: bold;
                    margin: 0 0 15px 0;
                    letter-spacing: 2px;
                }

                .ticket-code-display {
                    font-size: 20px;
                    font-family: 'Courier New', monospace;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 8px 20px;
                    border-radius: 20px;
                    display: inline-block;
                }

                .ticket-body {
                    padding: 30px;
                }

                .ticket-section {
                    margin-bottom: 25px;
                }

                .section-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #666;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 2px solid #eee;
                }

                .detail-item {
                    display: flex;
                    margin-bottom: 10px;
                    font-size: 14px;
                }

                .detail-item .label {
                    font-weight: 600;
                    color: #555;
                    min-width: 120px;
                }

                .detail-item .value {
                    color: #333;
                    flex: 1;
                }

                .badge-status {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .status-valid {
                    background: #d4edda;
                    color: #155724;
                }

                .status-used {
                    background: #d1ecf1;
                    color: #0c5460;
                }

                .qr-section {
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }

                .qr-code-image {
                    width: 180px;
                    height: 180px;
                    margin: 15px 0;
                    border: 3px solid #dee2e6;
                    border-radius: 8px;
                }

                .qr-instruction {
                    display: block;
                    color: #666;
                    font-size: 12px;
                    margin-top: 10px;
                }

                .ticket-footer {
                    background: #f8f9fa;
                    padding: 20px 30px;
                    border-top: 2px dashed #dee2e6;
                }

                .footer-content {
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;
                }

                .footer-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    color: #666;
                }

                .footer-item i {
                    font-size: 16px;
                    color: #667eea;
                }

                .stub-sponsor {
                    margin-left: auto;
                }

                .stub-sponsor img {
                    max-height: 30px;
                    max-width: 70px;
                    object-fit: contain;
                    opacity: 0.85;
                    //filter: grayscale(100%);
                }


                .tear-line {
                    height: 20px;
                    background-image: repeating-linear-gradient(
                        90deg,
                        #ddd 0px,
                        #ddd 10px,
                        transparent 10px,
                        transparent 20px
                    );
                    margin: 20px 0;
                }

                .ticket-stub {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                    background: #fafafa;
                }

                .stub-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .stub-details {
                    flex: 1;
                }

                .stub-code {
                    font-family: 'Courier New', monospace;
                    font-size: 14px;
                    color: #666;
                    margin: 5px 0;
                }

                .stub-name {
                    font-size: 13px;
                    color: #888;
                }


                .ticket-sponsors {
                    border-top: 2px dashed #dee2e6;
                    padding: 20px 30px;
                    background: #fff;
                    text-align: center;
                }

                .sponsor-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: #666;
                    margin-bottom: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .sponsor-list {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 25px;
                    flex-wrap: wrap;
                }

                .sponsor-list img {
                    max-height: 45px;
                    max-width: 120px;
                    object-fit: contain;
                    //filter: grayscale(100%);
                    opacity: 0.85;
                }


                /* PRINT STYLES */
                @media print {
                    /* Force color printing */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;

                    }

                    .ticket-container {
                        height: 297mm;
                        max-height: 297mm;
                        overflow: hidden;
                    }

                    .stub-sponsor {
                        display: flex !important;
                        gap: 6pt !important;
                        flex-wrap: nowrap !important;
                    }

                    .stub-sponsor img {
                        max-height: 16pt !important;
                        max-width: 40pt !important;
                        object-fit: contain !important;
                    }


                    .no-print {
                        display: none !important;
                    }

                    /* Reset modal for print */
                    .modal {
                        position: static !important;
                    }

                    .modal-dialog {
                        margin: 0 !important;
                        max-width: 100% !important;
                    }

                    .modal-content {
                        border: none !important;
                        box-shadow: none !important;
                    }

                    .modal-body {
                        padding: 0 !important;
                    }

                    /* Page setup */
                    @page {
                        size: 180mm 260mm;
                        margin: 0mm;
                    }

                    body {
                        margin: 0;
                        padding: 0;
                    }

                    /* Container optimization */
                    .ticket-print-container {
                        max-width: 100%;
                        margin: 0;
                        padding: 0;
                    }

                    .ticket-card {
                        box-shadow: none !important;
                        page-break-inside: avoid;
                        break-inside: avoid;
                        border: 2px solid #333 !important;
                    }

                    /* Header - ensure gradient prints */
                    .ticket-header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        color: white !important;
                        padding: 14pt !important;
                    }

                    .ticket-title {
                        font-size: 18pt !important;
                        color: white !important;
                    }

                    .ticket-code-display {
                        background: rgba(255, 255, 255, 0.3) !important;
                        color: white !important;
                        font-size: 14pt !important;
                    }

                    /* Fix Bootstrap grid for print */
                    .row {
                        display: flex !important;
                        flex-wrap: nowrap !important;
                        margin: 0 !important;
                    }

                    .col-8 {
                        width: 66.666667% !important;
                        flex: 0 0 66.666667% !important;
                        max-width: 66.666667% !important;
                        padding: 0 8pt 0 0 !important;
                    }

                    .col-4 {
                        width: 33.333333% !important;
                        flex: 0 0 33.333333% !important;
                        max-width: 33.333333% !important;
                        padding: 0 !important;
                    }

                    /* Body content */
                    .ticket-body {
                        padding: 15pt !important;
                    }

                    .ticket-section {
                        margin-bottom: 12pt !important;
                    }

                    .section-title {
                        font-size: 9pt !important;
                        margin-bottom: 6pt !important;
                        padding-bottom: 4pt !important;
                        border-bottom: 1.5pt solid #eee !important;
                    }

                    .detail-item {
                        margin-bottom: 4pt !important;
                        font-size: 9pt !important;
                    }

                    .detail-item .label {
                        min-width: 80pt !important;
                        font-size: 9pt !important;
                    }

                    .detail-item .value {
                        font-size: 9pt !important;
                    }

                    /* Status badge */
                    .badge-status {
                        padding: 2pt 6pt !important;
                        font-size: 8pt !important;
                        border: 1pt solid !important;
                    }

                    .status-valid {
                        background: #d4edda !important;
                        color: #155724 !important;
                        border-color: #155724 !important;
                    }

                    .status-used {
                        background: #d1ecf1 !important;
                        color: #0c5460 !important;
                        border-color: #0c5460 !important;
                    }

                    /* QR Section */
                    .qr-section {
                        background: #f8f9fa !important;
                        padding: 10pt !important;
                        border-radius: 4pt !important;
                    }

                    .qr-code-image {
                        width: 120pt !important;
                        height: 120pt !important;
                        margin: 8pt 0 !important;
                        border: 2pt solid #dee2e6 !important;
                    }

                    .qr-instruction {
                        font-size: 7pt !important;
                        margin-top: 4pt !important;
                    }

                    /* Footer */
                    .ticket-footer {
                        background: #f8f9fa !important;
                        padding: 10pt 15pt !important;
                    }

                    .footer-content {
                        display: flex !important;
                        justify-content: space-around !important;
                        flex-wrap: wrap !important;
                    }

                    .footer-item {
                        font-size: 8pt !important;
                    }

                    .footer-item i {
                        font-size: 10pt !important;
                    }

                    /* Tear line */
                    .tear-line {
                        height: 15pt !important;
                        margin: 10pt 0 !important;
                        page-break-before: avoid;
                    }

                    /* Stub */
                    .ticket-stub {
                        background: #fafafa !important;
                        padding: 10pt !important;
                        border: 1pt solid #ddd !important;
                        page-break-inside: avoid;
                    }

                    .stub-content {
                        display: flex !important;
                        align-items: center !important;
                        gap: 8pt !important;
                    }

                    .stub-code {
                        font-size: 9pt !important;
                        margin: 3pt 0 !important;
                    }

                    .stub-name {
                        font-size: 8pt !important;
                    }

                    /* Ensure proper text rendering */
                    p, span, div, td, th {
                        orphans: 3;
                        widows: 3;
                    }

                    h1, h2, h3, h4, h5, h6 {
                        page-break-after: avoid;
                    }
                    
                    
                }
            `}</style>
        </>
    );
};

export default PrintTicket;
