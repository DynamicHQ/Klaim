/**
 * System Validation Utilities for Configuration and Environment Checks
 * 
 * This module provides comprehensive validation utilities for ensuring proper
 * system configuration including environment variables, wallet connectivity,
 * and contract address validation. The utilities help identify configuration
 * issues early and provide clear feedback for troubleshooting deployment
 * and development environment problems.
 */

/**
 * Environment variable validation for required configuration.
 * 
 * This function checks that all necessary environment variables are properly
 * configured for the application to function correctly. It validates the
 * presence of contract addresses and other critical configuration values
 * required for blockchain integration and provides clear feedback about
 * missing configuration items.
 */
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_IP_CREATOR_ADDRESS',
    'NEXT_PUBLIC_IP_MARKETPLACE_ADDRESS', 
    'NEXT_PUBLIC_IP_TOKEN_ADDRESS',
    'NEXT_PUBLIC_NFT_CONTRACT_ADDRESS'
  ];

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing environment variables:', missing);
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
};

// Wallet provider detection for MetaMask availability checking
export const validateWalletConnection = () => {
  if (typeof window === 'undefined') {
    console.log('ℹ️  Running in server environment, skipping wallet validation');
    return true;
  }

  if (!window.ethereum) {
    console.warn('⚠️  MetaMask not detected');
    return false;
  }

  console.log('✅ Wallet provider detected');
  return true;
};

// Ethereum address format validation for contract configuration
export const validateContractAddresses = () => {
  const addresses = {
    IP_CREATOR: process.env.NEXT_PUBLIC_IP_CREATOR_ADDRESS,
    IP_MARKETPLACE: process.env.NEXT_PUBLIC_IP_MARKETPLACE_ADDRESS,
    IP_TOKEN: process.env.NEXT_PUBLIC_IP_TOKEN_ADDRESS,
    NFT_CONTRACT: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
  };

  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  
  for (const [name, address] of Object.entries(addresses)) {
    if (address && !ethereumAddressRegex.test(address)) {
      console.warn(`⚠️  Invalid address format for ${name}: ${address}`);
      return false;
    }
  }

  console.log('✅ Contract addresses have valid format');
  return true;
};

/**
 * Comprehensive system validation runner with detailed reporting.
 * 
 * This function executes all validation checks and provides a comprehensive
 * report of system readiness including environment configuration, wallet
 * connectivity, and contract address validation. It helps identify and
 * troubleshoot configuration issues during development and deployment.
 */
export const runSystemValidation = () => {
  console.log('🔍 Running system validation checks...\n');
  
  const checks = {
    environment: validateEnvironment(),
    walletConnection: validateWalletConnection(),
    contractAddresses: validateContractAddresses()
  };
  
  const passedChecks = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;
  
  console.log(`\n📋 Validation Results: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 System validation completed successfully!');
  } else {
    console.log('⚠️  Some validation checks failed. Please review the configuration.');
  }
  
  return checks;
};

export default {
  validateEnvironment,
  validateWalletConnection,
  validateContractAddresses,
  runSystemValidation
};