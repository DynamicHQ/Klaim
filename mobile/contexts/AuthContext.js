import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useWallet } from './WalletContext';
import {
  getNonce,
  authenticateWithSignature,
  signupUser as apiSignupUser,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  setOnUnauthorizedCallback,
} from '../utils/api';

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
  const [authToken, setAuthTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const { address: wallet, getSigner } = useWallet();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check biometric availability
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);

      // Load saved auth state
      const savedUser = await AsyncStorage.getItem('user');
      const savedToken = getAuthToken();
      const biometricPref = await AsyncStorage.getItem('biometric_enabled');

      if (savedToken) {
        setAuthTokenState(savedToken);
      }

      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          await AsyncStorage.removeItem('user');
        }
      }

      if (biometricPref === 'true') {
        setBiometricEnabled(true);
      }

      // Set up unauthorized callback
      setOnUnauthorizedCallback(() => {
        logout();
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async () => {
    if (!wallet) {
      throw new Error('Please connect your wallet first');
    }

    try {
      // Create user account with wallet address as username
      const signupResponse = await apiSignupUser(wallet, wallet);

      if (!signupResponse.success) {
        throw new Error(signupResponse.message || 'Signup failed');
      }

      // Automatically login after successful signup
      await login();

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);

      // Handle specific error cases
      if (error.status === 500 && error.message.includes('already exists')) {
        throw new Error('This wallet is already registered. Please login instead.');
      }

      throw error;
    }
  };

  const login = async () => {
    if (!wallet) {
      throw new Error('Please connect your wallet first');
    }

    try {
      // Step 1: Get nonce from backend
      const { nonce } = await getNonce(wallet);

      // Step 2: Construct message to sign
      const message = `Welcome to Klaim! Sign this nonce to login: ${nonce}`;

      // Step 3: Sign message with wallet
      const signer = await getSigner();
      const signature = await signer.signMessage(message);

      // Step 4: Authenticate with signature
      const { access_token } = await authenticateWithSignature(wallet, signature);

      // Step 5: Store token and update state
      setAuthToken(access_token);
      setAuthTokenState(access_token);

      // Step 6: Create user object
      const userData = {
        wallet: wallet,
        profileName: 'Klaim User', // Default name, can be updated later
      };

      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);

      // Handle specific error cases
      if (error.message.includes('rejected') || error.message.includes('denied')) {
        throw new Error('You rejected the signature request. Please try again.');
      } else if (error.status === 401) {
        throw new Error('Authentication failed. Please try again.');
      } else if (error.message.includes('not found')) {
        throw new Error('Account not found. Please sign up first.');
      }

      throw error;
    }
  };

  const loginWithBiometric = async () => {
    if (!biometricAvailable) {
      throw new Error('Biometric authentication is not available on this device');
    }

    if (!biometricEnabled) {
      throw new Error('Biometric authentication is not enabled. Please enable it in settings.');
    }

    try {
      // Authenticate with biometrics
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to login',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      if (!result.success) {
        throw new Error('Biometric authentication failed');
      }

      // If biometric succeeds, perform regular login
      await login();

      return { success: true };
    } catch (error) {
      console.error('Biometric login error:', error);
      throw error;
    }
  };

  const enableBiometric = async () => {
    if (!biometricAvailable) {
      throw new Error('Biometric authentication is not available on this device');
    }

    try {
      // Test biometric authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric authentication',
        fallbackLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setBiometricEnabled(true);
        await AsyncStorage.setItem('biometric_enabled', 'true');
        return { success: true };
      } else {
        throw new Error('Biometric authentication failed');
      }
    } catch (error) {
      console.error('Error enabling biometric:', error);
      throw error;
    }
  };

  const disableBiometric = async () => {
    try {
      setBiometricEnabled(false);
      await AsyncStorage.setItem('biometric_enabled', 'false');
      return { success: true };
    } catch (error) {
      console.error('Error disabling biometric:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setAuthTokenState(null);
      clearAuthToken();
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('connected_wallet');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    wallet,
    authToken,
    isLoading,
    isAuthenticated: !!user && !!authToken,
    biometricAvailable,
    biometricEnabled,
    signup,
    login,
    loginWithBiometric,
    enableBiometric,
    disableBiometric,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
