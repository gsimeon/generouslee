import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_CATEGORIES,
  INITIAL_TAGS,
  INITIAL_USERS,
  INITIAL_CONTENT,
  INITIAL_QUESTIONS,
  INITIAL_COMMUNITY_GROUPS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_MENTORS,
  INITIAL_COURSES,
  INITIAL_EVENTS,
  INITIAL_RESOURCES,
  INITIAL_AUDIT_LOGS,
  INITIAL_ANALYTICS
} from './server/db';
import {
  User,
  ContentItem,
  Question,
  CommunityGroup,
  CommunityPost,
  AuditLog,
  ApiResponse,
  UserRole,
  JournalEntry,
  NewsletterSubscription,
  UserGrowthProfile,
  MilestoneBadge,
  MentorRecommendationResult,
  DailyReflectionResult
} from './src/types';

// In-memory runtime state with initial seed data
let users: User[] = [...INITIAL_USERS];
let contents: ContentItem[] = [...INITIAL_CONTENT];
let questions: Question[] = [...INITIAL_QUESTIONS];
let categories = [...INITIAL_CATEGORIES];
let tags = [...INITIAL_TAGS];
let groups: CommunityGroup[] = [...INITIAL_COMMUNITY_GROUPS];
let posts: CommunityPost[] = [...INITIAL_COMMUNITY_POSTS];
let mentors = [...INITIAL_MENTORS];
let courses = [...INITIAL_COURSES];
let events = [...INITIAL_EVENTS];
let resources = [...INITIAL_RESOURCES];
let auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
let savedContentByUser: Record<string, string[]> = {
  'usr-member-1': ['cnt-1', 'cnt-2', 'cnt-5']
};
let newsletterSubscribers: NewsletterSubscription[] = [
  {
    id: 'sub-1',
    email: 'member.grace@example.com',
    firstName: 'Grace',
    interests: ['faith-purpose', 'healthy-living'],
    subscribedAt: '2026-09-10T10:00:00Z',
    status: 'active'
  }
];

let userJournalEntries: Record<string, JournalEntry[]> = {
  'usr-member-1': [
    {
      id: 'jrn-1',
      userId: 'usr-member-1',
      date: '2026-09-13',
      prompt: 'Where did you sense God calling you to pause and receive His grace today?',
      scriptureReference: 'Psalm 46:10 — "Be still, and know that I am God."',
      reflectionText: 'I caught myself spiraling over my toddlers crying at the same time I had a deadline. Instead of snapping, I stepped into the hallway, put both hands over my heart, and took five slow breaths. Reminding myself that God gave me this day as a gift, not a performance test.',
      gratitudeNote: 'Grateful for cold water, a husband who cooked dinner, and the quiet hour after 8 PM.',
      moodTag: 'peaceful',
      createdAt: '2026-09-13T20:45:00Z',
      updatedAt: '2026-09-13T20:45:00Z'
    }
  ]
};

// Course progress tracking by user
let userCourseProgress: Record<string, Record<string, number>> = {
  'usr-member-1': {
    'crs-1': 65,
    'crs-2': 20
  }
};

let userEnrolledCourses: Record<string, string[]> = {
  'usr-member-1': ['crs-1', 'crs-2']
};

// User Growth Milestones & Badges State
let userGrowthData: Record<string, { readingStreakDays: number; completedAcademyModules: number; consecutiveJournalDays: number; totalArticlesRead: number }> = {
  'usr-member-1': {
    readingStreakDays: 6,
    completedAcademyModules: 5,
    consecutiveJournalDays: 4,
    totalArticlesRead: 14
  }
};

const BASE_BADGES: Omit<MilestoneBadge, 'currentValue' | 'isUnlocked' | 'unlockedAt'>[] = [
  {
    id: 'badge-streak-1',
    title: 'Morning Spark',
    category: 'reading_streak',
    description: 'Read faith wisdom or articles for 3 consecutive days.',
    iconName: 'Flame',
    level: 'bronze',
    targetValue: 3,
    rewardPoints: 50
  },
  {
    id: 'badge-streak-2',
    title: 'Steadfast Discipline',
    category: 'reading_streak',
    description: 'Maintain an inspiring 7-day scripture & article reading habit.',
    iconName: 'Sparkles',
    level: 'silver',
    targetValue: 7,
    rewardPoints: 120
  },
  {
    id: 'badge-streak-3',
    title: 'Sanctuary Pillar',
    category: 'reading_streak',
    description: 'Walk in uninterrupted 14-day spiritual wisdom habit.',
    iconName: 'Award',
    level: 'gold',
    targetValue: 14,
    rewardPoints: 300
  },
  {
    id: 'badge-module-1',
    title: 'First Revelation',
    category: 'academy_modules',
    description: 'Complete your initial Academy masterclass module.',
    iconName: 'GraduationCap',
    level: 'bronze',
    targetValue: 1,
    rewardPoints: 60
  },
  {
    id: 'badge-module-2',
    title: 'Walking in Purpose',
    category: 'academy_modules',
    description: 'Complete 4 comprehensive Academy modules and lessons.',
    iconName: 'Compass',
    level: 'silver',
    targetValue: 4,
    rewardPoints: 150
  },
  {
    id: 'badge-module-3',
    title: 'Kingdom Scholar',
    category: 'academy_modules',
    description: 'Master 8 full Academy modules across faith & temple care.',
    iconName: 'CheckCircle2',
    level: 'gold',
    targetValue: 8,
    rewardPoints: 400
  },
  {
    id: 'badge-journal-1',
    title: 'Heart Unburdened',
    category: 'daily_journaling',
    description: 'Record your first sacred journal reflection before God.',
    iconName: 'PenLine',
    level: 'bronze',
    targetValue: 1,
    rewardPoints: 40
  },
  {
    id: 'badge-journal-2',
    title: 'Faithful Witness',
    category: 'daily_journaling',
    description: 'Journal daily for 3 consecutive days in your sanctuary.',
    iconName: 'Heart',
    level: 'silver',
    targetValue: 3,
    rewardPoints: 100
  },
  {
    id: 'badge-journal-3',
    title: 'Tabernacle of Grace',
    category: 'daily_journaling',
    description: 'Cultivate 7 consecutive days of heartfelt faith reflections.',
    iconName: 'Sun',
    level: 'gold',
    targetValue: 7,
    rewardPoints: 250
  }
];

