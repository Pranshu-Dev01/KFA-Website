import React, { useState, useEffect } from 'react';
import { Music, Users, Award, Phone, Mail, MapPin, Star, Play, BookOpen, Heart, Sparkles, Facebook, Instagram, Youtube, MessageSquare, ChevronRight } from 'lucide-react';

// 🔑 Click-to-Enter Loader Component
const ClickLoader = ({ onEnter }) => {
    const LOGO_IMAGE_PATH = "/image.png"; 

    const handleLogoClick = () => {
        const audio = document.getElementById('bg-audio');
        if (audio instanceof HTMLAudioElement) {
            audio.muted = false; 
            audio.play().then(() => {
                console.log("Audio playback successful.");
            }).catch(error => {
                console.warn("Audio playback failed (check file format or browser policy).", error);
            });
        }
        onEnter(); 
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/95 cursor-pointer transition-opacity duration-500"
            onClick={handleLogoClick}
        >
            <img 
                src={LOGO_IMAGE_PATH} 
                alt="Krishna Flute Academy Logo" 
                className="w-32 h-40 object-contain animate-pulse-slow mb-4"
            />
            <h2 className="text-2xl font-semibold text-blue-800">Click to Begin Your Journey</h2>
            <p className="text-sm text-gray-500 mt-2">Audio will play automatically on click.</p>
        </div>
    );
}; // ✅ FIXED: Added missing closing brace and semicolon

// ⭐️ NEW: Blog Section Component
const BlogSection = ({ visible }) => {
    const blogPosts = [
        {
            title: "The Art of Bansuri Breath Control",
            summary: "Discover the essential techniques that professional flutists use to achieve continuous, soulful sound.",
            image: "/blog_post_1.jpg",
            link: "#"
        },
        {
            title: "Why Learn Classical Indian Flute?",
            summary: "Explore the mental and spiritual benefits of studying Indian classical music and the therapeutic power of the flute.",
            image: "/blog_post_2.jpg",
            link: "#"
        },
        {
            title: "Flute Care: Keeping Your Bansuri Tuned",
            summary: "A practical guide to bamboo flute maintenance, humidity control, and ensuring perfect pitch for a lifetime.",
            image: "/blog_post_3.jpg",
            link: "#"
        },
    ];

    return (
        <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50/50">
            <div className="max-w-7xl mx-auto">
                <div className={`text-center mb-16 transform transition-all duration-1000 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Our Latest Insights</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-blue-500 mx-auto mb-8"></div>
                    <p className="text-xl text-blue-700 max-w-3xl mx-auto">
                        In-depth articles and guides from our master musicians.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {blogPosts.map((post, index) => (
                        <a 
                            key={index}
                            href={post.link} 
                            className={`block bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.03] transition-all duration-500 hover:shadow-2xl group ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/20 transition-all"></div>
                            </div>
                            <div className="p-6 space-y-3">
                                <h3 className="text-2xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors">{post.title}</h3>
                                <p className="text-blue-800 leading-relaxed text-sm">{post.summary}</p>
                                <span className="flex items-center space-x-2 text-sm font-semibold text-yellow-600 group-hover:text-yellow-700 transition-colors pt-2">
                                    <span>Read Article</span>
                                    <ChevronRight className="w-4 h-4" />
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
                
                <div className="text-center mt-12">
                    <button 
                        onClick={() => window.open(blogPosts[0].link, '_blank')}
                        className="bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-800 transition-all duration-300 transform hover:shadow-xl"
                    >
                        Explore All Articles <BookOpen className="inline-block w-5 h-5 ml-2" />
                    </button>
                </div>
            </div>
        </section>
    );
}; // ✅ FIXED: Added missing closing brace and semicolon


