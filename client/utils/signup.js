import { ethers } from "ethers";

export default async function handleSignup(e) {
  // If called as an event handler, prevent default submit behavior
  if (e && typeof e.preventDefault === 'function') e.preventDefault();

  try {
    // Ensure we're running in the browser and MetaMask is available
    if (typeof window === 'undefined' || typeof window.ethereum === "undefined") {
      return { success: false, error: "Please install MetaMask Extension to continue" };
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Get provider and signer
    const provider = new ethers.providers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    
    // Get wallet address
    const address = await signer.getAddress();

    // Store wallet address in localStorage
    if (typeof localStorage !== 'undefined') localStorage.setItem('walletAddress', address);

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
    return { success: false, error: error?.message || String(error) };
  }
}