function calculateUserGrowthProfile(userId: string): UserGrowthProfile {
  const stats = userGrowthData[userId] || {
    readingStreakDays: 1,
    completedAcademyModules: 0,
    consecutiveJournalDays: 0,
    totalArticlesRead: 1
  };

  const userEntries = userJournalEntries[userId] || [];
  const totalReflections = userEntries.length;
  // Compute consecutive journal days from entries if available
  const consecutiveDays = Math.max(stats.consecutiveJournalDays, totalReflections > 0 ? Math.min(totalReflections, 5) : 0);

  let totalPoints = 0;
  const badges: MilestoneBadge[] = BASE_BADGES.map(b => {
    let current = 0;
    if (b.category === 'reading_streak') current = stats.readingStreakDays;
    else if (b.category === 'academy_modules') current = stats.completedAcademyModules;
    else if (b.category === 'daily_journaling') {
      current = b.id === 'badge-journal-1' ? totalReflections : consecutiveDays;
    }

    const isUnlocked = current >= b.targetValue;
    if (isUnlocked) {
      totalPoints += b.rewardPoints;
    }

    return {
      ...b,
      currentValue: Math.min(current, b.targetValue),
      isUnlocked,
      unlockedAt: isUnlocked ? '2026-09-13T10:00:00Z' : undefined
    };
  });

  return {
    readingStreakDays: stats.readingStreakDays,
    completedAcademyModules: stats.completedAcademyModules,
    consecutiveJournalDays: consecutiveDays,
    totalJournalReflections: totalReflections,
    totalArticlesRead: stats.totalArticlesRead,
    totalMilestonePoints: totalPoints,
    badges
  };
}

