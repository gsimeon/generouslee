import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  ChevronRight,
  Plus,
  BookOpen,
  Heart,
  Sun,
  Shield,
  Award,
  Trash2
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { GrowthRoadmapData, RoadmapStep, RoadmapWeek } from '../../types';
import { playGoalCelebrationChime } from '../../utils/audioChime';

const STORAGE_KEY = 'generouslee_growth_roadmaps';

const INITIAL_ROADMAPS: GrowthRoadmapData[] = [
  {
    id: 'roadmap-spiritual-wholeness',
    pathTitle: 'Spiritual Wholeness & Secret Place Intimacy',
    tagline: 'Cultivate an unhurried, daily communion with God that anchors your soul through every season.',
    category: 'Spiritual Formation',
    icon: '🕊️',
    weeks: [
      {
        weekNumber: 1,
        title: 'Awakening the Secret Place',
        focusTheme: 'Silence, Solitude & Breath Prayer',
        scripture: '“Be still, and know that I am God.” — Psalm 46:10',
        steps: [
          { id: 'sw-w1-1', text: 'Wake 15 minutes earlier to sit in quiet before opening any notifications', completed: true },
          { id: 'sw-w1-2', text: 'Practice 5 minutes of breath prayer: Inhale “The Lord is my Shepherd”, Exhale “I shall not want”', completed: true },
          { id: 'sw-w1-3', text: 'Write down 3 specific things you are handing over to God today', completed: true }
        ]
      },
      {
        weekNumber: 2,
        title: 'Scripture Immersion & Meditation',
        focusTheme: 'Lectio Divina & Biblical Anchoring',
        scripture: '“Your word is a lamp to my feet and a light to my path.” — Psalm 119:105',
        steps: [
          { id: 'sw-w2-1', text: 'Slowly read Colossians 3:1-17 three times in different translations', completed: true },
          { id: 'sw-w2-2', text: 'Write 1 key verse on a note card and place it on your bathroom mirror', completed: false },
          { id: 'sw-w2-3', text: 'Memorize your anchor verse and recite it during an afternoon pause', completed: false }
        ]
      },
      {
        weekNumber: 3,
        title: 'Spiritual Warfare & Casting Down Lies',
        focusTheme: 'Authority, Armor & Mind Renewal',
        scripture: '“We take captive every thought to make it obedient to Christ.” — 2 Corinthians 10:5',
        steps: [
          { id: 'sw-w3-1', text: 'Identify the top recurring anxious thought and write the scriptural counter-truth', completed: false },
          { id: 'sw-w3-2', text: 'Speak Psalm 91 out loud over your household before sleep', completed: false },
          { id: 'sw-w3-3', text: 'Fast from social media for 24 hours to clear emotional static', completed: false }
        ]
      },
      {
        weekNumber: 4,
        title: 'Sustainable Sabbath & Fruitful Overflow',
        focusTheme: 'Holy Rest & Relational Ministry',
        scripture: '“Remain in me, as I also remain in you.” — John 15:4',
        steps: [
          { id: 'sw-w4-1', text: 'Design a 24-hour Sabbath rest window with restful meals and no productivity pressure', completed: false },
          { id: 'sw-w4-2', text: 'Send an encouraging scripture text to a sister walking through trial', completed: false },
          { id: 'sw-w4-3', text: 'Journal a 1-page prayer of thanksgiving for God’s guidance across the month', completed: false }
        ]
      }
    ]
  },
  {
    id: 'roadmap-temple-care',
    pathTitle: 'Temple Care & Restorative Vitality',
    tagline: 'Honor your physical body as God’s holy dwelling through nervous system down-regulation and cellular nourishment.',
    category: 'Health & Wholeness',
    icon: '🌿',
    weeks: [
      {
        weekNumber: 1,
        title: 'Biological Sleep Sanctuary & Evening Rhythm',
        focusTheme: 'Melatonin Protection & Nervous System Calm',
        scripture: '“In peace I will lie down and sleep, for you alone, Lord, make me dwell in safety.” — Psalm 4:8',
        steps: [
          { id: 'tc-w1-1', text: 'Turn off overhead lights and screens 45 minutes before bed', completed: true },
          { id: 'tc-w1-2', text: 'Sip warm chamomile tea while journaling 3 evening gratitudes', completed: true },
          { id: 'tc-w1-3', text: 'Ensure bedroom is cool and completely dark for restorative REM sleep', completed: false }
        ]
      },
      {
        weekNumber: 2,
        title: 'Cellular Hydration & Mindful Nourishment',
        focusTheme: 'Whole Foods as God’s Medicine',
        scripture: '“So whether you eat or drink or whatever you do, do it all for the glory of God.” — 1 Corinthians 10:31',
        steps: [
          { id: 'tc-w2-1', text: 'Drink 16oz of warm water with lemon and sea salt upon waking', completed: false },
          { id: 'tc-w2-2', text: 'Add 2 servings of rich leafy greens or colorful vegetables to lunch and dinner', completed: false },
          { id: 'tc-w2-3', text: 'Pause and pray a 30-second blessing over your meal before eating', completed: false }
        ]
      },
      {
        weekNumber: 3,
        title: 'Holy Movement & Breath Integration',
        focusTheme: 'Gentle Somatic Circulation',
        scripture: '“For in him we live and move and have our being.” — Acts 17:28',
        steps: [
          { id: 'tc-w3-1', text: 'Engage in a 20-minute prayer walk outside in morning sunlight', completed: false },
          { id: 'tc-w3-2', text: 'Do 10 minutes of gentle spinal stretching and restorative breathing', completed: false },
          { id: 'tc-w3-3', text: 'Track daily energy levels to notice what foods drain your afternoon focus', completed: false }
        ]
      },
      {
        weekNumber: 4,
        title: 'The Unhurried Rhythm of Grace',
        focusTheme: 'Long-term Boundary Maintenance',
        scripture: '“Come to me, all you who are weary... and you will find rest for your souls.” — Matthew 11:28-29',
        steps: [
          { id: 'tc-w4-1', text: 'Protect 1 full afternoon with zero errands or digital obligations', completed: false },
          { id: 'tc-w4-2', text: 'Set a gentle boundary around work hours to honor family dinner', completed: false },
          { id: 'tc-w4-3', text: 'Celebrate bodily restoration with a peaceful Epsom salt bath', completed: false }
        ]
      }
    ]
  },
  {
    id: 'roadmap-motherhood-peace',
    pathTitle: 'Grace in Motherhood & Family Atmosphere',
    tagline: 'Exchange reactive parenting and maternal guilt for peaceful presence, slow rhythms, and covenant blessing.',
    category: 'Motherhood & Home',
    icon: '🏡',
    weeks: [
      {
        weekNumber: 1,
        title: 'The Atmosphere of Peace Over Hurry',
        focusTheme: 'Regulating Maternal Presence',
        scripture: '“A peaceful heart leads to a healthy body.” — Proverbs 14:30',
        steps: [
          { id: 'mp-w1-1', text: 'Pause and take 3 deep belly breaths before responding to sibling conflict', completed: false },
          { id: 'mp-w1-2', text: 'Play gentle instrumental worship music softly in the kitchen during morning rush', completed: true },
          { id: 'mp-w1-3', text: 'Drop 1 unnecessary errand to protect unhurried bedtime connection', completed: false }
        ]
      },
      {
        weekNumber: 2,
        title: 'Covenant Words & Daily Blessings',
        focusTheme: 'Spoken Identity & Encouragement',
        scripture: '“The tongue has the power of life and death.” — Proverbs 18:21',
        steps: [
          { id: 'mp-w2-1', text: 'Whisper a personalized blessing over each child’s forehead before sleep', completed: false },
          { id: 'mp-w2-2', text: 'Catch your children doing something kind and praise their character aloud', completed: false },
          { id: 'mp-w2-3', text: 'Eliminate sarcastic or sharp critiques for 7 days', completed: false }
        ]
      },
      {
        weekNumber: 3,
        title: 'Gentle Boundaries & Self-Stewardship',
        focusTheme: 'Overcoming Motherhood Martyrdom',
        scripture: '“Above all else, guard your heart, for everything you do flows from it.” — Proverbs 4:23',
        steps: [
          { id: 'mp-w3-1', text: 'Take a guilt-free 30-minute quiet restorative break while partner or helper steps in', completed: false },
          { id: 'mp-w3-2', text: 'Communicate your physical capacity honestly without apologizing for needing rest', completed: false },
          { id: 'mp-w3-3', text: 'Release the comparison trap on social media; unfollow triggering accounts', completed: false }
        ]
      },
      {
        weekNumber: 4,
        title: 'Joy in the Mundane & Generational Fruit',
        focusTheme: 'Sanctifying Daily Rhythms',
        scripture: '“Her children arise and call her blessed.” — Proverbs 31:28',
        steps: [
          { id: 'mp-w4-1', text: 'Turn dinner prep into a family connection moment with story sharing', completed: false },
          { id: 'mp-w4-2', text: 'Create a weekly “Family Sabbath Dinner” with candles and communion bread', completed: false },
          { id: 'mp-w4-3', text: 'Write a heartfelt letter of gratitude to God for your children’s unique spirits', completed: false }
        ]
      }
    ]
  }
];

