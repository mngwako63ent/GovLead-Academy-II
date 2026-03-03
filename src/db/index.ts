import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const db = new Database('govlead.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'student', -- 'admin', 'student'
    subscription_status TEXT DEFAULT 'free', -- 'free', 'premium'
    onboarding_preferences TEXT, -- JSON string
    bio TEXT,
    business_name TEXT,
    business_stage TEXT,
    experience_level TEXT,
    interests TEXT,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    learning_outcomes TEXT, -- JSON string array
    category_id INTEGER,
    difficulty TEXT DEFAULT 'intermediate',
    status TEXT DEFAULT 'published', -- 'draft', 'published'
    price REAL DEFAULT 0.0,
    syllabus_url TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    title TEXT NOT NULL,
    order_index INTEGER,
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    module_id INTEGER,
    title TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    document_url TEXT,
    duration TEXT,
    is_free_preview BOOLEAN DEFAULT 0,
    order_index INTEGER,
    FOREIGN KEY (module_id) REFERENCES modules(id)
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    course_id INTEGER,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    lesson_id INTEGER,
    course_id INTEGER,
    completed BOOLEAN DEFAULT 0,
    progress_percentage REAL DEFAULT 0,
    last_watched_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    course_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(user_id, course_id)
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    lesson_id INTEGER,
    content TEXT,
    timestamp TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
  );

  CREATE TABLE IF NOT EXISTS discussions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    lesson_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    course_id INTEGER,
    issued_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL, -- 'visit', 'enrollment', 'completion', 'watch_time'
    user_id INTEGER,
    course_id INTEGER,
    lesson_id INTEGER,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration logic for existing tables
try {
  const userTableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
  if (!userTableInfo.find(col => col.name === 'onboarding_preferences')) {
    db.exec("ALTER TABLE users ADD COLUMN onboarding_preferences TEXT");
  }
  if (!userTableInfo.find(col => col.name === 'subscription_status')) {
    db.exec("ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'inactive'");
  }
  if (!userTableInfo.find(col => col.name === 'bio')) {
    db.exec("ALTER TABLE users ADD COLUMN bio TEXT");
  }
  if (!userTableInfo.find(col => col.name === 'business_name')) {
    db.exec("ALTER TABLE users ADD COLUMN business_name TEXT");
  }
  if (!userTableInfo.find(col => col.name === 'business_stage')) {
    db.exec("ALTER TABLE users ADD COLUMN business_stage TEXT");
  }
  if (!userTableInfo.find(col => col.name === 'experience_level')) {
    db.exec("ALTER TABLE users ADD COLUMN experience_level TEXT");
  }
  if (!userTableInfo.find(col => col.name === 'interests')) {
    db.exec("ALTER TABLE users ADD COLUMN interests TEXT");
  }
  if (!userTableInfo.find(col => col.name === 'avatar_url')) {
    db.exec("ALTER TABLE users ADD COLUMN avatar_url TEXT");
  }

  const lessonTableInfo = db.prepare("PRAGMA table_info(lessons)").all() as any[];
  if (!lessonTableInfo.find(col => col.name === 'course_id')) {
    db.exec("ALTER TABLE lessons ADD COLUMN course_id INTEGER");
  }
  if (!lessonTableInfo.find(col => col.name === 'duration')) {
    db.exec("ALTER TABLE lessons ADD COLUMN duration TEXT");
  }
  if (!lessonTableInfo.find(col => col.name === 'document_url')) {
    db.exec("ALTER TABLE lessons ADD COLUMN document_url TEXT");
  }

  const courseTableInfo = db.prepare("PRAGMA table_info(courses)").all() as any[];
  if (!courseTableInfo.find(col => col.name === 'learning_outcomes')) {
    db.exec("ALTER TABLE courses ADD COLUMN learning_outcomes TEXT");
  }
  if (!courseTableInfo.find(col => col.name === 'price')) {
    db.exec("ALTER TABLE courses ADD COLUMN price REAL DEFAULT 0.0");
  }
  if (!courseTableInfo.find(col => col.name === 'syllabus_url')) {
    db.exec("ALTER TABLE courses ADD COLUMN syllabus_url TEXT");
  }

  const progressTableInfo = db.prepare("PRAGMA table_info(user_progress)").all() as any[];
  if (!progressTableInfo.find(col => col.name === 'course_id')) {
    db.exec("ALTER TABLE user_progress ADD COLUMN course_id INTEGER");
  }
  if (!progressTableInfo.find(col => col.name === 'progress_percentage')) {
    db.exec("ALTER TABLE user_progress ADD COLUMN progress_percentage REAL DEFAULT 0");
  }
  if (!progressTableInfo.find(col => col.name === 'last_watched_timestamp')) {
    db.exec("ALTER TABLE user_progress ADD COLUMN last_watched_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP");
  }
} catch (err) {
  console.error("Migration error:", err);
}

