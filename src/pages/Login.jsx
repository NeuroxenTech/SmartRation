import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';

export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState(''); // Served as OTP for citizen
    const [role, setRole] = useState('citizen'); // citizen, operator, admin
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // For citizen, password field acts as OTP
        const res = await login(identifier, password || 'password');

        if (res.success) {
            if (res.role === 'citizen') navigate('/citizen/dashboard');
            else if (res.role === 'operator') navigate('/operator/dashboard');
            else if (res.role === 'admin') navigate('/admin/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">RationFlow</h1>
                    <p className="text-gray-500">Digital Ration Distribution System</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-md">
                    {['citizen', 'operator', 'admin'].map((r) => (
                        <button
                            key={r}
                            onClick={() => { setRole(r); setIdentifier(''); setPassword(''); setError(''); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-sm capitalize transition-all ${role === r ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            {role === 'citizen' ? 'Ration Card Number' : 'Username'}
                        </label>
                        <Input
                            type="text"
                            placeholder={role === 'citizen' ? 'Enter 10-digit number' : 'Enter username'}
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            {role === 'citizen' ? 'OTP (Simulated)' : 'Password'}
                        </label>
                        <Input
                            type="password"
                            placeholder={role === 'citizen' ? 'Enter any 4 digits' : 'Enter password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {role === 'citizen' && <p className="text-xs text-gray-400">Use any code for demo (e.g. 1234)</p>}
                    </div>

                    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Verifying...' : 'Login'}
                    </Button>
                </form>

                <div className="mt-4 p-4 bg-blue-50 rounded text-xs text-blue-800">
                    <p className="font-bold mb-1">Demo Credentials:</p>
                    <p>Citizen: 1234567890 (Any OTP)</p>
                    <p>Operator: operator / password</p>
                    <p>Admin: admin / password</p>
                </div>

                <div className="text-center text-sm">
                    <Link to="/sms-sim" className="text-blue-600 hover:underline">
                        Open SMS Simulator (Non-Smartphone Demo)
                    </Link>
                </div>
            </Card>
        </div>
    );
}
