/**
 * Integration Test Script
 * Tests the complete client-backend-contract flow for the token faucet
 */

const { ethers } = require('ethers');

// Configuration
const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3001';
const RPC_URL = process.env.RPC_URL || 'https://testnet.storyrpc.io';
const IP_TOKEN_ADDRESS = process.env.IP_TOKEN_ADDRESS || '0xa67f0544f0B098B022f507620bb75abAb625c045';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

// Test wallet address (you can replace with your test wallet)
const TEST_WALLET = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

async function testBackendHealth() {
  logSection('1. Testing Backend Health');
  
  try {
    const response = await fetch(`${API_ENDPOINT}/`);
    if (response.ok) {
      logSuccess('Backend is running and accessible');
      return true;
    } else {
      logError(`Backend returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Cannot connect to backend: ${error.message}`);
    logWarning('Make sure the backend server is running on port 3001');
    return false;
  }
}

async function testBlockchainConnection() {
  logSection('2. Testing Blockchain Connection');
  
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const network = await provider.getNetwork();
    logSuccess(`Connected to blockchain: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Test block number
    const blockNumber = await provider.getBlockNumber();
    logInfo(`Current block number: ${blockNumber}`);
    
    return true;
  } catch (error) {
    logError(`Cannot connect to blockchain: ${error.message}`);
    return false;
  }
}

async function testTokenContract() {
  logSection('3. Testing Token Contract');
  
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // Check if contract exists
    const code = await provider.getCode(IP_TOKEN_ADDRESS);
    if (code === '0x') {
      logError('Token contract not found at specified address');
      logWarning(`Address: ${IP_TOKEN_ADDRESS}`);
      return false;
    }
    
    logSuccess('Token contract exists at specified address');
    logInfo(`Contract address: ${IP_TOKEN_ADDRESS}`);
    
    // Try to read token balance
    const tokenABI = [
      'function balanceOf(address account) view returns (uint256)',
      'function name() view returns (string)',
      'function symbol() view returns (string)',
    ];
    
    const contract = new ethers.Contract(IP_TOKEN_ADDRESS, tokenABI, provider);
    
    try {
      const name = await contract.name();
      const symbol = await contract.symbol();
      logSuccess(`Token: ${name} (${symbol})`);
    } catch (error) {
      logWarning('Could not read token name/symbol (contract might not be ERC20)');
    }
    
    // Test balance query
    const balance = await contract.balanceOf(TEST_WALLET);
    logInfo(`Test wallet balance: ${ethers.formatEther(balance)} tokens`);
    
    return true;
  } catch (error) {
    logError(`Token contract test failed: ${error.message}`);
    return false;
  }
}

async function testFaucetEligibilityEndpoint() {
  logSection('4. Testing Faucet Eligibility Endpoint');
  
  try {
    const response = await fetch(`${API_ENDPOINT}/faucet/eligibility/${TEST_WALLET}`);
    
    if (!response.ok) {
      logError(`Eligibility endpoint returned status ${response.status}`);
      const text = await response.text();
      logInfo(`Response: ${text}`);
      return false;
    }
    
    const data = await response.json();
    logSuccess('Eligibility endpoint is working');
    logInfo(`Eligible: ${data.eligible}, Has Claimed: ${data.hasClaimed}`);
    
    return true;
  } catch (error) {
    logError(`Eligibility endpoint test failed: ${error.message}`);
    return false;
  }
}

async function testBalanceEndpoint() {
  logSection('5. Testing Balance Endpoint');
  
  try {
    const response = await fetch(`${API_ENDPOINT}/faucet/balance/${TEST_WALLET}`);
    
    if (!response.ok) {
      logError(`Balance endpoint returned status ${response.status}`);
      const text = await response.text();
      logInfo(`Response: ${text}`);
      return false;
    }
    
    const data = await response.json();
    logSuccess('Balance endpoint is working');
    logInfo(`Balance: ${data.balance} tokens`);
    logInfo(`Address: ${data.address}`);
    
    return true;
  } catch (error) {
    logError(`Balance endpoint test failed: ${error.message}`);
    return false;
  }
}

async function testClaimEndpoint() {
  logSection('6. Testing Claim Endpoint (Dry Run)');
  
  logWarning('This test will attempt to claim tokens. Make sure:');
  logWarning('1. MongoDB is running');
  logWarning('2. DEPLOYER_PRIVATE_KEY is set in server/.env');
  logWarning('3. Deployer wallet has sufficient gas');
  
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
    
    if (response.ok) {
      logSuccess('Claim endpoint is working');
      logInfo(`Transaction Hash: ${data.transactionHash}`);
      logInfo(`Amount: ${data.amount} tokens`);
      logInfo(`New Balance: ${data.balance} tokens`);
      return true;
    } else {
      if (response.status === 400 && data.message?.includes('already claimed')) {
        logWarning('Test wallet has already claimed tokens (expected if run before)');
        logInfo('This is actually a good sign - duplicate claim prevention is working!');
        return true;
      } else {
        logError(`Claim endpoint returned status ${response.status}`);
        logInfo(`Response: ${JSON.stringify(data, null, 2)}`);
        return false;
      }
    }
  } catch (error) {
    logError(`Claim endpoint test failed: ${error.message}`);
    return false;
  }
}

async function testClientAPIFunctions() {
  logSection('7. Testing Client API Functions');
  
  logInfo('Checking if client API functions are properly exported...');
  
  const requiredFunctions = [
    'claimTokens',
    'checkEligibility',
    'getTokenBalance',
  ];
  
  try {
    // Read the client API file
    const fs = require('fs');
    const path = require('path');
    const apiPath = path.join(__dirname, 'client', 'utils', 'api.js');
    
    if (!fs.existsSync(apiPath)) {
      logError('Client API file not found');
      return false;
    }
    
    const apiContent = fs.readFileSync(apiPath, 'utf8');
    
    let allFound = true;
    for (const func of requiredFunctions) {
      if (apiContent.includes(`export async function ${func}`) || 
          apiContent.includes(`export function ${func}`)) {
        logSuccess(`Function '${func}' is exported`);
      } else {
        logError(`Function '${func}' is not exported`);
        allFound = false;
      }
    }
    
    return allFound;
  } catch (error) {
    logError(`Client API test failed: ${error.message}`);
    return false;
  }
}

async function testComponentIntegration() {
  logSection('8. Testing TokenFaucet Component');
  
  try {
    const fs = require('fs');
    const path = require('path');
    const componentPath = path.join(__dirname, 'client', 'components', 'TokenFaucet.js');
    
    if (!fs.existsSync(componentPath)) {
      logError('TokenFaucet component not found');
      return false;
    }
    
    const componentContent = fs.readFileSync(componentPath, 'utf8');
    
    // Check for key integrations
    const checks = [
      { pattern: /import.*claimTokens.*from/, message: 'Imports claimTokens from API' },
      { pattern: /import.*checkEligibility.*from/, message: 'Imports checkEligibility from API' },
      { pattern: /import.*getTokenBalance.*from/, message: 'Imports getTokenBalance from API' },
      { pattern: /walletAddress/, message: 'Uses walletAddress prop' },
      { pattern: /handleClaim/, message: 'Has claim handler function' },
      { pattern: /hasClaimed/, message: 'Tracks claim status' },
      { pattern: /balance/, message: 'Displays balance' },
    ];
    
    let allPassed = true;
    for (const check of checks) {
      if (check.pattern.test(componentContent)) {
        logSuccess(check.message);
      } else {
        logError(`Missing: ${check.message}`);
        allPassed = false;
      }
    }
    
    return allPassed;
  } catch (error) {
    logError(`Component integration test failed: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     TOKEN FAUCET INTEGRATION TEST SUITE                   ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  const results = {
    backendHealth: await testBackendHealth(),
    blockchainConnection: await testBlockchainConnection(),
    tokenContract: await testTokenContract(),
    eligibilityEndpoint: await testFaucetEligibilityEndpoint(),
    balanceEndpoint: await testBalanceEndpoint(),
    claimEndpoint: await testClaimEndpoint(),
    clientAPI: await testClientAPIFunctions(),
    componentIntegration: await testComponentIntegration(),
  };
  
  // Summary
  logSection('Test Summary');
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  console.log('\nResults:');
  for (const [test, result] of Object.entries(results)) {
    const status = result ? '✓ PASS' : '✗ FAIL';
    const color = result ? 'green' : 'red';
    log(`  ${status} - ${test}`, color);
  }
  
  console.log('\n' + '─'.repeat(60));
  
  if (passed === total) {
    logSuccess(`\nAll tests passed! (${passed}/${total})`);
    log('\n🎉 The client-backend-contract flow is working perfectly!', 'green');
  } else {
    logWarning(`\n${passed}/${total} tests passed`);
    log('\n⚠️  Some tests failed. Please review the errors above.', 'yellow');
  }
  
  console.log('\n');
}

// Run tests
runAllTests().catch(error => {
  logError(`\nFatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
