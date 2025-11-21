/**
 * Integration Test for Token Faucet Flow
 * Tests: Client -> Backend -> Contract
 */

const { ethers } = require('ethers');

// Configuration
const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3001';
const RPC_URL = process.env.RPC_URL || 'https://testnet.storyrpc.io';
const IP_TOKEN_ADDRESS = process.env.IP_TOKEN_ADDRESS || '0xa67f0544f0B098B022f507620bb75abAb625c045';

// Test wallet address (you can use any valid address for testing)
const TEST_WALLET = process.env.TEST_WALLET || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

const ipTokenABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
];

async function testContractConnection() {
  console.log('\n=== Testing Contract Connection ===');
  
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(IP_TOKEN_ADDRESS, ipTokenABI, provider);
    
    // Test contract methods
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    
    console.log('✅ Contract connected successfully');
    console.log(`   Token Name: ${name}`);
    console.log(`   Token Symbol: ${symbol}`);
    console.log(`   Decimals: ${decimals}`);
    
    return true;
  } catch (error) {
    console.error('❌ Contract connection failed:', error.message);
    return false;
  }
}

async function testBackendHealth() {
  console.log('\n=== Testing Backend Health ===');
  
  try {
    const response = await fetch(`${API_ENDPOINT}/`);
    
    if (response.ok) {
      console.log('✅ Backend is running');
      return true;
    } else {
      console.error('❌ Backend returned error:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.log('   Make sure the backend server is running on port 3001');
    return false;
  }
}

async function testEligibilityEndpoint() {
  console.log('\n=== Testing Eligibility Endpoint ===');
  
  try {
    const response = await fetch(`${API_ENDPOINT}/faucet/eligibility/${TEST_WALLET}`);
    
    if (!response.ok) {
      console.error('❌ Eligibility check failed:', response.status);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ Eligibility endpoint working');
    console.log(`   Eligible: ${data.eligible}`);
    console.log(`   Has Claimed: ${data.hasClaimed}`);
    
    return true;
  } catch (error) {
    console.error('❌ Eligibility check failed:', error.message);
    return false;
  }
}

async function testBalanceEndpoint() {
  console.log('\n=== Testing Balance Endpoint ===');
  
  try {
    const response = await fetch(`${API_ENDPOINT}/faucet/balance/${TEST_WALLET}`);
    
    if (!response.ok) {
      console.error('❌ Balance check failed:', response.status);
      const errorText = await response.text();
      console.error('   Error:', errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ Balance endpoint working');
    console.log(`   Address: ${data.address}`);
    console.log(`   Balance: ${data.balance} KIP`);
    
    return true;
  } catch (error) {
    console.error('❌ Balance check failed:', error.message);
    return false;
  }
}

async function testClaimEndpoint() {
  console.log('\n=== Testing Claim Endpoint (Dry Run) ===');
  console.log('⚠️  Note: This will attempt to claim tokens. Make sure:');
  console.log('   1. DEPLOYER_PRIVATE_KEY is set in server/.env');
  console.log('   2. Deployer wallet has sufficient gas');
  console.log('   3. Test wallet has not claimed before');
  
  try {
    const response = await fetch(`${API_ENDPOINT}/faucet/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: TEST_WALLET,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 400 && data.message?.includes('already claimed')) {
        console.log('ℹ️  Wallet has already claimed (expected if testing multiple times)');
        console.log('   Use a different TEST_WALLET address to test claiming');
        return true;
      }
      
      console.error('❌ Claim failed:', response.status);
      console.error('   Error:', data.message || JSON.stringify(data));
      return false;
    }
    
    console.log('✅ Claim endpoint working');
    console.log(`   Transaction Hash: ${data.transactionHash}`);
    console.log(`   Amount: ${data.amount} KIP`);
    console.log(`   New Balance: ${data.balance} KIP`);
    
    return true;
  } catch (error) {
    console.error('❌ Claim test failed:', error.message);
    return false;
  }
}

async function testClientAPIFunctions() {
  console.log('\n=== Testing Client API Functions ===');
  
  // Simulate client-side API calls
  const clientAPI = {
    async checkEligibility(walletAddress) {
      const response = await fetch(`${API_ENDPOINT}/faucet/eligibility/${walletAddress}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    
    async getTokenBalance(walletAddress) {
      const response = await fetch(`${API_ENDPOINT}/faucet/balance/${walletAddress}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    
    async claimTokens(walletAddress) {
      const response = await fetch(`${API_ENDPOINT}/faucet/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Claim failed');
      }
      return response.json();
    },
  };
  
  try {
    // Test eligibility check
    const eligibility = await clientAPI.checkEligibility(TEST_WALLET);
    console.log('✅ Client eligibility check works');
    
    // Test balance query
    const balance = await clientAPI.getTokenBalance(TEST_WALLET);
    console.log('✅ Client balance query works');
    
    console.log('\nClient API functions are working correctly');
    return true;
  } catch (error) {
    console.error('❌ Client API test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     Token Faucet Integration Test Suite                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const results = {
    contract: await testContractConnection(),
    backend: await testBackendHealth(),
    eligibility: await testEligibilityEndpoint(),
    balance: await testBalanceEndpoint(),
    clientAPI: await testClientAPIFunctions(),
    claim: await testClaimEndpoint(),
  };
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    Test Results Summary                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${test.charAt(0).toUpperCase() + test.slice(1)} Test`);
  });
  
  const allPassed = Object.values(results).every(r => r);
  
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('🎉 All tests passed! The integration is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }
  console.log('='.repeat(60) + '\n');
  
  process.exit(allPassed ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
