"use client";

import React, { useEffect, useRef, useState } from "react";

interface FileCaptureInputProps {
    value?: File | null;
    onChange: (file: File | null) => void;
    startImmediately?: boolean;
}

const FileCaptureInput: React.FC<FileCaptureInputProps> = ({ value, onChange, startImmediately = false }) => {
    const [preview, setPreview] = useState<string | null>(value ? URL.createObjectURL(value) : null);
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setCameraActive(true);
                }
            } catch (err) {
                console.error("Cannot access camera", err);
                alert("Cannot access camera");
            }
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    };

    const takePicture = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                if (blob) {
                    const file = new File([blob], `capture-${Date.now()}.png`, { type: "image/png" });
                    onChange(file);
                    setPreview(URL.createObjectURL(file));
                }
            }, "image/png");
        }
        stopCamera();
    };

    // Start camera automatically if flag true
    useEffect(() => {
        if (startImmediately) startCamera();
    }, [startImmediately]);

    return (
        <div className="d-flex flex-column gap-2">
            {preview && <img src={preview} alt="Preview" className="img-fluid rounded" />}

            {!cameraActive && (
                <button type="button" className="btn btn-outline-primary" onClick={startCamera}>
                    Take Picture
                </button>
            )}

            {cameraActive && (
                <div className="d-flex flex-column gap-2">
                    <video ref={videoRef} autoPlay playsInline className="border rounded w-100"></video>
                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-success" onClick={takePicture}>Capture</button>
                        <button type="button" className="btn btn-secondary" onClick={stopCamera}>Cancel</button>
                    </div>
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                className="form-control mt-1"
                onChange={e => {
                    const file = e.target.files?.[0] || null;
                    onChange(file);
                    if (file) setPreview(URL.createObjectURL(file));
                }}
            />

            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

export default FileCaptureInput;
