import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Package, LogOut, ClipboardList } from 'lucide-react';

export default function OperatorLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/operator/dashboard' },
        { icon: ClipboardList, label: 'Orders & Slots', path: '/operator/orders' },
        // { icon: Users, label: 'Beneficiaries', path: '/operator/users' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar (Operator is likely desktop/tablet user) */}
            <aside className="w-64 bg-white shadow-md z-10 hidden md:flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-blue-800 text-white">
                    <h1 className="text-xl font-bold">FPS Operator</h1>
                    <p className="text-xs opacity-80">Shop ID: {user?.shopId}</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center mb-4">
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="md:hidden mb-4 flex justify-between items-center bg-white p-4 rounded shadow">
                    <h1 className="font-bold">FPS Operator</h1>
                    <button onClick={logout}><LogOut size={20} /></button>
                </div>
                <Outlet />
            </main>
        </div>
    );
}
