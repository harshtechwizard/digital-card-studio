import { useState, useEffect } from 'react';
import { Profile, defaultProfile } from '@/types/profile';

const STORAGE_KEY = 'user-profile';

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const saveProfile = (newProfile: Profile) => {
    setProfile(newProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
  };

  return { profile, saveProfile };
}
