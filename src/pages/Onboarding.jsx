import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeScreen from '../components/WelcomeScreen';
import SetupProfile from '../components/SetupProfile';
import ImportData from '../components/ImportData';
import { useAuth } from '../contexts/AuthContext';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Check if onboarding is already completed
    const completed = localStorage.getItem('smartspend.onboarding.completed');
    const savedProfile = localStorage.getItem('smartspend.profile');
    
    if (completed === 'true' && savedProfile) {
      // Skip onboarding if already completed
      navigate('/dashboard', { replace: true });
    } else if (savedProfile && !completed) {
      // Resume from where they left off
      setStep(3); // Go to import data step
    }
  }, [navigate]);

  const handleWelcomeNext = () => {
    setStep(2);
  };

  const handleSetupNext = () => {
    setStep(3);
  };

  const handleImportNext = () => {
    // Mark onboarding as completed
    localStorage.setItem('smartspend.onboarding.completed', 'true');
    
    // If user is logged in, redirect to dashboard
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    } else {
      // Otherwise, redirect to signup/login
      navigate('/signup', { replace: true });
    }
  };

  const handleImportSkip = () => {
    localStorage.setItem('smartspend.onboarding.completed', 'true');
    
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/signup', { replace: true });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen">
      {step === 1 && <WelcomeScreen onNext={handleWelcomeNext} />}
      {step === 2 && <SetupProfile onNext={handleSetupNext} onBack={handleBack} />}
      {step === 3 && (
        <ImportData 
          onNext={handleImportNext} 
          onBack={handleBack} 
          onSkip={handleImportSkip}
        />
      )}
    </div>
  );
}

