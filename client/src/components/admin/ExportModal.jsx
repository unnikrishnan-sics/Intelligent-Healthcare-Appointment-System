import React, { useState, useEffect } from 'react';
import { X, Download, Stethoscope, User, ChevronRight, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ExportModal = ({ isOpen, onClose, doctors }) => {
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        if (selectedDoctor) {
            fetchPatients(selectedDoctor);
        } else {
            setPatients([]);
            setSelectedPatient('');
        }
    }, [selectedDoctor]);

    const fetchPatients = async (doctorId) => {
        setLoadingPatients(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/doctors/${doctorId}/patients`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(res.data);
            setSelectedPatient('');
        } catch (err) {
            console.error('Error fetching patients:', err);
            toast.error('Failed to load patients for this doctor');
        } finally {
            setLoadingPatients(false);
        }
    };

    const handleExport = async () => {
        if (!selectedDoctor || !selectedPatient) {
            toast.error('Please select both a doctor and a patient');
            return;
        }

        setExporting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/export-appointments`, {
                params: { doctorId: selectedDoctor, patientId: selectedPatient },
                headers: { Authorization: `Bearer ${token}` }
            });

            const appointments = res.data;
            if (appointments.length === 0) {
                toast.error('No appointments found for this selection');
                return;
            }

            // Generate CSV
            const headers = ['Date', 'Time Slot', 'Doctor', 'Patient', 'Status', 'Payment', 'Token No'];
            const csvRows = [
                headers.join(','),
                ...appointments.map(apt => [
                    new Date(apt.date).toLocaleDateString(),
                    `"${apt.timeSlot}"`,
                    `"${apt.doctorId?.name}"`,
                    `"${apt.patientId?.name}"`,
                    apt.status,
                    apt.paymentStatus,
                    apt.tokenNumber || 'N/A'
                ].join(','))
            ].join('\n');

            // Download file
            const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            const doctorName = doctors.find(d => d._id === selectedDoctor)?.name.replace(/\s+/g, '_');
            const patientName = patients.find(p => p._id === selectedPatient)?.name.replace(/\s+/g, '_');

            link.setAttribute('href', url);
            link.setAttribute('download', `Appointments_${doctorName}_${patientName}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('Report exported successfully!');
            onClose();
        } catch (err) {
            console.error('Export error:', err);
            toast.error('Failed to export report');
        } finally {
            setExporting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/10 backdrop-blur-2xl animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-scale-up border border-gray-100 flex flex-col">

                {/* Header */}
                <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                <Download className="text-blue-500" /> Export Appointments
                            </h2>
                            <p className="text-gray-500 text-sm mt-1 font-medium">Filter by doctor and patient to generate CSV</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white text-gray-400 hover:text-gray-600 transition-all p-2 rounded-xl border border-gray-100 shadow-sm hover:shadow-md active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Step 1: Select Doctor */}
                    <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Stethoscope size={14} /> 1. Select Doctor
                        </label>
                        <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border-gray-100 border-2 rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-bold text-gray-700"
                        >
                            <option value="">Choose a Doctor...</option>
                            {doctors.map(doc => (
                                <option key={doc._id} value={doc._id}>
                                    {doc.name} ({doc.specialization})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Step 2: Select Patient */}
                    <div className={`space-y-3 transition-all duration-500 ${!selectedDoctor ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <User size={14} /> 2. Select Patient
                        </label>
                        <div className="relative">
                            <select
                                value={selectedPatient}
                                onChange={(e) => setSelectedPatient(e.target.value)}
                                disabled={loadingPatients || !selectedDoctor}
                                className="w-full px-6 py-4 bg-gray-50 border-gray-100 border-2 rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-bold text-gray-700 disabled:bg-gray-100 placeholder:text-gray-300"
                            >
                                <option value="">{loadingPatients ? 'Loading Patients...' : 'Choose a Patient...'}</option>
                                {patients.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                            {loadingPatients && (
                                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                    <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        {selectedDoctor && !loadingPatients && patients.length === 0 && (
                            <p className="text-[10px] text-amber-600 font-bold uppercase ml-1">No patients found for this doctor</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 text-gray-500 font-bold rounded-2xl border-2 border-gray-50 hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={exporting || !selectedDoctor || !selectedPatient}
                            className="flex-[2] py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
                        >
                            {exporting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <FileSpreadsheet size={20} />
                                    <span>Download Report</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
