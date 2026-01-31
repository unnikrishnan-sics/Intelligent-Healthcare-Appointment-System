import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { Search, MapPin, Clock } from 'lucide-react';
import BookingModal from '../../components/appointments/BookingModal';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/doctors');
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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Find a Doctor</h1>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-3">
                <Search className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by doctor name or specialization..."
                    className="w-full focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                    <div key={doctor._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold" style={{ color: theme.primaryColor }}>{doctor.userId?.name || 'Dr. Unknown'}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{doctor.specialization}</p>
                                </div>
                                <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                                    {doctor.experience}+ Years
                                </div>
                            </div>

                            <p className="mt-4 text-gray-600 text-sm line-clamp-2">{doctor.bio}</p>

                            <div className="mt-4 space-y-2 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>Available Today</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">${doctor.feesPerConsultation}</span>
                                    <span>Consultation Fee</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedDoctor(doctor)}
                                className="mt-6 w-full py-2 rounded-lg text-white font-medium transition-opacity hover:opacity-90"
                                style={{ backgroundColor: theme.primaryColor }}
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No doctors found matching your criteria.
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
