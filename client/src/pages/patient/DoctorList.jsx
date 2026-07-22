import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Briefcase, ChevronRight } from 'lucide-react';
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
                {filteredDoctors.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold bg-white rounded-3xl border border-dashed border-gray-200">
                        No doctors found matching your criteria.
                    </div>
                ) : (
                    filteredDoctors.map((doctor) => (
                        <div key={doctor._id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group border border-gray-100 flex flex-col">
                            {/* Card Header */}
                            <div className="p-1 relative">
                                <div className="h-2 rounded-t-2xl opacity-80" style={{ backgroundColor: theme.primaryColor }}></div>
                                <div className="absolute top-1/2 left-8 -translate-y-1/2 w-16 h-16 bg-white rounded-2xl shadow-lg p-1">
                                    <div className="w-full h-full rounded-xl flex items-center justify-center text-white font-black text-2xl" style={{ backgroundColor: theme.primaryColor }}>
                                        {doctor.userId.name.charAt(0)}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 pt-10 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{doctor.userId.name}</h3>
                                        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-widest mt-1">
                                            {doctor.specialization}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-black text-gray-900">₹{doctor.feesPerConsultation}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase">Per Session</div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 font-medium mb-6 line-clamp-2 leading-relaxed italic">"{doctor.bio}"</p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                                        <Briefcase className="text-gray-400" size={18} />
                                        <div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase leading-none">Exp</div>
                                            <div className="text-sm font-bold text-gray-700">{doctor.experience} Yrs</div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                                        <Clock className="text-gray-400" size={18} />
                                        <div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase leading-none">Wait</div>
                                            <div className="text-sm font-bold text-gray-700">~15 Min</div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedDoctor(doctor)}
                                    className="w-full py-4 text-white font-black rounded-2xl flex items-center justify-center gap-2 group/btn relative overflow-hidden transition-all shadow-lg hover:shadow-xl mt-auto"
                                    style={{ backgroundColor: theme.primaryColor }}
                                >
                                    <span className="relative z-10 uppercase tracking-widest">Book Appointment</span>
                                    <ChevronRight className="relative z-10 group-hover/btn:translate-x-1 transition-transform" size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

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
