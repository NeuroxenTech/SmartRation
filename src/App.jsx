import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import CitizenLayout from './components/Layout/CitizenLayout';
import CitizenDashboard from './pages/citizen/Dashboard';
import Prebook from './pages/citizen/Prebook';
import Slots from './pages/citizen/Slots';

import Orders from './pages/citizen/Orders';
import SmsSimulator from './pages/SmsSimulator';
import OperatorLayout from './components/Layout/OperatorLayout';
import OperatorDashboard from './pages/operator/Dashboard';
import ManageOrders from './pages/operator/ManageOrders';

import AdminLayout from './components/Layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import Shops from './pages/admin/Shops';
import Users from './pages/admin/Users';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <DataProvider>
                    <Routes>
                        <Route path="/sms-sim" element={<SmsSimulator />} />
                        <Route path="/" element={<Login />} />

                        <Route path="/citizen" element={
                            <ProtectedRoute roles={['citizen']}>
                                <CitizenLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<CitizenDashboard />} />
                            <Route path="prebook" element={<Prebook />} />
                            <Route path="slots" element={<Slots />} />
                            <Route path="orders" element={<Orders />} />
                            {/* Add more routes as needed */}
                        </Route>

                        <Route path="/operator" element={
                            <ProtectedRoute roles={['operator']}>
                                <OperatorLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<OperatorDashboard />} />
                            <Route path="orders" element={<ManageOrders />} />
                        </Route>

                        <Route path="/admin" element={
                            <ProtectedRoute roles={['admin']}>
                                <AdminLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="shops" element={<Shops />} />
                            <Route path="users" element={<Users />} />
                        </Route>
                    </Routes>
                </DataProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
