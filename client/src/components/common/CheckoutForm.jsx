import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CheckoutForm = ({ clientSecret, onSuccess, amount, doctorName }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { theme } = useTheme();


    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);


        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL is not strictly needed if we handle it inline, 
                // but Stripe might require it for redirects. 
                // We'll trust the inline completion for now.
                return_url: window.location.origin,
            },
            redirect: 'if_required'
        });

        if (error) {
            toast.error(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            toast.success("Payment Successful!");
            onSuccess(paymentIntent.id);
            // Don't set loading false yet, wait for parent to handle success
        } else {
            setIsLoading(false);
            toast.error("Payment status: " + paymentIntent.status);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 animate-fade-in">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Checkout</h3>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Order Summary</h4>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Consultation Fee</span>
                    <span className="font-medium">₹{amount}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Doctor</span>
                    <span className="font-medium text-gray-900">{doctorName}</span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between items-center text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{amount}</span>
                </div>
            </div>

            <div className="mb-6">
                <PaymentElement />
            </div>



            <button
                disabled={isLoading || !stripe || !elements}
                className="w-full py-3 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: theme.accentColor }}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                        Processing...
                    </span>
                ) : (
                    `Pay ₹${amount}`
                )}
            </button>
        </form>
    );
};

export default CheckoutForm;
