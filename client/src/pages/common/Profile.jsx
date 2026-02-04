import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // adjust path if needed
import { useTheme } from '../../context/ThemeContext'; // adjust path if needed
import { User, Mail, MapPin, Lock, Save, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
    const { user, login } = useAuth(); // capable of updating user context if login returns updated user or we re-fetch
    const { theme } = useTheme();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        currentPassword: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found. Please login again.');
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/profile`;
            console.log('Fetching profile from:', apiUrl);

            const { data } = await axios.get(apiUrl, config);

            setFormData(prev => ({
                ...prev,
                name: data.name || '',
                email: data.email || '',
                address: data.address || '',
                currentPassword: '',
                password: '',
                confirmPassword: ''
            }));
        } catch (err) {
            console.error('Profile fetch error:', err);
            setError(err.response?.data?.message || 'Failed to load profile.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const updateData = {
                name: formData.name,
                email: formData.email,
                address: formData.address
            };
            if (formData.password) {
                updateData.password = formData.password;
                updateData.currentPassword = formData.currentPassword;
            }

            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/profile`, updateData, config);

            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(null), 3000);
            // Ideally update context user here if needed, but for now local state is enough for this page.
            // If the AuthContext had a setUser, we would call it.
            // Since we don't know exact AuthContext structure for update, we'll rely on current page state.

            // Clear password fields
            setFormData(prev => ({ ...prev, currentPassword: '', password: '', confirmPassword: '' }));

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fade-in">
            <h1 className="text-2xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-500 mb-8">Manage your account settings and preferences.</p>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                {message && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2">
                        <CheckCircle size={20} /> {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Address (Required for Payments)</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Street, City, Country"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                                style={{ '--tw-ring-color': theme.primaryColor }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Please provide a valid address for invoice generation.</p>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Change Password</h3>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Min 6 characters"
                                        className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                                        style={{ '--tw-ring-color': theme.primaryColor }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter password"
                                        className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:outline-none"
                                        style={{ '--tw-ring-color': theme.primaryColor }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50 transition-colors"
                            style={{ backgroundColor: theme.primaryColor }}
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Save size={18} /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
