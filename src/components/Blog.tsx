import React, { useState, useEffect } from 'react';
import { Calendar, User, Eye, Tag, ArrowLeft, Home, Share2 } from 'lucide-react';
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
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [showAllTags, setShowAllTags] = useState(false); // 👈 New State
    // --- Helper: Copy Link ---
    const handleCopyLink = (e: React.MouseEvent, slug: string) => {
        e.stopPropagation();
        const url = `${window.location.origin}/?post=${slug}`;
        navigator.clipboard.writeText(url).then(() => {
            alert("Link copied to clipboard!");
        });
    };

    // --- Helper: Get Top 10 Tags ---
    const getPopularTags = () => {
        const tagCounts: Record<string, number> = {};
        
        // Count occurrences
        posts.forEach(post => {
            (post.tags || []).forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        // Return ALL tags sorted by popularity (removed .slice)
        return Object.entries(tagCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .map(([tag]) => tag);
    };

    // --- Effects ---
    useEffect(() => {
        fetchPosts();
        if (initialPostId) {
            const fetchSpecificPost = async () => {
                setLoading(true);
                try {
                    // 1. Check UUID format
                    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(initialPostId);
                    
                    let data = null;

                    // 2. Try ID if valid UUID
                    if (isUUID) {
                        const { data: idData } = await supabase.from('blog_posts').select('*').eq('id', initialPostId).maybeSingle();
                        data = idData;
                    }

                    // 3. Try Slug if no ID found
                    if (!data) {
                        const { data: slugData } = await supabase.from('blog_posts').select('*').eq('slug', initialPostId).maybeSingle();
                        data = slugData;
                    }

                    if (data) setSelectedPost(data);
                } catch (error) {
                    console.error('Error fetching specific post:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchSpecificPost();
        }
    }, [initialPostId]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false });
            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const incrementViewCount = async (postId: string) => {
        try {
            const post = posts.find(p => p.id === postId);
            if (post) await supabase.from('blog_posts').update({ view_count: post.view_count + 1 }).eq('id', postId);
        } catch (error) { console.error(error); }
    };

    const handlePostClick = (post: BlogPost) => {
        setSelectedPost(post);
        incrementViewCount(post.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const identifier = post.slug || post.id;
        window.history.pushState({}, '', `?post=${identifier}`);
    };

    const handleBack = () => {
        setSelectedPost(null);
        window.history.pushState({}, '', window.location.pathname);
        if (onBack) onBack();
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not published';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const filteredPosts = selectedTag ? posts.filter(post => post.tags.includes(selectedTag)) : posts;

    if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl text-blue-700">Loading...</div>;

    // --- SINGLE POST VIEW ---
    if (selectedPost) {
        const shareImage = selectedPost.featured_image || `${window.location.origin}/image.png`;
        const shareUrl = `${window.location.origin}/?post=${selectedPost.slug || selectedPost.id}`;

        return (
            <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
                <Helmet>
                    <title>{selectedPost.title} | Krishna Flute Academy</title>
                    <meta name="description" content={selectedPost.excerpt} />
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={selectedPost.title} />
                    <meta property="og:description" content={selectedPost.excerpt} />
                    <meta property="og:image" content={shareImage} />
                    <meta property="og:url" content={shareUrl} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={selectedPost.title} />
                    <meta name="twitter:description" content={selectedPost.excerpt} />
                    <meta name="twitter:image" content={shareImage} />
                </Helmet>

                <div className="max-w-4xl mx-auto">
                    <button onClick={handleBack} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-8 transition-colors">
                        <ArrowLeft className="w-5 h-5" /> <span>Back to all posts</span>
                    </button>
                    <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {selectedPost.featured_image && <img src={selectedPost.featured_image} alt={selectedPost.title} className="w-full h-96 object-cover" />}
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h1 className="text-4xl md:text-5xl font-bold text-blue-900">{selectedPost.title}</h1>
                                <button onClick={(e) => handleCopyLink(e, selectedPost.slug || selectedPost.id)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full" title="Share"><Share2 className="w-5 h-5" /></button>
                            </div>
                            <div className="flex flex-wrap gap-4 mb-8 text-blue-700">
                                <div className="flex items-center gap-2"><User className="w-5 h-5" /> <span>{selectedPost.author_name}</span></div>
                                <div className="flex items-center gap-2"><Calendar className="w-5 h-5" /> <span>{formatDate(selectedPost.published_at)}</span></div>
                                <div className="flex items-center gap-2"><Eye className="w-5 h-5" /> <span>{selectedPost.view_count} views</span></div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {(selectedPost.tags || []).map((tag, i) => <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{tag}</span>)}
                            </div>
                            <div className="prose prose-lg prose-blue max-w-none text-blue-800 font-montserrat [&_strong]:font-extrabold [&_strong]:text-blue-900 [&_b]:font-extrabold [&_b]:text-blue-900 [&_h1]:font-extrabold [&_h2]:font-bold [&_h3]:font-bold [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&_li::marker]:text-blue-900 [&_li::marker]:font-bold" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                        </div>
                    </article>
                </div>
            </div>
        );
    }

    // --- LIST VIEW ---
    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>Blog | Krishna Flute Academy</title>
                <meta name="description" content="Read the latest insights and flute tutorials from Krishna Flute Academy." />
                <meta property="og:title" content="Blog | Krishna Flute Academy" />
                <meta property="og:image" content={`${window.location.origin}/image.png`} />
            </Helmet>
            <Helmet>
                    <title>{selectedPost.title} | Krishna Flute Academy</title>
                    <meta name="description" content={selectedPost.excerpt} />
                    
                    {/* Open Graph / Facebook / WhatsApp */}
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={selectedPost.title} />
                    <meta property="og:description" content={selectedPost.excerpt} />
                    <meta property="og:image" content={shareImage} />
                    <meta property="og:url" content={shareUrl} />
                    
                    {/* Twitter */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={selectedPost.title} />
                    <meta name="twitter:description" content={selectedPost.excerpt} />
                    <meta name="twitter:image" content={shareImage} />
                </Helmet>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8"><button
    onClick={() => {
        // 👇 NEW: Force navigation to the clean homepage URL
        window.location.href = window.location.pathname;
    }}
    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
><Home className="w-5 h-5" /> <span>Back to Home</span></button></div>
                
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Our Blog</h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-8"></div>
                    <p className="text-xl text-blue-700 max-w-3xl mx-auto">Insights, stories, and musical wisdom from Krishna Flute Academy</p>
                </div>

                {getPopularTags().length > 0 && (
                    <div className="mb-12 text-center">
                        <div className="flex flex-wrap justify-center gap-3 mb-4">
                            {/* "All Posts" Button */}
                            <button
                                onClick={() => setSelectedTag(null)}
                                className={`px-4 py-2 rounded-full transition-all duration-300 ${selectedTag === null
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-white text-blue-600 border border-blue-200 hover:border-blue-400'
                                    }`}
                            >
                                All Posts
                            </button>

                            {/* Render Tags (Slice based on state) */}
                            {getPopularTags()
                                .slice(0, showAllTags ? undefined : 10) // Show 10 or ALL
                                .map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                                        className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 ${selectedTag === tag
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-white text-blue-600 border border-blue-200 hover:border-blue-400'
                                            }`}
                                    >
                                        <Tag className="w-4 h-4" />
                                        <span>{tag}</span>
                                    </button>
                                ))}
                        </div>

                        {/* Show More / Show Less Button */}
                        {getPopularTags().length > 10 && (
                            <button
                                onClick={() => setShowAllTags(!showAllTags)}
                                className="text-sm text-blue-600 font-semibold hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-800 transition-all mt-2"
                            >
                                {showAllTags ? 'Show Less Tags' : `Show All Tags (${getPopularTags().length})`}
                            </button>
                        )}
                    </div>
                )}

                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20"><p className="text-2xl text-blue-700">No blog posts available yet.</p></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post, index) => (
                            <article key={post.id} onClick={() => handlePostClick(post)} className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group relative" style={{ animationDelay: `${index * 100}ms` }}>
                                {post.featured_image && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <button onClick={(e) => handleCopyLink(e, post.slug || post.id)} className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" title="Copy Link"><Share2 className="w-4 h-4" /></button>
                                    </div>
                                )}
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-blue-900 mb-3 hover:text-blue-700 line-clamp-2">{post.title}</h2>
                                    <p className="text-blue-700 mb-4 line-clamp-3">{post.excerpt}</p>
                                    <div className="flex items-center justify-between text-sm text-blue-600 border-t border-blue-100 pt-4">
                                        <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /> <span>{formatDate(post.published_at)}</span></div>
                                        <div className="flex items-center space-x-2"><Eye className="w-4 h-4" /> <span>{post.view_count}</span></div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};