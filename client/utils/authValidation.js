/**
 * Auth Flow Validation Utilities
 * 
 * This module provides utilities to validate the authentication flow
 * and help debug common issues with signup and login.
 */

import { isMetaMaskInstalled, connectMetaMask, signMessage } from './wallet';
import { signupUser, authenticateWithSignature } from './api';

/**
 * Validate MetaMask installation and connection
 * @returns {Promise<Object>} Validation result
 */
export async function validateWalletConnection() {
  const result = {
    success: false,
    errors: [],
    warnings: [],
    walletAddress: null
  };

  try {
    // Check MetaMask installation
    if (!isMetaMaskInstalled()) {
      result.errors.push('MetaMask is not installed');
      return result;
    }

    // Try to connect
    const walletAddress = await connectMetaMask();
    result.walletAddress = walletAddress;
    result.success = true;

    console.log('✅ Wallet connection successful:', walletAddress);
    
  } catch (error) {
    result.errors.push(`Wallet connection failed: ${error.message}`);
    console.error('❌ Wallet connection failed:', error);
  }

  return result;
}

/**
 * Validate message signing
 * @param {string} walletAddress - Wallet address to sign with
 * @returns {Promise<Object>} Validation result
 */
export async function validateMessageSigning(walletAddress) {
  const result = {
    success: false,
    errors: [],
    signature: null
  };

  try {
    const message = "Welcome to Klaimit! Sign this message to login.";
    const signature = await signMessage(message);
    
    result.signature = signature;
    result.success = true;

    console.log('✅ Message signing successful');
    console.log('Message:', message);
    console.log('Signature:', signature);
    
  } catch (error) {
    result.errors.push(`Message signing failed: ${error.message}`);
    console.error('❌ Message signing failed:', error);
  }

  return result;
}

/**
 * Validate signup flow
 * @param {string} walletAddress - Wallet address to signup with
 * @returns {Promise<Object>} Validation result
 */
export async function validateSignup(walletAddress) {
  const result = {
    success: false,
    errors: [],
    warnings: [],
    response: null
  };

  try {
    const response = await signupUser(walletAddress, walletAddress);
    result.response = response;
    result.success = true;

    console.log('✅ Signup successful:', response);
    
  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      result.warnings.push('User already exists - this is expected if testing multiple times');
      result.success = true; // Not really an error for testing
    } else {
      result.errors.push(`Signup failed: ${error.message}`);
    }
    console.log('Signup result:', error.message);
  }

  return result;
}

/**
 * Validate login flow
 * @param {string} walletAddress - Wallet address to login with
 * @param {string} signature - Signature to authenticate with
 * @returns {Promise<Object>} Validation result
 */
export async function validateLogin(walletAddress, signature) {
  const result = {
    success: false,
    errors: [],
    token: null
  };

  try {
    const response = await authenticateWithSignature(walletAddress, signature);
    result.token = response.access_token;
    result.success = true;

    console.log('✅ Login successful, token received');
    
  } catch (error) {
    result.errors.push(`Login failed: ${error.message}`);
    console.error('❌ Login failed:', error);
  }

  return result;
}

/**
 * Run complete auth flow validation
 * @returns {Promise<Object>} Complete validation result
 */
export async function validateCompleteAuthFlow() {
  console.log('🔍 Starting complete auth flow validation...\n');

  const results = {
    overall: false,
    steps: {}
  };

  // Step 1: Validate wallet connection
  console.log('Step 1: Validating wallet connection...');
  const walletResult = await validateWalletConnection();
  results.steps.wallet = walletResult;

  if (!walletResult.success) {
    console.log('❌ Cannot proceed without wallet connection\n');
    return results;
  }

  const walletAddress = walletResult.walletAddress;

  // Step 2: Validate message signing
  console.log('\nStep 2: Validating message signing...');
  const signingResult = await validateMessageSigning(walletAddress);
  results.steps.signing = signingResult;

  if (!signingResult.success) {
    console.log('❌ Cannot proceed without message signing\n');
    return results;
  }

  // Step 3: Validate signup
  console.log('\nStep 3: Validating signup...');
  const signupResult = await validateSignup(walletAddress);
  results.steps.signup = signupResult;

  // Step 4: Validate login
  console.log('\nStep 4: Validating login...');
  const loginResult = await validateLogin(walletAddress, signingResult.signature);
  results.steps.login = loginResult;

  // Overall success
  results.overall = walletResult.success && 
                   signingResult.success && 
                   signupResult.success && 
                   loginResult.success;

  console.log('\n🎯 Validation Summary:');
  console.log('Wallet Connection:', walletResult.success ? '✅' : '❌');
  console.log('Message Signing:', signingResult.success ? '✅' : '❌');
  console.log('Signup:', signupResult.success ? '✅' : '❌');
  console.log('Login:', loginResult.success ? '✅' : '❌');
  console.log('Overall:', results.overall ? '✅ All tests passed!' : '❌ Some tests failed');

  return results;
}

/**
 * Quick auth test for debugging
 * Call this from browser console: window.testAuth()
 */
export function setupAuthTest() {
  if (typeof window !== 'undefined') {
    // Import server ping functions
    import('./api').then(({ pingServer, pingSingleRoute }) => {
      window.testAuth = validateCompleteAuthFlow;
      window.testWallet = validateWalletConnection;
      window.testSigning = () => {
        validateWalletConnection().then(result => {
          if (result.success) {
            return validateMessageSigning(result.walletAddress);
          }
        });
      };
      window.testServer = pingServer;
      window.testRoute = pingSingleRoute;
      window.testQuick = () => pingSingleRoute('/assets');
      
      console.log('🔧 Testing functions available:');
      console.log('- window.testAuth() - Run complete auth flow test');
      console.log('- window.testWallet() - Test wallet connection only');
      console.log('- window.testSigning() - Test wallet + signing');
      console.log('- window.testServer() - Test all server routes');
      console.log('- window.testRoute("/path") - Test single route');
      console.log('- window.testQuick() - Quick server test');
    });
  }
}

export default {
  validateWalletConnection,
  validateMessageSigning,
  validateSignup,
  validateLogin,
  validateCompleteAuthFlow,
  setupAuthTest
};