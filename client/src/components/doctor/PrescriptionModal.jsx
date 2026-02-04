import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, Trash2, Save, Pill, FileText, User, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const PrescriptionModal = ({ appointment, onClose, onSuccess }) => {
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const { theme } = useTheme();

    // Admin and Patient can only view. Doctors can edit.
    const isReadOnly = user.role === 'patient' || user.role === 'admin';

    useEffect(() => {
        if (appointment._id) {
            const fetchPrescription = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/prescriptions/${appointment._id}`, config);
                    if (res.data) {
                        setMedicines(res.data.medicines);
                        setNotes(res.data.notes);
                    }
                } catch (error) {
                    if (isReadOnly) {
                        setMedicines([]); // Clear default empty row for viewers
                        setNotes('');
                    }
                }
            };
            fetchPrescription();
        }
    }, [appointment, isReadOnly]);

    const handleMedicineChange = (index, field, value) => {
        if (isReadOnly) return;
        const newMedicines = [...medicines];
        newMedicines[index][field] = value;
        setMedicines(newMedicines);
    };

    const addMedicine = () => {
        if (isReadOnly) return;
        setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }]);
    };

    const removeMedicine = (index) => {
        if (isReadOnly) return;
        const newMedicines = medicines.filter((_, i) => i !== index);
        setMedicines(newMedicines);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isReadOnly) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post(`${import.meta.env.VITE_API_URL}/api/prescriptions`, {
                appointmentId: appointment._id,
                patientId: appointment.patientId._id || appointment.patientId,
                medicines,
                notes
            }, config);

            toast.success('Prescription added successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to add prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-white/10 backdrop-blur-2xl animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-scale-up border border-gray-100 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="relative p-8 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                {isReadOnly ? 'Prescription Details' : 'Write Prescription'}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1 font-medium">Medical record for the selected appointment</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white text-gray-400 hover:text-gray-600 transition-all p-2 rounded-xl border border-gray-100 shadow-sm hover:shadow-md active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 pt-8 custom-scrollbar space-y-10">

                    {/* Patient & Date Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-blue-500">
                                <User size={24} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Name</div>
                                <div className="text-sm font-black text-gray-900">{appointment.patientId?.name}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-emerald-500">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Appointment Date</div>
                                <div className="text-sm font-black text-gray-900">{new Date(appointment.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                            </div>
                        </div>
                    </div>

                    {/* Medicines Section */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                    <Pill size={18} />
                                </span>
                                <h3 className="text-lg font-bold text-gray-800">Prescribed Medicines</h3>
                            </div>
                            {!isReadOnly && (
                                <button
                                    type="button"
                                    onClick={addMedicine}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all active:scale-95"
                                >
                                    <Plus size={14} /> Add Medicine
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {medicines.map((med, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50/30 p-4 rounded-3xl border border-gray-50 group hover:shadow-md transition-all">
                                    <div className="md:col-span-4 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter ml-1">Medicine Name</label>
                                        <input
                                            placeholder="e.g. Paracetamol"
                                            required
                                            readOnly={isReadOnly}
                                            value={med.name}
                                            onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border-gray-100 border-2 rounded-xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm font-medium"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter ml-1">Dosage</label>
                                        <input
                                            placeholder="500mg"
                                            required
                                            readOnly={isReadOnly}
                                            value={med.dosage}
                                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border-gray-100 border-2 rounded-xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm font-medium"
                                        />
                                    </div>
                                    <div className="md:col-span-3 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter ml-1">Frequency</label>
                                        <input
                                            placeholder="1-0-1"
                                            required
                                            readOnly={isReadOnly}
                                            value={med.frequency}
                                            onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border-gray-100 border-2 rounded-xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm font-medium"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter ml-1">Duration</label>
                                        <input
                                            placeholder="5 Days"
                                            required
                                            readOnly={isReadOnly}
                                            value={med.duration}
                                            onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border-gray-100 border-2 rounded-xl focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm font-medium"
                                        />
                                    </div>
                                    <div className="md:col-span-1 flex justify-center pt-5">
                                        {!isReadOnly && medicines.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeMedicine(index)}
                                                className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {medicines.length === 0 && isReadOnly && (
                                <div className="text-center py-10 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                    <p className="text-gray-400 font-bold italic">No medicines prescribed for this appointment.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                                <FileText size={18} />
                            </span>
                            <h3 className="text-lg font-bold text-gray-800">Clinical Notes / Instructions</h3>
                        </div>
                        <div className="relative group">
                            <textarea
                                rows="4"
                                readOnly={isReadOnly}
                                className="w-full px-6 py-4 bg-gray-50 border-gray-100 border-2 rounded-3xl focus:bg-white focus:border-amber-500/20 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300 resize-none shadow-inner"
                                placeholder="Special instructions for the patient (e.g. take after meals, avoid cold water)..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-12 flex flex-col sm:flex-row gap-4 border-t border-gray-50 pt-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 border-2 border-transparent hover:border-gray-100 active:scale-95"
                        >
                            {isReadOnly ? 'Close Medical Record' : 'Cancel'}
                        </button>
                        {!isReadOnly && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] py-4 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
                                style={{ backgroundColor: theme.primaryColor || '#3b82f6' }}
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>Issue Prescription</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrescriptionModal;
