import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

// Light theme colors
const lightTheme = {
  mode: 'light',
  colors: {
    // Primary colors
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    primaryLight: '#818cf8',
    
    // Background colors
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    card: '#ffffff',
    
    // Text colors
    text: '#111827',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    
    // Border colors
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    
    // Status colors
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    
    // Interactive colors
    buttonPrimary: '#6366f1',
    buttonPrimaryText: '#ffffff',
    buttonSecondary: '#f3f4f6',
    buttonSecondaryText: '#374151',
    buttonDisabled: '#e5e7eb',
    buttonDisabledText: '#9ca3af',
    
    // Input colors
    inputBackground: '#ffffff',
    inputBorder: '#d1d5db',
    inputBorderFocus: '#6366f1',
    inputText: '#111827',
    inputPlaceholder: '#9ca3af',
    
    // Tab bar colors
    tabBarBackground: '#ffffff',
    tabBarBorder: '#e5e7eb',
    tabBarActive: '#6366f1',
    tabBarInactive: '#9ca3af',
  },
  
  // Typography
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

// Dark theme colors
const darkTheme = {
  mode: 'dark',
  colors: {
    // Primary colors
    primary: '#818cf8',
    primaryDark: '#6366f1',
    primaryLight: '#a5b4fc',
    
    // Background colors
    background: '#111827',
    backgroundSecondary: '#1f2937',
    card: '#1f2937',
    
    // Text colors
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    textTertiary: '#9ca3af',
    
    // Border colors
    border: '#374151',
    borderLight: '#4b5563',
    
    // Status colors
    success: '#34d399',
    error: '#f87171',
    warning: '#fbbf24',
    info: '#60a5fa',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',
    
    // Interactive colors
    buttonPrimary: '#818cf8',
    buttonPrimaryText: '#111827',
    buttonSecondary: '#374151',
    buttonSecondaryText: '#f9fafb',
    buttonDisabled: '#374151',
    buttonDisabledText: '#6b7280',
    
    // Input colors
    inputBackground: '#1f2937',
    inputBorder: '#4b5563',
    inputBorderFocus: '#818cf8',
    inputText: '#f9fafb',
    inputPlaceholder: '#6b7280',
    
    // Tab bar colors
    tabBarBackground: '#1f2937',
    tabBarBorder: '#374151',
    tabBarActive: '#818cf8',
    tabBarInactive: '#6b7280',
  },
  
  // Typography (same as light theme)
  fonts: lightTheme.fonts,
  
  // Spacing (same as light theme)
  spacing: lightTheme.spacing,
  
  // Border radius (same as light theme)
  borderRadius: lightTheme.borderRadius,
  
  // Shadows (adjusted for dark theme)
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', or 'system'
  const [currentTheme, setCurrentTheme] = useState(
    systemColorScheme === 'dark' ? darkTheme : lightTheme
  );

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update theme when system color scheme changes (if using system theme)
  useEffect(() => {
    if (themeMode === 'system') {
      setCurrentTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
    }
  }, [systemColorScheme, themeMode]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_mode');
      if (savedTheme) {
        setThemeMode(savedTheme);
        updateTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const updateTheme = (mode) => {
    if (mode === 'light') {
      setCurrentTheme(lightTheme);
    } else if (mode === 'dark') {
      setCurrentTheme(darkTheme);
    } else {
      // system
      setCurrentTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
    }
  };

  const setTheme = async (mode) => {
    try {
      setThemeMode(mode);
      updateTheme(mode);
      await AsyncStorage.setItem('theme_mode', mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    const newMode = currentTheme.mode === 'light' ? 'dark' : 'light';
    await setTheme(newMode);
  };

  const value = {
    theme: currentTheme,
    themeMode,
    isDark: currentTheme.mode === 'dark',
    setTheme,
    toggleTheme,
    colors: currentTheme.colors,
    fonts: currentTheme.fonts,
    spacing: currentTheme.spacing,
    borderRadius: currentTheme.borderRadius,
    shadows: currentTheme.shadows,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
