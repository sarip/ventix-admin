import React from "react";
import ReactLoading from "react-loading";

const Loading = () => {
    return (
        <div className="loading-overlay">
            <ReactLoading type="bars" color="#5a8dee" height={100} width={100} />
        </div>
    );
};

export default Loading;
