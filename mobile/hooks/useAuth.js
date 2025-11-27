import { useCallback } from 'react';
import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { Alert } from 'react-native';

/**
 * Custom hook wrapper for authentication functionality.
 * 
 * This hook provides a convenient wrapper around AuthContext with additional
 * helper functions and error handling. It exposes all authentication methods
 * including wallet-based login, signup, biometric authentication, and logout.
 * 
 * @returns {Object} Authentication state and functions
 */
export const useAuth = () => {
  const authContext = useAuthContext();

  /**
   * Login with wallet signature
   * Handles errors and shows user-friendly alerts
   * @returns {Promise<Object>} Login result
   */
  const login = useCallback(async () => {
    try {
      const result = await authContext.login();
      return result;
    } catch (error) {
      console.error('Login error:', error);
      
      Alert.alert(
        'Login Failed',
        error.message || 'Failed to login. Please try again.',
        [{ text: 'OK' }]
      );
      
      throw error;
    }
  }, [authContext]);

  /**
   * Sign up new user
   * @param {string} username - User's profile name
   * @returns {Promise<Object>} Signup result
   */
  const signup = useCallback(async (username) => {
    if (!username || username.trim() === '') {
      Alert.alert(
        'Invalid Username',
        'Please enter a valid username.',
        [{ text: 'OK' }]
      );
      throw new Error('Username is required');
    }

    try {
      const result = await authContext.signup(username);
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      
      Alert.alert(
        'Signup Failed',
        error.message || 'Failed to create account. Please try again.',
        [{ text: 'OK' }]
      );
      
      throw error;
    }
  }, [authContext]);

  /**
   * Login with biometric authentication
   * @returns {Promise<Object>} Login result
   */
  const loginWithBiometric = useCallback(async () => {
    try {
      const result = await authContext.loginWithBiometric();
      return result;
    } catch (error) {
      console.error('Biometric login error:', error);
      
      // Don't show alert for user cancellation
      if (!error.message.includes('cancel') && !error.message.includes('Cancel')) {
        Alert.alert(
          'Biometric Login Failed',
          error.message || 'Failed to authenticate with biometrics.',
          [{ text: 'OK' }]
        );
      }
      
      throw error;
    }
  }, [authContext]);

  /**
   * Enable biometric authentication
   * @returns {Promise<Object>} Result
   */
  const enableBiometric = useCallback(async () => {
    try {
      const result = await authContext.enableBiometric();
      
      Alert.alert(
        'Success',
        'Biometric authentication has been enabled.',
        [{ text: 'OK' }]
      );
      
      return result;
    } catch (error) {
      console.error('Enable biometric error:', error);
      
      Alert.alert(
        'Failed to Enable',
        error.message || 'Failed to enable biometric authentication.',
        [{ text: 'OK' }]
      );
      
      throw error;
    }
  }, [authContext]);

  /**
   * Disable biometric authentication
   * @returns {Promise<Object>} Result
   */
  const disableBiometric = useCallback(async () => {
    try {
      const result = await authContext.disableBiometric();
      
      Alert.alert(
        'Success',
        'Biometric authentication has been disabled.',
        [{ text: 'OK' }]
      );
      
      return result;
    } catch (error) {
      console.error('Disable biometric error:', error);
      
      Alert.alert(
        'Failed to Disable',
        error.messa