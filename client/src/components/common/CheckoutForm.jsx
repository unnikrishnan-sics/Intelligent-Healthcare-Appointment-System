import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { CreditCard, Smartphone, CheckCircle, Smartphone as UpiIcon, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const CheckoutForm = ({ clientSecret, onSuccess, amount, doctorName }) => {
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'upi'

    // Mock Form States
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });
    const [upiId, setUpiId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (paymentMethod === 'upi' && !upiId) {
            toast.error("Please enter a valid UPI ID");
            return;
        }

        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Mock Payment Successful!");
            onSuccess(clientSecret); // For mock, we reuse the mock client secret as payment ID
        }, 2000);
    };

    return (
        <div className="mt-4 animate-fade-in space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Mock Checkout</h3>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm font-medium">Doctor</span>
                    <span className="font-bold text-gray-900">{doctorName}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-black text-gray-900 border-t pt-2 mt-2">
                    <span>Total Amount</span>
                    <span style={{ color: theme.primaryColor }}>₹{amount}</span>
                </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl">
                <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'card' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                    <CreditCard size={18} /> Card
                </button>
                <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'upi' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                    <Smartphone size={18} /> UPI
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {paymentMethod === 'card' ? (
                    <div className="space-y-4 animate-scale-in">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Card Number</label>
                            <input
                                type="text"
                                placeholder="4242 4242 4242 4242"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                                value={cardData.number}
                                onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Expiry Date</label>
                                <input
                                    type="text"
                                    placeholder="MM / YY"
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                                    value={cardData.expiry}
                                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">CVV</label>
                                <input
                                    type="password"
                                    placeholder="***"
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                                    value={cardData.cvv}
                                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-scale-in">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">UPI ID</label>
                            <input
                                type="text"
                                placeholder="username@upi"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <div className="w-32 h-32 bg-white p-2 rounded-xl mb-3 shadow-sm flex items-center justify-center">
                                <UpiIcon size={64} className="text-gray-200" />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">Scan QR or enter UPI ID to pay</p>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 group overflow-hidden relative"
                    style={{ backgroundColor: theme.primaryColor }}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            Processing...
                        </div>
                    ) : (
                        <>
                            <span>Complete Mock Payment</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-tight">
                🔒 Secured with Mock 128-bit Encryption
            </p>
        </div>
    );
};

export default CheckoutForm;
