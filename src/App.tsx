import React, { useState, useEffect } from 'react';
import { Music, Users, Award, Phone, Mail, MapPin, Star, Play, BookOpen, Heart, Sparkles } from 'lucide-react';

function App() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-lg z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/public/image.png" 
                alt="Krishna Flute Academy Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold text-blue-800 font-playfair">Krishna Flute Academy</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('about')} className="text-blue-700 hover:text-blue-900 transition-colors">About</button>
              <button onClick={() => scrollToSection('founder')} className="text-blue-700 hover:text-blue-900 transition-colors">Founder</button>
              <button onClick={() => scrollToSection('courses')} className="text-blue-700 hover:text-blue-900 transition-colors">Courses</button>
              <button onClick={() => scrollToSection('contact')} className="text-blue-700 hover:text-blue-900 transition-colors">Contact</button>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-yellow-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Book Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <img 
                  src="/public/image.png" 
                  alt="Krishna Flute Academy" 
                  className="h-32 w-32 object-contain mx-auto drop-shadow-2xl"
                />
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-yellow-400/20 rounded-full blur-xl"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-blue-900 mb-6 font-playfair leading-tight">
              Learn the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-600">Divine Art</span>
              <br />of Krishna's Flute
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover the enchanting melodies that touched hearts for millennia. 
              Master the sacred bamboo flute with traditional techniques and modern teaching methods.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => scrollToSection('courses')}
                className="bg-gradient-to-r from-blue-500 to-yellow-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Your Journey</span>
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Learn More</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Pattern */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 font-playfair">About Our Academy</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-8"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-blue-800 leading-relaxed">
                Krishna Flute Academy is a sacred space where the timeless art of flute playing comes alive. 
                Inspired by the divine melodies of Lord Krishna's flute, we dedicate ourselves to preserving 
                and sharing this beautiful tradition with students of all ages and skill levels.
              </p>
              
              <p className="text-lg text-blue-800 leading-relaxed">
                Our academy combines traditional Indian classical techniques with modern pedagogical approaches, 
                ensuring that each student receives personalized attention and guidance. Whether you're a complete 
                beginner drawn to the flute's enchanting sound or an advanced player seeking to deepen your artistry, 
                we provide a nurturing environment for your musical journey.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">500+</div>
                  <div className="text-blue-700">Students Taught</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-lg">
                  <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">15+</div>
                  <div className="text-blue-700">Years Experience</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-200 to-yellow-200 rounded-2xl p-8 transform rotate-3 shadow-xl">
                <Music className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-blue-900 text-center mb-4 font-playfair">Our Mission</h3>
                <p className="text-blue-800 text-center leading-relaxed">
                  To spread the divine beauty of Krishna's flute music, touching hearts and souls 
                  through the power of melody, rhythm, and spiritual connection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="founder" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 font-playfair">Meet Our Founder</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-8"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="/public/image.png" 
                  alt="Founder of Krishna Flute Academy" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full p-4 shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-blue-900 font-playfair">Meet Our Founder</h3>
              
              <p className="text-lg text-blue-800 leading-relaxed">
                Dedicated and passionate Indian classical flute player with a strong background in music education and performance. With over 20 years of teaching experience and professional training under the guidance of renowned gurus Sri Bishwajit Sarkar and Sri Ashok Kumar Karmakar, I have developed expertise in multiple genres, including classical, folk, contemporary, Rabindrasangeet, and Bollywood music.
              </p>
              
              <p className="text-lg text-blue-800 leading-relaxed">
                My goal is to inspire and educate students by imparting traditional and contemporary music knowledge while fostering a deep appreciation for Indian musical heritage.
              </p>
              
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-blue-900 font-playfair">Skills & Expertise</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-blue-500" />
                    <span className="text-blue-800">Classical & Contemporary Flute Performance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-blue-500" />
                    <span className="text-blue-800">Music Theory & Instrumental Training</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-blue-500" />
                    <span className="text-blue-800">Rabindrasangeet & Bollywood Music</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-blue-500" />
                    <span className="text-blue-800">Student Mentorship & Curriculum Development</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-blue-500" />
                    <span className="text-blue-800">Conducting Music Workshops & Events</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-blue-500" />
                    <span className="text-blue-800">Collaboration with Renowned Musicians</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-blue-500" />
                    <span className="text-blue-800">Personalized Training for Beginners & Advanced Students</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-blue-900 font-playfair">Performance & Achievements</h4>
                <div className="flex items-center space-x-3">
                  <Music className="w-5 h-5 text-blue-500" />
                  <span className="text-blue-800">Featured artist on TV channels like Kannada Doordarshan and Tara Bangla</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Music className="w-5 h-5 text-blue-500" />
                  <span className="text-blue-800">Performed in prestigious music events across India, including West Bengal, Bhubaneswar, and Bangalore</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Music className="w-5 h-5 text-blue-500" />
                  <span className="text-blue-800">Collaborated with eminent music arrangers and artists nationwide</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Music className="w-5 h-5 text-blue-500" />
                  <span className="text-blue-800">Developed and uploaded flute tutorials and backing tracks for students and music enthusiasts</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-blue-900 font-playfair">Experience</h4>
                <div className="bg-gradient-to-br from-blue-50 to-yellow-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Founder & Music Educator</h5>
                  <p className="text-sm text-blue-700 mb-2">Krishna Flute Academy | 2019 - Present</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Established a flute academy dedicated to teaching Indian classical and contemporary flute music</li>
                    <li>• Trained numerous students, helping them master flute techniques and understand music theory</li>
                    <li>• Organized workshops, interactive sessions, and live performances for students</li>
                    <li>• Promoted Indian classical music through collaborative performances and online tutorials</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-yellow-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Guest Performer & Instructor</h5>
                  <p className="text-sm text-blue-700 mb-2">Various Schools & Cultural Institutions | 2010 - Present</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Conducted flute training sessions and music appreciation classes in schools and institutions</li>
                    <li>• Guided students in both practical performance and theoretical knowledge of Indian music</li>
                    <li>• Performed at school events, showcasing Indian classical and folk music traditions</li>
                    <li>• Notable institutions: Ramkrishna Mission Ashram Belur, Kendriya Vidyalaya Malleshwaram, ISKCON</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 font-playfair">Our Courses</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-8"></div>
            <p className="text-xl text-blue-700 max-w-3xl mx-auto">
              Choose from our carefully crafted programs designed for every skill level and age group
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Beginner Course",
                description: "Perfect for those taking their first steps into the world of flute music",
                features: ["Basic breathing techniques", "Simple melodies", "Music theory basics", "Posture & holding"],
                icon: <Play className="w-8 h-8" />,
                color: "from-blue-400 to-blue-600"
              },
              {
                title: "Intermediate Course", 
                description: "Build upon your foundation with more complex techniques and compositions",
                features: ["Advanced breathing", "Classical ragas", "Improvisation skills", "Performance techniques"],
                icon: <Music className="w-8 h-8" />,
                color: "from-yellow-400 to-yellow-600"
              },
              {
                title: "Advanced Course",
                description: "Master the art with intricate compositions and professional techniques",
                features: ["Complex ragas", "Taan & meend", "Concert preparation", "Teaching methodology"],
                icon: <Award className="w-8 h-8" />,
                color: "from-blue-500 to-yellow-500"
              },
              {
                title: "Kids Special",
                description: "Fun and engaging lessons designed specifically for young learners",
                features: ["Playful learning", "Simple songs", "Rhythm games", "Creative expression"],
                icon: <Heart className="w-8 h-8" />,
                color: "from-yellow-300 to-blue-500"
              }
            ].map((course, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                <div className={`bg-gradient-to-r ${course.color} p-6 text-white`}>
                  <div className="flex items-center justify-center mb-4">
                    {course.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center font-playfair">{course.title}</h3>
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
                  
                  <button className="w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-500 to-yellow-500 text-white px-12 py-4 rounded-full text-xl font-semibold hover:from-blue-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Book Your Free Trial Class
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 font-playfair">Get In Touch</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-8"></div>
            <p className="text-xl text-blue-700">Ready to begin your musical journey? We'd love to hear from you!</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-yellow-500 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">Phone</h3>
                  <p className="text-blue-700">+91 98765 43210</p>
                  <p className="text-blue-700">+91 87654 32109</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-yellow-500 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">Email</h3>
                  <p className="text-blue-700">info@krishnafluteacademy.com</p>
                  <p className="text-blue-700">admissions@krishnafluteacademy.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-yellow-500 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">Address</h3>
                  <p className="text-blue-700">123 Music Lane, Cultural District</p>
                  <p className="text-blue-700">New Delhi, India - 110001</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-100 to-yellow-100 p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Free Trial Class</h3>
                <p className="text-blue-800 mb-4">
                  Experience our teaching methodology with a complimentary 30-minute session. 
                  No commitment required!
                </p>
                <button className="bg-gradient-to-r from-blue-500 to-yellow-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105">
                  Schedule Free Trial
                </button>
              </div>
            </div>
            
            <form className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              <div>
                <label className="block text-blue-900 font-semibold mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-blue-900 font-semibold mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-blue-900 font-semibold mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-blue-900 font-semibold mb-2">Course Interest</label>
                <select className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300">
                  <option>Select a course</option>
                  <option>Beginner Course</option>
                  <option>Intermediate Course</option>
                  <option>Advanced Course</option>
                  <option>Kids Special</option>
                </select>
              </div>
              
              <div>
                <label className="block text-blue-900 font-semibold mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Tell us about your musical background and goals..."
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-white py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Send Message
              </button>
            </form>
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
                  src="/public/image.png" 
                  alt="Krishna Flute Academy" 
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-bold font-playfair">Krishna Flute Academy</span>
              </div>
              <p className="text-blue-100 leading-relaxed">
                Spreading the divine melodies of Krishna's flute through traditional teaching 
                and modern techniques.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-blue-100">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection('courses')} className="hover:text-white transition-colors">Courses</button></li>
                <li><button onClick={() => scrollToSection('founder')} className="hover:text-white transition-colors">Our Founder</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">@</span>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-700 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; 2024 Krishna Flute Academy. All rights reserved. | Designed with ❤️ for music lovers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;