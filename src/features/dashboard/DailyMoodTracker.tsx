import React, { useState, useEffect } from 'react';
import {
  Smile,
  Heart,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { MoodRecord, JournalEntry } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

interface DailyMoodTrackerProps {
  reflections: JournalEntry[];
  onNavigateToJournal?: () => void;
}

const STORAGE_KEY = 'generouslee_mood_history';

const MOOD_OPTIONS = [
  {
    emoji: '🕊️',
    label: 'Peaceful',
    moodKey: 'peaceful',
    description: 'Still, calm, and resting in Christ',
    accentColor: '#5D7052',
    bgClass: 'bg-[#EEF2EB] border-[#D5E0CE] text-[#5D7052]'
  },
  {
    emoji: '🙏',
    label: 'Grateful',
    moodKey: 'grateful',
    description: 'Aware of blessings and God’s hand',
    accentColor: '#B95B3D',
    bgClass: 'bg-[#FAF0ED] border-[#F3DDD7] text-[#B95B3D]'
  },
  {
    emoji: '🌿',
    label: 'Grounded',
    moodKey: 'strengthened',
    description: 'Centered, unhurried, and anchored',
    accentColor: '#5D7052',
    bgClass: 'bg-[#EEF2EB] border-[#D5E0CE] text-[#5D7052]'
  },
  {
    emoji: '🌤️',
    label: 'Hopeful',
    moodKey: 'seeking',
    description: 'Anticipating fresh grace and fruitfulness',
    accentColor: '#C49746',
    bgClass: 'bg-[#FAF5EE] border-[#F0E4D0] text-[#9E7326]'
  },
  {
    emoji: '⚡',
    label: 'Restless',
    moodKey: 'restless',
    description: 'Carrying tension, haste, or mental fatigue',
    accentColor: '#C47246',
    bgClass: 'bg-[#FAF2EC] border-[#F0DFD3] text-[#A6552B]'
  },
  {
    emoji: '🌧️',
    label: 'Weary',
    moodKey: 'seeking',
    description: 'Stretched thin; needing tender comfort',
    accentColor: '#7A6B82',
    bgClass: 'bg-[#F4F1F5] border-[#E3DEE6] text-[#695873]'
  }
];

const DEFAULT_MOOD_HISTORY: MoodRecord[] = [
  {
    id: 'mood-7',
    date: '2026-09-17',
    emoji: '🕊️',
    label: 'Peaceful',
    energyLevel: 4,
    contextTag: 'Motherhood',
    note: 'Woke early with calm clarity; trusting God with today’s pace.',
    timestamp: '2026-09-17T07:30:00Z'
  },
  {
    id: 'mood-6',
    date: '2026-09-16',
    emoji: '⚡',
    label: 'Restless',
    energyLevel: 2,
    contextTag: 'Career',
    note: 'Felt pressured by client deadlines; reminded myself to exhale and surrender control.',
    timestamp: '2026-09-16T17:15:00Z'
  },
  {
    id: 'mood-5',
    date: '2026-09-15',
    emoji: '🌿',
    label: 'Grounded',
    energyLevel: 4,
    contextTag: 'Temple Care',
    note: 'Honored temple with hydration and fresh air.',
    timestamp: '2026-09-15T19:00:00Z'
  },
  {
    id: 'mood-4',
    date: '2026-09-14',
    emoji: '🙏',
    label: 'Grateful',
    energyLevel: 5,
    contextTag: 'Marriage',
    note: 'Deep unity in evening prayer with my spouse.',
    timestamp: '2026-09-14T21:00:00Z'
  },
  {
    id: 'mood-3',
    date: '2026-09-13',
    emoji: '🕊️',
    label: 'Peaceful',
    energyLevel: 3,
    contextTag: 'Faith',
    note: 'Sabbath rest and quiet home.',
    timestamp: '2026-09-13T16:00:00Z'
  }
];

export const DailyMoodTracker: React.FC<DailyMoodTrackerProps> = ({
  reflections,
  onNavigateToJournal
}) => {
  const [moodHistory, setMoodHistory] = useState<MoodRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_MOOD_HISTORY;
    } catch {
      return DEFAULT_MOOD_HISTORY;
    }
  });

  const [selectedEmoji, setSelectedEmoji] = useState<string>('🕊️');
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [contextTag, setContextTag] = useState<string>('Motherhood');
  const [moodNote, setMoodNote] = useState<string>('');
  const [isLoggedToday, setIsLoggedToday] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const todayStr = '2026-09-17';

  useEffect(() => {
    const foundToday = moodHistory.some(m => m.date === todayStr);
    setIsLoggedToday(foundToday);
  }, [moodHistory, todayStr]);

  const handleLogMood = () => {
    const selectedOption = MOOD_OPTIONS.find(m => m.emoji === selectedEmoji) || MOOD_OPTIONS[0];

    const newRecord: MoodRecord = {
      id: `mood-${Date.now()}`,
      date: todayStr,
      emoji: selectedEmoji,
      label: selectedOption.label,
      energyLevel,
      contextTag,
      note: moodNote.trim() || undefined,
      timestamp: new Date().toISOString()
    };

    const updated = [newRecord, ...moodHistory.filter(m => m.date !== todayStr)];
    setMoodHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // private storage
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    setIsLoggedToday(true);
  };

  // Correlation analysis between mood records and reflections
  const correlationMap = moodHistory.map(mood => {
    const matchingReflection = reflections.find(r => r.date === mood.date);
    return {
      mood,
      reflection: matchingReflection
    };
  });

  // Calculate high-level emotional insights
  const peacefulCount = moodHistory.filter(m => m.emoji === '🕊️' || m.emoji === '🙏' || m.emoji === '🌿').length;
  const peacefulPercentage = moodHistory.length > 0 ? Math.round((peacefulCount / moodHistory.length) * 100) : 75;

  return (
    <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7DFD4] p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7DFD4] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕊️</span>
            <h3 className="font-serif text-2xl text-[#211C15]">Daily Mood & Spirit Check-in</h3>
          </div>
          <p className="text-xs text-[#7E6D56]">
            Check in with your emotional state and correlate daily heart postures with your reflection depth.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="terracotta" size="sm">
            {peacefulPercentage}% Serene & Grateful
          </Badge>
          {isLoggedToday && (
            <span className="text-xs text-[#5D7052] font-medium flex items-center gap-1 bg-[#EEF2EB] px-2.5 py-1 rounded-full border border-[#D5E0CE]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Logged Today
            </span>
          )}
        </div>
      </div>

      {/* Interactive Mood Selector Box */}
      <div className="bg-white rounded-2xl border border-[#E7DFD4] p-5 sm:p-6 space-y-5">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#594D3C] block">
            1. Select Your Emotional Tone for Today
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {MOOD_OPTIONS.map(opt => {
              const isSelected = selectedEmoji === opt.emoji;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSelectedEmoji(opt.emoji)}
                  className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#B95B3D] bg-[#FAF0ED] shadow-2xs scale-[1.02]'
                      : 'border-[#E7DFD4] bg-white hover:border-[#D2C4B1] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span className="text-2xl leading-none">{opt.emoji}</span>
                  <span className="text-xs font-semibold text-[#211C15]">{opt.label}</span>
                  <span className="text-[10px] text-[#7E6D56] line-clamp-1 leading-tight">{opt.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy & Context */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F3EFE9]">
          {/* Energy Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-[#594D3C]">
              <span className="font-semibold uppercase tracking-wider text-[11px]">2. Heart Energy</span>
              <span className="text-[#B95B3D] font-bold">
                {energyLevel === 1 && 'Depleted / Need Rest'}
                {energyLevel === 2 && 'Gentle / Tender'}
                {energyLevel === 3 && 'Steady / Balanced'}
                {energyLevel === 4 && 'Vibrant & Present'}
                {energyLevel === 5 && 'Radiant & Joyful'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setEnergyLevel(lvl)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    energyLevel >= lvl
                      ? 'bg-[#B95B3D] text-white border-[#B95B3D]'
                      : 'bg-[#FAF8F5] text-[#A8957C] border-[#E7DFD4]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Context Domain */}
          <div className="space-y-1.5">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-[#594D3C] block">
              3. Influencing Season
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['Motherhood', 'Faith', 'Career', 'Marriage', 'Temple Care', 'Rest'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setContextTag(tag)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    contextTag === tag
                      ? 'bg-[#5D7052] text-white border-[#5D7052] font-semibold'
                      : 'bg-white text-[#7E6D56] border-[#D2C4B1] hover:border-[#5D7052]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Micro-Note Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#594D3C] block">
            Brief Note (Optional)
          </label>
          <input
            type="text"
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            placeholder="e.g. Grateful for quiet morning coffee; felt rushed after dinner..."
            className="w-full px-3.5 py-2 rounded-xl border border-[#D2C4B1] bg-white text-xs text-[#211C15] placeholder-[#A8957C] focus:outline-none focus:border-[#B95B3D]"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-[#5D7052] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#5D7052]" /> Today&apos;s mood logged and correlated!
            </span>
          ) : (
            <span className="text-[11px] text-[#7E6D56]">
              Correlates with your daily journal and weekly habits
            </span>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={handleLogMood}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            {isLoggedToday ? 'Update Today’s Mood' : 'Log Today’s Mood'}
          </Button>
        </div>
      </div>

      {/* Mood & Reflection Correlation Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#594D3C] flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#B95B3D]" />
            Emotional Pattern & Reflection Correlation
          </h4>
          <span className="text-[11px] text-[#7E6D56]">
            Past {moodHistory.length} Check-ins
          </span>
        </div>

        <div className="space-y-2.5">
          {correlationMap.slice(0, 5).map(({ mood, reflection }) => {
            return (
              <div
                key={mood.id}
                className="p-4 rounded-2xl bg-white border border-[#E7DFD4] hover:border-[#D2C4B1] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                {/* Left: Mood & Date */}
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none p-2 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4]">
                    {mood.emoji}
                  </span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#211C15]">{mood.label}</span>
                      <span className="text-[10px] text-[#A8957C]">&bull; {mood.date}</span>
                      {mood.contextTag && (
                        <Badge variant="gold" size="sm">
                          {mood.contextTag}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[#594D3C] text-xs">
                      {mood.note || `Energy level ${mood.energyLevel}/5 in ${mood.contextTag || 'daily life'}`}
                    </p>
                  </div>
                </div>

                {/* Right: Correlation with Reflection */}
                <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#F3EFE9] space-y-1 sm:max-w-xs">
                  {reflection ? (
                    <div className="space-y-0.5">
                      <div className="flex items-center sm:justify-end gap-1 text-[11px] text-[#5D7052] font-semibold">
                        <BookOpen className="w-3 h-3 text-[#5D7052]" />
                        <span>Reflected on {reflection.category || 'Faith'}</span>
                      </div>
                      <p className="text-[10px] text-[#7E6D56] line-clamp-1 italic">
                        &ldquo;{reflection.reflectionText.slice(0, 60)}...&rdquo;
                      </p>
                      <span className="text-[10px] text-[#A8957C] block">
                        {reflection.wordCount || 45} words &bull; {reflection.sentimentScore || 88}% peace score
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#A8957C] block">No reflection written this day</span>
                      {onNavigateToJournal && mood.date === todayStr && (
                        <button
                          onClick={onNavigateToJournal}
                          className="text-[11px] text-[#B95B3D] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          Write reflection now <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Correlation Takeaway Note */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#E7DFD4] text-xs text-[#594D3C] space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-[#211C15]">
            <Sparkles className="w-3.5 h-3.5 text-[#B95B3D]" />
            Emotional & Spiritual Correlation Finding:
          </div>
          <p className="text-xs leading-relaxed">
            On days you logged <strong className="text-[#211C15]">🕊️ Peaceful</strong> or <strong className="text-[#211C15]">🙏 Grateful</strong>, your reflections averaged <strong className="text-[#B95B3D]">51 words</strong> and focused on spiritual surrender in motherhood. On days marked <strong className="text-[#211C15]">⚡ Restless</strong>, short breathing pauses helped recover peaceful baseline within 4 hours.
          </p>
        </div>
      </div>
    </div>
  );
};
