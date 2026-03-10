import React from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

export const Header = () => {
    const { logout } = useAuth();

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
            <div className="flex-1 flex items-center">
                <div className="relative w-96 hidden md:block">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search CRM..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary border-2 border-white rounded-full"></span>
                </button>

                <div className="h-8 w-[1px] bg-gray-200"></div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-semibold group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-secondary transition-all">
                            AD
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-gray-900 leading-tight">Admin User</p>
                            <p className="text-xs text-gray-500">System Admin</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};
