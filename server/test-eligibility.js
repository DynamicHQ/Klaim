/**
 * Manual test script for the eligibility endpoint
 * Run this after starting the server to verify the endpoint works
 */

const testAddress = '0x1234567890123456789012345678901234567890';

async function testEligibilityEndpoint() {
  try {
    const response = await fetch(`http://localhost:3001/faucet/eligibility/${testAddress}`);
    const data = await response.json();
    
    console.log('✅ Eligibility endpoint test:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    // Verify response structure
    if (data.hasOwnProperty('eligible') && data.hasOwnProperty('hasClaimed')) {
      console.log('✅ Response has correct structure');
    } else {
      console.log('❌ Response missing required fields');
    }
    
    // For a new address, should be eligible
    if (data.eligible === true && data.hasClaimed === false) {
      console.log('✅ New address correctly marked as eligible');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run if executed directly
if (require.main === module) {
  testEligibilityEndpoint();
}

module.exports = { testEligibilityEndpoint };
