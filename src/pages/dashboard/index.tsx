'use client';

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export default function DashboardPage() {
    // Refs untuk semua chart
    const workChartRef = useRef<HTMLCanvasElement | null>(null);
    const slaChartRef = useRef<HTMLCanvasElement | null>(null);
    const alertChartRef = useRef<HTMLCanvasElement | null>(null);
    const assetChartRef = useRef<HTMLCanvasElement | null>(null);
    const sensorChartRef = useRef<HTMLCanvasElement | null>(null);

    const [data, setData] = useState({
        sensors: [],
        alerts: [],
        incidents: []
    });

    // Dummy data untuk Chart
    const workTypeData = [
        { work_type: 'Preventive', total: 40 },
        { work_type: 'Corrective', total: 25 },
        { work_type: 'Predictive', total: 15 },
    ];

    const slaTrend = [
        { date: '2025-10-21', breached: 3, total: 20 },
        { date: '2025-10-22', breached: 5, total: 18 },
        { date: '2025-10-23', breached: 2, total: 22 },
        { date: '2025-10-24', breached: 6, total: 21 },
    ];

    const alertsTrend = [
        { date: '2025-10-21', total: 5 },
        { date: '2025-10-22', total: 7 },
        { date: '2025-10-23', total: 3 },
    ];

    const assetStatus = [
        { status: 'Active', total: 40 },
        { status: 'Maintenance', total: 10 },
        { status: 'Offline', total: 5 },
        { status: 'Retired', total: 3 },
    ];

    const sensorTrend = [
        { date: '2025-10-21', avg_temp: 27.5, avg_humidity: 60 },
        { date: '2025-10-22', avg_temp: 28.2, avg_humidity: 58 },
        { date: '2025-10-23', avg_temp: 26.8, avg_humidity: 65 },
    ];

    // Dummy tabel
    const dummySensors = [
        { asset_name: 'AC Unit 1', location: 'Lantai 2', suhu: 28, humidity: 65, status: 'Normal', lamp_state: 'On', created_at: '2025-10-28 11:00' },
        { asset_name: 'Chiller 1', location: 'Basement', suhu: 34, humidity: 75, status: 'Warning', lamp_state: 'Off', created_at: '2025-10-28 11:05' },
    ];

    const dummyAlerts = [
        { alert_id: 1, message: 'High temperature', severity: 'high', status: 'open', created_at: '2025-10-28 10:45' },
    ];

    const dummyIncidents = [
        { incident_id: 101, title: 'Chiller Malfunction', severity: 'critical', status: 'open', incident_time: '2025-10-27 22:10' },
    ];

    useEffect(() => {
        // Set data tabel
        setData({
            sensors: dummySensors,
            alerts: dummyAlerts,
            incidents: dummyIncidents
        });

        // Simpan referensi chart untuk cleanup nanti
        const charts: Chart[] = [];

        // Pastikan ref ada
        if (workChartRef.current) {
            charts.push(
                new Chart(workChartRef.current, {
                    type: 'doughnut',
                    data: {
                        labels: workTypeData.map(r => r.work_type),
                        datasets: [{ data: workTypeData.map(r => r.total), backgroundColor: ['#007bff', '#ffc107', '#dc3545', '#28a745'] }]
                    }
                })
            );
        }

        if (slaChartRef.current) {
            charts.push(
                new Chart(slaChartRef.current, {
                    type: 'line',
                    data: {
                        labels: slaTrend.map(r => r.date),
                        datasets: [
                            { label: 'Breached', data: slaTrend.map(r => r.breached), borderColor: '#dc3545', fill: false },
                            { label: 'Total', data: slaTrend.map(r => r.total), borderColor: '#28a745', fill: false }
                        ]
                    }
                })
            );
        }

        if (alertChartRef.current) {
            charts.push(
                new Chart(alertChartRef.current, {
                    type: 'bar',
                    data: {
                        labels: alertsTrend.map(r => r.date),
                        datasets: [{ data: alertsTrend.map(r => r.total), backgroundColor: '#ffc107' }]
                    }
                })
            );
        }

        if (assetChartRef.current) {
            charts.push(
                new Chart(assetChartRef.current, {
                    type: 'pie',
                    data: {
                        labels: assetStatus.map(r => r.status),
                        datasets: [{ data: assetStatus.map(r => r.total), backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#6c757d'] }]
                    }
                })
            );
        }

        if (sensorChartRef.current) {
            charts.push(
                new Chart(sensorChartRef.current, {
                    type: 'line',
                    data: {
                        labels: sensorTrend.map(r => r.date),
                        datasets: [
                            { label: 'Temperature (°C)', data: sensorTrend.map(r => r.avg_temp), borderColor: '#dc3545', backgroundColor: 'rgba(220,53,69,0.2)', fill: true },
                            { label: 'Humidity (%)', data: sensorTrend.map(r => r.avg_humidity), borderColor: '#007bff', backgroundColor: 'rgba(0,123,255,0.2)', fill: true }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                })
            );
        }

        // Cleanup Chart untuk hindari duplikasi saat re-render
        return () => {
            charts.forEach(chart => chart.destroy());
        };
    }, []);

    return (
        <>
            <div className="flex-grow-1 container-p-y">
                <h4 className="py-2 breadcrumb-wrapper mb-0">
                    <i className="fas fa-tachometer-alt"></i> Dashboard
                </h4>
                <p className="text-muted mb-4">Halaman ini menampilkan ringkasan performa sistem (dummy).</p>

                {/* KPI CARDS */}
                <div className="row">

                    {[
                        {title: 'Total Assets', color: 'primary', icon: 'fa-building', value: 58},
                        {title: 'Preventive WO', color: 'success', icon: 'fa-cogs', value: 40},
                        {title: 'Corrective WO', color: 'warning', icon: 'fa-wrench', value: 22},
                        {title: 'Predictive WO', color: 'danger', icon: 'fa-robot', value: 10},
                        {title: 'Open Ticket', color: 'info', icon: 'fa-ticket', value: 2},
                        {title: 'SLA Breach', color: 'danger', icon: 'fa-stopwatch', value: 6},
                        {title: 'Active Alert', color: 'warning', icon: 'fa-bell', value: 10},
                        {title: 'Escalation', color: 'default', icon: 'fa-arrow-up', value: 2},
                    ].map((card, idx) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={idx}>
                            <div className={`card card-border-shadow-${card.color}  h-100`}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-2 pb-1">
                                        <div className="avatar me-2">
                                            <span className={`avatar-initial rounded bg-label-${card.color}`}><i
                                                className={`fas ${card.icon}`}></i></span>
                                        </div>
                                        <h4 className="ms-1 mb-0">{card.value}</h4>
                                    </div>
                                    <p className="mb-1">{card.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CHARTS */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary">
                                <h5 className="card-title text-white fw-normal mb-0"><i className="fas fa-tasks me-2"></i> Work Order Type</h5>
                            </div>
                            <div className="card-body">
                                <canvas className="mt-3" ref={workChartRef} height="260"></canvas>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-header bg-info">
                                <h5 className="card-title text-white fw-normal mb-0">
                                    <i className="fas fa-stopwatch me-2"></i> SLA Trend (7 Days)
                                </h5>
                            </div>
                            <div className="card-body">
                                <canvas className="mt-3" ref={slaChartRef} height="260"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-header bg-warning">
                                <h5 className="card-title text-white fw-normal mb-0">
                                    <i className="fas fa-bell me-2"></i> Alerts Trend
                                </h5>
                            </div>
                            <div className="card-body">
                                <canvas className="mt-3" ref={alertChartRef} height="260"></canvas>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success">
                                <h5 className="card-title text-white fw-normal mb-0">
                                    <i className="fas fa-database me-2"></i> Asset Status
                                </h5>
                            </div>
                            <div className="card-body">
                                <canvas className="mt-3" ref={assetChartRef} height="260"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SENSOR TREND */}
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-info">
                        <h5 className="card-title text-white fw-normal mb-0">
                            <i className="fas fa-broadcast-tower me-2"></i> Sensor Telemetry (7 Days)
                        </h5>
                    </div>
                    <div className="card-body" style={{height: 320}}>
                        <canvas className="mt-3" ref={sensorChartRef}></canvas>
                    </div>
                </div>

                {/* TABLES */}
                <div className="card mb-3">
                    <div className="card-header bg-primary text-white">
                        <h5 className="card-title text-white fw-normal mb-0">
                            <i className="fas fa-thermometer-half me-2"></i> Sensor Terbaru
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive mt-3">
                            <table className="table table-bordered table-striped">
                                <thead>
                                <tr>
                                    <th>Asset</th><th>Location</th><th>Suhu</th><th>Humidity</th><th>Status</th><th>Lamp</th><th>Waktu</th></tr></thead>
                                <tbody>
                                {data.sensors.map((s: any, i) => (
                                    <tr key={i} className={s.status !== 'Normal' ? 'table-danger' : ''}>
                                        <td>{s.asset_name}</td><td>{s.location}</td><td>{s.suhu}</td><td>{s.humidity}</td>
                                        <td>{s.status}</td><td>{s.lamp_state}</td><td>{s.created_at}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="card mb-3">
                    <div className="card-header bg-warning ">
                        <h5 className="card-title text-white fw-normal mb-0">
                            <i className="fas fa-bell me-2"></i> Alerts
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive mt-3">
                            <table className="table table-bordered table-striped">
                                <thead><tr><th>ID</th><th>Message</th><th>Severity</th><th>Status</th><th>Waktu</th></tr></thead>
                                <tbody>
                                {data.alerts.map((a: any, i) => (
                                    <tr key={i} className={a.severity === 'high' ? 'table-danger' : ''}>
                                        <td>{a.alert_id}</td><td>{a.message}</td><td>{a.severity}</td><td>{a.status}</td><td>{a.created_at}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="card mb-5">
                    <div className="card-header bg-success">
                        <h5 className="card-title text-white fw-normal mb-0">
                            <i className="fas fa-exclamation-triangle me-2"></i> Incidents
                        </h5>
                    </div>
                    <div className="card-body ">
                        <div className="table-responsive mt-3">
                            <table className="table table-bordered table-striped">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Severity</th>
                                    <th>Status</th>
                                    <th>Waktu</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.incidents.map((i: any, idx) => (
                                    <tr key={idx}
                                        className={['high', 'critical'].includes(i.severity) ? 'table-danger' : ''}>
                                        <td>{i.incident_id}</td>
                                        <td>{i.title}</td>
                                        <td>{i.severity}</td>
                                        <td>{i.status}</td>
                                        <td>{i.incident_time}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}
