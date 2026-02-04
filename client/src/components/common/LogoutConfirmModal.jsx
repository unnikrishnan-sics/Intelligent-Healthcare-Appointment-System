import React from 'react';
import { LogOut, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
    const { theme } = useTheme();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/10 backdrop-blur-2xl animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-scale-up border border-gray-100">
                <div className="flex justify-end p-4 pb-0">
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6 text-red-500">
                        <LogOut size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Logout</h3>
                    <p className="text-gray-500 mb-8">Are you sure you want to log out of your account?</p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            className="w-full py-3.5 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                            style={{ backgroundColor: '#ef4444' }} // Standard Red-500 for Logout
                        >
                            Yes, Log me out
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full py-3.5 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmModal;
