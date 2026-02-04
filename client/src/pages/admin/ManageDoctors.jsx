import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserPlus, User, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import AddDoctorModal from '../../components/admin/AddDoctorModal';



const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'pending'
    const { theme } = useTheme();
    const { user } = useAuth(); // Need token for requests

    // Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);



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

    const handleDeleteClick = (id) => {
        setDoctorToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!doctorToDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${doctorToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDoctors();
            toast.success('Doctor deleted successfully');
        } catch (err) {
            console.error('Error deleting doctor:', err);
            toast.error('Failed to delete doctor');
        } finally {
            setIsDeleteModalOpen(false);
            setDoctorToDelete(null);
        }
    };
    const handleAddDoctor = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/doctors`, formData, config);
            fetchDoctors(); // Refresh list
            toast.success('Doctor added successfully');
            setIsAddModalOpen(false);
        } catch (err) {
            console.error('Error adding doctor:', err);
            toast.error(err.response?.data?.message || 'Failed to add doctor');
        }
    };

    const filteredDoctors = doctors.filter(doc =>
        activeTab === 'active' ? doc.status === 'active' : doc.status === 'pending'
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4 md:p-8 md:pt-4 space-y-10 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Doctors</h1>
                    <p className="text-gray-500 font-medium">Review, approve, and manage system medical professionals</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2.5 px-6 py-3.5 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
                    style={{ backgroundColor: theme.primaryColor }}
                >
                    <UserPlus size={20} /> Add New Doctor
                </button>
            </div>


            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-100">
                <button
                    className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'active' ? `text-${theme.primaryColor}` : 'text-gray-400 hover:text-gray-600'}`}
                    style={{ color: activeTab === 'active' ? theme.primaryColor : '' }}
                    onClick={() => setActiveTab('active')}
                >
                    Active Doctors
                    {activeTab === 'active' && (
                        <div className="absolute bottom-0 left-0 w-full h-1 rounded-t-full" style={{ backgroundColor: theme.primaryColor }}></div>
                    )}
                </button>
                <button
                    className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'pending' ? `text-${theme.primaryColor}` : 'text-gray-400 hover:text-gray-600'}`}
                    style={{ color: activeTab === 'pending' ? theme.primaryColor : '' }}
                    onClick={() => setActiveTab('pending')}
                >
                    <div className="flex items-center gap-2">
                        Pending Approvals
                        {doctors.filter(d => d.status === 'pending').length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ring-4 ring-red-50">
                                {doctors.filter(d => d.status === 'pending').length}
                            </span>
                        )}
                    </div>
                    {activeTab === 'pending' && (
                        <div className="absolute bottom-0 left-0 w-full h-1 rounded-t-full" style={{ backgroundColor: theme.primaryColor }}></div>
                    )}
                </button>
            </div>


            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-50">
                <table className="min-w-full divide-y divide-gray-50">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Doctor Information</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Address</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Member Since</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-50">
                        {filteredDoctors.map((doc) => (
                            <tr key={doc._id} className="hover:bg-blue-50/30 transition-all duration-300">
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                            <User size={24} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-black text-gray-900">{doc.name}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{doc.role}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-600">{doc.email}</div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-[10px] leading-5 font-black uppercase tracking-wider rounded-full 
                                        ${doc.status === 'active' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-500/20'}`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-500">{new Date(doc.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">

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
                                        <button
                                            onClick={() => handleDeleteClick(doc._id)}
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                        >
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

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onConfirm={confirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                title="Delete Doctor"
                message="Are you sure you want to delete this doctor? This action cannot be undone."
                confirmText="Delete"
                type="danger"
            />

            <AddDoctorModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddDoctor}
            />
        </div>
    );
};

export default ManageDoctors;
