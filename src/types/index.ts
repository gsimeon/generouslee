export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'editor'
  | 'moderator'
  | 'mentor'
  | 'contributor'
  | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  interests: string[];
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  headline?: string;
  location?: string;
  timezone: string;
  savedContentIds: string[];
  notificationPreferences: {
    emailDigest: boolean;
    questionUpdates: boolean;
    communityMentions: boolean;
    eventReminders: boolean;
  };
}

export type ContentType =
  | 'article'
  | 'guide'
  | 'story'
  | 'video'
  | 'resource'
  | 'quote'
  | 'tiktok';

export type ContentStatus =
  | 'draft'
  | 'review'
  | 'scheduled'
  | 'published'
  | 'archived';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  articleCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  author: {
    name: string;
    avatarUrl: string;
    role: string;
  };
  contentType: ContentType;
  category: string; // e.g. 'motherhood', 'marriage', 'parenting', 'mental-wellness'
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  status: ContentStatus;
  publishedDate: string;
  updatedDate: string;
  featured: boolean;
  readingTimeMinutes: number;
  viewCount: number;
  shareCount: number;
  saveCount: number;
  videoUrl?: string;
  downloadUrl?: string;
}

export type QuestionStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'answered'
  | 'published'
  | 'rejected';

export interface Question {
  id: string;
  userId: string;
  authorName: string;
  isAnonymous: boolean;
  category: string;
  questionText: string;
  contextNotes?: string;
  publicConsent: boolean;
  status: QuestionStatus;
  submittedAt: string;
  moderatedAt?: string;
  response?: QuestionResponse;
}

export interface QuestionResponse {
  id: string;
  questionId: string;
  responderName: string;
  responderTitle: string;
  responderAvatar: string;
  responseText: string;
  keyTakeaways: string[];
  recommendedContentSlugs: string[];
  answeredAt: string;
  helpfulCount: number;
}

export interface CommunityGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  category?: string;
  memberCount: number;
  postCount: number;
  recentTopic?: string;
  icon: string;
  isJoined?: boolean;
}

export interface CommunityPost {
  id: string;
  groupId: string;
  groupName: string;
  authorName: string;
  authorAvatar: string;
  isAnonymous: boolean;
  title: string;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  areasOfSupport: string[];
  pricing: string;
  rating: number;
  reviewCount: number;
  sessionTypes: string[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  description: string;
  coverImage: string;
  thumbnail?: string;
  duration: string;
  moduleCount: number;
  lessonCount: number;
  lessonsCount?: number;
  category?: string;
  price?: string;
  enrolledCount?: number;
  isFree: boolean;
  progressPercent?: number;
  isEnrolled?: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  fileSize: string;
  downloadCount: number;
  downloadUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  speaker: string;
  date: string;
  time: string;
  timezone: string;
  type: 'webinar' | 'workshop' | 'live_session' | 'retreat';
  capacity: number;
  registeredCount: number;
  price: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
}

export interface AnalyticsMetric {
  totalUsers: number;
  activeWeeklyUsers: number;
  contentViewsTotal: number;
  questionsSubmittedTotal: number;
  questionsAnsweredTotal: number;
  savedArticlesTotal: number;
  communityPostsTotal: number;
  conversionFunnel: {
    socialVisitors: number;
    websiteReaders: number;
    registeredMembers: number;
    communityActive: number;
    askSubmitted: number;
    courseEnrolled: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  prompt: string;
  scriptureReference: string;
  reflectionText: string;
  gratitudeNote?: string;
  moodTag?: 'peaceful' | 'seeking' | 'grateful' | 'restless' | 'strengthened';
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  firstName?: string;
  interests?: string[];
  subscribedAt: string;
  status: 'active' | 'pending';
}

export type MilestoneCategory = 'reading_streak' | 'academy_modules' | 'daily_journaling' | 'community_fellowship';

export interface MilestoneBadge {
  id: string;
  title: string;
  category: MilestoneCategory;
  description: string;
  iconName: string;
  level: 'bronze' | 'silver' | 'gold';
  targetValue: number;
  currentValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rewardPoints: number;
}

export interface UserGrowthProfile {
  readingStreakDays: number;
  completedAcademyModules: number;
  consecutiveJournalDays: number;
  totalJournalReflections: number;
  totalArticlesRead: number;
  totalMilestonePoints: number;
  badges: MilestoneBadge[];
}

export interface MentorAssessmentAnswer {
  currentLifeSeason: string; // e.g. "motherhood", "purpose-transition", "marriage", "health-vitality"
  primarySpiritualGoal: string; // e.g. "deepening prayer", "overcoming overwhelm", "clarity in purpose", "healing"
  preferredMentorshipFormat: 'one-on-one' | 'small-group' | 'asynchronous' | 'self-paced';
  urgencyOrTimeline: string;
  notes?: string;
}

export interface MentorRecommendationResult {
  recommendedMentors: Mentor[];
  primaryPath: {
    title: string;
    description: string;
    recommendedCourseSlug?: string;
    stepGuide: string[];
  };
  tailoredEncouragement: string;
}

export interface DailyReflectionResult {
  affirmation: string;
  scriptureAnchor: string;
  lifeSeason: string;
  practicalAction: string;
  prayerThought: string;
  authorLabel: string;
  generatedAt: string;
}
