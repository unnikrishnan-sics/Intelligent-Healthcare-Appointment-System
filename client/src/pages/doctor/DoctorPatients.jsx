import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { Search, User, Phone, Mail, Calendar, Clock, ChevronRight } from 'lucide-react';

const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { theme } = useTheme();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/doctors/patients`, config);
                setPatients(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching patients", error);
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Fetch history when patient is selected
    useEffect(() => {
        if (selectedPatient) {
            const fetchHistory = async () => {
                setLoadingHistory(true);
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/doctors/patients/${selectedPatient._id}/history`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setHistory(res.data);
                } catch (error) {
                    console.error("Error fetching history", error);
                } finally {
                    setLoadingHistory(false);
                }
            };
            fetchHistory();
        } else {
            setHistory([]);
        }
    }, [selectedPatient]);

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.primaryColor}-600`}></div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in relative">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Patients</h1>
                    <p className="text-gray-500 text-sm">Manage and view your patient history</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search patients..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredPatients.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
                    <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                        <User size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No Patients Found</h3>
                    <p className="text-gray-500 mt-2">
                        {searchTerm ? "No patients match your search." : "You haven't consulted with any patients yet."}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Patient ID</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Patient Name</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact & Info</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Last Visit</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredPatients.map((patient) => (
                                <tr key={patient._id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-xs font-bold text-gray-400">#{patient._id.slice(-6).toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm" style={{ backgroundColor: theme.primaryColor }}>
                                                {patient.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-gray-900 leading-tight">{patient.name}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase">{patient.gender} • {patient.age}y</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                <Mail size={12} className="text-gray-400" />
                                                {patient.email}
                                            </div>
                                            {patient.phone && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                    <Phone size={12} className="text-gray-400" />
                                                    {patient.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <Calendar size={14} className="text-gray-400" />
                                            {new Date(patient.lastVisit).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => setSelectedPatient(patient)}
                                            className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm flex items-center gap-2 ml-auto"
                                        >
                                            View History <ChevronRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Patient History Modal */}
            {selectedPatient && (
                <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center p-4 animate-fade-in backdrop-blur-md bg-white/30">
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/40">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold`} style={{ backgroundColor: theme.primaryColor }}>
                                    {selectedPatient.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{selectedPatient.name}</h3>
                                    <p className="text-xs text-gray-500">Medical History</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedPatient(null)} className="p-2 hover:bg-gray-200 rounded-full">
                                <ChevronRight className="rotate-90" size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {loadingHistory ? (
                                <div className="text-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center text-gray-400 py-10">
                                    No history records found.
                                </div>
                            ) : (
                                history.map((record) => (
                                    <div key={record._id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-1 inline-block">
                                                    {record.queueStatus || 'Completed'}
                                                </span>
                                                <p className="font-semibold text-gray-800">{new Date(record.date).toLocaleDateString()} • {record.timeSlot}</p>
                                            </div>
                                            {record.tokenNumber && <span className="text-sm font-bold text-gray-400">#{record.tokenNumber}</span>}
                                        </div>
                                        {record.reason && (
                                            <div className="text-sm text-gray-600 mt-2">
                                                <span className="font-medium text-gray-700">Reason:</span> {record.reason}
                                            </div>
                                        )}
                                        {/* Placeholder for Prescriptions if they were populated */}
                                        {/* <button className="mt-3 text-sm text-blue-600 font-medium hover:underline">View Prescription</button> */}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-4 border-t bg-gray-50 text-right">
                            <button onClick={() => setSelectedPatient(null)} className="px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-100">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorPatients;
