import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  PenLine,
  Heart,
  TrendingUp,
  Award,
  Info,
  X
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  getMonthCompletions,
  DayCompletionRecord
} from '../../utils/calendarTracker';

interface MonthCalendarViewProps {
  onClose?: () => void;
}

export const MonthCalendarView: React.FC<MonthCalendarViewProps> = () => {
  // Use 2026-09 as initial month to match user simulated date, or current system date if newer
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const now = new Date();
    // Default to Sept 2026 if year matches app session
    return new Date(2026, 8, 17);
  });

  const [completions, setCompletions] = useState<Record<string, DayCompletionRecord>>({});
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-09-17');

  useEffect(() => {
    setCompletions(getMonthCompletions());
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (8 = Sept)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 8, 17));
    setSelectedDateStr('2026-09-17');
  };

  // Calendar math (Monday as start of week)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0, Sun=6

  const daysArray: number[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  const formatKey = (dayNum: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Monthly stats
  let totalActiveDays = 0;
  let totalHabitsCount = 0;
  let totalReflectionsCount = 0;

  daysArray.forEach(day => {
    const k = formatKey(day);
    const rec = completions[k];
    if (rec) {
      const hasHabits = rec.habitsCompleted && rec.habitsCompleted.length > 0;
      const hasRefl = rec.reflectionCompleted;
      if (hasHabits || hasRefl) totalActiveDays++;
      if (hasHabits) totalHabitsCount += rec.habitsCompleted.length;
      if (hasRefl) totalReflectionsCount++;
    }
  });

  const selectedRecord = completions[selectedDateStr];
  const selectedDateObj = new Date(selectedDateStr + 'T00:00:00');
  const selectedFormatted = isNaN(selectedDateObj.getTime())
    ? selectedDateStr
    : selectedDateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

  const isToday = (dayNum: number) => {
    return formatKey(dayNum) === '2026-09-17';
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Month Navigator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E7DFD4]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white border border-[#E7DFD4] text-[#B95B3D] shadow-2xs">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-xl sm:text-2xl text-[#211C15] font-normal">
              {monthNames[month]} {year}
            </h4>
            <p className="text-xs text-[#7E6D56]">
              Visual history of your daily spiritual disciplines & reflections
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleToday}
            className="text-xs px-3 py-1.5 rounded-xl border border-[#D2C4B1] bg-white text-[#594D3C] hover:border-[#B95B3D] hover:text-[#B95B3D] transition-colors font-medium cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center border border-[#D2C4B1] rounded-xl bg-white overflow-hidden shadow-2xs">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-[#7E6D56] hover:text-[#211C15] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-[#E7DFD4]" />
            <button
              onClick={handleNextMonth}
              className="p-2 text-[#7E6D56] hover:text-[#211C15] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3 rounded-xl border border-[#E7DFD4] space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8957C]">Active Days</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-lg font-bold text-[#211C15]">{totalActiveDays}</span>
            <span className="text-[11px] text-[#7E6D56]">/ {daysInMonth} days</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-[#E7DFD4] space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B95B3D]">Habits Logged</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-lg font-bold text-[#B95B3D]">{totalHabitsCount}</span>
            <span className="text-[11px] text-[#7E6D56]">disciplines</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-[#E7DFD4] space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5D7052]">Reflections</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-lg font-bold text-[#5D7052]">{totalReflectionsCount}</span>
            <span className="text-[11px] text-[#7E6D56]">entries</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-[#E7DFD4] space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C49746]">Consistency</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-lg font-bold text-[#C49746]">
              {Math.round((totalActiveDays / daysInMonth) * 100)}%
            </span>
            <span className="text-[11px] text-[#7E6D56]">pace</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-2xl border border-[#E7DFD4] p-3 sm:p-5 shadow-2xs space-y-3">
        {/* Day-of-Week Headers */}
        <div className="grid grid-cols-7 text-center border-b border-[#F3EFE9] pb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <span key={day} className="text-[11px] font-bold uppercase tracking-wider text-[#7E6D56]">
              {day}
            </span>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty prefix cells for month start */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="min-h-[58px] sm:min-h-[66px] rounded-xl bg-[#FAF8F5]/40 border border-transparent"
            />
          ))}

          {/* Actual Month Days */}
          {daysArray.map(dayNum => {
            const dateKey = formatKey(dayNum);
            const record = completions[dateKey];
            const hasHabits = Boolean(record && record.habitsCompleted && record.habitsCompleted.length > 0);
            const hasReflection = Boolean(record && record.reflectionCompleted);
            const hasBoth = hasHabits && hasReflection;
            const isCurrentToday = isToday(dayNum);
            const isSelected = selectedDateStr === dateKey;

            return (
              <button
                key={dateKey}
                onClick={() => setSelectedDateStr(dateKey)}
                className={`relative flex flex-col items-center justify-between p-1.5 sm:p-2 rounded-xl text-left border transition-all cursor-pointer min-h-[58px] sm:min-h-[66px] ${
                  isSelected
                    ? 'border-[#B95B3D] ring-2 ring-[#B95B3D]/30 bg-[#FCFAF7] shadow-xs'
                    : hasBoth
                    ? 'border-[#EAD3CA] bg-[#FAF3F0] hover:border-[#B95B3D]'
                    : hasHabits
                    ? 'border-[#E7DFD4] bg-[#FBF9F6] hover:border-[#D2C4B1]'
                    : hasReflection
                    ? 'border-[#DDE6D8] bg-[#F5F8F3] hover:border-[#5D7052]'
                    : 'border-[#F3EFE9] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                {/* Day Number & Today indicator */}
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      isCurrentToday
                        ? 'w-5 h-5 rounded-full bg-[#B95B3D] text-white flex items-center justify-center font-bold text-[11px]'
                        : isSelected
                        ? 'text-[#B95B3D] font-bold'
                        : 'text-[#383025]'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {hasBoth && (
                    <Sparkles className="w-3 h-3 text-[#C49746] shrink-0" title="Full Alignment Day" />
                  )}
                </div>

                {/* Progress Indicators */}
                <div className="w-full flex flex-wrap items-center gap-1 justify-center mt-1">
                  {hasBoth ? (
                    <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#B95B3D] text-white text-[9px] font-bold tracking-tight">
                      <span>{record?.habitsCompleted.length}</span>
                      <span>+</span>
                      <PenLine className="w-2.5 h-2.5" />
                    </div>
                  ) : (
                    <>
                      {hasHabits && (
                        <span
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#FAF0ED] text-[#B95B3D] border border-[#F3DDD7] text-[9px] font-bold"
                          title={`${record?.habitsCompleted.length} habits completed`}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-[#B95B3D]" />
                          <span>{record?.habitsCompleted.length}</span>
                        </span>
                      )}

                      {hasReflection && (
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#EEF2EB] text-[#5D7052] border border-[#D5E0CE] text-[9px] font-bold"
                          title="Daily Reflection logged"
                        >
                          <PenLine className="w-2.5 h-2.5" />
                        </span>
                      )}

                      {!hasHabits && !hasReflection && (
                        <span className="w-1 h-1 rounded-full bg-[#E7DFD4]" />
                      )}
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3 border-t border-[#F3EFE9] text-[11px] text-[#7E6D56]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B95B3D]" />
            <span>Habits Logged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5D7052]" />
            <span>Reflection Logged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#C49746]" />
            <span>Full Alignment (Both)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E7DFD4]" />
            <span>Rest / Grace Day</span>
          </div>
        </div>
      </div>

      {/* Selected Day Details Card */}
      <div className="bg-[#FAF8F5] rounded-2xl border border-[#E7DFD4] p-4 sm:p-5 space-y-3 animate-fade-in">
        <div className="flex items-center justify-between border-b border-[#E7DFD4] pb-2.5">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#B95B3D]" />
            <h5 className="font-serif text-base text-[#211C15] font-semibold">
              {selectedFormatted}
            </h5>
          </div>

          <div>
            {selectedRecord && (selectedRecord.habitsCompleted.length > 0 || selectedRecord.reflectionCompleted) ? (
              <Badge
                variant={
                  selectedRecord.habitsCompleted.length > 0 && selectedRecord.reflectionCompleted
                    ? 'terracotta'
                    : selectedRecord.habitsCompleted.length > 0
                    ? 'gold'
                    : 'sage'
                }
                size="sm"
              >
                {selectedRecord.habitsCompleted.length > 0 && selectedRecord.reflectionCompleted
                  ? 'Full Alignment'
                  : selectedRecord.habitsCompleted.length > 0
                  ? `${selectedRecord.habitsCompleted.length} Goals Logged`
                  : 'Reflection Completed'}
              </Badge>
            ) : (
              <Badge variant="outline" size="sm">
                Grace & Rest Day
              </Badge>
            )}
          </div>
        </div>

        {/* Day Content Breakdown */}
        {selectedRecord && (selectedRecord.habitsCompleted.length > 0 || selectedRecord.reflectionCompleted) ? (
          <div className="space-y-3">
            {/* Habits checked */}
            {selectedRecord.habitsCompleted.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#594D3C] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B95B3D]" />
                  Disciplines Completed ({selectedRecord.habitsCompleted.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRecord.habitsCompleted.map((h, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#E7DFD4] text-xs text-[#211C15] font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reflection record */}
            {selectedRecord.reflectionCompleted && (
              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#E7DFD4]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5D7052] flex items-center gap-1">
                    <PenLine className="w-3.5 h-3.5 text-[#5D7052]" />
                    Daily Reflection Record
                  </span>
                  {selectedRecord.mood && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2EB] text-[#5D7052] capitalize font-medium">
                      Mood: {selectedRecord.mood}
                    </span>
                  )}
                </div>

                {selectedRecord.reflectionSnippet && (
                  <p className="text-xs text-[#383025] italic leading-relaxed">
                    &ldquo;{selectedRecord.reflectionSnippet}...&rdquo;
                  </p>
                )}

                {selectedRecord.gratitudeSnippet && (
                  <div className="pt-2 border-t border-[#F3EFE9] text-[11px] text-[#B95B3D] flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-[#B95B3D]" />
                    <span><strong>Gratitude:</strong> {selectedRecord.gratitudeSnippet}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="py-2 text-xs text-[#7E6D56] italic">
            No specific goals or journal reflections were logged on this date. A peaceful day of rest and receiving God&apos;s grace.
          </div>
        )}
      </div>
    </div>
  );
};
