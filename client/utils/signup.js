import { ethers } from "ethers";
import { syncWallet } from '@/utils/api';

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

    // Sync wallet with backend using the standard endpoint
    try {
      const resp = await syncWallet(address);
      return { success: true, address, resp };
    } catch (err) {
      console.error('Failed to sync wallet in signup:', err);
      // Return but still provide address so UI can proceed
      return { success: true, address, syncError: err?.message || String(err) };
    }

  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: error?.message || String(error) };
  }
}