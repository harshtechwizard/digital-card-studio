import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type Education = Database['public']['Tables']['education']['Row'];
type EducationInsert = Database['public']['Tables']['education']['Insert'];

export function useEducation() {
  const { user } = useAuth();
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchEducation();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchEducation = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', user.id)
        .order('year_completed', { ascending: false });

      if (fetchError) throw fetchError;
      setEducation(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch education');
    } finally {
      setLoading(false);
    }
  };

  const addEducation = async (data: Omit<EducationInsert, 'user_id' | 'id' | 'created_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: insertError } = await (supabase
        .from('education') as any)
        .insert({
          ...data,
          user_id: user.id,
        });

      if (insertError) throw insertError;
      await fetchEducation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add education');
      throw err;
    }
  };

  const updateEducation = async (id: string, data: Partial<Omit<Education, 'id' | 'user_id' | 'created_at'>>) => {
    try {
      const { error: updateError } = await (supabase
        .from('education') as any)
        .update(data)
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchEducation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update education');
      throw err;
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchEducation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete education');
      throw err;
    }
  };

  return {
    education,
    loading,
    error,
    addEducation,
    updateEducation,
    deleteEducation,
    refetch: fetchEducation,
  };
}
