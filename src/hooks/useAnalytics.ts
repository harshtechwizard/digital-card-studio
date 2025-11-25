import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type CardAnalytic = Database['public']['Tables']['card_analytics']['Row'];
type BusinessCard = Database['public']['Tables']['business_cards']['Row'];

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  viewsByCard: { cardName: string; cardId: string; views: number }[];
  viewsByDate: { date: string; views: number }[];
  viewsByLocation: { country: string; views: number }[];
  recentViews: (CardAnalytic & { card_name?: string })[];
  topReferrers: { referrer: string; views: number }[];
}

export function useAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    uniqueVisitors: 0,
    viewsByCard: [],
    viewsByDate: [],
    viewsByLocation: [],
    recentViews: [],
    topReferrers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user's cards
      const { data: cards, error: cardsError } = await supabase
        .from('business_cards')
        .select('id, name')
        .eq('user_id', user.id);

      if (cardsError) throw cardsError;

      const typedCards = (cards || []) as BusinessCard[];
      const cardIds = typedCards.map((c) => c.id);

      if (cardIds.length === 0) {
        setAnalytics({
          totalViews: 0,
          uniqueVisitors: 0,
          viewsByCard: [],
          viewsByDate: [],
          viewsByLocation: [],
          recentViews: [],
          topReferrers: [],
        });
        setLoading(false);
        return;
      }

      // Fetch all analytics for user's cards
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('card_analytics')
        .select('*')
        .in('card_id', cardIds)
        .order('viewed_at', { ascending: false });

      if (analyticsError) throw analyticsError;

      const allViews = (analyticsData || []) as CardAnalytic[];

      // Calculate total views
      const totalViews = allViews.length;

      // Calculate unique visitors (by IP)
      const uniqueIPsSet = new Set(allViews.map((v) => v.ip_address).filter(Boolean));
      const uniqueVisitors = uniqueIPsSet.size;

      // Views by card
      const viewsByCardMap = new Map<string, { name: string; count: number }>();
      allViews.forEach((view) => {
        const card = typedCards.find((c) => c.id === view.card_id);
        if (card) {
          const existing = viewsByCardMap.get(card.id) || { name: card.name, count: 0 };
          viewsByCardMap.set(card.id, { name: existing.name, count: existing.count + 1 });
        }
      });
      const viewsByCard = Array.from(viewsByCardMap.entries()).map(([cardId, data]) => ({
        cardId,
        cardName: data.name,
        views: data.count,
      }));

      // Views by date (last 30 days)
      const viewsByDateMap = new Map<string, number>();
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      allViews.forEach((view) => {
        const viewDate = new Date(view.viewed_at);
        if (viewDate >= last30Days) {
          const dateKey = viewDate.toISOString().split('T')[0];
          viewsByDateMap.set(dateKey, (viewsByDateMap.get(dateKey) || 0) + 1);
        }
      });

      // Fill in missing dates with 0 views
      const viewsByDate: { date: string; views: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        viewsByDate.push({
          date: dateKey,
          views: viewsByDateMap.get(dateKey) || 0,
        });
      }

      // Views by location (using IP-API for geolocation)
      const viewsByLocation: { country: string; views: number }[] = [];
      const locationMap = new Map<string, number>();
      
      // Get unique IPs to reduce API calls
      const uniqueIPs = Array.from(new Set(allViews.map(v => v.ip_address).filter(Boolean))) as string[];
      
      // Fetch location data for each unique IP (with city and country)
      const locationPromises = uniqueIPs.map(async (ip: string) => {
        try {
          // Try ipapi.co first (HTTPS, free, no API key for 1000 requests/day)
          // Get both city and country
          const response = await fetch(`https://ipapi.co/${ip}/json/`);
          if (response.ok) {
            const data = await response.json();
            const city = data.city || '';
            const country = data.country_name || 'Unknown';
            const location = city ? `${city}, ${country}` : country;
            return { ip, country, city, location };
          }
          
          // Fallback to ip-api.com (includes city)
          const fallbackResponse = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
          const fallbackData = await fallbackResponse.json();
          const city = fallbackData.city || '';
          const country = fallbackData.country || 'Unknown';
          const location = city ? `${city}, ${country}` : country;
          return { ip, country, city, location };
        } catch (error) {
          console.error(`Failed to get location for IP ${ip}:`, error);
          return { ip, country: 'Unknown', city: '', location: 'Unknown' };
        }
      });

      // Wait for all location lookups
      const locationResults = await Promise.all(locationPromises);
      const ipToLocation = new Map<string, { country: string; city: string; location: string }>(
        locationResults.map(r => [r.ip, { country: r.country, city: r.city, location: r.location }])
      );

      // Count views by location (city + country)
      allViews.forEach((view) => {
        if (view.ip_address) {
          const locationData = ipToLocation.get(view.ip_address);
          const location = locationData?.location || 'Unknown';
          locationMap.set(location, (locationMap.get(location) || 0) + 1);
        } else {
          locationMap.set('Unknown', (locationMap.get('Unknown') || 0) + 1);
        }
      });

      locationMap.forEach((views, country) => {
        viewsByLocation.push({ country, views });
      });

      // Recent views (last 50)
      const recentViews = allViews.slice(0, 50).map((view) => {
        const card = typedCards.find((c) => c.id === view.card_id);
        return {
          ...view,
          card_name: card?.name,
        };
      });

      // Top referrers
      const referrerMap = new Map<string, number>();
      allViews.forEach((view) => {
        if (view.referrer) {
          try {
            const url = new URL(view.referrer);
            const domain = url.hostname;
            referrerMap.set(domain, (referrerMap.get(domain) || 0) + 1);
          } catch {
            referrerMap.set('Direct', (referrerMap.get('Direct') || 0) + 1);
          }
        } else {
          referrerMap.set('Direct', (referrerMap.get('Direct') || 0) + 1);
        }
      });

      const topReferrers = Array.from(referrerMap.entries())
        .map(([referrer, views]) => ({ referrer, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      setAnalytics({
        totalViews,
        uniqueVisitors,
        viewsByCard,
        viewsByDate,
        viewsByLocation,
        recentViews,
        topReferrers,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}
