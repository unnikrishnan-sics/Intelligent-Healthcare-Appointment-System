import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserPlus, User, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'pending'
    const { theme } = useTheme();
    const { user } = useAuth(); // Need token for requests

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, config);
            // Filter only doctors
            const allDoctors = res.data.filter(u => u.role === 'doctor');
            setDoctors(allDoctors);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDoctors(); // Refresh list
            toast.success('Doctor status updated successfully');
        } catch (err) {
            console.error('Error updating status:', err);
            toast.error('Failed to update status');
        }
    };

    const filteredDoctors = doctors.filter(doc =>
        activeTab === 'active' ? doc.status === 'active' : doc.status === 'pending'
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Manage Doctors</h1>
                <button
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition shadow-md"
                    style={{ backgroundColor: theme.primaryColor }}
                >
                    <UserPlus size={18} /> Add New Doctor
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'active' ? `border-b-2 text-${theme.primaryColor} border-${theme.primaryColor}` : 'text-gray-500 hover:text-gray-700'}`}
                    style={{ borderColor: activeTab === 'active' ? theme.primaryColor : 'transparent', color: activeTab === 'active' ? theme.primaryColor : '' }}
                    onClick={() => setActiveTab('active')}
                >
                    Active Doctors
                </button>
                <button
                    className={`pb-2 px-1 font-medium transition-colors ${activeTab === 'pending' ? `border-b-2 text-${theme.primaryColor} border-${theme.primaryColor}` : 'text-gray-500 hover:text-gray-700'}`}
                    style={{ borderColor: activeTab === 'pending' ? theme.primaryColor : 'transparent', color: activeTab === 'pending' ? theme.primaryColor : '' }}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending Approvals
                    {doctors.filter(d => d.status === 'pending').length > 0 && (
                        <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                            {doctors.filter(d => d.status === 'pending').length}
                        </span>
                    )}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDoctors.map((doc) => (
                            <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                            <User size={20} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {doc.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${doc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(doc.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {activeTab === 'pending' ? (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(doc._id, 'active')}
                                                className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs flex items-center gap-1 transition-colors"
                                            >
                                                <CheckCircle size={14} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(doc._id, 'rejected')}
                                                className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs flex items-center gap-1 transition-colors"
                                            >
                                                <XCircle size={14} /> Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="text-red-600 hover:text-red-900 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredDoctors.length === 0 && (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            {activeTab === 'active' ? <User size={24} className="text-gray-400" /> : <Clock size={24} className="text-gray-400" />}
                        </div>
                        <p>No {activeTab} doctors found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageDoctors;
