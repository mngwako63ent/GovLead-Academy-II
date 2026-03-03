import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  PlayCircle, 
  CheckCircle2, 
  Lock,
  Award,
  TrendingUp,
  Search,
  Settings,
  Bookmark,
  Clock,
  MessageSquare,
  FileText,
  Download,
  Maximize2,
  Minimize2,
  User,
  Shield,
  Plus,
  Filter,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Globe,
  Camera,
  Briefcase,
  Target,
  Rocket,
  Upload,
  LayoutGrid,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'student';
  onboarding_preferences?: string;
  subscription_status?: string;
  bio?: string;
  business_name?: string;
  business_stage?: string;
  experience_level?: string;
  interests?: string;
  avatar_url?: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  image_url: string;
  price: number;
  category_id?: number;
  status?: string;
}

interface Lesson {
  id: number;
  title: string;
  content: string;
  video_url: string;
  duration: string;
  is_free_preview: boolean;
  order_index: number;
  progress?: {
    completed: boolean;
    progress_percentage: number;
    last_watched_timestamp: string;
  };
}

interface Module {
  id: number;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

// --- Components ---

const Navbar = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    ...(user ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
    ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-display font-bold text-gov-blue">GovLead</span>
              <span className="text-2xl font-display font-light text-slate-400">Academy</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-gov-blue ${
                  location.pathname === link.path ? 'text-gov-blue' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-gov-blue">
                  <User size={18} />
                  <span>{user.full_name}</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 text-sm">
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-gov-blue"
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gov-blue"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-50 border-t border-slate-200 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl font-display font-bold text-gov-blue">GovLead</span>
            <span className="text-2xl font-display font-light text-slate-400">Academy</span>
          </div>
          <p className="text-slate-500 max-w-sm">
            The official executive training division of GovLead. Empowering public sector leaders with strategic growth operating systems.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-4">Support</h4>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs">
        © 2026 GovLead Academy. All rights reserved.
      </div>
    </div>
  </footer>
);

// --- Pages ---

const Onboarding = ({ user, onComplete }: { user: User, onComplete: () => void }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const [preferences, setPreferences] = useState({
    interests: [] as string[],
    goal: '',
    businessStage: ''
  });

  const stages = ['Idea', 'Startup', 'Scaling', 'Established'];
  const interests = ['Strategy', 'Leadership', 'Governance', 'Marketing', 'Systems'];

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences })
      });
      onComplete();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full glass-card p-10 rounded-3xl space-y-8"
      >
        <div className="space-y-2 text-center">
          <div className="text-gov-blue font-bold text-sm uppercase tracking-widest">Step {step} of 3</div>
          <h2 className="text-3xl font-display font-bold text-slate-900">
            {step === 1 && "What are your interests?"}
            {step === 2 && "What is your primary goal?"}
            {step === 3 && "What is your business stage?"}
          </h2>
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {interests.map(i => (
                <button
                  key={i}
                  onClick={() => {
                    const next = preferences.interests.includes(i) 
                      ? preferences.interests.filter(x => x !== i)
                      : [...preferences.interests, i];
                    setPreferences({ ...preferences, interests: next });
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-sm font-bold ${
                    preferences.interests.includes(i) ? 'border-gov-blue bg-gov-blue/5 text-gov-blue' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {['Professional Growth', 'Institutional Excellence', 'Strategic Leadership'].map(g => (
                <button
                  key={g}
                  onClick={() => setPreferences({ ...preferences, goal: g })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all font-bold ${
                    preferences.goal === g ? 'border-gov-blue bg-gov-blue/5 text-gov-blue' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {stages.map(s => (
                <button
                  key={s}
                  onClick={() => setPreferences({ ...preferences, businessStage: s })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all font-bold ${
                    preferences.businessStage === s ? 'border-gov-blue bg-gov-blue/5 text-gov-blue' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleNext} className="w-full btn-primary py-4">
          {step === 3 ? 'Complete Setup' : 'Continue'}
        </button>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user }: { user: User | null }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/dashboard/enhanced')
      .then(res => res.ok ? res.json() : { enrollments: [], continueWatching: [], bookmarks: [], recommended: [], recentlyAdded: [] })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setData({ enrollments: [], continueWatching: [], bookmarks: [], recommended: [], recentlyAdded: [] });
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900">Command Center</h1>
          <p className="text-slate-500 mt-2">Welcome back, {user?.full_name}. Here's your strategic overview.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="glass-card px-6 py-3 rounded-xl flex items-center space-x-3">
            <Award className="text-gov-accent" size={24} />
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Badges</div>
              <div className="text-xl font-bold text-slate-900">3</div>
            </div>
          </div>
          <div className="glass-card px-6 py-3 rounded-xl flex items-center space-x-3">
            <TrendingUp className="text-gov-blue" size={24} />
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Overall Progress</div>
              <div className="text-xl font-bold text-slate-900">24%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Watching */}
      {data.continueWatching.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
            <Clock className="text-gov-blue" /> Continue Watching
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.continueWatching.map((item: any) => (
              <Link 
                key={item.lesson_id} 
                to={`/player/${item.course_id}/${item.lesson_id}`}
                className="glass-card rounded-2xl overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="aspect-video relative">
                  <img src={item.image_url} alt={item.course_title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle size={48} className="text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
                    <div className="h-full bg-gov-blue" style={{ width: `${item.progress_percentage}%` }}></div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-bold text-gov-blue uppercase tracking-widest mb-1">{item.course_title}</div>
                  <h3 className="font-bold text-slate-900 line-clamp-1">{item.lesson_title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Enrolled Courses */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-slate-900">My Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.enrollments.map((course: any) => (
                <div key={course.id} className="glass-card p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900">{course.title}</h3>
                    <CheckCircle2 size={20} className="text-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                      <span>Completion</span>
                      <span>15%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gov-blue w-[15%]"></div>
                    </div>
                  </div>
                  <Link to={`/courses/${course.id}`} className="block text-center text-sm font-bold text-gov-blue hover:underline">
                    View Course Details
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-slate-900">Recommended For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.recommended.map((course: any) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="flex gap-4 group">
                  <div className="w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-gov-blue transition-colors line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Recently Added */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-slate-900">Recently Added</h2>
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {data.recentlyAdded.map((course: any) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="w-64 flex-shrink-0 group space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-gov-blue transition-colors text-sm line-clamp-1">{course.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-12">
          {/* Bookmarks */}
          <section className="space-y-6">
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="text-gov-accent" size={20} /> Bookmarked
            </h2>
            <div className="space-y-4">
              {data.bookmarks.length > 0 ? data.bookmarks.map((course: any) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="block glass-card p-4 rounded-xl hover:bg-slate-50 transition-colors">
                  <h3 className="text-sm font-bold text-slate-900">{course.title}</h3>
                </Link>
              )) : (
                <p className="text-sm text-slate-400 italic">No bookmarks yet.</p>
              )}
            </div>
          </section>

          {/* Achievements */}
          <section className="space-y-6">
            <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <Award className="text-gov-blue" size={20} /> Achievements
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-300">
                  <Award size={24} />
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

const CoursePlayer = ({ user }: { user: User | null }) => {
  const { courseId, lessonId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCinema, setIsCinema] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<any[]>([]);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [cRes, lRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/lessons/${lessonId}`)
      ]);
      setCourse(await cRes.json());
      setLesson(await lRes.json());
      setLoading(false);
    };
    fetchData();
  }, [courseId, lessonId]);

  useEffect(() => {
    if (lesson) {
      fetch(`/api/lessons/${lesson.id}/notes`).then(res => res.json()).then(setNotes);
      fetch(`/api/lessons/${lesson.id}/discussions`).then(res => res.json()).then(setDiscussions);
    }
  }, [lesson]);

  const handleComplete = async () => {
    await fetch(`/api/lessons/${lesson.id}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true, progress_percentage: 100, last_watched_timestamp: new Date().toISOString() })
    });
    // Find next lesson
    const allLessons = course.modules.flatMap((m: any) => m.lessons);
    const currentIdx = allLessons.findIndex((l: any) => l.id === parseInt(lessonId!));
    if (currentIdx < allLessons.length - 1) {
      navigate(`/player/${courseId}/${allLessons[currentIdx + 1].id}`);
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    await fetch(`/api/lessons/${lesson.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: note, timestamp: '0:00' })
    });
    setNote('');
    fetch(`/api/lessons/${lesson.id}/notes`).then(res => res.json()).then(setNotes);
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Player...</div>;

  return (
    <div className={`flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-slate-950 overflow-hidden ${isCinema ? 'cinema-mode' : ''}`}>
      {/* Video Area */}
      <div className={`flex-grow flex flex-col ${isCinema ? 'w-full' : 'lg:w-3/4'}`}>
        <div className="relative aspect-video bg-black group">
          <img 
            src={course.image_url} 
            alt="Video Placeholder" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle size={80} className="text-white opacity-80 cursor-pointer hover:scale-110 transition-transform" />
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setIsCinema(!isCinema)}
              className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70"
            >
              {isCinema ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>

        <div className="p-8 bg-white flex-grow overflow-y-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-gov-blue font-bold text-xs uppercase tracking-widest mb-2">{course.title}</div>
              <h1 className="text-3xl font-display font-bold text-slate-900">{lesson.title}</h1>
            </div>
            <button onClick={handleComplete} className="btn-primary flex items-center gap-2">
              <CheckCircle2 size={20} /> Mark Complete
            </button>
          </div>

          <div className="border-b border-slate-200 flex space-x-8 mb-8">
            {['notes', 'discussions', 'resources'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === tab ? 'border-gov-blue text-gov-blue' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Add a note at 0:00..."
                    className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gov-blue/20"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                  />
                  <button onClick={addNote} className="btn-primary">Save</button>
                </div>
                <div className="space-y-4">
                  {notes.map(n => (
                    <div key={n.id} className="p-4 bg-slate-50 rounded-xl flex gap-4">
                      <div className="text-gov-blue font-bold text-xs">{n.timestamp}</div>
                      <p className="text-sm text-slate-700">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'discussions' && (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Ask a question..."
                    className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gov-blue/20"
                  />
                  <button className="btn-primary">Post</button>
                </div>
                <div className="space-y-4">
                  {discussions.map(d => (
                    <div key={d.id} className="p-4 border border-slate-100 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900">{d.full_name}</span>
                        <span className="text-[10px] text-slate-400">{new Date(d.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-600">{d.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'resources' && (
              <div className="space-y-4">
                {lesson?.document_url ? (
                  <a 
                    href={lesson.document_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="text-gov-blue" />
                      <span className="text-sm font-medium">Lesson Resource</span>
                    </div>
                    <Download size={18} className="text-slate-400" />
                  </a>
                ) : (
                  <div className="text-center py-8 text-slate-400 italic text-sm">
                    No resources available for this lesson.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {!isCinema && (
        <div className="lg:w-1/4 bg-slate-900 border-l border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-white font-bold">Course Content</h2>
            <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gov-blue w-[15%]"></div>
            </div>
            <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase">15% Complete</div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {course.modules.map((module: any) => (
              <div key={module.id}>
                <div className="px-6 py-4 bg-white/5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {module.title}
                </div>
                <div className="divide-y divide-white/5">
                  {module.lessons.map((l: any) => (
                    <Link
                      key={l.id}
                      to={`/player/${courseId}/${l.id}`}
                      className={`px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors ${
                        parseInt(lessonId!) === l.id ? 'bg-gov-blue/20 border-l-4 border-gov-blue' : ''
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {l.progress?.completed ? (
                          <CheckCircle2 size={18} className="text-emerald-500" />
                        ) : (
                          <PlayCircle size={18} className="text-slate-500" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className={`text-sm font-medium ${parseInt(lessonId!) === l.id ? 'text-white' : 'text-slate-300'}`}>
                          {l.title}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                          <Clock size={10} /> {l.duration || '10:00'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileSettings = ({ user }: { user: User | null }) => {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    business_name: user?.business_name || '',
    business_stage: user?.business_stage || 'Idea',
    experience_level: user?.experience_level || 'Beginner',
    interests: user?.interests || '',
    avatar_url: user?.avatar_url || ''
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);
    
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData
      });
      if (res.ok) {
        const { url } = await res.json();
        setFormData({ ...formData, avatar_url: url });
      }
    } catch (err) {
      alert('Avatar upload failed');
    }
  };

  const handleSave = async () => {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      alert('Profile saved successfully!');
    } else {
      alert('Failed to save profile');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-slate-50/30 min-h-screen">
      <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Account Settings</h1>

      {/* Header Card */}
      <div className="glass-card p-8 rounded-[2.5rem] flex items-center gap-8 border border-white/40 shadow-sm">
        <div className="relative group">
          <div className="w-32 h-32 rounded-3xl bg-slate-100 flex items-center justify-center border-4 border-white shadow-inner overflow-hidden">
            {formData.avatar_url ? (
              <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User size={64} className="text-slate-300" />
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 p-3 bg-gov-accent text-white rounded-2xl shadow-lg hover:scale-110 transition-transform cursor-pointer">
            <Camera size={20} />
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </label>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">{formData.full_name || 'User'}</h2>
          <p className="text-slate-500 font-medium">{formData.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="glass-card p-10 rounded-[2.5rem] space-y-8 border border-white/40 shadow-sm">
          <div className="flex items-center gap-3 text-gov-accent">
            <User size={20} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Basic Information</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gov-blue/10 outline-none transition-all text-slate-700 font-medium" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                disabled
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-400 outline-none cursor-not-allowed font-medium" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Short Bio</label>
              <textarea 
                placeholder="Tell us about yourself..."
                rows={4}
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gov-blue/10 outline-none transition-all text-slate-700 font-medium resize-none" 
              />
            </div>
          </div>
        </div>

        {/* Business Context */}
        <div className="glass-card p-10 rounded-[2.5rem] space-y-8 border border-white/40 shadow-sm">
          <div className="flex items-center gap-3 text-gov-accent">
            <Briefcase size={20} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Business Context</h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Name / Info</label>
              <input 
                type="text" 
                placeholder="Company name or industry"
                value={formData.business_name}
                onChange={e => setFormData({...formData, business_name: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gov-blue/10 outline-none transition-all text-slate-700 font-medium" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Stage</label>
              <select 
                value={formData.business_stage}
                onChange={e => setFormData({...formData, business_stage: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gov-blue/10 outline-none transition-all text-slate-700 font-medium appearance-none"
              >
                <option>Idea</option>
                <option>Startup</option>
                <option>Scaling</option>
                <option>Established</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience Level</label>
              <select 
                value={formData.experience_level}
                onChange={e => setFormData({...formData, experience_level: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gov-blue/10 outline-none transition-all text-slate-700 font-medium appearance-none"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Interests */}
      <div className="glass-card p-10 rounded-[2.5rem] space-y-6 border border-white/40 shadow-sm">
        <div className="flex items-center gap-3 text-gov-accent">
          <Target size={20} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Learning Interests</h3>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">What are you looking to master?</label>
          <input 
            type="text" 
            placeholder="e.g. AI Automation, Brand Strategy, Scaling Teams"
            value={formData.interests}
            onChange={e => setFormData({...formData, interests: e.target.value})}
            className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-gov-blue/10 outline-none transition-all text-slate-700 font-medium" 
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="bg-gov-blue text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-gov-blue/20 hover:scale-105 transition-all active:scale-95"
        >
          <Rocket size={20} />
          Save Profile
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [data, setData] = useState<any>({
    summary: { totalUsers: 0, activeUsers: 0, totalEnrollments: 0, websiteVisits: 0 },
    coursePerformance: [],
    enrollmentTrends: []
  });
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [adminCourses, setAdminCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  const [courseViewMode, setCourseViewMode] = useState<'grid' | 'list'>('grid');
  const [courseToDelete, setCourseToDelete] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [activeCourseForContent, setActiveCourseForContent] = useState<any>(null);
  const [courseModules, setCourseModules] = useState<any[]>([]);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [moduleForm, setModuleForm] = useState({ title: '', order_index: 1 });
  const [lessonForm, setLessonForm] = useState({ title: '', video_url: '', document_url: '', duration: '', is_free_preview: false, order_index: 1, module_id: 0 });
  const [newUser, setNewUser] = useState({ full_name: '', email: '', password: '', role: 'user', subscription_status: 'active' });
  const [courseForm, setCourseForm] = useState({ title: '', description: '', category_id: 1, difficulty: 'intermediate', status: 'published', image_url: '' });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) setUsers(await res.json());
  };

  const fetchAdminCourses = async () => {
    const res = await fetch('/api/courses');
    if (res.ok) setAdminCourses(await res.json());
  };

  const fetchCourseContent = async (courseId: number) => {
    const res = await fetch(`/api/courses/${courseId}`);
    if (res.ok) {
      const data = await res.json();
      setCourseModules(data.modules);
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const { url } = await res.json();
      return url;
    }
    throw new Error('Upload failed');
  };

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingModule ? `/api/admin/modules/${editingModule.id}` : '/api/admin/modules';
    const method = editingModule ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...moduleForm, course_id: activeCourseForContent.id })
    });
    if (res.ok) {
      setShowModuleModal(false);
      fetchCourseContent(activeCourseForContent.id);
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingLesson ? `/api/admin/lessons/${editingLesson.id}` : '/api/admin/lessons';
    const method = editingLesson ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lessonForm, course_id: activeCourseForContent.id })
    });
    if (res.ok) {
      setShowLessonModal(false);
      fetchCourseContent(activeCourseForContent.id);
    }
  };

  const handleDeleteModule = async (id: number) => {
    if (!confirm('Delete this module and all its lessons?')) return;
    const res = await fetch(`/api/admin/modules/${id}`, { method: 'DELETE' });
    if (res.ok) fetchCourseContent(activeCourseForContent.id);
  };

  const handleDeleteLesson = async (id: number) => {
    if (!confirm('Delete this lesson?')) return;
    const res = await fetch(`/api/admin/lessons/${id}`, { method: 'DELETE' });
    if (res.ok) fetchCourseContent(activeCourseForContent.id);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    if (res.ok) {
      setShowUserModal(false);
      setNewUser({ full_name: '', email: '', password: '', role: 'user', subscription_status: 'active' });
      fetchUsers();
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCourse ? `/api/admin/courses/${editingCourse.id}` : '/api/admin/courses';
    const method = editingCourse ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseForm)
    });
    if (res.ok) {
      setShowCourseModal(false);
      setEditingCourse(null);
      setCourseForm({ title: '', description: '', category_id: 1, difficulty: 'intermediate', status: 'published', image_url: '' });
      fetchAdminCourses();
    }
  };

  const handleDeleteCourse = async (id: number) => {
    const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchAdminCourses();
      setCourseToDelete(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, uRes, cRes] = await Promise.all([
          fetch('/api/admin/analytics'),
          fetch('/api/admin/users'),
          fetch('/api/admin/categories')
        ]);
        
        if (aRes.ok) {
          const analyticsData = await aRes.json();
          setData(analyticsData);
        }
        
        if (uRes.ok) setUsers(await uRes.json());
        if (cRes.ok) setCategories(await cRes.json());
        
        fetchAdminCourses();
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Admin...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900">Admin Management</h1>
          <p className="text-slate-500 mt-2">Platform governance and institutional oversight.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'courses', label: 'Course Builder', icon: Plus },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'categories', label: 'Categories', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-white text-gov-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Users', value: data.summary.totalUsers, icon: Users, color: 'text-gov-blue' },
              { label: 'Active Users', value: data.summary.activeUsers, icon: TrendingUp, color: 'text-emerald-600' },
              { label: 'Enrollments', value: data.summary.totalEnrollments, icon: BookOpen, color: 'text-gov-accent' },
              { label: 'Visits', value: data.summary.websiteVisits, icon: BarChart3, color: 'text-indigo-600' },
            ].map((stat, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                  <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-card p-8 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-900">Course Performance</h2>
                <div className="text-xs font-bold text-slate-400 uppercase">Enrollments by Course</div>
              </div>
              <div className="space-y-6">
                {data.coursePerformance.map((c: any) => (
                  <div key={c.title} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-700">{c.title}</span>
                      <span className="text-gov-blue font-bold">{c.enrollments}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(c.enrollments / Math.max(...data.coursePerformance.map((x:any)=>x.enrollments))) * 100}%` }}
                        className="h-full bg-gov-blue"
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
              <div className="space-y-6">
                {users.slice(0, 5).map((u, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gov-blue/10 flex items-center justify-center text-gov-blue font-bold">
                      {u.full_name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{u.full_name}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Joined {new Date(u.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveTab('users')} className="w-full mt-8 py-3 text-xs font-bold text-gov-blue hover:bg-gov-blue/5 rounded-xl transition-all">
                View All Users
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
            <button onClick={() => setShowUserModal(true)} className="btn-primary flex items-center gap-2">
              <Plus size={20} /> Create Account
            </button>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-100">
            <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subscription</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900">{u.full_name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{u.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={u.role}
                      onChange={async (e) => {
                        const newRole = e.target.value;
                        const res = await fetch(`/api/admin/users/${u.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ role: newRole, subscription_status: u.subscription_status })
                        });
                        if (res.ok) {
                          setUsers(users.map(user => user.id === u.id ? { ...user, role: newRole } : user));
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border-none outline-none cursor-pointer transition-all ${
                        u.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={u.subscription_status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        const res = await fetch(`/api/admin/users/${u.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ role: u.role, subscription_status: newStatus })
                        });
                        if (res.ok) {
                          setUsers(users.map(user => user.id === u.id ? { ...user, subscription_status: newStatus } : user));
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border-none outline-none cursor-pointer transition-all ${
                        u.subscription_status === 'premium' ? 'bg-gov-accent/10 text-gov-accent' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-400 font-medium">
                    {new Date(u.created_at).toLocaleDateString('en-CA')}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this user?')) {
                          const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
                          if (res.ok) {
                            setUsers(users.filter(user => user.id !== u.id));
                          }
                        }
                      }}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {activeTab === 'courses' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h2 className="text-2xl font-bold text-slate-900">Course Builder</h2>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setCourseViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${courseViewMode === 'grid' ? 'bg-white text-gov-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Grid View"
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setCourseViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${courseViewMode === 'list' ? 'bg-white text-gov-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
            <Link 
              to="/admin/courses/new"
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} /> Create New Course
            </Link>
          </div>

          {courseViewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminCourses.map(course => (
                <div key={course.id} className="glass-card rounded-2xl overflow-hidden group border border-slate-100">
                  <div className="aspect-video relative">
                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Link 
                        to={`/admin/courses/${course.id}/edit`}
                        className="p-3 bg-white rounded-full text-gov-blue hover:scale-110 transition-transform"
                      >
                        <Edit3 size={20} />
                      </Link>
                      <button 
                        onClick={() => setCourseToDelete(course)}
                        className="p-3 bg-white rounded-full text-red-500 hover:scale-110 transition-transform"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-900 line-clamp-1">{course.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${course.status === 'published' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {course.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                    <button 
                      onClick={() => {
                        setActiveCourseForContent(course);
                        fetchCourseContent(course.id);
                      }}
                      className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-gov-blue hover:text-white transition-all"
                    >
                      Manage Content
                    </button>
                  </div>
                </div>
              ))}
              <div 
                onClick={() => navigate('/admin/courses/new')}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Plus size={48} className="text-slate-300" />
                <div className="font-bold text-slate-500">Add another course</div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl overflow-hidden border border-slate-100">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Difficulty</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminCourses.map(course => (
                    <tr key={course.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={course.image_url} alt="" className="w-12 h-8 object-cover rounded shadow-sm" referrerPolicy="no-referrer" />
                          <div>
                            <div className="font-bold text-slate-900">{course.title}</div>
                            <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{course.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-medium text-slate-600">
                          {categories.find(c => c.id === course.category_id)?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          course.status === 'published' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-400 uppercase">{course.difficulty}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setActiveCourseForContent(course);
                              fetchCourseContent(course.id);
                            }}
                            className="p-2 text-slate-400 hover:text-gov-blue transition-colors"
                            title="Manage Content"
                          >
                            <Settings size={18} />
                          </button>
                          <Link 
                            to={`/admin/courses/${course.id}/edit`}
                            className="p-2 text-slate-400 hover:text-gov-blue transition-colors"
                            title="Edit Course"
                          >
                            <Edit3 size={18} />
                          </Link>
                          <button 
                            onClick={() => setCourseToDelete(course)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Course Modal */}
      <AnimatePresence>
        {showCourseModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
                <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCourseSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Course Title</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                        value={courseForm.title}
                        onChange={e => setCourseForm({...courseForm, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                      <select 
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                        value={courseForm.category_id}
                        onChange={e => setCourseForm({...courseForm, category_id: parseInt(e.target.value)})}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Difficulty</label>
                      <select 
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                        value={courseForm.difficulty}
                        onChange={e => setCourseForm({...courseForm, difficulty: e.target.value})}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Thumbnail</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="URL or Upload"
                          className="flex-grow px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                          value={courseForm.image_url}
                          onChange={e => setCourseForm({...courseForm, image_url: e.target.value})}
                        />
                        <label className="p-2 bg-slate-100 rounded-xl cursor-pointer hover:bg-slate-200 transition-colors">
                          <Upload size={20} className="text-slate-600" />
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const url = await handleFileUpload(file);
                                  setCourseForm({...courseForm, image_url: url});
                                } catch (err) {
                                  alert('Upload failed');
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                      <select 
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                        value={courseForm.status}
                        onChange={e => setCourseForm({...courseForm, status: e.target.value})}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none resize-none"
                    value={courseForm.description}
                    onChange={e => setCourseForm({...courseForm, description: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-4 text-lg">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {courseToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Delete Course?</h2>
                <p className="text-slate-500">
                  Are you sure you want to delete <span className="font-bold text-slate-900">"{courseToDelete.title}"</span>? 
                  This action cannot be undone and will remove all associated content.
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCourseToDelete(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDeleteCourse(courseToDelete.id)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Course Content Manager (Modules/Lessons) */}
      <AnimatePresence>
        {activeCourseForContent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-5xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Manage Content</h2>
                  <p className="text-sm text-slate-500">{activeCourseForContent.title}</p>
                </div>
                <button onClick={() => setActiveCourseForContent(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Modules</h3>
                  <button 
                    onClick={() => {
                      setEditingModule(null);
                      setModuleForm({ title: '', order_index: courseModules.length + 1 });
                      setShowModuleModal(true);
                    }}
                    className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Module
                  </button>
                </div>

                <div className="space-y-6">
                  {courseModules.map((module, mIdx) => (
                    <div key={module.id} className="border border-slate-100 rounded-2xl p-6 space-y-4 bg-slate-50/50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">{mIdx + 1}</span>
                          <h4 className="font-bold text-slate-900">{module.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setEditingModule(module);
                              setModuleForm({ title: module.title, order_index: module.order_index });
                              setShowModuleModal(true);
                            }}
                            className="p-2 text-slate-400 hover:text-gov-blue"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => handleDeleteModule(module.id)} className="p-2 text-slate-400 hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              setEditingLesson(null);
                              setLessonForm({ title: '', video_url: '', document_url: '', duration: '', is_free_preview: false, order_index: module.lessons.length + 1, module_id: module.id });
                              setShowLessonModal(true);
                            }}
                            className="ml-4 btn-primary py-1.5 px-3 text-[10px] flex items-center gap-1"
                          >
                            <Plus size={14} /> Add Lesson
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 pl-10">
                        {module.lessons.map((lesson, lIdx) => (
                          <div key={lesson.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 group">
                            <div className="flex items-center gap-3">
                              <PlayCircle size={16} className="text-slate-300" />
                              <span className="text-sm text-slate-600">{lesson.title}</span>
                              {lesson.is_free_preview === 1 && <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Free</span>}
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setEditingLesson(lesson);
                                  setLessonForm({
                                    title: lesson.title,
                                    video_url: lesson.video_url || '',
                                    document_url: lesson.document_url || '',
                                    duration: lesson.duration || '',
                                    is_free_preview: lesson.is_free_preview === 1,
                                    order_index: lesson.order_index,
                                    module_id: module.id
                                  });
                                  setShowLessonModal(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-gov-blue"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button onClick={() => handleDeleteLesson(lesson.id)} className="p-1.5 text-slate-400 hover:text-red-500">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Module Modal */}
      <AnimatePresence>
        {showModuleModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-900">{editingModule ? 'Edit Module' : 'Add Module'}</h2>
              <form onSubmit={handleModuleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Module Title</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                    value={moduleForm.title}
                    onChange={e => setModuleForm({...moduleForm, title: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Order Index</label>
                  <input 
                    type="number" 
                    required 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                    value={moduleForm.order_index}
                    onChange={e => setModuleForm({...moduleForm, order_index: parseInt(e.target.value)})}
                  />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setShowModuleModal(false)} className="flex-grow btn-secondary py-3">Cancel</button>
                  <button type="submit" className="flex-grow btn-primary py-3">{editingModule ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lesson Modal */}
      <AnimatePresence>
        {showLessonModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-slate-900">{editingLesson ? 'Edit Lesson' : 'Add Lesson'}</h2>
              <form onSubmit={handleLessonSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Lesson Title</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                    value={lessonForm.title}
                    onChange={e => setLessonForm({...lessonForm, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Video</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="URL or Upload"
                        className="flex-grow px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                        value={lessonForm.video_url}
                        onChange={e => setLessonForm({...lessonForm, video_url: e.target.value})}
                      />
                      <label className="p-2 bg-slate-100 rounded-xl cursor-pointer hover:bg-slate-200 transition-colors">
                        <Upload size={20} className="text-slate-600" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="video/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await handleFileUpload(file);
                                setLessonForm({...lessonForm, video_url: url});
                              } catch (err) {
                                alert('Upload failed');
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Document</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="URL or Upload"
                        className="flex-grow px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                        value={lessonForm.document_url}
                        onChange={e => setLessonForm({...lessonForm, document_url: e.target.value})}
                      />
                      <label className="p-2 bg-slate-100 rounded-xl cursor-pointer hover:bg-slate-200 transition-colors">
                        <Upload size={20} className="text-slate-600" />
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await handleFileUpload(file);
                                setLessonForm({...lessonForm, document_url: url});
                              } catch (err) {
                                alert('Upload failed');
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Duration (e.g. 10:00)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                      value={lessonForm.duration}
                      onChange={e => setLessonForm({...lessonForm, duration: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Order Index</label>
                    <input 
                      type="number" 
                      required 
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                      value={lessonForm.order_index}
                      onChange={e => setLessonForm({...lessonForm, order_index: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="is_free"
                    checked={lessonForm.is_free_preview}
                    onChange={e => setLessonForm({...lessonForm, is_free_preview: e.target.checked})}
                  />
                  <label htmlFor="is_free" className="text-sm text-slate-600">Free Preview</label>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowLessonModal(false)} className="flex-grow btn-secondary py-3">Cancel</button>
                  <button type="submit" className="flex-grow btn-primary py-3">{editingLesson ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Create New User</h2>
                <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                    value={newUser.full_name}
                    onChange={e => setNewUser({...newUser, full_name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                    value={newUser.email}
                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Temporary Password</label>
                  <input 
                    type="password" 
                    required 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                    value={newUser.password}
                    onChange={e => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Role</label>
                    <select 
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                      value={newUser.role}
                      onChange={e => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="user">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                    <select 
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-gov-blue/20 outline-none"
                      value={newUser.subscription_status}
                      onChange={e => setNewUser({...newUser, subscription_status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-3 mt-4">Create User Account</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Register = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName })
    });
    const data = await res.json();
    if (res.ok) {
      onLogin(data.user);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/onboarding');
      }
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-10 rounded-3xl space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-slate-900">Join the Academy</h1>
          <p className="text-slate-500 mt-2">Start your journey to strategic excellence.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue transition-all"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="text-red-500 text-xs font-bold text-center">{error}</div>}

          <button type="submit" className="btn-primary w-full py-4 text-lg">Create Account</button>
        </form>

        <div className="text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-gov-blue font-bold hover:underline">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
};

const Login = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState('learner@example.com');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      onLogin(data.user);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else if (!data.user.onboarding_preferences) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-10 rounded-3xl space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-slate-900">Sign In</h1>
          <p className="text-slate-500 mt-2">Access your strategic growth dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
            <input 
              type="email" 
              required
              title="Email"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
            <input 
              type="password" 
              required
              title="Password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button type="submit" className="w-full btn-primary py-4">
            Sign In
          </button>
        </form>

        <div className="pt-4 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="text-gov-blue font-bold hover:underline">Register now</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Home = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.ok ? res.json() : [])
      .then(setCourses)
      .catch(() => setCourses([]));
  }, []);

  const featuredCourse = courses[0];
  const recentlyAdded = [...courses].sort((a, b) => b.id - a.id).slice(0, 4);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gov-blue/5 via-transparent to-transparent opacity-50"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-gov-blue/10 text-gov-blue text-xs font-bold uppercase tracking-wider"
            >
              Premium Business OS
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-tight"
            >
              Build Your <span className="text-gov-accent">Business<br />
              Operating</span> System.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg text-slate-600"
            >
              The elite platform for entrepreneurs to master AI, branding, and scaling through structured, high-impact learning.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <Link to="/courses" className="btn-primary w-full sm:w-auto">
                Explore Catalog
              </Link>
              <Link to="/courses" className="btn-secondary w-full sm:w-auto">
                Enroll in our Courses
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {featuredCourse && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-[2.5rem] overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-12 space-y-8">
              <div className="space-y-4">
                <div className="text-gov-blue font-bold text-xs uppercase tracking-widest">Featured Program</div>
                <h2 className="text-4xl font-display font-bold text-slate-900 leading-tight">{featuredCourse.title}</h2>
                <p className="text-slate-500 text-lg leading-relaxed">{featuredCourse.description}</p>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                  ))}
                  <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">+1.2k</div>
                </div>
                <div className="text-sm text-slate-400 font-medium">Joined by 1,200+ entrepreneurs</div>
              </div>
              <Link to={`/courses/${featuredCourse.id}`} className="btn-primary inline-block px-12">Start Learning</Link>
            </div>
            <div className="aspect-video lg:aspect-square relative">
              <img src={featuredCourse.image_url} alt="Featured" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent lg:hidden"></div>
            </div>
          </div>
        </section>
      )}

      {/* Recently Added */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900">Recently Added</h2>
            <p className="text-slate-500 mt-2">New modules added this week.</p>
          </div>
          <Link to="/courses" className="text-gov-blue font-semibold flex items-center hover:underline">
            View All <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {recentlyAdded.map((course) => (
            <Link 
              key={course.id} 
              to={`/courses/${course.id}`}
              className="group space-y-4"
            >
              <div className="aspect-video rounded-2xl overflow-hidden relative">
                <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircle className="text-white" size={48} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-gov-blue transition-colors line-clamp-1">{course.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <span>{course.difficulty}</span>
                  <span>Premium</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

const CourseEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: 1,
    difficulty: 'Beginner',
    status: 'Draft',
    image_url: '',
    price_type: 'Free',
    price: 0,
    syllabus_url: '',
    outcomes: ['']
  });

  useEffect(() => {
    const fetchData = async () => {
      const catRes = await fetch('/api/admin/categories');
      const cats = await catRes.json();
      setCategories(cats);

      if (isEdit) {
        const courseRes = await fetch(`/api/courses/${id}`);
        if (courseRes.ok) {
          const course = await courseRes.json();
          setForm({
            title: course.title,
            description: course.description,
            category_id: course.category_id,
            difficulty: course.difficulty,
            status: course.status,
            image_url: course.image_url,
            price_type: course.price > 0 ? 'Premium' : 'Free',
            price: course.price,
            syllabus_url: course.syllabus_url || '',
            outcomes: course.learning_outcomes ? JSON.parse(course.learning_outcomes) : ['']
          });
        }
      } else if (cats.length > 0) {
        setForm(prev => ({ ...prev, category_id: cats[0].id }));
      }
      setLoading(false);
    };
    fetchData();
  }, [id, isEdit]);

  const handleFileUpload = async (file: File, type: 'image' | 'pdf') => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const { url } = await res.json();
        if (type === 'image') setForm({ ...form, image_url: url });
        else setForm({ ...form, syllabus_url: url });
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const addOutcome = () => setForm({ ...form, outcomes: [...form.outcomes, ''] });
  const removeOutcome = (index: number) => {
    const next = form.outcomes.filter((_, i) => i !== index);
    setForm({ ...form, outcomes: next.length ? next : [''] });
  };
  const updateOutcome = (index: number, value: string) => {
    const next = [...form.outcomes];
    next[index] = value;
    setForm({ ...form, outcomes: next });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEdit ? `/api/admin/courses/${id}` : '/api/admin/courses';
    const method = isEdit ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        learning_outcomes: JSON.stringify(form.outcomes.filter(o => o.trim()))
      })
    });
    if (res.ok) {
      navigate('/admin');
    } else {
      alert(`Failed to ${isEdit ? 'update' : 'create'} course`);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50/30 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gov-accent/10 flex items-center justify-center text-gov-accent">
            {isEdit ? <Edit3 size={24} /> : <Plus size={24} />}
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            {isEdit ? `Edit Course: ${form.title}` : 'New Course Details'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course Thumbnail</label>
            <div 
              className={`relative aspect-[21/9] rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 overflow-hidden ${
                form.image_url ? 'border-transparent' : 'border-slate-200 bg-white hover:border-gov-blue/50 hover:bg-gov-blue/5'
              }`}
            >
              {form.image_url ? (
                <>
                  <img src={form.image_url} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button 
                    type="button"
                    onClick={() => setForm({ ...form, image_url: '' })}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-xl text-red-500 shadow-sm hover:scale-110 transition-transform"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-gov-accent border border-slate-100 shadow-sm">
                    <Camera size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">Drag and drop your image here</p>
                    <p className="text-xs text-slate-400 mt-1">or click to browse files</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image')}
                  />
                </>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex items-center gap-3 text-gov-blue font-bold">
                    <div className="w-5 h-5 border-2 border-gov-blue border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. AI-Driven Business Systems"
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white focus:ring-4 focus:ring-gov-blue/5 focus:border-gov-blue outline-none transition-all text-slate-700 font-medium"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white focus:ring-4 focus:ring-gov-blue/5 focus:border-gov-blue outline-none transition-all text-slate-700 font-medium appearance-none"
                  value={form.category_id}
                  onChange={e => setForm({ ...form, category_id: parseInt(e.target.value) })}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Difficulty</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white focus:ring-4 focus:ring-gov-blue/5 focus:border-gov-blue outline-none transition-all text-slate-700 font-medium appearance-none"
                  value={form.difficulty}
                  onChange={e => setForm({ ...form, difficulty: e.target.value })}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white focus:ring-4 focus:ring-gov-blue/5 focus:border-gov-blue outline-none transition-all text-slate-700 font-medium appearance-none"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Archived</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</label>
                <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                  {['Free', 'Premium'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, price_type: type })}
                      className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        form.price_type === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {form.price_type === 'Premium' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R</span>
                      <input 
                        type="number" 
                        placeholder="Price"
                        className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-white focus:ring-4 focus:ring-gov-blue/5 focus:border-gov-blue outline-none transition-all text-slate-700 font-medium"
                        value={form.price}
                        onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                <textarea 
                  placeholder="Describe what this course is about..."
                  rows={6}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white focus:ring-4 focus:ring-gov-blue/5 focus:border-gov-blue outline-none transition-all text-slate-700 font-medium resize-none"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course Syllabus / Resources</label>
                <div className="flex gap-4">
                  <div className="flex-grow relative">
                    <input 
                      type="text" 
                      placeholder="URL to course syllabus or resource"
                      className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white focus:ring-4 focus:ring-gov-blue/5 focus:border-gov-blue outline-none transition-all text-slate-700 font-medium"
                      value={form.syllabus_url}
                      onChange={e => setForm({ ...form, syllabus_url: e.target.value })}
                    />
                  </div>
                  <label className="flex items-center gap-2 px-6 py-4 bg-gov-accent/10 text-gov-accent rounded-2xl font-bold text-sm cursor-pointer hover:bg-gov-accent/20 transition-all whitespace-nowrap">
                    <Upload size={18} />
                    Upload PDF
                    <input 
                      type="file" 
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pdf')}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">What students will learn</label>
                  <button 
                    type="button"
                    onClick={addOutcome}
                    className="text-[10px] font-bold text-gov-accent uppercase tracking-widest flex items-center gap-1 hover:underline"
                  >
                    + Add Outcome
                  </button>
                </div>
                <div className="space-y-3">
                  {form.outcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-center gap-3 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-gov-accent flex-shrink-0" />
                      <input 
                        type="text" 
                        placeholder="e.g. Master AI automation tools"
                        className="flex-grow px-6 py-4 rounded-2xl border border-slate-100 bg-white focus:ring-4 focus:ring-gov-blue/5 focus:border-gov-blue outline-none transition-all text-slate-700 font-medium"
                        value={outcome}
                        onChange={e => updateOutcome(idx, e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={() => removeOutcome(idx)}
                        className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <button 
                type="submit"
                className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold shadow-xl shadow-slate-900/10 hover:scale-105 transition-all active:scale-95"
              >
                {isEdit ? 'Update Course' : 'Create Course'}
              </button>
              <button 
                type="button"
                onClick={() => navigate('/admin')}
                className="bg-slate-100 text-slate-600 px-12 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
            {isEdit && (
              <button 
                type="button"
                onClick={async () => {
                  if (confirm('Are you sure you want to delete this course?')) {
                    const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
                    if (res.ok) navigate('/admin');
                  }
                }}
                className="text-red-500 font-bold hover:underline px-4 py-2"
              >
                Delete Course
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CourseListing = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/courses').then(res => res.ok ? res.json() : []),
      fetch('/api/categories').then(res => res.ok ? res.json() : [])
    ]).then(([coursesData, categoriesData]) => {
      setCourses(coursesData);
      setCategories(categoriesData);
    }).catch(() => {
      setCourses([]);
      setCategories([]);
    });
  }, []);

  const filtered = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? c.category_id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900">Course Catalog</h1>
          <p className="text-slate-500 mt-2">Master the GovLead Strategic Growth Operating System.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gov-blue/20 outline-none bg-white text-sm font-medium"
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((course) => (
          <Link 
            key={course.id} 
            to={`/courses/${course.id}`}
            className="group glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-video overflow-hidden relative">
              <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-gov-blue transition-colors">{course.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2">{course.description}</p>
              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <span className={`text-xs font-bold uppercase tracking-wider ${course.price > 0 ? 'text-gov-blue' : 'text-emerald-600'}`}>
                  {course.price > 0 ? 'Premium Access' : 'Free Course'}
                </span>
                <ChevronRight size={16} className="text-gov-blue" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const CourseDetail = ({ user }: { user: User | null }) => {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setCourse(data);
        setLoading(false);
        if (data?.modules?.length > 0) {
          setExpandedModules([data.modules[0].id]);
        }
      })
      .catch(() => {
        setCourse(null);
        setLoading(false);
      });
  }, [id]);

  const toggleModule = (mId: number) => {
    setExpandedModules(prev => 
      prev.includes(mId) ? prev.filter(id => id !== mId) : [...prev, mId]
    );
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const res = await fetch(`/api/courses/${id}/enroll`, { method: 'POST' });
    if (res.ok) {
      navigate('/dashboard');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!course) return <div className="h-screen flex items-center justify-center">Course not found.</div>;

  const outcomes = course.learning_outcomes ? JSON.parse(course.learning_outcomes) : [];

  return (
    <div className="pb-20">
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gov-blue/20 text-gov-blue text-[10px] font-bold uppercase tracking-wider border border-gov-blue/30">
              {course.difficulty} Level
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">{course.title}</h1>
            <p className="text-slate-400 text-lg">{course.description}</p>
            <div className="pt-6 flex items-center gap-6">
              <button onClick={handleEnroll} className="btn-primary px-10">
                {course.price > 0 ? 'Enroll in Premium' : 'Enroll for Free'}
              </button>
              <div className="text-sm text-slate-400">
                <span className="block font-bold text-white">
                  {course.price > 0 ? `R ${course.price}` : 'Free Access'}
                </span>
                Start immediately
              </div>
            </div>
          </div>
          <div className="hidden lg:block rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video">
            <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            {outcomes.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-display font-bold text-slate-900">What you'll learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outcomes.map((outcome: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-sm text-slate-700 font-medium">{outcome}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-display font-bold text-slate-900">Course Curriculum</h2>
            <div className="text-sm text-slate-500 font-medium">{course.modules.length} Modules • {course.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0)} Lessons</div>
          </div>
          <div className="space-y-4">
            {course.modules.map((module: any, mIdx: number) => (
              <div key={module.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
                <button 
                  onClick={() => toggleModule(module.id)}
                  className="w-full bg-slate-50 px-6 py-5 flex justify-between items-center hover:bg-slate-100/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                      {mIdx + 1}
                    </div>
                    <h3 className="font-bold text-slate-900">{module.title}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{module.lessons.length} Lessons</span>
                    {expandedModules.includes(module.id) ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                  </div>
                </button>
                <AnimatePresence>
                  {expandedModules.includes(module.id) && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y divide-slate-100 border-t border-slate-200">
                        {module.lessons.map((lesson: any, lIdx: number) => (
                          <div key={lesson.id} className="px-8 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                            <div className="flex items-center space-x-4">
                              <PlayCircle size={18} className="text-slate-300 group-hover:text-gov-blue transition-colors" />
                              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-medium text-slate-400">{lesson.duration || '12:45'}</span>
                              {lesson.is_free_preview ? (
                                <span className="text-[10px] font-bold text-gov-blue uppercase tracking-wider bg-gov-blue/10 px-2 py-1 rounded">Free Preview</span>
                              ) : (
                                <Lock size={14} className="text-slate-300" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl sticky top-24 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Course Features</h3>
                <div className="space-y-4">
                  {[
                    { icon: Clock, label: 'Duration', value: '12 Hours Content' },
                    { icon: BookOpen, label: 'Lessons', value: `${course.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0)} Lessons` },
                    { icon: Award, label: 'Certificate', value: 'Included' },
                    { icon: Globe, label: 'Access', value: 'Lifetime' },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-3 text-slate-500">
                        <feature.icon size={18} />
                        <span className="text-sm font-medium">{feature.label}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{feature.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleEnroll} className="btn-primary w-full py-4 text-lg">Enroll in Course</button>
              <p className="text-center text-xs text-slate-400 font-medium">Secure checkout & instant access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : { user: null })
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CourseListing />} />
            <Route path="/courses/:id" element={<CourseDetail user={user} />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/register" element={<Register onLogin={setUser} />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Login onLogin={setUser} />} />
            <Route path="/player/:courseId/:lessonId" element={user ? <CoursePlayer user={user} /> : <Login onLogin={setUser} />} />
            <Route path="/profile" element={user ? <ProfileSettings user={user} /> : <Login onLogin={setUser} />} />
            <Route path="/onboarding" element={user ? <Onboarding user={user} onComplete={() => window.location.href = '/dashboard'} /> : <Login onLogin={setUser} />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Home />} />
            <Route path="/admin/courses/new" element={user?.role === 'admin' ? <CourseEditor /> : <Home />} />
            <Route path="/admin/courses/:id/edit" element={user?.role === 'admin' ? <CourseEditor /> : <Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
