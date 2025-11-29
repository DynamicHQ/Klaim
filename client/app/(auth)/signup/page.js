'use client';
import { useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Signup() {
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { wallet, connectWallet, signup } = useAuth();

    const handleConnectWallet = async () => {
        setError(null);
        try {
            await connectWallet();
        } catch (err) {
            console.error('Failed to connect wallet:', err);
            setError(err?.message || 'Failed to connect wallet.');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        
        if (!wallet) {
            setError('Please connect your wallet first');
            return;
        }

        setIsSigningUp(true);
        setError(null);

        try {
            await signup();
            router.push('/');
        } catch (err) {
            console.error('Signup error:', err);
            
            // Handle specific error cases
            if (err?.message && err.message.includes('already registered')) {
                setError('This wallet is already registered. Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(err?.message || 'Failed to sign up');
            }
        } finally {
            setIsSigningUp(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 pt-20">
            <div className="flex flex-col items-center justify-center min-h-[80vh] py-2 gap-6">
                <div className="card bg-base-100 shadow-xl w-full max-w-md">
                    <div className="card-body">
                        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
                        
                        {error && (
                            <div className="alert alert-error mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}
                        
                        {isSigningUp && (
                            <div className="alert alert-info mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Please check your wallet to sign the message...</span>
                            </div>
                        )}
                        
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Wallet Connection</span>
                                </label>
                                {wallet ? (
                                    <div className="alert alert-success">
                                        <FaWallet />
                                        <span>Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleConnectWallet}
                                        type="button"
                                        className="btn btn-outline w-full"
                                    >
                                        <FaWallet className="w-4 h-4 mr-2" />
                                        Connect Wallet
                                    </button>
                                )}
                            </div>

                            <button 
                                type="submit"
                                className={`btn btn-primary w-full ${isSigningUp ? 'loading' : ''}`}
                                disabled={!wallet || isSigningUp}
                            >
                                {isSigningUp ? 'Signing up...' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <p className="text-sm text-base-content/70">
                                Already have an account?
                                <a href="/login" className="link link-primary font-semibold ml-1">
                                    Login
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
