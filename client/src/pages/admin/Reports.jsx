import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { Users, User, Stethoscope, Mail, Phone, Calendar, Download, Search, Filter, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';
import ExportModal from '../../components/admin/ExportModal';


const Reports = () => {
    const [data, setData] = useState({ patients: [], doctors: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('patients'); // 'patients' or 'doctors'
    const [isExportModalOpen, setExportModalOpen] = useState(false);
    const { theme } = useTheme();


    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error('Error fetching reports:', err);
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = data.patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDoctors = data.doctors.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Reports</h1>
                    <p className="text-gray-500 font-medium">Detailed census of enrolled patients and doctors</p>
                </div>
                <button
                    onClick={() => setExportModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm active:scale-95"
                >
                    <FileSpreadsheet size={18} className="text-emerald-500" /> Export Appointments
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-xl flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users size={32} />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-gray-900">{data.patients.length}</div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Patients</div>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-xl flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Stethoscope size={32} />
                    </div>
                    <div>
                        <div className="text-3xl font-black text-gray-900">{data.doctors.length}</div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Active Doctors</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                        {/* Tabs */}
                        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm w-full lg:w-auto">
                            <button
                                onClick={() => setActiveTab('patients')}
                                className={`flex-1 lg:flex-none px-8 py-3 rounded-xl font-black transition-all ${activeTab === 'patients' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Patients List
                            </button>
                            <button
                                onClick={() => setActiveTab('doctors')}
                                className={`flex-1 lg:flex-none px-8 py-3 rounded-xl font-black transition-all ${activeTab === 'doctors' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Doctors List
                            </button>
                        </div>

                        {/* Search & Filter */}
                        <div className="relative w-full lg:w-96 group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border-gray-100 border-2 rounded-2xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-medium"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        {activeTab === 'patients' ? (
                            <>
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Patient Details</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Gender/Age</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredPatients.map(patient => (
                                        <tr key={patient._id} className="hover:bg-blue-50/30 transition-all duration-300">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 font-black">
                                                        {patient.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-gray-900">{patient.name}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ID: {patient._id.slice(-6)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium text-gray-600 flex items-center gap-2"><Mail size={14} className="text-gray-300" /> {patient.email}</div>
                                                    <div className="text-[11px] font-bold text-gray-400 flex items-center gap-2"><Phone size={14} className="text-gray-300" /> {patient.phone || 'N/A'}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-black text-gray-700">{patient.gender || 'N/A'}</div>
                                                <div className="text-[11px] font-bold text-gray-400">{patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : 'N/A'} Years Old</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${patient.status === 'active' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-500/20'}`}>
                                                    {patient.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        ) : (
                            <>
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Doctor Information</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Professional Info</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Fees/Exp</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredDoctors.map(doctor => (
                                        <tr key={doctor._id} className="hover:bg-emerald-50/30 transition-all duration-300">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 font-black">
                                                        {doctor.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-black text-gray-900">{doctor.name}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{doctor.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-black text-emerald-600">{doctor.specialization}</div>
                                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Medical Professional</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-black text-gray-700">${doctor.fees} / Consult</div>
                                                <div className="text-[11px] font-bold text-gray-400">{doctor.experience} Years Experience</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${doctor.status === 'active' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-500/20'}`}>
                                                    {doctor.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        )}
                    </table>

                    {(activeTab === 'patients' ? filteredPatients.length : filteredDoctors.length) === 0 && (
                        <div className="p-20 text-center">
                            <div className="text-gray-300 mb-4 flex justify-center"><Search size={48} /></div>
                            <h3 className="text-xl font-black text-gray-900">No results found</h3>
                            <p className="text-gray-500 font-medium">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>

            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setExportModalOpen(false)}
                doctors={data.doctors}
            />
        </div>
    );
};

export default Reports;
