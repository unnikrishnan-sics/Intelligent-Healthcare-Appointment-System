import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock submission
        setSent(true);
        setTimeout(() => setSent(false), 3000);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen pt-20 pb-12 animate-fade-in bg-gray-50">
            <div className="bg-white shadow py-12 mb-12">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h1 className="text-4xl font-bold mb-4" style={{ color: theme.primaryColor }}>Get in Touch</h1>
                    <p className="text-gray-600 text-lg">
                        Have questions or need assistance? We are here to help.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                        <p className="text-gray-600 mb-8">
                            Reach out to our support team for any inquiries regarding appointments, doctors, or technical issues.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Phone</h3>
                                <p className="text-gray-600">+1 (555) 123-4567</p>
                                <p className="text-sm text-gray-500">Mon-Fri 9am to 6pm</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Email</h3>
                                <p className="text-gray-600">support@ihas-healthcare.com</p>
                                <p className="text-sm text-gray-500">Online support 24/7</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Location</h3>
                                <p className="text-gray-600">123 Healthcare Ave, Medical District</p>
                                <p className="text-gray-600">New York, NY 10001</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                    {sent ? (
                        <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center">
                            Message sent successfully! We'll get back to you soon.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:outline-none"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:outline-none"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:outline-none"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 text-white font-bold rounded-xl shadow hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                style={{ backgroundColor: theme.primaryColor }}
                            >
                                <Send size={18} /> Send Message
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Contact;
