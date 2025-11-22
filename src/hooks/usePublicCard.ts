import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';

type BusinessCard = Database['public']['Tables']['business_cards']['Row'];
type PersonalInfo = Database['public']['Tables']['personal_info']['Row'];
type ProfessionalInfo = Database['public']['Tables']['professional_info']['Row'];
type Education = Database['public']['Tables']['education']['Row'];
type Award = Database['public']['Tables']['awards']['Row'];
type ProductService = Database['public']['Tables']['products_services']['Row'];
type Photo = Database['public']['Tables']['photo_gallery']['Row'];

interface PublicCardData {
  card: BusinessCard;
  personalInfo: PersonalInfo | null;
  professionalInfo: ProfessionalInfo[];
  education: Education[];
  awards: Award[];
  productsServices: ProductService[];
  photos: Photo[];
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
      console.log('usePublicCard: Fetching card with slug:', slug);

      // Fetch the business card
      const { data: card, error: cardError } = await supabase
        .from('business_cards')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (cardError) {
        console.error('usePublicCard: Card error:', cardError);
        throw cardError;
      }
      if (!card) {
        console.error('usePublicCard: No card found');
        throw new Error('Card not found');
      }
      
      console.log('usePublicCard: Found card:', card);
      const typedCard = card as BusinessCard;

      // Track analytics
      const analyticsData = {
        card_id: typedCard.id,
        ip_address: null as string | null,
        user_agent: navigator.userAgent,
        referrer: (document.referrer || null) as string | null,
      } as any;
      await supabase.from('card_analytics').insert(analyticsData);

      // Fetch personal info
      console.log('usePublicCard: Fetching personal info for user:', typedCard.user_id);
      const { data: personalInfo, error: personalError } = await supabase
        .from('personal_info')
        .select('*')
        .eq('user_id', typedCard.user_id)
        .single();

      if (personalError) {
        console.error('usePublicCard: Personal info error:', personalError);
      }
      console.log('usePublicCard: Personal info:', personalInfo);

      // Fetch professional info
      console.log('usePublicCard: Fetching professional info for user:', typedCard.user_id);
      const { data: professionalInfo, error: professionalError } = await supabase
        .from('professional_info')
        .select('*')
        .eq('user_id', typedCard.user_id);

      if (professionalError) {
        console.error('usePublicCard: Professional info error:', professionalError);
      }
      console.log('usePublicCard: Professional info:', professionalInfo);

      // Fetch education
      const { data: education, error: educationError } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', typedCard.user_id)
        .order('year_completed', { ascending: false });

      if (educationError) {
        console.error('usePublicCard: Education error:', educationError);
      }

      // Fetch awards
      const { data: awards, error: awardsError } = await supabase
        .from('awards')
        .select('*')
        .eq('user_id', typedCard.user_id)
        .order('date_received', { ascending: false });

      if (awardsError) {
        console.error('usePublicCard: Awards error:', awardsError);
      }

      // Fetch products/services
      const { data: productsServices, error: productsError } = await supabase
        .from('products_services')
        .select('*')
        .eq('user_id', typedCard.user_id);

      if (productsError) {
        console.error('usePublicCard: Products/Services error:', productsError);
      }

      // Fetch photos
      const { data: photos, error: photosError } = await supabase
        .from('photo_gallery')
        .select('*')
        .eq('user_id', typedCard.user_id)
        .order('display_order', { ascending: true });

      if (photosError) {
        console.error('usePublicCard: Photos error:', photosError);
      }

      setData({
        card: typedCard,
        personalInfo: (personalInfo as PersonalInfo) || null,
        professionalInfo: (professionalInfo as ProfessionalInfo[]) || [],
        education: (education as Education[]) || [],
        awards: (awards as Award[]) || [],
        productsServices: (productsServices as ProductService[]) || [],
        photos: (photos as Photo[]) || [],
      });
      console.log('usePublicCard: Data set successfully');
    } catch (err) {
      console.error('usePublicCard: Exception:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch card');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error };
}
