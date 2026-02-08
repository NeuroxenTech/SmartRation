import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Store, Users, LogOut, BarChart } from 'lucide-react';

export default function AdminLayout() {
    const { logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Store, label: 'Shops & Stock', path: '/admin/shops' },
        { icon: Users, label: 'Beneficiaries', path: '/admin/users' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col">
                <div className="p-4 border-b border-gray-800">
                    <h1 className="text-xl font-bold">TNPDS Admin</h1>
                    <p className="text-xs text-gray-400">System Administrator</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 rounded-md"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="md:hidden mb-4 flex justify-between items-center bg-white p-4 rounded shadow">
                    <h1 className="font-bold">Admin Panel</h1>
                    <button onClick={logout}><LogOut size={20} /></button>
                </div>
                <Outlet />
            </main>
        </div>
    );
}
