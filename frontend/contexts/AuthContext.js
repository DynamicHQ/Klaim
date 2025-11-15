'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getConnectedWallet, connectWallet, disconnectWallet } from '@/utils/mockData';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    const savedWallet = getConnectedWallet();
    const savedUser = localStorage.getItem('user');
    
    if (savedWallet) {
      setWallet(savedWallet);
    }
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username, walletAddress) => {
    try {
      // For now, we'll use mock authentication
      // In production, this would call the backend API
      const userData = {
        username,
        walletAddress,
        loginTime: new Date().toISOString()
      };
      
      setUser(userData);
      setWallet(walletAddress);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('connected_wallet', walletAddress);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (username, walletAddress) => {
    try {
      // For now, we'll use mock authentication
      // In production, this would call the backend API
      const userData = {
        username,
        walletAddress,
        signupTime: new Date().toISOString()
      };
      
      setUser(userData);
      setWallet(walletAddress);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('connected_wallet', walletAddress);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setWallet(null);
    disconnectWallet();
    localStorage.removeItem('user');
  };

  const connectUserWallet = () => {
    const newWallet = connectWallet();
    setWallet(newWallet);
    return newWallet;
  };

  const value = {
    user,
    wallet,
    isLoading,
    isAuthenticated: !!user && !!wallet,
    login,
    signup,
    logout,
    connectWallet: connectUserWallet
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}