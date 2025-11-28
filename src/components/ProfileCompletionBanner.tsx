import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface ProfileCompletionBannerProps {
  isProfileComplete: boolean;
}

export function ProfileCompletionBanner({ isProfileComplete }: ProfileCompletionBannerProps) {
  const navigate = useNavigate();

  if (isProfileComplete) return null;

  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900 mb-6">
      <div className="p-4 flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
            Complete Your Profile
          </h3>
          <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
            Add your personal information to create professional business cards. It only takes a minute!
          </p>
          <Button
            size="sm"
            onClick={() => navigate('/profile')}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Complete Profile
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
