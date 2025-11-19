'use client';
import { FaWallet } from 'react-icons/fa';

export default function Signup() {
    const { connectWallet, isConnecting } = useWallet();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-6">
            <h1 className="text-4xl font-bold mb-6 text-primary-text">Signup</h1>
            <form className="flex flex-col gap-4 w-80" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Username" className="input input-bordered" />
                <button
                    onClick={connectWallet}
                    type="button"
                    className={`btn btn-outline btn-sm ${isConnecting ? 'loading' : ''}`}
                    disabled={isConnecting}
                >
                    <FaWallet className="w-4 h-4" />
                    {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
            </form>
            <div className="text-secondary-text font-300">Already have an account?<a href="/login" className="text-main font-bold">Login</a></div>
        </div>
    );
}