export const GrowthRoadmap: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<GrowthRoadmapData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ROADMAPS;
    } catch {
      return INITIAL_ROADMAPS;
    }
  });

  const [activeRoadmapId, setActiveRoadmapId] = useState<string>(roadmaps[0]?.id || 'roadmap-spiritual-wholeness');
  const [activeWeekTab, setActiveWeekTab] = useState<number>(1);
  const [newStepText, setNewStepText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmaps));
    } catch {
      // Ignore
    }
  }, [roadmaps]);

  const currentRoadmap = roadmaps.find(r => r.id === activeRoadmapId) || roadmaps[0];

  const handleToggleStep = (weekNumber: number, stepId: string) => {
    let willComplete = false;

    setRoadmaps(prev =>
      prev.map(r => {
        if (r.id === activeRoadmapId) {
          const updatedWeeks = r.weeks.map(w => {
            if (w.weekNumber === weekNumber) {
              const updatedSteps = w.steps.map(s => {
                if (s.id === stepId) {
                  willComplete = !s.completed;
                  return { ...s, completed: willComplete };
                }
                return s;
              });
              return { ...w, steps: updatedSteps };
            }
            return w;
          });
          return { ...r, weeks: updatedWeeks };
        }
        return r;
      })
    );

    if (willComplete) {
      playGoalCelebrationChime(528);
      setToastMessage('Step completed! Keep walking faithfully in this season ✨');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleAddCustomStep = (e: React.FormEvent, weekNumber: number) => {
    e.preventDefault();
    if (!newStepText.trim()) return;

    const newStep: RoadmapStep = {
      id: `custom-step-${Date.now()}`,
      text: newStepText.trim(),
      completed: false,
      isCustom: true
    };

    setRoadmaps(prev =>
      prev.map(r => {
        if (r.id === activeRoadmapId) {
          const updatedWeeks = r.weeks.map(w => {
            if (w.weekNumber === weekNumber) {
              return { ...w, steps: [...w.steps, newStep] };
            }
            return w;
          });
          return { ...r, weeks: updatedWeeks };
        }
        return r;
      })
    );

    setNewStepText('');
    playGoalCelebrationChime(440);
    setToastMessage('Personal action step added to Week ' + weekNumber);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDeleteCustomStep = (weekNumber: number, stepId: string) => {
    setRoadmaps(prev =>
      prev.map(r => {
        if (r.id === activeRoadmapId) {
          const updatedWeeks = r.weeks.map(w => {
            if (w.weekNumber === weekNumber) {
              return { ...w, steps: w.steps.filter(s => s.id !== stepId) };
            }
            return w;
          });
          return { ...r, weeks: updatedWeeks };
        }
        return r;
      })
    );
  };

  // Overall roadmap metrics
  const allSteps = currentRoadmap.weeks.flatMap(w => w.steps);
  const totalCompletedSteps = allSteps.filter(s => s.completed).length;
  const overallRoadmapPercent = Math.round((totalCompletedSteps / (allSteps.length || 1)) * 100);

  const selectedWeek = currentRoadmap.weeks.find(w => w.weekNumber === activeWeekTab) || currentRoadmap.weeks[0];
  const weekCompletedCount = selectedWeek.steps.filter(s => s.completed).length;
  const weekPercent = Math.round((weekCompletedCount / (selectedWeek.steps.length || 1)) * 100);

  return (
    <div id="growth-roadmap" className="bg-white rounded-3xl border border-[#E7DFD4] p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7DFD4] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#B95B3D]" />
            <h3 className="font-serif text-2xl text-[#211C15]">Personal Growth Roadmap</h3>
          </div>
          <p className="text-xs text-[#7E6D56]">
            Break down ambitious spiritual and personal development goals into bite-sized weekly action steps.
          </p>
        </div>

        {/* Overall Percentage Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="terracotta" size="sm">
            {overallRoadmapPercent}% Path Complete
          </Badge>
          <span className="text-xs text-[#594D3C] font-semibold bg-[#FAF8F5] border border-[#E7DFD4] px-3 py-1 rounded-full">
            {totalCompletedSteps} of {allSteps.length} Steps Done
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

      {/* Roadmap Pathway Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {roadmaps.map(roadmap => {
          const isSelected = roadmap.id === activeRoadmapId;
          return (
            <button
              key={roadmap.id}
              onClick={() => {
                setActiveRoadmapId(roadmap.id);
                setActiveWeekTab(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#FAF0ED] text-[#B95B3D] border-[#B95B3D] shadow-xs'
                  : 'bg-[#FAF8F5] text-[#594D3C] border-[#E7DFD4] hover:border-[#D2C4B1]'
              }`}
            >
              <span className="text-base">{roadmap.icon}</span>
              <span>{roadmap.pathTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Current Pathway Summary Banner */}
      <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E7DFD4] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B95B3D]">
                Active Track: {currentRoadmap.category}
              </span>
            </div>
            <h4 className="font-serif text-lg text-[#211C15] font-semibold">
              {currentRoadmap.pathTitle}
            </h4>
            <p className="text-xs text-[#7E6D56]">
              {currentRoadmap.tagline}
            </p>
          </div>

          <div className="text-right sm:text-right shrink-0">
            <span className="text-xs text-[#7E6D56]">Roadmap Progress</span>
            <p className="font-serif text-xl font-bold text-[#B95B3D]">{overallRoadmapPercent}%</p>
          </div>
        </div>

        {/* Animated Pathway Progress Bar */}
        <div className="w-full h-2.5 bg-[#E7DFD4]/70 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out bg-linear-to-r from-[#B95B3D] via-[#D97D54] to-[#C49746] relative overflow-hidden"
            style={{ width: `${overallRoadmapPercent}%` }}
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-progress-shimmer pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Weekly Stepper Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {currentRoadmap.weeks.map(week => {
          const isSelected = activeWeekTab === week.weekNumber;
          const completedCount = week.steps.filter(s => s.completed).length;
          const isAllDone = completedCount === week.steps.length;

          return (
            <button
              key={week.weekNumber}
              onClick={() => setActiveWeekTab(week.weekNumber)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                isSelected
                  ? 'bg-white border-[#B95B3D] shadow-xs ring-1 ring-[#B95B3D]'
                  : 'bg-[#FAF8F5] border-[#E7DFD4] hover:border-[#D2C4B1]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8957C]">
                  Week {week.weekNumber}
                </span>
                {isAllDone && (
                  <span className="text-[10px] font-bold text-[#5D7052] bg-[#EEF2EB] px-1.5 py-0.5 rounded-full">
                    ✓ Done
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-[#211C15] line-clamp-1">
                {week.title}
              </p>

              <div className="flex items-center justify-between text-[11px] text-[#7E6D56] pt-1">
                <span>{completedCount} of {week.steps.length} Steps</span>
                <span className="font-semibold text-[#B95B3D]">
                  {Math.round((completedCount / week.steps.length) * 100)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Week Step Breakdown Card */}
      <div className="p-6 rounded-3xl border border-[#E7DFD4] bg-white space-y-5 shadow-2xs">
        {/* Week Title & Scripture */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#E7DFD4] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="terracotta" size="sm">
                Week {selectedWeek.weekNumber} Focus
              </Badge>
              <span className="text-xs font-medium text-[#7E6D56]">
                Theme: {selectedWeek.focusTheme}
              </span>
            </div>
            <h4 className="font-serif text-xl text-[#211C15] font-semibold">
              {selectedWeek.title}
            </h4>
          </div>

          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4] text-xs text-[#7E6D56] italic max-w-sm">
            {selectedWeek.scripture}
          </div>
        </div>

        {/* Weekly Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#594D3C]">
            <span>Weekly Progress: {weekCompletedCount} of {selectedWeek.steps.length} Actions Completed</span>
            <span className="font-semibold text-[#B95B3D]">{weekPercent}%</span>
          </div>

          <div className="w-full h-2.5 bg-[#F0EBE1] rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out bg-linear-to-r from-[#B95B3D] to-[#D97D54] relative overflow-hidden"
              style={{ width: `${weekPercent}%` }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-progress-shimmer pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5 pt-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#594D3C]">
            Bite-Sized Weekly Micro-Steps
          </span>

          <div className="space-y-2">
            {selectedWeek.steps.map(step => (
              <div
                key={step.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  step.completed
                    ? 'bg-[#FAF0ED]/60 border-[#F3DDD7] text-[#594D3C]'
                    : 'bg-[#FAF8F5] border-[#E7DFD4] hover:border-[#D2C4B1] text-[#211C15]'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleToggleStep(selectedWeek.weekNumber, step.id)}
                    className={`shrink-0 mt-0.5 p-1 rounded-lg transition-transform active:scale-90 cursor-pointer ${
                      step.completed ? 'text-[#B95B3D]' : 'text-[#A8957C] hover:text-[#B95B3D]'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <p className={`text-xs font-medium leading-relaxed ${step.completed ? 'line-through text-[#7E6D56]' : ''}`}>
                    {step.text}
                  </p>
                </div>

                {step.isCustom && (
                  <button
                    onClick={() => handleDeleteCustomStep(selectedWeek.weekNumber, step.id)}
                    className="text-[#A8957C] hover:text-red-600 p-1 transition-colors cursor-pointer"
                    title="Remove custom step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Custom Step Form */}
        <form
          onSubmit={e => handleAddCustomStep(e, selectedWeek.weekNumber)}
          className="pt-2 flex items-center gap-2"
        >
          <input
            type="text"
            value={newStepText}
            onChange={e => setNewStepText(e.target.value)}
            placeholder={`+ Add a personal action step to Week ${selectedWeek.weekNumber}...`}
            className="flex-1 p-2.5 rounded-xl border border-[#E7DFD4] bg-[#FAF8F5] text-xs text-[#211C15] placeholder-[#A8957C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B95B3D] transition-all"
          />
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Step
          </Button>
        </form>
      </div>
    </div>
  );
};
