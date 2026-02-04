import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, title, message, confirmText, cancelText, type = 'danger' }) => {
    const { theme } = useTheme();

    if (!isOpen) return null;

    const colors = {
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        primary: theme.primaryColor || '#3b82f6'
    };

    const iconColors = {
        danger: 'bg-red-50 text-red-500',
        warning: 'bg-yellow-50 text-yellow-500',
        success: 'bg-green-50 text-green-500',
        primary: 'bg-blue-50 text-blue-500'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/10 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up border border-gray-100">
                <div className="flex justify-end p-4 pb-0">
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-8 pb-8 pt-2 text-center">
                    <div className={`w-16 h-16 rounded-full ${iconColors[type]} flex items-center justify-center mx-auto mb-6`}>
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title || 'Confirm Action'}</h3>
                    <p className="text-gray-500 mb-8">{message || 'Are you sure you want to proceed?'}</p>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 text-gray-600 font-bold rounded-xl hover:bg-gray-50 border border-gray-100 transition-all duration-300"
                        >
                            {cancelText || 'Cancel'}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-3 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                            style={{ backgroundColor: colors[type] }}
                        >
                            {confirmText || 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
