import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import React from "react";

const MySwal = withReactContent(Swal);

interface ConfirmDialogProps {
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonColor?: string;
    cancelButtonColor?: string;
    visible: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
                                                         title = "Apa Anda Yakin?",
                                                         text= "Setelah dihapus, anda tidak dapat mengembalikannya",
                                                         confirmButtonText = 'Ya, Hapus',
                                                         cancelButtonText = 'Tidak',
                                                         confirmButtonColor = '#3085d6',
                                                         cancelButtonColor = '#d33',
                                                         visible= false,
                                                         onConfirm,
                                                         onCancel,
                                                     }) => {
        React.useEffect( () => {
    console.log({'visible': visible});
        if(visible) {
            const showDialog = async () => {
                const result = await MySwal.fire({
                    // key: undefined, props: undefined, type: undefined,
                    title,
                    text,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor,
                    cancelButtonColor,
                    confirmButtonText,
                    cancelButtonText
                });

                if (result.isConfirmed) {
                    onConfirm();
                } else if (onCancel) {
                    onCancel();
                }
            };

            showDialog();

        }
        }, [visible]);

    return null;
};

export default ConfirmDialog;
