import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type BusinessCard = Database['public']['Tables']['business_cards']['Row'];
type BusinessCardInsert = Database['public']['Tables']['business_cards']['Insert'];
type BusinessCardUpdate = Database['public']['Tables']['business_cards']['Update'];

export function useBusinessCards() {
  const { user } = useAuth();
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCards();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCards = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('business_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cards');
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (card: Omit<BusinessCardInsert, 'user_id'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('business_cards')
        .insert({
          ...card,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchCards();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add card');
      throw err;
    }
  };

  const updateCard = async (id: string, updates: BusinessCardUpdate) => {
    try {
      const { error } = await supabase
        .from('business_cards')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      await fetchCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update card');
      throw err;
    }
  };

  const deleteCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('business_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete card');
      throw err;
    }
  };

  return { cards, loading, error, addCard, updateCard, deleteCard, refetch: fetchCards };
}
