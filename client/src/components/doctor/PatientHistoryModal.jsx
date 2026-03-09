import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, Clock, FileText, ChevronDown, ChevronUp, Pill, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PatientHistoryModal = ({ patient, onClose }) => {
    const { theme } = useTheme();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRecord, setExpandedRecord] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!patient) return;
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/doctors/patients/${patient._id}/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(res.data);
                // Expand first record by default if it has prescriptions
                if (res.data.length > 0 && res.data[0].prescriptions?.length > 0) {
                    setExpandedRecord(res.data[0]._id);
                }
            } catch (error) {
                console.error("Error fetching patient history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [patient]);

    if (!patient) return null;

    return (
        <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center p-4 animate-fade-in backdrop-blur-md bg-white/30">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/50 animate-scale-up">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/40">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ backgroundColor: theme.primaryColor }}>
                            {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-800 leading-tight">{patient.name}</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Medical History</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: theme.primaryColor }}></div>
                            <p className="text-sm font-bold text-gray-400 uppercase">Fetching Records...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="text-gray-300" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">No Records Found</h3>
                            <p className="text-sm text-gray-500">There are no past consultation records for this patient.</p>
                        </div>
                    ) : (
                        history.map((record) => (
                            <div
                                key={record._id}
                                className={`bg-white rounded-2xl border transition-all duration-300 ${expandedRecord === record._id ? 'border-transparent shadow-xl ring-2' : 'border-gray-100 hover:shadow-md'}`}
                                style={expandedRecord === record._id ? { ringColor: theme.primaryColor + '20' } : {}}
                            >
                                <div
                                    className="p-4 cursor-pointer flex justify-between items-center"
                                    onClick={() => setExpandedRecord(expandedRecord === record._id ? null : record._id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center justify-center bg-gray-50 p-2 rounded-xl border border-gray-100 min-w-[64px]">
                                            <span className="text-[10px] font-black text-gray-400 uppercase">
                                                {new Date(record.date).toLocaleDateString(undefined, { month: 'short' })}
                                            </span>
                                            <span className="text-lg font-black text-gray-800">
                                                {new Date(record.date).getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${record.queueStatus === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {record.queueStatus || 'Visited'}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400">
                                                    #{record.tokenNumber}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-gray-700">{record.reason || 'General Checkup'}</p>
                                        </div>
                                    </div>
                                    <div className="text-gray-400">
                                        {expandedRecord === record._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {expandedRecord === record._id && (
                                    <div className="px-4 pb-4 animate-slide-down">
                                        <div className="pt-4 border-t border-gray-50 space-y-4">
                                            {/* Notes / Reason */}
                                            {record.notes && (
                                                <div className="bg-gray-50 p-3 rounded-xl">
                                                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                                                        <Info size={12} /> Doctor's Notes
                                                    </h4>
                                                    <p className="text-sm text-gray-600 italic">"{record.notes}"</p>
                                                </div>
                                            )}

                                            {/* Prescriptions */}
                                            <div>
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-1">
                                                    <Pill size={12} /> Prescription Details
                                                </h4>
                                                {record.prescriptions && record.prescriptions.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {record.prescriptions.map((pres) => (
                                                            <div key={pres._id} className="space-y-2">
                                                                {pres.medicines.map((med, idx) => (
                                                                    <div key={idx} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                                                        <div>
                                                                            <p className="text-sm font-black text-gray-800">{med.name}</p>
                                                                            <p className="text-[10px] font-bold text-gray-500 uppercase">{med.frequency} • {med.duration}</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <span className="text-xs font-bold text-gray-400">{med.dosage}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {pres.notes && (
                                                                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg font-medium">
                                                                        Instruction: {pres.notes}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-4 border rounded-xl border-dashed border-gray-200">
                                                        <p className="text-xs text-gray-400 font-bold uppercase">No Prescription Issued</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-white flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-bold text-gray-600 transition-colors"
                    >
                        Close History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientHistoryModal;
