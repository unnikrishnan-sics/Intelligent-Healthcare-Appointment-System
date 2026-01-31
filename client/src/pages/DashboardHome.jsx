import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Activity, Clock } from 'lucide-react';
import axios from 'axios';
import DoctorQueuePanel from '../components/doctor/DoctorQueuePanel';

const DashboardHome = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            try {
                if (user.role === 'admin') {
                    const res = await axios.get('http://localhost:5000/api/admin/stats', config);
                    setStats(res.data);
                } else if (user.role === 'patient') {
                    const res = await axios.get('http://localhost:5000/api/appointments/my', config);
                    // Filter for future appointments (Confirmed or Pending)
                    const upcoming = res.data
                        .filter(apt => new Date(apt.date) >= new Date().setHours(0, 0, 0, 0) && (apt.status === 'Confirmed' || apt.status === 'Pending'))
                        .sort((a, b) => new Date(a.date) - new Date(b.date));

                    setUpcomingAppointments(upcoming);
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchDashboardData();
    }, [user.role]);

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
            <div className={`p-4 rounded-lg bg-${color}-50 text-${color}-600`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-gray-500">Welcome back, {user.name} 👋</p>
                </div>
                <div className="hidden md:block text-sm text-gray-400">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Admin Stats */}
            {user.role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard icon={Users} label="Total Patients" value={stats.patients} color="blue" />
                    <StatCard icon={Activity} label="Active Doctors" value={stats.doctors} color="green" />
                    <StatCard icon={Calendar} label="Appointments" value={stats.appointments} color="purple" />
                </div>
            )}

            {/* Doctor Quick Actions */}
            {user.role === 'doctor' && (
                <div className="grid grid-cols-1 gap-6">
                    <DoctorQueuePanel user={user} />

                    <div className="bg-white p-6 rounded-xl shadow border">
                        <h3 className="text-lg font-bold mb-2">Availability</h3>
                        <p className="text-gray-500 mb-4">Manage your weekly slots and sessions.</p>
                        <button onClick={() => navigate('/dashboard/schedule')} className="text-blue-600 font-medium hover:underline">Update Schedule &rarr;</button>
                    </div>
                </div>
            )}

            {/* Patient Quick Actions */}
            {user.role === 'patient' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-6 rounded-xl shadow-lg text-white">
                        <h3 className="text-xl font-bold mb-2">Find a Specialist</h3>
                        <p className="opacity-90 mb-6">Book an appointment with top doctors.</p>
                        <button
                            onClick={() => navigate('/dashboard/doctors')}
                            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold shadow hover:bg-gray-100 transition"
                        >
                            Book Now
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow border">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="text-gray-400" />
                            <h3 className="text-lg font-bold">Upcoming Appointments</h3>
                        </div>
                        {upcomingAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingAppointments.slice(0, 3).map((apt) => (
                                    <div key={apt._id} className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center hover:shadow-md transition-shadow">
                                        <div>
                                            <p className="font-bold text-gray-800">{apt.doctorId?.userId?.name || 'Doctor'}</p>
                                            <p className="text-blue-600 text-xs font-semibold">{apt.doctorId?.specialization}</p>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span>📅 {new Date(apt.date).toLocaleDateString()}</span>
                                                <span>⏰ {apt.timeSlot}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-2xl font-bold text-gray-800">#{apt.tokenNumber}</span>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {apt.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {upcomingAppointments.length > 3 && (
                                    <p className="text-center text-xs text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/dashboard/appointments')}>
                                        View all upcoming
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                                <p className="text-gray-500 text-sm">No upcoming appointments.</p>
                                <button onClick={() => navigate('/dashboard/doctors')} className="mt-2 text-sm text-blue-600 font-medium hover:underline">Book one now</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;
