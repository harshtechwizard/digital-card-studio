import { useProfile } from './useProfile';

export function useProfileCompletion() {
  const { personalInfo, loading } = useProfile();

  const isProfileComplete = Boolean(
    personalInfo &&
    personalInfo.full_name &&
    personalInfo.full_name.trim() !== ''
  );

  return {
    isProfileComplete,
    loading,
    personalInfo,
  };
}
