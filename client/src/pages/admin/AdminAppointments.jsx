import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { Calendar, Search, User, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import PrescriptionModal from '../../components/doctor/PrescriptionModal';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const { theme } = useTheme();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get('http://localhost:5000/api/appointments/admin/all', config);
            setAppointments(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching appointments", error);
            setLoading(false);
        }
    };

    const filteredAppointments = appointments.filter(apt =>
        apt.patientId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Data...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">All Appointments</h1>
                <div className="bg-white p-2 rounded-lg border flex items-center gap-2 w-64">
                    <Search size={18} className="text-gray-400" />
                    <input
                        className="bg-transparent focus:outline-none text-sm w-full"
                        placeholder="Search patient or doctor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredAppointments.map((apt) => (
                            <tr key={apt._id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {apt.patientId?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-gray-900">{apt.patientId?.name}</p>
                                            <p className="text-xs text-gray-500">{apt.patientId?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-700">{apt.doctorId?.name}</td>
                                <td className="p-4">
                                    <div className="text-sm text-gray-900 font-medium">
                                        {new Date(apt.date).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock size={12} /> {apt.timeSlot}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                                        {apt.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm">
                                    <span className={`font-medium ${apt.paymentStatus === 'Paid' ? 'text-green-600' : 'text-gray-500'}`}>
                                        {apt.paymentStatus}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {apt.status === 'Completed' && (
                                        <button
                                            onClick={() => setSelectedAppointment(apt)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                        >
                                            <FileText size={16} /> View Rx
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredAppointments.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No appointments found matching your search.</div>
                )}
            </div>

            {selectedAppointment && (
                <PrescriptionModal
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                    onSuccess={() => { }} // Read only mainly
                />
            )}
        </div>
    );
};

export default AdminAppointments;
