'use client';
import { useState } from 'react';
import { FaWallet } from 'react-icons/fa';

/**
 * User Signup Page Component
 * 
 * This component provides a user registration interface with wallet connection
 * functionality for creating new accounts on the Klaim platform. It implements
 * a simplified signup flow with username collection and MetaMask wallet
 * connection integration. The component includes proper loading states,
 * error handling, and navigation links to the login page for existing users.
 */
export default function Signup() {
    const [isConnecting, setIsConnecting] = useState(false);

    /**
     * Wallet connection handler for signup process.
     * 
     * This function manages MetaMask wallet connection during the signup
     * process including permission requests, connection state management,
     * and user feedback. It provides proper error handling for missing
     * MetaMask installations and connection failures while maintaining
     * loading states for better user experience.
     */
    const handleConnectWallet = async () => {
        setIsConnecting(true);
        try {
            if (typeof window !== 'undefined' && window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                alert('Wallet connected! (Mock mode)');
            } else {
                alert('Please install MetaMask');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-4 md:py-8 px-4 gap-4 md:gap-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-primary-text text-center">Signup</h1>
            <form className="flex flex-col gap-3 md:gap-4 w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Username" className="input input-bordered input-sm md:input-md w-full" />
                <button
                    onClick={handleConnectWallet}
                    type="button"
                    className={`btn btn-outline btn-sm md:btn-md w-full ${isConnecting ? 'loading' : ''}`}
                    disabled={isConnecting}
                >
                    <FaWallet className="w-4 h-4" />
                    {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
            </form>
            <div className="text-secondary-text font-300 text-sm md:text-base text-center">
                Already have an account?
                <a href="/login" className="text-main font-bold"> Login</a>
            </div>
        </div>
    );
}
