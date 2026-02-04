import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, Calendar, Users, Settings, FileText, Activity, LogOut } from 'lucide-react';
import LogoutConfirmModal from '../common/LogoutConfirmModal';

const Sidebar = ({ isOpen, closeSidebar }) => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    if (!user) return null;

    const links = [];

    // Common Links
    links.push({ name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, end: true });
    links.push({ name: 'My Profile', path: '/dashboard/profile', icon: <Settings size={20} /> });

    if (user.role === 'patient') {
        links.push({ name: 'My Appointments', path: '/dashboard/appointments', icon: <Calendar size={20} /> });
        links.push({ name: 'Find Doctors', path: '/dashboard/doctors', icon: <Users size={20} /> });
        links.push({ name: 'Live Queue', path: '/dashboard/live-queue', icon: <Activity size={20} /> });
    }

    if (user.role === 'doctor') {
        links.push({ name: 'My Schedule', path: '/dashboard/schedule', icon: <Calendar size={20} /> });
        links.push({ name: 'Patients', path: '/dashboard/patients', icon: <Users size={20} /> });
    }

    if (user.role === 'admin') {
        links.push({ name: 'Manage Doctors', path: '/dashboard/admin/doctors', icon: <Users size={20} /> });
        links.push({ name: 'All Appointments', path: '/dashboard/admin/appointments', icon: <Calendar size={20} /> });
        links.push({ name: 'Reports', path: '/dashboard/admin/reports', icon: <FileText size={20} /> });
        links.push({ name: 'Settings', path: '/dashboard/admin/settings', icon: <Settings size={20} /> });
    }

    const handleLogoutClick = () => {
        if (window.innerWidth < 768) closeSidebar();
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        setShowLogoutModal(false);
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={closeSidebar}></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-4 flex flex-col h-full">
                    <div className="md:hidden flex justify-end mb-2">
                        <button onClick={closeSidebar} className="text-gray-500 hover:text-gray-700 p-1">
                            <span className="sr-only">Close sidebar</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    <div className="space-y-2 flex-grow">
                        {links.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={link.end}
                                onClick={() => window.innerWidth < 768 && closeSidebar()}
                                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-gray-100 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                                style={({ isActive }) => isActive ? { color: theme.primaryColor, borderLeft: `4px solid ${theme.primaryColor}` } : {}}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </NavLink>
                        ))}
                    </div>

                    <div className="pt-4 mt-auto border-t border-gray-100">
                        <button
                            onClick={handleLogoutClick}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-50 transition-colors font-medium"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onConfirm={confirmLogout}
                onCancel={() => setShowLogoutModal(false)}
            />
        </>
    );
};

export default Sidebar;
