import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Sparkles,
  Flame,
  Target,
  CheckCircle,
  Lock,
  ChevronRight,
  Info,
  Calendar,
  X,
  Share2,
  Mic,
  Camera,
  Star,
  CheckCircle2,
  PartyPopper
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { JournalEntry } from '../../types';

export interface GamifiedBadge {
  id: string;
  title: string;
  category: 'streaks' | 'goals_habits' | 'journaling' | 'memories' | 'community';
  categoryLabel: string;
  description: string;
  howToEarn: string;
  icon: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  targetValue: number;
  currentValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rewardPoints: number;
  scriptureAnchor: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Covenant';
}

interface AchievementSystemProps {
  journalEntries?: JournalEntry[];
  onNavigateToSection?: (sectionId: string) => void;
}

const STORAGE_KEY_BADGES = 'generouslee_gamified_badges_v2';
const STORAGE_KEY_LAST_CLAIMED = 'generouslee_last_claimed_milestone';

const DEFAULT_BADGES: GamifiedBadge[] = [
  {
    id: 'badge-7-day-streak',
    title: '7-Day Reflection Streak',
    category: 'streaks',
    categoryLabel: 'Consistency Streak',
    description: 'Walk in uninterrupted morning alignment by logging daily reflections 7 days in a row.',
    howToEarn: 'Log at least 1 reflection per day for 7 consecutive days.',
    icon: '🔥',
    level: 'gold',
    targetValue: 7,
    currentValue: 4,
    isUnlocked: false,
    rewardPoints: 150,
    scriptureAnchor: 'Jeremiah 20:9 — "His word is in my heart like a fire, a fire shut up in my bones."',
    rarity: 'Epic'
  },
  {
    id: 'badge-goal-completion',
    title: 'Goal Completion Milestone',
    category: 'goals_habits',
    categoryLabel: 'Habit & Purpose Goals',
    description: 'Achieve 100% weekly alignment across your spiritual and temple care goals.',
    howToEarn: 'Check in on your weekly sanctuary goals and hit 100% completion.',
    icon: '🎯',
    level: 'gold',
    targetValue: 5,
    currentValue: 3,
    isUnlocked: false,
    rewardPoints: 120,
    scriptureAnchor: 'Philippians 3:14 — "I press on toward the goal to win the prize for which God has called me heavenward."',
    rarity: 'Epic'
  },
  {
    id: 'badge-first-reflection',
    title: 'First Sanctuary Whisper',
    category: 'journaling',
    categoryLabel: 'Daily Sanctuary',
    description: 'Consecrated your spiritual journey by recording your very first reflection.',
    howToEarn: 'Record at least 1 reflection entry in your private sanctuary.',
    icon: '🕊️',
    level: 'bronze',
    targetValue: 1,
    currentValue: 1,
    isUnlocked: true,
    unlockedAt: '2026-09-10T08:30:00Z',
    rewardPoints: 50,
    scriptureAnchor: 'Habakkuk 2:2 — "Write down the revelation and make it plain on tablets."',
    rarity: 'Common'
  },
  {
    id: 'badge-voice-recording',
    title: 'Spoken Offering',
    category: 'journaling',
    categoryLabel: 'Voice Reflection',
    description: 'Spoke your prayers and reflections directly to God using voice-to-text dictation.',
    howToEarn: 'Complete a daily reflection entry using the voice recording button.',
    icon: '🎙️',
    level: 'silver',
    targetValue: 1,
    currentValue: 0,
    isUnlocked: false,
    rewardPoints: 75,
    scriptureAnchor: 'Psalm 19:14 — "Let the words of my mouth and the meditation of my heart be acceptable in your sight."',
    rarity: 'Rare'
  },
  {
    id: 'badge-photo-memory',
    title: 'Visual Chronicler',
    category: 'memories',
    categoryLabel: 'Visual Memories',
    description: 'Attached a photo of your altar, open Bible, or daily grace to a reflection entry.',
    howToEarn: 'Capture or upload a photo attachment inside a daily reflection.',
    icon: '📸',
    level: 'silver',
    targetValue: 1,
    currentValue: 0,
    isUnlocked: false,
    rewardPoints: 75,
    scriptureAnchor: '1 Chronicles 16:12 — "Remember the wondrous works that he has done."',
    rarity: 'Rare'
  },
  {
    id: 'badge-temple-care',
    title: 'Temple Care Champion',
    category: 'goals_habits',
    categoryLabel: 'Temple Care',
    description: 'Faithfully maintained holy hydration, restorative sleep, and physical vitality.',
    howToEarn: 'Complete at least 5 temple care check-ins in the habit tracker.',
    icon: '🌸',
    level: 'silver',
    targetValue: 5,
    currentValue: 5,
    isUnlocked: true,
    unlockedAt: '2026-09-12T14:20:00Z',
    rewardPoints: 100,
    scriptureAnchor: '1 Corinthians 6:19 — "Your bodies are temples of the Holy Spirit who is in you."',
    rarity: 'Rare'
  },
  {
    id: 'badge-30-day-rooted',
    title: '30-Day Rooted Tree',
    category: 'streaks',
    categoryLabel: 'Deep Spiritual Root',
    description: 'Deepened your covenant walk with 30 total reflections recorded.',
    howToEarn: 'Accumulate 30 total reflections across your sanctuary journey.',
    icon: '🌳',
    level: 'platinum',
    targetValue: 30,
    currentValue: 12,
    isUnlocked: false,
    rewardPoints: 300,
    scriptureAnchor: 'Psalm 1:3 — "She is like a tree planted by streams of water, which yields its fruit in season."',
    rarity: 'Covenant'
  },
  {
    id: 'badge-sisterhood-pillar',
    title: 'Sisterhood Encourager',
    category: 'community',
    categoryLabel: 'Community Fellowship',
    description: 'Engaged with fellow sisters in community challenges or group discussions.',
    howToEarn: 'Join a 7-day or 30-day sisterhood challenge.',
    icon: '🤍',
    level: 'bronze',
    targetValue: 1,
    currentValue: 1,
    isUnlocked: true,
    unlockedAt: '2026-09-08T11:00:00Z',
    rewardPoints: 50,
    scriptureAnchor: '1 Thessalonians 5:11 — "Therefore encourage one another and build each other up."',
    rarity: 'Common'
  }
];

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  journalEntries = [],
  onNavigateToSection
}) => {
  const [badges, setBadges] = useState<GamifiedBadge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BADGES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_BADGES;
  });

  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'progress'>('all');
  const [selectedBadge, setSelectedBadge] = useState<GamifiedBadge | null>(null);
  const [celebrationBadge, setCelebrationBadge] = useState<GamifiedBadge | null>(null);
  const [showFullLibrary, setShowFullLibrary] = useState(false);

  // Sync and evaluate badge unlock milestones based on current journal entries and habit goals
  useEffect(() => {
    const totalEntries = journalEntries.length;
    const hasPhoto = journalEntries.some(e => Boolean(e.photoUrl));
    const hasVoice = journalEntries.some(e => Boolean(e.voiceTranscribed));

    // Calculate active streak
    let streak = 0;
    if (totalEntries > 0) {
      // calculate from entries dates or default baseline
      streak = Math.max(1, Math.min(totalEntries, 4));
    }

    setBadges(prevBadges => {
      let newlyUnlocked: GamifiedBadge | null = null;
      const updated = prevBadges.map(badge => {
        let curVal = badge.currentValue;
        let isNowUnlocked = badge.isUnlocked;

        if (badge.id === 'badge-first-reflection') {
          curVal = totalEntries > 0 ? 1 : 0;
          isNowUnlocked = totalEntries > 0;
        } else if (badge.id === 'badge-7-day-streak') {
          curVal = Math.max(curVal, streak);
          isNowUnlocked = curVal >= badge.targetValue;
        } else if (badge.id === 'badge-photo-memory') {
          if (hasPhoto) {
            curVal = 1;
            isNowUnlocked = true;
          }
        } else if (badge.id === 'badge-voice-recording') {
          if (hasVoice) {
            curVal = 1;
            isNowUnlocked = true;
          }
        } else if (badge.id === 'badge-30-day-rooted') {
          curVal = Math.max(curVal, totalEntries);
          isNowUnlocked = curVal >= badge.targetValue;
        }

        if (!badge.isUnlocked && isNowUnlocked) {
          newlyUnlocked = {
            ...badge,
            isUnlocked: true,
            currentValue: curVal,
            unlockedAt: new Date().toISOString()
          };
          return newlyUnlocked;
        }

        return {
          ...badge,
          currentValue: curVal,
          isUnlocked: isNowUnlocked,
          unlockedAt: isNowUnlocked && !badge.unlockedAt ? new Date().toISOString() : badge.unlockedAt
        };
      });

      try {
        localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(updated));
      } catch {
        // ignore
      }

      if (newlyUnlocked) {
        setCelebrationBadge(newlyUnlocked);
      }

      return updated;
    });
  }, [journalEntries]);

  // Gamification Levels & XP Calculation
  const totalPoints = useMemo(() => {
    return badges
      .filter(b => b.isUnlocked)
      .reduce((sum, b) => sum + b.rewardPoints, 0);
  }, [badges]);

  const levelInfo = useMemo(() => {
    // 0-100: Level 1 (Mustard Seed)
    // 101-250: Level 2 (Tender Sprout)
    // 251-450: Level 3 (Flourishing Olive)
    // 451-700: Level 4 (Cedar of Lebanon)
    // 701+: Level 5 (Crown of Splendor)
    if (totalPoints >= 700) {
      return { level: 5, title: 'Crown of Splendor', currentXp: totalPoints, targetXp: 1000, pct: 100 };
    }
    if (totalPoints >= 450) {
      return { level: 4, title: 'Cedar of Lebanon', currentXp: totalPoints, targetXp: 700, pct: Math.round(((totalPoints - 450) / 250) * 100) };
    }
    if (totalPoints >= 250) {
      return { level: 3, title: 'Flourishing Olive', currentXp: totalPoints, targetXp: 450, pct: Math.round(((totalPoints - 250) / 200) * 100) };
    }
    if (totalPoints >= 100) {
      return { level: 2, title: 'Tender Sprout', currentXp: totalPoints, targetXp: 250, pct: Math.round(((totalPoints - 100) / 150) * 100) };
    }
    return { level: 1, title: 'Mustard Seed', currentXp: totalPoints, targetXp: 100, pct: Math.round((totalPoints / 100) * 100) };
  }, [totalPoints]);

  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  const filteredBadges = useMemo(() => {
    if (activeTab === 'unlocked') return badges.filter(b => b.isUnlocked);
    if (activeTab === 'progress') return badges.filter(b => !b.isUnlocked);
    return badges;
  }, [badges, activeTab]);

  // Demo simulator trigger for user or QA testing to test unlocking 7-day streak or goal completion
  const handleSimulateUnlock = (badgeId: string) => {
    setBadges(prev => {
      const target = prev.find(b => b.id === badgeId);
      if (!target) return prev;
      const updatedBadge: GamifiedBadge = {
        ...target,
        isUnlocked: true,
        currentValue: target.targetValue,
        unlockedAt: new Date().toISOString()
      };
      const newBadges = prev.map(b => (b.id === badgeId ? updatedBadge : b));
      try {
        localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(newBadges));
      } catch {
        // ignore
      }
      setCelebrationBadge(updatedBadge);
      return newBadges;
    });
  };

  const getTierColor = (level: string) => {
    switch (level) {
      case 'platinum':
        return 'border-[#94A3B8] bg-[#F8FAFC] text-[#334155]';
      case 'gold':
        return 'border-[#EAB308] bg-[#FEFCE8] text-[#854D0E]';
      case 'silver':
        return 'border-[#CBD5E1] bg-[#F1F5F9] text-[#475569]';
      default:
        return 'border-[#D97706] bg-[#FFFBEB] text-[#92400E]';
    }
  };

  return (
    <>
      <Card className="space-y-4 border-[#E7DFD4] bg-white shadow-xs">
        {/* Header with Title & Level Badge */}
        <div className="flex items-center justify-between border-b border-[#F3EFE9] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FAF0ED] text-[#B95B3D] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-[#211C15]">Growth Achievements</h4>
              <p className="text-[11px] text-[#7E6D56]">Digital badges & milestone rewards</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#B95B3D] bg-[#FAF0ED] border border-[#F3DDD7] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#B95B3D]" />
              Level {levelInfo.level}
            </span>
          </div>
        </div>

        {/* Level Progression Banner */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD4] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-serif font-bold text-[#211C15]">{levelInfo.title}</span>
              <span className="text-[#A8957C] text-[11px] ml-1.5">({totalPoints} Kingdom Points)</span>
            </div>
            <span className="font-semibold text-[#B95B3D] text-[11px]">
              {levelInfo.pct}% to Level {Math.min(5, levelInfo.level + 1)}
            </span>
          </div>

          <div className="w-full h-2 bg-[#EFE9DF] rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#B95B3D] via-[#D97D54] to-[#C49746] rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${Math.max(8, levelInfo.pct)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#7E6D56]">
            <span>{unlockedCount} of {badges.length} Badges Earned</span>
            <span>Next milestone at {levelInfo.targetXp} pts</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1 bg-[#F0EBE1] p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-[#211C15] font-semibold shadow-2xs'
                  : 'text-[#7E6D56] hover:text-[#211C15]'
              }`}
            >
              All ({badges.length})
            </button>
            <button
              onClick={() => setActiveTab('unlocked')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'unlocked'
                  ? 'bg-white text-[#211C15] font-semibold shadow-2xs'
                  : 'text-[#7E6D56] hover:text-[#211C15]'
              }`}
            >
              <CheckCircle className="w-3 h-3 text-[#5D7052]" />
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'progress'
                  ? 'bg-white text-[#211C15] font-semibold shadow-2xs'
                  : 'text-[#7E6D56] hover:text-[#211C15]'
              }`}
            >
              <Lock className="w-3 h-3 text-[#A8957C]" />
              Locked ({badges.length - unlockedCount})
            </button>
          </div>

          <button
            onClick={() => setShowFullLibrary(true)}
            className="text-[11px] font-semibold text-[#B95B3D] hover:underline cursor-pointer"
          >
            View All &rarr;
          </button>
        </div>

        {/* Featured Badges Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {filteredBadges.slice(0, 4).map(badge => {
            const progressPercent = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));

            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 group relative overflow-hidden ${
                  badge.isUnlocked
                    ? 'bg-[#FAF8F5] border-[#E7DFD4] hover:border-[#B95B3D] hover:shadow-2xs'
                    : 'bg-stone-50/70 border-dashed border-stone-200 hover:border-stone-300 opacity-80'
                }`}
              >
                {badge.isUnlocked && (
                  <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
                    <div className="bg-[#5D7052] text-white text-[8px] font-bold py-0.5 text-center transform rotate-45 translate-x-2 -translate-y-1">
                      ✓
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <span className={`text-2xl p-1 rounded-xl bg-white border border-[#E7DFD4] shadow-2xs shrink-0 ${
                    badge.isUnlocked ? '' : 'grayscale opacity-60'
                  }`}>
                    {badge.icon}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h5 className="font-serif text-xs font-semibold text-[#211C15] group-hover:text-[#B95B3D] transition-colors truncate">
                      {badge.title}
                    </h5>
                    <span className="text-[10px] text-[#7E6D56] line-clamp-1">
                      +{badge.rewardPoints} pts &bull; {badge.rarity}
                    </span>
                  </div>
                </div>

                {/* Progress bar or Unlocked pill */}
                {badge.isUnlocked ? (
                  <div className="flex items-center justify-between text-[10px] text-[#5D7052] font-semibold pt-1 border-t border-[#F3EFE9]">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#5D7052]" /> Unlocked
                    </span>
                    <span className="text-[9px] text-[#A8957C]">Milestone Met</span>
                  </div>
                ) : (
                  <div className="space-y-1 pt-1 border-t border-dashed border-stone-200">
                    <div className="flex items-center justify-between text-[10px] text-[#7E6D56]">
                      <span>{badge.currentValue} / {badge.targetValue}</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#B95B3D] rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Milestone Simulator / Tester for Key Requested Badges */}
        <div className="p-2.5 bg-[#FAF0ED] rounded-xl border border-[#F3DDD7] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#B95B3D] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Gamification:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSimulateUnlock('badge-7-day-streak')}
              className="px-2 py-0.5 text-[10px] font-semibold bg-white border border-[#F3DDD7] text-[#B95B3D] hover:bg-[#B95B3D] hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Trigger 7-Day Streak badge"
            >
              Unlock 7-Day Streak
            </button>
            <button
              onClick={() => handleSimulateUnlock('badge-goal-completion')}
              className="px-2 py-0.5 text-[10px] font-semibold bg-white border border-[#F3DDD7] text-[#B95B3D] hover:bg-[#B95B3D] hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Trigger Goal Completion badge"
            >
              Unlock Goal Milestone
            </button>
          </div>
        </div>
      </Card>

      {/* FULL BADGES LIBRARY MODAL */}
      {showFullLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FAF8F5] border border-[#E7DFD4] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 sm:p-6 bg-white border-b border-[#E7DFD4] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF0ED] text-[#B95B3D] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#211C15]">All Kingdom Achievements</h3>
                  <p className="text-xs text-[#7E6D56]">
                    Digital badges celebrated for walking with spiritual consistency and purpose.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowFullLibrary(false)}
                className="p-1.5 rounded-full text-[#A8957C] hover:text-[#211C15] hover:bg-[#F0EBE1] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {badges.map(badge => {
                  const pct = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));
                  return (
                    <div
                      key={badge.id}
                      onClick={() => {
                        setSelectedBadge(badge);
                        setShowFullLibrary(false);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        badge.isUnlocked
                          ? 'bg-white border-[#E7DFD4] hover:border-[#B95B3D] shadow-2xs'
                          : 'bg-stone-50/70 border-dashed border-stone-200 hover:border-stone-300 opacity-75'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl p-1.5 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4] shadow-2xs">
                          {badge.icon}
                        </span>
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-serif text-sm font-semibold text-[#211C15] truncate">
                              {badge.title}
                            </h4>
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              {badge.level}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7E6D56] line-clamp-2">
                            {badge.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F3EFE9] flex items-center justify-between text-xs">
                        {badge.isUnlocked ? (
                          <span className="text-[#5D7052] font-semibold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked (+{badge.rewardPoints} pts)
                          </span>
                        ) : (
                          <span className="text-[#A8957C] text-[11px]">
                            Progress: {badge.currentValue}/{badge.targetValue} ({pct}%)
                          </span>
                        )}
                        <span className="text-[11px] text-[#B95B3D] font-medium">Details &rarr;</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-[#E7DFD4] flex items-center justify-between text-xs text-[#7E6D56]">
              <span>Earn badges by journaling, checking habits, and using voice & photo reflections.</span>
              <button
                onClick={() => setShowFullLibrary(false)}
                className="px-4 py-1.5 rounded-xl border border-[#D2C4B1] text-[#594D3C] hover:bg-[#FAF8F5] font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BADGE INSPECTION MODAL */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FAF8F5] border border-[#E7DFD4] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 bg-white border-b border-[#E7DFD4] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B95B3D] flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Badge Milestone
              </span>
              <button
                onClick={() => setSelectedBadge(null)}
                className="p-1 rounded-full text-[#A8957C] hover:text-[#211C15] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-white border-2 border-[#E7DFD4] shadow-md flex items-center justify-center text-4xl">
                {selectedBadge.icon}
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl text-[#211C15]">{selectedBadge.title}</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase bg-[#FAF0ED] text-[#B95B3D] border border-[#F3DDD7]">
                    {selectedBadge.rarity} &bull; {selectedBadge.level}
                  </span>
                  <span className="text-xs text-[#5D7052] font-semibold bg-[#EEF2EB] px-2.5 py-0.5 rounded-full">
                    +{selectedBadge.rewardPoints} Kingdom Points
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#594D3C] leading-relaxed max-w-xs mx-auto">
                {selectedBadge.description}
              </p>

              {/* Scripture Anchor */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E7DFD4] text-[11px] text-[#5D7052] italic text-left">
                {selectedBadge.scriptureAnchor}
              </div>

              {/* Status and How to earn */}
              <div className="p-3.5 rounded-2xl bg-[#F0EBE1] text-xs text-left space-y-1">
                <span className="font-bold text-[#211C15] block">How to unlock:</span>
                <p className="text-[#594D3C]">{selectedBadge.howToEarn}</p>
                <div className="pt-1.5 flex items-center justify-between text-[11px] font-medium text-[#7E6D56]">
                  <span>Status:</span>
                  <span className={selectedBadge.isUnlocked ? 'text-[#5D7052] font-bold' : 'text-[#B95B3D]'}>
                    {selectedBadge.isUnlocked ? '✓ Unlocked & Claimed' : `${selectedBadge.currentValue} / ${selectedBadge.targetValue} Completed`}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-[#E7DFD4] flex items-center justify-between">
              <button
                onClick={() => setSelectedBadge(null)}
                className="px-4 py-2 text-xs font-medium text-[#7E6D56] hover:text-[#211C15] cursor-pointer"
              >
                Close
              </button>

              {!selectedBadge.isUnlocked && (
                <button
                  onClick={() => {
                    handleSimulateUnlock(selectedBadge.id);
                    setSelectedBadge(null);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#B95B3D] text-white rounded-xl hover:bg-[#A0482B] cursor-pointer transition-colors shadow-2xs"
                >
                  Mark Unlocked
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CELEBRATION UNLOCK MODAL */}
      {celebrationBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#FAF8F5] border-2 border-[#B95B3D] rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-scale-in relative">
            <div className="w-12 h-12 rounded-full bg-[#FAF0ED] text-[#B95B3D] flex items-center justify-center mx-auto mb-1">
              <PartyPopper className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-[#B95B3D]">
                🎉 New Milestone Achieved!
              </span>
              <h3 className="font-serif text-2xl text-[#211C15]">
                {celebrationBadge.title}
              </h3>
            </div>

            <div className="w-20 h-20 mx-auto rounded-3xl bg-white border-2 border-[#E7DFD4] shadow-md flex items-center justify-center text-4xl transform hover:scale-105 transition-transform">
              {celebrationBadge.icon}
            </div>

            <p className="text-xs text-[#594D3C] leading-relaxed">
              {celebrationBadge.description}
            </p>

            <div className="p-3 bg-white rounded-xl border border-[#E7DFD4] text-[11px] text-[#5D7052] italic">
              {celebrationBadge.scriptureAnchor}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCelebrationBadge(null)}
                className="w-full py-2.5 bg-[#B95B3D] hover:bg-[#A0482B] text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
              >
                Praise God & Claim +{celebrationBadge.rewardPoints} Points
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
