import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Palette, FileText, Settings, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Clients', path: '/clients', icon: Users },
        { name: 'Brands', path: '/brands', icon: Palette },
        { name: 'Invoices', path: '/invoices', icon: FileText },
    ];

    return (
        <aside className={cn(
            "w-72 h-[100dvh] bg-secondary text-white flex flex-col shadow-2xl fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out md:w-64 md:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="p-6 flex items-center justify-between border-b border-white/5 flex-shrink-0">
                <h1 className="text-xl font-bold flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center font-black shadow-lg shadow-primary/20">
                        N
                    </div>
                    <span>Nexus CRM</span>
                </h1>
                <button
                    onClick={onClose}
                    className="p-2 -mr-2 text-white/40 hover:text-white transition-colors md:hidden"
                    aria-label="Close menu"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={onClose}
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
