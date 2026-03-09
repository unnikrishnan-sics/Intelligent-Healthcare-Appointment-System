import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        primaryColor: '#0ea5e9',
        secondaryColor: '#64748b',
        accentColor: '#f43f5e',
        logoUrl: '',
        hospitalName: 'IHAS Healthcare',
        reminderHours: 10
    });

    const [loading, setLoading] = useState(true);

    const applyTheme = (themeData) => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', themeData.primaryColor);
        root.style.setProperty('--color-secondary', themeData.secondaryColor);
        root.style.setProperty('--color-accent', themeData.accentColor);
    };

    // Fetch theme from backend
    // Since backend might not be fully ready or cors issues, we default to static first.
    // Eventually this will fetch from /api/admin/settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
                const config = {
                    headers: {
                        'Authorization': `Bearer ${userInfo ? userInfo.token : ''}`
                    }
                };
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/settings`, config);
                if (res.data) {
                    const settingsData = {
                        ...res.data.theme,
                        hospitalName: res.data.hospitalName,
                        reminderHours: res.data.reminderHours
                    };
                    setTheme(settingsData);
                    applyTheme(res.data.theme);
                } else {
                    applyTheme(theme);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to load theme", error);
                applyTheme(theme);
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const updateTheme = (newTheme) => {
        setTheme((prev) => ({ ...prev, ...newTheme }));
        applyTheme({ ...theme, ...newTheme });
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, loading }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
