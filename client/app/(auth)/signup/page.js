'use client';
import { useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { connectMetaMask, signMessage } from '@/utils/wallet';
import { syncWallet } from '@/utils/api';

/*
 * User Signup Page Component
 * This component provides a user registration interface with wallet connection
 * functionality for creating new accounts on the Klaim platform. It implements
 * a simplified signup flow with username collection and MetaMask wallet
 * connection integration. The component includes proper loading states,
 * error handling, and navigation links to the login page for existing users.
 */
export default function Signup() {
    const [isConnecting, setIsConnecting] = useState(false);
    const router = useRouter();

    /*
     * Wallet connection handler for signup process.
     * This function manages MetaMask wallet connection during the signup
     * process including permission requests, connection state management,
     * and user feedback. It provides proper error handling for missing
     * MetaMask installations and connection failures while maintaining
     * loading states for better user experience.
     */
    const handleConnectWallet = async () => {
        setIsConnecting(true);

        try {
            // 1) request connection and get address
            const address = await connectMetaMask();

            // 2) sign a lightweight message to verify user's intent
            try {
                await signMessage('Sign up to Klaim');
            } catch (signErr) {
                console.warn('User declined to sign message at signup:', signErr?.message || signErr);
                // Not fatal for signup — continue to sync wallet
            }

            // 3) inform backend about the wallet address (sync /users/sync-wallet)
            try {
                await syncWallet(address);
            } catch (syncErr) {
                // Keep going but show a warning in console
                console.error('Failed to sync wallet with backend:', syncErr);
            }

            // store address locally for convenience
            try {
                localStorage.setItem('walletAddress', address);
            } catch (e) {
                /* ignore in SSR or when storage blocked */
            }

            // finally navigate to home page
            router.push('/');
        } catch (err) {
            console.error('Failed to connect MetaMask during signup:', err);
            // Consider showing user-facing UI errors — keep console for now
            alert(err?.message || 'Failed to connect wallet.');
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
