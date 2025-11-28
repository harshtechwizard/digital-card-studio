import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TutorialStep {
  target: string; // CSS selector
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
  route?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    target: 'body',
    title: 'Welcome to Digital Card Studio! 🎉',
    description: 'Let\'s take a quick tour to help you get started. This will only take a minute!',
    position: 'bottom',
  },
  {
    target: '[href="/profile"]',
    title: 'Step 1: Your Profile',
    description: 'First, complete your profile with your personal and professional information. This is where everything starts!',
    position: 'bottom',
    route: '/profile',
  },
  {
    target: '#fullName',
    title: 'Add Your Name',
    description: 'Start by adding your full name. This is required to create business cards.',
    position: 'right',
    route: '/profile',
  },
  {
    target: 'input[type="file"]',
    title: 'Upload a Photo',
    description: 'Add a professional profile photo to make your cards stand out.',
    position: 'right',
    route: '/profile',
  },
  {
    target: 'button:has-text("Save Personal Information")',
    title: 'Save Your Information',
    description: 'Don\'t forget to save! This button is always at the bottom of the page.',
    position: 'top',
    route: '/profile',
  },
  {
    target: '[href="/my-cards"]',
    title: 'Step 2: Create Cards',
    description: 'Once your profile is complete, create beautiful digital business cards here.',
    position: 'bottom',
    route: '/my-cards',
  },
  {
    target: 'button:has-text("Create New Card")',
    title: 'Create Your First Card',
    description: 'Click here to start creating your first digital business card!',
    position: 'left',
    route: '/my-cards',
  },
  {
    target: '[href="/analytics"]',
    title: 'Step 3: Track Analytics',
    description: 'Monitor who views your cards, track engagement, and see visitor locations.',
    position: 'bottom',
    route: '/analytics',
  },
  {
    target: 'body',
    title: 'You\'re All Set! 🚀',
    description: 'That\'s it! You\'re ready to create amazing digital business cards. Let\'s get started!',
    position: 'bottom',
  },
];

interface InteractiveTutorialProps {
  onComplete: () => void;
}

export function InteractiveTutorial({ onComplete }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  const step = tutorialSteps[currentStep];

  useEffect(() => {
    if (!isActive) return;

    // Navigate to the required route if needed
    if (step.route && location.pathname !== step.route) {
      navigate(step.route);
    }

    // Wait for navigation and DOM to update
    const timer = setTimeout(() => {
      const element = findElement(step.target);
      setTargetElement(element);

      if (element) {
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Calculate tooltip position
        const rect = element.getBoundingClientRect();
        const position = calculateTooltipPosition(rect, step.position);
        setTooltipPosition(position);
      } else if (step.target === 'body') {
        // Center of screen for body target
        setTooltipPosition({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 200,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentStep, isActive, step, navigate, location.pathname]);

  const findElement = (selector: string): HTMLElement | null => {
    if (selector === 'body') return document.body;
    
    // Try direct selector
    let element = document.querySelector(selector) as HTMLElement;
    if (element) return element;

    // Try finding by text content for buttons
    if (selector.includes(':has-text')) {
      const text = selector.match(/\("(.+)"\)/)?.[1];
      if (text) {
        const buttons = Array.from(document.querySelectorAll('button'));
        element = buttons.find(btn => btn.textContent?.includes(text)) as HTMLElement;
      }
    }

    return element;
  };

  const calculateTooltipPosition = (rect: DOMRect, position: string) => {
    const offset = 20;
    const tooltipWidth = 400;
    const tooltipHeight = 200;

    switch (position) {
      case 'top':
        return {
          top: rect.top - tooltipHeight - offset,
          left: rect.left + rect.width / 2 - tooltipWidth / 2,
        };
      case 'bottom':
        return {
          top: rect.bottom + offset,
          left: rect.left + rect.width / 2 - tooltipWidth / 2,
        };
      case 'left':
        return {
          top: rect.top + rect.height / 2 - tooltipHeight / 2,
          left: rect.left - tooltipWidth - offset,
        };
      case 'right':
        return {
          top: rect.top + rect.height / 2 - tooltipHeight / 2,
          left: rect.right + offset,
        };
      default:
        return { top: rect.bottom + offset, left: rect.left };
    }
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsActive(false);
    onComplete();
  };

  if (!isActive) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[9998] transition-opacity" />

      {/* Spotlight on target element */}
      {targetElement && targetElement !== document.body && (
        <div
          className="fixed z-[9999] pointer-events-none transition-all duration-300"
          style={{
            top: targetElement.getBoundingClientRect().top - 8,
            left: targetElement.getBoundingClientRect().left - 8,
            width: targetElement.getBoundingClientRect().width + 16,
            height: targetElement.getBoundingClientRect().height + 16,
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.6)',
            borderRadius: '8px',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed z-[10000] bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6 max-w-md transition-all duration-300"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          transform: tooltipPosition.top < 0 ? 'translateY(50%)' : 'none',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
          <p className="text-muted-foreground">{step.description}</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-primary'
                  : index < currentStep
                  ? 'w-2 bg-primary/50'
                  : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevious} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1">
            {currentStep === tutorialSteps.length - 1 ? (
              'Get Started'
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip tutorial
        </button>
      </div>
    </>
  );
}
