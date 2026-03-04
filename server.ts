import express from 'express';
import { createServer as createViteServer } from 'vite';
import db, { seed } from './src/db/index';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = 'govlead-secret-key-2026';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        full_name: string;
      };
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  try {
    console.log('Seeding database...');
    seed();
    console.log('Database seeded.');
  } catch (err) {
    console.error('Database seeding failed:', err);
  }

  app.use(express.json());
  app.use(cookieParser());

  // File Upload Configuration
  const uploadDir = path.join(__dirname, 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Uploads directory created.');
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage });

  // Serve static files from public directory
  app.use('/uploads', express.static(uploadDir));

  // Auth Middleware
  const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  };

  // API Routes
  app.post('/api/auth/register', (req, res) => {
    const { email, password, full_name } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare('INSERT INTO users (email, password, full_name, role, subscription_status) VALUES (?, ?, ?, ?, ?)').run(email, hashedPassword, full_name, 'student', 'free');
      const user = { id: result.lastInsertRowid, email, full_name, role: 'student' };
      const token = jwt.sign(user, JWT_SECRET);
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
      res.json({ user });
    } catch (err) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, full_name: user.full_name }, JWT_SECRET);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name } });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ user: null });
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string; full_name: string };
      const user = db.prepare('SELECT id, email, role, full_name, onboarding_preferences, subscription_status, bio, business_name, business_stage, experience_level, interests, avatar_url FROM users WHERE id = ?').get(decoded.id);
      res.json({ user });
    } catch (err) {
      res.json({ user: null });
    }
  });

  app.post('/api/user/onboarding', authenticate, (req, res) => {
    const { preferences } = req.body;
    db.prepare('UPDATE users SET onboarding_preferences = ? WHERE id = ?').run(JSON.stringify(preferences), req.user.id);
    res.json({ success: true });
  });

  app.put('/api/user/profile', authenticate, (req, res) => {
    const { full_name, bio, business_name, business_stage, experience_level, interests, avatar_url } = req.body;
    db.prepare(`
      UPDATE users 
      SET full_name = ?, bio = ?, business_name = ?, business_stage = ?, experience_level = ?, interests = ?, avatar_url = ? 
      WHERE id = ?
    `).run(full_name, bio, business_name, business_stage, experience_level, interests, avatar_url, req.user.id);
    res.json({ success: true });
  });

  app.get('/api/categories', (req, res) => {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  });

  app.get('/api/courses', (req, res) => {
    const courses = db.prepare("SELECT * FROM courses WHERE status = 'published'").all();
    res.json(courses);
  });

  app.get('/api/courses/recently-added', (req, res) => {
    const courses = db.prepare("SELECT * FROM courses WHERE status = 'published' ORDER BY created_at DESC LIMIT 5").all();
    res.json(courses);
  });

  app.get('/api/courses/:id', (req, res) => {
    const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    
    const modules = db.prepare('SELECT * FROM modules WHERE course_id = ? ORDER BY order_index').all(req.params.id);
    const modulesWithLessons = modules.map(m => ({
      ...m,
      lessons: db.prepare('SELECT id, title, is_free_preview, order_index, duration FROM lessons WHERE module_id = ? ORDER BY order_index').all(m.id)
    }));

    res.json({ ...course, modules: modulesWithLessons });
  });

  app.get('/api/lessons/:id', authenticate, (req, res) => {
    const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const enrollment = db.prepare('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?').get(req.user.id, lesson.course_id);
    if (!enrollment && !lesson.is_free_preview) {
      return res.status(403).json({ error: 'Not enrolled' });
    }

    const progress = db.prepare('SELECT * FROM user_progress WHERE user_id = ? AND lesson_id = ?').get(req.user.id, req.params.id);
    res.json({ ...lesson, progress });
  });

  app.post('/api/lessons/:id/progress', authenticate, (req, res) => {
    const { completed, progress_percentage, last_watched_timestamp } = req.body;
    const lesson = db.prepare('SELECT course_id FROM lessons WHERE id = ?').get(req.params.id);
    
    const existing = db.prepare('SELECT id FROM user_progress WHERE user_id = ? AND lesson_id = ?').get(req.user.id, req.params.id);
    if (existing) {
      db.prepare(`
        UPDATE user_progress 
        SET completed = ?, progress_percentage = ?, last_watched_timestamp = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(completed ? 1 : 0, progress_percentage, last_watched_timestamp, existing.id);
    } else {
      db.prepare(`
        INSERT INTO user_progress (user_id, lesson_id, course_id, completed, progress_percentage, last_watched_timestamp) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(req.user.id, req.params.id, lesson.course_id, completed ? 1 : 0, progress_percentage, last_watched_timestamp);
    }
    res.json({ success: true });
  });

  app.get('/api/lessons/:id/notes', authenticate, (req, res) => {
    const notes = db.prepare('SELECT * FROM notes WHERE user_id = ? AND lesson_id = ? ORDER BY created_at DESC').all(req.user.id, req.params.id);
    res.json(notes);
  });

  app.post('/api/lessons/:id/notes', authenticate, (req, res) => {
    const { content, timestamp } = req.body;
    db.prepare('INSERT INTO notes (user_id, lesson_id, content, timestamp) VALUES (?, ?, ?, ?)').run(req.user.id, req.params.id, content, timestamp);
    res.json({ success: true });
  });

  app.get('/api/lessons/:id/discussions', (req, res) => {
    const discussions = db.prepare(`
      SELECT d.*, u.full_name 
      FROM discussions d 
      JOIN users u ON d.user_id = u.id 
      WHERE d.lesson_id = ? 
      ORDER BY d.created_at DESC
    `).all(req.params.id);
    res.json(discussions);
  });

  app.post('/api/lessons/:id/discussions', authenticate, (req, res) => {
    const { content } = req.body;
    db.prepare('INSERT INTO discussions (user_id, lesson_id, content) VALUES (?, ?, ?)').run(req.user.id, req.params.id, content);
    res.json({ success: true });
  });

  app.post('/api/courses/:id/bookmark', authenticate, (req, res) => {
    const existing = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND course_id = ?').get(req.user.id, req.params.id);
    if (existing) {
      db.prepare('DELETE FROM bookmarks WHERE id = ?').run(existing.id);
      res.json({ bookmarked: false });
    } else {
      db.prepare('INSERT INTO bookmarks (user_id, course_id) VALUES (?, ?)').run(req.user.id, req.params.id);
      res.json({ bookmarked: true });
    }
  });

  app.get('/api/user/dashboard/enhanced', authenticate, (req, res) => {
    const enrollments = db.prepare(`
      SELECT c.*, e.enrolled_at 
      FROM enrollments e 
      JOIN courses c ON e.course_id = c.id 
      WHERE e.user_id = ?
    `).all(req.user.id);

    const continueWatching = db.prepare(`
      SELECT l.id as lesson_id, l.title as lesson_title, c.id as course_id, c.title as course_title, c.image_url, up.progress_percentage
      FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      JOIN courses c ON up.course_id = c.id
      WHERE up.user_id = ? AND up.completed = 0
      ORDER BY up.updated_at DESC
      LIMIT 5
    `).all(req.user.id);

    const bookmarks = db.prepare(`
      SELECT c.* 
      FROM bookmarks b 
      JOIN courses c ON b.course_id = c.id 
      WHERE b.user_id = ?
    `).all(req.user.id);

    const recommended = db.prepare("SELECT * FROM courses WHERE status = 'published' LIMIT 3").all(); // Simple recommendation
    const recentlyAdded = db.prepare("SELECT * FROM courses WHERE status = 'published' ORDER BY created_at DESC LIMIT 5").all();

    res.json({ enrollments, continueWatching, bookmarks, recommended, recentlyAdded });
  });

  // Admin Management
  app.get('/api/admin/users', authenticate, isAdmin, (req, res) => {
    const users = db.prepare('SELECT id, email, full_name, role, subscription_status, created_at FROM users').all();
    res.json(users);
  });

  app.post('/api/admin/users', authenticate, isAdmin, (req, res) => {
    const { full_name, email, password, role, subscription_status } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      db.prepare('INSERT INTO users (full_name, email, password, role, subscription_status) VALUES (?, ?, ?, ?, ?)').run(full_name, email, hashedPassword, role, subscription_status);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: 'Email already exists or invalid data' });
    }
  });

  app.patch('/api/admin/users/:id', authenticate, isAdmin, (req, res) => {
    const { role, subscription_status } = req.body;
    db.prepare('UPDATE users SET role = ?, subscription_status = ? WHERE id = ?').run(role, subscription_status, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/admin/users/:id', authenticate, isAdmin, (req, res) => {
    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.post('/api/admin/courses', authenticate, isAdmin, (req, res) => {
    const { title, description, category_id, difficulty, status, image_url, price, syllabus_url, learning_outcomes } = req.body;
    const result = db.prepare('INSERT INTO courses (title, description, category_id, difficulty, status, image_url, price, syllabus_url, learning_outcomes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(title, description, category_id, difficulty, status, image_url, price, syllabus_url, learning_outcomes);
    res.json({ id: result.lastInsertRowid });
  });

  app.put('/api/admin/courses/:id', authenticate, isAdmin, (req, res) => {
    const { title, description, category_id, difficulty, status, image_url, price, syllabus_url, learning_outcomes } = req.body;
    db.prepare('UPDATE courses SET title = ?, description = ?, category_id = ?, difficulty = ?, status = ?, image_url = ?, price = ?, syllabus_url = ?, learning_outcomes = ? WHERE id = ?').run(title, description, category_id, difficulty, status, image_url, price, syllabus_url, learning_outcomes, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/admin/courses/:id', authenticate, isAdmin, (req, res) => {
    db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.post('/api/admin/modules', authenticate, isAdmin, (req, res) => {
    const { course_id, title, order_index } = req.body;
    const result = db.prepare('INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?)').run(course_id, title, order_index);
    res.json({ id: result.lastInsertRowid });
  });

  app.put('/api/admin/modules/:id', authenticate, isAdmin, (req, res) => {
    const { title, order_index } = req.body;
    db.prepare('UPDATE modules SET title = ?, order_index = ? WHERE id = ?').run(title, order_index, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/admin/modules/:id', authenticate, isAdmin, (req, res) => {
    db.prepare('DELETE FROM modules WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.post('/api/admin/lessons', authenticate, isAdmin, (req, res) => {
    const { course_id, module_id, title, video_url, document_url, duration, is_free_preview, order_index } = req.body;
    const result = db.prepare('INSERT INTO lessons (course_id, module_id, title, video_url, document_url, duration, is_free_preview, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(course_id, module_id, title, video_url, document_url, duration, is_free_preview ? 1 : 0, order_index);
    res.json({ id: result.lastInsertRowid });
  });

  app.put('/api/admin/lessons/:id', authenticate, isAdmin, (req, res) => {
    const { title, video_url, document_url, duration, is_free_preview, order_index } = req.body;
    db.prepare('UPDATE lessons SET title = ?, video_url = ?, document_url = ?, duration = ?, is_free_preview = ?, order_index = ? WHERE id = ?').run(title, video_url, document_url, duration, is_free_preview ? 1 : 0, order_index, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/admin/lessons/:id', authenticate, isAdmin, (req, res) => {
    db.prepare('DELETE FROM lessons WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.get('/api/admin/categories', authenticate, isAdmin, (req, res) => {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  });

  app.post('/api/admin/categories', authenticate, isAdmin, (req, res) => {
    const { name } = req.body;
    db.prepare('INSERT INTO categories (name) VALUES (?)').run(name);
    res.json({ success: true });
  });

  app.post('/api/admin/upload', authenticate, isAdmin, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  app.post('/api/courses/:id/enroll', authenticate, (req, res) => {
    try {
      db.prepare('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)').run(req.user.id, req.params.id);
      db.prepare('INSERT INTO analytics_events (event_type, user_id, course_id) VALUES (?, ?, ?)').run('enrollment', req.user.id, req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: 'Already enrolled or error' });
    }
  });

  app.get('/api/user/dashboard', authenticate, (req, res) => {
    const enrollments = db.prepare(`
      SELECT c.*, e.enrolled_at 
      FROM enrollments e 
      JOIN courses c ON e.course_id = c.id 
      WHERE e.user_id = ?
    `).all(req.user.id);
    res.json({ enrollments });
  });

  // Admin Analytics
  app.get('/api/admin/analytics', authenticate, isAdmin, (req, res) => {
    const totalUsers = db.prepare('SELECT count(*) as count FROM users').get().count;
    const totalEnrollments = db.prepare('SELECT count(*) as count FROM enrollments').get().count;
    const activeUsers = db.prepare("SELECT count(DISTINCT user_id) as count FROM analytics_events WHERE created_at > date('now', '-30 days')").get().count;
    
    const enrollmentTrends = db.prepare(`
      SELECT date(enrolled_at) as date, count(*) as count 
      FROM enrollments 
      GROUP BY date(enrolled_at) 
      ORDER BY date(enrolled_at) DESC 
      LIMIT 30
    `).all();

    const coursePerformance = db.prepare(`
      SELECT c.title, count(e.id) as enrollments
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      GROUP BY c.id
      ORDER BY enrollments DESC
    `).all();

    res.json({
      summary: {
        totalUsers,
        totalEnrollments,
        activeUsers,
        websiteVisits: 1240 // Placeholder
      },
      enrollmentTrends,
      coursePerformance
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    // Fallback for SPA routes in dev mode if vite middleware misses it
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) return next();
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      // Fallback if dist doesn't exist but we're in production mode
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
      });
    }
  }

  console.log('Starting server...');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
