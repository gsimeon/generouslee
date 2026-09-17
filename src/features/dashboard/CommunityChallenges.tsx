import React, { useState, useEffect } from 'react';
import {
  Users,
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  ArrowRight,
  ShieldCheck,
  Heart,
  BookOpen,
  Sun,
  Award,
  ChevronRight,
  Clock,
  MessageCircle,
  X
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { CommunityChallenge } from '../../types';
import { playGoalCelebrationChime } from '../../utils/audioChime';

const STORAGE_KEY = 'generouslee_community_challenges';

const INITIAL_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'challenge-gratitude-30',
    title: 'Gratitude Month: The Thanksgiving Offering',
    durationDays: 30,
    category: 'Spiritual Formation',
    badgeIcon: '🌾',
    description: 'Cultivate unshakeable gratitude across 30 days of scripture anchors, morning thanks, and evening praise to shift your perspective into kingdom peace.',
    scriptureAnchor: '“Give thanks in all circumstances; for this is the will of God in Christ Jesus for you.” — 1 Thessalonians 5:18',
    participantsCount: 1842,
    currentDayPrompt: 'Day 12: Name three quiet, unseen mercies God provided this week that you did not ask for.',
    isJoined: true,
    currentDay: 12,
    completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    lastCheckInDate: '2026-09-17',
    recentSisterActivity: 'Sister Danielle from Atlanta completed Day 12 &middot; 4m ago'
  },
  {
    id: 'challenge-prayer-7',
    title: '7-Day Deep Prayer & Contemplative Focus',
    durationDays: 7,
    category: 'Devotional Intimacy',
    badgeIcon: '🕊️',
    description: 'A 7-day immersion moving beyond hurried checklists into breath prayers, unhurried stillness, and intercessory covering for your household.',
    scriptureAnchor: '“Be still, and know that I am God. I will be exalted among the nations.” — Psalm 46:10',
    participantsCount: 954,
    currentDayPrompt: 'Day 4: Breath Prayer in Silence — Sit in 7 minutes of wordless stillness before releasing any petitions.',
    isJoined: true,
    currentDay: 4,
    completedDays: [1, 2, 3, 4],
    lastCheckInDate: '2026-09-17',
    recentSisterActivity: 'Sister Chloe from Dallas: “This silence completely calmed my nervous system.” &middot; 12m ago'
  },
  {
    id: 'challenge-temple-14',
    title: '14-Day Temple Care & Sabbath Walking',
    durationDays: 14,
    category: 'Nervous System & Rest',
    badgeIcon: '🌿',
    description: 'Reclaim your body as the sacred temple of the Holy Spirit. Integrate cellular hydration, nervous system down-regulation, and holy Sabbath walks.',
    scriptureAnchor: '“Do you not know that your bodies are temples of the Holy Spirit, who is in you?” — 1 Corinthians 6:19',
    participantsCount: 1210,
    currentDayPrompt: 'Day 7: The Holy Walk — Take a 20-minute unhurried walk in creation with no podcast or phone distractions.',
    isJoined: false,
    currentDay: 1,
    completedDays: [],
    recentSisterActivity: 'Sister Maria from Charlotte joined &middot; 18m ago'
  },
  {
    id: 'challenge-covenant-speech-30',
    title: '30-Day Words of Life (Covenant Speech)',
    durationDays: 30,
    category: 'Marriage & Family',
    badgeIcon: '🍯',
    description: 'Transform the emotional and spiritual atmosphere of your home by speaking words of life, blessing, encouragement, and slow patience.',
    scriptureAnchor: '“Gracious words are a honeycomb, sweet to the soul and healing to the bones.” — Proverbs 16:24',
    participantsCount: 780,
    currentDayPrompt: 'Day 1: Speak an intentional, specific blessing over someone before bedtime without critique.',
    isJoined: false,
    currentDay: 1,
    completedDays: [],
    recentSisterActivity: 'Sister Faith from Houston joined &middot; 1h ago'
  }
];

