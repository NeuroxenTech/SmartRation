import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../be/service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (identifier, password) => {
        setLoading(true);
        try {
            const res = await api.login(identifier, password);
            if (res.success) {
                setUser(res.user);
                // Persist to local storage for refresh (simplified)
                localStorage.setItem('rationFlowUser', JSON.stringify(res.user));
                return { success: true, role: res.user.role };
            }
            return { success: false, message: res.message };
        } catch (e) {
            return { success: false, message: "Login failed" };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('rationFlowUser');
    };

    useEffect(() => {
        const stored = localStorage.getItem('rationFlowUser');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
