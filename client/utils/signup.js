"use server"
import { ethers } from "ethers";

export default async function handleSignup() {
  try {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      throw new Error("Please install MetaMask Extension to continue");
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Get provider and signer
    const provider = new ethers.providers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    
    // Get wallet address
    const address = await signer.getAddress();

    // Store wallet address in localStorage
    localStorage.setItem('walletAddress', address);

    // Send wallet address to API
    // Note: API endpoint should be configured in .env
    const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
    
    const response = await fetch(`${API_ENDPOINT}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: address
      })
    });

    if (!response.ok) {
      throw new Error('Failed to register wallet');
    }

    return { success: true, address };

  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: error.message };
  }
}