export const CommunityChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState<CommunityChallenge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
    } catch {
      return INITIAL_CHALLENGES;
    }
  });

  const [activeTab, setActiveTab] = useState<'all' | 'joined' | '7day' | '30day'>('joined');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [celebratingChallengeId, setCelebratingChallengeId] = useState<string | null>(null);
  const [selectedChallengeDetails, setSelectedChallengeDetails] = useState<CommunityChallenge | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
    } catch {
      // Ignore
    }
  }, [challenges]);

  const handleJoinChallenge = (id: string) => {
    setChallenges(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            isJoined: true,
            currentDay: 1,
            completedDays: [1],
            participantsCount: c.participantsCount + 1,
            lastCheckInDate: '2026-09-17'
          };
        }
        return c;
      })
    );
    playGoalCelebrationChime(528);
    setToastMessage('You joined the community challenge! May God bless your collective journey ✨');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleCheckIn = (id: string) => {
    const challenge = challenges.find(c => c.id === id);
    if (!challenge) return;

    const todayDay = challenge.currentDay;
    const isAlreadyCompletedToday = challenge.completedDays.includes(todayDay);

    let updatedCompleted: number[];
    if (isAlreadyCompletedToday) {
      updatedCompleted = challenge.completedDays.filter(d => d !== todayDay);
    } else {
      updatedCompleted = [...challenge.completedDays, todayDay];
      playGoalCelebrationChime(660);
      setCelebratingChallengeId(id);
      setTimeout(() => setCelebratingChallengeId(null), 2500);
      setToastMessage(`Day ${todayDay} checked in for ${challenge.title}! +30 Community Growth Points 🕊️`);
      setTimeout(() => setToastMessage(null), 3500);
    }

    setChallenges(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            completedDays: updatedCompleted,
            lastCheckInDate: '2026-09-17'
          };
        }
        return c;
      })
    );
  };

  const filteredChallenges = challenges.filter(c => {
    if (activeTab === 'joined') return c.isJoined;
    if (activeTab === '7day') return c.durationDays === 7;
    if (activeTab === '30day') return c.durationDays === 30;
    return true;
  });

  const totalJoinedCount = challenges.filter(c => c.isJoined).length;

  return (
    <div id="community-challenges" className="bg-white rounded-3xl border border-[#E7DFD4] p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7DFD4] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#B95B3D]" />
            <h3 className="font-serif text-2xl text-[#211C15]">Community Sisterhood Challenges</h3>
          </div>
          <p className="text-xs text-[#7E6D56]">
            Grow alongside hundreds of faith-motivated sisters in 7-day and 30-day collective discipleship rhythms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="terracotta" size="sm">
            {totalJoinedCount} Active Challenge{totalJoinedCount === 1 ? '' : 's'}
          </Badge>
          <span className="text-xs text-[#5D7052] font-semibold bg-[#EEF2EB] px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Collective Momentum
          </span>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 bg-[#EEF2EB] border border-[#D5E0CE] rounded-xl text-xs text-[#5D7052] font-semibold flex items-center gap-2 animate-fade-in shadow-2xs">
          <Sparkles className="w-4 h-4 text-[#5D7052] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#E7DFD4]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('joined')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'joined'
                ? 'bg-white text-[#211C15] shadow-2xs font-semibold border border-[#E7DFD4]'
                : 'text-[#7E6D56] hover:text-[#211C15]'
            }`}
          >
            My Active Challenges ({totalJoinedCount})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-[#211C15] shadow-2xs font-semibold border border-[#E7DFD4]'
                : 'text-[#7E6D56] hover:text-[#211C15]'
            }`}
          >
            All Challenges ({challenges.length})
          </button>
          <button
            onClick={() => setActiveTab('7day')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === '7day'
                ? 'bg-white text-[#211C15] shadow-2xs font-semibold border border-[#E7DFD4]'
                : 'text-[#7E6D56] hover:text-[#211C15]'
            }`}
          >
            7-Day Sprints
          </button>
          <button
            onClick={() => setActiveTab('30day')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === '30day'
                ? 'bg-white text-[#211C15] shadow-2xs font-semibold border border-[#E7DFD4]'
                : 'text-[#7E6D56] hover:text-[#211C15]'
            }`}
          >
            30-Day Journeys
          </button>
        </div>

        <span className="text-[11px] text-[#A8957C] pr-2 hidden md:inline">
          Syncs with your Daily Reflection &amp; Habit Log
        </span>
      </div>

      {/* Challenge Cards Grid */}
      {filteredChallenges.length === 0 ? (
        <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-[#E7DFD4] space-y-3">
          <Users className="w-8 h-8 text-[#A8957C] mx-auto" />
          <p className="text-sm text-[#211C15] font-semibold">No challenges joined yet</p>
          <p className="text-xs text-[#7E6D56] max-w-sm mx-auto">
            Choose a 7-day focus or a 30-day gratitude journey below to begin walking alongside fellow sisters.
          </p>
          <Button variant="primary" size="sm" onClick={() => setActiveTab('all')}>
            Browse All Challenges &rarr;
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredChallenges.map(challenge => {
            const completedCount = challenge.completedDays.length;
            const progressPercent = Math.round((completedCount / challenge.durationDays) * 100);
            const isCompletedToday = challenge.completedDays.includes(challenge.currentDay);
            const isJustCelebrated = celebratingChallengeId === challenge.id;

            return (
              <div
                key={challenge.id}
                className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                  isJustCelebrated
                    ? 'ring-2 ring-[#B95B3D] bg-[#FAF0ED] border-[#F3DDD7] scale-[1.01]'
                    : challenge.isJoined
                    ? 'bg-[#FAF8F5] border-[#E7DFD4] shadow-xs hover:border-[#D2C4B1]'
                    : 'bg-white border-[#E7DFD4] hover:border-[#D2C4B1]'
                }`}
              >
                <div className="space-y-3">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl select-none">{challenge.badgeIcon}</span>
                      <Badge variant="terracotta" size="sm">
                        {challenge.durationDays}-Day Challenge
                      </Badge>
                      <Badge variant="neutral" size="sm">
                        {challenge.category}
                      </Badge>
                    </div>

                    <span className="text-[11px] text-[#7E6D56] flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#B95B3D]" />
                      {challenge.participantsCount.toLocaleString()} Sisters
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg text-[#211C15] font-semibold leading-snug">
                      {challenge.title}
                    </h4>
                    <p className="text-xs text-[#594D3C] leading-relaxed line-clamp-2">
                      {challenge.description}
                    </p>
                  </div>

                  {/* Scripture Anchor */}
                  <div className="p-2.5 rounded-xl bg-white/80 border border-[#E7DFD4] text-[11px] text-[#7E6D56] italic">
                    {challenge.scriptureAnchor}
                  </div>

                  {/* Active Prompt if Joined */}
                  {challenge.isJoined && (
                    <div className="p-3.5 rounded-2xl bg-white border border-[#E7DFD4] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B95B3D] flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-[#B95B3D]" />
                          Today&apos;s Focus
                        </span>
                        <span className="text-[11px] font-semibold text-[#594D3C]">
                          Day {challenge.currentDay} of {challenge.durationDays}
                        </span>
                      </div>
                      <p className="text-xs text-[#211C15] font-medium leading-relaxed">
                        {challenge.currentDayPrompt}
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress & Action Bottom Bar */}
                <div className="pt-3 border-t border-[#E7DFD4] space-y-3">
                  {challenge.isJoined ? (
                    <>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-[#594D3C]">
                          <span>Completed: {completedCount} of {challenge.durationDays} Days</span>
                          <span className="font-semibold text-[#B95B3D]">{progressPercent}%</span>
                        </div>

                        <div className="w-full h-2.5 bg-[#E7DFD4]/70 rounded-full overflow-hidden relative shadow-inner">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out bg-linear-to-r from-[#B95B3D] via-[#D97D54] to-[#C49746] relative overflow-hidden"
                            style={{ width: `${progressPercent}%` }}
                          >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-progress-shimmer pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() => handleToggleCheckIn(challenge.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 duration-200 ${
                            isCompletedToday
                              ? 'bg-[#EEF2EB] text-[#5D7052] border border-[#D5E0CE]'
                              : 'bg-[#B95B3D] text-white hover:bg-[#A04A2F]'
                          }`}
                        >
                          {isCompletedToday ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#5D7052]" />
                              <span>Day {challenge.currentDay} Logged for Today</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Check In Today (Day {challenge.currentDay})</span>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[#7E6D56]">
                        {challenge.durationDays} Days of intentional encouragement
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleJoinChallenge(challenge.id)}
                        icon={<Sparkles className="w-3.5 h-3.5" />}
                      >
                        Join Challenge
                      </Button>
                    </div>
                  )}

                  {challenge.recentSisterActivity && (
                    <div className="text-[10px] text-[#A8957C] italic truncate pt-1">
                      {challenge.recentSisterActivity}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
