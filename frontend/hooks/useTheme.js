import { useState, useEffect } from 'react';

/**
 * Custom hook for managing theme state
 * Handles theme persistence in localStorage and applies theme to document
 * 
 * @returns {Object} { theme, toggleTheme, setTheme }
 */
export function useTheme() {
  const [theme, setThemeState] = useState('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setThemeState(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Set theme and persist to localStorage
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}

export default useTheme;
