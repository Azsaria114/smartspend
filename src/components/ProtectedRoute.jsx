import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    // Give a small delay to ensure auth state is checked
    const timer = setTimeout(() => {
      setCheckingOnboarding(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentUser]);

  // Show loading while checking
  if (checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-gray-300 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to home
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Allow all authenticated users to access protected routes
  // Onboarding is now optional and can be accessed later if needed
  // No forced redirects - users go directly to dashboard after signup

  return children;
}

