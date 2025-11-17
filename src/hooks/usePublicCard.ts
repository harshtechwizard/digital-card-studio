import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

type BusinessCard = Database['public']['Tables']['business_cards']['Row'];
type PersonalInfo = Database['public']['Tables']['personal_info']['Row'];
type ProfessionalInfo = Database['public']['Tables']['professional_info']['Row'];

interface PublicCardData {
  card: BusinessCard;
  personalInfo: PersonalInfo | null;
  professionalInfo: ProfessionalInfo[];
}

export function usePublicCard(slug: string) {
  const [data, setData] = useState<PublicCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCard();
  }, [slug]);

  const fetchCard = async () => {
    try {
      setLoading(true);

      // Fetch the business card
      const { data: card, error: cardError } = await supabase
        .from('business_cards')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (cardError) throw cardError;
      if (!card) throw new Error('Card not found');

      // Track analytics
      await supabase.from('card_analytics').insert({
        card_id: card.id,
        ip_address: null, // You can add IP detection if needed
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      });

      // Fetch personal info
      const { data: personalInfo } = await supabase
        .from('personal_info')
        .select('*')
        .eq('user_id', card.user_id)
        .single();

      // Fetch professional info
      const { data: professionalInfo } = await supabase
        .from('professional_info')
        .select('*')
        .eq('user_id', card.user_id);

      setData({
        card,
        personalInfo: personalInfo || null,
        professionalInfo: professionalInfo || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch card');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error };
}
