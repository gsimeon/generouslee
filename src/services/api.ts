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
  NewsletterSubscription,
  UserGrowthProfile,
  MentorAssessmentAnswer,
  MentorRecommendationResult,
  DailyReflectionResult
} from '../types';
import { mockFallback } from './mockFallback';

// Base URL for API calls. If VITE_API_URL is configured (e.g. deployed backend), use it.
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Detect GitHub Pages or static host without an active backend URL
const isStaticHost = typeof window !== 'undefined' &&
  (window.location.hostname.endsWith('github.io') || window.location.hostname.endsWith('surge.sh'));

async function callOrFallback<T>(
  endpoint: string,
  options?: RequestInit,
  fallback?: () => Promise<T>
): Promise<T> {
  // If hosted on GitHub Pages or static host and no custom backend API URL is configured yet:
  if (isStaticHost && !API_BASE && fallback) {
    return fallback();
  }

  try {
    const url = API_BASE ? `${API_BASE}${endpoint}` : endpoint;
    const res = await fetch(url, options);

    // If server returned 404 or HTML (common when static host intercepts API routes)
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      if (fallback) {
        return await fallback();
      }
      const text = await res.text();
      let errorMsg = `Request failed (${res.status})`;
      try {
        const json = JSON.parse(text);
        if (json.error?.message) errorMsg = json.error.message;
      } catch {
        // Not JSON
      }
      throw new Error(errorMsg);
    }

    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  } catch (err) {
    // If network error (e.g. backend offline or CORS), fallback gracefully
    if (fallback) {
      return fallback();
    }
    throw err;
  }
}

