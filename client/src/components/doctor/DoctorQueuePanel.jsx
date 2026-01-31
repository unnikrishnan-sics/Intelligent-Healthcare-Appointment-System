import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Pause, AlertCircle, RefreshCw, CheckCircle, SkipForward, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import PrescriptionModal from './PrescriptionModal';

const DoctorQueuePanel = ({ user }) => {
    const { theme } = useTheme();
    const [queue, setQueue] = useState([]);
    const [queueState, setQueueState] = useState({ isPaused: false });
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showPrescribeModal, setShowPrescribeModal] = useState(false);

    const fetchQueue = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/queue/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQueue(res.data.queue);
            setQueueState(res.data.queueState || { isPaused: false });
        } catch (error) {
            console.error("Error fetching queue", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 15000); // Polling every 15s
        return () => clearInterval(interval);
    }, [user._id]);

    const handleAction = async (endpoint, payload) => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/queue/${endpoint}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchQueue(); // Refresh immediately
        } catch (error) {
            console.error("Queue Action Error", error);
        } finally {
            setActionLoading(false);
        }
    };

    const callNext = async (currentAppt) => {
        if (!currentAppt) return;
        await handleAction('status', { appointmentId: currentAppt._id, status: 'In-Consultation' });
    };

    const completeCurrent = async (currentAppt) => {
        if (!currentAppt) return;
        await handleAction('status', { appointmentId: currentAppt._id, status: 'Completed' });
    };

    const skipCurrent = async (currentAppt) => {
        if (!currentAppt) return;
        await handleAction('status', { appointmentId: currentAppt._id, status: 'Skipped' });
    };

    const togglePause = async () => {
        await handleAction('control', { isPaused: !queueState.isPaused });
    };

    const toggleCritical = async (apptId) => {
        await handleAction('priority', { appointmentId: apptId });
    };

    // Derived State
    const currentPatient = queue.find(q => q.queueStatus === 'In-Consultation');
    const waitingQueue = queue.filter(q => q.queueStatus === 'Waiting');

    return (
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
            <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: theme.primaryColor }}>
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ActivityIcon /> Live Queue Management
                    </h2>
                    <p className="opacity-80 text-sm">Session: Morning • {waitingQueue.length} Waiting</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchQueue}
                        disabled={loading}
                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition shadow-sm"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={togglePause}
                        disabled={actionLoading}
                        className={`px-4 py-2 rounded-lg font-bold shadow-md transition flex items-center gap-2 ${queueState.isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                    >
                        {queueState.isPaused ? <><Play size={18} /> Resume Queue</> : <><Pause size={18} /> Take Break</>}
                    </button>
                </div>
            </div>

            <div className="p-6">
                {/* CURRENTLY SERVING */}
                <div className="mb-8">
                    <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-3">Currently Serving</h3>
                    {currentPatient ? (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center animate-fade-in">
                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                    {currentPatient.tokenNumber}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{currentPatient.patientId?.name || "Unknown"}</h3>
                                    <p className="text-gray-500">Reason: {currentPatient.reason || "General Checkup"}</p>
                                    {currentPatient.priority === 'Critical' && <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded mt-1">CRITICAL</span>}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPrescribeModal(true)}
                                    disabled={actionLoading}
                                    className="px-5 py-2 bg-purple-600 text-white font-bold rounded-lg shadow hover:bg-purple-700 transition flex items-center gap-2"
                                >
                                    <FileText size={18} /> Prescribe
                                </button>
                                <button
                                    onClick={() => completeCurrent(currentPatient)}
                                    disabled={actionLoading}
                                    className="px-5 py-2 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2"
                                >
                                    <CheckCircle size={18} /> Done
                                </button>
                                <button
                                    onClick={() => skipCurrent(currentPatient)}
                                    disabled={actionLoading}
                                    className="px-5 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                                >
                                    <SkipForward size={18} /> Skip
                                </button>
                                <button
                                    onClick={() => toggleCritical(currentPatient._id)}
                                    title={currentPatient.priority === 'Critical' ? "Mark Normal" : "Mark Critical"}
                                    className={`p-2 rounded-lg border transition flex items-center justify-center ${currentPatient.priority === 'Critical' ? 'bg-white border-red-200 text-red-600 hover:bg-red-50' : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'}`}
                                >
                                    <AlertCircle size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 italic mb-4">No patient in consultation.</p>
                            {waitingQueue.length > 0 && !queueState.isPaused && (
                                <button
                                    onClick={() => callNext(waitingQueue[0])}
                                    disabled={actionLoading}
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition animate-pulse"
                                >
                                    Call Next Token #{waitingQueue[0].tokenNumber}
                                </button>
                            )}
                            {queueState.isPaused && <p className="text-yellow-600 font-bold">Queue is Paused.</p>}
                        </div>
                    )}
                </div>

                {/* UPCOMING QUEUE */}
                <div>
                    <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-3">Up Next</h3>
                    <div className="space-y-3">
                        {waitingQueue.length > 0 ? waitingQueue.slice(0, 5).map((appt) => (
                            <div key={appt._id} className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${appt.priority === 'Critical' ? 'bg-red-50 border-red-200 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-white hover:bg-gray-50'}`}>
                                <div className="flex items-center gap-4">
                                    <span className={`font-mono text-lg font-bold w-10 text-center ${appt.priority === 'Critical' ? 'text-red-600' : 'text-gray-600'}`}>#{appt.tokenNumber}</span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-800">{appt.patientId?.name || "Patient"}</h4>
                                            {appt.priority === 'Critical' && <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse">CRITICAL</span>}
                                        </div>
                                        <p className="text-xs text-gray-400">Waiting since {new Date(appt.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleCritical(appt._id)}
                                        title={appt.priority === 'Critical' ? "Mark Normal" : "Mark Critical"}
                                        className={`p-2 rounded-full transition border ${appt.priority === 'Critical' ? 'bg-white border-red-200 text-red-600 hover:bg-red-50' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'}`}
                                    >
                                        <AlertCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-400 py-4">Queue is empty.</p>
                        )}
                    </div>
                </div>
                {showPrescribeModal && currentPatient && (
                    <PrescriptionModal
                        appointment={currentPatient}
                        onClose={() => setShowPrescribeModal(false)}
                        onSuccess={() => {
                            setShowPrescribeModal(false);
                            // Optionally auto-complete or refresh queue
                            fetchQueue();
                        }}
                    />
                )}
            </div>
        </div>
    );
};

const ActivityIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
);

export default DoctorQueuePanel;
