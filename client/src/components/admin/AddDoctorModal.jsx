import React, { useState } from 'react';
import { X, User, Mail, Lock, Stethoscope, FileText, Briefcase, DollarSign, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AddDoctorModal = ({ isOpen, onClose, onAdd }) => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
        bio: '',
        experience: '',
        feesPerConsultation: '',
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        // Reset form
        setFormData({
            name: '',
            email: '',
            password: '',
            specialization: '',
            bio: '',
            experience: '',
            feesPerConsultation: '',
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 md:p-16 bg-white/10 backdrop-blur-2xl animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-scale-up border border-gray-100 flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="relative p-8 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Add New Doctor</h2>
                            <p className="text-gray-500 text-sm mt-1 font-medium">Create a new professional profile for the system</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white text-gray-400 hover:text-gray-600 transition-all p-2 rounded-xl border border-gray-100 shadow-sm hover:shadow-md active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 pt-8 custom-scrollbar">
                    <div className="space-y-10">
                        {/* Section 1: Authentication */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                    <Shield size={18} />
                                </span>
                                <h3 className="text-lg font-bold text-gray-800">Account Credentials</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-gray-100 border-2 rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300"
                                            placeholder="Dr. John Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-gray-100 border-2 rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300"
                                            placeholder="john.doe@hospital.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Temporary Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-gray-100 border-2 rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300"
                                            placeholder="Minimum 6 characters"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Professional Profile */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <Stethoscope size={18} />
                                </span>
                                <h3 className="text-lg font-bold text-gray-800">Professional Profile</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2 md:col-span-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Specialization</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                            <Stethoscope size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-gray-100 border-2 rounded-2xl focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300"
                                            placeholder="e.g. Neurologist"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Experience (Yrs)</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                            <Briefcase size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-gray-100 border-2 rounded-2xl focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300"
                                            placeholder="Yrs"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Fees ($)</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                            <DollarSign size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            name="feesPerConsultation"
                                            value={formData.feesPerConsultation}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-gray-100 border-2 rounded-2xl focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300"
                                            placeholder="100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-full lg:col-span-full">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Professional Biography</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                            <FileText size={18} />
                                        </div>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-gray-100 border-2 rounded-3xl focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300 resize-none"
                                            placeholder="Tell patients about this doctor's expertise and approach..."
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-12 flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 border-2 border-transparent hover:border-gray-100 active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-4 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 active:translate-y-0 transition-all duration-300"
                            style={{ backgroundColor: theme.primaryColor || '#3b82f6' }}
                        >
                            Create Doctor Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDoctorModal;
