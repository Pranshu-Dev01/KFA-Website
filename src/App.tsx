import { useState, useEffect, lazy, Suspense } from 'react';
import { Music, Download, Users, Award, Phone, Mail, MapPin, Star, SignalLow, SignalMedium, SignalHigh, BookOpen, Heart, Sparkles, Facebook, Instagram, Youtube, MessageSquare, ChevronRight, Menu, X, Lock, ExternalLink, Share2, User, Play } from 'lucide-react';

const Blog = lazy(() => import('./components/Blog').then(module => ({ default: module.Blog })));
const BlogAdmin = lazy(() => import('./components/BlogAdmin').then(module => ({ default: module.BlogAdmin })));
import { supabase, BlogPost, GalleryItem } from './lib/supabase';
import { GalleryFull } from './components/GalleryFull';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
const heroImages = [
    '/Toppic.jpg',
    '/hero-image-1.jpg', // Add your second image
    '/hero-image-2.jpg', // Add your third image
    // Add more images as needed
];
// Blog Section Component
// Blog Section Component
const BlogSection = ({
    visible,
    posts,
    onViewAll,
    onReadPost
}: {
    visible: boolean;
    posts: BlogPost[];
    onViewAll: () => void;
    onReadPost: (id: string) => void;
}) => {

    // 👇 Helper to copy link without opening the post
    const handleCopyLink = (e: React.MouseEvent, slug: string) => {
        e.stopPropagation();
        const url = `${window.location.origin}/?post=${slug}`;
        navigator.clipboard.writeText(url).then(() => alert("Link copied to clipboard!"));
    };

    if (!posts || posts.length === 0) {
        return (
            <section id="blog" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-blue-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className={`text-center mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-4">Our Latest Insights</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-yellow-500 to-blue-500 mx-auto mb-6"></div>
                        <p className="text-lg md:text-xl text-blue-700 max-w-3xl mx-auto">Check back soon for articles.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="blog" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-blue-50/50">
            <div className="max-w-7xl mx-auto">
                <div className={`text-center mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-4">Our Latest Insights</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-yellow-500 to-blue-500 mx-auto mb-6"></div>
                    <p className="text-lg md:text-xl text-blue-700 max-w-3xl mx-auto">In-depth articles and guides from our master musicians.</p>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scroll-smooth no-scrollbar">
                    {posts.map((post, index) => (
                        <div
                            key={post.id}
                            onClick={() => onReadPost(post.id)}
                            className={`relative block bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl group cursor-pointer 
                                flex-shrink-0 w-[85vw] sm:w-[350px] md:w-[400px] snap-center
                                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {post.featured_image && (
                                <div className="relative h-48 overflow-hidden">
                                    <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/20 transition-all"></div>
                                    <button onClick={(e) => handleCopyLink(e, post.slug || post.id)} className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" title="Copy Link">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <div className="p-6 space-y-3">
                                <h3 className="text-xl lg:text-2xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors line-clamp-2 whitespace-normal">{post?.title || 'Untitled Post'}</h3>
                                <p className="text-sm md:text-base text-blue-800 leading-relaxed line-clamp-3 whitespace-normal">{post?.excerpt || ''}</p>
                                <div className="flex items-center justify-between text-xs text-blue-600 pt-2">
                                    <span>{post?.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recent'}</span>
                                    <span className="flex items-center space-x-1"><span>{post?.view_count || 0} views</span></span>
                                </div>
                                <span className="flex items-center space-x-2 text-sm font-semibold text-yellow-600 group-hover:text-yellow-700 transition-colors pt-2">
                                    <span>Read Article</span><ChevronRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button onClick={onViewAll} className="bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-800 transition-all shadow-xl">
                        Explore All Articles <BookOpen className="inline-block w-5 h-5 ml-2" />
                    </button>
                </div>
            </div>
        </section>
    );
};

function App() {
    const params = new URLSearchParams(window.location.search);
    const postFromUrl = params.get('post');


    const [scrolled, setScrolled] = useState(false);
    const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
    const [currentView, setCurrentView] = useState<'home' | 'blog' | 'admin' | 'gallery'>(postFromUrl ? 'blog' : 'home');
    const [recentBlogPosts, setRecentBlogPosts] = useState<BlogPost[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(postFromUrl);
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formCourse, setFormCourse] = useState('Select a course');
    const [formMessage, setFormMessage] = useState('');
    const [activeEvent, setActiveEvent] = useState<{ title: string, registration_link: string, image_url?: string, button_text?: string, description?: string } | null>(null);
    const [showEventPopup, setShowEventPopup] = useState(false);
    const [bannerClosed, setBannerClosed] = useState(false);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

    const getYouTubeThumbnail = (url: string) => {
        let id = '';
        if (url.includes('youtube.com/embed/')) {
            id = url.split('embed/')[1].split('?')[0];
        } else if (url.includes('youtube.com/watch?v=')) {
            id = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            id = url.split('/').pop()?.split('?')[0] || '';
        }
        return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
    };



    // 1. Unified Scroll & Visibility Listener
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            const sections = ['about', 'founder', 'courses', 'contact', 'flutes', 'gallery', 'blog'];
            const newVisibleSections: Record<string, boolean> = {};
            sections.forEach(sectionId => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const isInViewport = rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
                    newVisibleSections[sectionId] = isInViewport;
                }
            });
            setVisibleSections(newVisibleSections);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 2. Fetch All Data on Load
    useEffect(() => {
        const fetchData = async () => {
            // A. Fetch Blog Posts
            const { data: posts } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('published', true)
                .order('published_at', { ascending: false })
                .limit(3);
            if (posts) {
                // Strict filtering for valid blog posts
                const validPosts = posts.filter(p => p && typeof p === 'object' && p.title && p.id);
                setRecentBlogPosts(validPosts);
            }

            // B. Fetch Active Event
            const { data: eventData } = await supabase
                .from('events')
                .select('title, registration_link, image_url, button_text, description')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (eventData) {
                setActiveEvent(eventData);
                setTimeout(() => setShowEventPopup(true), 5000);
            }

            // C. Fetch Testimonials
            const { data: reviews } = await supabase
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);
            if (reviews) {
                const validReviews = reviews.filter(r => r && typeof r === 'object' && r.name && r.content);
                setTestimonials(validReviews);
            }

            // D. Fetch Gallery Items
            const { data: gallery } = await supabase
                .from('gallery_items')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });
            if (gallery) {
                const validGallery = gallery.filter(g => g && typeof g === 'object' && g.url);
                setGalleryItems(validGallery);
            }
        };
        fetchData();
    }, []);

    // 3. Admin Shortcut
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'A') {
                event.preventDefault();
                setShowAdminLogin(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    const socialLinks = {
        facebook: 'https://www.facebook.com/krishnafluteacademy/',
        instagram: 'https://www.instagram.com/krishnafluteacademy?igsh=MWw0NjZsNms2czN1aw==',
        youtube: 'https://www.youtube.com/@krishnafluteacademy'
    };

    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.3510000000003!2d77.656832!3d12.885108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6ca3e5e5e5e5%3A0x8e5e5e5e5e5e5e5e!2sElectronic%20City%20Phase%201%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin";
    const mapLinkUrl = `https://maps.app.goo.gl/Xumte2BGx8FwLijg8`;
    // 1. Use the 'wa.me' format which is more reliable for mobile apps
    // Use the 'wa.me' format which is more reliable for mobile apps
    const whatsappNumber = '919836952545';
    const baseWhatsappUrl = `https://wa.me/${whatsappNumber}?text=`;

    const handleWhatsAppSubmit = async () => {
        // 1. Validate simple fields
        if (!formName || !formPhone) {
            alert("Please enter your Name and Phone number.");
            return;
        }

        // 2. Save the ACTUAL form data to Supabase
        // We don't use 'await' here so the user isn't delayed (Fire and forget)
        supabase
            .from('inquiries')
            .insert([{
                name: formName,
                email: formEmail,
                phone: formPhone,
                course: formCourse,
                message: formMessage
            }])
            .then(({ error }) => {
                if (error) console.error('Error saving inquiry:', error);
            });

        // 3. Prepare Message for WhatsApp
        const messageDetails = `
Hello Krishna Flute Academy, I have an inquiry!

*Name:* ${formName}
*Email:* ${formEmail}
*Phone:* ${formPhone}
*Course Interest:* ${formCourse}
*Message:* ${formMessage}
        `.trim();

        const finalWhatsappUrl = `${baseWhatsappUrl}${encodeURIComponent(messageDetails)}`;

        // 4. Open WhatsApp
        window.location.href = finalWhatsappUrl;
    };

    const handleAdminLogin = () => {
        if (adminPassword === 'kfa-admin-2025') {
            setIsAdmin(true);
            setShowAdminLogin(false);
            setAdminPassword('');
            setCurrentView('admin');
        } else {
            alert('Invalid admin password');
        }
    };

    const handleAdminLogout = () => {
        setIsAdmin(false);
        setCurrentView('home');
    };

    const renderHomeView = () => {
        // 👇 Define the logic here
        const isBannerVisible = activeEvent && !bannerClosed;

        return (
            <div className="overflow-x-hidden">
                {/* 1. TOP BANNER (FIXED) */}
                {/* 👇 1. TOP BANNER */}
                {isBannerVisible && (
                    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-4 py-2 md:py-3 shadow-lg flex justify-between items-center h-12 md:h-14 animate-slideDown">
                        <div className="flex-1 flex items-center justify-center gap-2 md:gap-4">
                            {/* 👇 CHANGED: Show Image if available, otherwise show Sparkles */}
                            {activeEvent?.image_url ? (
                                <img
                                    src={activeEvent.image_url}
                                    alt="Event"
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white/50"
                                />
                            ) : (
                                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-200 animate-pulse" />
                            )}

                            <span className="text-xs md:text-sm font-bold uppercase tracking-wide truncate max-w-[200px] md:max-w-none">
                                {activeEvent?.title}
                            </span>

                            <a
                                href={activeEvent?.registration_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-red-600 text-xs md:text-sm font-extrabold px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-sm hover:bg-gray-100 transition-transform transform hover:scale-105 flex items-center gap-1"
                            >
                                {/* 👇 Use dynamic text, fallback to 'Register Now' */}
                                {activeEvent.button_text || 'Register Now'}
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                        <button
                            onClick={() => setBannerClosed(true)}
                            className="ml-2 bg-black/20 p-1 rounded-full hover:bg-black/30 transition-colors"
                            aria-label="Close Banner"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                {/* Navigation */}
                <nav
                    className={`fixed w-full z-50 transition-all duration-300 
                    ${isBannerVisible ? 'top-12 md:top-14' : 'top-0'} 
                    ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-white/90 backdrop-blur-md shadow-lg py-3'}
                `}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo Section - Left */}
                            <div className="flex items-center space-x-3">
                                <img
                                    src={'/image.png'}
                                    alt="Krishna Flute Academy Logo"
                                    className="h-10 w-10 md:h-12 md:w-12 object-contain"
                                />
                                <span className="text-base md:text-lg font-bold text-blue-900">Krishna Flute Academy</span>
                            </div>

                            {/* Desktop Menu - Center */}
                            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                                <button onClick={() => scrollToSection('about')} className="text-blue-700 hover:text-blue-900 transition-colors text-sm lg:text-base font-medium">About</button>
                                <button onClick={() => scrollToSection('founder')} className="text-blue-700 hover:text-blue-900 transition-colors text-sm lg:text-base font-medium">Founder</button>
                                <button onClick={() => scrollToSection('courses')} className="text-blue-700 hover:text-blue-900 transition-colors text-sm lg:text-base font-medium">Courses</button>
                                <button onClick={() => setCurrentView('gallery')} className="text-blue-700 hover:text-blue-900 transition-colors text-sm lg:text-base font-medium">Gallery</button>
                                <button onClick={() => setCurrentView('blog')} className="text-blue-700 hover:text-blue-900 transition-colors text-sm lg:text-base font-medium">Blog</button>
                                <button onClick={() => scrollToSection('contact')} className="text-blue-700 hover:text-blue-900 transition-colors text-sm lg:text-base font-medium">Contact</button>
                            </div>

                            {/* Right Section - Social Icons & Menu */}
                            <div className="flex items-center space-x-3 md:space-x-4">
                                {/* Social Icons */}
                                <div className="hidden sm:flex items-center space-x-2">
                                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-9 md:h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-110">
                                        <Facebook className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                    </a>
                                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                                        <Instagram className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                    </a>
                                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-9 md:h-9 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300 transform hover:scale-110">
                                        <Youtube className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                    </a>
                                </div>

                                {/* Mobile Menu Button */}
                                <button
                                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                >
                                    {mobileMenuOpen ? <X className="w-6 h-6 text-blue-900" /> : <Menu className="w-6 h-6 text-blue-900" />}
                                </button>

                                {/* Admin Section */}
                                {isAdmin && (
                                    <div className="hidden md:flex items-center space-x-2">
                                        <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">Admin</span>
                                        <button
                                            onClick={handleAdminLogout}
                                            className="text-xs text-red-600 hover:text-red-800 transition-colors px-2 py-1 rounded hover:bg-red-50"
                                            title="Logout from admin"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className={`fixed inset-0 z-[55] md:hidden ${isBannerVisible ? 'top-12 md:top-14' : 'top-0'}`}>
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Mobile Menu Panel */}
                        <div className="absolute top-0 right-0 w-3/4 max-w-sm h-full bg-white shadow-2xl transform transition-transform duration-300">
                            <div className="p-6">
                                {/* Close Button */}
                                <div className="flex justify-end mb-8">
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Mobile Menu Items */}
                                <div className="space-y-6">
                                    <button
                                        onClick={() => { scrollToSection('about'); setMobileMenuOpen(false); }}
                                        className="block w-full text-left text-lg font-semibold text-blue-900 hover:text-blue-700 transition-colors py-2"
                                    >
                                        About
                                    </button>
                                    <button
                                        onClick={() => { scrollToSection('founder'); setMobileMenuOpen(false); }}
                                        className="block w-full text-left text-lg font-semibold text-blue-900 hover:text-blue-700 transition-colors py-2"
                                    >
                                        Founder
                                    </button>
                                    <button
                                        onClick={() => { scrollToSection('courses'); setMobileMenuOpen(false); }}
                                        className="block w-full text-left text-lg font-semibold text-blue-900 hover:text-blue-700 transition-colors py-2"
                                    >
                                        Courses
                                    </button>
                                    <button
                                        onClick={() => { setCurrentView('gallery'); setMobileMenuOpen(false); }}
                                        className="block w-full text-left text-lg font-semibold text-blue-900 hover:text-blue-700 transition-colors py-2"
                                    >
                                        Gallery
                                    </button>
                                    <button
                                        onClick={() => { setCurrentView('blog'); setMobileMenuOpen(false); }}
                                        className="block w-full text-left text-lg font-semibold text-blue-900 hover:text-blue-700 transition-colors py-2"
                                    >
                                        Blog
                                    </button>
                                    <button
                                        onClick={() => { scrollToSection('contact'); setMobileMenuOpen(false); }}
                                        className="block w-full text-left text-lg font-semibold text-blue-900 hover:text-blue-700 transition-colors py-2"
                                    >
                                        Contact
                                    </button>

                                    {/* Mobile Social Icons */}
                                    <div className="pt-6 border-t border-gray-200">
                                        <div className="flex space-x-4">
                                            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300">
                                                <Facebook className="w-5 h-5 text-white" />
                                            </a>
                                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300">
                                                <Instagram className="w-5 h-5 text-white" />
                                            </a>
                                            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300">
                                                <Youtube className="w-5 h-5 text-white" />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Admin Section in Mobile Menu */}
                                    {isAdmin && (
                                        <div className="pt-6 border-t border-gray-200">
                                            <div className="space-y-3">
                                                <span className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded">Admin</span>
                                                <button
                                                    onClick={handleAdminLogout}
                                                    className="block w-full text-left text-sm text-red-600 hover:text-red-800 transition-colors px-3 py-2 rounded hover:bg-red-50"
                                                >
                                                    Logout from Admin
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}



                {/* 👇 NEW EVENT POPUP MODAL */}
                {/* 4. POPUP MODAL (Dynamic Content) */}
                {showEventPopup && activeEvent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowEventPopup(false)}></div>
                        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
                            <button onClick={() => setShowEventPopup(false)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 z-10"><X className="w-5 h-5" /></button>
                            {activeEvent.image_url && <img src={activeEvent.image_url} alt={activeEvent.title} className="w-full h-auto object-cover" />}
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-bold text-blue-900 mb-2">{activeEvent.title}</h3>
                                <p className="text-gray-600 mb-6 text-sm">{activeEvent.description || "Join us for this special event!"}</p>
                                <a href={activeEvent.registration_link} target="_blank" rel="noopener noreferrer" className="block w-full bg-yellow-500 text-blue-900 font-extrabold py-3 rounded-full shadow-lg hover:bg-yellow-400 transition-transform transform hover:scale-105">
                                    {activeEvent.button_text || 'Register Now'}
                                </a>
                            </div>
                        </div>
                    </div>
                )}
                {/* Hero Section - Carousel */}
                <section className={`relative overflow-hidden transition-all duration-300
                ${isBannerVisible ? 'pt-28 md:pt-34' : 'pt-16 md:pt-20'} 
                pb-0 px-0 sm:px-0`}
                >
                    <Carousel
                        autoPlay={true}
                        infiniteLoop={true}
                        showThumbs={false}
                        showStatus={false}
                        interval={5000}
                        className="w-full"
                    >
                        {heroImages.map((imageUrl, index) => (
                            <div
                                key={index}
                                className="relative w-full h-[350px] sm:h-[450px] md:h-[550px]"
                            >
                                {/* Background Image */}
                                <img
                                    src={imageUrl}
                                    alt={`Hero Slide ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    loading={index === 0 ? "eager" : "lazy"}
                                />

                                {/* Semi-transparent black overlay */}
                                <div className="absolute inset-0 bg-black/40"></div>

                                {/* --- Common layout for all slides (Left aligned) --- */}
                                <div className="absolute inset-0 flex flex-col justify-center items-start text-left text-white p-6 sm:p-12 md:pl-24 font-montserrat z-10">
                                    <div className="space-y-2 md:space-y-4">

                                        {/* Slide 1 */}
                                        {index === 0 && (
                                            <>
                                                <p className="text-xs md:text-2xl font-light tracking-[0.35em] uppercase text-gray-300">
                                                    LEARN FLUTE
                                                </p>

                                                <h1 className="text-3xl sm:text-5xl md:text-7xl leading-tight">
                                                    <span className="font-bold" style={{ fontFamily: 'var(--font-geometric)', fontWeight: 600, letterSpacing: '-0.01em' }}>Krishna</span>
                                                    <br />
                                                    <span className="font-bold" style={{ fontFamily: 'var(--font-geometric)', fontWeight: 600, letterSpacing: '-0.01em' }}>
                                                        Flute Academy
                                                    </span>
                                                </h1>

                                                <p className="text-sm md:text-xl font-medium text-yellow-400 tracking-wide">
                                                    With Krishna Gopal Bhaumik
                                                </p>
                                            </>
                                        )}
                                        {index === 1 && (
                                            <>
                                                <p className="text-xs md:text-2xl font-light tracking-[0.35em] uppercase text-gray-300">
                                                    LEARN FLUTE
                                                </p>

                                                <h1 className="text-xl sm:text-5xl md:text-7xl leading-tight">
                                                    <span className="font-serif italic font-light">
                                                        Turn Your Breath
                                                    </span>
                                                    <br />
                                                    <span className="font-bold" style={{ fontFamily: 'var(--font-geometric)', fontWeight: 600, letterSpacing: '-0.01em' }}>Into Tune</span>
                                                </h1>

                                                <p className="text-xs md:text-xl font-medium text-yellow-400 tracking-wide">
                                                    With Krishna Gopal Bhaumik
                                                </p>
                                            </>
                                        )}
                                        {index === 2 && (
                                            <>
                                                <p className="text-xs md:text-2xl font-light tracking-[0.35em] uppercase text-gray-300">
                                                    LEARN FLUTE
                                                </p>

                                                <h1 className="text-2xl sm:text-5xl md:text-7xl leading-tight">
                                                    <span className="font-serif italic font-light">
                                                        From Basics
                                                    </span>
                                                    <br />

                                                    <span className="font-bold" style={{ fontFamily: 'var(--font-geometric)', fontWeight: 600, letterSpacing: '-0.01em' }}>To Advanced
                                                    </span>
                                                </h1>

                                                <p className="text-sm md:text-xl font-medium text-yellow-400 tracking-wide">
                                                    With Krishna Gopal Bhaumik
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </section>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

                {/* About Section */}
                <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
                    <div className="max-w-6xl mx-auto">
                        <div className={`text-center mb-16 transform transition-all duration-1000 ${visibleSections['about'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Why Choose Us</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-8"></div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                            <div className={`space-y-4 md:space-y-6 transform transition-all duration-1000 delay-200 ${visibleSections['about'] ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                                <p className="text-base md:text-lg text-blue-800 leading-loose max-w-prose">
                                    Our commitment goes beyond weekly lessons. We host immersive <strong>Workshops and Weekly Challenges</strong> designed specifically to keep students motivated and focused on rapid improvement.
                                </p>

                                <p className="text-base md:text-lg text-blue-800 leading-loose max-w-prose">
                                    More importantly, we provide consistent opportunities for <strong>stage performance</strong>, including participation in events like the Flute and Fest. This real-world experience is fundamental to enhancing skills, building confidence, and ensuring sustained engagement in the student's musical development.
                                </p>
                            </div>

                            <div className={`relative transform transition-all duration-1000 delay-400 ${visibleSections['about'] ? 'translate-y-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                                <div className="bg-gradient-to-br from-blue-200 to-yellow-200 rounded-2xl p-6 md:p-8 shadow-xl transition-all duration-500">
                                    <Music className="w-12 h-12 md:w-16 md:h-16 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-xl md:text-2xl font-bold text-blue-900 text-center mb-4">Our Mission</h3>
                                    <p className="text-sm md:text-base text-blue-800 text-center leading-relaxed">
                                        To spread the divine beauty of Krishna's flute music, touching hearts and souls through the power of melody, rhythm, and spiritual connection.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-16">
                            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-lg transform hover:scale-105 transition-all duration-300">
                                <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2" />
                                <div className="text-xl md:text-2xl font-bold text-blue-900">500+</div>
                                <div className="text-sm md:text-base text-blue-700">Students Taught</div>
                            </div>

                            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-lg transform hover:scale-105 transition-all duration-300">
                                <Award className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2" />
                                <div className="text-xl md:text-2xl font-bold text-blue-900">50+</div>
                                <div className="text-sm md:text-base text-blue-700">Workshops and events Hosted</div>
                            </div>

                            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-lg transform hover:scale-105 transition-all duration-300">
                                <Music className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2" />
                                <div className="text-xl md:text-2xl font-bold text-blue-900">100+</div>
                                <div className="text-sm md:text-base text-blue-700">Performances and Collaborations</div>
                            </div>

                            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-lg transform hover:scale-105 transition-all duration-300">
                                <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 mx-auto mb-2" />
                                <div className="text-xl md:text-2xl font-bold text-blue-900">4.8 ★</div>
                                <div className="text-sm md:text-base text-blue-700">Google Student Rating</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Founder Section */}
                <section id="founder" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className={`text-center mb-12 md:mb-16 transform transition-all duration-1000 ${visibleSections['founder'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-4 md:mb-6">Our Guru</h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-6 md:mb-8"></div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                            <div className={`relative transform transition-all duration-1000 delay-200 ${visibleSections['founder'] ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                                <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                                    <img
                                        src={'/guru.jpg'}
                                        alt="Founder of Krishna Flute Academy"
                                        className="w-full h-auto object-center block"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent rounded-2xl"></div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full p-3 md:p-4 shadow-xl animate-pulse">
                                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                </div>
                            </div>

                            <div className={`space-y-4 md:space-y-6 transform transition-all duration-1000 delay-400 ${visibleSections['founder'] ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                                <h3 className="text-2xl md:text-3xl font-bold text-blue-900">Master Musician & Educator</h3>
                                <p className="text-base md:text-lg text-blue-800 leading-loose max-w-prose">
                                    A <strong>dedicated and passionate Indian classical flutist</strong>, <strong>Sri Krishna Gopal Bhaumik</strong> brings over <strong>20 years of teaching and performance experience</strong> to his students. Trained under the guidance of <strong>renowned gurus Sri Bishwajit Sarkar and Sri Ashok Kumar Karmakar</strong>, he has mastered multiple musical styles — from <strong>Indian classical and folk</strong> to <strong>Rabindrasangeet, contemporary, and Bollywood music</strong>. His mission is to <strong>inspire and nurture students</strong> through structured learning that balances <strong>traditional depth with modern creativity</strong>, while fostering a <strong>lifelong appreciation for India's rich musical heritage</strong>.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
                                    <div className="space-y-2 md:space-y-3 bg-gradient-to-br from-blue-100 to-yellow-100 p-4 rounded-lg shadow-md">
                                        <h4 className="text-lg md:text-xl font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                                            <Award className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                                            <span>Key Achievements</span>
                                        </h4>
                                        <div className="flex items-start space-x-2 md:space-x-3 text-blue-700">
                                            <Music className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mt-1 flex-shrink-0" />
                                            <span className="text-sm md:text-base">Featured artist on TV channels like Kannada Doordarshan and Tara Bangla</span>
                                        </div>
                                        <div className="flex items-start space-x-2 md:space-x-3 text-blue-700">
                                            <Music className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mt-1 flex-shrink-0" />
                                            <span className="text-sm md:text-base">Performed in prestigious music events across India</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:space-y-3 bg-gradient-to-br from-blue-100 to-yellow-100 p-4 rounded-lg shadow-md">
                                        <h4 className="text-lg md:text-xl font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                                            <Star className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                                            <span>Core Expertise</span>
                                        </h4>
                                        <div className="flex items-center space-x-2 md:space-x-3 text-blue-700">
                                            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 flex-shrink-0" />
                                            <span className="text-sm md:text-base">Classical & Contemporary Flute Performance</span>
                                        </div>
                                        <div className="flex items-center space-x-2 md:space-x-3 text-blue-700">
                                            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 flex-shrink-0" />
                                            <span className="text-sm md:text-base">Music Theory & Instrumental Training</span>
                                        </div>
                                        <div className="flex items-center space-x-2 md:space-x-3 text-blue-700">
                                            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 flex-shrink-0" />
                                            <span className="text-sm md:text-base">Rabindrasangeet & Bollywood Music</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Flutes Section */}
                <section id="flutes" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className={`text-center mb-12 md:mb-16 transform transition-all duration-1000 ${visibleSections['flutes'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-4 md:mb-6">Handcrafted Flutes</h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-yellow-500 to-blue-500 mx-auto mb-6 md:mb-8"></div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10">
                            <div className={`md:w-1/2 transform transition-all duration-1000 delay-200 ${visibleSections['flutes'] ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                                <img
                                    src={'/flutes_custom.jpg'}
                                    alt="Handcrafted Flutes"
                                    className="w-full rounded-xl shadow-2xl"
                                    loading="lazy"
                                />
                            </div>
                            <div className={`md:w-1/2 space-y-4 md:space-y-6 transform transition-all duration-1000 delay-400 ${visibleSections['flutes'] ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                                <p className="text-2xl md:text-3xl font-semibold text-blue-900">
                                    🎵 Handcrafted Flutes Tailored to Perfection
                                </p>
                                <p className="text-base md:text-lg text-blue-800 leading-loose max-w-prose">
                                    At Krishna Flute Academy, we believe the flute is not just an instrument — it's an extension of the artist's soul. Each bansuri is handcrafted from premium Assam bamboo, carefully selected for its tonal richness and durability. Every flute is precision-tuned to match the student's playing style and comfort, ensuring perfect pitch, smooth airflow, and superior sound quality. This personalized approach allows learners to experience music with clarity, ease, and a deeper emotional connection to their instrument.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Blog Section */}
                <BlogSection
                    visible={visibleSections['blog']}
                    posts={recentBlogPosts}
                    onViewAll={() => setCurrentView('blog')}
                    onReadPost={(id) => {
                        setSelectedPostId(id);    // 1. Save the specific Post ID
                        setCurrentView('blog');   // 2. Switch to the Blog view
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // 3. Scroll to top
                    }}
                />

                {/* Gallery Section */}
                <section id="gallery" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/50 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className={`text-center mb-12 md:mb-16 transform transition-all duration-1000 ${visibleSections['gallery'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-4 md:mb-6">Gallery</h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-6 md:mb-8"></div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-2 sm:px-0">
                            {(() => {
                                const staticEmbeds = [

                                    "https://www.youtube.com/embed/1SF2AYK_Y-U?si=9QssT5N4X6GrE8yp",
                                    "https://www.youtube.com/embed/jrz4YTyANsE",
                                    "https://www.youtube.com/embed/OlPvQ2ojRcU",
                                    "https://www.youtube.com/embed/XsvP3Ol72x0",
                                    "https://www.youtube.com/embed/UEaQLUkPA_I",
                                    "https://www.youtube.com/embed/-kk1RtiPcZ4",
                                    "https://www.youtube.com/embed/islvJvQOcN4",
                                    "https://www.youtube.com/embed/rRl_fMQ5KJU",
                                    "https://www.youtube.com/embed/it8A9OVHp7o",
                                    "https://www.youtube.com/embed/1lcKaTXy8Ko"
                                ];

                                // Merge dynamic items (up to 8) with static embeds to reach exactly 8 items
                                const displayItems = [
                                    ...galleryItems.slice(0, 8).map(item => ({ type: 'dynamic', content: item })),
                                    ...(galleryItems.length < 8
                                        ? staticEmbeds.slice(0, 8 - galleryItems.length).map(url => ({ type: 'static', content: url }))
                                        : [])
                                ];

                                return displayItems.map((item, index) => {
                                    if (item.type === 'dynamic') {
                                        const gItem = item.content as GalleryItem;
                                        return (
                                            <div
                                                key={gItem.id}
                                                onClick={() => setSelectedGalleryItem(gItem)}
                                                className={`relative w-full h-48 sm:h-56 bg-white rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-all duration-500 cursor-pointer ${visibleSections['gallery'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                                style={{ transitionDelay: `${index * 100}ms` }}
                                            >
                                                {gItem.media_type === 'image' ? (
                                                    <img src={gItem.url} alt={gItem.title || ''} className="w-full h-full object-cover" loading="lazy" />
                                                ) : gItem.media_type === 'video-url' ? (
                                                    <div className="relative w-full h-full bg-gray-100">
                                                        <img
                                                            src={getYouTubeThumbnail(gItem.url) || ''}
                                                            alt={gItem.title || ''}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all">
                                                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                                                <Play className="w-6 h-6 text-blue-600 ml-1 fill-current" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="relative w-full h-full">
                                                        {gItem.thumbnail_url ? (
                                                            <img src={gItem.thumbnail_url} alt={gItem.title || ''} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <video
                                                                src={`${gItem.url}#t=1`}
                                                                className="w-full h-full object-cover"
                                                                preload="metadata"
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all">
                                                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                                                <Play className="w-6 h-6 text-blue-600 ml-1 fill-current" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {gItem.title && (
                                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                                        <p className="text-white font-medium truncate">{gItem.title}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    } else {
                                        const embedUrl = item.content as string;
                                        return (
                                            <div
                                                key={`static-${index}`}
                                                className={`relative w-full h-48 sm:h-56 bg-white rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-all duration-500 cursor-pointer ${visibleSections['gallery'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                                onClick={() => setSelectedGalleryItem({
                                                    id: `static-${index}`,
                                                    url: embedUrl,
                                                    media_type: 'video-url',
                                                    thumbnail_url: null,
                                                    title: null,
                                                    description: null,
                                                    is_active: true,
                                                    sort_order: 100,
                                                    created_at: new Date().toISOString()
                                                })}
                                                style={{ transitionDelay: `${index * 100}ms` }}
                                            >
                                                <img
                                                    src={getYouTubeThumbnail(embedUrl) || ''}
                                                    alt="Performance"
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all">
                                                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                                        <Play className="w-6 h-6 text-blue-600 ml-1 fill-current" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                });
                            })()}
                        </div>

                        <div className="text-center mt-12">
                            <button
                                onClick={() => setCurrentView('gallery')}
                                className="bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-800 transition-all shadow-xl group inline-flex items-center gap-2"
                            >
                                View More Performances <Sparkles className="w-5 h-5 text-yellow-300 group-hover:animate-pulse" />
                            </button>
                        </div>
                        <p className="text-center text-blue-700 mt-8 text-sm md:text-base">Find more performances on our official Facebook and Instagram channels.</p>
                    </div>
                </section>

                {/* Courses Section */}
                <section id="courses" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
                    <div className="max-w-7xl mx-auto">
                        <div className={`text-center mb-12 md:mb-16 transform transition-all duration-1000 ${visibleSections['courses'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-4 md:mb-6">Learn With Us</h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-6 md:mb-8"></div>
                            <p className="text-lg md:text-xl text-blue-700 max-w-3xl mx-auto">
                                Programs designed for every skill level and age group
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {[
                                {
                                    title: "Beginner",
                                    description: "Perfect for your first steps into flute music",
                                    features: ["Introduction to the Flute", "Breath Control & Blowing Techniques", "Fundamentals of Swaras", "Taan Practice (Basic)"],
                                    icon: <SignalLow className="w-8 h-8" />,
                                    color: "from-blue-400 to-blue-600"
                                },
                                {
                                    title: "Intermediate",
                                    description: "Build your foundation with advanced techniques",
                                    features: ["Advanced Taan Practice", "Introduction to Komal Swaras", "Introduction to Raagas", "Mastering Advanced Playing Techniques"],
                                    icon: <SignalMedium className="w-8 h-8" />,
                                    color: "from-yellow-400 to-yellow-600"
                                },
                                {
                                    title: "Advanced",
                                    description: "Master intricate compositions and professional techniques",
                                    features: ["Complex ragas", "Taan & meend", "Concert preparation", "Teaching methodology"],
                                    icon: <SignalHigh className="w-8 h-8" />,
                                    color: "from-blue-500 to-yellow-500"
                                },
                                {
                                    title: "Kids Program",
                                    description: "Fun lessons designed for young learners",
                                    features: ["Playful learning", "Simple songs", "Rhythm games", "Creative expression"],
                                    icon: <Heart className="w-8 h-8" />,
                                    color: "from-yellow-300 to-blue-500"
                                }
                            ].map((course, index) => (
                                <div
                                    key={index}
                                    className={`bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-500 hover:shadow-2xl ${visibleSections['courses'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                                    style={{ transitionDelay: `${index * 150}ms` }}
                                >
                                    <div className={`bg-gradient-to-r ${course.color} p-6 text-white`}>
                                        <div className="flex items-center justify-center mb-4">
                                            {course.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-center">{course.title}</h3>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-blue-800 mb-6 leading-relaxed text-sm md:text-base">{course.description}</p>
                                        <ul className="space-y-2 mb-6">
                                            {course.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center space-x-2 text-blue-700">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <span className="text-xs md:text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-right mt-8 md:mt-12">
                            <a
                                href={'/KFA-Brochure.pdf'}
                                download="Krishna-Flute-Academy-Brochure.pdf"
                                className="text-blue-700 hover:text-blue-900 font-semibold transition-colors group inline-flex items-center"
                                aria-label="Download our brochure to learn more"
                            >
                                Download Brochure
                                <Download className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                {testimonials.length > 0 && (
                    <section className="py-20 px-4 bg-yellow-50">
                        <div className="max-w-6xl mx-auto">
                            {/* Header with Flexbox Layout for Buttons */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                                <h2 className="text-4xl font-bold text-blue-900">
                                    Student's Love
                                </h2>

                                <div className="flex gap-3">
                                    {/* Button 1: Write a Review (Replace # with your link) */}
                                    <a
                                        href="https://www.google.com/maps/place/Krishna+Flute+Academy/@12.8498601,77.6502361,17z/data=!4m8!3m7!1s0x3bae6d9c05a7322f:0x9f9d6655d2439467!8m2!3d12.8498601!4d77.652811!9m1!1b1!16s%2Fg%2F11m2x5sn66?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-blue-600 text-white border-2 border-blue-600 px-4 py-2 rounded-full font-bold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md text-sm"
                                    >
                                        Write a Review <Star className="w-4 h-4 fill-current" />
                                    </a>

                                    {/* Button 2: See More */}
                                    <a
                                        href="https://www.google.com/maps/place/Krishna+Flute+Academy/@12.8498601,77.6502361,17z/data=!4m8!3m7!1s0x3bae6d9c05a7322f:0x9f9d6655d2439467!8m2!3d12.8498601!4d77.652811!9m1!1b1!16s%2Fg%2F11m2x5sn66?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-white border-2 border-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm hover:shadow-md text-sm"
                                    >
                                        See More <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {testimonials.map((t: any) => (
                                    <div key={t.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                                        <div className="flex gap-1 text-yellow-400 mb-4">
                                            {[...Array(t.rating)].map((_, i) => <Star key={i} className="fill-current w-5 h-5" />)}
                                        </div>
                                        <p className="text-gray-600 italic mb-6 leading-relaxed">"{t.message}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-blue-900">{t.name}</h4>
                                                <p className="text-xs text-gray-500">{t.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Contact Section */}
                <section id="contact" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className={`text-center mb-12 md:mb-16 transform transition-all duration-1000 ${visibleSections['contact'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 mb-4 md:mb-6">Contact Us</h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-6 md:mb-8"></div>
                            <p className="text-lg md:text-xl text-blue-700">Ready to start your musical journey? Let's connect!</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                            <div className={`space-y-6 md:space-y-8 transform transition-all duration-1000 delay-200 ${visibleSections['contact'] ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                                <div className="flex items-start space-x-4 transform transition-all duration-300 hover:translate-x-2">
                                    <div className="bg-gradient-to-r from-blue-500 to-yellow-500 p-3 rounded-full">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-2">Phone</h3>
                                        <p className="text-blue-700">+91 98369 52545</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 transform transition-all duration-300 hover:translate-x-2">
                                    <div className="bg-gradient-to-r from-blue-500 to-yellow-500 p-3 rounded-full">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-2">Email</h3>
                                        <p className="text-blue-700">kgbhaumik86@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 transform transition-all duration-300 hover:translate-x-2">
                                    <div className="bg-gradient-to-r from-blue-500 to-yellow-500 p-3 rounded-full">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-2">Address</h3>
                                        <p className="text-blue-700">Electronic City Phase 1</p>
                                        <p className="text-blue-700">Bengaluru, India</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-100 to-yellow-100 p-6 rounded-2xl transform hover:scale-105 transition-all duration-300">
                                    <h3 className="text-xl font-semibold text-blue-900 mb-4">Location Map</h3>
                                    <a href={mapLinkUrl} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl relative">
                                        <iframe
                                            title="Academy Location Map"
                                            src={mapEmbedUrl}
                                            className="w-full h-64 border-none"
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                        <div className="absolute inset-0 bg-transparent cursor-pointer opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-semibold">Open in Google Maps</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6 transform transition-all duration-1000 delay-400 ${visibleSections['contact'] ? 'translate-y-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                                <div>
                                    <label className="block text-blue-900 font-semibold mb-2" htmlFor="name">Full Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-blue-900 font-semibold mb-2" htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formEmail}
                                        onChange={(e) => setFormEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-blue-900 font-semibold mb-2" htmlFor="phone">Phone Number</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={formPhone}
                                        onChange={(e) => setFormPhone(e.target.value)}
                                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-blue-900 font-semibold mb-2" htmlFor="course">Course Interest</label>
                                    <select
                                        id="course"
                                        value={formCourse}
                                        onChange={(e) => setFormCourse(e.target.value)}
                                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    >
                                        <option>Select a course</option>
                                        <option>Beginner Course</option>
                                        <option>Intermediate Course</option>
                                        <option>Advanced Course</option>
                                        <option>Kids Special</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-blue-900 font-semibold mb-2" htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        value={formMessage}
                                        onChange={(e) => setFormMessage(e.target.value)}
                                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        placeholder="Tell us about your musical background and goals..."
                                    ></textarea>
                                </div>
                                <button
                                    onClick={handleWhatsAppSubmit}
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                                >
                                    <MessageSquare className="w-6 h-6" />
                                    <span>Send Inquiry via WhatsApp</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gradient-to-r from-blue-900 to-yellow-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <img
                                        src={'/image.png'}
                                        alt="Krishna Flute Academy"
                                        className="h-10 w-10 object-contain"
                                    />
                                    <span className="text-xl font-bold">Krishna Flute Academy</span>
                                </div>
                                <p className="text-blue-100 leading-relaxed text-sm md:text-base">
                                    Spreading the divine melodies of Krishna's flute through traditional teaching and modern techniques.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                                <ul className="space-y-2 text-blue-100">
                                    <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors text-sm md:text-base">About Us</button></li>
                                    <li><button onClick={() => scrollToSection('courses')} className="hover:text-white transition-colors text-sm md:text-base">Courses</button></li>
                                    <li><button onClick={() => scrollToSection('founder')} className="hover:text-white transition-colors text-sm md:text-base">Our Founder</button></li>
                                    <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors text-sm md:text-base">Contact</button></li>
                                    <li><button onClick={() => scrollToSection('gallery')} className="hover:text-white transition-colors text-sm md:text-base">Gallery</button></li>
                                    <li><button onClick={() => setCurrentView('blog')} className="hover:text-white transition-colors text-sm md:text-base">Blog</button></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                                <div className="flex space-x-4">
                                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                                        <Youtube className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-blue-700 mt-8 pt-8 text-center text-blue-200 text-sm md:text-base">
                            <p>© 2025 Krishna Flute Academy. All rights reserved. | Designed with love for music lovers</p>

                            {/* 👇 Hidden Admin Button for Mobile/Desktop */}
                            <button
                                onClick={() => setShowAdminLogin(true)}
                                className="p-1 text-blue-800 hover:text-blue-400 transition-colors opacity-50 hover:opacity-100"
                                aria-label="Admin Login"
                            >
                                <Lock className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </footer>

                {/* Download Brochure Button */}
                <a
                    href={`${import.meta.env.BASE_URL}KFA-Brochure.pdf`}
                    download="Krishna-Flute-Academy-Brochure.pdf"
                    className="fixed bottom-12 right-6 z-50 p-4 bg-blue-700 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:bg-blue-800"
                    aria-label="Download our brochure"
                >
                    <Download className="w-7 h-7 text-white" />
                </a>
            </div>
        );
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'blog':
                return (
                    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-blue-700">Loading Blog...</div>}>
                        <Blog initialPostId={selectedPostId} onBack={() => setSelectedPostId(null)} />
                    </Suspense>
                );
            case 'gallery':
                return <GalleryFull onBack={() => setCurrentView('home')} />;
            case 'admin':
                return (
                    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-blue-700">Loading Admin...</div>}>
                        <BlogAdmin onBackToHome={() => setCurrentView('home')} />
                    </Suspense>
                );
            default:
                return renderHomeView();
        }
    };

    const renderAdminLoginModal = () => (
        showAdminLogin && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 shadow-2xl">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Admin Access</h3>
                    <p className="text-sm text-gray-600 mb-4">Enter admin password to access blog management</p>
                    <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter admin password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                        autoFocus
                    />
                    <div className="flex space-x-3">
                        <button
                            onClick={handleAdminLogin}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                setShowAdminLogin(false);
                                setAdminPassword('');
                            }}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    const renderGalleryLightbox = () => (
        selectedGalleryItem && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
                <button onClick={() => setSelectedGalleryItem(null)} className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-20"><X className="w-8 h-8" /></button>
                <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center animate-scaleIn">
                    {selectedGalleryItem.media_type === 'image' ? (
                        <img src={selectedGalleryItem.url} alt={selectedGalleryItem.title || ''} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
                    ) : selectedGalleryItem.media_type === 'video-url' ? (
                        <iframe
                            className="w-full aspect-video rounded-lg shadow-2xl"
                            src={(() => {
                                let url = selectedGalleryItem.url;
                                if (url.includes('youtube.com/watch?v=')) {
                                    url = url.replace('watch?v=', 'embed/').split('&')[0];
                                } else if (url.includes('youtu.be/')) {
                                    const id = url.split('/').pop()?.split('?')[0];
                                    url = `https://www.youtube.com/embed/${id}`;
                                }
                                return url;
                            })()}
                            title={selectedGalleryItem.title || "Video Player"}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <video
                            src={selectedGalleryItem.url}
                            controls
                            autoPlay
                            className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                        />
                    )}
                    {(selectedGalleryItem.title || selectedGalleryItem.description) && (
                        <div className="mt-6 text-center text-white max-w-2xl">
                            {selectedGalleryItem.title && <h3 className="text-2xl font-bold mb-2">{selectedGalleryItem.title}</h3>}
                            {selectedGalleryItem.description && <p className="text-gray-300">{selectedGalleryItem.description}</p>}
                        </div>
                    )}
                </div>
            </div>
        )
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 overflow-x-hidden">
            {renderCurrentView()}  {/* It gets *called* here */}
            {renderAdminLoginModal()}
            {renderGalleryLightbox()}
        </div>
    );
}


export default App;