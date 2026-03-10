import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../UI/Toast';

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
                <Header />
                <main className="flex-1 p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
            <ToastContainer />
        </div>
    );
};