let currentUser: User = users[2]; // Default to signed-in member for demo, easy to switch to Admin/Creator

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Security & Logging middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Health check endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Generouslee Core API', timestamp: new Date().toISOString() });
  });

  app.get('/api/ready', (req, res) => {
    res.json({ status: 'ready', database: 'connected', cache: 'ready' });
  });

  // --------------------------------------------------------------------------
  // AUTHENTICATION & USERS API (/api/v1/auth & /api/v1/users)
  // --------------------------------------------------------------------------
  app.get('/api/v1/users/me', (req, res) => {
    const saved = savedContentByUser[currentUser.id] || [];
    res.json({
      success: true,
      data: {
        ...currentUser,
        savedContentIds: saved
      },
      message: 'User profile retrieved'
    });
  });

  app.post('/api/v1/auth/register', (req: Request, res: Response) => {
    const { email, name, password, interests = [] } = req.body;
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Name and email are required.' }
      });
    }

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'An account with this email already exists.' }
      });
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      name,
      role: 'user',
      interests,
      avatarUrl: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(name)}`,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    currentUser = newUser;
    savedContentByUser[newUser.id] = [];

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: newUser.email,
      action: 'USER_REGISTERED',
      targetType: 'User',
      targetId: newUser.id,
      details: `New user registration: ${newUser.name}`
    });

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'Account created successfully. Welcome to Generouslee.'
    });
  });

  app.post('/api/v1/auth/login', (req: Request, res: Response) => {
    const { email } = req.body;
    const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || users[0];
    currentUser = user;
    res.json({
      success: true,
      data: {
        ...currentUser,
        savedContentIds: savedContentByUser[currentUser.id] || []
      },
      message: `Welcome back, ${currentUser.name}`
    });
  });

  app.post('/api/v1/auth/switch-role', (req: Request, res: Response) => {
    const { role } = req.body as { role: UserRole };
    let matchingUser = users.find(u => u.role === role);
    if (!matchingUser) {
      // Create or update role
      currentUser.role = role;
      matchingUser = currentUser;
    } else {
      currentUser = matchingUser;
    }
    res.json({
      success: true,
      data: {
        ...currentUser,
        savedContentIds: savedContentByUser[currentUser.id] || []
      },
      message: `Switched active role to ${role}`
    });
  });

  app.put('/api/v1/users/me/interests', (req: Request, res: Response) => {
    const { interests } = req.body;
    if (Array.isArray(interests)) {
      currentUser.interests = interests;
      const uIndex = users.findIndex(u => u.id === currentUser.id);
      if (uIndex >= 0) users[uIndex].interests = interests;
    }
    res.json({
      success: true,
      data: currentUser,
      message: 'Interests updated successfully'
    });
  });

  // --------------------------------------------------------------------------
  // CONTENT CMS & DISCOVERY API (/api/v1/content)
  // --------------------------------------------------------------------------
  app.get('/api/v1/content', (req: Request, res: Response) => {
    const { category, tag, search, status = 'published', featured } = req.query;
    let filtered = contents.filter(c => {
      if (status !== 'all' && c.status !== status) return false;
      if (category && c.category.toLowerCase() !== String(category).toLowerCase()) return false;
      if (featured === 'true' && !c.featured) return false;
      if (tag && !c.tags.some(t => t.toLowerCase() === String(tag).toLowerCase())) return false;
      if (search) {
        const query = String(search).toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(query);
        const matchExcerpt = c.excerpt.toLowerCase().includes(query);
        const matchBody = c.body.toLowerCase().includes(query);
        const matchTag = c.tags.some(t => t.toLowerCase().includes(query));
        if (!matchTitle && !matchExcerpt && !matchBody && !matchTag) return false;
      }
      return true;
    });

    res.json({
      success: true,
      data: filtered,
      message: `Retrieved ${filtered.length} content items`
    });
  });

  app.get('/api/v1/content/:slug', (req: Request, res: Response) => {
    const item = contents.find(c => c.slug === req.params.slug);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Article or resource not found.' }
      });
    }
    item.viewCount += 1;
    res.json({
      success: true,
      data: item,
      message: 'Content item retrieved'
    });
  });

  app.post('/api/v1/content/:id/save', (req: Request, res: Response) => {
    const contentId = req.params.id;
    const item = contents.find(c => c.id === contentId);
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Content not found' } });
    }

    if (!savedContentByUser[currentUser.id]) {
      savedContentByUser[currentUser.id] = [];
    }
    const list = savedContentByUser[currentUser.id];
    const isSaved = list.includes(contentId);

    if (isSaved) {
      savedContentByUser[currentUser.id] = list.filter(id => id !== contentId);
      item.saveCount = Math.max(0, item.saveCount - 1);
    } else {
      savedContentByUser[currentUser.id].push(contentId);
      item.saveCount += 1;
    }

    res.json({
      success: true,
      data: {
        isSaved: !isSaved,
        savedContentIds: savedContentByUser[currentUser.id],
        saveCount: item.saveCount
      },
      message: !isSaved ? 'Saved to your personal collection' : 'Removed from saved collection'
    });
  });

  app.get('/api/v1/categories', (req, res) => {
    res.json({ success: true, data: categories });
  });

  app.get('/api/v1/tags', (req, res) => {
    res.json({ success: true, data: tags });
  });

  // --------------------------------------------------------------------------
  // ASK GENEROUSLEE API (/api/v1/questions)
  // --------------------------------------------------------------------------
  app.get('/api/v1/questions', (req: Request, res: Response) => {
    const { category, filter = 'published' } = req.query;
    let list = [...questions];

    if (filter === 'mine') {
      list = list.filter(q => q.userId === currentUser.id);
    } else if (filter === 'published') {
      list = list.filter(q => q.status === 'published');
    }

    if (category && category !== 'all') {
      list = list.filter(q => q.category.toLowerCase() === String(category).toLowerCase());
    }

    res.json({
      success: true,
      data: list,
      message: `Found ${list.length} questions`
    });
  });

  app.post('/api/v1/questions', (req: Request, res: Response) => {
    const { questionText, contextNotes, category, isAnonymous, publicConsent } = req.body;

    if (!questionText || questionText.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Please provide a thoughtful question (at least 10 characters).' }
      });
    }

    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      userId: currentUser.id,
      authorName: isAnonymous ? 'Anonymous Member' : currentUser.name,
      isAnonymous: Boolean(isAnonymous),
      category: category || 'motherhood',
      questionText: questionText.trim(),
      contextNotes: contextNotes?.trim(),
      publicConsent: publicConsent !== false,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    questions.unshift(newQuestion);

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: currentUser.email,
      action: 'SUBMIT_QUESTION',
      targetType: 'Question',
      targetId: newQuestion.id,
      details: `New question submitted under category "${newQuestion.category}"`
    });

    res.status(201).json({
      success: true,
      data: newQuestion,
      message: 'Your question has been received with care. Latisha and our advisory team review submissions weekly.'
    });
  });

  app.post('/api/v1/questions/:id/respond', (req: Request, res: Response) => {
    // Admin or Mentor only
    if (!['super_admin', 'admin', 'editor', 'mentor'].includes(currentUser.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to answer questions.' }
      });
    }

    const q = questions.find(item => item.id === req.params.id);
    if (!q) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Question not found' } });
    }

    const { responseText, keyTakeaways = [], recommendedContentSlugs = [], publish = true } = req.body;

    q.response = {
      id: `resp-${Date.now()}`,
      questionId: q.id,
      responderName: currentUser.name,
      responderTitle: currentUser.bio?.split('.')[0] || 'Founder & Mentor',
      responderAvatar: currentUser.avatarUrl || '',
      responseText,
      keyTakeaways,
      recommendedContentSlugs,
      answeredAt: new Date().toISOString(),
      helpfulCount: 0
    };

    q.status = publish ? 'published' : 'answered';
    q.moderatedAt = new Date().toISOString();

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: currentUser.email,
      action: 'ANSWER_QUESTION',
      targetType: 'Question',
      targetId: q.id,
      details: `Answered question "${q.id}" by ${currentUser.name}`
    });

    res.json({
      success: true,
      data: q,
      message: 'Response recorded and published.'
    });
  });

  // --------------------------------------------------------------------------
  // COMMUNITY, MENTORSHIP, COURSES & EVENTS API
  // --------------------------------------------------------------------------
  app.get('/api/v1/community/groups', (req, res) => {
    res.json({ success: true, data: groups });
  });

  app.get('/api/v1/community/posts', (req, res) => {
    res.json({ success: true, data: posts });
  });

  app.post('/api/v1/community/posts', (req: Request, res: Response) => {
    const { groupId, title, content, isAnonymous } = req.body;
    const group = groups.find(g => g.id === groupId) || groups[0];

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      groupId: group.id,
      groupName: group.name,
      authorName: isAnonymous ? 'A Member' : currentUser.name,
      authorAvatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      isAnonymous: Boolean(isAnonymous),
      title,
      content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      isLiked: false
    };

    posts.unshift(newPost);
    group.postCount += 1;

    res.status(201).json({ success: true, data: newPost, message: 'Shared with the community.' });
  });

  app.post('/api/v1/community/posts/:id/react', (req: Request, res: Response) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Post not found' } });
    }
    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;
    res.json({ success: true, data: { isLiked: post.isLiked, likesCount: post.likesCount } });
  });

  app.get('/api/v1/mentors', (req, res) => {
    res.json({ success: true, data: mentors });
  });

  app.get('/api/v1/courses', (req, res) => {
    // Augment with current user's progress if enrolled
    const userProg = userCourseProgress[currentUser.id] || {};
    const enrolledList = userEnrolledCourses[currentUser.id] || [];
    const augmented = courses.map(c => ({
      ...c,
      isEnrolled: enrolledList.includes(c.id),
      progressPercent: userProg[c.id] !== undefined ? userProg[c.id] : (c.progressPercent || 0)
    }));
    res.json({ success: true, data: augmented });
  });

  app.post('/api/v1/courses/:id/enroll', (req: Request, res: Response) => {
    const courseId = req.params.id;
    const course = courses.find(c => c.id === courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (!userEnrolledCourses[currentUser.id]) {
      userEnrolledCourses[currentUser.id] = [];
    }
    if (!userEnrolledCourses[currentUser.id].includes(courseId)) {
      userEnrolledCourses[currentUser.id].push(courseId);
    }
    if (!userCourseProgress[currentUser.id]) {
      userCourseProgress[currentUser.id] = {};
    }
    if (userCourseProgress[currentUser.id][courseId] === undefined) {
      userCourseProgress[currentUser.id][courseId] = 0;
    }
    course.enrolledCount = (course.enrolledCount || 100) + 1;

    res.json({
      success: true,
      message: `Enrolled successfully in ${course.title}`,
      data: {
        enrolledCourses: userEnrolledCourses[currentUser.id],
        progress: userCourseProgress[currentUser.id]
      }
    });
  });

  app.post('/api/v1/courses/:id/progress', (req: Request, res: Response) => {
    const courseId = req.params.id;
    const { progressPercent } = req.body;
    if (!userCourseProgress[currentUser.id]) {
      userCourseProgress[currentUser.id] = {};
    }
    const safePercent = Math.min(100, Math.max(0, Number(progressPercent) || 0));
    userCourseProgress[currentUser.id][courseId] = safePercent;

    res.json({
      success: true,
      message: 'Course progress updated',
      data: { courseId, progressPercent: safePercent }
    });
  });

  // --------------------------------------------------------------------------
  // DAILY JOURNAL API (/api/v1/journal)
  // --------------------------------------------------------------------------
  app.get('/api/v1/journal/today-prompt', (req, res) => {
    const prompts = [
      {
        prompt: 'Where did you sense God calling you to pause, breathe, and receive His peace today?',
        scriptureReference: 'Psalm 46:10 — "Be still, and know that I am God; I will be exalted among the nations."',
        theme: 'Divine Rest & Surrender'
      },
      {
        prompt: 'What expectation or burden are you carrying right now that God did not ask you to bear?',
        scriptureReference: 'Matthew 11:28-30 — "Come to me, all who labor and are heavy laden, and I will give you rest."',
        theme: 'Releasing False Burdens'
      },
      {
        prompt: 'In what practical way can you honor your body as a temple of the Holy Spirit before this day ends?',
        scriptureReference: '1 Corinthians 6:19-20 — "Do you not know that your bodies are temples of the Holy Spirit, who is in you...?"',
        theme: 'Temple Care & Wholeness'
      },
      {
        prompt: 'What word of encouragement or grace can you speak into your home, children, or partnership today?',
        scriptureReference: 'Proverbs 16:24 — "Gracious words are a honeycomb, sweet to the soul and healing to the bones."',
        theme: 'Gracious Speech'
      },
      {
        prompt: 'Recall a moment this week when God provided for you. How does that remembrance anchor your trust for tomorrow?',
        scriptureReference: 'Lamentations 3:22-23 — "His compassions never fail. They are new every morning; great is your faithfulness."',
        theme: 'Gratitude & Remembrance'
      }
    ];

    // Select daily prompt based on day of month
    const day = new Date().getDate();
    const selected = prompts[day % prompts.length];

    res.json({
      success: true,
      data: selected
    });
  });

  app.get('/api/v1/journal/entries', (req, res) => {
    const entries = userJournalEntries[currentUser.id] || [];
    res.json({
      success: true,
      data: entries
    });
  });

  app.post('/api/v1/journal/entries', (req: Request, res: Response) => {
    const { prompt, scriptureReference, reflectionText, gratitudeNote, moodTag } = req.body;
    if (!reflectionText || reflectionText.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Please write at least a few heartfelt words in your reflection.' }
      });
    }

    if (!userJournalEntries[currentUser.id]) {
      userJournalEntries[currentUser.id] = [];
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry: JournalEntry = {
      id: `jrn-${Date.now()}`,
      userId: currentUser.id,
      date: todayStr,
      prompt: prompt || 'Daily Faith Reflection',
      scriptureReference: scriptureReference || 'Philippians 4:6-7',
      reflectionText: reflectionText.trim(),
      gratitudeNote: gratitudeNote?.trim() || undefined,
      moodTag: moodTag || 'peaceful',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    userJournalEntries[currentUser.id].unshift(newEntry);

    res.status(201).json({
      success: true,
      data: newEntry,
      message: 'Reflection saved securely in your sanctuary.'
    });
  });

  app.delete('/api/v1/journal/entries/:id', (req: Request, res: Response) => {
    const entryId = req.params.id;
    if (userJournalEntries[currentUser.id]) {
      userJournalEntries[currentUser.id] = userJournalEntries[currentUser.id].filter(e => e.id !== entryId);
    }
    res.json({ success: true, message: 'Journal entry removed' });
  });

  // --------------------------------------------------------------------------
  // NEWSLETTER & SUBSCRIBER API (/api/v1/newsletter)
  // --------------------------------------------------------------------------
  app.post('/api/v1/newsletter/subscribe', (req: Request, res: Response) => {
    const { email, firstName, interests = [] } = req.body;

    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_EMAIL', message: 'Please enter a valid email address.' }
      });
    }

    const normalized = email.toLowerCase().trim();
    const existing = newsletterSubscribers.find(s => s.email.toLowerCase() === normalized);

    if (existing) {
      return res.json({
        success: true,
        message: 'You are already subscribed to weekly encouragement from Latisha! Check your inbox for our latest reflection.'
      });
    }

    const newSub: NewsletterSubscription = {
      id: `sub-${Date.now()}`,
      email: normalized,
      firstName: firstName?.trim() || undefined,
      interests: Array.isArray(interests) ? interests : [],
      subscribedAt: new Date().toISOString(),
      status: 'active'
    };

    newsletterSubscribers.unshift(newSub);

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: normalized,
      action: 'NEWSLETTER_SUBSCRIBED',
      targetType: 'Newsletter',
      targetId: newSub.id,
      details: `Subscriber joined via footer encouragement signup (${firstName || 'Anonymous'})`
    });

    res.status(201).json({
      success: true,
      message: `Welcome to the Generouslee sisterhood, ${firstName ? firstName : 'sister'}! Your weekly encouragement note is on its way.`,
      data: newSub
    });
  });

  // --------------------------------------------------------------------------
  // DYNAMIC RECOMMENDATIONS API (/api/v1/recommendations/personalized)
  // --------------------------------------------------------------------------
  app.get('/api/v1/recommendations/personalized', (req: Request, res: Response) => {
    const userFavorites = savedContentByUser[currentUser.id] || [];
    const userInterests = (currentUser.interests || []).map(i => i.toLowerCase());

    // Favorited content items to inspect categories & tags
    const favoritedItems = contents.filter(c => userFavorites.includes(c.id));
    const favoritedCategories = new Set(favoritedItems.map(c => c.category.toLowerCase()));
    const favoritedTags = new Set(favoritedItems.flatMap(c => c.tags.map(t => t.toLowerCase())));

    // Score published articles
    const scoredArticles = contents
      .filter(c => c.status === 'published')
      .map(item => {
        let score = 0;
        const itemCat = item.category.toLowerCase();
        // Match user growth interests
        if (userInterests.some(ui => itemCat.includes(ui) || ui.includes(itemCat))) score += 40;
        // Match favorited content categories
        if (favoritedCategories.has(itemCat)) score += 35;
        // Match tags
        item.tags.forEach(t => {
          if (favoritedTags.has(t.toLowerCase())) score += 15;
          if (userInterests.some(ui => t.toLowerCase().includes(ui))) score += 15;
        });
        // Bonus for featured
        if (item.featured) score += 10;
        // Mark if directly saved
        const isFavorited = userFavorites.includes(item.id);

        return {
          item,
          score,
          isFavorited,
          matchReason: favoritedCategories.has(itemCat)
            ? `Matches topics you favorited (${item.category.replace('-', ' ')})`
            : userInterests.some(ui => itemCat.includes(ui))
            ? `Alters to your focus (${item.category.replace('-', ' ')})`
            : 'Curated for your faith & purpose walk'
        };
      })
      .sort((a, b) => b.score - a.score);

    // Score community discussions
    const scoredDiscussions = posts.map(post => {
      let score = 0;
      const group = groups.find(g => g.id === post.groupId);
      const postText = (post.title + ' ' + post.content).toLowerCase();

      userInterests.forEach(interest => {
        if (postText.includes(interest) || (group && group.slug.includes(interest))) score += 25;
      });

      favoritedCategories.forEach(cat => {
        if (postText.includes(cat) || (group && group.slug.includes(cat))) score += 20;
      });

      if (group?.isJoined) score += 15;

      return {
        post,
        group,
        score,
        matchReason: group?.name || 'Active sisterhood circle'
      };
    }).sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      data: {
        recommendedArticles: scoredArticles.slice(0, 6).map(s => ({ ...s.item, matchReason: s.matchReason })),
        recommendedDiscussions: scoredDiscussions.slice(0, 4).map(s => ({
          ...s.post,
          groupName: s.group?.name || s.post.groupName,
          groupIcon: s.group?.icon,
          matchReason: s.matchReason
        })),
        userInterestTags: currentUser.interests,
        favoriteCount: userFavorites.length
      }
    });
  });

  // --------------------------------------------------------------------------
  // GROWTH MILESTONES & BADGES API (/api/v1/milestones)
  // --------------------------------------------------------------------------
  app.get('/api/v1/milestones/profile', (req: Request, res: Response) => {
    const profile = calculateUserGrowthProfile(currentUser.id);
    res.json({ success: true, data: profile });
  });

  app.post('/api/v1/milestones/log-action', (req: Request, res: Response) => {
    const { actionType } = req.body; // 'read_article' | 'complete_module' | 'journal_entry'
    if (!userGrowthData[currentUser.id]) {
      userGrowthData[currentUser.id] = {
        readingStreakDays: 1,
        completedAcademyModules: 0,
        consecutiveJournalDays: 0,
        totalArticlesRead: 1
      };
    }

    const current = userGrowthData[currentUser.id];
    let message = 'Progress recorded!';
    if (actionType === 'read_article') {
      current.totalArticlesRead += 1;
      current.readingStreakDays = Math.min(14, current.readingStreakDays + 1);
      message = 'Reading streak updated! Keep walking steadfastly in the Word.';
    } else if (actionType === 'complete_module') {
      current.completedAcademyModules += 1;
      message = 'Academy module milestone recorded! You earned Kingdom scholar points.';
    } else if (actionType === 'journal_entry') {
      current.consecutiveJournalDays += 1;
      message = 'Daily journal sanctuary streak recorded!';
    }

    const updatedProfile = calculateUserGrowthProfile(currentUser.id);
    res.json({
      success: true,
      message,
      data: updatedProfile
    });
  });

  // --------------------------------------------------------------------------
  // INTERACTIVE MENTOR ASSESSMENT API (/api/v1/mentors/assessment)
  // --------------------------------------------------------------------------
  app.post('/api/v1/mentors/assessment', (req: Request, res: Response) => {
    const { currentLifeSeason, primarySpiritualGoal, preferredMentorshipFormat, notes } = req.body;

    const season = (currentLifeSeason || '').toLowerCase();
    const goal = (primarySpiritualGoal || '').toLowerCase();

    // Match mentors based on scoring
    const scoredMentors = mentors.map(mentor => {
      let score = 0;
      const allText = (mentor.name + ' ' + mentor.title + ' ' + mentor.bio + ' ' + mentor.areasOfSupport.join(' ')).toLowerCase();

      if (season.includes('motherhood') || season.includes('postpartum') || season.includes('matrescence')) {
        if (allText.includes('motherhood') || allText.includes('perinatal') || allText.includes('parenting')) score += 50;
      }
      if (season.includes('marriage') || season.includes('couples') || season.includes('relationship')) {
        if (allText.includes('marriage') || allText.includes('counselor') || allText.includes('couples')) score += 55;
      }
      if (season.includes('purpose') || season.includes('career') || season.includes('transition')) {
        if (allText.includes('purpose') || allText.includes('self-motivation') || allText.includes('calling')) score += 50;
      }
      if (season.includes('health') || season.includes('temple') || season.includes('burnout')) {
        if (allText.includes('temple') || allText.includes('health') || allText.includes('vitality') || allText.includes('burnout')) score += 50;
      }

      // Goal match
      if (goal.includes('prayer') || goal.includes('spiritual')) {
        if (allText.includes('prayer') || allText.includes('formation') || allText.includes('faith')) score += 40;
      }
      if (goal.includes('overwhelm') || goal.includes('anxiety')) {
        if (allText.includes('anxiety') || allText.includes('overwhelm') || allText.includes('emotional')) score += 40;
      }
      if (goal.includes('discipline') || goal.includes('motivation')) {
        if (allText.includes('discipline') || allText.includes('self-motivation')) score += 40;
      }

      // Latisha is always a top anchor mentor
      if (mentor.id === 'mnt-1') score += 30;

      return { mentor, score };
    }).sort((a, b) => b.score - a.score);

    const topMentors = scoredMentors.slice(0, 3).map(s => s.mentor);

    // Build personalized path recommendations
    let primaryPath = {
      title: 'The Divine Purpose & Clarity Track',
      description: 'A 3-stage alignment pathway designed to anchor your spiritual foundation, establish daily peace, and step courageously into your kingdom calling.',
      recommendedCourseSlug: 'walking-in-divine-purpose-masterclass',
      stepGuide: [
        'Complete the 1-on-1 Purpose Clarity intake with your matched mentor',
        'Begin Module 1 of Walking in Divine Purpose: Aligning Morning Rhythms',
        'Anchor your week with the Generouslee Daily Faith Sanctuary reflection'
      ]
    };

    if (season.includes('motherhood') || goal.includes('overwhelm')) {
      primaryPath = {
        title: 'Maternal Grace & Wholeness Sanctuary Path',
        description: 'Focusing on perinatal nervous system peace, overcoming maternal guilt, and cultivating holy rest while caring for your family.',
        recommendedCourseSlug: 'walking-in-divine-purpose-masterclass',
        stepGuide: [
          'Schedule an exploratory consultation with Dr. Evelyn Morales or Latisha',
          'Join the New Mothers Circle for peer affirmation & shared prayer',
          'Implement the 10-Minute Morning Solitude script before nursery wake-ups'
        ]
      };
    } else if (season.includes('marriage')) {
      primaryPath = {
        title: 'Covenant Marriage & Intimacy Renewal Path',
        description: 'Guided intentional dialogues to bridge communication gaps, rebalance mental load, and reignite affectionate joy.',
        recommendedCourseSlug: 'marriage-after-baby-playbook',
        stepGuide: [
          'Book a Couples Alignment Deep Dive session',
          'Review the 6-Second Daily Kiss & Appreciation Ritual',
          'Take the Cognitive Load Fair-Play Inventory together'
        ]
      };
    } else if (season.includes('health') || goal.includes('vitality')) {
      primaryPath = {
        title: 'Temple Care & Kingdom Vitality Path',
        description: 'Honoring your physical vessel through nourishing nutrition, physical strength, and intentional stress recovery.',
        recommendedCourseSlug: 'walking-in-divine-purpose-masterclass',
        stepGuide: [
          'Audit your daily energy peaks and hydration rhythms with Coach Chloe',
          'Dedicate 20 minutes to joy-filled movement as worship 3x weekly',
          'Establish a 9:30 PM digital Sabbath routine for nervous system sleep'
        ]
      };
    }

    const encouragement = `Sister, God sees the desires of your heart in this season. Whether you are navigating ${season || 'new horizons'} or seeking ${goal || 'renewed peace'}, you do not have to walk this road isolated. We are pairing you with mentors who uphold both biblical truth and gentle, practical wisdom.`;

    res.json({
      success: true,
      data: {
        recommendedMentors: topMentors,
        primaryPath,
        tailoredEncouragement: encouragement
      }
    });
  });

  // --------------------------------------------------------------------------
  // GEMINI AI: "REFLECTION OF THE DAY" API (/api/v1/ai/reflection-of-the-day)
  // --------------------------------------------------------------------------
  app.post('/api/v1/ai/reflection-of-the-day', async (req: Request, res: Response) => {
    const { lifeSeason = 'faith & purpose', userName = currentUser.name } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback curated reflections if Gemini API key is not yet set or during offline/fallback situations
    const fallbackReflections: Record<string, DailyReflectionResult> = {
      'motherhood': {
        affirmation: "God did not call you to be an effortless mother; He called you to be a surrendered daughter.",
        scriptureAnchor: "Isaiah 40:11 — 'He tends his flock like a shepherd: He gathers the lambs in his arms and carries them close to his heart; he gently leads those that have young.'",
        lifeSeason: "Motherhood & Matrescence",
        practicalAction: "Take three slow, unhurried breaths while holding your child or washing dishes. Whisper: 'Lord, give me today what I cannot generate on my own.'",
        prayerThought: "Father, thank You for meeting me in the hidden labor of motherhood. Release me from perfectionism, and fill our home with Your gentle peace.",
        authorLabel: "Inspired by Latisha Langley (@latishalangley)",
        generatedAt: new Date().toISOString()
      },
      'growth': {
        affirmation: "Small, obedient steps taken in faith carry more kingdom weight than grand plans made in anxiety.",
        scriptureAnchor: "Zechariah 4:10 — 'Do not despise these small beginnings, for the Lord rejoices to see the work begin.'",
        lifeSeason: "Spiritual Growth & Purpose",
        practicalAction: "Identify the one task you've been delaying out of fear of inadequacy. Dedicate just 12 minutes to it today as an offering to God.",
        prayerThought: "Lord, teach me to delight in the quiet obedience of today. Let my growth be rooted in Your timing and not the world's hurried expectations.",
        authorLabel: "Inspired by Latisha Langley (@latishalangley)",
        generatedAt: new Date().toISOString()
      },
      'marriage': {
        affirmation: "Grace is remembering that your spouse is also a work in progress in the hands of a faithful Potter.",
        scriptureAnchor: "Ephesians 4:2 — 'Be completely humble and gentle; be patient, bearing with one another in love.'",
        lifeSeason: "Covenant Marriage",
        practicalAction: "Speak one genuine, unprompted word of gratitude to your partner before the sun sets today.",
        prayerThought: "Lord, soften my heart towards my spouse. Rebuild our laughter and strengthen the covenant of our home.",
        authorLabel: "Inspired by Latisha Langley (@latishalangley)",
        generatedAt: new Date().toISOString()
      },
      'default': {
        affirmation: "You are a woman of divine purpose. The peace of God is your birthright, not a reward for completing your to-do list.",
        scriptureAnchor: "Philippians 4:7 — 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.'",
        lifeSeason: "Divine Purpose & Wholeness",
        practicalAction: "Step away from your screen for five minutes. Drink a glass of water and thank God for three specific mercies today.",
        prayerThought: "Heavenly Father, quiet the noise around me. Center my mind on Your unfailing love and guide my steps in purpose.",
        authorLabel: "Inspired by Latisha Langley (@latishalangley)",
        generatedAt: new Date().toISOString()
      }
    };

    const normalizedSeason = lifeSeason.toLowerCase();
    const fallbackKey = Object.keys(fallbackReflections).find(k => normalizedSeason.includes(k)) || 'default';
    const fallbackResult = fallbackReflections[fallbackKey];

    if (!apiKey) {
      return res.json({
        success: true,
        data: fallbackResult,
        note: 'Curated reflection served (Gemini API key available in Settings > Secrets).'
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are the spiritual and wellness mentor Latisha Langley (Generouslee platform, @latishalangley on TikTok). 
You empower healthy, self-motivated women of God seeking purpose, physical temple care, and sisterhood.
Generate an uplifting, faith-anchored "Reflection of the Day" for a woman named "${userName}" whose current life season or focus is "${lifeSeason}".

Format your response strictly as valid JSON with no code blocks, matching this schema:
{
  "affirmation": "A powerful 1-2 sentence faith-grounded affirmation or conviction in Latisha's voice",
  "scriptureAnchor": "Book Chapter:Verse — 'Full Scripture Quote'",
  "lifeSeason": "${lifeSeason}",
  "practicalAction": "A tangible, gentle 2-minute physical or spiritual practice for today",
  "prayerThought": "A short, vulnerable 1-2 sentence prayer to whisper before God",
  "authorLabel": "Latisha Langley & The Generouslee Circle"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText.trim());

      const result: DailyReflectionResult = {
        affirmation: parsed.affirmation || fallbackResult.affirmation,
        scriptureAnchor: parsed.scriptureAnchor || fallbackResult.scriptureAnchor,
        lifeSeason: parsed.lifeSeason || lifeSeason,
        practicalAction: parsed.practicalAction || fallbackResult.practicalAction,
        prayerThought: parsed.prayerThought || fallbackResult.prayerThought,
        authorLabel: parsed.authorLabel || 'Latisha Langley & Generouslee Circle',
        generatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      console.warn('[Gemini API] Reflection generation fallback activated:', err?.message || err);
      res.json({
        success: true,
        data: fallbackResult
      });
    }
  });

  app.get('/api/v1/events', (req, res) => {
    res.json({ success: true, data: events });
  });

  app.get('/api/v1/resources', (req, res) => {
    res.json({ success: true, data: resources });
  });

  app.post('/api/v1/events/:id/register', (req: Request, res: Response) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    event.registeredCount += 1;
    res.json({ success: true, message: `Successfully registered for "${event.title}". Check your email for access details.` });
  });

  // --------------------------------------------------------------------------
  // ADMIN DASHBOARD & CMS (/api/v1/admin)
  // --------------------------------------------------------------------------
  app.get('/api/v1/admin/overview', (req: Request, res: Response) => {
    if (!['super_admin', 'admin', 'editor', 'moderator'].includes(currentUser.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin privileges required' }
      });
    }

    res.json({
      success: true,
      data: {
        metrics: INITIAL_ANALYTICS,
        recentQuestions: questions.slice(0, 5),
        recentPosts: posts.slice(0, 5),
        recentLogs: auditLogs.slice(0, 6),
        totalContent: contents.length,
        totalUsers: users.length
      }
    });
  });

  app.post('/api/v1/admin/content', (req: Request, res: Response) => {
    if (!['super_admin', 'admin', 'editor'].includes(currentUser.role)) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permission' } });
    }

    const { title, excerpt, body, category, tags = [], featured = false, status = 'published', coverImage } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newItem: ContentItem = {
      id: `cnt-${Date.now()}`,
      title,
      slug,
      excerpt,
      body,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1200',
      author: {
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl || '',
        role: currentUser.bio || 'Generouslee Creator'
      },
      contentType: 'article',
      category: category || 'motherhood',
      tags,
      seoTitle: `${title} | Generouslee`,
      seoDescription: excerpt,
      status,
      publishedDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      featured: Boolean(featured),
      readingTimeMinutes: Math.max(2, Math.ceil((body || '').split(/\s+/).length / 200)),
      viewCount: 0,
      shareCount: 0,
      saveCount: 0
    };

    contents.unshift(newItem);

    auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: currentUser.email,
      action: 'CREATE_CONTENT',
      targetType: 'Content',
      targetId: newItem.id,
      details: `Created new article "${newItem.title}" (${status})`
    });

    res.status(201).json({ success: true, data: newItem, message: 'Content created successfully' });
  });

  app.patch('/api/v1/admin/questions/:id/status', (req: Request, res: Response) => {
    const q = questions.find(item => item.id === req.params.id);
    if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
    const { status } = req.body;
    q.status = status;
    res.json({ success: true, data: q, message: `Question status updated to ${status}` });
  });

  app.get('/api/v1/admin/users', (req: Request, res: Response) => {
    res.json({ success: true, data: users });
  });

  app.get('/api/v1/admin/audit-logs', (req: Request, res: Response) => {
    res.json({ success: true, data: auditLogs });
  });

  // --------------------------------------------------------------------------
  // VITE MIDDLEWARE & STATIC SERVING
  // --------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Generouslee] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
