import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, ShoppingBag, Calendar, LogOut, Package, ShoppingCart } from 'lucide-react';

export default function CitizenLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Home', path: '/citizen/dashboard' },
        { icon: Package, label: 'Stock', path: '/citizen/stock' },
        { icon: ShoppingBag, label: 'Pre-book', path: '/citizen/prebook' },
        { icon: Calendar, label: 'Slots', path: '/citizen/slots' },
        { icon: ShoppingCart, label: 'My Orders', path: '/citizen/orders' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white shadow-md z-10">
                <div className="p-4 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-blue-600">RationFlow</h1>
                    <p className="text-xs text-gray-500">Citizen Portal</p>
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
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-2">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.rationCardNumber}</p>
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

            {/* Mobile Header */}
            <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-20">
                <h1 className="text-xl font-bold text-blue-600">RationFlow</h1>
                <button onClick={logout} className="p-2 text-gray-500">
                    <LogOut className="w-5 h-5" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-y-auto">
                <Outlet />
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-20 pb-safe">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center p-2 rounded-md ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-400'
                            }`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[10px] mt-1">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
