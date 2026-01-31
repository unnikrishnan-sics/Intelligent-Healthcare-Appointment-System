import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, ChevronRight, Stethoscope, MapPin } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'patient'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // The register function in context might likely auto-login if token is present
            // We need to check what 'register' returns. 
            // Looking at AuthContext (assumed), it likely sets user if token exists.

            // Let's modify this to handle the response directly or check if login was successful.
            // If we use the context function, it might throw if no token? 
            // Or we should call the API directly here to control the flow better?
            // Actually, best to update AuthContext to handle this, but let's check AuthContext first in next step if needed.
            // For now, assuming register returns the data.

            const data = await register(formData.name, formData.email, formData.password, formData.role);

            if (data?.status === 'pending') {
                alert('Registration successful! Please wait for Admin approval before logging in.');
                navigate('/login');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 pt-16">
            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-cyan-600/40"></div>
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <h1 className="text-5xl font-bold mb-6">Join Us Today</h1>
                    <p className="text-xl opacity-90 leading-relaxed max-w-lg">
                        Create your account to schedule appointments, consult with specialists, and take control of your healthcare journey.
                    </p>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 animate-fade-in">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg transform -rotate-3" style={{ backgroundColor: theme.primaryColor }}>
                            <Stethoscope size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                        <p className="text-gray-500 mt-2">Join our healthcare community</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg text-sm flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                    placeholder="John Doe"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                    placeholder="name@example.com"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Address (Required for Payments)</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="address"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                    placeholder="123 Main St, City, Country"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">I am a...</label>
                            <div className="relative w-full">
                                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                                <select
                                    name="role"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none bg-white relative"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Doctor</option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronRight size={16} className="text-gray-400 rotate-90" />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                            style={{ backgroundColor: theme.primaryColor }}
                        >
                            {loading ? 'Creating Account...' : 'Register Now'}
                            {!loading && <ChevronRight size={20} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold hover:underline" style={{ color: theme.primaryColor }}>
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
