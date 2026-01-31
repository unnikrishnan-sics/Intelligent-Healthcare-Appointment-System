import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
    const { theme } = useTheme();

    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-bold mb-4" style={{ color: theme.primaryColor }}>{theme.hospitalName}</h3>
                        <p className="text-gray-500 text-sm">
                            Providing world-class healthcare with a personal touch. Your health is our commitment.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
                            <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
                            <li><Link to="/doctors" className="hover:text-blue-600">Find Doctors</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Services</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>General Checkup</li>
                            <li>Cardiology</li>
                            <li>Pediatrics</li>
                            <li>Neurology</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>123 Healthcare Ave, NY</li>
                            <li>support@ihas.com</li>
                            <li>+1 (555) 123-4567</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
                    &copy; 2026 {theme.hospitalName}. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
