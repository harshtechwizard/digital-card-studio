import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type Award = Database['public']['Tables']['awards']['Row'];
type AwardInsert = Database['public']['Tables']['awards']['Insert'];

export function useAwards() {
  const { user } = useAuth();
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAwards();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAwards = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('awards')
        .select('*')
        .eq('user_id', user.id)
        .order('date_received', { ascending: false });

      if (fetchError) throw fetchError;
      setAwards(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch awards');
    } finally {
      setLoading(false);
    }
  };

  const addAward = async (data: Omit<AwardInsert, 'user_id' | 'id' | 'created_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: insertError } = await (supabase
        .from('awards') as any)
        .insert({
          ...data,
          user_id: user.id,
        });

      if (insertError) throw insertError;
      await fetchAwards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add award');
      throw err;
    }
  };

  const updateAward = async (id: string, data: Partial<Omit<Award, 'id' | 'user_id' | 'created_at'>>) => {
    try {
      const { error: updateError } = await (supabase
        .from('awards') as any)
        .update(data)
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchAwards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update award');
      throw err;
    }
  };

  const deleteAward = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('awards')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchAwards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete award');
      throw err;
    }
  };

  return {
    awards,
    loading,
    error,
    addAward,
    updateAward,
    deleteAward,
    refetch: fetchAwards,
  };
}
