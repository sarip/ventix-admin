import { useEffect, useRef } from "react";
import type { NotificationMessage } from "@/types/notification";

interface Props {
    notif: NotificationMessage | null;
    onClose: () => void;
}

export default function NotificationModal({ notif, onClose }: Props) {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const modalObj = useRef<any>(null);

    useEffect(() => {
        if (!notif || !modalRef.current) return;

        const initModal = async () => {
            const bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
            modalObj.current = new bootstrap.Modal(modalRef.current);
            modalObj.current.show();
        };

        initModal();
    }, [notif]);

    const handleClose = () => {
        modalObj.current?.hide();
        onClose();
    };

    if (!notif) return null;

    return (
        <div className="modal fade" tabIndex={-1} ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">{notif.type.toUpperCase()}</h5>
                    </div>

                    <div className="modal-body">
                        <p>{notif.message}</p>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-primary" onClick={handleClose}>
                            OK
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
