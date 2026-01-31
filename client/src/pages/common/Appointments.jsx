import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import PrescriptionModal from '../../components/doctor/PrescriptionModal';
import toast from 'react-hot-toast';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const { theme } = useTheme();
    const { user } = useAuth();

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointments/my`, config);
            setAppointments(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching appointments", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL}/api/appointments/${id}/status`, { status: newStatus }, config);

            // Optimistic update or refetch
            // Optimistic update or refetch
            fetchAppointments();
            toast.success(`Appointment marked as ${newStatus}`);
        } catch (error) {
            console.error("Error updating status", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Appointments...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Appointments</h1>
                <div className="text-sm text-gray-500">
                    {user.role === 'doctor' ? 'Manage your patient schedule' : 'Track your upcoming visits'}
                </div>
            </div>

            {appointments.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
                    <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                        <Calendar size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No Appointments Yet</h3>
                    <p className="text-gray-500 mt-2">
                        {user.role === 'patient'
                            ? "Book your first appointment to get started."
                            : "You don't have any appointments scheduled yet."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {appointments.map((apt) => (
                        <div key={apt._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-start gap-5">
                                <div className={`p-4 rounded-xl hidden sm:block ${apt.status === 'Cancelled' ? 'bg-gray-50' : `bg-${theme.primaryColor}-50`}`} style={{ backgroundColor: apt.status !== 'Cancelled' ? `${theme.primaryColor}10` : '' }}>
                                    <Calendar className={apt.status === 'Cancelled' ? 'text-gray-400' : ''} style={{ color: apt.status !== 'Cancelled' ? theme.primaryColor : '' }} size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {user.role === 'patient'
                                                ? (apt.doctorId?.name || 'Unknown Doctor')
                                                : (apt.patientId?.name || 'Unknown Patient')}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                                            {apt.status}
                                        </span>
                                    </div>

                                    <p className="text-gray-500 flex items-center gap-2 text-sm">
                                        <Clock size={16} />
                                        <span className="font-medium text-gray-700">
                                            {new Date(apt.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                        at
                                        <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                                            {apt.timeSlot}
                                        </span>
                                    </p>

                                    {user.role === 'doctor' && apt.predictionScore > 30 && (
                                        <div className="mt-3 bg-orange-50 border border-orange-100 p-2 rounded-lg">
                                            <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-wide">
                                                <AlertCircle size={14} />
                                                <span>No-Show Risk: {apt.predictionScore}%</span>
                                            </div>
                                            {apt.riskFactors && apt.riskFactors.length > 0 && (
                                                <div className="mt-1 text-xs text-orange-600 pl-6">
                                                    {apt.riskFactors.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {apt.reason && (
                                        <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg inline-block border border-gray-100">
                                            <span className="font-semibold text-gray-500 text-xs uppercase tracking-wide">Reason:</span> {apt.reason}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 justify-end pt-4 border-t lg:pt-0 lg:border-none">
                                {/* Doctor Actions */}
                                {user.role === 'doctor' && apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(apt._id, 'Confirmed')}
                                            disabled={apt.status === 'Confirmed'}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
                                                ${apt.status === 'Confirmed'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(apt._id, 'Completed')}
                                            className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <CheckCircle size={16} /> Complete
                                        </button>
                                        <button
                                            onClick={() => setSelectedAppointment(apt)}
                                            className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <FileText size={16} /> Prescribe
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(apt._id, 'Cancelled')}
                                            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <XCircle size={16} /> Cancel
                                        </button>
                                    </>
                                )}

                                {/* Patient Actions */}
                                {user.role === 'patient' && (
                                    <>
                                        {(apt.status === 'Pending' || apt.status === 'Confirmed') && (
                                            <button
                                                onClick={() => handleStatusUpdate(apt._id, 'Cancelled')}
                                                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                            >
                                                <XCircle size={16} /> Cancel Appointment
                                            </button>
                                        )}
                                        {apt.status === 'Completed' && (
                                            <div className="flex gap-2">
                                                <div className="text-gray-500 text-sm font-medium flex items-center gap-1 px-3 py-2 bg-gray-50 rounded-lg">
                                                    <CheckCircle size={16} className="text-green-500" /> Completed
                                                </div>
                                                <button
                                                    onClick={() => setSelectedAppointment(apt)}
                                                    className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                                >
                                                    <FileText size={16} /> Prescription
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {
                selectedAppointment && (
                    <PrescriptionModal
                        appointment={selectedAppointment}
                        onClose={() => setSelectedAppointment(null)}
                        onSuccess={() => {
                            setSelectedAppointment(null);
                            fetchAppointments();
                        }}
                    />
                )
            }
        </div >
    );
};

export default Appointments;
