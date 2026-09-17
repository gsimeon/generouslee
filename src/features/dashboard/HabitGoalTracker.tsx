import React, { useState, useEffect } from 'react';
import {
  Flame,
  CheckCircle2,
  Circle,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { MonthCalendarView } from './MonthCalendarView';
import { saveDayHabitCompletion } from '../../utils/calendarTracker';
import { playGoalCelebrationChime } from '../../utils/audioChime';

export interface HabitGoal {
  id: string;
  pathName: string;
  title: string;
  targetDescription: string;
  category: 'spiritual' | 'wellness' | 'growth' | 'sisterhood';
  icon: string;
  targetCount: number;
  completedCount: number;
  completedToday: boolean;
}

const STORAGE_KEY = 'generouslee_habit_tracker';

const INITIAL_HABITS: HabitGoal[] = [
  {
    id: 'habit-spiritual',
    pathName: 'Spiritual Stillness & Prayer',
    title: 'Daily Scripture Meditation',
    targetDescription: '10 minutes of unhurried silence and Psalm reflection',
    category: 'spiritual',
    icon: '🕊️',
    targetCount: 7,
    completedCount: 5,
    completedToday: true
  },
  {
    id: 'habit-wellness',
    pathName: 'Temple Care & Physical Rest',
    title: 'Nervous System Reset',
    targetDescription: '3 hydration intervals and a 15-minute restorative walk',
    category: 'wellness',
    icon: '🌿',
    targetCount: 7,
    completedCount: 4,
    completedToday: false
  },
  {
    id: 'habit-growth',
    pathName: 'Wisdom & Academy Study',
    title: 'Module Reading or Guide',
    targetDescription: 'Study 1 faith-based guide or masterclass video unit',
    category: 'growth',
    icon: '📖',
    targetCount: 5,
    completedCount: 3,
    completedToday: false
  },
  {
    id: 'habit-sisterhood',
    pathName: 'Covenant Grace & Sisterhood',
    title: 'Encouragement Offering',
    targetDescription: 'Speak a word of grace to your spouse, child, or sister',
    category: 'sisterhood',
    icon: '🤝',
    targetCount: 3,
    completedCount: 2,
    completedToday: true
  }
];

export const HabitGoalTracker: React.FC = () => {
  const [habits, setHabits] = useState<HabitGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });

  const [streakDays, setStreakDays] = useState<number>(6);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [trackerMode, setTrackerMode] = useState<'cadence' | 'calendar'>('cadence');
  const [recentlyCompletedId, setRecentlyCompletedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch {
      // Ignore
    }
  }, [habits]);

  const handleToggleHabit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const willBeCompleted = !habit.completedToday;
    const newCount = willBeCompleted
      ? Math.min(habit.targetCount, habit.completedCount + 1)
      : Math.max(0, habit.completedCount - 1);

    setHabits(prev =>
      prev.map(h => {
        if (h.id === habitId) {
          return {
            ...h,
            completedToday: willBeCompleted,
            completedCount: newCount
          };
        }
        return h;
      })
    );

    // Sync habit completion into persistent monthly calendar tracking ledger
    saveDayHabitCompletion('2026-09-17', habit.title, willBeCompleted);

    if (willBeCompleted) {
      playGoalCelebrationChime(528);
      setRecentlyCompletedId(habitId);
      setTimeout(() => setRecentlyCompletedId(null), 2500);

      setToastMessage(`Progress logged for ${habit.title}! +25 Growth Points ✨`);
      setTimeout(() => setToastMessage(null), 3000);
      try {
        await api.logGrowthAction('complete_module');
      } catch {
        // Fallback gracefully
      }
    }
  };

  // 7-day visual week
  const daysOfWeek = [
    { label: 'Mon', completed: true, isToday: false },
    { label: 'Tue', completed: true, isToday: false },
    { label: 'Wed', completed: true, isToday: false },
    { label: 'Thu', completed: true, isToday: false },
    { label: 'Fri', completed: true, isToday: false },
    { label: 'Sat', completed: habits.some(h => h.completedToday), isToday: true },
    { label: 'Sun', completed: false, isToday: false }
  ];

  const totalCompleted = habits.reduce((acc, h) => acc + h.completedCount, 0);
  const totalTarget = habits.reduce((acc, h) => acc + h.targetCount, 0);
  const overallPercentage = Math.round((totalCompleted / totalTarget) * 100);

  return (
    <div className="bg-white rounded-3xl border border-[#E7DFD4] p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7DFD4] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#B95B3D]" />
            <h3 className="font-serif text-2xl text-[#211C15]">Personal Development & Habit Tracker</h3>
          </div>
          <p className="text-xs text-[#7E6D56]">
            Track your daily spiritual disciplines, temple rest, and intentional growth goals.
          </p>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF0ED] border border-[#F3DDD7] text-[#B95B3D] text-xs font-semibold">
            <Flame className="w-4 h-4 fill-[#B95B3D]" />
            <span>{streakDays}-Day Grace Streak</span>
          </div>
          <Badge variant="sage" size="sm">
            {overallPercentage}% Complete
          </Badge>
        </div>
      </div>

      {/* View Switcher: Weekly Cadence vs Monthly Calendar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#E7DFD4]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTrackerMode('cadence')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              trackerMode === 'cadence'
                ? 'bg-white text-[#211C15] shadow-xs font-semibold border border-[#E7DFD4]'
                : 'text-[#7E6D56] hover:text-[#211C15]'
            }`}
          >
            Weekly Cadence & Goals
          </button>
          <button
            onClick={() => setTrackerMode('calendar')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              trackerMode === 'calendar'
                ? 'bg-white text-[#B95B3D] shadow-xs font-semibold border border-[#E7DFD4]'
                : 'text-[#7E6D56] hover:text-[#B95B3D]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Monthly Progress Calendar</span>
          </button>
        </div>

        <span className="text-xs text-[#A8957C] pr-2 hidden sm:inline">
          {trackerMode === 'cadence' ? 'Daily check-in mode' : 'Month-at-a-glance record'}
        </span>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 bg-[#EEF2EB] border border-[#D5E0CE] rounded-xl text-xs text-[#5D7052] font-medium flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#5D7052] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Render Mode: Monthly Calendar */}
      {trackerMode === 'calendar' ? (
        <div className="space-y-6">
          <MonthCalendarView />

          {/* Quick Check-in for Today while in Calendar View */}
          <div className="pt-4 border-t border-[#E7DFD4] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#594D3C] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B95B3D]" />
                Today&apos;s Quick Goal Log (Sept 17)
              </span>
              <button
                onClick={() => setTrackerMode('cadence')}
                className="text-xs text-[#B95B3D] hover:underline cursor-pointer"
              >
                Switch to full cadence &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {habits.map(habit => (
                <div
                  key={habit.id}
                  onClick={() => handleToggleHabit(habit.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    habit.completedToday
                      ? 'bg-[#FAF0ED] border-[#F3DDD7] text-[#211C15]'
                      : 'bg-white border-[#E7DFD4] hover:border-[#D2C4B1]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{habit.icon}</span>
                    <div className="space-y-0.5">
                      <div className="text-xs font-medium text-[#211C15]">{habit.title}</div>
                      <div className="text-[10px] text-[#7E6D56] line-clamp-1">{habit.pathName}</div>
                    </div>
                  </div>
                  <div className={`p-1.5 rounded-lg ${habit.completedToday ? 'bg-[#B95B3D] text-white' : 'bg-[#F0EBE1] text-[#A8957C]'}`}>
                    {habit.completedToday ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Render Mode: Weekly Cadence */
        <div className="space-y-6 animate-fade-in">
          {/* Visual Weekly Streak Strip */}
          <div className="bg-[#FAF8F5] rounded-2xl p-4 sm:p-5 border border-[#E7DFD4] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#594D3C] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#B95B3D]" />
                This Week&apos;s Faith & Discipline Cadence
              </span>
              <span className="text-[11px] text-[#A8957C]">5 of 7 Days Active</span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-1">
              {daysOfWeek.map((day, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                    day.isToday
                      ? 'bg-white border-[#B95B3D] shadow-xs ring-1 ring-[#B95B3D]'
                      : day.completed
                      ? 'bg-[#FAF0ED] border-[#F3DDD7]'
                      : 'bg-white/60 border-[#E7DFD4] opacity-70'
                  }`}
                >
                  <span className="text-[11px] font-medium text-[#7E6D56] mb-1">
                    {day.label}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      day.completed
                        ? 'bg-[#B95B3D] text-white'
                        : 'bg-[#F0EBE1] text-[#A8957C]'
                    }`}
                  >
                    {day.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}
                  </div>
                  {day.isToday && (
                    <span className="text-[9px] font-bold text-[#B95B3D] uppercase mt-1">
                      Today
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Personal Development Paths List */}
          <div className="space-y-4">
            {/* Daily Habit Alignment Progress Meter */}
            {(() => {
              const todayCount = habits.filter(h => h.completedToday).length;
              const todayPercent = Math.round((todayCount / habits.length) * 100);
              const allDone = todayCount === habits.length;

              return (
                <div className={`p-4 rounded-2xl border transition-all ${
                  allDone
                    ? 'bg-[#F0F5EE] border-[#D5E0CE]'
                    : 'bg-[#FAF8F5] border-[#E7DFD4]'
                }`}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className={`w-4 h-4 ${allDone ? 'text-[#5D7052]' : 'text-[#B95B3D]'}`} />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#594D3C]">
                        Today&apos;s Sanctuary Alignment
                      </span>
                      {allDone && (
                        <Badge variant="sage" size="sm">
                          100% Anchored ✨
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#211C15]">
                      {todayCount} of {habits.length} Anchored ({todayPercent}%)
                    </span>
                  </div>

                  {/* Animated Alignment Bar */}
                  <div className="w-full h-2.5 bg-[#E7DFD4]/70 rounded-full overflow-hidden relative shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
                        allDone
                          ? 'bg-linear-to-r from-[#5D7052] via-[#6F8862] to-[#4D5E43]'
                          : 'bg-linear-to-r from-[#B95B3D] via-[#D97D54] to-[#C49746]'
                      }`}
                      style={{ width: `${todayPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-progress-shimmer pointer-events-none" />
                    </div>
                  </div>

                  <p className="text-[11px] text-[#7E6D56] mt-2">
                    {allDone
                      ? '“Well done! You have completed all personal development intentions for today. Walk in peace.”'
                      : `Log ${habits.length - todayCount} more habit${habits.length - todayCount > 1 ? 's' : ''} to complete your daily alignment.`}
                  </p>
                </div>
              );
            })()}

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#594D3C]">
                Active Development Paths
              </span>
              <span className="text-xs text-[#A8957C]">Click checkmark to log today</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map(habit => {
                const percent = Math.round((habit.completedCount / habit.targetCount) * 100);
                const isGoalMet = percent >= 100;
                const isJustCompleted = recentlyCompletedId === habit.id;

                return (
                  <div
                    key={habit.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 relative ${
                      isJustCompleted
                        ? 'ring-2 ring-[#B95B3D] bg-[#FAF0ED] border-[#F3DDD7] scale-[1.01]'
                        : habit.completedToday
                        ? 'bg-[#FCFAF7] border-[#D97D54]/50 shadow-xs'
                        : 'bg-white border-[#E7DFD4] hover:border-[#D2C4B1]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl select-none">{habit.icon}</span>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B95B3D]">
                              {habit.pathName}
                            </span>
                            {isGoalMet && (
                              <Badge variant="sage" size="sm">
                                ✨ Goal Met
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-serif text-sm sm:text-base text-[#211C15] font-normal">
                            {habit.title}
                          </h4>
                          <p className="text-xs text-[#7E6D56] line-clamp-1">
                            {habit.targetDescription}
                          </p>
                        </div>
                      </div>

                      {/* Toggle Button */}
                      <button
                        onClick={() => handleToggleHabit(habit.id)}
                        className={`shrink-0 p-2 rounded-xl border transition-all cursor-pointer active:scale-90 duration-200 ${
                          habit.completedToday
                            ? 'bg-[#B95B3D] text-white border-[#B95B3D] shadow-xs'
                            : 'bg-[#FAF8F5] text-[#7E6D56] border-[#D2C4B1] hover:border-[#B95B3D] hover:text-[#B95B3D]'
                        }`}
                        title={habit.completedToday ? 'Mark incomplete' : 'Log habit for today'}
                      >
                        {habit.completedToday ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Enhanced Animated Progress Bar */}
                    <div className="pt-3 mt-3 border-t border-[#F3EFE9] space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-[#594D3C]">
                        <span>Weekly Target: {habit.completedCount} of {habit.targetCount} days</span>
                        <span className={`font-semibold ${isGoalMet ? 'text-[#5D7052]' : 'text-[#B95B3D]'}`}>
                          {percent}%
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-[#F0EBE1] rounded-full overflow-hidden relative shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
                            isGoalMet
                              ? 'bg-linear-to-r from-[#5D7052] via-[#718865] to-[#4F6145]'
                              : 'bg-linear-to-r from-[#B95B3D] via-[#D97D54] to-[#C49746]'
                          }`}
                          style={{ width: `${percent}%` }}
                        >
                          {/* Animated Shimmer sweep */}
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/35 to-transparent animate-progress-shimmer pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick jump to monthly calendar view */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setTrackerMode('calendar')}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#B95B3D] hover:text-[#8D3B23] transition-colors py-2.5 px-5 rounded-xl bg-[#FAF0ED] border border-[#F3DDD7] cursor-pointer shadow-2xs hover:bg-[#F6E5E0]"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Explore Complete Monthly Progress Calendar &rarr;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
