import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Active link styling
    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `px-4 py-2 rounded-full transition-all duration-300 font-medium ${isActive
            ? `text-${theme.primaryColor} bg-${theme.primaryColor}/10 font-bold`
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`;
    };

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'h-16 shadow-md bg-white/90 backdrop-blur-md' : 'h-20 bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                {/* Logo Area */}
                <div className="flex items-center gap-4">
                    {user && toggleSidebar && (
                        <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none md:hidden p-2 rounded-lg hover:bg-gray-100">
                            <Menu className="w-6 h-6" />
                        </button>
                    )}
                    <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-2 group">
                        <div className={`p-2 rounded-lg bg-${theme.primaryColor} text-white transform group-hover:scale-110 transition-transform duration-300`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </div>
                        <span style={{ color: theme.primaryColor }}>{theme.hospitalName}</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {!user && (
                        <div className="flex items-center gap-2 bg-white/50 p-1 rounded-full border border-gray-100 backdrop-blur-sm">
                            <Link to="/" className={getLinkClass('/')}>Home</Link>
                            <Link to="/about" className={getLinkClass('/about')}>About</Link>
                            <Link to="/doctors" className={getLinkClass('/doctors')}>Doctors</Link>
                            <Link to="/contact" className={getLinkClass('/contact')}>Contact</Link>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-gray-800">{user.name}</span>
                                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                                </div>
                                <div className={`w-10 h-10 rounded-full bg-${theme.primaryColor}/10 flex items-center justify-center text-${theme.primaryColor}`}>
                                    <User size={20} />
                                </div>
                                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium text-sm px-3 py-1 rounded-full hover:bg-red-50 transition">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="px-5 py-2.5 text-gray-700 font-medium hover:text-gray-900 transition">Login</Link>
                                <Link to="/register" className="px-6 py-2.5 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                                    style={{ backgroundColor: theme.primaryColor }}>
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 p-2">
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t animate-fade-in">
                    <div className="px-4 py-6 space-y-4 flex flex-col">
                        {!user && (
                            <>
                                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-gray-50 font-medium block">Home</Link>
                                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-gray-50 font-medium block">About</Link>
                                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg hover:bg-gray-50 font-medium block">Contact</Link>
                                <div className="h-px bg-gray-100 my-2"></div>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-center text-gray-600 font-bold block">Login</Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-center text-white font-bold rounded-xl block" style={{ backgroundColor: theme.primaryColor }}>Get Started</Link>
                            </>
                        )}
                        {user && (
                            <button onClick={handleLogout} className="w-full text-center py-3 text-red-500 font-bold border rounded-xl hover:bg-red-50">Logout</button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
