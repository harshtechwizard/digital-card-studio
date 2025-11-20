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
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Validate required fields
      if (!data.full_name || data.full_name.trim() === '') {
        throw new Error('Full name is required');
      }

      // Get existing record to preserve fields not in the form
      const { data: existingData, error: fetchError } = await supabase
        .from('personal_info')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const existing = existingData as PersonalInfo | null;

      // Prepare home_address - JSONB field
      let homeAddress: any = null;
      if (data.home_address !== undefined) {
        if (typeof data.home_address === 'string' && data.home_address.trim() !== '') {
          homeAddress = data.home_address.trim();
        } else if (typeof data.home_address === 'object' && data.home_address !== null) {
          homeAddress = data.home_address;
        }
      } else if (existing?.home_address) {
        homeAddress = existing.home_address;
      }

      // Build the payload, merging with existing data
      const payload: any = {
        user_id: user.id,
        full_name: data.full_name.trim(),
        primary_email: data.primary_email !== undefined ? (data.primary_email?.trim() || null) : (existing?.primary_email || null),
        mobile_number: data.mobile_number !== undefined ? (data.mobile_number?.trim() || null) : (existing?.mobile_number || null),
        phone_number: data.phone_number !== undefined ? (data.phone_number?.trim() || null) : (existing?.phone_number || null),
        bio: data.bio !== undefined ? (data.bio?.trim() || null) : (existing?.bio || null),
        home_address: homeAddress,
        instagram_url: data.instagram_url !== undefined ? (data.instagram_url?.trim() || null) : (existing?.instagram_url || null),
        facebook_url: data.facebook_url !== undefined ? (data.facebook_url?.trim() || null) : (existing?.facebook_url || null),
        linkedin_url: data.linkedin_url !== undefined ? (data.linkedin_url?.trim() || null) : (existing?.linkedin_url || null),
        profile_photo_url: data.profile_photo_url !== undefined
          ? (data.profile_photo_url?.trim() || null)
          : (existing?.profile_photo_url || null),
        updated_at: new Date().toISOString(),
      };

      // Preserve other fields from existing record
      if (existing) {
        if (data.date_of_birth === undefined) payload.date_of_birth = existing.date_of_birth;
        if (data.secondary_email === undefined) payload.secondary_email = existing.secondary_email;
        if (data.profile_photo_url === undefined) payload.profile_photo_url = existing.profile_photo_url;
      }

      // Use update if exists, insert if not (to avoid unique constraint violation)
      let error;
      if (existing) {
        // Update existing record - don't include user_id in update payload
        const updatePayload: Database['public']['Tables']['personal_info']['Update'] = {
          full_name: payload.full_name,
          primary_email: payload.primary_email,
          mobile_number: payload.mobile_number,
          phone_number: payload.phone_number,
          bio: payload.bio,
          home_address: payload.home_address,
          updated_at: payload.updated_at,
          date_of_birth: payload.date_of_birth,
          secondary_email: payload.secondary_email,
          instagram_url: payload.instagram_url,
          facebook_url: payload.facebook_url,
          linkedin_url: payload.linkedin_url,
          profile_photo_url: payload.profile_photo_url,
        };
        const { error: updateError } = await (supabase
          .from('personal_info') as any)
          .update(updatePayload)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Insert new record
        const insertPayload: Database['public']['Tables']['personal_info']['Insert'] = payload;
        const { error: insertError } = await (supabase
          .from('personal_info') as any)
          .insert(insertPayload);
        error = insertError;
      }

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to save personal information');
      }
      
      await fetchProfile();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save personal info';
      console.error('Save personal info error:', err);
      setError(errorMessage);
      throw err;
    }
  };

  const saveProfessionalInfo = async (data: Omit<Partial<ProfessionalInfo>, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      // Prepare the data, ensuring all fields are properly formatted
      const payload: any = {
        user_id: user.id,
        designation: data.designation?.trim() || null,
        company_name: data.company_name?.trim() || null,
        company_website: data.company_website?.trim() || null,
        company_logo_url: data.company_logo_url?.trim() || null,
        office_email: data.office_email?.trim() || null,
        office_phone: data.office_phone?.trim() || null,
        whatsapp_number: data.whatsapp_number?.trim() || null,
        office_opening_time: data.office_opening_time?.trim() || null,
        office_closing_time: data.office_closing_time?.trim() || null,
        office_days: data.office_days?.trim() || null,
        department: data.department?.trim() || null,
        instagram_url: data.instagram_url?.trim() || null,
        facebook_url: data.facebook_url?.trim() || null,
        linkedin_url: data.linkedin_url?.trim() || null,
        is_primary: data.is_primary ?? false,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('professional_info')
        .upsert(payload as any);

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
