'use client';

import { useState, useEffect } from 'react';
import Link from "next/link"
import Image from "next/image"
import { FaUser, FaStore, FaInfoCircle, FaQuestionCircle, FaSignOutAlt, FaWallet, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { useAccount } from 'wagmi';
import { useAuth } from '@/contexts/AuthContext';
import { useKIPBalance } from '@/hooks/useKIPBalance';

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { logout } = useAuth();
  const [theme, setTheme] = useState('light');
  const { formattedBalance, loading: balanceLoading, error: balanceError } = useKIPBalance(address);

  useEffect(() => {
    // Load theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const handleDisconnect = () => {
    logout();
  };

  // Toggle theme and save to localStorage
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  
  return (
    <div className="navbar bg-base-100/95 shadow-sm fixed top-0 z-1000 h-5 my-auto">
      <div className="flex-1">
        <Link href="/">
            <Image src="/logo.png" height={24} width={150} alt="Logo" />
        </Link>
      </div>
      <div className="flex gap-2 md:gap-4">
        {!isConnected ? (
          <Link 
            href="/login"
            className="px-8 py-4 btn outline-main text-main btn-outline btn-md rounded-md hover:bg-main hover:text-white"
          >
            <FaWallet className="w-4 h-4" />
            Get Started
          </Link>
        ) : (
          <div className="flex items-center gap-1 md:gap-2">
            {/* KIP Balance Display */}
            <div 
              className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 bg-primary/10 rounded-lg"
              role="status"
              aria-label={balanceLoading ? 'Loading KIP balance' : `KIP balance: ${formattedBalance || '0'}`}
            >
              {balanceLoading ? (
                <FaSpinner 
                  className="animate-spin text-primary w-3 h-3" 
                  aria-hidden="true"
                />
              ) : balanceError ? (
                <FaExclamationTriangle 
                  className="text-warning w-3 h-3" 
                  title={balanceError}
                  aria-label={`Balance error: ${balanceError}`}
                />
              ) : (
                <span 
                  className="text-primary font-semibold text-xs md:text-sm"
                  aria-label={`KIP token balance: ${formattedBalance || '0'}`}
                >
                  {formattedBalance || '0'} KIP
                </span>
              )}
            </div>
            
            {/* Wallet Address */}
            <div 
              className="badge badge-success px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm"
              role="status"
              aria-label={`Connected wallet address: ${address}`}
            >
              <span className="hidden sm:inline">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              <span className="sm:hidden">{address?.slice(0, 4)}...{address?.slice(-2)}</span>
            </div>
          </div>
        )}
        
        <label className="swap swap-rotate cursor-pointer">
          <input 
            type="checkbox" 
            checked={theme === 'dark'}
            onChange={handleThemeToggle}
            className="hidden"
          />
          {/* Sun icon - shows when dark mode is OFF (light mode) */}
          <svg
            className={`swap-off h-8 w-8 fill-current ${theme === 'dark' ? 'hidden' : 'block'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          {/* Moon icon - shows when dark mode is ON */}
          <svg
            className={`swap-on h-8 w-8 fill-current ${theme === 'dark' ? 'block' : 'hidden'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
    
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar my-auto">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
        </div>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow md:w-100 md:menu-md">
        <li>
          <a href="/profile">
           <div className="flex items-center gap-2">
              <FaUser />
              Profile
            </div>
          </a>
        </li>
        <li>
          <a href="/marketplace">
            <div className="flex items-center gap-2">
              <FaStore />
              Marketplace
            </div>
          </a>
        </li>
        <li>
          <a href="/docs">
            <div className="flex items-center gap-2">
              <FaInfoCircle />
              Docs
            </div>
          </a>
        </li>
        <li>
          <a href="/FAQs">
            <div className="flex items-center gap-2">
              <FaQuestionCircle />
              FAQs
            </div>
          </a>
        </li>
        {isConnected && (
          <li>
            <a onClick={handleDisconnect}>
              <div className="flex items-center gap-2">
                <FaSignOutAlt />
                Disconnect
              </div>
            </a>
          </li>
        )}
      </ul>
    </div>
  </div>
    </div>
  )
}
