import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme configurations
const lightTheme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    black: '#000000',
    white: '#ffffff',
    background: {
      primary: '#f8fafc',
      secondary: '#f1f5f9',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      white: '#ffffff',
    },
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    surface: '#ffffff',
    gradients: {
      primary: ['#6366f1', '#8b5cf6'],
      secondary: ['#8b5cf6', '#a855f7'],
      green: ['#10b981', '#059669'],
      red: ['#ef4444', '#dc2626'],
      dark: ['#1e293b', '#334155'],
    },
  },
};

const darkTheme = {
  colors: {
    primary: '#818cf8',
    secondary: '#a78bfa',
    success: '#34d399',
    error: '#f87171',
    warning: '#fbbf24',
    black: '#000000',
    white: '#ffffff',
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      white: '#ffffff',
    },
    gray: {
      50: '#0f172a',
      100: '#1e293b',
      200: '#334155',
      300: '#475569',
      400: '#64748b',
      500: '#94a3b8',
      600: '#cbd5e1',
      700: '#e2e8f0',
      800: '#f1f5f9',
      900: '#f8fafc',
    },
    surface: '#1e293b',
    gradients: {
      primary: ['#818cf8', '#a78bfa'],
      secondary: ['#a78bfa', '#c084fc'],
      green: ['#34d399', '#10b981'],
      red: ['#f87171', '#ef4444'],
      dark: ['#334155', '#475569'],
    },
  },
};

const ThemeContext = createContext({
  theme: lightTheme,
  themeType: 'light', // 'light', 'dark', 'system'
  isDarkMode: false,
  setThemeType: () => {},
});

const THEME_STORAGE_KEY = '@app_theme_preference';

export const ThemeProvider = ({ children }) => {
  const [themeType, setThemeType] = useState('light');
  const [systemColorScheme, setSystemColorScheme] = useState(
    Appearance.getColorScheme() || 'light'
  );

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeType(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Listen to system appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme || 'light');
    });

    return () => subscription.remove();
  }, []);

  // Save theme preference
  const handleSetThemeType = async (newThemeType) => {
    try {
      setThemeType(newThemeType);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeType);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Determine current theme
  const getCurrentTheme = () => {
    if (themeType === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeType === 'dark' ? darkTheme : lightTheme;
  };

  const isDarkMode = () => {
    if (themeType === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeType === 'dark';
  };

  const value = {
    theme: getCurrentTheme(),
    themeType,
    isDarkMode: isDarkMode(),
    systemColorScheme,
    setThemeType: handleSetThemeType,
    lightTheme,
    darkTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;