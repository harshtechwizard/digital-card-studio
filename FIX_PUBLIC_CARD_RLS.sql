-- Fix RLS Policies for Public Card Viewing
-- Run this in Supabase SQL Editor

-- The issue is that education, awards, products_services, and photo_gallery tables
-- might not have policies that allow public SELECT access

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view education for active cards" ON education;
DROP POLICY IF EXISTS "Public can view awards for active cards" ON awards;
DROP POLICY IF EXISTS "Public can view products for active cards" ON products_services;
DROP POLICY IF EXISTS "Public can view photos for active cards" ON photo_gallery;

-- Create new policies that allow public read access for users with active cards

-- Education: Allow public to view education for users with active cards
CREATE POLICY "Public can view education for active cards"
  ON education FOR SELECT
  USING (
    user_id IN (
      SELECT DISTINCT user_id 
      FROM business_cards 
      WHERE is_active = true
    )
  );

-- Awards: Allow public to view awards for users with active cards
CREATE POLICY "Public can view awards for active cards"
  ON awards FOR SELECT
  USING (
    user_id IN (
      SELECT DISTINCT user_id 
      FROM business_cards 
      WHERE is_active = true
    )
  );

-- Products/Services: Allow public to view products for users with active cards
CREATE POLICY "Public can view products for active cards"
  ON products_services FOR SELECT
  USING (
    user_id IN (
      SELECT DISTINCT user_id 
      FROM business_cards 
      WHERE is_active = true
    )
  );

-- Photo Gallery: Allow public to view photos for users with active cards
CREATE POLICY "Public can view photos for active cards"
  ON photo_gallery FOR SELECT
  USING (
    user_id IN (
      SELECT DISTINCT user_id 
      FROM business_cards 
      WHERE is_active = true
    )
  );

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('education', 'awards', 'products_services', 'photo_gallery')
ORDER BY tablename, policyname;
