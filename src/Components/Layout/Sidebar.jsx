import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Clients', path: '/clients', icon: Users },
        { name: 'Invoices', path: '/invoices', icon: FileText },
    ];

    return (
        <aside className="w-64 h-screen bg-secondary text-white hidden md:flex flex-col shadow-xl fixed left-0 top-0 z-20">
            <div className="p-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black">
                        N
                    </div>
                    Nexus CRM
                </h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                                isActive
                                    ? 'bg-white/10 text-white font-medium'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            )
                        }
                    >
                        <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-white/5 p-4 rounded-xl">
                    <p className="text-sm text-gray-300 mb-3">System Online</p>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </aside>
    );
};
