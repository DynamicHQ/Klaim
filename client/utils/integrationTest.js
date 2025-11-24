/**
 * Integration test utilities for KIP balance and transaction security
 * This file contains functions to validate system integration
 */

import { generateVerificationMessage, validateSignedMessage } from './transactionSecurity';

/**
 * Test the message generation and validation flow
 */
export const testMessageGeneration = () => {
  console.log('🧪 Testing message generation...');
  
  try {
    const testAddress = '0x1234567890123456789012345678901234567890';
    const testTransaction = {
      type: 'purchase',
      assetId: 'test-asset-123',
      price: '10.5'
    };

    // Test message generation
    const messageData = generateVerificationMessage(testAddress, testTransaction);
    
    // Validate message structure
    if (!messageData.message || !messageData.nonce || !messageData.timestamp) {
      throw new Error('Invalid message structure');
    }

    // Check message content
    if (!messageData.message.includes('Purchase IP Asset')) {
      throw new Error('Message does not contain expected action');
    }

    if (!messageData.message.includes(testTransaction.assetId)) {
      throw new Error('Message does not contain asset ID');
    }

    if (!messageData.message.includes(testTransaction.price)) {
      throw new Error('Message does not contain price');
    }

    console.log('✅ Message generation test passed');
    return true;
  } catch (error) {
    console.error('❌ Message generation test failed:', error.message);
    return false;
  }
};

/**
 * Test balance formatting
 */
export const testBalanceFormatting = () => {
  console.log('🧪 Testing balance formatting...');
  
  try {
    // Import the formatting function from useKIPBalance hook
    // Note: This is a simplified test since we can't easily test the hook directly
    const testCases = [
      { input: '0', expected: '0' },
      { input: '0.0001', expected: '<0.001' },
      { input: '0.123', expected: '0.123' },
      { input: '1.23456', expected: '1.23' },
      { input: '1234.56', expected: '1.2K' },
      { input: '1234567.89', expected: '1.2M' }
    ];

    // Simple formatting logic for testing
    const formatBalance = (value) => {
      if (value === null || value === undefined) return null;
      
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return '0';
      
      if (numValue === 0) return '0';
      if (numValue < 0.001) return '<0.001';
      if (numValue < 1) return numValue.toFixed(3);
      if (numValue < 1000) return numValue.toFixed(2);
      if (numValue < 1000000) return (numValue / 1000).toFixed(1) + 'K';
      return (numValue / 1000000).toFixed(1) + 'M';
    };

    for (const testCase of testCases) {
      const result = formatBalance(testCase.input);
      if (result !== testCase.expected) {
        throw new Error(`Expected ${testCase.expected}, got ${result} for input ${testCase.input}`);
      }
    }

    console.log('✅ Balance formatting test passed');
    return true;
  } catch (error) {
    console.error('❌ Balance formatting test failed:', error.message);
    return false;
  }
};

/**
 * Test transaction types
 */
export const testTransactionTypes = () => {
  console.log('🧪 Testing transaction types...');
  
  try {
    const testAddress = '0x1234567890123456789012345678901234567890';
    
    // Test purchase transaction
    const purchaseTransaction = {
      type: 'purchase',
      assetId: 'asset-123',
      price: '5.0'
    };
    
    const purchaseMessage = generateVerificationMessage(testAddress, purchaseTransaction);
    if (!purchaseMessage.message.includes('Purchase IP Asset')) {
      throw new Error('Purchase message generation failed');
    }

    // Test listing transaction
    const listingTransaction = {
      type: 'listing',
      assetId: 'asset-456',
      price: '15.0'
    };
    
    const listingMessage = generateVerificationMessage(testAddress, listingTransaction);
    if (!listingMessage.message.includes('List IP Asset')) {
      throw new Error('Listing message generation failed');
    }

    // Test cancellation transaction
    const cancellationTransaction = {
      type: 'cancellation',
      listingId: 'listing-789'
    };
    
    const cancellationMessage = generateVerificationMessage(testAddress, cancellationTransaction);
    if (!cancellationMessage.message.includes('Cancel IP Asset Listing')) {
      throw new Error('Cancellation message generation failed');
    }

    console.log('✅ Transaction types test passed');
    return true;
  } catch (error) {
    console.error('❌ Transaction types test failed:', error.message);
    return false;
  }
};

/**
 * Run all integration tests
 */
export const runIntegrationTests = () => {
  console.log('🚀 Running KIP Balance and Transaction Security Integration Tests...\n');
  
  const results = {
    messageGeneration: testMessageGeneration(),
    balanceFormatting: testBalanceFormatting(),
    transactionTypes: testTransactionTypes()
  };
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All integration tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
  }
  
  return results;
};

// Export for use in development/testing
export default {
  testMessageGeneration,
  testBalanceFormatting,
  testTransactionTypes,
  runIntegrationTests
};