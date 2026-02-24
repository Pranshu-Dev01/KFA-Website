import React, { useState, useEffect } from 'react';
import { Calendar, User, Eye, Tag, ArrowLeft, Home, Share2, Search } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';
import { Helmet } from 'react-helmet-async';

interface BlogProps {
    initialPostId?: string | null;
    onBack?: () => void;
}

export const Blog: React.FC<BlogProps> = ({ initialPostId, onBack }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [showAllTags, setShowAllTags] = useState(false);

    // --- Helper: Copy Link ---
    const handleCopyLink = (e: React.MouseEvent, slug: string) => {
        e.stopPropagation();
        const url = `${window.location.origin}/?post=${slug}`;
        navigator.clipboard.writeText(url).then(() => {
            alert("Link copied to clipboard!");
        });
    };

    // --- Helper: Get Tags ---
    const getPopularTags = () => {
        const tagCounts: Record<string, number> = {};
        posts.forEach(post => {
            if (post && Array.isArray(post.tags)) {
                post.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });
        return Object.entries(tagCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .map(([tag]) => tag);
    };

    // --- Effects ---
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all published posts
                const { data: postsData, error: postsError } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('published', true)
                    .order('published_at', { ascending: false });

                if (postsError) throw postsError;

                // FIX 1: Filter out any null/invalid posts immediately
                const validPosts = (postsData || []).filter(p => p && p.title && p.id);
                setPosts(validPosts);

                // Handle initial post selection from URL
                if (initialPostId) {
                    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(initialPostId);

                    let targetPost = null;
                    if (isUUID) {
                        targetPost = validPosts.find(p => p.id === initialPostId);
                    }

                    if (!targetPost) {
                        targetPost = validPosts.find(p => p.slug === initialPostId);
                    }

                    // Fallback to direct fetch if not in the recent list
                    if (!targetPost) {
                        const { data: specificPost } = await supabase
                            .from('blog_posts')
                            .select('*')
                            .or(`id.eq.${isUUID ? initialPostId : '00000000-0000-0000-0000-000000000000'},slug.eq.${initialPostId}`)
                            .maybeSingle();

                        if (specificPost && specificPost.title) {
                            targetPost = specificPost;
                        }
                    }

                    if (targetPost) {
                        setSelectedPost(targetPost);
                        incrementViewCount(targetPost.id);
                    } else if (initialPostId) {
                        console.warn('Requested post not found');
                    }
                }
            } catch (err: any) {
                console.error('Error loading blog data:', err);
                setError(err.message || 'Failed to load blog posts');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [initialPostId]);

    const incrementViewCount = async (postId: string) => {
        try {
            const { data: current } = await supabase.from('blog_posts').select('view_count').eq('id', postId).single();
            if (current) {
                await supabase.from('blog_posts').update({ view_count: (current.view_count || 0) + 1 }).eq('id', postId);
            }
        } catch (error) {
            console.error('Error updating view count:', error);
        }
    };

    const handlePostClick = (post: BlogPost) => {
        if (!post) return;
        setSelectedPost(post);
        incrementViewCount(post.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const identifier = post.slug || post.id;
        window.history.pushState({}, '', `?post=${identifier}`);
    };

    const handleBack = () => {
        setSelectedPost(null);
        setError(null);
        window.history.pushState({}, '', window.location.pathname);
        if (onBack) onBack();
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not published';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const filteredPosts = selectedTag ? posts.filter(post => post.tags?.includes(selectedTag)) : posts;

    // --- RENDER LOGIC ---
    const renderContent = () => {
        if (loading) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xl font-semibold text-blue-700">Loading Wisdom...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-red-50 p-8 rounded-2xl shadow-lg max-w-md">
                        <Search className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-red-900 mb-2">Something went wrong</h2>
                        <p className="text-red-700 mb-6">We're having trouble loading the blog right now.</p>
                        <button onClick={handleBack} className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                            <ArrowLeft className="w-5 h-5" /> <span>Back to all posts</span>
                        </button>
                    </div>
                </div>
            );
        }

        // --- SINGLE POST VIEW ---
        if (selectedPost) {
            return (
                <div className="max-w-4xl mx-auto">
                    {/* FIX 2: Specific Helmet for Single Article */}
                    <Helmet>
                        <title>{selectedPost.title} | Krishna Flute Academy</title>
                        <meta name="description" content={selectedPost.excerpt} />

                        {/* Open Graph / Facebook / WhatsApp */}
                        <meta property="og:type" content="article" />
                        <meta property="og:title" content={selectedPost.title} />
                        <meta property="og:description" content={selectedPost.excerpt} />
                        <meta property="og:image" content={selectedPost.featured_image || `${window.location.origin}/image.png`} />
                        <meta property="og:url" content={`${window.location.origin}/?post=${selectedPost.slug || selectedPost.id}`} />

                        {/* Twitter */}
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content={selectedPost.title} />
                        <meta name="twitter:description" content={selectedPost.excerpt} />
                        <meta name="twitter:image" content={selectedPost.featured_image || `${window.location.origin}/image.png`} />
                    </Helmet>

                    <button onClick={handleBack} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-8 transition-colors group">
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> <span>Back to all posts</span>
                    </button>

                    <article className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {selectedPost.featured_image && <img src={selectedPost.featured_image} alt={selectedPost.title} className="w-full h-96 object-cover" />}
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">{selectedPost.title}</h1>
                                <button onClick={(e) => handleCopyLink(e, selectedPost.slug || selectedPost.id)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors" title="Share"><Share2 className="w-5 h-5" /></button>
                            </div>
                            <div className="flex flex-wrap gap-4 mb-8 text-blue-700">
                                <div className="flex items-center gap-2"><User className="w-5 h-5" /> <span>{selectedPost.author_name}</span></div>
                                <div className="flex items-center gap-2"><Calendar className="w-5 h-5" /> <span>{formatDate(selectedPost.published_at)}</span></div>
                                <div className="flex items-center gap-2"><Eye className="w-5 h-5" /> <span>{selectedPost.view_count} views</span></div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {(selectedPost.tags || []).map((tag, i) => <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{tag}</span>)}
                            </div>
                            <div className="prose prose-lg prose-blue max-w-none text-blue-800 font-montserrat [&_strong]:font-extrabold [&_strong]:text-blue-900 [&_b]:font-extrabold [&_b]:text-blue-900 [&_h1]:font-extrabold [&_h2]:font-bold [&_h3]:font-bold [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&_li::marker]:text-blue-900 [&_li::marker]:font-bold tiptap" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                        </div>
                    </article>
                </div>
            );
        }

        // --- BLOG LIST VIEW ---
        return (
            <div className="max-w-7xl mx-auto">
                {/* FIX 3: Generic Helmet for List View */}
                <Helmet>
                    <title>Blog | Krishna Flute Academy</title>
                    <meta name="description" content="Read the latest insights and flute tutorials from Krishna Flute Academy." />

                    {/* Open Graph / Facebook / WhatsApp */}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="Blog | Krishna Flute Academy" />
                    <meta property="og:description" content="Read the latest insights and flute tutorials from Krishna Flute Academy." />
                    <meta property="og:image" content={`${window.location.origin}/image.png`} />
                    <meta property="og:url" content={window.location.href} />

                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Blog | Krishna Flute Academy" />
                    <meta name="twitter:description" content="Read the latest insights and flute tutorials from Krishna Flute Academy." />
                    <meta name="twitter:image" content={`${window.location.origin}/image.png`} />
                </Helmet>

                <div className="mb-8">
                    <button
                        onClick={() => window.location.href = window.location.pathname}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md active:scale-95"
                    >
                        <Home className="w-5 h-5" /> <span>Back to Home</span>
                    </button>
                </div>

                <div className="text-center mb-16 animate-in fade-in duration-700">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 mb-6 tracking-tight">Our Blog</h1>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-yellow-400 to-blue-500 mx-auto mb-8 rounded-full"></div>
                    <p className="text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed font-medium italic">Insights, stories, and musical wisdom from Krishna Flute Academy</p>
                </div>

                {getPopularTags().length > 0 && (
                    <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-500 delay-150">
                        <div className="flex flex-wrap justify-center gap-3 mb-4">
                            <button
                                onClick={() => setSelectedTag(null)}
                                className={`px-5 py-2 rounded-full transition-all duration-300 font-medium ${selectedTag === null ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-blue-600 border border-blue-200 hover:border-blue-400'}`}
                            >
                                All Posts
                            </button>
                            {getPopularTags().slice(0, showAllTags ? undefined : 10).map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                                    className={`px-5 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 font-medium ${selectedTag === tag ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-blue-600 border border-blue-200 hover:border-blue-400'}`}
                                >
                                    <Tag className="w-4 h-4" />
                                    <span>{tag}</span>
                                </button>
                            ))}
                        </div>
                        {getPopularTags().length > 10 && (
                            <button onClick={() => setShowAllTags(!showAllTags)} className="text-sm text-blue-600 font-bold hover:text-blue-800 transition-all hover:underline underline-offset-4">
                                {showAllTags ? 'Show Less Tags' : `Show All Tags (${getPopularTags().length})`}
                            </button>
                        )}
                    </div>
                )}

                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20 bg-blue-50 rounded-3xl animate-in zoom-in duration-500">
                        <p className="text-2xl font-bold text-blue-900">No blog posts available yet.</p>
                        <p className="text-blue-600 mt-2">Check back soon for new articles!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredPosts.map((post, index) => {
                            // FIX 4: Safety Check - Skip invalid posts inside loop
                            if (!post || !post.title) return null;

                            return (
                                <article key={post.id || index} onClick={() => handlePostClick(post)} className="bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-[1.03] transition-all duration-300 hover:shadow-2xl group flex flex-col h-full ring-1 ring-blue-50" style={{ animationDelay: `${index * 50}ms` }}>
                                    {post.featured_image && (
                                        <div className="relative h-56 overflow-hidden">
                                            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <button onClick={(e) => handleCopyLink(e, post.slug || post.id)} className="absolute top-4 right-4 p-2.5 bg-white/95 hover:bg-white text-blue-600 rounded-full shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10" title="Copy Link"><Share2 className="w-5 h-5" /></button>
                                        </div>
                                    )}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex gap-2 mb-4">
                                            {post.tags?.slice(0, 2).map((tag, i) => (
                                                <span key={i} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-md ring-1 ring-blue-100">{tag}</span>
                                            ))}
                                        </div>
                                        <h2 className="text-2xl font-extrabold text-blue-900 mb-4 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight">{post.title}</h2>
                                        <p className="text-blue-700 mb-6 line-clamp-3 leading-relaxed font-medium">{post.excerpt}</p>
                                        <div className="mt-auto flex items-center justify-between text-xs font-bold text-blue-500/80 border-t border-blue-50 pt-6">
                                            <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /> <span>{formatDate(post.published_at)}</span></div>
                                            <div className="flex items-center space-x-2"><Eye className="w-4 h-4" /> <span>{post.view_count} views</span></div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50/50">
            {renderContent()}
        </div>
    );
};