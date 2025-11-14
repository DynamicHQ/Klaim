// test-login.js - Modified for Signature Generation

const { Wallet } = require('ethers');

// 🚨 IMPORTANT: Use the private key corresponding to the test wallet address.
const PRIVATE_KEY = "10d5c166be9a04f7334407dd8fedf44c1e67ac1b9cc703515b9579e275a5f613";

// 👈 PASTE THE NONCE YOU JUST RECEIVED FROM YOUR BACKEND HERE
const NONCE_FROM_SERVER = "7ce0eb57feb9a49fc9e2d196439858b7b0e214fe42a757257dce62a263d2a3fe"; 

async function generateSignature() {
    console.log('--- SIGNATURE GENERATION ---');
    
    // CRITICAL: The message MUST exactly match the server's expected format
    const messageToSign = `Welcome to Klaimit! Sign this nonce to login: ${NONCE_FROM_SERVER}`;
    
    // Generate the signature
    const wallet = new Wallet(PRIVATE_KEY);
    const signature = await wallet.signMessage(messageToSign);

    console.log('\n--- INPUTS FOR POSTMAN ---');
    console.log(`WALLET: ${wallet.address}`);
    console.log(`SIGNATURE: ${signature}`);
}

generateSignature();