import React, {useCallback, useEffect, useState} from "react";
import {useRouter} from "next/router";
import useBlockUI from "@/pages/_components/useBlockUI";
import {InUserLog, UserLog} from "@/models/UserLog";
import {buildQuery} from "@/lib/FilterDriver";
import {detectBrowser, detectDevice, detectDeviceIcon} from "@/utils/device";
import {convertUnixTimestampToDate} from "@/utils/date";
import Auth from "@/models/Auth";
import {string} from "yup";
import Swal from "sweetalert2";
import {showToast} from "@/utils/toast";
import {InUser} from "@/models/User";

interface SecurityProps {
    data?: InUser
}

const SecurityPage: React.FC = (data) => {
    const router = useRouter();
    const {blockUI, unblockUI} = useBlockUI();
    const {id} = router.query;
    const [logs, setLogs] = useState<InUserLog[]>([]);
    const [perPage, setPerPage] = useState<number>(10);
    const [validationError, SetValidationError] = useState<{ [key: string]: string }>({});
    const [password, setPassword] = useState({
        password: '',
        current_password: '',
    });


    const getQuery = useCallback(() => {
        const query = {
            user_id: id,
            event_section: 'AUTH'
        };
        return {
            filter: buildQuery(query),
            sort_by: 'created_at:desc',
            per_page: perPage,
        };
    }, [perPage]);


    const Model = new UserLog();

    const getLog = async () => {
        const query = getQuery();
        await Model.list(query).then(response => {
            setLogs(response.user_logs);
        }).finally(() => {
            unblockUI();
        });
    };
    useEffect(() => {
        getLog();
    }, [id]);


    const handleChange = (e) => {
        const {name, value} = e.target;
        console.log({'name': name, 'value': value});
        setPassword((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const changePassword = () => {
        blockUI();
        Auth.updatePassword(password).then(response => {
            showToast("Berhasil .....", "success");
            if (data.data.username === localStorage.getItem("username")) {
                setTimeout(() => {
                    localStorage.removeItem('key');
                    router.push('/login');
                }, 2000)
            }
        }).catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Opss....',
                text: error.message,
            });
        }).finally(() => {
            unblockUI();
        });
    }


    return (
        <>
            <div className="card mb-4">
                <h5 className="card-header">Ganti Kata Sandi</h5>
                <div className="card-body">

                    <div className="alert alert-warning" role="alert">
                        <h6 className="alert-heading mb-1">Pastikan persyaratan ini terpenuhi</h6>
                        <span>Minimal 8 karakter, huruf kapital & simbol</span>
                    </div>
                    <div className="row">
                        <div className="mb-3 col-12 col-sm-6 form-password-toggle">
                            <label className="form-label" htmlFor="newPassword">Kata Sandi</label>
                            <div className="input-group input-group-merge">
                                <input className="form-control" type="password" id="newPassword" name="current_password"
                                       value={password.current_password} onChange={handleChange}
                                       placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"/>
                                <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                            </div>
                        </div>

                        <div className="mb-3 col-12 col-sm-6 form-password-toggle">
                            <label className="form-label" htmlFor="confirmPassword">kata sandi baru</label>
                            <div className="input-group input-group-merge">
                                <input className="form-control" type="password" name="password"
                                       value={password.password} onChange={handleChange} id="confirmPassword"
                                       placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"/>
                                <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                            </div>
                        </div>
                        <div>
                            <button onClick={changePassword} className="btn btn-primary me-2">Change Password</button>
                        </div>
                    </div>

                </div>
            </div>
            <div className="card">
                <h5 className="card-header">Perangkat Terbaru</h5>
                <div className="table-responsive">
                    <table className="table border-top">
                        <thead>
                        <tr>
                            <th className="text-truncate">Browser</th>
                            <th className="text-truncate">IP</th>
                            <th className="text-truncate">Recent Activities</th>
                        </tr>
                        </thead>
                        <tbody>
                        {logs.length > 0 ? (
                            logs.map((log: InUserLog, key: number) => (
                                <tr key={key}>
                                    <td className="text-truncate"><i
                                        className={`bx ${detectDeviceIcon(log.event_note)} me-3`}></i> <span
                                        className="fw-medium"> {detectBrowser(log.event_note)} on {detectDevice(log.event_note)}</span>
                                    </td>
                                    <td className="text-truncate">{log.ip_address}</td>
                                    <td className="text-truncate">{convertUnixTimestampToDate(log.created_at)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center">
                                    <div className="alert alert-solid-info m-3" role="alert">
                                        <span>Aktivitas tidak ditemukan</span>
                                    </div>
                                </td>

                            </tr>
                        )
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )

}

export default SecurityPage;