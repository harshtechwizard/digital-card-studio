-- Create Storage Buckets for Phase 1 Features
-- Run this in Supabase SQL Editor or Dashboard > Storage

-- Note: Storage buckets are typically created via the Supabase Dashboard UI
-- Go to Storage > Create a new bucket

-- Bucket 1: profile-photos (already exists from previous setup)
-- Public: true
-- File size limit: 2MB
-- Allowed MIME types: image/*

-- Bucket 2: company-logos (already exists from previous setup)
-- Public: true
-- File size limit: 2MB
-- Allowed MIME types: image/*

-- Bucket 3: product-photos (NEW)
-- Public: true
-- File size limit: 2MB
-- Allowed MIME types: image/*

-- Bucket 4: gallery-photos (NEW)
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/*

-- If you want to create them via SQL (advanced):
-- Note: This requires admin privileges

-- Create product-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-photos',
  'product-photos',
  true,
  2097152, -- 2MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create gallery-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-photos',
  'gallery-photos',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for product-photos bucket
CREATE POLICY "Users can upload their own product photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own product photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own product photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Product photos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-photos');

-- Set up RLS policies for gallery-photos bucket
CREATE POLICY "Users can upload their own gallery photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gallery-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own gallery photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'gallery-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own gallery photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'gallery-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Gallery photos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-photos');
