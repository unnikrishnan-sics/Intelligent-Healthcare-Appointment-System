import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            <div className="flex pt-16 h-screen">
                <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
                <main className="flex-1 overflow-y-auto p-6 md:ml-64 w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
