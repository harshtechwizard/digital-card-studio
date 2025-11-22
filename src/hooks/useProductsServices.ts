import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type ProductService = Database['public']['Tables']['products_services']['Row'];
type ProductServiceInsert = Database['public']['Tables']['products_services']['Insert'];

export function useProductsServices() {
  const { user } = useAuth();
  const [productsServices, setProductsServices] = useState<ProductService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProductsServices();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProductsServices = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products_services')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProductsServices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products/services');
    } finally {
      setLoading(false);
    }
  };

  const addProductService = async (data: Omit<ProductServiceInsert, 'user_id' | 'id' | 'created_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: insertError } = await (supabase
        .from('products_services') as any)
        .insert({
          ...data,
          user_id: user.id,
        });

      if (insertError) throw insertError;
      await fetchProductsServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product/service');
      throw err;
    }
  };

  const updateProductService = async (id: string, data: Partial<Omit<ProductService, 'id' | 'user_id' | 'created_at'>>) => {
    try {
      const { error: updateError } = await (supabase
        .from('products_services') as any)
        .update(data)
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchProductsServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product/service');
      throw err;
    }
  };

  const deleteProductService = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('products_services')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchProductsServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product/service');
      throw err;
    }
  };

  return {
    productsServices,
    loading,
    error,
    addProductService,
    updateProductService,
    deleteProductService,
    refetch: fetchProductsServices,
  };
}
