import React, {useCallback, useEffect, useState} from "react";
import {UserLog, InUserLog} from "@/models/UserLog";
import {useRouter} from "next/router";
import useBlockUI from "@/pages/_components/useBlockUI";
import { buildQuery } from '@/lib/FilterDriver';
import {each} from "jquery";
import {InUser} from "@/models/User";
import {unixToRelativeTime} from "@/utils/date";
import ModalDataPage from "@/pages/user/_modal_data";

const ActivityPage: React.FC = () => {
    const router = useRouter();
    const { blockUI, unblockUI } = useBlockUI();
    const { id } = router.query;
    const [logs, setLogs] = useState<InUserLog[]>([]);
    const [perPage, setPerPage] = useState<number>(50);



    const getQuery = useCallback(() => {
        const query = {
            user_id : id,
            event_section : '<>AUTH'
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
        console.log({'query' : query});
        await Model.list(query).then(response => {
            setLogs(response.user_logs);
        }).finally(() => {
            unblockUI();
        });
    };

    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState();
    const handleOpenModal = (data) => {
        setData(data);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }


    useEffect(() => {
        getLog();
    }, [id]);


    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5>Aktivitas Terbaru</h5>
            </div>
            <div className="card-body">
                <ul className="timeline">
                    {logs.length > 0 ? (
                        logs.map((log: InUserLog, key) => (
                            <li className="timeline-item timeline-item-transparent" key={key}>
                                <span className="timeline-point timeline-point-primary"></span>
                                <div className="timeline-event">
                                    <div className="timeline-header mb-1">
                                        <h6 className="mb-0"><label htmlFor="" className="label label-danger">{log.event_action}</label> {log.event_section}</h6>
                                        <small className="text-muted">{unixToRelativeTime(log.created_at)}</small>
                                    </div>
                                    <p className="mb-2">{log.event_note}</p>
                                    <div className="d-flex">
                                        <button className="me-3 btn btn-info" onClick={() => handleOpenModal(log.data)}>Data</button>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div className="alert alert-solid-info" role="alert">
                            <span>Data tidak ditemukan</span>
                        </div>
                    )}

                </ul>
            </div>

            <ModalDataPage show={showModal} onClose={handleCloseModal} data={data}/>
        </div>
    )

}

export default ActivityPage;