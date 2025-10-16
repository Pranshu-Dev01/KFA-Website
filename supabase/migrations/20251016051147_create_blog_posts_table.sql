/*
  # Create Blog Posts Table

  ## Overview
  This migration creates a comprehensive blog system for Krishna Flute Academy with support for daily blog posts, including images, tags, and publishing controls.

  ## 1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key) - Unique identifier for each blog post
      - `title` (text) - Blog post title
      - `slug` (text, unique) - URL-friendly version of title
      - `content` (text) - Full blog post content (supports markdown)
      - `excerpt` (text) - Short summary/preview text
      - `featured_image` (text) - URL to the main blog image
      - `author_name` (text) - Name of the post author
      - `author_email` (text) - Author's email address
      - `published` (boolean) - Whether the post is publicly visible
      - `published_at` (timestamptz) - When the post was published
      - `view_count` (integer) - Number of times the post has been viewed
      - `tags` (text[]) - Array of tags for categorization
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - When the record was last updated

  ## 2. Security
    - Enable RLS on `blog_posts` table
    - Public users can read published posts
    - Only authenticated users can create/update posts
    - View count can be updated by anyone (for tracking)

  ## 3. Important Notes
    - The `slug` field must be unique to ensure clean URLs
    - Posts are only visible to public when `published = true`
    - Tags are stored as PostgreSQL array for flexible categorization
    - Timestamps use `timestamptz` for timezone awareness
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  featured_image text DEFAULT '',
  author_name text NOT NULL DEFAULT 'Krishna Flute Academy',
  author_email text DEFAULT '',
  published boolean DEFAULT false,
  published_at timestamptz,
  view_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public users can read published posts
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts
  FOR SELECT
  USING (published = true);

-- Authenticated users can view all posts (including drafts)
CREATE POLICY "Authenticated users can view all posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create new posts
CREATE POLICY "Authenticated users can create posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update posts
CREATE POLICY "Authenticated users can update posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete posts
CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);

-- Create index on published status and published_at for efficient queries
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(published, published_at DESC);

-- Create index on tags for filtering
CREATE INDEX IF NOT EXISTS blog_posts_tags_idx ON blog_posts USING GIN(tags);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before each update
DROP TRIGGER IF EXISTS blog_posts_updated_at_trigger ON blog_posts;
CREATE TRIGGER blog_posts_updated_at_trigger
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();