// Seed function
export function seed() {
  // 1. Users
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@govlead.co.za');
  if (!adminExists) {
    const insertUser = db.prepare('INSERT INTO users (email, password, full_name, role, subscription_status) VALUES (?, ?, ?, ?, ?)');
    insertUser.run('admin@govlead.co.za', bcrypt.hashSync('admin123', 10), 'GovLead Admin', 'admin', 'premium');
    insertUser.run('learner@example.com', bcrypt.hashSync('user123', 10), 'John Doe', 'student', 'free');
  } else {
    const updatePass = db.prepare('UPDATE users SET password = ? WHERE email = ?');
    updatePass.run(bcrypt.hashSync('admin123', 10), 'admin@govlead.co.za');
    updatePass.run(bcrypt.hashSync('user123', 10), 'learner@example.com');
  }

  // 2. Categories
  const strategyLeadership = db.prepare('SELECT id FROM categories WHERE name = ?').get('Strategy / Leadership');
  let strategyId: number;
  if (!strategyLeadership) {
    const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run('Strategy / Leadership');
    strategyId = result.lastInsertRowid as number;
  } else {
    strategyId = (strategyLeadership as any).id;
  }

  // 3. Courses
  // Clear existing courses, modules, and lessons to ensure a clean slate as requested
  // Delete dependent tables first to avoid foreign key constraints
  db.prepare('DELETE FROM analytics_events').run();
  db.prepare('DELETE FROM certificates').run();
  db.prepare('DELETE FROM discussions').run();
  db.prepare('DELETE FROM notes').run();
  db.prepare('DELETE FROM bookmarks').run();
  db.prepare('DELETE FROM user_progress').run();
  db.prepare('DELETE FROM enrollments').run();
  db.prepare('DELETE FROM lessons').run();
  db.prepare('DELETE FROM modules').run();
  db.prepare('DELETE FROM courses').run();

  const coreCourses = [
    {
      title: "Building Your Strategic Foundation",
      desc: "Build clarity around your internal drivers, long-term direction, and financial thresholds. This course establishes the strategic spine of your business.",
      outcomes: ["Define clear long-term strategic direction", "Distinguish financial goals from strategic intent", "Align leadership around shared purpose", "Establish internal business drivers"],
      modules: ["Vision vs Mission vs Objectives", "Strategic Intent & Long-Term Direction", "Financial Hurdles vs Business Objectives", "Shareholders vs Stakeholders", "Leadership Alignment Around Purpose"]
    },
    {
      title: "Understanding Your Market & Industry Structure",
      desc: "Move beyond product thinking and learn to define your market strategically.",
      outcomes: ["Define your true market", "Identify structural growth opportunities", "Understand competitive positioning"],
      modules: ["What Business Are You Really In?", "Market Definition vs Industry Definition", "Structural Opportunities", "Competitive Boundaries", "Growth Direction Strategy"]
    },
    {
      title: "Deep Customer Strategy Masterclass",
      desc: "Design your business around customer value, not product features.",
      outcomes: ["Identify true customer value drivers", "Map motivations and barriers", "Build strategy around customer needs"],
      modules: ["Identifying the Real Customer", "Customer Benefits Mapping", "Buying Motivations", "Barriers to Purchase", "Customer Interface Mapping"]
    },
    {
      title: "Segmentation & Targeting for Profitable Growth",
      desc: "Stop serving everyone. Build dominance in clearly defined segments.",
      outcomes: ["Segment markets strategically", "Identify profitable niches", "Prioritise for sustainable growth"],
      modules: ["Segmentation Frameworks", "Identifying Profitable Segments", "Prioritisation Models", "Segment Durability", "Customised Offer Strategy"]
    },
    {
      title: "Positioning & Brand Power Strategy",
      desc: "Build defensible market positioning and avoid the commodity trap.",
      outcomes: ["Develop a clear market position", "Build brand defensibility", "Create competitive differentiation"],
      modules: ["Differentiation vs Commodity", "Positioning Framework", "Brand Values & Personality", "Competitive Mapping", "Strategic Brand Investment"]
    },
    {
      title: "Customer Retention & Lifetime Value Strategy",
      desc: "Shift from transactional selling to long-term customer asset building.",
      outcomes: ["Understand retention profitability", "Design recurring revenue systems", "Build long-term customer relationships"],
      modules: ["Retention Economics", "Why Retention Beats Acquisition", "Market Information Systems", "Relationship Strategy", "Designing Customer Assets"]
    },
    {
      title: "Designing Powerful Market Offerings",
      desc: "Create offers customers want to “hire” repeatedly.",
      outcomes: ["Design compelling offers", "Evaluate product-market fit", "Reduce launch risk"],
      modules: ["Value Proposition Design", "Product-Market Fit", "Customer Value Mapping", "Risk Assessment for New Offers", "Lifecycle Management"]
    },
    {
      title: "Organising for Market Success",
      desc: "Align culture, structure, and operations around strategy.",
      outcomes: ["Align organisation with market needs", "Build strategic culture", "Implement change effectively"],
      modules: ["Internal vs External Focus", "Customer-Driven Culture", "Strategic Metrics", "Process Alignment", "Change Management Basics"]
    },
    {
      title: "SCORPIO Strategic Coordination Blueprint",
      desc: "Create a coordinated defensive and offensive growth strategy.",
      outcomes: ["Build integrated strategy", "Protect market share", "Coordinate growth initiatives"],
      modules: ["Minimum Viable Strategy", "Defensive Strategy", "Offensive Strategy", "SCORPIO Element Alignment", "Strategic Coordination Framework"]
    },
    {
      title: "From Strategy to Implementation",
      desc: "Turn strategic thinking into measurable execution.",
      outcomes: ["Translate strategy into action", "Design full marketing mix", "Build control systems for execution"],
      modules: ["Strategy vs Tactics", "Product Strategy", "Pricing Drivers", "Distribution Routes", "Promotion Messaging", "Implementation Barriers", "Control Systems"]
    }
  ];

  const insertCourse = db.prepare('INSERT INTO courses (title, description, learning_outcomes, category_id, difficulty, status, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const insertModule = db.prepare('INSERT INTO modules (course_id, title, order_index) VALUES (?, ?, ?)');
  const insertLesson = db.prepare('INSERT INTO lessons (course_id, module_id, title, is_free_preview, order_index, video_url, duration) VALUES (?, ?, ?, ?, ?, ?, ?)');

  coreCourses.forEach((c, i) => {
    const courseResult = insertCourse.run(
      c.title, 
      c.desc, 
      JSON.stringify(c.outcomes), 
      strategyId, 
      'intermediate', 
      'published', 
      `https://picsum.photos/seed/govlead${i}/800/450`
    );
    const courseId = courseResult.lastInsertRowid;

    c.modules.forEach((mTitle, mIdx) => {
      const moduleResult = insertModule.run(courseId, mTitle, mIdx + 1);
      const moduleId = moduleResult.lastInsertRowid;

      // Add 3 lessons per module
      for (let l = 1; l <= 3; l++) {
        insertLesson.run(
          courseId, 
          moduleId, 
          `Lesson ${l}: ${mTitle} Deep Dive`, 
          l === 1 ? 1 : 0, 
          l,
          'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          '12:45'
        );
      }
    });
  });

  console.log('Database seeded successfully.');
}

export default db;
