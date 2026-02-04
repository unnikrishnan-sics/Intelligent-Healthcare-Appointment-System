import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ChevronRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-gray-50 pt-16">
            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1576091160550-2187d80afea2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/40"></div>
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
                    <p className="text-xl opacity-90 leading-relaxed max-w-lg">
                        Access your health dashboard to manage appointments, view history, and connect with your doctors.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 animate-fade-in">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg transform rotate-3" style={{ backgroundColor: theme.primaryColor }}>
                            <LogIn size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Sign In</h2>
                        <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg text-sm flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-gray-700">Password</label>
                                <Link to="/forgot-password" className="text-sm font-medium hover:underline" style={{ color: theme.primaryColor }}>Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                    style={{ '--tw-ring-color': theme.primaryColor }}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                            style={{ backgroundColor: theme.primaryColor }}
                        >
                            {loading ? 'Signing in...' : 'Login to Account'}
                            {!loading && <ChevronRight size={20} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold hover:underline" style={{ color: theme.primaryColor }}>
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
