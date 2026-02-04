import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock } from 'lucide-react';
import BookingModal from '../../components/appointments/BookingModal';
import toast from 'react-hot-toast';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const { theme } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleBookClick = (doctor) => {
        if (!user) {
            toast.error("Please login to book an appointment");
            navigate('/login');
            return;
        }
        setSelectedDoctor(doctor);
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/doctors`);
                setDoctors(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching doctors", error);
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doc =>
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.userId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center">Loading Doctors...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                    Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Specialist</span>
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-gray-500">
                    Connect with top-rated doctors available for online and in-person consultations.
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12 relative animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by doctor name or specialization (e.g., Cardiology)..."
                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {filteredDoctors.map((doctor) => (
                    <div key={doctor._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {doctor.userId?.name || 'Dr. Unknown'}
                                    </h3>
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                                        {doctor.specialization}
                                    </div>
                                </div>
                                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-bold flex flex-col items-center">
                                    <span>{doctor.experience}+</span>
                                    <span className="text-[10px] uppercase font-normal">Years</span>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10 leading-relaxed">
                                {doctor.bio || 'Experienced specialist dedicated to patient care and treatment excellence.'}
                            </p>

                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-blue-500" />
                                        <span>Next Available:</span>
                                    </div>
                                    <span className="font-medium text-green-600">Today</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>Fee:</span>
                                    </div>
                                    <span className="font-bold text-gray-900 text-lg">${doctor.feesPerConsultation}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleBookClick(doctor)}
                                className="mt-6 w-full py-3 rounded-xl text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                                style={{ backgroundColor: theme.primaryColor }}
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="text-center py-20 animate-fade-in">
                    <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <Search className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No doctors found</h3>
                    <p className="text-gray-500">Try adjusting your search terms or browse all specialists.</p>
                </div>
            )}

            {selectedDoctor && (
                <BookingModal
                    doctor={selectedDoctor}
                    isOpen={!!selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                />
            )}
        </div>
    );
};

export default DoctorList;
