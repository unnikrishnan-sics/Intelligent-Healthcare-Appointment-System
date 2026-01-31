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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.map((patient) => (
                        <div key={patient._id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden group">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl`} style={{ backgroundColor: theme.primaryColor }}>
                                        {patient.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{patient.name}</h3>
                                        <p className="text-xs text-gray-500">{patient.age} years • {patient.gender}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} className="text-gray-400" />
                                        <span>{patient.email}</span>
                                    </div>
                                    {patient.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-gray-400" />
                                            <span>{patient.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                                        <Clock size={14} className="text-gray-400" />
                                        <span className="text-xs text-gray-500">Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPatient(patient)}
                                className="w-full bg-gray-50 px-6 py-3 border-t flex justify-between items-center group-hover:bg-blue-50 transition-colors text-left"
                            >
                                <span className="text-xs font-semibold text-gray-500 group-hover:text-blue-600">View History</span>
                                <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600" />
                            </button>
                        </div>
                    ))}
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
