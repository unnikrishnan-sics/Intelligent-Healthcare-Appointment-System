import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { Clock, Plus, Trash } from 'lucide-react';

const ScheduleManager = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [profileData, setProfileData] = useState({
        specialization: '',
        bio: '',
        experience: '',
        feesPerConsultation: ''
    });
    const { theme } = useTheme();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/doctors/profile`, config);
                if (res.data) {
                    if (res.data.availability) {
                        setSchedule(res.data.availability);
                    }
                    setProfileData({
                        specialization: res.data.specialization || '',
                        bio: res.data.bio || '',
                        experience: res.data.experience || '',
                        feesPerConsultation: res.data.feesPerConsultation || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

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
                setMessage('Please fill in all profile fields');
                return;
            }

            const payload = {
                ...profileData,
                availability: schedule
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/api/doctors/profile`, payload, config);

            setMessage('Profile and schedule updated successfully!');
            setTimeout(() => setMessage(''), 3000);

        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || 'Failed to update profile');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6 max-w-4xl">
            <h1 className="text-2xl font-bold">Manage Profile & Schedule</h1>

            <div className="bg-white p-6 rounded-xl shadow border space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Doctor Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Specialization</label>
                        <input
                            type="text"
                            name="specialization"
                            value={profileData.specialization}
                            onChange={handleProfileChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            placeholder="e.g. Cardiologist"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                        <input
                            type="number"
                            name="experience"
                            value={profileData.experience}
                            onChange={handleProfileChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            placeholder="e.g. 10"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Consulation Fees ($)</label>
                        <input
                            type="number"
                            name="feesPerConsultation"
                            value={profileData.feesPerConsultation}
                            onChange={handleProfileChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            placeholder="e.g. 100"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                            name="bio"
                            value={profileData.bio}
                            onChange={handleProfileChange}
                            className="mt-1 block w-full border rounded-md p-2"
                            rows="3"
                            placeholder="Brief description about yourself..."
                            required
                        ></textarea>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-700">Weekly Availability</h3>
                    <button
                        onClick={addSlot}
                        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition"
                        style={{ backgroundColor: theme.primaryColor }}
                    >
                        <Plus size={18} /> Add Slot
                    </button>
                </div>

                {message && <div className={`p-3 rounded mb-4 ${message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}

                <div className="space-y-4">
                    {schedule.length === 0 && <p className="text-gray-500 italic">No availability slots set.</p>}

                    {schedule.map((slot, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-4 items-end md:items-center bg-gray-50 p-4 rounded-lg">
                            <div className="w-full md:w-auto">
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Day</label>
                                <select
                                    value={slot.day}
                                    onChange={(e) => handleChange(index, 'day', e.target.value)}
                                    className="border rounded p-2 text-sm w-full md:w-40"
                                >
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full md:w-auto">
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
                                <input
                                    type="time"
                                    value={slot.startTime}
                                    onChange={(e) => handleChange(index, 'startTime', e.target.value)}
                                    className="border rounded p-2 text-sm w-full"
                                />
                            </div>
                            <div className="w-full md:w-auto">
                                <label className="block text-xs font-semibold text-gray-500 mb-1">End Time</label>
                                <input
                                    type="time"
                                    value={slot.endTime}
                                    onChange={(e) => handleChange(index, 'endTime', e.target.value)}
                                    className="border rounded p-2 text-sm w-full"
                                />
                            </div>
                            <button
                                onClick={() => removeSlot(index)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded ml-auto md:ml-0"
                            >
                                <Trash size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 text-white font-semibold rounded-lg shadow hover:shadow-md transition"
                        style={{ backgroundColor: theme.secondaryColor }}
                    >
                        Save Profile & Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleManager;
