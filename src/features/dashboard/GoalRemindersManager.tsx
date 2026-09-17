import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  AlertCircle,
  X,
  Volume2
} from 'lucide-react';
import { GoalReminder, ReminderFrequency } from '../../types';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

interface GoalRemindersManagerProps {
  onGoalCompleted?: (goalTitle: string) => void;
}

const STORAGE_KEY = 'generouslee_goal_reminders';

const DEFAULT_REMINDERS: GoalReminder[] = [
  {
    id: 'rem-1',
    goalTitle: 'Daily Scripture Meditation & Stillness',
    frequency: 'daily',
    timeOfDay: '07:30',
    channel: 'both',
    enabled: true,
    note: 'Start the day rooted in Christ before household demands begin.'
  },
  {
    id: 'rem-2',
    goalTitle: 'Nervous System Reset (5 Slow Breaths)',
    frequency: 'daily',
    timeOfDay: '13:00',
    channel: 'toast',
    enabled: true,
    note: 'Midday pause: breathe deeply, drop shoulders, receive peace.'
  },
  {
    id: 'rem-3',
    goalTitle: 'Personal Development Path & Module Study',
    frequency: 'weekly',
    timeOfDay: '09:00',
    channel: 'toast',
    enabled: true,
    note: 'Dedicate 20 unhurried minutes to wisdom & growth.'
  },
  {
    id: 'rem-4',
    goalTitle: 'Monthly Spiritual Alignment & Financial Review',
    frequency: 'monthly',
    timeOfDay: '10:00',
    channel: 'toast',
    enabled: false,
    note: 'Review God’s provision, family goals, and charitable offerings.'
  }
];

// Helper to play a soft, serene sound using Web Audio API
function playGentleReminderChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle warm chime: E5 (659.25Hz) to G#5 (830.61Hz)
    osc.frequency.setValueAtTime(659.25, now);
    osc.frequency.exponentialRampToValueAtTime(830.61, now + 0.15);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  } catch {
    // Audio might be blocked by autoplay policy until user gesture
  }
}

