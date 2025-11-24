'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaSpinner, FaLock } from 'react-icons/fa';

/**
 * Authentication Gate Component for Protected Routes
 * 
 * This component provides authentication protection for sensitive pages
 * by checking user authentication status and redirecting unauthenticated
 * users to the login page. It features loading states during authentication
 * checks, automatic redirection for unauthorized access, and fallback
 * interfaces for unauthenticated users. The component ensures secure
 * access control while providing smooth user experience transitions.
 */
export default function AuthGate({ children }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, wallet } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 pt-20 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base-200 pt-20 flex items-center justify-center">
        <div className="card bg-base-100 shadow-xl max-w-md">
          <div className="card-body text-center">
            <FaLock className="text-6xl text-warning mx-auto mb-4" />
            <h2 className="card-title justify-center text-2xl mb-2">
              Authentication Required
            </h2>
            <p className="text-base-content/70 mb-4">
              You need to be logged in to access this page.
            </p>
            <button 
              onClick={() => router.push('/login')}
              className="btn btn-primary"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
