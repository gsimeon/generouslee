import React, { useState, useEffect, useMemo } from 'react';
import {
  PenLine,
  Heart,
  Mountain,
  Sparkles,
  Lock,
  Save,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Trash2,
  Calendar,
  Smile,
  Download,
  FileText,
  Printer,
  X,
  Tag,
  Filter,
  ArrowUpDown,
  Search,
  Camera,
  Mic,
  Image as ImageIcon,
  Shuffle,
  BookOpen,
  Maximize2
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import { JournalEntry } from '../../types';
import { exportReflectionsToText, exportReflectionsToPDF } from '../../utils/exportJournal';
import { syncReflectionToCalendar, syncAllJournalEntriesToCalendar } from '../../utils/calendarTracker';
import { getPromptOfTheDay, REFLECTION_PROMPT_LIBRARY, ReflectionPromptItem } from '../../data/reflectionPrompts';
import { PromptLibraryModal } from './PromptLibraryModal';
import { PhotoCaptureModal } from './PhotoCaptureModal';
import { VoiceRecorderModal } from './VoiceRecorderModal';

interface DailyReflectionCardProps {
  onReflectionSaved?: (entry: JournalEntry) => void;
}

type ReflectionMode = 'gratitude' | 'challenge' | 'both';
type SortOption = 'newest' | 'oldest' | 'words_desc' | 'sentiment_desc';

const CATEGORY_OPTIONS = [
  'Motherhood',
  'Faith',
  'Career',
  'Marriage',
  'Health & Temple',
  'Personal Growth'
] as const;

export const DailyReflectionCard: React.FC<DailyReflectionCardProps> = ({ onReflectionSaved }) => {
  const [mode, setMode] = useState<ReflectionMode>('gratitude');
  const [gratitudeText, setGratitudeText] = useState('');
  const [challengeText, setChallengeText] = useState('');
  const [growthTakeaway, setGrowthTakeaway] = useState('');
  const [selectedMood, setSelectedMood] = useState<'peaceful' | 'seeking' | 'grateful' | 'restless' | 'strengthened'>('peaceful');
  const [selectedCategory, setSelectedCategory] = useState<string>('Motherhood');
  const [isSaving, setIsSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [recentReflections, setRecentReflections] = useState<JournalEntry[]>([]);
  const [showPastList, setShowPastList] = useState(false);

  // Prompt of the Day State
  const [currentPrompt, setCurrentPrompt] = useState<ReflectionPromptItem>(() => getPromptOfTheDay());
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);

  // Photo Attachment State
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [attachedPhotoCaption, setAttachedPhotoCaption] = useState<string>('');

  // Voice-to-Text State
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [usedVoiceTranscription, setUsedVoiceTranscription] = useState(false);

  // Lightbox Zoom State
  const [zoomImage, setZoomImage] = useState<{ url: string; caption?: string } | null>(null);

  // Filtering & Sorting State for Historical Reflections
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Export Journal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportFeedbackMsg, setExportFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadEntries() {
      try {
        const entries = await api.getJournalEntries();
        setRecentReflections(entries);
        syncAllJournalEntriesToCalendar(entries);
      } catch {
        // Ignore fallback
      }
    }
    loadEntries();
  }, []);

  const handleSelectPrompt = (promptItem: ReflectionPromptItem) => {
    setCurrentPrompt(promptItem);
    if (promptItem.suggestedMode === 'gratitude') {
      setMode('gratitude');
    } else if (promptItem.suggestedMode === 'challenge') {
      setMode('challenge');
    } else {
      setMode('both');
    }

    // Map prompt category to general category option if applicable
    const catMap: Record<string, string> = {
      motherhood: 'Motherhood',
      faith: 'Faith',
      peace: 'Faith',
      release: 'Personal Growth',
      temple: 'Health & Temple',
      gratitude: 'Faith'
    };
    if (catMap[promptItem.category]) {
      setSelectedCategory(catMap[promptItem.category]);
    }
  };

  const handleRandomPrompt = () => {
    const nextList = REFLECTION_PROMPT_LIBRARY.filter(p => p.id !== currentPrompt.id);
    const chosen = nextList[Math.floor(Math.random() * nextList.length)] || REFLECTION_PROMPT_LIBRARY[0];
    handleSelectPrompt(chosen);
  };

  const handleVoiceTranscript = (text: string, targetField: 'gratitude' | 'challenge' | 'takeaway') => {
    setUsedVoiceTranscription(true);
    if (targetField === 'gratitude') {
      setGratitudeText(prev => (prev ? `${prev} ${text}` : text).trim());
      if (mode === 'challenge') setMode('both');
    } else if (targetField === 'challenge') {
      setChallengeText(prev => (prev ? `${prev} ${text}` : text).trim());
      if (mode === 'gratitude') setMode('both');
    } else {
      setGrowthTakeaway(prev => (prev ? `${prev} ${text}` : text).trim());
    }
  };

  const handleExportText = (entriesToExport: JournalEntry[] = filteredAndSortedReflections) => {
    if (entriesToExport.length === 0) return;
    exportReflectionsToText(entriesToExport);
    setExportFeedbackMsg(`Exported ${entriesToExport.length} reflection${entriesToExport.length > 1 ? 's' : ''} as plain text (.txt)!`);
    setTimeout(() => setExportFeedbackMsg(null), 3500);
    setShowExportModal(false);
  };

  const handleExportPDF = async (entriesToExport: JournalEntry[] = filteredAndSortedReflections) => {
    if (entriesToExport.length === 0) return;
    setIsExportingPDF(true);
    try {
      await exportReflectionsToPDF(entriesToExport);
      setExportFeedbackMsg(`Exported ${entriesToExport.length} reflection${entriesToExport.length > 1 ? 's' : ''} to PDF document (.pdf)!`);
      setTimeout(() => setExportFeedbackMsg(null), 3500);
      setShowExportModal(false);
    } catch (err) {
      console.error('Failed to export PDF', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleSave = async () => {
    const hasGratitude = gratitudeText.trim().length > 0;
    const hasChallenge = challengeText.trim().length > 0;

    if (!hasGratitude && !hasChallenge && !attachedPhoto) return;

    setIsSaving(true);
    try {
      let promptTitle = currentPrompt.prompt || 'Daily Reflection';
      let reflectionBody = '';

      if (mode === 'gratitude') {
        reflectionBody = gratitudeText;
      } else if (mode === 'challenge') {
        reflectionBody = challengeText;
      } else {
        reflectionBody = `Gratitude:\n${gratitudeText}\n\nChallenge Faced & Grace Needed:\n${challengeText}`;
      }

      if (growthTakeaway.trim()) {
        reflectionBody += `\n\nGrowth Takeaway / Prayer:\n${growthTakeaway.trim()}`;
      }

      const words = reflectionBody.trim().split(/\s+/).filter(Boolean).length;
      const emojiMap: Record<string, string> = {
        peaceful: '🕊️',
        grateful: '🙏',
        seeking: '🌤️',
        strengthened: '🌿',
        restless: '⚡'
      };

      const newEntry = await api.saveJournalEntry({
        prompt: promptTitle,
        scriptureReference: currentPrompt.scriptureAnchor || (
          mode === 'challenge'
            ? '2 Corinthians 12:9 — "My grace is sufficient for you, for my power is made perfect in weakness."'
            : '1 Thessalonians 5:18 — "Give thanks in all circumstances; for this is God’s will for you in Christ Jesus."'
        ),
        reflectionText: reflectionBody,
        gratitudeNote: hasGratitude ? gratitudeText.trim() : undefined,
        photoUrl: attachedPhoto || undefined,
        photoCaption: attachedPhotoCaption.trim() || undefined,
        voiceTranscribed: usedVoiceTranscription,
        promptCategory: currentPrompt.categoryLabel,
        category: selectedCategory,
        moodTag: selectedMood,
        moodEmoji: emojiMap[selectedMood] || '🕊️',
        wordCount: words,
        sentimentScore: selectedMood === 'grateful' ? 95 : selectedMood === 'peaceful' ? 92 : selectedMood === 'strengthened' ? 88 : 78
      });

      setRecentReflections(prev => [newEntry, ...prev]);
      syncReflectionToCalendar(newEntry);
      setGratitudeText('');
      setChallengeText('');
      setGrowthTakeaway('');
      setAttachedPhoto(null);
      setAttachedPhotoCaption('');
      setUsedVoiceTranscription(false);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 3500);

      try {
        await api.logGrowthAction('journal_entry');
      } catch {
        // Fallback
      }

      if (onReflectionSaved) {
        onReflectionSaved(newEntry);
      }
    } catch (err) {
      console.error('Failed to save daily reflection', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteJournalEntry(id);
      setRecentReflections(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // Filter and Sort historical entries
  const filteredAndSortedReflections = useMemo(() => {
    return recentReflections
      .filter(entry => {
        // Category filter
        if (filterCategory !== 'all') {
          const entryCat = (entry.category || 'Faith').toLowerCase();
          if (entryCat !== filterCategory.toLowerCase()) return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchText = entry.reflectionText.toLowerCase().includes(q) ||
            entry.prompt.toLowerCase().includes(q) ||
            (entry.gratitudeNote && entry.gratitudeNote.toLowerCase().includes(q)) ||
            (entry.category && entry.category.toLowerCase().includes(q));
          if (!matchText) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'words_desc') {
          const wordsA = a.wordCount ?? a.reflectionText.trim().split(/\s+/).filter(Boolean).length;
          const wordsB = b.wordCount ?? b.reflectionText.trim().split(/\s+/).filter(Boolean).length;
          return wordsB - wordsA;
        }
        if (sortBy === 'sentiment_desc') {
          const sentA = a.sentimentScore ?? 80;
          const sentB = b.sentimentScore ?? 80;
          return sentB - sentA;
        }
        return 0;
      });
  }, [recentReflections, filterCategory, sortBy, searchQuery]);

  const getCategoryBadgeVariant = (cat?: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('mother')) return 'terracotta';
    if (c.includes('faith')) return 'gold';
    if (c.includes('career')) return 'default';
    if (c.includes('marriage')) return 'terracotta';
    if (c.includes('temple') || c.includes('health')) return 'sage';
    return 'gold';
  };

  return (
    <div id="daily-reflection" className="bg-[#FAF8F5] rounded-3xl border border-[#E7DFD4] p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7DFD4] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-[#B95B3D]" />
            <h3 className="font-serif text-2xl text-[#211C15]">Daily Reflection & Growth</h3>
          </div>
          <p className="text-xs text-[#7E6D56]">
            Pause before God to log one gratitude or one challenge for today to foster intentional spiritual growth.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5D7052] bg-[#EEF2EB] px-2.5 py-1 rounded-full">
            <Lock className="w-3 h-3" /> Private Sanctuary
          </span>

          {recentReflections.length > 0 && (
            <button
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-xl bg-white border border-[#D2C4B1] text-[#594D3C] hover:border-[#B95B3D] hover:text-[#B95B3D] transition-colors cursor-pointer shadow-2xs"
              title="Export reflections to PDF or Text"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Journal</span>
            </button>
          )}

          <button
            onClick={() => setShowPastList(!showPastList)}
            className="text-xs font-semibold text-[#B95B3D] hover:underline inline-flex items-center gap-1 cursor-pointer py-1"
          >
            {showPastList ? 'Hide Log' : `View Log (${recentReflections.length})`}
            {showPastList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Export Success Toast */}
      {exportFeedbackMsg && (
        <div className="p-3 bg-[#EEF2EB] border border-[#D5E0CE] rounded-xl text-xs text-[#5D7052] font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-[#5D7052] shrink-0" />
          <span>{exportFeedbackMsg}</span>
        </div>
      )}

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#F0EBE1] rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setMode('gratitude')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            mode === 'gratitude'
              ? 'bg-white text-[#211C15] shadow-2xs font-semibold'
              : 'text-[#7E6D56] hover:text-[#211C15]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-[#B95B3D] fill-[#B95B3D]" />
          Log One Gratitude
        </button>

        <button
          type="button"
          onClick={() => setMode('challenge')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            mode === 'challenge'
              ? 'bg-white text-[#211C15] shadow-2xs font-semibold'
              : 'text-[#7E6D56] hover:text-[#211C15]'
          }`}
        >
          <Mountain className="w-3.5 h-3.5 text-[#5D7052]" />
          Log One Challenge
        </button>

        <button
          type="button"
          onClick={() => setMode('both')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            mode === 'both'
              ? 'bg-white text-[#211C15] shadow-2xs font-semibold'
              : 'text-[#7E6D56] hover:text-[#211C15]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C49746]" />
          Both (Full Alignment)
        </button>
      </div>

      {/* Prompt of the Day & Guided Library Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7DFD4] space-y-3 shadow-2xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#B95B3D] bg-[#FAF0ED] border border-[#F3DDD7] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span>{currentPrompt.categoryEmoji}</span>
              <span>Prompt of the Day: {currentPrompt.categoryLabel}</span>
            </span>
            <Badge variant={mode === 'gratitude' ? 'terracotta' : mode === 'challenge' ? 'sage' : 'gold'} size="sm">
              {mode === 'gratitude' ? 'Gratitude Focus' : mode === 'challenge' ? 'Challenge Focus' : 'Full Alignment'}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleRandomPrompt}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold text-[#594D3C] bg-[#FAF8F5] hover:bg-[#F0EBE1] border border-[#E7DFD4] transition-colors cursor-pointer"
              title="Rotate to next prompt"
            >
              <Shuffle className="w-3 h-3 text-[#B95B3D]" />
              <span>Next</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPromptLibrary(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold text-[#B95B3D] bg-[#FAF0ED] hover:bg-[#F3DDD7] border border-[#F3DDD7] transition-colors cursor-pointer"
              title="Browse library of guided topics"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Library (12+ Topics)</span>
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="font-serif text-base sm:text-lg text-[#211C15] font-medium leading-snug">
            “{currentPrompt.prompt}”
          </h4>
          <p className="text-[11px] text-[#5D7052] italic">
            {currentPrompt.scriptureAnchor}
          </p>
          <p className="text-[11px] text-[#7E6D56]">
            {currentPrompt.placeholderHint}
          </p>
        </div>
      </div>

      {/* Reflection Input Tools: Voice-to-Text & Photo Attachment */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Voice-to-Text Button */}
          <button
            type="button"
            onClick={() => setShowVoiceRecorder(true)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
              usedVoiceTranscription
                ? 'bg-[#EEF2EB] text-[#3D5A2E] border-[#C3D4BC]'
                : 'bg-white text-[#594D3C] border-[#D2C4B1] hover:border-[#B95B3D] hover:text-[#B95B3D]'
            }`}
          >
            <Mic className={`w-3.5 h-3.5 ${usedVoiceTranscription ? 'text-[#3D5A2E]' : 'text-[#B95B3D]'}`} />
            <span>{usedVoiceTranscription ? 'Speak Again (Voice Added)' : 'Speak Reflection (Voice-to-Text)'}</span>
          </button>

          {/* Photo Attachment Button */}
          <button
            type="button"
            onClick={() => setShowPhotoCapture(true)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
              attachedPhoto
                ? 'bg-[#FAF0ED] text-[#B95B3D] border-[#F3DDD7]'
                : 'bg-white text-[#594D3C] border-[#D2C4B1] hover:border-[#B95B3D] hover:text-[#B95B3D]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#B95B3D]" />
            <span>{attachedPhoto ? 'Change Photo' : 'Attach Photo Memory'}</span>
          </button>
        </div>

        <span className="text-[11px] text-[#A8957C]">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Attached Photo Preview (if any) */}
      {attachedPhoto && (
        <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E7DFD4] flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={attachedPhoto}
              alt="Attached growth memory"
              onClick={() => setZoomImage({ url: attachedPhoto, caption: attachedPhotoCaption })}
              className="w-14 h-14 rounded-xl object-cover border border-[#D2C4B1] cursor-pointer hover:opacity-90 shadow-2xs shrink-0"
              title="Click to view full photo"
            />
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#211C15] flex items-center gap-1">
                <Camera className="w-3 h-3 text-[#B95B3D]" /> Attached Memory Photo
              </span>
              <p className="text-[11px] text-[#7E6D56] truncate">
                {attachedPhotoCaption || 'No caption added (Click photo to preview)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setZoomImage({ url: attachedPhoto, caption: attachedPhotoCaption })}
              className="p-1.5 text-[#A8957C] hover:text-[#211C15] rounded-lg transition-colors cursor-pointer"
              title="View full photo"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setAttachedPhoto(null);
                setAttachedPhotoCaption('');
              }}
              className="p-1.5 text-[#A8957C] hover:text-red-600 rounded-lg transition-colors cursor-pointer"
              title="Remove photo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Fields */}
      <div className="space-y-4">
        {/* Gratitude Input */}
        {(mode === 'gratitude' || mode === 'both') && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#594D3C] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#B95B3D]" />
              Today&apos;s Gratitude Note
            </label>
            <textarea
              rows={mode === 'both' ? 2 : 3}
              value={gratitudeText}
              onChange={(e) => setGratitudeText(e.target.value)}
              placeholder="e.g. My daughter gave me an unprompted hug when I was feeling weary; I had 15 quiet minutes with warm tea before the household woke up..."
              className="w-full p-3.5 rounded-xl border border-[#D2C4B1] bg-white text-sm text-[#211C15] placeholder-[#A8957C] focus:outline-none focus:border-[#B95B3D] focus:ring-1 focus:ring-[#B95B3D] leading-relaxed resize-y"
            />
          </div>
        )}

        {/* Challenge Input */}
        {(mode === 'challenge' || mode === 'both') && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#594D3C] flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-[#5D7052]" />
              Today&apos;s Challenge / Growth Edge
            </label>
            <textarea
              rows={mode === 'both' ? 2 : 3}
              value={challengeText}
              onChange={(e) => setChallengeText(e.target.value)}
              placeholder="e.g. I felt rushed and lost my patience with my spouse; I felt anxiety about upcoming financial commitments and caught myself striving rather than trusting..."
              className="w-full p-3.5 rounded-xl border border-[#D2C4B1] bg-white text-sm text-[#211C15] placeholder-[#A8957C] focus:outline-none focus:border-[#5D7052] focus:ring-1 focus:ring-[#5D7052] leading-relaxed resize-y"
            />
          </div>
        )}

        {/* Growth Takeaway or Prayer whisper */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#594D3C] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C49746]" />
            Personal Growth Anchor / Prayer Whisper (Optional)
          </label>
          <input
            type="text"
            value={growthTakeaway}
            onChange={(e) => setGrowthTakeaway(e.target.value)}
            placeholder="e.g. Lord, teach me to breathe and respond in love rather than hurry..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2C4B1] bg-white text-xs text-[#211C15] placeholder-[#A8957C] focus:outline-none focus:border-[#B95B3D]"
          />
        </div>

        {/* Category Tagging & Mood Selectors */}
        <div className="space-y-3 pt-2 border-t border-[#E7DFD4]">
          {/* Category Tagging */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#594D3C] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#B95B3D]" />
              Tag Category (Motherhood, Faith, Career...)
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#B95B3D] text-white border-[#B95B3D] shadow-2xs font-semibold'
                      : 'bg-white text-[#594D3C] border-[#D2C4B1] hover:border-[#B95B3D]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#594D3C]">
              Spirit State
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: 'peaceful', label: '🕊️ Peaceful' },
                { key: 'grateful', label: '🙏 Grateful' },
                { key: 'strengthened', label: '🌿 Strengthened' },
                { key: 'seeking', label: '🌤️ Seeking' },
                { key: 'restless', label: '⚡ Restless' }
              ].map(mood => (
                <button
                  key={mood.key}
                  type="button"
                  onClick={() => setSelectedMood(mood.key as any)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                    selectedMood === mood.key
                      ? 'bg-[#5D7052] text-white border-[#5D7052] font-semibold'
                      : 'bg-white text-[#7E6D56] border-[#D2C4B1] hover:border-[#5D7052]'
                  }`}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save & Feedback Action */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E7DFD4]">
          <span className="text-xs text-[#A8957C]">
            Anchor your growth daily
          </span>

          <div className="flex items-center gap-3">
            {savedFeedback && (
              <span className="text-xs text-[#5D7052] flex items-center gap-1.5 font-semibold animate-fade-in">
                <CheckCircle className="w-4 h-4 text-[#5D7052]" />
                Daily Reflection Saved to Your Sanctuary!
              </span>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={isSaving || (!gratitudeText.trim() && !challengeText.trim())}
              icon={<Save className="w-3.5 h-3.5" />}
            >
              {isSaving ? 'Preserving...' : 'Log Reflection'}
            </Button>
          </div>
        </div>
      </div>

      {/* Past Logged Entries with Category Filtering & Sorting */}
      {showPastList && (
        <div className="pt-4 border-t border-[#E7DFD4] space-y-4 animate-fade-in">
          {/* Top Bar: Title & Export Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#594D3C] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#B95B3D]" />
              Archived Daily Reflections ({filteredAndSortedReflections.length} of {recentReflections.length})
            </h4>

            {recentReflections.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportText()}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#594D3C] hover:text-[#B95B3D] px-2.5 py-1 rounded-lg border border-[#E7DFD4] bg-white cursor-pointer transition-colors shadow-2xs hover:border-[#B95B3D]"
                  title="Download filtered reflections as plain text"
                >
                  <FileText className="w-3 h-3" />
                  <span>Export Text (.txt)</span>
                </button>
                <button
                  onClick={() => handleExportPDF()}
                  disabled={isExportingPDF}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#B95B3D] hover:text-[#8D3B23] px-2.5 py-1 rounded-lg border border-[#F3DDD7] bg-[#FAF0ED] cursor-pointer transition-colors shadow-2xs hover:bg-[#F5E1DB]"
                  title="Download filtered reflections as a formatted PDF"
                >
                  <Download className="w-3 h-3" />
                  <span>{isExportingPDF ? 'Generating PDF...' : 'Export PDF'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Filtering & Sorting Controls Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E7DFD4] space-y-3">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-[#7E6D56] uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#B95B3D]" /> Category:
              </span>
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`text-xs px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-[#211C15] text-white border-[#211C15] font-semibold'
                    : 'bg-[#FAF8F5] text-[#594D3C] border-[#E7DFD4] hover:border-[#B95B3D]'
                }`}
              >
                All ({recentReflections.length})
              </button>
              {CATEGORY_OPTIONS.map(cat => {
                const count = recentReflections.filter(r => (r.category || 'Faith').toLowerCase() === cat.toLowerCase()).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                      filterCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-[#B95B3D] text-white border-[#B95B3D] font-semibold'
                        : 'bg-[#FAF8F5] text-[#594D3C] border-[#E7DFD4] hover:border-[#B95B3D]'
                    }`}
                  >
                    {cat} {count > 0 && `(${count})`}
                  </button>
                );
              })}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-[#F3EFE9]">
              {/* Search input */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-[#A8957C] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reflection text or gratitude..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#D2C4B1] bg-[#FAF8F5] text-xs text-[#211C15] placeholder-[#A8957C] focus:outline-none focus:border-[#B95B3D]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-[#A8957C] hover:text-[#211C15]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-[#594D3C]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#B95B3D]" />
                <span className="font-medium text-[11px]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-2.5 py-1.5 rounded-xl border border-[#D2C4B1] bg-[#FAF8F5] text-xs text-[#211C15] focus:outline-none focus:border-[#B95B3D]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="words_desc">Longest Entry (Word Count)</option>
                  <option value="sentiment_desc">Highest Peace Score</option>
                </select>
              </div>
            </div>
          </div>

          {filteredAndSortedReflections.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-[#E7DFD4] text-xs text-[#7E6D56] space-y-1">
              <p className="font-medium text-[#211C15]">No matching reflections found</p>
              <p>Try selecting a different category or clearing the search query.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredAndSortedReflections.map(entry => {
                const isChallenge = entry.prompt.toLowerCase().includes('challenge');
                const words = entry.wordCount ?? entry.reflectionText.trim().split(/\s+/).filter(Boolean).length;
                const sentiment = entry.sentimentScore ?? 85;

                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-white border border-[#E7DFD4] space-y-2.5 text-xs hover:border-[#D2C4B1] transition-colors"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#211C15] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#A8957C]" />
                          {entry.date}
                        </span>

                        {/* Category Badge */}
                        <Badge
                          variant={getCategoryBadgeVariant(entry.category)}
                          size="sm"
                        >
                          {entry.category || 'Faith'}
                        </Badge>

                        <Badge
                          variant={isChallenge ? 'sage' : 'terracotta'}
                          size="sm"
                        >
                          {isChallenge ? 'Challenge Log' : 'Gratitude Log'}
                        </Badge>

                        {entry.moodTag && (
                          <span className="text-[11px] text-[#7E6D56] flex items-center gap-1 bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#E7DFD4]">
                            <span>{entry.moodEmoji || '🕊️'}</span>
                            <span className="capitalize">{entry.moodTag}</span>
                          </span>
                        )}

                        {entry.voiceTranscribed && (
                          <span className="text-[10px] text-[#5D7052] font-semibold bg-[#EEF2EB] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#D5E0D0]">
                            <Mic className="w-2.5 h-2.5 text-[#5D7052]" />
                            <span>Voice Dictated</span>
                          </span>
                        )}

                        {entry.photoUrl && (
                          <span className="text-[10px] text-[#B95B3D] font-semibold bg-[#FAF0ED] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#F3DDD7]">
                            <Camera className="w-2.5 h-2.5 text-[#B95B3D]" />
                            <span>Photo Memory</span>
                          </span>
                        )}

                        <span className="text-[10px] text-[#A8957C]">
                          {words} words &bull; {sentiment}% peace
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleExportPDF([entry])}
                          className="text-[#A8957C] hover:text-[#B95B3D] p-1 cursor-pointer transition-colors"
                          title="Export this reflection to PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleExportText([entry])}
                          className="text-[#A8957C] hover:text-[#594D3C] p-1 cursor-pointer transition-colors"
                          title="Export this reflection to Text"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-[#A8957C] hover:text-[#A84848] p-1 cursor-pointer transition-colors ml-1"
                          title="Delete reflection"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[#383025] leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                      {entry.reflectionText}
                    </p>

                    {/* Attached Photo Memory Card in Historical View */}
                    {entry.photoUrl && (
                      <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4] flex items-center gap-3">
                        <img
                          src={entry.photoUrl}
                          alt="Growth memory"
                          onClick={() => setZoomImage({ url: entry.photoUrl!, caption: entry.photoCaption })}
                          className="w-16 h-16 rounded-xl object-cover border border-[#D2C4B1] cursor-pointer hover:opacity-90 shadow-2xs shrink-0"
                          title="Click to zoom memory photo"
                        />
                        <div className="min-w-0 space-y-0.5">
                          <span className="text-[11px] font-semibold text-[#211C15] flex items-center gap-1">
                            <Camera className="w-3 h-3 text-[#B95B3D]" />
                            Visual Memory
                          </span>
                          <p className="text-[11px] text-[#7E6D56] italic line-clamp-2">
                            {entry.photoCaption ? `“${entry.photoCaption}”` : 'Preserved with reflection'}
                          </p>
                          <button
                            type="button"
                            onClick={() => setZoomImage({ url: entry.photoUrl!, caption: entry.photoCaption })}
                            className="text-[10px] font-semibold text-[#B95B3D] hover:underline cursor-pointer flex items-center gap-0.5 pt-0.5"
                          >
                            <Maximize2 className="w-2.5 h-2.5" /> Click to view full image
                          </button>
                        </div>
                      </div>
                    )}

                    {entry.gratitudeNote && !entry.reflectionText.includes(entry.gratitudeNote) && (
                      <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4] text-[#594D3C] text-[11px]">
                        <strong className="text-[#B95B3D]">Gratitude:</strong> {entry.gratitudeNote}
                      </div>
                    )}

                    {entry.scriptureReference && (
                      <div className="text-[11px] text-[#7E6D56] italic pt-1 border-t border-[#F3EFE9]">
                        Anchor: {entry.scriptureReference}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Export Journal Modal Dialog */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#E7DFD4] shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B95B3D]">
                  <Download className="w-3.5 h-3.5" />
                  Personal Journal Export
                </div>
                <h3 className="font-serif text-xl text-[#211C15]">
                  Export Saved Reflections
                </h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 text-[#A8957C] hover:text-[#211C15] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#594D3C] leading-relaxed">
              Export your historical reflections to maintain personal archives, physical prayer binders, or digital journals.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleExportPDF()}
                disabled={isExportingPDF}
                className="w-full p-4 rounded-2xl border border-[#F3DDD7] bg-[#FAF0ED] hover:bg-[#F5E1DB] text-left flex items-start gap-3 transition-colors cursor-pointer group"
              >
                <div className="p-2 rounded-xl bg-[#B95B3D] text-white shrink-0 mt-0.5 shadow-2xs">
                  <Download className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-semibold text-sm text-[#211C15]">
                      Download PDF Document (.pdf)
                    </span>
                    <Badge variant="terracotta" size="sm">Recommended</Badge>
                  </div>
                  <p className="text-xs text-[#7E6D56]">
                    Formatted multi-page document featuring scripture anchors, gratitude notes, and surrendered challenges.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleExportText()}
                className="w-full p-4 rounded-2xl border border-[#E7DFD4] bg-[#FAF8F5] hover:bg-white text-left flex items-start gap-3 transition-colors cursor-pointer group"
              >
                <div className="p-2 rounded-xl bg-white border border-[#D2C4B1] text-[#594D3C] shrink-0 mt-0.5 shadow-2xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-serif font-semibold text-sm text-[#211C15]">
                    Download Plain Text File (.txt)
                  </span>
                  <p className="text-xs text-[#7E6D56]">
                    Universal markdown-ready plain text file suitable for Notion, Obsidian, notes apps, or private backups.
                  </p>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F3EFE9]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt of the Day Library Modal */}
      <PromptLibraryModal
        isOpen={showPromptLibrary}
        onClose={() => setShowPromptLibrary(false)}
        onSelectPrompt={handleSelectPrompt}
        selectedPromptId={currentPrompt.id}
      />

      {/* Photo Capture Modal */}
      <PhotoCaptureModal
        isOpen={showPhotoCapture}
        onClose={() => setShowPhotoCapture(false)}
        onPhotoCaptured={(dataUrl, cap) => {
          setAttachedPhoto(dataUrl);
          setAttachedPhotoCaption(cap || '');
        }}
      />

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={showVoiceRecorder}
        onClose={() => setShowVoiceRecorder(false)}
        onApplyTranscript={handleVoiceTranscript}
        defaultTargetField={mode === 'challenge' ? 'challenge' : 'gratitude'}
      />

      {/* Image Zoom Lightbox Modal */}
      {zoomImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-2xl w-full bg-stone-900 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl flex flex-col">
            <div className="p-3 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between text-white">
              <span className="text-xs font-medium flex items-center gap-1.5 text-stone-300">
                <Camera className="w-4 h-4 text-[#B95B3D]" /> Growth Memory Photo
              </span>
              <button
                onClick={() => setZoomImage(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex items-center justify-center bg-black">
              <img
                src={zoomImage.url}
                alt="Enlarged growth memory"
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            {zoomImage.caption && (
              <div className="p-3 bg-stone-900 border-t border-stone-800 text-center text-xs text-stone-300 italic">
                &ldquo;{zoomImage.caption}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
