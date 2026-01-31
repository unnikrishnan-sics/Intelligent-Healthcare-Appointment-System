import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';

// Stripe Imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../common/CheckoutForm';

// Initialize Stripe Promise (outside component to avoid recreation)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, {
    developerTools: { assistant: { enabled: false } }
});

const BookingModal = ({ doctor, isOpen, onClose }) => {
    // Hooks MUST be at top level
    const [date, setDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [bookedToken, setBookedToken] = useState(null);
    const [clientSecret, setClientSecret] = useState(''); // New State for Stripe
    const [appointmentId, setAppointmentId] = useState(null); // Track Appt ID

    const { theme } = useTheme();

    if (!isOpen || !doctor) return null;

    const availableDays = doctor.availability?.map(d => d.day).join(', ') || 'None';

    const generateSessions = () => {
        if (!date) return [];
        const dateObj = new Date(date);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[dateObj.getDay()];
        const schedule = doctor.availability?.find(d => d.day === dayName);
        if (!schedule) return [];
        return [{
            label: `${schedule.startTime} - ${schedule.endTime} (Queue)`,
            value: schedule.startTime
        }];
    };

    const sessions = generateSessions();

    // Step 1: Initiate Booking & Get Payment Intent
    const handleBook = async () => {
        if (!date || !selectedSlot) return;
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/appointments`, {
                doctorId: doctor.userId._id,
                date,
                timeSlot: selectedSlot,
                reason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Pass data to state
            setBookedToken(data.tokenNumber);
            setAppointmentId(data.appointment._id);
            setClientSecret(data.clientSecret);

            // We do NOT set success=true yet. We wait for payment.
            // UI will switch to Payment Form because clientSecret is set.

        } catch (err) {
            console.error("Booking Error:", err.response?.data);
            setError(err.response?.data?.message || 'Booking initialization failed');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Handle Successful Payment from CheckoutForm
    const handlePaymentSuccess = async (paymentIntentId) => {
        try {
            const token = localStorage.getItem('token');
            // Notify Backend
            await axios.post(`${import.meta.env.VITE_API_URL}/api/appointments/verify-payment`, {
                paymentIntentId,
                appointmentId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(true); // Now show success screen
        } catch (err) {
            console.error("Verification Error", err);
            setError("Payment succeeded but verification failed. Please contact support.");
        }
    };

    const options = {
        mode: 'payment',
        amount: 1000,
        currency: 'inr',
        appearance: { theme: 'stripe' },
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in relative max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: theme.primaryColor }}>
                    <h2 className="text-xl font-bold">Book Queue Token</h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl font-bold">{bookedToken}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h3>
                            <p className="text-lg text-gray-600 mt-2">Your Token Number is <span className="font-bold">#{bookedToken}</span></p>
                            <p className="text-sm text-gray-500 mt-4">Please arrive at the clinic on time. You can track your status live.</p>

                            <button
                                onClick={onClose}
                                className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                            >
                                Done
                            </button>
                        </div>
                    ) : clientSecret ? (
                        // PAYMENT MODE
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                            <CheckoutForm
                                clientSecret={clientSecret}
                                onSuccess={handlePaymentSuccess}
                                amount={doctor.feesPerConsultation || 500}
                                doctorName={doctor.userId?.name}
                            />
                        </Elements>
                    ) : (
                        // BOOKING FORM MODE
                        <>
                            <div className="mb-6">
                                <p className="text-gray-500 text-sm uppercase font-semibold mb-1">Doctor</p>
                                <h3 className="text-lg font-bold text-gray-800">{doctor.userId?.name}</h3>
                                <p className="text-sm text-gray-500">{doctor.specialization}</p>
                                <p className="text-sm font-medium text-blue-600 mt-1">Available Days: {availableDays}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                    <CalendarIcon size={18} /> Select Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:outline-none"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                    value={date}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        setSelectedSlot(null);
                                    }}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            {date && (
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                        <Clock size={18} /> Select Session
                                    </label>

                                    {sessions.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-3">
                                            {sessions.map((session) => (
                                                <button
                                                    key={session.value}
                                                    onClick={() => setSelectedSlot(session.value)}
                                                    className={`py-3 px-4 rounded-lg text-sm font-medium border transition-colors flex justify-between items-center ${selectedSlot === session.value ? 'text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                                    style={selectedSlot === session.value ? { backgroundColor: theme.primaryColor, borderColor: theme.primaryColor } : { borderColor: '#e2e8f0' }}
                                                >
                                                    <span>{session.label}</span>
                                                    {selectedSlot === session.value && <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Selected</span>}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                                            Doctor is not available on this day. Please select {availableDays}.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-2">Reason (Optional)</label>
                                <textarea
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:outline-none"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                    rows="2"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Briefly describe your issue..."
                                ></textarea>
                            </div>

                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                            <button
                                onClick={handleBook}
                                disabled={!date || !selectedSlot || loading}
                                className="w-full py-3 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: theme.accentColor }}
                            >
                                {loading ? 'Processing...' : 'Proceed to Pay'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
