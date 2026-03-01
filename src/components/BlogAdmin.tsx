import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Home,
    MessageCircle, Mail, Calendar, BookOpen, Sparkles,
    Link as LinkIcon, Image as ImageIcon, Star,
    ChevronLeft, Play, ExternalLink, Bold, Italic, List, ListOrdered,
    Type, Quote, Undo, Redo,
    Table as TableIcon, Columns, Rows, Trash,
    Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Highlighter, Palette, ArrowUpDown, ChevronDown
} from 'lucide-react';
import { supabase, BlogPost, GalleryItem, Inquiry, Event, Testimonial } from '../lib/supabase';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { LineHeight } from '../lib/tiptap-extensions';

// --- INTERFACES ---
// Using imported interfaces from ../lib/supabase

interface BlogAdminProps {
    onBackToHome: () => void;
}

// --- COMPONENTS ---
const MenuBar = ({ editor, onImageUpload }: { editor: any, onImageUpload: () => void }) => {
    if (!editor) return null;

    const fonts = ['Inter', 'Roboto', 'Georgia', 'Courier New', 'Arial', 'Times New Roman'];
    const colors = ['#000000', '#EE4444', '#22AA55', '#3366FF', '#FF9900', '#9933FF'];
    const lineHeights = ['1.0', '1.2', '1.4', '1.6', '1.8', '2.0'];

    return (
        <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-white rounded-t-xl sticky top-0 z-20 backdrop-blur-md bg-white/90 shadow-sm">
            {/* Formatting Group */}
            <div className="flex items-center gap-0.5 px-2 border-r border-gray-100">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('bold') ? 'bg-blue-50 text-blue-600 shadow-inner' : 'text-gray-600'}`}
                    title="Bold (Ctrl+B)"
                >
                    <Bold size={17} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('italic') ? 'bg-blue-50 text-blue-600 shadow-inner' : 'text-gray-600'}`}
                    title="Italic (Ctrl+I)"
                >
                    <Italic size={17} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('underline') ? 'bg-blue-50 text-blue-600 shadow-inner' : 'text-gray-600'}`}
                    title="Underline (Ctrl+U)"
                >
                    <UnderlineIcon size={17} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('strike') ? 'bg-blue-50 text-blue-600 shadow-inner' : 'text-gray-600'}`}
                    title="Strike"
                >
                    <Type size={17} className="line-through" />
                </button>
            </div>

            {/* Typography Group */}
            <div className="flex items-center gap-1.5 px-2 border-r border-gray-100">
                <select
                    onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
                    className="h-8 text-[13px] border-none bg-transparent hover:bg-gray-100 rounded-md px-1 cursor-pointer focus:ring-0 font-medium text-gray-700 outline-none min-w-[100px]"
                    value={editor.getAttributes('textStyle').fontFamily || 'Inter'}
                >
                    {fonts.map(font => (
                        <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                    ))}
                </select>

                <div className="flex items-center gap-0.5">
                    {colors.map(color => (
                        <button
                            key={color}
                            onClick={() => editor.chain().focus().setColor(color).run()}
                            className="p-1 group relative"
                            title={`Color: ${color}`}
                        >
                            <div
                                className={`w-4 h-4 rounded-full border border-gray-200 transition-transform ${editor.getAttributes('textStyle').color === color ? 'scale-125 ring-2 ring-blue-200 ring-offset-1' : 'hover:scale-110'}`}
                                style={{ backgroundColor: color }}
                            />
                        </button>
                    ))}
                    <button
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('highlight') ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600'}`}
                        title="Highlight"
                    >
                        <Highlighter size={16} />
                    </button>
                </div>
            </div>

            {/* Blocks & Lists Group */}
            <div className="flex items-center gap-0.5 px-2 border-r border-gray-100">
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100 font-bold' : 'text-gray-600 font-semibold'}`}
                    title="Heading 2"
                >
                    <span className="text-[13px]">H2</span>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-100 font-bold' : 'text-gray-600 font-semibold'}`}
                    title="Heading 3"
                >
                    <span className="text-[13px]">H3</span>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('bulletList') ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                    title="Bullet List"
                >
                    <List size={17} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${editor.isActive('orderedList') ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                    title="Ordered List"
                >
                    <ListOrdered size={17} />
                </button>
            </div>

            {/* Alignment & Spacing Group */}
            <div className="flex items-center gap-0.5 px-2 border-r border-gray-100">
                <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-1.5 rounded-md hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                    title="Align Left"
                >
                    <AlignLeft size={17} />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-1.5 rounded-md hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                    title="Align Center"
                >
                    <AlignCenter size={17} />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-1.5 rounded-md hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                    title="Align Right"
                >
                    <AlignRight size={17} />
                </button>

                <div className="flex items-center gap-1 ml-1 pl-1 border-l border-gray-50">
                    <ArrowUpDown size={14} className="text-gray-400" />
                    <select
                        onChange={e => editor.chain().focus().setLineHeight(e.target.value).run()}
                        className="text-[12px] border-none bg-transparent hover:bg-gray-100 rounded-md px-1 cursor-pointer focus:ring-0 text-gray-700 outline-none w-12"
                        value={editor.getAttributes('paragraph').lineHeight || '1.6'}
                    >
                        {lineHeights.map(lh => (
                            <option key={lh} value={lh}>{lh}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Insertion Group */}
            <div className="flex items-center gap-0.5 px-2">
                <button
                    onClick={() => {
                        const url = window.prompt('URL');
                        if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                    className={`p-1.5 rounded-md hover:bg-gray-100 ${editor.isActive('link') ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                    title="Add Link"
                >
                    <LinkIcon size={17} />
                </button>
                <button
                    onClick={onImageUpload}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
                    title="Upload Image"
                >
                    <ImageIcon size={17} />
                </button>
                <button
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
                    title="Insert Table"
                >
                    <TableIcon size={17} />
                </button>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-0.5 px-2">
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 disabled:opacity-30"
                    title="Undo"
                >
                    <Undo size={17} />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 disabled:opacity-30"
                    title="Redo"
                >
                    <Redo size={17} />
                </button>
            </div>
        </div>
    );
};


const SUPABASE_BUCKET_NAME = 'blog_images';
const GALLERY_BUCKET_NAME = 'gallery';

export const BlogAdmin: React.FC<BlogAdminProps> = ({ onBackToHome }) => {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState<'blog' | 'events' | 'testimonials' | 'gallery'>('gallery');

    // Blog State
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
        title: '', slug: '', content: '', excerpt: '', author_name: 'Krishna Flute Academy', author_email: '', published: false, tags: []
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [tagInput, setTagInput] = useState('');

    // Event State
    const [events, setEvents] = useState<Event[]>([]);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventLink, setNewEventLink] = useState('');
    const [newEventBtnText, setNewEventBtnText] = useState('Register Now');
    const [newEventDesc, setNewEventDesc] = useState('');
    const [eventImageFile, setEventImageFile] = useState<File | null>(null);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [blogFilter, setBlogFilter] = useState<'published' | 'drafts'>('published');


    // Testimonial State
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({ name: '', message: '', rating: 5, location: 'Google Review' });
    const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);


    // Gallery State
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [isAddingGallery, setIsAddingGallery] = useState(false);
    const [newGalleryItem, setNewGalleryItem] = useState<Partial<GalleryItem>>({
        title: '', description: '', media_type: 'image', url: '', is_active: true, sort_order: 0
    });
    const [galleryFile, setGalleryFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);


    // Loading
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    // --- TIPTAP EDITOR SETUP ---
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            FontFamily,
            Color,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            LineHeight.configure({
                types: ['heading', 'paragraph'],
                defaultLineHeight: '1.6',
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-xl max-w-full h-auto shadow-lg mx-auto my-6 border border-gray-100',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline hover:text-blue-800 transition-colors cursor-pointer',
                },
            }),
        ],
        content: currentPost?.content || '',
        onUpdate: ({ editor }) => {
            setCurrentPost(prev => ({ ...prev, content: editor.getHTML() }));
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none p-6 min-h-[400px] leading-relaxed font-inter',
            },
        },
    });

    // Update editor content when currentPost.content changes externally (like when loading a post)
    useEffect(() => {
        if (editor && currentPost.content !== editor.getHTML()) {
            editor.commands.setContent(currentPost.content || '');
        }
    }, [currentPost.content, editor]);

    // --- CUSTOM IMAGE HANDLER FOR TIPTAP ---
    const handleImageUpload = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.]/g, '');
                const fileName = `blog-content-${Date.now()}-${safeName}`;

                try {
                    setLoading(true);
                    const { error: uploadError } = await supabase.storage.from(SUPABASE_BUCKET_NAME).upload(fileName, file);
                    if (uploadError) throw uploadError;

                    const { data } = supabase.storage.from(SUPABASE_BUCKET_NAME).getPublicUrl(fileName);
                    const url = data.publicUrl;

                    if (editor) {
                        editor.chain().focus().setImage({ src: url }).run();
                    }
                } catch (error: any) {
                    alert('Error uploading image: ' + error.message);
                } finally {
                    setLoading(false);
                }
            }
        };
    }, [editor]);
    const handleSave = async () => {
        if (!currentPost.title) return alert("Title is required");
        setLoading(true);

        try {
            // 1. Prepare Data
            const postData = {
                title: currentPost.title,
                slug: currentPost.slug || currentPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                excerpt: currentPost.excerpt,
                content: currentPost.content,
                featured_image: currentPost.featured_image, // Use uploaded URL logic here if needed
                tags: currentPost.tags,
                published: currentPost.published || false,
                // Only update published_at if it's being published now
                published_at: currentPost.published ? new Date().toISOString() : null,
                author_name: currentPost.author_name || 'Admin',
            };

            // 2. Upload Image if new file exists
            if (imageFile) {
                // Remove spaces and special chars, keep it cleaner
                const safeName = imageFile.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.]/g, '');
                const fileName = `blog-${Date.now()}-${safeName}`;
                const { error: uploadError } = await supabase.storage.from(SUPABASE_BUCKET_NAME).upload(fileName, imageFile);

                if (!uploadError) {
                    const { data } = supabase.storage.from(SUPABASE_BUCKET_NAME).getPublicUrl(fileName);
                    postData.featured_image = data.publicUrl;
                } else {
                    console.error("Upload error:", uploadError);
                }
            }

            // 3. Save to Supabase (Insert or Update)
            if (currentPost.id) {
                // Update existing
                const { error } = await supabase.from('blog_posts').update(postData).eq('id', currentPost.id);
                if (error) throw error;
            } else {
                // Insert new
                const { error } = await supabase.from('blog_posts').insert([postData]);
                if (error) throw error;
            }

            // 4. Cleanup
            alert('Saved successfully!');
            localStorage.removeItem('kfa_blog_draft');
            setIsEditing(false);
            setImageFile(null);
            fetchPosts(); // Refresh list
        } catch (error: any) {
            alert('Error saving post: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- EFFECTS ---
    useEffect(() => {
        if (!currentPost.id && (currentPost.title || currentPost.content)) {
            const draftData = { ...currentPost };
            localStorage.setItem('kfa_blog_draft', JSON.stringify(draftData));
        }
    }, [currentPost]);

    useEffect(() => {
        const loadAllData = async () => {
            setFetchingData(true);
            await Promise.all([fetchPosts(), fetchInquiries(), fetchEvents(), fetchTestimonials(), fetchGallery()]);
            setFetchingData(false);
        };
        loadAllData();
    }, []);

    // --- FETCH FUNCTIONS ---
    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            // Strict filtering for valid post objects
            const validPosts = (data || []).filter(p => p && typeof p === 'object' && p.title);
            setPosts(validPosts);
        } catch (err: any) {
            console.error('Error fetching admin posts:', err.message || JSON.stringify(err, Object.getOwnPropertyNames(err)));
        }
    };
    const fetchInquiries = async () => {
        try {
            const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setInquiries(data || []);
        } catch (err: any) {
            console.error('Error fetching inquiries:', err.message || JSON.stringify(err, Object.getOwnPropertyNames(err)));
        }
    };
    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setEvents(data || []);
        } catch (err: any) {
            console.error('Error fetching events:', err.message || JSON.stringify(err, Object.getOwnPropertyNames(err)));
        }
    };
    const fetchTestimonials = async () => {
        try {
            const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setTestimonials(data || []);
        } catch (err: any) {
            console.error('Error fetching testimonials:', err.message || JSON.stringify(err, Object.getOwnPropertyNames(err)));
        }
    };
    const fetchGallery = async () => {
        try {
            const { data, error } = await supabase.from('gallery_items').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
            if (error) throw error;
            setGallery(data || []);
        } catch (err: any) {
            console.error('Error fetching gallery:', err.message || JSON.stringify(err, Object.getOwnPropertyNames(err)));
        }
    };


    // --- HANDLERS ---

    // Testimonials
    const handleSaveTestimonial = async () => {
        if (!newTestimonial.name || !newTestimonial.message) return alert("Name and Message required");
        setLoading(true);
        const { error } = await supabase.from('testimonials').insert([newTestimonial]);
        if (error) alert("Error: " + error.message);
        else {
            await fetchTestimonials();
            setNewTestimonial({ name: '', message: '', rating: 5, location: 'Google Review' });
            setIsAddingTestimonial(false);
        }
        setLoading(false);
    };
    const handleDeleteTestimonial = async (id: string) => {
        if (!window.confirm("Delete this review?")) return;
        await supabase.from('testimonials').delete().eq('id', id);
        fetchTestimonials();
    };


    // Events
    const handleSaveEvent = async () => {
        if (!newEventTitle || !newEventLink) return alert("Title and Link are required");
        setLoading(true);
        let posterUrl = null;
        if (eventImageFile) {
            const safeName = eventImageFile.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.]/g, '');
            const fileName = `event-${Date.now()}-${safeName}`;
            const { error: uploadError } = await supabase.storage.from(SUPABASE_BUCKET_NAME).upload(fileName, eventImageFile);

            if (!uploadError) {
                const { data } = supabase.storage.from(SUPABASE_BUCKET_NAME).getPublicUrl(fileName);
                posterUrl = data.publicUrl;
            }
        }
        const { error } = await supabase.from('events').insert([{
            title: newEventTitle,
            registration_link: newEventLink,
            image_url: posterUrl,
            button_text: newEventBtnText,
            description: newEventDesc,
            is_active: true
        }]);
        if (error) alert("Error: " + error.message);
        else {
            await fetchEvents();
            setNewEventTitle(''); setNewEventLink(''); setNewEventBtnText('Register Now'); setNewEventDesc(''); setEventImageFile(null); setIsAddingEvent(false);
        }
        setLoading(false);
    };
    const toggleEventStatus = async (event: Event) => {
        if (!event.is_active) await supabase.from('events').update({ is_active: false }).neq('id', event.id);
        const { error } = await supabase.from('events').update({ is_active: !event.is_active }).eq('id', event.id);
        if (!error) fetchEvents();
    };
    const handleDeleteEvent = async (id: string) => {
        if (!window.confirm("Delete this event?")) return;
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (!error) fetchEvents();
    };

    // Gallery
    const handleSaveGallery = async () => {
        if (newGalleryItem.media_type !== 'video-url' && !galleryFile && !newGalleryItem.url) {
            return alert("Please select a file or provide a URL.");
        }

        setLoading(true);
        setUploadProgress(10);

        try {
            let mediaUrl = newGalleryItem.url;

            if (galleryFile) {
                console.log("Starting upload for file:", galleryFile.name, "size:", galleryFile.size);
                const folder = newGalleryItem.media_type === 'image' ? 'images' : 'videos';
                const fileName = `${folder} /${Date.now()}-${galleryFile.name.replace(/\s +/g, '_')}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from(GALLERY_BUCKET_NAME)
                    .upload(fileName, galleryFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error("Supabase Storage Upload Error:", uploadError);
                    throw uploadError;
                }

                console.log("Upload successful, getting public URL...");
                const { data } = supabase.storage.from(GALLERY_BUCKET_NAME).getPublicUrl(fileName);
                mediaUrl = data.publicUrl;
            }

            setUploadProgress(70);
            console.log("Saving gallery item to database with URL:", mediaUrl);

            const { error } = await supabase.from('gallery_items').insert([{
                ...newGalleryItem,
                url: mediaUrl
            }]);

            if (error) {
                console.error("Supabase Database Insert Error:", error);
                throw error;
            }

            setUploadProgress(100);
            await fetchGallery();
            setNewGalleryItem({ title: '', description: '', media_type: 'image', url: '', is_active: true, sort_order: 0 });
            setGalleryFile(null);
            setIsAddingGallery(false);
            alert("Gallery item added successfully!");
        } catch (error: any) {
            console.error("Detailed error in handleSaveGallery:", error);
            alert("Error saving gallery item: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleDeleteGallery = async (id: string, url: string) => {
        if (!window.confirm("Delete this gallery item?")) return;

        try {
            // Try to delete from storage if it's a Supabase URL
            if (url.includes(GALLERY_BUCKET_NAME)) {
                const path = url.split(`${GALLERY_BUCKET_NAME}/`)[1];
                if (path) {
                    await supabase.storage.from(GALLERY_BUCKET_NAME).remove([path]);
                }
            }

            const { error } = await supabase.from('gallery_items').delete().eq('id', id);
            if (error) throw error;
            fetchGallery();
        } catch (error: any) {
            alert("Error deleting: " + error.message);
        }
    };


    // Blog
    const handleCopyLink = (slug: string) => {
        const url = `${window.location.origin}/?post=${slug}`;
        navigator.clipboard.writeText(url).then(() => alert(`Link copied:\n${url}`)).catch(() => alert('Failed to copy'));
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { setImageFile(e.target.files[0]); setCurrentPost(prev => ({ ...prev, featured_image: undefined })); } };
    const handleRemoveImage = () => { setImageFile(null); setCurrentPost(prev => ({ ...prev, featured_image: undefined })); const fileInput = document.getElementById('postImage') as HTMLInputElement; if (fileInput) fileInput.value = ''; };

    const generateSlug = (title: string) => title?.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const handleTitleChange = (title: string) => { setCurrentPost(prev => ({ ...prev, title, slug: !prev.id || !prev.slug ? generateSlug(title) : prev.slug })); };
    const handleAddTag = () => { if (!tagInput.trim()) return; const newTags = tagInput.split(',').map(t => t.trim()).filter(t => t !== ''); const unique = newTags.filter(t => !currentPost.tags?.includes(t)); if (unique.length > 0) setCurrentPost(prev => ({ ...prev, tags: [...(prev.tags || []), ...unique] })); setTagInput(''); };
    const handleRemoveTag = (tagToRemove: string) => { setCurrentPost(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tagToRemove) || [] })); };
    const handleEdit = (post: BlogPost) => { setCurrentPost(post); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleDelete = async (postId: string) => { if (!window.confirm('Delete post?')) return; await supabase.from('blog_posts').delete().eq('id', postId); fetchPosts(); };
    const handleCancel = () => { localStorage.removeItem('kfa_blog_draft'); setCurrentPost({ title: '', slug: '', content: '', excerpt: '', featured_image: '', author_name: 'Krishna Flute Academy', author_email: '', published: false, tags: [] }); setIsEditing(false); setTagInput(''); setImageFile(null); };


    // --- EDITOR VIEW ---
    if (isEditing) {
        return (
            <div className="min-h-screen py-16 px-4 bg-blue-50">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex justify-between mb-6">
                        <h2 className="text-2xl font-bold text-blue-900">{currentPost.id ? 'Edit' : 'New'} Post</h2>
                        <button onClick={handleCancel}><X /></button>
                    </div>
                    <div className="space-y-6">
                        <input
                            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Title *"
                            value={currentPost?.title || ''}
                            onChange={e => handleTitleChange(e.target.value)}
                        />
                        <input
                            className="w-full p-3 border rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Slug"
                            value={currentPost?.slug || ''}
                            onChange={e => setCurrentPost(prev => ({ ...prev, slug: e.target.value }))}
                        />
                        <textarea
                            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            rows={3}
                            placeholder="Excerpt"
                            value={currentPost?.excerpt || ''}
                            onChange={e => setCurrentPost(prev => ({ ...prev, excerpt: e.target.value }))}
                        />
                        <div className="border rounded-xl bg-white overflow-hidden shadow-sm flex flex-col tiptap">
                            <MenuBar editor={editor} onImageUpload={handleImageUpload} />
                            <div className="overflow-y-auto max-h-[500px]">
                                <EditorContent editor={editor} />
                            </div>
                        </div>
                        <div className="pt-4">
                            <label className="block text-sm font-bold mb-2 text-gray-700">Featured Image</label>

                            <div className="relative group overflow-hidden">
                                {!imageFile && !currentPost?.featured_image ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer relative bg-gray-50">
                                        <input
                                            type="file"
                                            id="postImage"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <ImageIcon className="w-8 h-8 mb-2 text-blue-500" />
                                        <p className="font-bold text-gray-700">Select Featured Image</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP up to 5MB</p>
                                    </div>
                                ) : (
                                    <div className="relative inline-block group">
                                        <img
                                            src={imageFile ? URL.createObjectURL(imageFile) : currentPost.featured_image}
                                            className="max-h-64 rounded-xl shadow-lg border-4 border-white ring-1 ring-gray-200"
                                            alt="Preview"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => document.getElementById('postImage')?.click()}
                                                className="bg-white text-gray-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                                                title="Change Image"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={handleRemoveImage}
                                                className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                                                title="Remove Image"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        {/* Hidden input for changing image */}
                                        <input
                                            type="file"
                                            id="postImage"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input className="border p-2 rounded flex-1 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Add Tags (comma separated)" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTag()} />
                            <button onClick={handleAddTag} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"><Plus /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(currentPost?.tags || []).map(t => (
                                <span key={t} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-200">
                                    {t}
                                    <button onClick={() => handleRemoveTag(t)} className="hover:text-red-600 transition-colors">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t">
                            <button onClick={() => setCurrentPost(prev => ({ ...prev, published: !prev.published }))} className={`px-4 py-2 rounded-full flex items-center gap-2 font-bold transition-all ${currentPost?.published ? 'bg-green-100 text-green-800 shadow-sm' : 'bg-gray-100 text-gray-600'}`}>
                                {currentPost?.published ? <Eye size={16} /> : <EyeOff size={16} />}
                                {currentPost?.published ? 'Published' : 'Draft'}
                            </button>
                            <div className="flex gap-3">
                                <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-8 py-2 rounded-full hover:bg-blue-700 font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50">
                                    {loading ? 'Saving...' : 'Save Post'}
                                </button>
                                <button onClick={handleCancel} className="border border-gray-300 px-8 py-2 rounded-full hover:bg-gray-50 transition-colors font-bold">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- MAIN DASHBOARD ---
    return (
        <div className="min-h-screen py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <button onClick={onBackToHome} className="flex items-center gap-2 text-blue-600 font-bold hover:underline"><Home className="w-5 h-5" /> Back to Home</button>
                    <div className="bg-white p-1 rounded-lg shadow-sm flex flex-wrap justify-center gap-1">
                        <button onClick={() => setActiveTab('gallery')} className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'gallery' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}>Gallery</button>
                        <button onClick={() => setActiveTab('blog')} className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'blog' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}>Blog</button>
                        <button onClick={() => setActiveTab('events')} className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'events' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}>Events</button>
                        <button onClick={() => setActiveTab('testimonials')} className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'testimonials' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}>Reviews</button>
                    </div>
                </div>

                {/* === TESTIMONIALS TAB === */}
                {activeTab === 'testimonials' && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <div><h2 className="text-3xl font-bold text-blue-900">Testimonials</h2><p className="text-gray-600">Manage student reviews</p></div>
                            <button onClick={() => setIsAddingTestimonial(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 flex items-center gap-2"><Plus className="w-5 h-5" /> Add Review</button>
                        </div>

                        {isAddingTestimonial && (
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                                <h3 className="text-lg font-bold text-blue-900 mb-4">Add New Review</h3>
                                <div className="grid gap-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input placeholder="Student Name" className="border p-3 rounded" value={newTestimonial.name} onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })} />
                                        <input placeholder="Location / Role (e.g. 'Google Review')" className="border p-3 rounded" value={newTestimonial.location} onChange={e => setNewTestimonial({ ...newTestimonial, location: e.target.value })} />
                                    </div>
                                    <textarea placeholder="Review Message..." className="border p-3 rounded" rows={3} value={newTestimonial.message} onChange={e => setNewTestimonial({ ...newTestimonial, message: e.target.value })} />
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-700">Rating:</span>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button key={star} onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })} className={`${(newTestimonial.rating || 5) >= star ? 'text-yellow-400' : 'text-gray-300'}`}><Star className="w-6 h-6 fill-current" /></button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6 justify-end">
                                    <button onClick={() => setIsAddingTestimonial(false)} className="text-gray-600 px-4 py-2 hover:bg-gray-100 rounded">Cancel</button>
                                    <button onClick={handleSaveTestimonial} disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold">{loading ? 'Saving...' : 'Save Review'}</button>
                                </div>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                            {testimonials.map(t => (
                                <div key={t.id} className="bg-white p-6 rounded-xl shadow border border-gray-100 relative">
                                    <button onClick={() => handleDeleteTestimonial(t.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 italic mb-4">"{t.message}"</p>
                                    <div>
                                        <h4 className="font-bold text-blue-900">{t.name}</h4>
                                        <p className="text-xs text-gray-500">{t.location}</p>
                                    </div>
                                </div>
                            ))}
                            {testimonials.length === 0 && !isAddingTestimonial && (
                                <div className="col-span-2 text-center py-12 bg-white rounded-xl text-gray-500 border border-dashed border-gray-300">
                                    <p>No reviews added yet.</p>
                                    <p className="text-sm">Click "Add Review" above to start.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* === EVENTS TAB === */}
                {activeTab === 'events' && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <div><h2 className="text-3xl font-bold text-blue-900">Event Popup</h2><p className="text-gray-600">Create a popup event with a poster</p></div>
                            <button onClick={() => setIsAddingEvent(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 flex items-center gap-2"><Plus className="w-5 h-5" /> New Event</button>
                        </div>
                        {isAddingEvent && (
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                                <h3 className="text-lg font-bold text-blue-900 mb-4">Create New Event Popup</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div><label className="block text-sm font-bold mb-1 text-gray-700">Event Title</label><input placeholder="e.g. Weekend Flute Workshop" className="border p-3 rounded w-full" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} /></div>
                                        <div><label className="block text-sm font-bold mb-1 text-gray-700">Button Text</label><input placeholder="e.g. Register Now" className="border p-3 rounded w-full" value={newEventBtnText} onChange={e => setNewEventBtnText(e.target.value)} /></div>
                                        <div><label className="block text-sm font-bold mb-1 text-gray-700">Link</label><div className="flex items-center border rounded bg-white"><span className="p-3 text-gray-400"><LinkIcon size={16} /></span><input placeholder="https://..." className="p-3 w-full outline-none" value={newEventLink} onChange={e => setNewEventLink(e.target.value)} /></div></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div><label className="block text-sm font-bold mb-1 text-gray-700">Short Description</label><textarea placeholder="Popup Description..." className="border p-3 rounded w-full" rows={2} value={newEventDesc} onChange={e => setNewEventDesc(e.target.value)} /></div>
                                        <div><label className="block text-sm font-bold mb-1 text-gray-700">Event Poster (Image)</label><div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer relative"><input type="file" accept="image/*" onChange={(e) => e.target.files && setEventImageFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />{eventImageFile ? <p className="text-green-600 font-bold">{eventImageFile.name}</p> : <><ImageIcon className="w-6 h-6 mb-1" /><p className="text-xs">Upload</p></>}</div></div>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6 justify-end"><button onClick={() => setIsAddingEvent(false)} className="text-gray-600 px-4 py-2 hover:bg-gray-100 rounded">Cancel</button><button onClick={handleSaveEvent} disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold">{loading ? 'Uploading...' : 'Publish Event'}</button></div>
                            </div>
                        )}
                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 uppercase text-xs"><tr><th className="p-4">Poster</th><th className="p-4">Event Title</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
                                <tbody className="divide-y">
                                    {events.map(event => (
                                        <tr key={event.id}>
                                            <td className="p-4">{event.image_url ? <img src={event.image_url} className="w-16 h-16 object-cover rounded shadow-sm" alt="Poster" /> : <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>}</td>
                                            <td className="p-4 font-medium text-gray-900">{event.title}</td>
                                            <td className="p-4"><button onClick={() => toggleEventStatus(event)} className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${event.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{event.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} {event.is_active ? 'Active' : 'Inactive'}</button></td>
                                            <td className="p-4"><button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button></td>
                                        </tr>
                                    ))}
                                    {events.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">No events created.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* === GALLERY TAB === */}
                {activeTab === 'gallery' && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <div><h2 className="text-3xl font-bold text-blue-900">Gallery Management</h2><p className="text-gray-600">Upload photos and student performance videos</p></div>
                            <button onClick={() => setIsAddingGallery(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center gap-2"><Plus className="w-5 h-5" /> Add Media</button>
                        </div>

                        {isAddingGallery && (
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                                <h3 className="text-lg font-bold text-blue-900 mb-4">Add New Gallery Item</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-1 text-gray-700">Media Type</label>
                                            <select
                                                className="w-full border p-3 rounded"
                                                value={newGalleryItem.media_type}
                                                onChange={e => setNewGalleryItem({ ...newGalleryItem, media_type: e.target.value as any, url: '' })}
                                            >
                                                <option value="image">Image Upload</option>
                                                <option value="video-file">Video File Upload</option>
                                                <option value="video-url">YouTube / External URL</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1 text-gray-700">Title (Optional)</label>
                                            <input placeholder="e.g. Student Performance 2024" className="border p-3 rounded w-full" value={newGalleryItem.title || ''} onChange={e => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1 text-gray-700">Description (Optional)</label>
                                            <textarea placeholder="Tell us about this performance..." className="border p-3 rounded w-full" rows={2} value={newGalleryItem.description || ''} onChange={e => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {newGalleryItem.media_type === 'video-url' ? (
                                            <div>
                                                <label className="block text-sm font-bold mb-1 text-gray-700">URL</label>
                                                <input placeholder="https://youtube.com/watch?v=..." className="border p-3 rounded w-full" value={newGalleryItem.url} onChange={e => setNewGalleryItem({ ...newGalleryItem, url: e.target.value })} />
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-sm font-bold mb-1 text-gray-700">
                                                    Upload {newGalleryItem.media_type === 'image' ? 'Image' : 'Video'}
                                                </label>
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer relative">
                                                    <input
                                                        type="file"
                                                        accept={newGalleryItem.media_type === 'image' ? "image/*" : "video/*"}
                                                        onChange={(e) => e.target.files && setGalleryFile(e.target.files[0])}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                    {galleryFile ? (
                                                        <div className="text-center">
                                                            <p className="text-green-600 font-bold">{galleryFile.name}</p>
                                                            <p className="text-xs text-gray-400">{(galleryFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <ImageIcon className="w-8 h-8 mb-2" />
                                                            <p className="text-sm font-medium">Click or drag to upload</p>
                                                            <p className="text-xs mt-1">Recommended: max 50MB for videos</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {/* Preview Section */}
                                        {(newGalleryItem.url || galleryFile) && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Live Preview</p>
                                                <div className="aspect-video w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-sm bg-black">
                                                    {newGalleryItem.media_type === 'image' ? (
                                                        galleryFile ? (
                                                            <img src={URL.createObjectURL(galleryFile)} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <img src={newGalleryItem.url || ''} className="w-full h-full object-cover" />
                                                        )
                                                    ) : newGalleryItem.media_type === 'video-url' ? (
                                                        <img
                                                            src={(() => {
                                                                const url = newGalleryItem.url || '';
                                                                let id = '';
                                                                if (url.includes('youtube.com/embed/')) id = url.split('embed/')[1].split('?')[0];
                                                                else if (url.includes('youtube.com/watch?v=')) id = url.split('v=')[1].split('&')[0];
                                                                else if (url.includes('youtu.be/')) id = url.split('/').pop()?.split('?')[0] || '';
                                                                return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '';
                                                            })()}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => (e.target as HTMLImageElement).style.opacity = '0'}
                                                        />
                                                    ) : (
                                                        galleryFile ? (
                                                            <video src={URL.createObjectURL(galleryFile) + '#t=1'} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <video src={(newGalleryItem.url || '') + '#t=1'} className="w-full h-full object-cover" />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-bold mb-1 text-gray-700">Sort Order</label>
                                                <input type="number" className="border p-3 rounded w-full" value={newGalleryItem.sort_order} onChange={e => setNewGalleryItem({ ...newGalleryItem, sort_order: parseInt(e.target.value) || 0 })} />
                                            </div>
                                            <div className="flex items-end pb-3">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" checked={newGalleryItem.is_active} onChange={e => setNewGalleryItem({ ...newGalleryItem, is_active: e.target.checked })} className="w-5 h-5 text-blue-600" />
                                                    <span className="text-sm font-bold text-gray-700">Visible</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {uploadProgress > 0 && (
                                    <div className="mt-6">
                                        <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                                            <span>Uploading...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 mt-8 justify-end">
                                    <button onClick={() => { setIsAddingGallery(false); setGalleryFile(null); }} className="text-gray-600 px-6 py-2 hover:bg-gray-100 rounded font-medium">Cancel</button>
                                    <button onClick={handleSaveGallery} disabled={loading} className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 font-bold shadow-lg transition-all disabled:opacity-50">
                                        {loading ? 'Saving Content...' : 'Add to Gallery'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {gallery.map(item => (
                                <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 group relative">
                                    <div className="aspect-video relative bg-gray-100">
                                        {item.media_type === 'image' ? (
                                            <img src={item.url} className="w-full h-full object-cover" alt={item.title || ''} />
                                        ) : item.media_type === 'video-url' ? (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={(() => {
                                                        const url = item.url;
                                                        let id = '';
                                                        if (url.includes('youtube.com/embed/')) id = url.split('embed/')[1].split('?')[0];
                                                        else if (url.includes('v=')) id = url.split('v=')[1].split('&')[0];
                                                        else if (url.includes('youtu.be/')) id = url.split('/').pop()?.split('?')[0] || '';
                                                        return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '';
                                                    })()}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                    <Play className="w-8 h-8 text-white drop-shadow-lg" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-full">
                                                <video src={item.url + '#t=1'} className="w-full h-full object-cover" preload="metadata" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                    <Play className="w-8 h-8 text-white drop-shadow-lg" />
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDeleteGallery(item.id, item.url)} className="bg-red-500 text-white p-2 rounded-lg shadow-lg hover:bg-red-600" title="Delete"><Trash2 size={16} /></button>
                                        </div>
                                        {!item.is_active && (
                                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                                <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Hidden</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-bold text-blue-900 text-sm truncate">{item.title || 'Untitled Item'}</h4>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">{item.media_type.replace('-', ' ')}</p>
                                    </div>
                                </div>
                            ))}
                            {gallery.length === 0 && !isAddingGallery && (
                                <div className="col-span-full py-20 text-center bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
                                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">Your gallery is empty</p>
                                    <button onClick={() => setIsAddingGallery(true)} className="text-blue-600 font-bold hover:underline mt-2">Add your first photo or video</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* === BLOG TAB === */}
                {activeTab === 'blog' && (

                    <div className="space-y-12 animate-fadeIn">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b"><MessageCircle className="w-6 h-6 text-blue-600" /><h2 className="text-2xl font-bold text-blue-900">Student Inquiries</h2></div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-blue-50 text-blue-900 text-xs uppercase font-bold"><tr><th className="p-3 text-left">Date</th><th className="p-3 text-left">Name</th><th className="p-3 text-left">Course</th><th className="p-3 text-left">Message</th><th className="p-3 text-left">Action</th></tr></thead>
                                    <tbody className="divide-y">
                                        {inquiries.map(inq => {
                                            const cleanPhone = inq.phone.replace(/\D/g, '');
                                            return (
                                                <tr key={inq.id} className="hover:bg-gray-50">
                                                    <td className="p-3 text-sm text-gray-500">{new Date(inq.created_at).toLocaleDateString()}</td>
                                                    <td className="p-3 text-sm font-bold text-gray-800">{inq.name}<div className="text-xs text-gray-500 font-normal">{inq.email}</div></td>
                                                    <td className="p-3"><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{inq.course}</span></td>
                                                    <td className="p-3 text-sm text-gray-600 max-w-xs truncate">{inq.message}</td>
                                                    <td className="p-3"><a href={`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(`Hi ${inq.name}, this is from Krishna Flute Academy regarding your inquiry for the ${inq.course}.`)}`} target="_blank" rel="noreferrer" className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit hover:bg-green-100"><MessageCircle size={14} /> Chat</a></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3"><BookOpen className="w-6 h-6 text-blue-600" /><h2 className="text-2xl font-bold text-blue-900">Blog Posts</h2></div>
                                <button onClick={() => {
                                    const rawDraft = localStorage.getItem('kfa_blog_draft');
                                    let draft = null;
                                    try {
                                        draft = rawDraft ? JSON.parse(rawDraft) : null;
                                    } catch (e) {
                                        console.error('Corrupt draft in localStorage:', e);
                                    }

                                    if (draft && typeof draft === 'object' && draft.title && window.confirm(`Resume draft: "${draft.title}"?`)) {
                                        setCurrentPost(draft);
                                    } else {
                                        setCurrentPost({ title: '', slug: '', content: '', excerpt: '', featured_image: '', author_name: 'Krishna Flute Academy', author_email: '', published: false, tags: [] });
                                    }
                                    setIsEditing(true);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-blue-700"><Plus className="w-5 h-5" /> New Post</button>
                            </div>
                            <div className="grid gap-4">
                                {posts.map(post => (
                                    <div key={post.id} className="bg-white p-5 rounded-xl shadow border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{post.title}</h3>
                                            <div className="flex gap-3 text-sm text-gray-500 mt-1">
                                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span className={post.published ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                                    {post.published ? 'Published' : 'Draft'}
                                                </span>
                                                <span>•</span>
                                                <span>{post.view_count} views</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleCopyLink(post.slug || post.id)}
                                                className="p-2 text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors"
                                                title="Copy Link"
                                            >
                                                <LinkIcon size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleEdit(post)}
                                                className="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                                                title="Edit Post"
                                            >
                                                <Edit2 size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                                                title="Delete Post"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};