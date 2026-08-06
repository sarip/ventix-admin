import React from "react";
import ReactLoading from "react-loading";

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="d-flex flex-column align-items-center justify-content-center p-4 rounded-4 shadow-sm bg-white bg-opacity-75 backdrop-blur">
                <ReactLoading type="spin" color="#696cff" height={48} width={48} />
                <span className="mt-3 fw-semibold text-primary fs-6 tracking-wide">Ventix Admin</span>
                <small className="text-muted fs-7">Memuat halaman...</small>
            </div>
        </div>
    );
};

export default Loading;
