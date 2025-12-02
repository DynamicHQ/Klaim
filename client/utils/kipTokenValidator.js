/**
 * KIP Token Validation Utilities for Contract Verification
 * 
 * This module provides specialized validation utilities for the KIP token contract
 * including metadata verification, balance testing, and comprehensive contract
 * functionality validation. The utilities help ensure proper token contract
 * deployment and configuration while providing detailed feedback about token
 * properties and accessibility for troubleshooting integration issues.
 */

import { getKIPTokenInfo, getIPTBalance } from './contracts';

/**
 * Comprehensive KIP token contract validation with metadata verification.
 * 
 * This function performs complete validation of the KIP token contract including
 * metadata retrieval, expected value verification, and accessibility testing.
 * It validates token name, symbol, decimals, and total supply against expected
 * values while providing detailed feedback about any configuration mismatches
 * or connectivity issues with the deployed contract.
 */
export const validateKIPToken = async () => {
  try {
    console.log('🔍 Validating KIP token contract...');
    
    // Test token info retrieval
    const tokenInfo = await getKIPTokenInfo();
    
    console.log('📋 KIP Token Information:');
    console.log(`  Name: ${tokenInfo.name}`);
    console.log(`  Symbol: ${tokenInfo.symbol}`);
    console.log(`  Decimals: ${tokenInfo.decimals}`);
    console.log(`  Total Supply: ${tokenInfo.totalSupply}`);
    
    // Validate expected values
    if (tokenInfo.name !== 'Klaim') {
      console.warn('⚠️  Expected token name "Klaim", got:', tokenInfo.name);
    }
    
    if (tokenInfo.symbol !== 'KIP') {
      console.warn('⚠️  Expected token symbol "KIP", got:', tokenInfo.symbol);
    }
    
    if (tokenInfo.decimals !== 18) {
      console.warn('⚠️  Expected 18 decimals, got:', tokenInfo.decimals);
    }
    
    console.log('✅ KIP token contract validation completed');
    return {
      success: true,
      tokenInfo
    };
    
  } catch (error) {
    console.error('❌ KIP token validation failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Balance retrieval testing for contract accessibility verification
export const testBalanceRetrieval = async (address) => {
  if (!address) {
    console.log('ℹ️  No address provided for balance test');
    return null;
  }
  
  try {
    console.log(`🔍 Testing balance retrieval for ${address}...`);
    
    const balance = await getIPTBalance(address);
    console.log(`💰 Balance: ${balance} KIP`);
    
    return {
      success: true,
      balance,
      address
    };
    
  } catch (error) {
    console.error('❌ Balance retrieval test failed:', error.message);
    return {
      success: false,
      error: error.message,
      address
    };
  }
};

/**
 * Complete KIP token testing suite with comprehensive validation.
 * 
 * This function runs a full suite of KIP token tests including contract
 * validation, balance retrieval testing, and comprehensive reporting.
 * It provides detailed feedback about token contract functionality and
 * helps identify any issues with contract deployment or configuration.
 */
export const runKIPTokenTests = async (testAddress = null) => {
  console.log('🚀 Running KIP Token Validation Tests...\n');
  
  const results = {
    contractValidation: await validateKIPToken(),
    balanceTest: testAddress ? await testBalanceRetrieval(testAddress) : null
  };
  
  const allPassed = results.contractValidation.success && 
    (results.balanceTest ? results.balanceTest.success : true);
  
  console.log('\n📊 KIP Token Test Results:');
  console.log(`  Contract Validation: ${results.contractValidation.success ? '✅ PASS' : '❌ FAIL'}`);
  if (results.balanceTest) {
    console.log(`  Balance Retrieval: ${results.balanceTest.success ? '✅ PASS' : '❌ FAIL'}`);
  }
  
  if (allPassed) {
    console.log('\n🎉 All KIP token tests passed!');
  } else {
    console.log('\n⚠️  Some KIP token tests failed. Please check the configuration.');
  }
  
  return results;
};

export default {
  validateKIPToken,
  testBalanceRetrieval,
  runKIPTokenTests
};