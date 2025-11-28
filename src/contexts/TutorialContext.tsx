import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TutorialContextType {
  showTutorial: boolean;
  startTutorial: () => void;
  completeTutorial: () => void;
  skipTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if user has completed the tutorial
    const hasCompletedTutorial = localStorage.getItem('hasCompletedInteractiveTutorial');
    
    if (!hasCompletedTutorial) {
      // Wait a bit before showing tutorial to let the page load
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const completeTutorial = () => {
    localStorage.setItem('hasCompletedInteractiveTutorial', 'true');
    setShowTutorial(false);
  };

  const skipTutorial = () => {
    localStorage.setItem('hasCompletedInteractiveTutorial', 'true');
    setShowTutorial(false);
  };

  return (
    <TutorialContext.Provider value={{ showTutorial, startTutorial, completeTutorial, skipTutorial }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}
