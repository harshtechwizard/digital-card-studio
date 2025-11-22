import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type Photo = Database['public']['Tables']['photo_gallery']['Row'];
type PhotoInsert = Database['public']['Tables']['photo_gallery']['Insert'];

export function usePhotoGallery() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPhotos();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPhotos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('photo_gallery')
        .select('*')
        .eq('user_id', user.id)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
      setPhotos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  const addPhoto = async (data: Omit<PhotoInsert, 'user_id' | 'id' | 'created_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: insertError } = await supabase
        .from('photo_gallery')
        .insert({
          ...data,
          user_id: user.id,
        });

      if (insertError) throw insertError;
      await fetchPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add photo');
      throw err;
    }
  };

  const updatePhoto = async (id: string, data: Partial<Omit<Photo, 'id' | 'user_id' | 'created_at'>>) => {
    try {
      const { error: updateError } = await supabase
        .from('photo_gallery')
        .update(data)
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update photo');
      throw err;
    }
  };

  const deletePhoto = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('photo_gallery')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete photo');
      throw err;
    }
  };

  return {
    photos,
    loading,
    error,
    addPhoto,
    updatePhoto,
    deletePhoto,
    refetch: fetchPhotos,
  };
}
