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

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check onboarding completion - be more lenient for better UX
  const onboardingCompleted = localStorage.getItem('smartspend.onboarding.completed');
  const hasExpenses = localStorage.getItem('smartspend.hasExpenses') === 'true';
  
  // Only redirect to onboarding if:
  // 1. Onboarding not completed AND
  // 2. User has no expenses (likely new user)
  // Existing users with data can skip onboarding
  if ((!onboardingCompleted || onboardingCompleted !== 'true') && !hasExpenses) {
    // Check if user just signed up (has the flag we set)
    const justSignedUp = localStorage.getItem('smartspend.justSignedUp') === 'true';
    if (justSignedUp) {
      // Clear the flag
      localStorage.removeItem('smartspend.justSignedUp');
      return <Navigate to="/onboarding" replace />;
    }
    // For existing users trying to access, allow them through
    // They can complete onboarding later if needed
  }

  return children;
}