export const GoalRemindersManager: React.FC<GoalRemindersManagerProps> = ({
  onGoalCompleted
}) => {
  const [reminders, setReminders] = useState<GoalReminder[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  });

  const [activeToast, setActiveToast] = useState<{
    id: string;
    goalTitle: string;
    frequency: string;
    time: string;
  } | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default';
  });

  // Form State
  const [newGoalTitle, setNewGoalTitle] = useState('Daily Scripture Meditation & Stillness');
  const [newFrequency, setNewFrequency] = useState<ReminderFrequency>('daily');
  const [newTime, setNewTime] = useState('08:00');
  const [newChannel, setNewChannel] = useState<'toast' | 'browser_push' | 'both'>('both');
  const [newNote, setNewNote] = useState('');

  const saveRemindersToStorage = (list: GoalReminder[]) => {
    setReminders(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Storage error
    }
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    saveRemindersToStorage(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    saveRemindersToStorage(updated);
  };

  const handleRequestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
      } catch (err) {
        console.warn('Could not request notification permission', err);
      }
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newRem: GoalReminder = {
      id: `rem-${Date.now()}`,
      goalTitle: newGoalTitle.trim(),
      frequency: newFrequency,
      timeOfDay: newTime,
      channel: newChannel,
      enabled: true,
      note: newNote.trim() || undefined
    };

    saveRemindersToStorage([...reminders, newRem]);
    setShowAddModal(false);
    setNewNote('');

    // Trigger preview notification
    triggerLiveReminder(newRem);
  };

  const triggerLiveReminder = (reminder: GoalReminder) => {
    playGentleReminderChime();

    // Show in-app UI toast
    setActiveToast({
      id: reminder.id,
      goalTitle: reminder.goalTitle,
      frequency: reminder.frequency,
      time: reminder.timeOfDay
    });

    // Browser Notification if supported and enabled
    if (
      (reminder.channel === 'browser_push' || reminder.channel === 'both') &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification('Generouslee Reminder', {
          body: `Time for your personal development goal: "${reminder.goalTitle}". Take a breath and step forward.`,
          icon: '/favicon.ico'
        });
      } catch {
        // notification error
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E7DFD4] p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Floating Active Toast Alert (if triggered) */}
      {activeToast && (
        <div className="p-4 rounded-2xl bg-linear-to-r from-[#FAF5EE] to-[#FFFDF9] border border-[#B95B3D]/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#B95B3D] text-white shadow-xs animate-bounce">
              <BellRing className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Badge variant="terracotta" size="sm" className="capitalize">
                  {activeToast.frequency} Reminder &bull; {activeToast.time}
                </Badge>
                <span className="text-[11px] text-[#5D7052] font-semibold flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Gentle Alert
                </span>
              </div>
              <h4 className="font-serif text-base text-[#211C15] font-semibold">
                {activeToast.goalTitle}
              </h4>
              <p className="text-xs text-[#594D3C]">
                Pause, align your heart with God&apos;s peace, and honor your growth discipline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {onGoalCompleted && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onGoalCompleted(activeToast.goalTitle);
                  setActiveToast(null);
                }}
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Mark Done
              </Button>
            )}
            <button
              onClick={() => setActiveToast(null)}
              className="p-1.5 rounded-lg text-[#7E6D56] hover:text-[#211C15] hover:bg-[#F3EFE9] transition-colors cursor-pointer"
              title="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F3EFE9] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#B95B3D]" />
            <h3 className="font-serif text-2xl text-[#211C15]">Goal Reminders & Growth Rhythm</h3>
          </div>
          <p className="text-xs text-[#7E6D56]">
            Configure daily, weekly, or monthly gentle reminders to maintain steady spiritual and personal development.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notificationPermission !== 'granted' && (
            <button
              onClick={handleRequestPushPermission}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-[#594D3C] hover:border-[#B95B3D] hover:text-[#B95B3D] transition-colors cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5 text-[#B95B3D]" />
              Enable Push
            </button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            New Reminder
          </Button>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.map(rem => {
          return (
            <div
              key={rem.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                rem.enabled
                  ? 'bg-[#FAF8F5] border-[#E7DFD4] hover:border-[#D2C4B1]'
                  : 'bg-gray-50/70 border-dashed border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleReminder(rem.id)}
                  className="mt-0.5 text-[#B95B3D] cursor-pointer transition-colors"
                  title={rem.enabled ? 'Click to pause reminder' : 'Click to activate reminder'}
                >
                  {rem.enabled ? (
                    <ToggleRight className="w-6 h-6 text-[#5D7052]" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-[#A8957C]" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-medium text-sm sm:text-base text-[#211C15]">
                      {rem.goalTitle}
                    </span>
                    <Badge
                      variant={rem.frequency === 'daily' ? 'terracotta' : rem.frequency === 'weekly' ? 'gold' : 'sage'}
                      size="sm"
                      className="capitalize"
                    >
                      {rem.frequency} at {rem.timeOfDay}
                    </Badge>
                    <span className="text-[10px] text-[#7E6D56] bg-white px-2 py-0.5 rounded-full border border-[#E7DFD4]">
                      {rem.channel === 'both' ? 'Toast & Push' : rem.channel === 'browser_push' ? 'Browser Push' : 'Toast Alert'}
                    </span>
                  </div>

                  {rem.note && (
                    <p className="text-xs text-[#594D3C]">{rem.note}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => triggerLiveReminder(rem)}
                  className="px-2.5 py-1 text-[11px] font-medium text-[#594D3C] bg-white hover:text-[#B95B3D] hover:border-[#B95B3D] rounded-lg border border-[#D2C4B1] cursor-pointer transition-colors"
                  title="Test alert preview right now"
                >
                  Test Alert
                </button>

                <button
                  onClick={() => handleDeleteReminder(rem.id)}
                  className="p-1.5 text-[#A8957C] hover:text-[#A84848] rounded-lg cursor-pointer transition-colors"
                  title="Remove reminder"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#E7DFD4] shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B95B3D]">
                  <Bell className="w-3.5 h-3.5" />
                  Growth Rhythm
                </div>
                <h3 className="font-serif text-xl text-[#211C15]">
                  Set Goal Reminder
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-[#A8957C] hover:text-[#211C15] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="space-y-4 text-xs">
              {/* Goal Title */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-[#594D3C]">
                  Target Development Goal / Discipline
                </label>
                <select
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D2C4B1] bg-white text-xs text-[#211C15] focus:outline-none focus:border-[#B95B3D]"
                >
                  <option value="Daily Scripture Meditation & Stillness">Daily Scripture Meditation & Stillness</option>
                  <option value="Nervous System Reset (5 Slow Breaths)">Nervous System Reset (5 Slow Breaths)</option>
                  <option value="Module Reading or Study Guide">Module Reading or Study Guide</option>
                  <option value="Encouragement Offering (Text a Sister)">Encouragement Offering (Text a Sister)</option>
                  <option value="Evening Gratitude Reflection">Evening Gratitude Reflection</option>
                  <option value="Temple Care Hydration & Walk">Temple Care Hydration & Walk</option>
                  <option value="Weekly Covenant Marriage Prayer">Weekly Covenant Marriage Prayer</option>
                  <option value="Monthly Purpose Review & Alignment">Monthly Purpose Review & Alignment</option>
                </select>
              </div>

              {/* Frequency Selector */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-[#594D3C]">
                  Cadence
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['daily', 'weekly', 'monthly'] as const).map(freq => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setNewFrequency(freq)}
                      className={`py-2 rounded-xl border capitalize font-semibold transition-all cursor-pointer ${
                        newFrequency === freq
                          ? 'bg-[#B95B3D] text-white border-[#B95B3D]'
                          : 'bg-[#FAF8F5] text-[#594D3C] border-[#D2C4B1] hover:border-[#B95B3D]'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time of Day */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-[#594D3C]">
                  Preferred Time of Day
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D2C4B1] bg-white text-xs text-[#211C15] focus:outline-none focus:border-[#B95B3D]"
                />
              </div>

              {/* Channel */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-[#594D3C]">
                  Alert Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'toast', label: 'Toast Alert' },
                    { id: 'browser_push', label: 'Push Only' },
                    { id: 'both', label: 'Both' }
                  ].map(ch => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setNewChannel(ch.id as any)}
                      className={`py-2 rounded-xl border font-medium transition-all cursor-pointer ${
                        newChannel === ch.id
                          ? 'bg-[#5D7052] text-white border-[#5D7052]'
                          : 'bg-[#FAF8F5] text-[#594D3C] border-[#D2C4B1] hover:border-[#5D7052]'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-[#594D3C]">
                  Personal Anchor Thought (Optional)
                </label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g. Remember His peace is your inheritance..."
                  className="w-full p-2.5 rounded-xl border border-[#D2C4B1] bg-white text-xs text-[#211C15] placeholder-[#A8957C] focus:outline-none focus:border-[#B95B3D]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F3EFE9]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#D2C4B1] text-[#594D3C] hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Set Reminder
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
