import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Home, MessageCircle, Mail, Calendar, BookOpen, Sparkles, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// --- INTERFACES ---

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

interface Inquiry {
    id: string;
    created_at: string;
    name: string;
    email: string;
    phone: string;
    course: string;
    message: string;
}

interface Event {
    id: string;
    created_at: string;
    title: string;
    registration_link: string;
    image_url?: string;
    button_text?: string;
    description?: string;
    is_active: boolean;
}

interface BlogAdminProps {
    onBackToHome: () => void;
}

const SUPABASE_BUCKET_NAME = 'blog_images';

export const BlogAdmin: React.FC<BlogAdminProps> = ({ onBackToHome }) => {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState<'blog' | 'events'>('blog');

    // Blog & Inquiry State
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
        title: '', slug: '', content: '', excerpt: '', featured_image: '',
        author_name: 'Krishna Flute Academy', author_email: '', published: false, tags: []
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [tagInput, setTagInput] = useState('');
    
    // Event State
    const [events, setEvents] = useState<Event[]>([]);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventLink, setNewEventLink] = useState('');
    const [newEventBtnText, setNewEventBtnText] = useState('Register Now');
    const [eventImageFile, setEventImageFile] = useState<File | null>(null);
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [newEventDesc, setNewEventDesc] = useState('');

    // Loading
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

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
            await Promise.all([fetchPosts(), fetchInquiries(), fetchEvents()]);
            setFetchingData(false);
        };
        loadAllData();
    }, []);

    // --- FETCH FUNCTIONS ---
    const fetchPosts = async () => {
        const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        setPosts(data || []);
    };
    const fetchInquiries = async () => {
        const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
        setInquiries(data || []);
    };
    const fetchEvents = async () => {
        const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false });
        setEvents(data || []);
    };

    // --- EVENT HANDLERS ---
    const handleSaveEvent = async () => {
        if (!newEventTitle || !newEventLink) return alert("Title and Link are required");
        setLoading(true);
        let posterUrl = null;
        if (eventImageFile) {
            const fileName = `event-${Date.now()}-${eventImageFile.name}`;
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
        if(!window.confirm("Delete this event?")) return;
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (!error) fetchEvents();
    };

    // --- BLOG HANDLERS ---
    const handleCopyLink = (slug: string) => {
        const url = `${window.location.origin}/?post=${slug}`;
        navigator.clipboard.writeText(url).then(() => alert(`Link copied:\n${url}`)).catch(() => alert('Failed to copy'));
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { setImageFile(e.target.files[0]); setCurrentPost(prev => ({ ...prev, featured_image: null })); } };
    const handleRemoveImage = () => { setImageFile(null); setCurrentPost(prev => ({ ...prev, featured_image: null })); const fileInput = document.getElementById('postImage') as HTMLInputElement; if (fileInput) fileInput.value = ''; };
    const generateSlug = (title: string) => title?.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const handleTitleChange = (title: string) => { setCurrentPost(prev => ({ ...prev, title, slug: !prev.id || !prev.slug ? generateSlug(title) : prev.slug })); };
    const handleAddTag = () => { if (!tagInput.trim()) return; const newTags = tagInput.split(',').map(t => t.trim()).filter(t => t !== ''); const unique = newTags.filter(t => !currentPost.tags?.includes(t)); if (unique.length > 0) setCurrentPost(prev => ({ ...prev, tags: [...(prev.tags || []), ...unique] })); setTagInput(''); };
    const handleRemoveTag = (tagToRemove: string) => { setCurrentPost(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tagToRemove) || [] })); };
    const handleEdit = (post: BlogPost) => { setCurrentPost(post); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const handleDelete = async (postId: string) => { if (!window.confirm('Delete post?')) return; await supabase.from('blog_posts').delete().eq('id', postId); fetchPosts(); };
    const handleCancel = () => { localStorage.removeItem('kfa_blog_draft'); setCurrentPost({ title: '', slug: '', content: '', excerpt: '', featured_image: '', author_name: 'Krishna Flute Academy', author_email: '', published: false, tags: [] }); setIsEditing(false); setTagInput(''); setImageFile(null); };
    
    const handleSave = async () => {
        if (!currentPost.title || !currentPost.content) return alert('Title & Content required');
        setLoading(true);
        let imageUrl = currentPost.featured_image;
        try {
            if (imageFile) {
                const name = `${Date.now()}-${generateSlug(imageFile.name)}`;
                const { error: upErr } = await supabase.storage.from(SUPABASE_BUCKET_NAME).upload(name, imageFile);
                if (upErr) throw upErr;
                const { data } = supabase.storage.from(SUPABASE_BUCKET_NAME).getPublicUrl(name);
                imageUrl = data.publicUrl;
            }
            const postData = { ...currentPost, featured_image: imageUrl, slug: currentPost.slug || generateSlug(currentPost.title || ''), published_at: currentPost.published && !currentPost.published_at ? new Date().toISOString() : currentPost.published ? currentPost.published_at : null };
            if (currentPost.id) await supabase.from('blog_posts').update(postData).eq('id', currentPost.id);
            else await supabase.from('blog_posts').insert([postData]);
            await fetchPosts();
            localStorage.removeItem('kfa_blog_draft');
            const shareUrl = `${window.location.origin}/?post=${postData.slug}`;
            handleCancel();
            alert(`Saved!\n\nShare Link:\n${shareUrl}`);
        } catch (err: any) { console.error(err); alert('Error: ' + err.message); } finally { setLoading(false); }
    };

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
                        <input className="w-full p-3 border rounded" placeholder="Title *" value={currentPost.title} onChange={e => handleTitleChange(e.target.value)} />
                        <input className="w-full p-3 border rounded bg-gray-50" placeholder="Slug" value={currentPost.slug} onChange={e => setCurrentPost({...currentPost, slug: e.target.value})} />
                        <textarea className="w-full p-3 border rounded" rows={3} placeholder="Excerpt" value={currentPost.excerpt} onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})} />
                        <div className="h-96 pb-12">
                            <ReactQuill theme="snow" value={currentPost.content || ''} onChange={c => setCurrentPost({...currentPost, content: c})} className="h-full" modules={{ toolbar: [[{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline', 'strike'], [{ 'color': [] }, { 'background': [] }], [{ 'align': [] }], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'blockquote'], ['clean']] }} />
                        </div>
                        <div className="pt-4">
                            <label className="block text-sm font-bold mb-2">Featured Image</label>
                            <input type="file" onChange={handleFileChange} />
                            {currentPost.featured_image && <div className="mt-2 relative w-40"><img src={currentPost.featured_image} className="w-full rounded" /><button onClick={handleRemoveImage} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"><X size={12}/></button></div>}
                        </div>
                        <div className="flex items-center gap-2">
                            <input className="border p-2 rounded flex-1" placeholder="Add Tags (comma separated)" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTag()} />
                            <button onClick={handleAddTag} className="bg-blue-600 text-white p-2 rounded"><Plus/></button>
                        </div>
                        <div className="flex flex-wrap gap-2">{currentPost.tags?.map(t => <span key={t} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1">{t} <button onClick={() => handleRemoveTag(t)}><X size={12}/></button></span>)}</div>
                        <div className="flex justify-between items-center pt-4 border-t">
                            <button onClick={() => setCurrentPost(p => ({...p, published: !p.published}))} className={`px-4 py-2 rounded flex items-center gap-2 ${currentPost.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                {currentPost.published ? <Eye size={16}/> : <EyeOff size={16}/>} {currentPost.published ? 'Published' : 'Draft'}
                            </button>
                            <div className="flex gap-3">
                                <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">{loading ? 'Saving...' : 'Save Post'}</button>
                                <button onClick={handleCancel} className="border px-6 py-2 rounded hover:bg-gray-50">Cancel</button>
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
                    <button onClick={onBackToHome} className="flex items-center gap-2 text-blue-600 font-bold hover:underline"><Home className="w-5 h-5"/> Back to Home</button>
                    <div className="bg-white p-1 rounded-lg shadow-sm flex">
                        <button onClick={() => setActiveTab('blog')} className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === 'blog' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}>Blog & Inquiries</button>
                        <button onClick={() => setActiveTab('events')} className={`px-6 py-2 rounded-md font-medium transition-colors ${activeTab === 'events' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}>Events Manager</button>
                    </div>
                </div>

                {/* === EVENTS TAB === */}
                {activeTab === 'events' && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <div><h2 className="text-3xl font-bold text-blue-900">Event Popup</h2><p className="text-gray-600">Create a popup event with a poster</p></div>
                            <button onClick={() => setIsAddingEvent(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 flex items-center gap-2"><Plus className="w-5 h-5"/> New Event</button>
                        </div>
                        {isAddingEvent && (
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
                                <h3 className="text-lg font-bold text-blue-900 mb-4">Create New Event Popup</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div><label className="block text-sm font-bold mb-1 text-gray-700">Event Title</label><input placeholder="e.g. Weekend Flute Workshop" className="border p-3 rounded w-full" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} /></div>
                                        <div><label className="block text-sm font-bold mb-1 text-gray-700">Button Text</label><input placeholder="e.g. Register Now" className="border p-3 rounded w-full" value={newEventBtnText} onChange={e => setNewEventBtnText(e.target.value)} /></div>
                                        <div><label className="block text-sm font-bold mb-1 text-gray-700">Link</label><div className="flex items-center border rounded bg-white"><span className="p-3 text-gray-400"><LinkIcon size={16}/></span><input placeholder="https://..." className="p-3 w-full outline-none" value={newEventLink} onChange={e => setNewEventLink(e.target.value)} /></div></div>
                                    </div>
                                    <div>
                                            <label className="block text-sm font-bold mb-1 text-gray-700">Short Description</label>
                                            <textarea 
                                                placeholder="e.g. Join us for a special event! OR In this blog, we explore the basics of..." 
                                                className="border p-3 rounded w-full" 
                                                rows={2}
                                                value={newEventDesc} 
                                                onChange={e => setNewEventDesc(e.target.value)} 
                                            />
                                        </div>
                                    <div><label className="block text-sm font-bold mb-1 text-gray-700">Event Poster (Image)</label><div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer relative"><input type="file" accept="image/*" onChange={(e) => e.target.files && setEventImageFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />{eventImageFile ? <div className="text-center"><p className="text-green-600 font-bold">{eventImageFile.name}</p><p className="text-xs">Click to change</p></div> : <><ImageIcon className="w-8 h-8 mb-2 text-gray-400" /><p className="text-sm">Click to upload poster</p></>}</div></div>
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
                                            <td className="p-4">{event.image_url ? <img src={event.image_url} className="w-16 h-16 object-cover rounded shadow-sm" alt="Poster"/> : <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>}</td>
                                            <td className="p-4 font-medium text-gray-900">{event.title}</td>
                                            <td className="p-4"><button onClick={() => toggleEventStatus(event)} className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${event.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{event.is_active ? <Eye className="w-3 h-3"/> : <EyeOff className="w-3 h-3"/>} {event.is_active ? 'Active' : 'Inactive'}</button></td>
                                            <td className="p-4"><button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button></td>
                                        </tr>
                                    ))}
                                    {events.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">No events created.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* === BLOG TAB === */}
                {activeTab === 'blog' && (
                    <div className="space-y-12 animate-fadeIn">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b"><MessageCircle className="w-6 h-6 text-blue-600" /><h2 className="text-2xl font-bold text-blue-900">Student Inquiries</h2></div>
                            {fetchingData ? <div className="text-center py-4">Loading...</div> : inquiries.length === 0 ? (<div className="text-center py-8 text-gray-500">No inquiries yet.</div>) : (
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
                                                        <td className="p-3"><a href={`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(`Hi ${inq.name}, this is from Krishna Flute Academy regarding your inquiry for the ${inq.course}.`)}`} target="_blank" rel="noreferrer" className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit hover:bg-green-100"><MessageCircle size={14}/> Chat</a></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3"><BookOpen className="w-6 h-6 text-blue-600"/><h2 className="text-2xl font-bold text-blue-900">Blog Posts</h2></div>
                                <button onClick={() => {
                                    const draft = localStorage.getItem('kfa_blog_draft');
                                    if (draft && window.confirm("Resume saved draft?")) setCurrentPost(JSON.parse(draft));
                                    else setCurrentPost({ title: '', slug: '', content: '', excerpt: '', featured_image: '', author_name: 'Krishna Flute Academy', author_email: '', published: false, tags: [] });
                                    setIsEditing(true);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-blue-700"><Plus className="w-5 h-5"/> New Post</button>
                            </div>
                            
                            <div className="grid gap-4">
                                {posts.map(post => (
                                    <div key={post.id} className="bg-white p-5 rounded-xl shadow border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{post.title}</h3>
                                            <div className="flex gap-3 text-sm text-gray-500 mt-1">
                                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span className={post.published ? "text-green-600 font-medium" : "text-orange-500 font-medium"}>{post.published ? 'Published' : 'Draft'}</span>
                                                <span>•</span>
                                                <span>{post.view_count} views</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleCopyLink(post.slug)} className="p-2 text-green-600 bg-green-50 rounded hover:bg-green-100" title="Copy Link"><LinkIcon size={18}/></button>
                                            <button onClick={() => handleEdit(post)} className="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"><Edit2 size={18}/></button>
                                            <button onClick={() => handleDelete(post.id)} className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100"><Trash2 size={18}/></button>
                                        </div>
                                    </div>
                                ))}
                                {posts.length === 0 && <div className="text-center py-12 bg-white rounded-xl text-gray-500">No posts found.</div>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};