import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Check localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);

        // Update CSS variables based on theme
        if (theme === 'dark') {
            document.documentElement.style.setProperty('--bg-page', '#121212');
            document.documentElement.style.setProperty('--bg-gradient-start', '#1E1E1E');
            document.documentElement.style.setProperty('--bg-gradient-end', '#2C1A1D'); // Dark Red tint
            document.documentElement.style.setProperty('--text-main', '#E0E0E0');
            document.documentElement.style.setProperty('--bg-card', '#1E1E1E');
            document.documentElement.style.setProperty('--bg-input', '#2C2C2C');
            document.documentElement.style.setProperty('--border-light', 'rgba(255, 255, 255, 0.1)');
            // Keep primary red as is, maybe adjust brightness if needed
        } else {
            document.documentElement.style.setProperty('--bg-page', '#FFFFFF');
            document.documentElement.style.setProperty('--bg-gradient-start', '#FFFFFF');
            document.documentElement.style.setProperty('--bg-gradient-end', '#FFEBEE');
            document.documentElement.style.setProperty('--text-main', '#616161');
            document.documentElement.style.setProperty('--bg-card', '#FFFFFF');
            document.documentElement.style.setProperty('--bg-input', '#FAFAFA');
            document.documentElement.style.setProperty('--border-light', 'rgba(229, 57, 53, 0.5)');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
