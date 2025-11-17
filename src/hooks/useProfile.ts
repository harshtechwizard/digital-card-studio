import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type PersonalInfo = Database['public']['Tables']['personal_info']['Row'];
type ProfessionalInfo = Database['public']['Tables']['professional_info']['Row'];

export function useProfile() {
  const { user } = useAuth();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [professionalInfo, setProfessionalInfo] = useState<ProfessionalInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch personal info
      const { data: personal, error: personalError } = await supabase
        .from('personal_info')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (personalError && personalError.code !== 'PGRST116') {
        throw personalError;
      }

      // Fetch professional info
      const { data: professional, error: professionalError } = await supabase
        .from('professional_info')
        .select('*')
        .eq('user_id', user.id);

      if (professionalError) throw professionalError;

      setPersonalInfo(personal);
      setProfessionalInfo(professional || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const savePersonalInfo = async (data: Omit<Partial<PersonalInfo>, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('personal_info')
        .upsert({
          user_id: user.id,
          full_name: data.full_name || '',
          ...data,
          updated_at: new Date().toISOString(),
        } as any);

      if (error) throw error;
      await fetchProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save personal info');
      throw err;
    }
  };

  const saveProfessionalInfo = async (data: Omit<Partial<ProfessionalInfo>, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('professional_info')
        .upsert({
          user_id: user.id,
          ...data,
          updated_at: new Date().toISOString(),
        } as any);

      if (error) throw error;
      await fetchProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save professional info');
      throw err;
    }
  };

  const deleteProfessionalInfo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('professional_info')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete professional info');
      throw err;
    }
  };

  return {
    personalInfo,
    professionalInfo,
    loading,
    error,
    savePersonalInfo,
    saveProfessionalInfo,
    deleteProfessionalInfo,
    refetch: fetchProfile,
  };
}
