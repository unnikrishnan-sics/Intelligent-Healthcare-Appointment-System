import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Configure axios default
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    // Verify token or get profile
                    // const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`);
                    // setUser(res.data);

                    // Simple decode or just assume valid for now if backend check fails due to cors/network in split terminal
                    // For robustness, let's persist user data in localstorage too or fetch it.
                    const userData = JSON.parse(localStorage.getItem('userInfo'));
                    if (userData) setUser(userData);
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data);
        return res.data;
    };

    const register = async (name, email, password, role, address) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { name, email, password, role, address });
        // Do not auto-login. User must login manually.
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
