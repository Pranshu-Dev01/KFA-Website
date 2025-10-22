import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Home } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';

// Define BlogPost type here if not imported (adjust properties as needed)
interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  author_name: string;
  author_email: string | null;
  published: boolean;
  published_at: string | null;
  view_count: number;
  tags: string[];
  updated_at: string;
}
const SUPABASE_BUCKET_NAME = 'blog_images';

export const BlogAdmin: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featured_image: '',
        author_name: 'Krishna Flute Academy',
        author_email: '',
        published: false,
        tags: []
    });
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        // Clear any existing URL so the preview updates
        setCurrentPost(prev => ({ ...prev, featured_image: null }));
    }
};

    const handleRemoveImage = () => {
        setImageFile(null);
        setCurrentPost(prev => ({ ...prev, featured_image: null }));
        // Reset the file input field
        const fileInput = document.getElementById('postImage') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingPosts, setFetchingPosts] = useState(true);

    useEffect(() => {
        fetchAllPosts();
    }, []);

    const fetchAllPosts = async () => {
        setFetchingPosts(true);
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
             setFetchingPosts(false);
        }
    };

    const generateSlug = (title: string) => {
        if (!title) return '';
        return title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const handleTitleChange = (title: string) => {
        setCurrentPost(prev => ({
            ...prev,
            title,
            slug: !prev.id || !prev.slug ? generateSlug(title) : prev.slug
        }));
    };

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !currentPost.tags?.includes(trimmedTag)) {
            setCurrentPost(prev => ({
                ...prev,
                tags: [...(prev.tags || []), trimmedTag]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setCurrentPost(prev => ({
            ...prev,
            tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
        }));
    };

    // --- REPLACE your current handleSave with THIS version ---
      const handleSave = async () => {
        if (!currentPost.title || !currentPost.content) {
            alert('Title and content are required!');
            return;
        }

        setLoading(true);
        let imageUrlToSave = currentPost.featured_image; // Start with existing URL (if any)

        try {
            // 1. Check if a NEW file was selected
            if (imageFile) {
                // Create a unique, safe file path
                const fileExt = imageFile.name.split('.').pop();
                const safeFileName = `${Date.now()}-${generateSlug(imageFile.name.replace(`.${fileExt}`, ''))}.${fileExt}`;

                // Upload the file
                const { error: uploadError } = await supabase.storage
                    .from(SUPABASE_BUCKET_NAME) // Use your constant
                    .upload(safeFileName, imageFile, {
                        cacheControl: '3600',
                        upsert: false, // Set to true if you want to allow overwriting
                    });

                if (uploadError) {
                    throw new Error(`Image Upload Failed: ${uploadError.message}`);
                }

                // Get the public URL for the uploaded file
                const { data: urlData } = supabase.storage
                    .from(SUPABASE_BUCKET_NAME) // Use your constant
                    .getPublicUrl(safeFileName);

                if (!urlData || !urlData.publicUrl) {
                    throw new Error('Could not get public URL for image.');
                }

                imageUrlToSave = urlData.publicUrl; // This is the URL to save in the DB
            }

            // 3. Prepare post data for the database
            const postData: Partial<BlogPost> = {
                ...currentPost,
                featured_image: imageUrlToSave, // Save the new or existing URL
                slug: currentPost.slug || generateSlug(currentPost.title || ''),
                published_at: currentPost.published && !currentPost.published_at
                                ? new Date().toISOString()
                                : currentPost.published ? currentPost.published_at : null,
            };

            // 4. Insert or Update the post in the database
            let error;

            if (currentPost.id) {
                // Update existing post
                const { error: updateError } = await supabase
                    .from('blog_posts')
                    .update(postData)
                    .eq('id', currentPost.id);
                error = updateError;
            } else {
                // Create new post
                delete postData.id;
                const { error: insertError } = await supabase
                    .from('blog_posts')
                    .insert([postData]);
                error = insertError;
            }

            if (error) throw error;

            // 5. Success: fetch posts and reset form
            await fetchAllPosts();
            handleCancel(); // handleCancel should clear the imageFile state too
            alert('Post saved successfully!');

        } catch (error: any) {
            console.error('Error saving post:', error);
            alert(`Error saving post: ${error.message || 'Please try again.'}`);
        } finally {
            setLoading(false);
        }
 };

    const handleEdit = (post: BlogPost) => {
        setCurrentPost(post);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (postId: string | undefined) => {
        if (!postId) return;
        if (!window.confirm('Are you sure you want to delete this post permanently?')) return;

        try {
            const { error } = await supabase
                .from('blog_posts')
                .delete()
                .eq('id', postId);

            if (error) throw error;

            await fetchAllPosts();
            alert('Post deleted successfully!');
        } catch (error: any) {
            console.error('Error deleting post:', error);
            alert(`Error deleting post: ${error.message || 'Please try again.'}`);
        }
    };

    const handleCancel = () => {
        setCurrentPost({
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            featured_image: '',
            author_name: 'Krishna Flute Academy',
            author_email: '',
            published: false,
            tags: []
        });
        setIsEditing(false);
        setTagInput('');
    };

    // --- Editor View ---
    if (isEditing) {
        return (
            <div className="min-h-screen py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-yellow-50">
                <div className="max-w-4xl mx-auto">
                    {/* Back to Home Button */}
                    <div className="mb-8">
                         <button
                            onClick={() => window.location.href = '/'}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                         >
                            <Home className="w-5 h-5" />
                            <span>Back to Home</span>
                         </button>
                    </div>

                    {/* Editor Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
                                {currentPost.id ? 'Edit Post' : 'Create New Post'}
                            </h2>
                            <button
                                onClick={handleCancel}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                aria-label="Close editor"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                         <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label htmlFor="postTitle" className="block text-sm font-semibold text-blue-900 mb-2">
                                    Title *
                                </label>
                                <input
                                    id="postTitle"
                                    type="text"
                                    value={currentPost.title || ''}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                    placeholder="Enter post title"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label htmlFor="postSlug" className="block text-sm font-semibold text-blue-900 mb-2">
                                    Slug (URL)
                                </label>
                                <input
                                    id="postSlug"
                                    type="text"
                                    value={currentPost.slug || ''}
                                    onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-gray-50 text-gray-600"
                                    placeholder="auto-generated-from-title"
                                />
                                <p className="text-xs text-gray-500 mt-1">Leave blank to auto-generate from title, or enter a custom slug (use hyphens for spaces).</p>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label htmlFor="postExcerpt" className="block text-sm font-semibold text-blue-900 mb-2">
                                    Excerpt (Summary)
                                </label>
                                <textarea
                                    id="postExcerpt"
                                    value={currentPost.excerpt || ''}
                                    onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                    placeholder="Brief summary shown in post lists"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label htmlFor="postContent" className="block text-sm font-semibold text-blue-900 mb-2">
                                    Content *
                                </label>
                                <textarea
                                    id="postContent"
                                    value={currentPost.content || ''}
                                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                                    rows={15}
                                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                    placeholder="Write your blog post content here. You can use simple formatting like new lines."
                                    required
                                />
                            </div>

                            {/* --- UPDATED: Featured Image --- */}
<div>
    <label htmlFor="postImage" className="block text-sm font-semibold text-blue-900 mb-2">
        Featured Image (Optional)
    </label>
    
    {/* 1. This is now a file input */}
    <input
        type="file"
        id="postImage"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading} // Good to add this
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer disabled:opacity-50"
    />
    
    {/* 2. This whole block is new for showing a preview */}
    {(imageFile || currentPost.featured_image) && (
        <div className="mt-4 relative w-full max-w-sm">
            <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
            <img
                src={imageFile ? URL.createObjectURL(imageFile) : (currentPost.featured_image || '')}
                alt="Preview"
                className="w-full h-auto rounded-lg shadow-md object-cover"
            />
            
            {/* 3. This is the new "Remove Image" button */}
            <button
                type="button"
                onClick={handleRemoveImage}
                disabled={loading}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors disabled:opacity-50"
                aria-label="Remove image"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    )}
</div>

                             {/* Author Name */}
                            <div>
                                <label htmlFor="postAuthor" className="block text-sm font-semibold text-blue-900 mb-2">
                                    Author Name
                                </label>
                                <input
                                    id="postAuthor"
                                    type="text"
                                    value={currentPost.author_name || ''}
                                    onChange={(e) => setCurrentPost({ ...currentPost, author_name: e.target.value })}
                                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-semibold text-blue-900 mb-2">
                                    Tags
                                </label>
                                <div className="flex items-center space-x-2 mb-3">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }}}
                                        className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        placeholder="Add a tag and press Enter"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        aria-label="Add tag"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                                    {currentPost.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center space-x-1.5"
                                        >
                                            <span>{tag}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="text-blue-500 hover:text-red-600 transition-colors"
                                                aria-label={`Remove tag ${tag}`}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Published Status Toggle */}
                            <div className="flex items-center space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPost(prev => ({ ...prev, published: !prev.published }))}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        currentPost.published
                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    {currentPost.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                    <span>{currentPost.published ? 'Published' : 'Draft'}</span>
                                </button>
                                <span className="text-sm text-gray-600">
                                    {currentPost.published ? 'Visible to public' : 'Hidden from public view'}
                                </span>
                            </div>

                            {/* Save / Cancel Buttons */}
                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-blue-100">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="w-full sm:w-auto flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                >
                                    <Save className="w-5 h-5" />
                                    <span>{loading ? 'Saving...' : 'Save Post'}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- Main Admin View (List of Posts) ---
    return (
        <div className="min-h-screen py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-yellow-50">
            <div className="max-w-7xl mx-auto">
                {/* Back to Home Button */}
                <div className="mb-8">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        <span>Back to Home</span>
                    </button>
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 md:mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-1 sm:mb-2">Blog Management</h1>
                        <p className="text-base md:text-lg text-blue-700">Create, edit, and manage your blog posts</p>
                    </div>
                    <button
                        onClick={() => { setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm md:text-base"
                    >
                        <Plus className="w-5 h-5" />
                        <span>New Post</span>
                    </button>
                </div>

                {/* Posts List */}
                {fetchingPosts ? (
                    <div className="text-center py-10 text-blue-600">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16 md:py-20 bg-white rounded-2xl shadow-lg">
                        <p className="text-xl md:text-2xl text-blue-700 mb-4">No posts yet</p>
                        <p className="text-base md:text-lg text-blue-600">Click "New Post" to create your first blog post!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 md:p-6"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start">
                                    {/* Post Info */}
                                    <div className="flex-1 mb-4 sm:mb-0 sm:mr-4">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                                            <h3 className="text-xl md:text-2xl font-bold text-blue-900 leading-tight">{post.title}</h3>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    post.published
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {post.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        <p className="text-sm md:text-base text-blue-700 mb-3 line-clamp-2">{post.excerpt}</p>
                                        {Array.isArray(post.tags) && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {post.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-blue-600">
                                            <span>By {post.author_name}</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span>{post.view_count || 0} views</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                                            {post.published_at && post.published && (
                                                <>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span>Published: {new Date(post.published_at).toLocaleDateString()}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                            aria-label="Edit post"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                            aria-label="Delete post"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};