function App() {
    const [scrolled, setScrolled] = useState(false);
    const [visibleSections, setVisibleSections] = useState({});
    const [isSiteReady, setIsSiteReady] = useState(false);
    
    // State for Form Inputs (for WhatsApp submission)
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formCourse, setFormCourse] = useState('Select a course');
    const [formMessage, setFormMessage] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            
            const sections = ['about', 'founder', 'courses', 'contact', 'flutes', 'gallery', 'blog']; 
            const newVisibleSections = {};
            
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
        handleScroll(); // Initial check
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    const socialLinks = {
        facebook: 'https://www.facebook.com/krishnafluteacademy/',
        instagram: 'https://www.instagram.com/krishnafluteacademy?igsh=MWw0NjZsNms2czN1aw==',
        youtube: 'https://www.youtube.com/@krishnafluteacademy'
    };

    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.3510000000003!2d77.656832!3d12.885108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6ca3e5e5e5e5%3A0x8e5e5e5e5e5e5e5e!2sElectronic%20City%20Phase%201%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"; 
    const mapLinkUrl = `https://goo.gl/maps/example`;
    const whatsappNumber = '919836952545';
    const baseWhatsappUrl = `https://wa.me/${whatsappNumber}?text=`;
    const defaultInquiryMessage = 'Hello Krishna Flute Academy, I am interested in your classes!';

    const handleWhatsAppSubmit = () => {
        const messageDetails = `
Hello Krishna Flute Academy, I have an inquiry!

*Name:* ${formName}
*Email:* ${formEmail}
*Phone:* ${formPhone}
*Course Interest:* ${formCourse}
*Message:* ${formMessage}
        `.trim();

        const finalWhatsappUrl = `${baseWhatsappUrl}${encodeURIComponent(messageDetails)}`;
        window.open(finalWhatsappUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100">
            
            {!isSiteReady && <ClickLoader onEnter={() => setIsSiteReady(true)} />}

            {isSiteReady && (
            <div>
                <audio id="bg-audio" src="/flute_audio.mp3" loop muted={false} style={{ display: 'none' }}></audio>

                <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-white/90 backdrop-blur-md shadow-lg py-3'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <img 
                                    src="/image.png" 
                                    alt="Krishna Flute Academy Logo" 
                                    className="h-12 w-12 object-contain"
                                />
                                <span className="text-l font-bold text-blue-900">Krishna Flute Academy</span>
                            </div>
                            
                            <div className="hidden md:flex space-x-8">
                                <button onClick={() => scrollToSection('about')} className="text-blue-700 hover:text-blue-900 transition-colors">About</button>
                                <button onClick={() => scrollToSection('founder')} className="text-blue-700 hover:text-blue-900 transition-colors">Founder</button>
                                <button onClick={() => scrollToSection('courses')} className="text-blue-700 hover:text-blue-900 transition-colors">Courses</button>
                                <button onClick={() => scrollToSection('gallery')} className="text-blue-700 hover:text-blue-900 transition-colors">Gallery</button>
                                <button onClick={() => scrollToSection('blog')} className="text-blue-700 hover:text-blue-900 transition-colors">Blog</button>
                                <button onClick={() => scrollToSection('contact')} className="text-blue-700 hover:text-blue-900 transition-colors">Contact</button>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="hidden sm:flex items-center space-x-2">
                                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-110">
                                        <Facebook className="w-5 h-5 text-white" />
                                    </a>
                                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                                        <Instagram className="w-5 h-5 text-white" />
                                    </a>
                                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300 transform hover:scale-110">
                                        <Youtube className="w-5 h-5 text-white" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <section className="relative pt-20 pb-0 px-0 sm:px-0 overflow-hidden">
                    <div 
                        className="relative z-0 w-full h-[450px] md:h-[550px] overflow-hidden bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: 'url(/Toppic.jpg)' }} 
                    >
                    </div>
                </section>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

                <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
                    <div className="max-w-6xl mx-auto">
                        <div className={`text-center mb-16 transform transition-all duration-1000 ${visibleSections['about'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Why Choose Us</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-8"></div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className={`space-y-6 transform transition-all duration-1000 delay-200 ${visibleSections['about'] ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                                <p className="text-lg text-blue-800 leading-relaxed">
                                    Our commitment goes beyond weekly lessons. We host immersive **Workshops and Weekly Challenges** designed specifically to keep students motivated and focused on rapid improvement. 
                                </p>
                                
                                <p className="text-lg text-blue-800 leading-relaxed">
                                    More importantly, we provide consistent opportunities for **stage performance**, including participation in events like the Flute and Fest. This real-world experience is fundamental to enhancing skills, building confidence, and ensuring sustained engagement in the student's musical development.
                                </p>
                                
                                <div className="grid grid-cols-2 gap-6 mt-8">
                                    <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-lg transform hover:scale-105 transition-all duration-300">
                                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-blue-900">500+</div>
                                        <div className="text-blue-700">Students Taught</div>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-lg transform hover:scale-105 transition-all duration-300">
                                        <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-blue-900">15+</div>
                                        <div className="text-blue-700">Years Experience</div>
                                    </div>
                                </div>
                            </div>
                            <div className={`relative transform transition-all duration-1000 delay-400 ${visibleSections['about'] ? 'translate-y-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                                <div className="bg-gradient-to-br from-blue-200 to-yellow-200 rounded-2xl p-8 transform rotate-3 shadow-xl hover:rotate-0 transition-all duration-500">
                                    <Music className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-blue-900 text-center mb-4">Our Mission</h3>
                                    <p className="text-blue-800 text-center leading-relaxed">
                                        To spread the divine beauty of Krishna's flute music, touching hearts and souls through the power of melody, rhythm, and spiritual connection.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="founder" className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className={`text-center mb-16 transform transition-all duration-1000 ${visibleSections['founder'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Our Guru</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-8"></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className={`relative transform transition-all duration-1000 delay-200 ${visibleSections['founder'] ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                                <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                                    <img 
                                        src="/guru.jpg" 
                                        alt="Founder of Krishna Flute Academy" 
                                        className="w-full h-96 object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full p-4 shadow-xl animate-pulse">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className={`space-y-6 transform transition-all duration-1000 delay-400 ${visibleSections['founder'] ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                                <h3 className="text-3xl font-bold text-blue-900">Master Musician & Educator</h3>
                                <p className="text-lg text-blue-800 leading-relaxed">
                                    Dedicated and passionate Indian classical flute player with a strong background in music education and performance. With over **20 years of teaching experience** and professional training under the guidance of renowned gurus Sri Bishwajit Sarkar and Sri Ashok Kumar Karmakar, I have developed expertise in multiple genres, including classical, folk, contemporary, Rabindrasangeet, and Bollywood music. My goal is to inspire and educate students by imparting traditional and contemporary music knowledge while fostering a deep appreciation for Indian musical heritage. 
                                </p>
                                <div className="grid grid-cols-2 gap-6 mt-8">
                                    <div className="space-y-3 bg-gradient-to-br from-blue-100 to-yellow-100 p-4 rounded-lg shadow-md">
                                        <h4 className="text-xl font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                                            <Award className="w-6 h-6 text-yellow-600" /> 
                                            <span>Key Achievements</span>
                                        </h4>
                                        <div className="flex items-center space-x-3 text-blue-700">
                                            <Music className="w-5 h-5 text-blue-500" />
                                            <span>Featured artist on TV channels like Kannada Doordarshan and Tara Bangla</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-blue-700">
                                            <Music className="w-5 h-5 text-blue-500" />
                                            <span>Performed in prestigious music events across India</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3 bg-gradient-to-br from-blue-100 to-yellow-100 p-4 rounded-lg shadow-md">
                                        <h4 className="text-xl font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                                            <Star className="w-6 h-6 text-blue-600" /> 
                                            <span>Core Expertise</span>
                                        </h4>
                                        <div className="flex items-center space-x-3 text-blue-700">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span>Classical & Contemporary Flute Performance</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-blue-700">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span>Music Theory & Instrumental Training</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-blue-700">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span>Rabindrasangeet & Bollywood Music</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="flutes" className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className={`text-center mb-16 transform transition-all duration-1000 ${visibleSections['flutes'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Handcrafted Flutes</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-blue-500 mx-auto mb-8"></div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                            <div className={`md:w-1/2 transform transition-all duration-1000 delay-200 ${visibleSections['flutes'] ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                                <img 
                                    src="/flutes_custom.jpg" 
                                    alt="Handcrafted Flutes" 
                                    className="w-full rounded-xl shadow-2xl"
                                />
                            </div>
                            <div className={`md:w-1/2 space-y-6 transform transition-all duration-1000 delay-400 ${visibleSections['flutes'] ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                                <p className="text-3xl font-semibold text-blue-900">
                                    Handcrafted flutes tailored to each student's requirements.
                                </p>
                                <p className="text-3xl text-blue-800 leading-relaxed">
                                    We believe that the instrument should be an extension of the artist. We use **Assam Bamboo** to make flutes (**Bansuri**) precisely tuned to individual requirements, ensuring optimal tone quality, comfort, and pitch accuracy for a seamless learning experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <BlogSection visible={visibleSections['blog']} />

                <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
                    <div className="max-w-7xl mx-auto">
                        <div className={`text-center mb-16 transform transition-all duration-1000 ${visibleSections['gallery'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Gallery</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-8"></div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                "https://www.youtube.com/embed/TJq0CarUMzw?si=e3Q6jeyHfhqcGiBm",
                                "https://www.youtube.com/embed/TI06mJF_FSU?si=QO_EXCNieml9NsJj",
                                "https://www.youtube.com/embed/1SF2AYK_Y-U?si=9QssT5N4X6GrE8yp"
                            ].map((embedUrl, index) => (
                                <div 
                                    key={index}
                                    className={`w-full h-56 bg-gray-200 rounded-xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-all duration-500 ${visibleSections['gallery'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <iframe
                                        className="w-full h-full"
                                        src={embedUrl}
                                        title={`YouTube video player ${index + 1}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-blue-700 mt-8">Find more performances on our official YouTube channel.</p>
                    </div>
                </section>

                <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
                    <div className="max-w-7xl mx-auto">
                        <div className={`text-center mb-16 transform transition-all duration-1000 ${visibleSections['courses'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Learn With Us</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-8"></div>
                            <p className="text-xl text-blue-700 max-w-3xl mx-auto">
                                Programs designed for every skill level and age group
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    title: "Beginner",
                                    description: "Perfect for your first steps into flute music",
                                    features: ["Introduction to the Flute", "Breath Control & Blowing Techniques", "Fundamentals of Swaras", "Taan Practice (Basic)"],
                                    icon: <Play className="w-8 h-8" />,
                                    color: "from-blue-400 to-blue-600"
                                },
                                {
                                    title: "Intermediate", 
                                    description: "Build your foundation with advanced techniques",
                                    features: ["Advanced Taan Practice", "Introduction to Komal Swaras", "Introduction to Raagas", "Mastering Advanced Playing Techniques"],
                                    icon: <Music className="w-8 h-8" />,
                                    color: "from-yellow-400 to-yellow-600"
                                },
                                {
                                    title: "Advanced",
                                    description: "Master intricate compositions and professional techniques",
                                    features: ["Complex ragas", "Taan & meend", "Concert preparation", "Teaching methodology"],
                                    icon: <Award className="w-8 h-8" />,
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
                                        <p className="text-blue-800 mb-6 leading-relaxed">{course.description}</p>
                                        <ul className="space-y-2 mb-6">
                                            {course.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center space-x-2 text-blue-700">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className={`text-center mb-16 transform transition-all duration-1000 ${visibleSections['contact'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">Contact Us</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-8"></div>
                            <p className="text-xl text-blue-700">Ready to start your musical journey? Let's connect!</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className={`space-y-8 transform transition-all duration-1000 delay-200 ${visibleSections['contact'] ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                                <div className="flex items-start space-x-4 transform transition-all duration-300 hover:translate-x-2">
                                    <div className="bg-gradient-to-r from-blue-500 to-yellow-500 p-3 rounded-full">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-900 mb-2">Phone</h3>
                                        <p className="text-blue-700">+91 98765 43210</p>
                                        <p className="text-blue-700">+91 87654 32109</p>
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
                            <div className={`bg-white rounded-2xl shadow-xl p-8 space-y-6 transform transition-all duration-1000 delay-400 ${visibleSections['contact'] ? 'translate-y-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
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

                <footer className="bg-gradient-to-r from-blue-900 to-yellow-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <img 
                                        src="/image.png" 
                                        alt="Krishna Flute Academy" 
                                        className="h-10 w-10 object-contain"
                                    />
                                    <span className="text-xl font-bold">Krishna Flute Academy</span>
                                </div>
                                <p className="text-blue-100 leading-relaxed">
                                    Spreading the divine melodies of Krishna's flute through traditional teaching and modern techniques.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                                <ul className="space-y-2 text-blue-100">
                                    <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About Us</button></li>
                                    <li><button onClick={() => scrollToSection('courses')} className="hover:text-white transition-colors">Courses</button></li>
                                    <li><button onClick={() => scrollToSection('founder')} className="hover:text-white transition-colors">Our Founder</button></li>
                                    <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button></li>
                                    <li><button onClick={() => scrollToSection('gallery')} className="hover:text-white transition-colors">Gallery</button></li>
                                    <li><button onClick={() => scrollToSection('blog')} className="hover:text-white transition-colors">Blog</button></li>
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
                        <div className="border-t border-blue-700 mt-8 pt-8 text-center text-blue-200">
                            <p>© 2025 Krishna Flute Academy. All rights reserved. | Designed with love for music lovers</p>
                        </div>
                    </div>
                </footer>
                
                <a 
                    href={`${baseWhatsappUrl}${encodeURIComponent(defaultInquiryMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-10 hover:bg-green-600"
                    aria-label="Chat with us on WhatsApp"
                >
                    <MessageSquare className="w-7 h-7 text-white" />
                </a>
            </div>
            )}
        </div>
    );
}

export default App;