export const api = {
  // Auth & User
  async getMe(): Promise<User & { savedContentIds: string[] }> {
    return callOrFallback('/api/v1/users/me', undefined, () => mockFallback.getMe());
  },

  async login(email: string): Promise<User & { savedContentIds: string[] }> {
    return callOrFallback(
      '/api/v1/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      },
      () => mockFallback.login(email)
    );
  },

  async register(data: { name: string; email: string; interests?: string[] }): Promise<User> {
    return callOrFallback(
      '/api/v1/auth/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => mockFallback.register(data)
    );
  },

  async switchRole(role: UserRole): Promise<User & { savedContentIds: string[] }> {
    return callOrFallback(
      '/api/v1/auth/switch-role',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      },
      () => mockFallback.switchRole(role)
    );
  },

  async updateInterests(interests: string[]): Promise<User> {
    return callOrFallback(
      '/api/v1/users/me/interests',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests })
      },
      () => mockFallback.updateInterests(interests)
    );
  },

  // Content
  async getContent(params?: { category?: string; tag?: string; search?: string; status?: string; featured?: boolean }): Promise<ContentItem[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.tag) query.append('tag', params.tag);
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.featured) query.append('featured', 'true');

    return callOrFallback(`/api/v1/content?${query.toString()}`, undefined, () => mockFallback.getContent(params));
  },

  async getContentBySlug(slug: string): Promise<ContentItem> {
    return callOrFallback(`/api/v1/content/${slug}`, undefined, () => mockFallback.getContentBySlug(slug));
  },

  async toggleSaveContent(contentId: string): Promise<{ isSaved: boolean; savedContentIds: string[]; saveCount: number }> {
    return callOrFallback(
      `/api/v1/content/${contentId}/save`,
      { method: 'POST' },
      () => mockFallback.toggleSaveContent(contentId)
    );
  },

  async getCategories(): Promise<Category[]> {
    return callOrFallback('/api/v1/categories', undefined, () => mockFallback.getCategories());
  },

  async getTags(): Promise<Tag[]> {
    return callOrFallback('/api/v1/tags', undefined, () => mockFallback.getTags());
  },

  // Questions (Ask Generouslee)
  async getQuestions(params?: { category?: string; filter?: 'published' | 'mine' | 'all' }): Promise<Question[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.filter) query.append('filter', params.filter);

    return callOrFallback(`/api/v1/questions?${query.toString()}`, undefined, () => mockFallback.getQuestions(params));
  },

  async submitQuestion(payload: {
    questionText: string;
    contextNotes?: string;
    category: string;
    isAnonymous: boolean;
    publicConsent: boolean;
  }): Promise<Question> {
    return callOrFallback(
      '/api/v1/questions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      () => mockFallback.submitQuestion(payload)
    );
  },

  async respondToQuestion(questionId: string, payload: {
    responseText: string;
    keyTakeaways: string[];
    recommendedContentSlugs: string[];
    publish?: boolean;
  }): Promise<Question> {
    return callOrFallback(
      `/api/v1/questions/${questionId}/respond`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      () => mockFallback.respondToQuestion(questionId, payload)
    );
  },

  // Community
  async getCommunityGroups(): Promise<CommunityGroup[]> {
    return callOrFallback('/api/v1/community/groups', undefined, () => mockFallback.getCommunityGroups());
  },

  async getCommunityPosts(): Promise<CommunityPost[]> {
    return callOrFallback('/api/v1/community/posts', undefined, () => mockFallback.getCommunityPosts());
  },

  async createCommunityPost(data: { groupId: string; title: string; content: string; isAnonymous: boolean }): Promise<CommunityPost> {
    return callOrFallback(
      '/api/v1/community/posts',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => mockFallback.createCommunityPost(data)
    );
  },

  async reactToPost(postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    return callOrFallback(
      `/api/v1/community/posts/${postId}/react`,
      { method: 'POST' },
      () => mockFallback.reactToPost(postId)
    );
  },

  // Mentors, Courses, Events
  async getMentors(): Promise<Mentor[]> {
    return callOrFallback('/api/v1/mentors', undefined, () => mockFallback.getMentors());
  },

  async getCourses(): Promise<Course[]> {
    return callOrFallback('/api/v1/courses', undefined, () => mockFallback.getCourses());
  },

  async getEvents(): Promise<EventItem[]> {
    return callOrFallback('/api/v1/events', undefined, () => mockFallback.getEvents());
  },

  async getResources(): Promise<ResourceItem[]> {
    return callOrFallback('/api/v1/resources', undefined, () => mockFallback.getResources());
  },

  async registerForEvent(eventId: string): Promise<{ message: string }> {
    return callOrFallback(`/api/v1/events/${eventId}/register`, { method: 'POST' }, () => mockFallback.registerForEvent(eventId));
  },

  async enrollCourse(courseId: string): Promise<{ message: string; data: any }> {
    return callOrFallback(`/api/v1/courses/${courseId}/enroll`, { method: 'POST' }, () => mockFallback.enrollCourse(courseId));
  },

  async updateCourseProgress(courseId: string, progressPercent: number): Promise<{ success: boolean; data: any }> {
    return callOrFallback(
      `/api/v1/courses/${courseId}/progress`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progressPercent })
      },
      () => mockFallback.updateCourseProgress(courseId, progressPercent)
    );
  },

  // Daily Journal
  async getDailyJournalPrompt(): Promise<{ prompt: string; scriptureReference: string; theme: string }> {
    return callOrFallback('/api/v1/journal/today-prompt', undefined, () => mockFallback.getDailyJournalPrompt());
  },

  async getJournalEntries(): Promise<JournalEntry[]> {
    return callOrFallback('/api/v1/journal/entries', undefined, () => mockFallback.getJournalEntries());
  },

  async saveJournalEntry(entry: {
    prompt: string;
    scriptureReference: string;
    reflectionText: string;
    gratitudeNote?: string;
    moodTag?: string;
  }): Promise<JournalEntry> {
    return callOrFallback(
      '/api/v1/journal/entries',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      },
      () => mockFallback.saveJournalEntry(entry)
    );
  },

  async deleteJournalEntry(id: string): Promise<void> {
    return callOrFallback(`/api/v1/journal/entries/${id}`, { method: 'DELETE' }, () => mockFallback.deleteJournalEntry(id));
  },

  // Newsletter Subscription
  async subscribeNewsletter(payload: { email: string; firstName?: string; interests?: string[] }): Promise<{ success: boolean; message: string }> {
    return callOrFallback(
      '/api/v1/newsletter/subscribe',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      () => mockFallback.subscribeNewsletter(payload)
    );
  },

  // Admin
  async getAdminOverview(): Promise<{
    metrics: AnalyticsMetric;
    recentQuestions: Question[];
    recentPosts: CommunityPost[];
    recentLogs: AuditLog[];
    totalContent: number;
    totalUsers: number;
  }> {
    return callOrFallback('/api/v1/admin/overview', undefined, () => mockFallback.getAdminOverview());
  },

  async createContent(item: Partial<ContentItem>): Promise<ContentItem> {
    return callOrFallback(
      '/api/v1/admin/content',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      },
      () => mockFallback.createContent(item)
    );
  },

  async updateQuestionStatus(id: string, status: string): Promise<Question> {
    return callOrFallback(
      `/api/v1/admin/questions/${id}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      },
      () => mockFallback.updateQuestionStatus(id, status)
    );
  },

  async getAdminUsers(): Promise<User[]> {
    return callOrFallback('/api/v1/admin/users', undefined, () => mockFallback.getAdminUsers());
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    return callOrFallback('/api/v1/admin/audit-logs', undefined, () => mockFallback.getAuditLogs());
  },

  // Dynamic Personalized Recommendations
  async getPersonalizedRecommendations(): Promise<{
    recommendedArticles: (ContentItem & { matchReason?: string })[];
    recommendedDiscussions: (CommunityPost & { groupName?: string; groupIcon?: string; matchReason?: string })[];
    userInterestTags: string[];
    favoriteCount: number;
  }> {
    return callOrFallback('/api/v1/recommendations/personalized', undefined, () => mockFallback.getPersonalizedRecommendations());
  },

  // Growth Milestones & Badges
  async getGrowthMilestones(): Promise<UserGrowthProfile> {
    return callOrFallback('/api/v1/milestones/profile', undefined, () => mockFallback.getGrowthMilestones());
  },

  async logGrowthAction(actionType: 'read_article' | 'complete_module' | 'journal_entry'): Promise<{ success: boolean; message: string; data: UserGrowthProfile }> {
    return callOrFallback(
      '/api/v1/milestones/log-action',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType })
      },
      () => mockFallback.logGrowthAction(actionType)
    );
  },

  // Find Your Mentor Interactive Assessment
  async submitMentorAssessment(answers: MentorAssessmentAnswer): Promise<MentorRecommendationResult> {
    return callOrFallback(
      '/api/v1/mentors/assessment',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      },
      () => mockFallback.submitMentorAssessment(answers)
    );
  },

  // Gemini AI Reflection of the Day
  async getReflectionOfTheDay(lifeSeason?: string, userName?: string): Promise<DailyReflectionResult> {
    return callOrFallback(
      '/api/v1/ai/reflection-of-the-day',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lifeSeason, userName })
      },
      () => mockFallback.getReflectionOfTheDay(lifeSeason, userName)
    );
  }
};
