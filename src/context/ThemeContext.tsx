import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, ThemeColors, getThemeColors } from '../theme/colors';

interface ThemeContextType {
    isDarkMode: boolean;
    theme: ThemeColors;
    toggleTheme: () => void;
    setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(
        Appearance.getColorScheme() === 'dark'
    );

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme !== null) {
                    setIsDarkMode(savedTheme === 'dark');
                }
            } catch (error) {
                console.error('Error loading theme:', error);
            }
        };
        loadTheme();
    }, []);

    useEffect(() => {
        const saveTheme = async () => {
            try {
                await AsyncStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            } catch (error) {
                console.error('Error saving theme:', error);
            }
        };
        saveTheme();
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const setTheme = (isDark: boolean) => {
        setIsDarkMode(isDark);
    };

    const theme = getThemeColors(isDarkMode);

    return (
        <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};