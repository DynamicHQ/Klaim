// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check if auth state is resolved

  // This effect could check if a user is already logged in (e.g., via a JWT)
  useEffect(() => {
    // Check for existing session token in localStorage/cookies
    // ... (logic to verify token with backend)
    // For now, we'll just start as logged out.
    setLoading(false);
  }, []);

  const connectAndSignIn = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      // 1. Get provider and signer
      // A "Provider" is a read-only connection to the blockchain
      // A "Signer" is an object that can sign transactions and messages
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Prompts user to connect
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // 2. Get challenge message from our backend
      const response = await fetch(`/api/auth/challenge?address=${walletAddress}`);
      const { messageToSign } = await response.json();

      if (!messageToSign) {
        throw new Error("Could not get message to sign.");
      }

      // 3. User signs the message
      const signature = await signer.signMessage(messageToSign);

      // 4. Send signature, address, and message to backend for verification
      const verifyResponse = await fetch(`/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, message: messageToSign, signature }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok) {
        // We get back the user object (or a JWT)
        setUser(verifyData.user);
        // You would typically store the received JWT token here
        // localStorage.setItem('token', verifyData.token);
      } else {
        throw new Error(verifyData.error || "Verification failed.");
      }

    } catch (error) {
      console.error("Error signing in:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const logout = () => {
    // localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, connect: connectAndSignIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);