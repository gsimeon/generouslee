import { JournalEntry } from '../types';

export interface DayCompletionRecord {
  date: string; // YYYY-MM-DD
  habitsCompleted: string[]; // Habit titles or IDs
  reflectionCompleted: boolean;
  reflectionSnippet?: string;
  gratitudeSnippet?: string;
  gratitudeNote?: string;
  mood?: string;
}

const STORAGE_KEY = 'generouslee_monthly_completions';

// Realistic seeded completions for September 2026 leading up to Sept 17
const DEFAULT_COMPLETIONS: Record<string, DayCompletionRecord> = {
  '2026-09-01': {
    date: '2026-09-01',
    habitsCompleted: ['Daily Scripture Meditation', 'Nervous System Reset'],
    reflectionCompleted: true,
    reflectionSnippet: 'Surrendering the start of the month to Christ. Grateful for fresh grace.',
    gratitudeSnippet: 'Quiet morning coffee before children woke.',
    mood: 'peaceful'
  },
  '2026-09-02': {
    date: '2026-09-02',
    habitsCompleted: ['Daily Scripture Meditation', 'Module Reading or Guide'],
    reflectionCompleted: false
  },
  '2026-09-03': {
    date: '2026-09-03',
    habitsCompleted: ['Daily Scripture Meditation', 'Nervous System Reset', 'Encouragement Offering'],
    reflectionCompleted: true,
    reflectionSnippet: 'Choosing gentle words during homework time with the little ones.',
    gratitudeSnippet: 'A sweet afternoon rain shower.',
    mood: 'grateful'
  },
  '2026-09-05': {
    date: '2026-09-05',
    habitsCompleted: ['Nervous System Reset', 'Encouragement Offering'],
    reflectionCompleted: false
  },
  '2026-09-07': {
    date: '2026-09-07',
    habitsCompleted: ['Daily Scripture Meditation', 'Module Reading or Guide'],
    reflectionCompleted: true,
    reflectionSnippet: 'Studied biblical boundaries in marriage. Feeling convicted and renewed.',
    gratitudeSnippet: 'Honest conversation with my sister.',
    mood: 'seeking'
  },
  '2026-09-08': {
    date: '2026-09-08',
    habitsCompleted: ['Daily Scripture Meditation', 'Nervous System Reset', 'Module Reading or Guide'],
    reflectionCompleted: false
  },
  '2026-09-10': {
    date: '2026-09-10',
    habitsCompleted: ['Daily Scripture Meditation', 'Encouragement Offering'],
    reflectionCompleted: true,
    reflectionSnippet: 'Prayed over our family finances and laid down worry at Jesus feet.',
    gratitudeSnippet: 'An unexpected encouraging note in the mailbox.',
    mood: 'strengthened'
  },
  '2026-09-11': {
    date: '2026-09-11',
    habitsCompleted: ['Daily Scripture Meditation', 'Nervous System Reset'],
    reflectionCompleted: true,
    reflectionSnippet: 'Took 15 minutes of Sabbath rest in the afternoon.',
    gratitudeSnippet: 'Clean sheets and afternoon sunshine.',
    mood: 'peaceful'
  },
  '2026-09-12': {
    date: '2026-09-12',
    habitsCompleted: ['Daily Scripture Meditation', 'Nervous System Reset', 'Encouragement Offering'],
    reflectionCompleted: false
  },
  '2026-09-13': {
    date: '2026-09-13',
    habitsCompleted: ['Daily Scripture Meditation', 'Nervous System Reset', 'Module Reading or Guide'],
    reflectionCompleted: true,
    reflectionSnippet: 'I stepped into the hallway, put both hands over my heart, and took five slow breaths.',
    gratitudeNote: 'Grateful for cold water, a husband who cooked dinner, and quiet night.',
    mood: 'peaceful'
  },
  '2026-09-14': {
    date: '2026-09-14',
    habitsCompleted: ['Daily Scripture Meditation'],
    reflectionCompleted: true,
    reflectionSnippet: 'Morning Psalm 23 reading: The Lord is my shepherd, I lack nothing.',
    gratitudeSnippet: 'Health in our home today.',
    mood: 'grateful'
  },
  '2026-09-15': {
    date: '2026-09-15',
    habitsCompleted: ['Daily Scripture Meditation', 'Nervous System Reset', 'Module Reading or Guide', 'Encouragement Offering'],
    reflectionCompleted: true,
    reflectionSnippet: 'Full alignment day. Completed all modules and spoke grace to my family.',
    gratitudeSnippet: 'Deep restful sleep and energy for the day.',
    mood: 'strengthened'
  },
  '2026-09-16': {
    date: '2026-09-16',
    habitsCompleted: ['Daily Scripture Meditation', 'Nervous System Reset'],
    reflectionCompleted: false
  },
  '2026-09-17': {
    date: '2026-09-17',
    habitsCompleted: ['Daily Scripture Meditation', 'Encouragement Offering'],
    reflectionCompleted: true,
    reflectionSnippet: 'Logged daily gratitude: God’s steadfast lovingkindness.',
    gratitudeSnippet: 'Warm tea and stillness.',
    mood: 'grateful'
  }
};

export function getMonthCompletions(): Record<string, DayCompletionRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COMPLETIONS));
      return DEFAULT_COMPLETIONS;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : DEFAULT_COMPLETIONS;
  } catch {
    return DEFAULT_COMPLETIONS;
  }
}

export function saveDayHabitCompletion(dateStr: string, habitTitle: string, isCompleted: boolean): void {
  try {
    const records = getMonthCompletions();
    const existing = records[dateStr] || {
      date: dateStr,
      habitsCompleted: [],
      reflectionCompleted: false
    };

    let updatedHabits = [...existing.habitsCompleted];
    if (isCompleted) {
      if (!updatedHabits.includes(habitTitle)) {
        updatedHabits.push(habitTitle);
      }
    } else {
      updatedHabits = updatedHabits.filter(h => h !== habitTitle);
    }

    records[dateStr] = {
      ...existing,
      habitsCompleted: updatedHabits
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save habit completion', err);
  }
}

export function syncReflectionToCalendar(entry: JournalEntry): void {
  try {
    const records = getMonthCompletions();
    const dateStr = entry.date || new Date().toISOString().split('T')[0];
    const existing = records[dateStr] || {
      date: dateStr,
      habitsCompleted: [],
      reflectionCompleted: false
    };

    records[dateStr] = {
      ...existing,
      reflectionCompleted: true,
      reflectionSnippet: entry.reflectionText.slice(0, 140),
      gratitudeSnippet: entry.gratitudeNote,
      mood: entry.moodTag
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to sync reflection to calendar', err);
  }
}

export function syncAllJournalEntriesToCalendar(entries: JournalEntry[]): void {
  try {
    const records = getMonthCompletions();
    let changed = false;

    entries.forEach(entry => {
      const dateStr = entry.date;
      if (!dateStr) return;

      const existing = records[dateStr] || {
        date: dateStr,
        habitsCompleted: [],
        reflectionCompleted: false
      };

      if (!existing.reflectionCompleted) {
        records[dateStr] = {
          ...existing,
          reflectionCompleted: true,
          reflectionSnippet: entry.reflectionText.slice(0, 140),
          gratitudeSnippet: entry.gratitudeNote,
          mood: entry.moodTag
        };
        changed = true;
      }
    });

    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  } catch (err) {
    console.error('Failed to sync journal entries to calendar', err);
  }
}
