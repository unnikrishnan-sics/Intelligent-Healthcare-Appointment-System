import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { X, Clock, Plus, Trash, Save, User, Briefcase, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminScheduleModal = ({ doctor, isOpen, onClose, onUpdate, viewOnly = false }) => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        specialization: '',
        bio: '',
        experience: '',
        feesPerConsultation: ''
    });
    const { theme } = useTheme();

    useEffect(() => {
        if (isOpen && doctor) {
            // Fetch doctor profile to get latest data
            const fetchProfile = async () => {
                setLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/doctors/${doctor._id}`);
                    if (res.data) {
                        setSchedule(res.data.availability || []);
                        setProfileData({
                            specialization: res.data.specialization || '',
                            bio: res.data.bio || '',
                            experience: res.data.experience || '',
                            feesPerConsultation: res.data.feesPerConsultation || ''
                        });
                    }
                } catch (error) {
                    console.error('Error fetching doctor details:', error);
                    toast.error('Failed to load doctor profile');
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        }
    }, [isOpen, doctor]);

    const addSlot = () => {
        setSchedule([...schedule, { day: 'Monday', startTime: '09:00', endTime: '17:00' }]);
    };

    const removeSlot = (index) => {
        const newSchedule = schedule.filter((_, i) => i !== index);
        setSchedule(newSchedule);
    };

    const handleChange = (index, field, value) => {
        const newSchedule = [...schedule];
        newSchedule[index][field] = value;
        setSchedule(newSchedule);
    };

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (!profileData.specialization || !profileData.bio || !profileData.experience || !profileData.feesPerConsultation) {
                toast.error('Please fill in all profile fields');
                return;
            }

            const payload = {
                ...profileData,
                availability: schedule
            };

            await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/doctors/${doctor._id}/profile`, payload, config);

            toast.success('Doctor profile and schedule updated successfully!');
            onUpdate();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in text-gray-800">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center text-white" style={{ backgroundColor: theme.primaryColor }}>
                    <div>
                        <h2 className="text-xl font-bold">{viewOnly ? 'View' : 'Manage'} Schedule: {doctor.name}</h2>
                        <p className="text-sm opacity-80">{viewOnly ? 'View doctor availability and professional details' : 'Update availability and professional details'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor" style={{ borderColor: theme.primaryColor }}></div>
                        </div>
                    ) : (
                        <>
                            {/* Profile Section */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                                    <User size={20} className="text-blue-500" /> Professional Profile
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Specialization</label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={profileData.specialization}
                                            onChange={handleProfileChange}
                                            disabled={viewOnly}
                                            className={`w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all ${viewOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                            placeholder="e.g. Cardiologist"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Experience (Years)</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="number"
                                                name="experience"
                                                value={profileData.experience}
                                                onChange={handleProfileChange}
                                                disabled={viewOnly}
                                                className={`w-full border-gray-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-blue-500 transition-all ${viewOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                placeholder="e.g. 10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Consultation Fees</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="number"
                                                name="feesPerConsultation"
                                                value={profileData.feesPerConsultation}
                                                onChange={handleProfileChange}
                                                disabled={viewOnly}
                                                className={`w-full border-gray-200 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-blue-500 transition-all ${viewOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                placeholder="e.g. 500"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleProfileChange}
                                            disabled={viewOnly}
                                            className={`w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all ${viewOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                            rows="3"
                                            placeholder="Doctor's professional background..."
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Schedule Section */}
                            <section className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                                        <Clock size={20} className="text-green-500" /> Weekly Availability
                                    </h3>
                                    {!viewOnly && (
                                        <button
                                            onClick={addSlot}
                                            className="flex items-center gap-2 px-4 py-2 text-white rounded-xl hover:opacity-90 transition-all text-sm font-bold"
                                            style={{ backgroundColor: theme.primaryColor }}
                                        >
                                            <Plus size={16} /> Add Slot
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {schedule.length === 0 && (
                                        <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                                            No slots defined for this doctor.
                                        </div>
                                    )}
                                    {schedule.map((slot, index) => (
                                        <div key={index} className="flex flex-col md:flex-row gap-4 items-end md:items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 group transition-all hover:border-blue-200 hover:shadow-sm">
                                            <div className="flex-1 w-full">
                                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Day of Week</label>
                                                <select
                                                    value={slot.day}
                                                    onChange={(e) => handleChange(index, 'day', e.target.value)}
                                                    disabled={viewOnly}
                                                    className={`w-full border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 ${viewOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex-1 w-full">
                                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Start Time</label>
                                                <input
                                                    type="time"
                                                    value={slot.startTime}
                                                    onChange={(e) => handleChange(index, 'startTime', e.target.value)}
                                                    disabled={viewOnly}
                                                    className={`w-full border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 ${viewOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                />
                                            </div>
                                            <div className="flex-1 w-full">
                                                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">End Time</label>
                                                <input
                                                    type="time"
                                                    value={slot.endTime}
                                                    onChange={(e) => handleChange(index, 'endTime', e.target.value)}
                                                    disabled={viewOnly}
                                                    className={`w-full border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 ${viewOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                                />
                                            </div>
                                            {!viewOnly && (
                                                <button
                                                    onClick={() => removeSlot(index)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash size={20} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all font-bold"
                    >
                        {viewOnly ? 'Close' : 'Cancel'}
                    </button>
                    {!viewOnly && (
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-2.5 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            style={{ backgroundColor: theme.primaryColor }}
                        >
                            <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminScheduleModal;
