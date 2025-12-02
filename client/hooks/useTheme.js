import { useState, useEffect } from 'react';

/**
 * Custom hook for theme management with persistent storage.
 * 
 * This hook provides comprehensive theme switching functionality with automatic
 * persistence to localStorage and DOM attribute management. It handles the
 * complete theme lifecycle including initialization from stored preferences,
 * dynamic theme switching, and proper DOM updates for CSS theme variables.
 * The hook ensures consistent theme application across page reloads and
 * provides a seamless dark/light mode experience.
 * 
 * @returns {Object} Current theme state and toggle function
 */
export function useTheme() {
  const [theme, setThemeState] = useState('light');

  // Load theme from localStorage on mount and apply to DOM
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setThemeState(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  /**
   * Theme setter with persistence and DOM updates.
   * 
   * This function handles complete theme changes including state updates,
   * localStorage persistence, and DOM attribute application for CSS theme
   * variables. It ensures the theme change is immediately reflected across
   * the entire application interface.
   */
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Simple theme toggle utility for switching between light and dark modes
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