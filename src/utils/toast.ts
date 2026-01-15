import { toast, ToastOptions } from 'react-toastify';

// Fungsi untuk menampilkan toast
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {

    const playAudio = (audioSrc: string) => {
        const audio = new Audio(audioSrc);
        audio.play().catch((error) => {
            console.error('Error playing audio:', error);
        });
    };

    const options:{} = {
        position: 'top-right',
        autoClose: 2000, // Duration of toast visibility
        className: 'animate__animated animate__tada',
        bodyClassName: 'toast-body',
        toastClassName: 'bs-toast toast toast-ex',
        progressClassName: 'toast-progress'
    };
    switch (type) {
        case 'success':
            playAudio('/assets/audio/success.mp3');
            toast.success(message, options);
            break;
        case 'error':
            playAudio('/assets/audio/danger.mp3');
            toast.error(message, options);
            break;
        case 'info':
            playAudio('/assets/audio/success.mp3');
            toast.info(message, options);
            break;
        default:
            playAudio('/assets/audio/success.mp3');
            toast(message, options);
    }
};
