import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XCircle, Plus, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PrescriptionModal = ({ appointment, onClose, onSuccess }) => {
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const isReadOnly = user.role === 'patient';

    useEffect(() => {
        if (appointment._id) {
            const fetchPrescription = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const res = await axios.get(`http://localhost:5000/api/prescriptions/${appointment._id}`, config);
                    if (res.data) {
                        setMedicines(res.data.medicines);
                        setNotes(res.data.notes);
                    }
                } catch (error) {
                    if (isReadOnly) {
                        setMedicines([]); // Clear default empty row for viewers
                        setNotes('');
                    }
                    // Quietly fail for new prescriptions (Doctor view)
                }
            };
            fetchPrescription();
        }
    }, [appointment]);

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

            await axios.post('http://localhost:5000/api/prescriptions', {
                appointmentId: appointment._id,
                patientId: appointment.patientId._id || appointment.patientId,
                medicines,
                notes
            }, config);

            alert('Prescription added successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to add prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">{isReadOnly ? 'Prescription Details' : 'Add Prescription'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Patient: <span className="font-bold">{appointment.patientId?.name}</span></p>
                        <p className="text-sm text-gray-600">Date: {new Date(appointment.date).toLocaleDateString()}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">Medicines</label>
                            {!isReadOnly && (
                                <button type="button" onClick={addMedicine} className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
                                    <Plus size={16} /> Add Medicine
                                </button>
                            )}
                        </div>

                        {medicines.map((med, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="md:col-span-4">
                                    <input
                                        placeholder="Medicine Name"
                                        required
                                        readOnly={isReadOnly}
                                        value={med.name}
                                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                        className={`w-full p-2 text-sm border rounded ${isReadOnly ? 'bg-gray-100' : 'focus:ring-blue-500'}`}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <input
                                        placeholder="Dosage"
                                        required
                                        readOnly={isReadOnly}
                                        value={med.dosage}
                                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                        className={`w-full p-2 text-sm border rounded ${isReadOnly ? 'bg-gray-100' : 'focus:ring-blue-500'}`}
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <input
                                        placeholder="Frequency"
                                        required
                                        readOnly={isReadOnly}
                                        value={med.frequency}
                                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                        className={`w-full p-2 text-sm border rounded ${isReadOnly ? 'bg-gray-100' : 'focus:ring-blue-500'}`}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <input
                                        placeholder="Duration"
                                        required
                                        readOnly={isReadOnly}
                                        value={med.duration}
                                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                        className={`w-full p-2 text-sm border rounded ${isReadOnly ? 'bg-gray-100' : 'focus:ring-blue-500'}`}
                                    />
                                </div>
                                <div className="md:col-span-1 flex justify-center">
                                    {!isReadOnly && medicines.length > 1 && (
                                        <button type="button" onClick={() => removeMedicine(index)} className="text-red-500 hover:text-red-700 p-2">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {medicines.length === 0 && isReadOnly && <p className="text-gray-500 text-sm italic">No medicines prescribed.</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Instructions</label>
                        <textarea
                            rows="3"
                            readOnly={isReadOnly}
                            className={`w-full p-3 border rounded-lg ${isReadOnly ? 'bg-gray-100' : 'focus:ring-blue-500'}`}
                            placeholder="Take after food..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Close</button>
                        {!isReadOnly && (
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                {loading ? 'Saving...' : <><Save size={18} /> Save Prescription</>}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrescriptionModal;
