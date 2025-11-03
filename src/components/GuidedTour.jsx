import { useState, useEffect } from 'react';

const steps = [
  {
    id: 'balance',
    title: 'Your Financial Overview',
    content: 'This is your available balance. Keep track of your spending to maintain healthy finances.',
    position: 'bottom',
  },
  {
    id: 'category-cards',
    title: 'Category Spending',
    content: 'See how much you\'re spending in each category. Click on any card to view detailed insights.',
    position: 'bottom',
  },
  {
    id: 'add-expense',
    title: 'Add Expenses Quickly',
    content: 'Use the floating button or "Add Expense" to quickly log your transactions.',
    position: 'left',
  },
  {
    id: 'analytics',
    title: 'Spending Analytics',
    content: 'View charts and trends to understand your spending patterns over time.',
    position: 'top',
  },
];

export default function GuidedTour({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [overlayStyle, setOverlayStyle] = useState({});

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem('smartspend.guidedTour.completed');
    if (!hasSeenTour) {
      // Show tour after a short delay
      setTimeout(() => {
        setShowTour(true);
        highlightElement(steps[0].id);
      }, 1000);
    }
  }, []);

  const highlightElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const rect = element.getBoundingClientRect();
      setOverlayStyle({
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      highlightElement(steps[nextStep].id);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('smartspend.guidedTour.completed', 'true');
    setShowTour(false);
    if (onComplete) onComplete();
  };

  if (!showTour || currentStep >= steps.length) return null;

  const currentStepData = steps[currentStep];
  const positionClass = {
    top: 'bottom-full mb-4',
    bottom: 'top-full mt-4',
    left: 'right-full mr-4',
    right: 'left-full ml-4',
  }[currentStepData.position] || 'bottom-full mb-4';

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-50 pointer-events-auto">
        {/* Highlighted Area */}
        <div
          className="absolute bg-white rounded-lg shadow-2xl border-4 border-indigo-500 pointer-events-none transition-all duration-300"
          style={{
            ...overlayStyle,
            transform: 'translate(-4px, -4px)',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
          }}
        />
      </div>

      {/* Tooltip */}
      <div
        className={`fixed z-50 ${positionClass}`}
        style={{
          top: overlayStyle.top ? `${parseFloat(overlayStyle.top) + parseFloat(overlayStyle.height) + 16}px` : '50%',
          left: overlayStyle.left ? `${parseFloat(overlayStyle.left) + parseFloat(overlayStyle.width) / 2}px` : '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                {currentStep + 1}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{currentStepData.title}</h3>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">{currentStepData.content}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-indigo-600 w-6'
                      : 'bg-gray-300 w-1.5'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={() => {
                    const prevStep = currentStep - 1;
                    setCurrentStep(prevStep);
                    highlightElement(steps[prevStep].id);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

