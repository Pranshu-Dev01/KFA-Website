# Blog System Setup Guide

## Overview
Your Krishna Flute Academy website now has a fully functional blog system with:
- **Blog Component**: Displays published blog posts with filtering by tags
- **BlogAdmin Component**: Create, edit, and manage blog posts
- **Supabase Integration**: Database backend for storing blog posts

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new account
2. Create a new project
3. Note down your project URL and anon key from the project settings

### 2. Environment Configuration
Create a `.env` file in your project root with the following content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace the values with your actual Supabase project URL and anon key.

### 3. Database Setup
Apply the migration to create the blog_posts table:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20251016051147_create_blog_posts_table.sql`
4. Run the SQL script

This will create:
- `blog_posts` table with all necessary fields
- Row Level Security (RLS) policies
- Indexes for performance
- Automatic timestamp updates

### 4. Test the Blog System

#### Start the Development Server
```bash
npm run dev
```

#### Access the Blog Features
- **Home Page**: Navigate to the main website
- **Blog View**: Click "Blog" in the navigation to see published posts
- **Admin Panel**: Click "Admin" in the navigation to manage posts

#### Create Your First Blog Post
1. Go to the Admin panel
2. Click "New Post"
3. Fill in the required fields:
   - Title (required)
   - Content (required)
   - Excerpt (optional)
   - Featured Image URL (optional)
   - Tags (optional)
   - Author Name (defaults to "Krishna Flute Academy")
4. Toggle "Published" to make it visible to public
5. Click "Save Post"

#### View Your Blog Post
1. Go to the Blog view
2. Your published post should appear in the list
3. Click on the post to read the full content

## Features

### Blog Component Features
- ✅ Display published blog posts
- ✅ Filter posts by tags
- ✅ View individual post details
- ✅ Automatic view count tracking
- ✅ Responsive design
- ✅ Beautiful UI with animations

### BlogAdmin Component Features
- ✅ Create new blog posts
- ✅ Edit existing posts
- ✅ Delete posts
- ✅ Draft/Published status management
- ✅ Tag management
- ✅ Featured image support
- ✅ Author information
- ✅ Automatic slug generation

### Database Features
- ✅ Secure Row Level Security (RLS)
- ✅ Public read access for published posts
- ✅ Authenticated user management
- ✅ Automatic timestamps
- ✅ Optimized indexes
- ✅ Tag filtering support

## Security Notes
- The blog system uses Supabase RLS for security
- Public users can only read published posts
- Only authenticated users can create/edit/delete posts
- View counts can be updated by anyone (for tracking purposes)

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error**
   - Make sure your `.env` file exists and has the correct variable names
   - Restart your development server after creating the `.env` file

2. **Blog posts not showing**
   - Check if posts are marked as "published"
   - Verify the Supabase connection in browser dev tools
   - Ensure the database migration was applied successfully

3. **Cannot create/edit posts**
   - Check if you're authenticated in Supabase
   - Verify RLS policies are correctly set up
   - Check browser console for error messages

### Getting Help
- Check the browser console for error messages
- Verify your Supabase project settings
- Ensure all environment variables are correctly set
- Make sure the database migration was applied successfully

## Next Steps
1. Set up authentication if you want to restrict admin access
2. Add image upload functionality for featured images
3. Implement SEO optimization for blog posts
4. Add social sharing features
5. Implement comment system (optional)

Your blog system is now ready to use! 🎉
