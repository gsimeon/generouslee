import { ContentItem } from '../types';

export interface RecentlyReadItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTimeMinutes: number;
  coverImage: string;
  readAt: string;
  progressPercent: number;
}

const STORAGE_KEY = 'generouslee_recently_read';

const DEFAULT_RECENTLY_READ: RecentlyReadItem[] = [
  {
    id: 'cnt-1',
    slug: 'divine-rhythms-for-weary-mothers',
    title: 'Divine Rhythms for the Weary Mother: Reclaiming Stillness Amid Chaos',
    excerpt: 'Practical biblical frameworks and nervous system regulation practices for christian mothers feeling stretched thin.',
    category: 'motherhood',
    readingTimeMinutes: 6,
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
    readAt: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
    progressPercent: 75
  },
  {
    id: 'cnt-2',
    slug: 'honoring-the-body-as-a-temple',
    title: 'Honoring Your Body as a Holy Temple: Breaking Free from Burnout and Diet Culture',
    excerpt: 'Realigning physical wellness with biblical wholeness rather than worldly guilt and exhausting restriction.',
    category: 'healthy-living',
    readingTimeMinutes: 8,
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000',
    readAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    progressPercent: 40
  }
];

export function getRecentlyRead(): RecentlyReadItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed default items so the UI looks active and engaging
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RECENTLY_READ));
      return DEFAULT_RECENTLY_READ;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_RECENTLY_READ;
  } catch {
    return DEFAULT_RECENTLY_READ;
  }
}

export function addRecentlyRead(item: ContentItem, progressPercent: number = 85): void {
  try {
    const current = getRecentlyRead();
    const filtered = current.filter(i => i.id !== item.id && i.slug !== item.slug);

    const newItem: RecentlyReadItem = {
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
      readingTimeMinutes: item.readingTimeMinutes,
      coverImage: item.coverImage,
      readAt: new Date().toISOString(),
      progressPercent
    };

    const updated = [newItem, ...filtered].slice(0, 6);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update recently read', err);
  }
}

export function clearRecentlyRead(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
