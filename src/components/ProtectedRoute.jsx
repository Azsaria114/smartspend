import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    // Check if onboarding is completed
    const completed = localStorage.getItem('smartspend.onboarding.completed');
    setCheckingOnboarding(false);
    
    // If not authenticated, redirect to login
    if (!currentUser) {
      return;
    }
    
    // If authenticated but onboarding not completed, redirect to onboarding
    if (!completed || completed !== 'true') {
      return;
    }
  }, [currentUser]);

  // Show loading while checking
  if (checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-gray-600 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check onboarding completion
  const onboardingCompleted = localStorage.getItem('smartspend.onboarding.completed');
  if (!onboardingCompleted || onboardingCompleted !== 'true') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

