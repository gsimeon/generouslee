import {
  User,
  ContentItem,
  Category,
  Tag,
  Question,
  CommunityGroup,
  CommunityPost,
  Mentor,
  Course,
  EventItem,
  ResourceItem,
  AuditLog,
  AnalyticsMetric,
  UserRole,
  JournalEntry,
  UserGrowthProfile,
  MilestoneBadge,
  MentorAssessmentAnswer,
  MentorRecommendationResult,
  DailyReflectionResult
} from '../types';
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
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'generouslee_users',
  CURRENT_USER_ID: 'generouslee_current_user_id',
  SAVED_CONTENT: 'generouslee_saved_content',
  CONTENT: 'generouslee_content',
  QUESTIONS: 'generouslee_questions',
  POSTS: 'generouslee_posts',
  JOURNAL: 'generouslee_journal',
  COURSES: 'generouslee_courses',
  GROWTH: 'generouslee_growth',
  SUBSCRIBERS: 'generouslee_subscribers'
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors in private browsing
  }
}

// In-memory / storage sync
let users: User[] = getStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
let currentUserId: string = getStorage(STORAGE_KEYS.CURRENT_USER_ID, INITIAL_USERS[0].id);
let contents: ContentItem[] = getStorage(STORAGE_KEYS.CONTENT, INITIAL_CONTENT);
let questions: Question[] = getStorage(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
let posts: CommunityPost[] = getStorage(STORAGE_KEYS.POSTS, INITIAL_COMMUNITY_POSTS);
let savedContentByUser: Record<string, string[]> = getStorage(STORAGE_KEYS.SAVED_CONTENT, {
  'usr-member-1': ['cnt-1', 'cnt-2', 'cnt-5']
});
let userJournalEntries: Record<string, JournalEntry[]> = getStorage(STORAGE_KEYS.JOURNAL, {
  'usr-member-1': [
    {
      id: 'jrn-7',
      userId: 'usr-member-1',
      date: '2026-09-17',
      prompt: 'One Gratitude for Today',
      scriptureReference: '1 Thessalonians 5:18 — "Give thanks in all circumstances; for this is God’s will for you in Christ Jesus."',
      reflectionText: 'Morning quiet time before the house woke up. I reflected on how far God has brought our family over the past season. The patience required with my toddlers is softening my own self-reliance into holy dependency on Christ.',
      gratitudeNote: 'Grateful for peaceful morning sunlight and a warm cup of herbal tea.',
      category: 'Motherhood',
      moodTag: 'peaceful',
      moodEmoji: '🕊️',
      wordCount: 46,
      sentimentScore: 92,
      createdAt: '2026-09-17T07:15:00Z',
      updatedAt: '2026-09-17T07:15:00Z'
    },
    {
      id: 'jrn-6',
      userId: 'usr-member-1',
      date: '2026-09-16',
      prompt: 'One Challenge & Growth Edge',
      scriptureReference: '2 Corinthians 12:9 — "My grace is sufficient for you, for my power is made perfect in weakness."',
      reflectionText: 'Felt stretched thin with consulting deliverables and home management. Instead of masking exhaustion with hyper-productivity, I paused for 10 minutes, surrendered the urge to control every outcome, and asked the Lord for wisdom and discernment to steward only what He commanded.',
      category: 'Career',
      moodTag: 'strengthened',
      moodEmoji: '🌿',
      wordCount: 47,
      sentimentScore: 82,
      createdAt: '2026-09-16T18:30:00Z',
      updatedAt: '2026-09-16T18:30:00Z'
    },
    {
      id: 'jrn-5',
      userId: 'usr-member-1',
      date: '2026-09-15',
      prompt: 'Gratitude & Daily Challenge',
      scriptureReference: '1 Corinthians 6:19 — "Your body is a temple of the Holy Spirit."',
      reflectionText: 'Gratitude:\nHealthy home, fresh produce, and restorative sleep last night.\n\nChallenge Faced & Grace Needed:\nResisting physical exhaustion after a long workday. Decided to honor my temple by taking an evening walk with the kids without looking at my smartphone.',
      gratitudeNote: 'Evening walk in cool air without notifications.',
      category: 'Health & Temple',
      moodTag: 'peaceful',
      moodEmoji: '🕊️',
      wordCount: 44,
      sentimentScore: 89,
      createdAt: '2026-09-15T20:00:00Z',
      updatedAt: '2026-09-15T20:00:00Z'
    },
    {
      id: 'jrn-4',
      userId: 'usr-member-1',
      date: '2026-09-14',
      prompt: 'One Gratitude for Today',
      scriptureReference: 'Ephesians 4:2-3 — "Be completely humble and gentle; be patient, bearing with one another in love."',
      reflectionText: 'My husband and I sat together for 20 minutes of prayer after dinner. We talked through financial decisions with unity rather than tension, keeping Christ at the center of our marriage covenant.',
      gratitudeNote: 'Deepening partnership and spiritual intimacy with my spouse.',
      category: 'Marriage',
      moodTag: 'grateful',
      moodEmoji: '🙏',
      wordCount: 37,
      sentimentScore: 94,
      createdAt: '2026-09-14T21:10:00Z',
      updatedAt: '2026-09-14T21:10:00Z'
    },
    {
      id: 'jrn-3',
      userId: 'usr-member-1',
      date: '2026-09-13',
      prompt: 'Where did you sense God calling you to pause and receive His grace today?',
      scriptureReference: 'Psalm 46:10 — "Be still, and know that I am God."',
      reflectionText: 'I caught myself spiraling over my toddlers crying at the same time I had a deadline. Instead of snapping, I stepped into the hallway, put both hands over my heart, and took five slow breaths. Reminding myself that God gave me this day as a gift, not a performance test.',
      gratitudeNote: 'Grateful for cold water, a husband who cooked dinner, and the quiet hour after 8 PM.',
      category: 'Motherhood',
      moodTag: 'peaceful',
      moodEmoji: '🕊️',
      wordCount: 52,
      sentimentScore: 86,
      createdAt: '2026-09-13T20:45:00Z',
      updatedAt: '2026-09-13T20:45:00Z'
    },
    {
      id: 'jrn-2',
      userId: 'usr-member-1',
      date: '2026-09-11',
      prompt: 'One Challenge & Growth Edge',
      scriptureReference: 'Philippians 4:6-7 — "Do not be anxious about anything, but in every situation present your requests to God."',
      reflectionText: 'Felt anxiety creeping in regarding upcoming speaking engagement. Reminded myself that God does not call the equipped; He equips the called. My identity rests in His daughterhood, not applause or critique.',
      category: 'Faith',
      moodTag: 'seeking',
      moodEmoji: '🌤️',
      wordCount: 36,
      sentimentScore: 78,
      createdAt: '2026-09-11T12:00:00Z',
      updatedAt: '2026-09-11T12:00:00Z'
    },
    {
      id: 'jrn-1',
      userId: 'usr-member-1',
      date: '2026-09-09',
      prompt: 'One Gratitude for Today',
      scriptureReference: 'Psalm 103:2 — "Praise the Lord, my soul, and forget not all his benefits."',
      reflectionText: 'Starting this week with fresh devotion. Blessed to have Christian sisters who check in without pretense. Community is life-giving.',
      gratitudeNote: 'Text message prayer from sister Andrea.',
      category: 'Faith',
      moodTag: 'grateful',
      moodEmoji: '🙏',
      wordCount: 23,
      sentimentScore: 90,
      createdAt: '2026-09-09T08:30:00Z',
      updatedAt: '2026-09-09T08:30:00Z'
    }
  ]
});

let userGrowthData: Record<string, { readingStreakDays: number; completedAcademyModules: number; consecutiveJournalDays: number; totalArticlesRead: number }> = getStorage(STORAGE_KEYS.GROWTH, {
  'usr-member-1': {
    readingStreakDays: 6,
    completedAcademyModules: 5,
    consecutiveJournalDays: 4,
    totalArticlesRead: 14
  }
});

function getCurrentUser(): User {
  const found = users.find(u => u.id === currentUserId);
  return found || users[0];
}

function calculateUserGrowthProfile(userId: string): UserGrowthProfile {
  const growth = userGrowthData[userId] || {
    readingStreakDays: 1,
    completedAcademyModules: 0,
    consecutiveJournalDays: 1,
    totalArticlesRead: 2
  };
  const journalCount = (userJournalEntries[userId] || []).length;
  const streak = Math.max(growth.consecutiveJournalDays, journalCount > 0 ? 1 : 0);

  const badges: MilestoneBadge[] = [
    {
      id: 'badge-stillness',
      title: 'Stillness Circle',
      description: 'Maintained 3 consecutive days of morning journaling.',
      iconName: 'Flame',
      category: 'daily_journaling',
      level: 'bronze',
      targetValue: 3,
      currentValue: streak,
      isUnlocked: streak >= 3,
      unlockedAt: streak >= 3 ? '2026-09-12T08:00:00Z' : undefined,
      rewardPoints: 50
    },
    {
      id: 'badge-scholar',
      title: 'Academy Scholar',
      description: 'Completed at least 3 masterclass modules in the Academy.',
      iconName: 'BookOpen',
      category: 'academy_modules',
      level: 'silver',
      targetValue: 3,
      currentValue: growth.completedAcademyModules,
      isUnlocked: growth.completedAcademyModules >= 3,
      unlockedAt: growth.completedAcademyModules >= 3 ? '2026-09-10T12:00:00Z' : undefined,
      rewardPoints: 100
    },
    {
      id: 'badge-temple',
      title: 'Temple Care Advocate',
      description: 'Favorited and studied 5 articles on healthy living & burnout recovery.',
      iconName: 'Heart',
      category: 'reading_streak',
      level: 'bronze',
      targetValue: 5,
      currentValue: growth.totalArticlesRead,
      isUnlocked: growth.totalArticlesRead >= 5,
      unlockedAt: growth.totalArticlesRead >= 5 ? '2026-09-11T14:30:00Z' : undefined,
      rewardPoints: 75
    },
    {
      id: 'badge-sisterhood',
      title: 'Sisterhood Pillar',
      description: 'Participated in community discussions and encouraged fellow sisters.',
      iconName: 'Sparkles',
      category: 'community_fellowship',
      level: 'gold',
      targetValue: 1,
      currentValue: 1,
      isUnlocked: true,
      unlockedAt: '2026-09-08T09:15:00Z',
      rewardPoints: 150
    }
  ];

  return {
    readingStreakDays: growth.readingStreakDays,
    completedAcademyModules: growth.completedAcademyModules,
    consecutiveJournalDays: streak,
    totalJournalReflections: journalCount,
    totalArticlesRead: growth.totalArticlesRead,
    totalMilestonePoints: 375,
    badges
  };
}

export const mockFallback = {
  async getMe(): Promise<User & { savedContentIds: string[] }> {
    const user = getCurrentUser();
    return {
      ...user,
      savedContentIds: savedContentByUser[user.id] || []
    };
  },

  async login(email: string): Promise<User & { savedContentIds: string[] }> {
    const found = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || users[0];
    currentUserId = found.id;
    setStorage(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    return {
      ...found,
      savedContentIds: savedContentByUser[found.id] || []
    };
  },

  async register(data: { name: string; email: string; interests?: string[] }): Promise<User> {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: 'user',
      interests: data.interests || ['faith-purpose', 'healthy-living'],
      avatarUrl: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(data.name)}`,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    currentUserId = newUser.id;
    savedContentByUser[newUser.id] = [];
    setStorage(STORAGE_KEYS.USERS, users);
    setStorage(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    setStorage(STORAGE_KEYS.SAVED_CONTENT, savedContentByUser);
    return newUser;
  },

  async switchRole(role: UserRole): Promise<User & { savedContentIds: string[] }> {
    let matchingUser = users.find(u => u.role === role);
    if (!matchingUser) {
      const cur = getCurrentUser();
      cur.role = role;
      matchingUser = cur;
    }
    currentUserId = matchingUser.id;
    setStorage(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    setStorage(STORAGE_KEYS.USERS, users);
    return {
      ...matchingUser,
      savedContentIds: savedContentByUser[matchingUser.id] || []
    };
  },

  async updateInterests(interests: string[]): Promise<User> {
    const cur = getCurrentUser();
    cur.interests = interests;
    setStorage(STORAGE_KEYS.USERS, users);
    return cur;
  },

  async getContent(params?: { category?: string; tag?: string; search?: string; status?: string; featured?: boolean }): Promise<ContentItem[]> {
    let filtered = contents.filter(c => {
      if (params?.status && params.status !== 'all' && c.status !== params.status) return false;
      if (params?.category && c.category.toLowerCase() !== params.category.toLowerCase()) return false;
      if (params?.featured && !c.featured) return false;
      if (params?.tag && !c.tags.some(t => t.toLowerCase() === params.tag?.toLowerCase())) return false;
      if (params?.search) {
        const query = params.search.toLowerCase();
        const match = c.title.toLowerCase().includes(query) ||
          c.excerpt.toLowerCase().includes(query) ||
          c.body.toLowerCase().includes(query) ||
          c.tags.some(t => t.toLowerCase().includes(query));
        if (!match) return false;
      }
      return true;
    });
    return filtered;
  },

  async getContentBySlug(slug: string): Promise<ContentItem> {
    const item = contents.find(c => c.slug === slug);
    if (!item) throw new Error('Article not found');
    item.viewCount += 1;
    return item;
  },

  async toggleSaveContent(contentId: string): Promise<{ isSaved: boolean; savedContentIds: string[]; saveCount: number }> {
    const cur = getCurrentUser();
    const item = contents.find(c => c.id === contentId);
    if (!item) throw new Error('Content not found');

    if (!savedContentByUser[cur.id]) savedContentByUser[cur.id] = [];
    const list = savedContentByUser[cur.id];
    const isSaved = list.includes(contentId);

    if (isSaved) {
      savedContentByUser[cur.id] = list.filter(id => id !== contentId);
      item.saveCount = Math.max(0, item.saveCount - 1);
    } else {
      savedContentByUser[cur.id].push(contentId);
      item.saveCount += 1;
    }
    setStorage(STORAGE_KEYS.SAVED_CONTENT, savedContentByUser);
    setStorage(STORAGE_KEYS.CONTENT, contents);

    return {
      isSaved: !isSaved,
      savedContentIds: savedContentByUser[cur.id],
      saveCount: item.saveCount
    };
  },

  async getCategories(): Promise<Category[]> {
    return INITIAL_CATEGORIES;
  },

  async getTags(): Promise<Tag[]> {
    return INITIAL_TAGS;
  },

  async getQuestions(params?: { category?: string; filter?: 'published' | 'mine' | 'all' }): Promise<Question[]> {
    const cur = getCurrentUser();
    return questions.filter(q => {
      if (params?.category && q.category !== params.category) return false;
      if (params?.filter === 'published' && q.status !== 'published') return false;
      if (params?.filter === 'mine' && q.userId !== cur.id) return false;
      return true;
    });
  },

  async submitQuestion(payload: {
    questionText: string;
    contextNotes?: string;
    category: string;
    isAnonymous: boolean;
    publicConsent: boolean;
  }): Promise<Question> {
    const cur = getCurrentUser();
    const newQ: Question = {
      id: `q-${Date.now()}`,
      userId: cur.id,
      authorName: payload.isAnonymous ? 'Sister in Christ' : cur.name,
      category: payload.category,
      questionText: payload.questionText,
      contextNotes: payload.contextNotes,
      status: 'submitted',
      isAnonymous: payload.isAnonymous,
      publicConsent: payload.publicConsent,
      submittedAt: new Date().toISOString()
    };
    questions.unshift(newQ);
    setStorage(STORAGE_KEYS.QUESTIONS, questions);
    return newQ;
  },

  async respondToQuestion(questionId: string, payload: {
    responseText: string;
    keyTakeaways: string[];
    recommendedContentSlugs: string[];
    publish?: boolean;
  }): Promise<Question> {
    const q = questions.find(item => item.id === questionId);
    if (!q) throw new Error('Question not found');
    const cur = getCurrentUser();
    q.response = {
      id: `ans-${Date.now()}`,
      questionId: q.id,
      responderName: cur.name,
      responderTitle: 'Founder & Mentor',
      responderAvatar: cur.avatarUrl || '',
      responseText: payload.responseText,
      keyTakeaways: payload.keyTakeaways,
      recommendedContentSlugs: payload.recommendedContentSlugs,
      answeredAt: new Date().toISOString(),
      helpfulCount: 0
    };
    q.status = payload.publish ? 'published' : 'answered';
    setStorage(STORAGE_KEYS.QUESTIONS, questions);
    return q;
  },

  async getCommunityGroups(): Promise<CommunityGroup[]> {
    return INITIAL_COMMUNITY_GROUPS;
  },

  async getCommunityPosts(): Promise<CommunityPost[]> {
    return posts;
  },

  async createCommunityPost(data: { groupId: string; title: string; content: string; isAnonymous: boolean }): Promise<CommunityPost> {
    const cur = getCurrentUser();
    const group = INITIAL_COMMUNITY_GROUPS.find(g => g.id === data.groupId) || INITIAL_COMMUNITY_GROUPS[0];
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      groupId: group.id,
      groupName: group.name,
      authorName: data.isAnonymous ? 'A Member' : cur.name,
      authorAvatar: cur.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      isAnonymous: data.isAnonymous,
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      isLiked: false
    };
    posts.unshift(newPost);
    setStorage(STORAGE_KEYS.POSTS, posts);
    return newPost;
  },

  async reactToPost(postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const post = posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;
    setStorage(STORAGE_KEYS.POSTS, posts);
    return { isLiked: post.isLiked, likesCount: post.likesCount };
  },

  async getMentors(): Promise<Mentor[]> {
    return INITIAL_MENTORS;
  },

  async getCourses(): Promise<Course[]> {
    return INITIAL_COURSES;
  },

  async getEvents(): Promise<EventItem[]> {
    return INITIAL_EVENTS;
  },

  async getResources(): Promise<ResourceItem[]> {
    return INITIAL_RESOURCES;
  },

  async registerForEvent(eventId: string): Promise<{ message: string }> {
    return { message: 'You have been registered for this event. Details sent to your email.' };
  },

  async enrollCourse(courseId: string): Promise<{ message: string; data: any }> {
    return { message: 'Enrolled successfully in course', data: { courseId } };
  },

  async updateCourseProgress(courseId: string, progressPercent: number): Promise<{ success: boolean; data: any }> {
    return { success: true, data: { courseId, progressPercent } };
  },

  async getDailyJournalPrompt(): Promise<{ prompt: string; scriptureReference: string; theme: string }> {
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
        scriptureReference: '1 Corinthians 6:19-20 — "Do you not know that your bodies are temples of the Holy Spirit...?"',
        theme: 'Temple Care & Wholeness'
      }
    ];
    const day = new Date().getDate();
    return prompts[day % prompts.length];
  },

  async getJournalEntries(): Promise<JournalEntry[]> {
    const cur = getCurrentUser();
    return userJournalEntries[cur.id] || [];
  },

  async saveJournalEntry(entry: {
    prompt: string;
    scriptureReference: string;
    reflectionText: string;
    gratitudeNote?: string;
    photoUrl?: string;
    photoCaption?: string;
    voiceTranscribed?: boolean;
    promptCategory?: string;
    category?: string;
    moodTag?: string;
    moodEmoji?: string;
    sentimentScore?: number;
    wordCount?: number;
  }): Promise<JournalEntry> {
    const cur = getCurrentUser();
    if (!userJournalEntries[cur.id]) userJournalEntries[cur.id] = [];
    const validMoodTag = (entry.moodTag as JournalEntry['moodTag']) || 'peaceful';
    const computedWordCount = entry.wordCount ?? (entry.reflectionText ? entry.reflectionText.trim().split(/\s+/).filter(Boolean).length : 0);
    
    // Calculate a default sentiment score (70-98%) based on keywords or mood if not supplied
    let computedSentiment = entry.sentimentScore;
    if (computedSentiment === undefined) {
      const textLower = (entry.reflectionText + ' ' + (entry.gratitudeNote || '')).toLowerCase();
      let score = 80;
      if (textLower.includes('grateful') || textLower.includes('peace') || textLower.includes('thank') || textLower.includes('blessed') || textLower.includes('praise')) score += 12;
      if (textLower.includes('anxious') || textLower.includes('exhaust') || textLower.includes('spiral') || textLower.includes('burden')) score -= 10;
      if (textLower.includes('grace') || textLower.includes('surrender') || textLower.includes('christ') || textLower.includes('god')) score += 8;
      computedSentiment = Math.max(50, Math.min(99, score));
    }

    const newEntry: JournalEntry = {
      id: `jrn-${Date.now()}`,
      userId: cur.id,
      date: new Date().toISOString().split('T')[0],
      prompt: entry.prompt,
      scriptureReference: entry.scriptureReference,
      reflectionText: entry.reflectionText,
      gratitudeNote: entry.gratitudeNote,
      photoUrl: entry.photoUrl,
      photoCaption: entry.photoCaption,
      voiceTranscribed: entry.voiceTranscribed,
      promptCategory: entry.promptCategory,
      category: entry.category || 'Faith',
      moodTag: validMoodTag,
      moodEmoji: entry.moodEmoji || (validMoodTag === 'peaceful' ? '🕊️' : validMoodTag === 'grateful' ? '🙏' : validMoodTag === 'strengthened' ? '🌿' : '🌤️'),
      wordCount: computedWordCount,
      sentimentScore: computedSentiment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    userJournalEntries[cur.id].unshift(newEntry);
    setStorage(STORAGE_KEYS.JOURNAL, userJournalEntries);
    return newEntry;
  },

  async deleteJournalEntry(id: string): Promise<void> {
    const cur = getCurrentUser();
    if (userJournalEntries[cur.id]) {
      userJournalEntries[cur.id] = userJournalEntries[cur.id].filter(e => e.id !== id);
      setStorage(STORAGE_KEYS.JOURNAL, userJournalEntries);
    }
  },

  async subscribeNewsletter(payload: { email: string; firstName?: string; interests?: string[] }): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `Thank you for subscribing! A confirmation prayer letter will be sent to ${payload.email}.`
    };
  },

  async getAdminOverview(): Promise<{
    metrics: AnalyticsMetric;
    recentQuestions: Question[];
    recentPosts: CommunityPost[];
    recentLogs: AuditLog[];
    totalContent: number;
    totalUsers: number;
  }> {
    return {
      metrics: INITIAL_ANALYTICS,
      recentQuestions: questions.slice(0, 5),
      recentPosts: posts.slice(0, 5),
      recentLogs: INITIAL_AUDIT_LOGS.slice(0, 5),
      totalContent: contents.length,
      totalUsers: users.length
    };
  },

  async createContent(item: Partial<ContentItem>): Promise<ContentItem> {
    const cur = getCurrentUser();
    const slug = (item.title || 'article').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newContent: ContentItem = {
      id: `cnt-${Date.now()}`,
      title: item.title || 'Untitled',
      slug,
      excerpt: item.excerpt || '',
      body: item.body || '',
      category: item.category || 'faith-purpose',
      tags: item.tags || ['faith'],
      author: {
        name: cur.name,
        role: 'Founder & Mentor',
        avatarUrl: cur.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'
      },
      coverImage: item.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
      status: item.status || 'published',
      contentType: item.contentType || 'article',
      seoTitle: item.seoTitle || (item.title || 'Untitled'),
      seoDescription: item.seoDescription || (item.excerpt || ''),
      featured: Boolean(item.featured),
      readingTimeMinutes: item.readingTimeMinutes || 5,
      viewCount: 0,
      saveCount: 0,
      shareCount: 0,
      publishedDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };
    contents.unshift(newContent);
    setStorage(STORAGE_KEYS.CONTENT, contents);
    return newContent;
  },

  async updateQuestionStatus(id: string, status: string): Promise<Question> {
    const q = questions.find(item => item.id === id);
    if (!q) throw new Error('Question not found');
    q.status = status as any;
    setStorage(STORAGE_KEYS.QUESTIONS, questions);
    return q;
  },

  async getAdminUsers(): Promise<User[]> {
    return users;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    return INITIAL_AUDIT_LOGS;
  },

  async getPersonalizedRecommendations(): Promise<{
    recommendedArticles: (ContentItem & { matchReason?: string })[];
    recommendedDiscussions: (CommunityPost & { groupName?: string; groupIcon?: string; matchReason?: string })[];
    userInterestTags: string[];
    favoriteCount: number;
  }> {
    const cur = getCurrentUser();
    const userFavorites = savedContentByUser[cur.id] || [];
    return {
      recommendedArticles: contents.slice(0, 6).map(item => ({
        ...item,
        matchReason: `Curated for your ${item.category.replace('-', ' ')} focus`
      })),
      recommendedDiscussions: posts.slice(0, 4).map(post => ({
        ...post,
        matchReason: 'Active sisterhood circle'
      })),
      userInterestTags: cur.interests,
      favoriteCount: userFavorites.length
    };
  },

  async getGrowthMilestones(): Promise<UserGrowthProfile> {
    const cur = getCurrentUser();
    return calculateUserGrowthProfile(cur.id);
  },

  async logGrowthAction(actionType: 'read_article' | 'complete_module' | 'journal_entry'): Promise<{ success: boolean; message: string; data: UserGrowthProfile }> {
    const cur = getCurrentUser();
    if (!userGrowthData[cur.id]) {
      userGrowthData[cur.id] = { readingStreakDays: 1, completedAcademyModules: 0, consecutiveJournalDays: 0, totalArticlesRead: 1 };
    }
    const curGrowth = userGrowthData[cur.id];
    if (actionType === 'read_article') {
      curGrowth.totalArticlesRead += 1;
      curGrowth.readingStreakDays = Math.min(14, curGrowth.readingStreakDays + 1);
    } else if (actionType === 'complete_module') {
      curGrowth.completedAcademyModules += 1;
    } else if (actionType === 'journal_entry') {
      curGrowth.consecutiveJournalDays += 1;
    }
    setStorage(STORAGE_KEYS.GROWTH, userGrowthData);
    const profile = calculateUserGrowthProfile(cur.id);
    return {
      success: true,
      message: 'Progress recorded!',
      data: profile
    };
  },

  async submitMentorAssessment(answers: MentorAssessmentAnswer): Promise<MentorRecommendationResult> {
    const season = (answers.currentLifeSeason || '').toLowerCase();
    const goal = (answers.primarySpiritualGoal || '').toLowerCase();

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
    }

    return {
      recommendedMentors: INITIAL_MENTORS.slice(0, 3),
      primaryPath,
      tailoredEncouragement: `Sister, God sees the desires of your heart in this season. Whether you are navigating ${answers.currentLifeSeason || 'new beginnings'} or seeking ${answers.primarySpiritualGoal || 'clarity'}, we are pairing you with mentors who uphold biblical truth and gentle wisdom.`
    };
  },

  async getReflectionOfTheDay(lifeSeason?: string, userName?: string): Promise<DailyReflectionResult> {
    const reflections: Record<string, DailyReflectionResult> = {
      motherhood: {
        affirmation: "God did not call you to be an effortless mother; He called you to be a surrendered daughter.",
        scriptureAnchor: "Isaiah 40:11 — 'He tends his flock like a shepherd: He gathers the lambs in his arms and carries them close to his heart.'",
        lifeSeason: "Motherhood & Matrescence",
        practicalAction: "Take three slow, unhurried breaths while holding your child or washing dishes. Whisper: 'Lord, give me today what I cannot generate on my own.'",
        prayerThought: "Father, thank You for meeting me in the hidden labor of motherhood. Release me from perfectionism, and fill our home with Your gentle peace.",
        authorLabel: "Inspired by Latisha Langley (@latishalangley)",
        generatedAt: new Date().toISOString()
      },
      marriage: {
        affirmation: "Grace is remembering that your spouse is also a work in progress in the hands of a faithful Potter.",
        scriptureAnchor: "Ephesians 4:2 — 'Be completely humble and gentle; be patient, bearing with one another in love.'",
        lifeSeason: "Covenant Marriage",
        practicalAction: "Speak one genuine, unprompted word of gratitude to your partner before the sun sets today.",
        prayerThought: "Lord, soften my heart towards my spouse. Rebuild our laughter and strengthen the covenant of our home.",
        authorLabel: "Inspired by Latisha Langley (@latishalangley)",
        generatedAt: new Date().toISOString()
      },
      growth: {
        affirmation: "Small, obedient steps taken in faith carry more kingdom weight than grand plans made in anxiety.",
        scriptureAnchor: "Zechariah 4:10 — 'Do not despise these small beginnings, for the Lord rejoices to see the work begin.'",
        lifeSeason: "Spiritual Growth & Purpose",
        practicalAction: "Identify the one task you've been delaying out of fear of inadequacy. Dedicate just 12 minutes to it today as an offering to God.",
        prayerThought: "Lord, teach me to delight in the quiet obedience of today. Let my growth be rooted in Your timing and not the world's hurried expectations.",
        authorLabel: "Inspired by Latisha Langley (@latishalangley)",
        generatedAt: new Date().toISOString()
      }
    };

    const s = (lifeSeason || '').toLowerCase();
    if (s.includes('mother')) return reflections.motherhood;
    if (s.includes('marriage')) return reflections.marriage;
    return reflections.growth;
  }
};
