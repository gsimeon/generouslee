import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  BookOpen,
  HelpCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  Heart,
  Users,
  Settings,
  Clock,
  CheckCircle,
  Trash2,
  PenLine,
  Save,
  Lock,
  Sun,
  ShieldCheck,
  Flame,
  ChevronDown,
  ChevronUp,
  Award,
  Compass,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ContentItem, Question, EventItem, JournalEntry, DailyReflectionResult, MilestoneBadge, UserGrowthProfile } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { FindYourMentorModal } from '../../components/common/FindYourMentorModal';

interface DashboardProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const UserDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, toggleSave, openAuthModal } = useAuth();
  const [savedArticles, setSavedArticles] = useState<ContentItem[]>([]);
  const [recommendedArticles, setRecommendedArticles] = useState<ContentItem[]>([]);
  const [myQuestions, setMyQuestions] = useState<Question[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Journaling state
  const [dailyPrompt, setDailyPrompt] = useState<{ prompt: string; scriptureReference: string; theme: string }>({
    prompt: 'Where did you sense God calling you to pause and receive His peace today?',
    scriptureReference: 'Psalm 46:10 — "Be still, and know that I am God; I will be exalted among the nations."',
    theme: 'Divine Rest & Surrender'
  });
  const [journalReflection, setJournalReflection] = useState('');
  const [gratitudeNote, setGratitudeNote] = useState('');
  const [selectedMood, setSelectedMood] = useState<'peaceful' | 'seeking' | 'grateful' | 'restless' | 'strengthened'>('peaceful');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isSavingJournal, setIsSavingJournal] = useState(false);
  const [journalSavedFeedback, setJournalSavedFeedback] = useState(false);
  const [showPastEntries, setShowPastEntries] = useState(false);

  // New Features: Reflection of the Day & Growth Milestones & Find Your Mentor
  const [reflectionOfTheDay, setReflectionOfTheDay] = useState<DailyReflectionResult | null>(null);
  const [isGeneratingReflection, setIsGeneratingReflection] = useState(false);
  const [growthProfile, setGrowthProfile] = useState<UserGrowthProfile | null>(null);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;
      setIsLoading(true);
      try {
        const [allContent, myQ, evts, promptData, entriesData, reflectionData, milestonesData] = await Promise.all([
          api.getContent({ status: 'published' }),
          api.getQuestions({ filter: 'mine' }),
          api.getEvents(),
          api.getDailyJournalPrompt().catch(() => ({
            prompt: 'Where did you sense God calling you to pause and receive His grace today?',
            scriptureReference: 'Psalm 46:10 — "Be still, and know that I am God."',
            theme: 'Divine Rest'
          })),
          api.getJournalEntries().catch(() => []),
          api.getReflectionOfTheDay().catch(() => null),
          api.getGrowthMilestones().catch(() => null)
        ]);

        const saved = allContent.filter(c => user.savedContentIds?.includes(c.id));
        setSavedArticles(saved);

        // Recommendations based on user interests
        const recommended = allContent.filter(c =>
          user.interests.some(i => i.toLowerCase().includes(c.category.toLowerCase()) || c.category.toLowerCase().includes(i.toLowerCase()))
        );
        setRecommendedArticles(recommended.length > 0 ? recommended : allContent.slice(0, 3));
        setMyQuestions(myQ);
        setEvents(evts.slice(0, 2));
        if (promptData) setDailyPrompt(promptData);
        if (entriesData) setJournalEntries(entriesData);
        if (reflectionData) setReflectionOfTheDay(reflectionData);
        if (milestonesData) setGrowthProfile(milestonesData);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, [user]);

  const handleRefreshReflection = async (customSeason?: string) => {
    setIsGeneratingReflection(true);
    try {
      const res = await api.getReflectionOfTheDay(customSeason);
      setReflectionOfTheDay(res);
    } catch (e) {
      console.error('Failed to regenerate reflection', e);
    } finally {
      setIsGeneratingReflection(false);
    }
  };

  const handleSaveJournalReflection = async () => {
    if (!journalReflection.trim()) return;
    setIsSavingJournal(true);
    try {
      const newEntry = await api.saveJournalEntry({
        prompt: dailyPrompt.prompt,
        scriptureReference: dailyPrompt.scriptureReference,
        reflectionText: journalReflection,
        gratitudeNote: gratitudeNote || undefined,
        moodTag: selectedMood
      });
      setJournalEntries(prev => [newEntry, ...prev]);
      setJournalSavedFeedback(true);
      setTimeout(() => setJournalSavedFeedback(false), 3000);
    } catch (err) {
      console.error('Failed to save reflection', err);
    } finally {
      setIsSavingJournal(false);
    }
  };

  const handleDeleteJournalEntry = async (id: string) => {
    try {
      await api.deleteJournalEntry(id);
      setJournalEntries(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#211C15]">Please Sign In</h2>
        <p className="text-sm text-[#594D3C]">
          Sign in to access your personal collection, questions, and tailored recommendations.
        </p>
        <Button variant="primary" size="md" onClick={() => openAuthModal('login')}>
          Sign In to Your Space
        </Button>
      </div>
    );
  }

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Welcoming Hero Banner */}
      <div className="bg-white rounded-3xl border border-[#E7DFD4] p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="sage" size="sm">Member Space</Badge>
            <span className="text-xs text-[#A8957C]">Personal Sanctuary</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#211C15] font-normal">
            {getTimeGreeting()}, {user.name.split(' ')[0]}.
          </h1>
          <p className="text-sm sm:text-base text-[#594D3C] max-w-xl leading-relaxed">
            Here is something nourishing for your mind and heart today. Take what serves you, and leave the rest with grace.
          </p>

          {/* User Interests tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-xs text-[#A8957C] mr-1">Your focus seasons:</span>
            {user.interests.map(i => (
              <Badge key={i} variant="neutral" size="sm">
                {i}
              </Badge>
            ))}
            <button
              onClick={() => openAuthModal('onboarding')}
              className="text-xs text-[#B95B3D] font-medium hover:underline ml-2 cursor-pointer"
            >
              Adjust focus &rarr;
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMentorModalOpen(true)}
            icon={<Compass className="w-4 h-4 text-[#B95B3D]" />}
          >
            Find Mentor Match
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('ask')}
            icon={<HelpCircle className="w-4 h-4 text-[#B95B3D]" />}
          >
            Ask Latisha
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('explore')}
            icon={<BookOpen className="w-4 h-4" />}
          >
            Explore Library
          </Button>
        </div>
      </div>

      {/* 2. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Reflection of the Day, Daily Journal, Favorites/Bookmarks & Recommendations */}
        <div className="lg:col-span-8 space-y-10">

          {/* AI-POWERED REFLECTION OF THE DAY */}
          <div className="bg-linear-to-br from-[#FAF5EE] via-[#FFFDF9] to-[#F5ECE0] rounded-3xl border border-[#E8DAC9] p-6 sm:p-8 space-y-5 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7DFD4]/80 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#B95B3D]" />
                  <h3 className="font-serif text-2xl text-[#211C15]">Personalized Reflection of the Day</h3>
                </div>
                <p className="text-xs text-[#7E6D56]">
                  Faith-rooted encouragement and actionable stillness tailored by Gemini AI for your season.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="gold" size="sm">
                  Season: {reflectionOfTheDay?.season || user.interests[0] || 'Spiritual Growth'}
                </Badge>
                <button
                  onClick={() => handleRefreshReflection()}
                  disabled={isGeneratingReflection}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 border border-[#D2C4B1] text-[#594D3C] hover:bg-white hover:text-[#211C15] transition-all cursor-pointer disabled:opacity-50"
                  title="Generate fresh perspective"
                >
                  <RefreshCw className={`w-3 h-3 text-[#B95B3D] ${isGeneratingReflection ? 'animate-spin' : ''}`} />
                  {isGeneratingReflection ? 'Listening...' : 'Refresh'}
                </button>
              </div>
            </div>

            {reflectionOfTheDay ? (
              <div className="space-y-4">
                <div className="bg-white/90 rounded-2xl p-5 sm:p-6 border border-[#E7DFD4] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#B95B3D] tracking-wider uppercase">
                      Spiritual Affirmation
                    </span>
                    <span className="text-[11px] text-[#A8957C]">
                      Anchored in Truth
                    </span>
                  </div>

                  <p className="font-serif text-lg sm:text-xl text-[#211C15] font-normal leading-relaxed italic">
                    &ldquo;{reflectionOfTheDay.affirmation}&rdquo;
                  </p>

                  <div className="pt-3 border-t border-[#F3EFE9] space-y-2">
                    <p className="text-xs sm:text-sm text-[#594D3C] leading-relaxed">
                      {reflectionOfTheDay.thought}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/70 rounded-xl p-4 border border-[#E7DFD4] flex items-start gap-3">
                    <Sun className="w-4 h-4 text-[#C49746] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-[#7E6D56] uppercase tracking-wide">Scripture Anchor</span>
                      <p className="text-xs text-[#211C15] font-medium leading-snug">{reflectionOfTheDay.scripture}</p>
                    </div>
                  </div>

                  <div className="bg-white/70 rounded-xl p-4 border border-[#E7DFD4] flex items-start gap-3">
                    <Heart className="w-4 h-4 text-[#B95B3D] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-[#7E6D56] uppercase tracking-wide">Daily Surrender Prompt</span>
                      <p className="text-xs text-[#211C15] leading-snug">{reflectionOfTheDay.actionableStep}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#7E6D56]">
                Preparing your spiritual affirmation...
              </div>
            )}
          </div>

          {/* DAILY FAITH REFLECTION JOURNAL */}
          <div id="daily-faith-journal" className="bg-[#FAF8F5] rounded-3xl border border-[#E7DFD4] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7DFD4] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <PenLine className="w-5 h-5 text-[#B95B3D]" />
                  <h3 className="font-serif text-2xl text-[#211C15]">Daily Faith Journal & Reflection</h3>
                </div>
                <p className="text-xs text-[#7E6D56]">
                  A private sanctuary to pause, align with Scripture, and document your spiritual journey.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5D7052] bg-[#EEF2EB] px-2.5 py-1 rounded-full">
                  <Lock className="w-3 h-3" /> Private to you
                </span>
                <button
                  onClick={() => setShowPastEntries(!showPastEntries)}
                  className="text-xs font-semibold text-[#B95B3D] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  {showPastEntries ? 'Hide Past Entries' : `View Past (${journalEntries.length})`}
                  {showPastEntries ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Daily Prompt & Scripture Card */}
            <div className="p-5 rounded-2xl bg-[#FAF0ED] border border-[#F3DDD7] space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="terracotta" size="sm">Today&apos;s Prompt &bull; {dailyPrompt.theme}</Badge>
                <span className="text-[11px] text-[#7E6D56]">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>

              <h4 className="font-serif text-lg sm:text-xl text-[#211C15] font-normal leading-snug">
                &ldquo;{dailyPrompt.prompt}&rdquo;
              </h4>

              <div className="pt-2 border-t border-[#F3DDD7]/80 flex items-center gap-2 text-xs text-[#7E6D56] italic">
                <Sun className="w-3.5 h-3.5 text-[#B95B3D] shrink-0" />
                <span>Scripture Anchor: {dailyPrompt.scriptureReference}</span>
              </div>
            </div>

            {/* Reflection Textarea */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#594D3C]">
                  Your Personal Reflection
                </label>
                <textarea
                  rows={4}
                  value={journalReflection}
                  onChange={(e) => setJournalReflection(e.target.value)}
                  placeholder="Write your thoughts freely before the Lord. What is happening in your spirit, marriage, family, or purpose today?"
                  className="w-full p-4 rounded-2xl border border-[#D2C4B1] bg-white text-sm text-[#211C15] placeholder-[#A8957C] focus:outline-none focus:border-[#B95B3D] focus:ring-1 focus:ring-[#B95B3D] leading-relaxed resize-y"
                />
              </div>

              {/* Gratitude & Mood Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#594D3C]">
                    Gratitude Offering (Optional)
                  </label>
                  <input
                    type="text"
                    value={gratitudeNote}
                    onChange={(e) => setGratitudeNote(e.target.value)}
                    placeholder="One specific blessing I thank God for..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2C4B1] bg-white text-xs text-[#211C15] placeholder-[#A8957C] focus:outline-none focus:border-[#B95B3D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#594D3C]">
                    Current Spiritual State
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {(['peaceful', 'grateful', 'seeking', 'strengthened', 'restless'] as const).map(mood => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setSelectedMood(mood)}
                        className={`text-xs px-2.5 py-1 rounded-full border capitalize transition-colors cursor-pointer ${
                          selectedMood === mood
                            ? 'bg-[#B95B3D] text-white border-[#B95B3D]'
                            : 'bg-white text-[#7E6D56] border-[#D2C4B1] hover:border-[#B95B3D]'
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button & Feedback */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#A8957C]">
                  {journalReflection.trim().split(/\s+/).filter(Boolean).length} words
                </span>

                <div className="flex items-center gap-3">
                  {journalSavedFeedback && (
                    <span className="text-xs text-[#5D7052] flex items-center gap-1 font-medium animate-fade-in">
                      <CheckCircle className="w-3.5 h-3.5" /> Reflection Saved to Sanctuary!
                    </span>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveJournalReflection}
                    disabled={isSavingJournal || !journalReflection.trim()}
                    icon={<Save className="w-3.5 h-3.5" />}
                  >
                    {isSavingJournal ? 'Saving...' : 'Save Reflection'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Past Journal Entries Accordion */}
            {showPastEntries && (
              <div className="pt-4 border-t border-[#E7DFD4] space-y-4 animate-fade-in">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#594D3C]">
                  Archived Reflections & Answered Prayers ({journalEntries.length})
                </h4>

                {journalEntries.length === 0 ? (
                  <p className="text-xs text-[#7E6D56] py-3 text-center bg-white rounded-xl border border-[#E7DFD4]">
                    No past reflections saved yet. Your saved entries will be preserved here securely.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {journalEntries.map(entry => (
                      <div
                        key={entry.id}
                        className="p-4 rounded-xl bg-white border border-[#E7DFD4] space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#211C15]">{entry.date}</span>
                            {entry.moodTag && (
                              <Badge variant="sage" size="sm" className="capitalize">
                                {entry.moodTag}
                              </Badge>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteJournalEntry(entry.id)}
                            className="text-[#A8957C] hover:text-[#A84848] p-1 cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="font-serif text-[#211C15] text-sm italic font-normal">
                          &ldquo;{entry.prompt}&rdquo;
                        </p>

                        <p className="text-[#594D3C] leading-relaxed whitespace-pre-line">
                          {entry.reflectionText}
                        </p>

                        {entry.gratitudeNote && (
                          <div className="p-2.5 rounded-lg bg-[#FAF0ED] text-[#7E6D56] text-[11px] flex items-center gap-1.5">
                            <Heart className="w-3 h-3 text-[#B95B3D] fill-[#B95B3D] shrink-0" />
                            <span><strong>Gratitude:</strong> {entry.gratitudeNote}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Saved Articles (Favorites / Bookmarks) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#B95B3D]" />
                <h3 className="font-serif text-2xl text-[#211C15]">Saved Favorites & Bookmarks</h3>
              </div>
              <span className="text-xs text-[#7E6D56]">
                {savedArticles.length} saved for later
              </span>
            </div>

            {savedArticles.length === 0 ? (
              <Card className="p-8 text-center space-y-3 bg-[#FAF8F5] border-dashed">
                <Bookmark className="w-8 h-8 text-[#A8957C] mx-auto" />
                <p className="text-sm text-[#383025] font-medium">No saved favorites yet</p>
                <p className="text-xs text-[#7E6D56] max-w-sm mx-auto">
                  Click &lsquo;Save to Favorites&rsquo; on any article, guide, or resource to bookmark it for later reading in your sanctuary.
                </p>
                <Button variant="outline" size="sm" onClick={() => onNavigate('explore')}>
                  Explore Articles
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedArticles.map(item => (
                  <Card
                    key={item.id}
                    hoverEffect
                    onClick={() => onNavigate('article', { slug: item.slug })}
                    className="p-4 space-y-3 border-[#E7DFD4] flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="terracotta" size="sm" className="capitalize">
                          {item.category.replace('-', ' ')}
                        </Badge>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSave(item.id);
                          }}
                          className="text-[#A8957C] hover:text-[#A84848] p-1 cursor-pointer"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-serif text-base text-[#211C15] font-normal line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#7E6D56] pt-2 border-t border-[#F3EFE9]">
                      <span>{item.readingTimeMinutes} min read</span>
                      <span className="text-[#B95B3D] font-medium">Read Article &rarr;</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>


          {/* Recommended Based on Focus Areas */}
          <div className="space-y-4 pt-4 border-t border-[#E7DFD4]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C49746]" />
                <h3 className="font-serif text-2xl text-[#211C15]">Tailored for Your Current Season</h3>
              </div>
              <button
                onClick={() => onNavigate('explore')}
                className="text-xs text-[#B95B3D] hover:underline"
              >
                View all &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {recommendedArticles.map(item => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('article', { slug: item.slug })}
                  className="bg-white rounded-2xl border border-[#E7DFD4] p-4 sm:p-5 hover:border-[#D2C4B1] hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <Badge variant="sage" size="sm" className="capitalize">
                      {item.category.replace('-', ' ')}
                    </Badge>
                    <h4 className="font-serif text-base sm:text-lg text-[#211C15] font-normal">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#7E6D56] line-clamp-1">{item.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#A8957C]">{item.readingTimeMinutes} min</span>
                    <ArrowRight className="w-4 h-4 text-[#B95B3D]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Growth Milestones, Questions Status & Community / Events */}
        <div className="lg:col-span-4 space-y-8">

          {/* GROWTH MILESTONES & DIGITAL BADGES */}
          <Card className="space-y-4 border-[#E7DFD4] bg-white">
            <div className="flex items-center justify-between border-b border-[#F3EFE9] pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#B95B3D]" />
                <h4 className="font-serif text-lg text-[#211C15]">Growth Milestones</h4>
              </div>
              <Badge variant="terracotta" size="sm">
                Level {growthProfile?.level || 1}
              </Badge>
            </div>

            {/* Overall Progress Meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#594D3C]">
                <span className="font-medium">Journey Progress</span>
                <span className="font-semibold text-[#B95B3D]">{growthProfile?.overallProgressPercent || 35}%</span>
              </div>
              <div className="w-full h-2 bg-[#F0EBE1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#B95B3D] to-[#D97D54] rounded-full transition-all duration-500"
                  style={{ width: `${growthProfile?.overallProgressPercent || 35}%` }}
                />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 py-1 text-center">
              <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4]">
                <div className="flex items-center justify-center gap-1 text-[#B95B3D]">
                  <Flame className="w-3.5 h-3.5" />
                  <span className="font-serif font-bold text-sm">{growthProfile?.journalingStreakDays || 1}</span>
                </div>
                <span className="text-[10px] text-[#7E6D56]">Day Streak</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4]">
                <div className="flex items-center justify-center gap-1 text-[#5D7052]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="font-serif font-bold text-sm">{growthProfile?.completedArticlesCount || 0}</span>
                </div>
                <span className="text-[10px] text-[#7E6D56]">Read</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4]">
                <div className="flex items-center justify-center gap-1 text-[#C49746]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-serif font-bold text-sm">{growthProfile?.badges.filter(b => b.unlocked).length || 0}</span>
                </div>
                <span className="text-[10px] text-[#7E6D56]">Badges</span>
              </div>
            </div>

            {/* Badges Earned Grid */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-[#7E6D56] uppercase tracking-wider block">
                Earned & Next Milestones
              </span>

              <div className="grid grid-cols-2 gap-2">
                {(growthProfile?.badges || []).slice(0, 4).map(badge => (
                  <div
                    key={badge.id}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between space-y-1 transition-all ${
                      badge.unlocked
                        ? 'bg-[#FAF8F5] border-[#E7DFD4] shadow-2xs'
                        : 'bg-gray-50/70 border-dashed border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-base leading-none">{badge.icon}</span>
                      <span className="text-[11px] font-medium text-[#211C15] line-clamp-1">
                        {badge.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#7E6D56] line-clamp-2 leading-tight">
                      {badge.description}
                    </p>
                    {badge.unlocked ? (
                      <span className="text-[9px] text-[#5D7052] font-semibold flex items-center gap-0.5">
                        <CheckCircle className="w-2.5 h-2.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[9px] text-[#A8957C]">
                        {badge.progress}% completed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* My Questions Tracker */}
          <Card className="space-y-4 border-[#E7DFD4]">
            <div className="flex items-center justify-between border-b border-[#F3EFE9] pb-3">
              <h4 className="font-serif text-lg text-[#211C15]">My Asked Questions</h4>
              <button
                onClick={() => onNavigate('ask', { tab: 'mine' })}
                className="text-xs text-[#B95B3D] hover:underline"
              >
                Manage
              </button>
            </div>

            {myQuestions.length === 0 ? (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-[#7E6D56]">You haven&apos;t asked any questions yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('ask')}
                  className="w-full text-xs"
                >
                  Ask Latisha
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myQuestions.slice(0, 3).map(q => (
                  <div key={q.id} className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7DFD4] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="capitalize text-[#B95B3D] font-medium">{q.category}</span>
                      <span className="text-[#7E6D56]">{q.status}</span>
                    </div>
                    <p className="text-xs text-[#211C15] font-medium line-clamp-2">
                      &ldquo;{q.questionText}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Upcoming Live Circles */}
          <Card className="space-y-4 border-[#E7DFD4]">
            <div className="flex items-center justify-between border-b border-[#F3EFE9] pb-3">
              <h4 className="font-serif text-lg text-[#211C15]">Upcoming Workshops</h4>
              <button
                onClick={() => onNavigate('events')}
                className="text-xs text-[#B95B3D] hover:underline"
              >
                All events
              </button>
            </div>

            <div className="space-y-3">
              {events.map(ev => (
                <div key={ev.id} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#A8957C]">
                    <span>{ev.date}</span>
                    <Badge variant="sage" size="sm">{ev.price}</Badge>
                  </div>
                  <h5 className="font-serif text-xs font-semibold text-[#211C15] leading-snug">
                    {ev.title}
                  </h5>
                  <p className="text-[11px] text-[#7E6D56]">Speaker: {ev.speaker}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Community Group Shortcuts */}
          <Card className="space-y-4 border-[#E7DFD4] bg-[#FAF0ED]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#B95B3D]" />
              <h4 className="font-serif text-base text-[#211C15]">Join the Discussion</h4>
            </div>
            <p className="text-xs text-[#594D3C] leading-relaxed">
              Connect with fellow mothers in the <em>New Mothers Circle</em> or <em>Marriage Conversations</em>.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => onNavigate('community')}
            >
              Open Circles &rarr;
            </Button>
          </Card>
        </div>
      </div>

      {/* Find Your Mentor Assessment Modal */}
      <FindYourMentorModal
        isOpen={isMentorModalOpen}
        onClose={() => setIsMentorModalOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
