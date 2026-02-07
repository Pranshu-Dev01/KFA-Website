/*
  # Create Gallery Items Table

  ## Overview
  This migration creates a system for managing a dynamic gallery of images and videos for Krishna Flute Academy.

  ## 1. New Tables
    - `gallery_items`
      - `id` (uuid, primary key)
      - `title` (text) - Optional title
      - `description` (text) - Optional description
      - `media_type` (text) - 'image', 'video-url', or 'video-file'
      - `url` (text) - URL to the media (Supabase Storage or YouTube)
      - `thumbnail_url` (text) - Optional thumbnail for videos
      - `is_active` (boolean) - Visibility toggle
      - `sort_order` (integer) - Manual sorting
      - `created_at` (timestamptz)

  ## 2. Security
    - Enable RLS
    - Public read access for active items
    - Authenticated users full access
*/

CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video-url', 'video-file')),
  url text NOT NULL,
  thumbnail_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Public users can read active items
DROP POLICY IF EXISTS "Anyone can view active gallery items" ON gallery_items;
CREATE POLICY "Anyone can view active gallery items"
  ON gallery_items
  FOR SELECT
  USING (is_active = true);

-- Authenticated users have full control
DROP POLICY IF EXISTS "Authenticated users have full control over gallery items" ON gallery_items;
CREATE POLICY "Authenticated users have full control over gallery items"
  ON gallery_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to insert gallery items (for testing/development)
DROP POLICY IF EXISTS "Anyone can insert gallery items" ON gallery_items;
CREATE POLICY "Anyone can insert gallery items"
  ON gallery_items
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create index for sorting and visibility
CREATE INDEX IF NOT EXISTS gallery_items_sort_idx ON gallery_items(is_active, sort_order ASC, created_at DESC);
