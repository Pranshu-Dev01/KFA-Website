/*
  # Setup Storage Buckets and Policies

  ## Overview
  This migration sets up the required storage buckets for Krishna Flute Academy:
  - `blog_images`: For blog post featured images and event posters.
  - `gallery`: For student performance photos and videos.

  ## 1. Buckets
  - Create `blog_images` bucket (public)
  - Create `gallery` bucket (public)

  ## 2. Security
  - Public read access for all objects in both buckets.
  - Authenticated users full control (INSERT, UPDATE, DELETE) for both buckets.
*/

-- Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog_images', 'blog_images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for storage.objects
-- (Note: Ensure RLS is enabled on storage.objects, usually it is by default in Supabase)

-- Policies for blog_images
DROP POLICY IF EXISTS "Public read access for blog_images" ON storage.objects;
CREATE POLICY "Public read access for blog_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog_images');

DROP POLICY IF EXISTS "Authenticated users full control for blog_images" ON storage.objects;
CREATE POLICY "Authenticated users full control for blog_images"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'blog_images')
  WITH CHECK (bucket_id = 'blog_images');

DROP POLICY IF EXISTS "Anon users can upload to blog_images" ON storage.objects;
CREATE POLICY "Anon users can upload to blog_images"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'blog_images');

-- Policies for gallery
DROP POLICY IF EXISTS "Public read access for gallery" ON storage.objects;
CREATE POLICY "Public read access for gallery"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Authenticated users full control for gallery" ON storage.objects;
CREATE POLICY "Authenticated users full control for gallery"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'gallery')
  WITH CHECK (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Anon users can upload to gallery" ON storage.objects;
CREATE POLICY "Anon users can upload to gallery"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'gallery');
