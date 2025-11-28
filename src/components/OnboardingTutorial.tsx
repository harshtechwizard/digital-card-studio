import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, CreditCard, BarChart3, CheckCircle2 } from 'lucide-react';

interface OnboardingTutorialProps {
  open: boolean;
  onComplete: () => void;
}

const steps = [
  {
    icon: User,
    title: 'Complete Your Profile',
    description: 'Start by adding your personal and professional information. This will be used across all your business cards.',
    color: 'text-blue-500',
  },
  {
    icon: CreditCard,
    title: 'Create Your Cards',
    description: 'Design beautiful digital business cards with your information. Create multiple cards for different purposes.',
    color: 'text-green-500',
  },
  {
    icon: BarChart3,
    title: 'Track Analytics',
    description: 'Monitor who views your cards, track engagement, and see where your cards are being shared.',
    color: 'text-purple-500',
  },
];

export function OnboardingTutorial({ open, onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleSkip()}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center py-6">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <Icon className={`w-12 h-12 ${step.color}`} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-3">{step.title}</h2>
          <p className="text-muted-foreground mb-8 px-4">{step.description}</p>

          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
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

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSkip} className="flex-1">
              Skip
            </Button>
            <Button onClick={handleNext} className="flex-1">
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Get Started
                </>
              ) : (
                'Next'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
