import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        primaryColor: '#0ea5e9',
        secondaryColor: '#64748b',
        accentColor: '#f43f5e',
        logoUrl: '',
        hospitalName: 'IHAS Healthcare'
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
                // Mock fetch or real fetch
                // const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/settings`);
                // if(res.data) {
                //      setTheme(res.data.theme);
                //      applyTheme(res.data.theme);
                // }

                // For now, apply default
                applyTheme(theme);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load theme", error);
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
