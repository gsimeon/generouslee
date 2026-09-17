import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Sparkles,
  Heart,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Send,
  Edit3,
  MessageSquare,
  HelpCircle,
  Award
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { MentorRequestSubmission } from '../../types';
import { playGoalCelebrationChime } from '../../utils/audioChime';

const STORAGE_KEY = 'generouslee_mentor_request';

const LIFE_SEASONS = [
  { id: 'motherhood', label: 'Motherhood & Raising Kingdom Children', icon: '👶' },
  { id: 'devotion', label: 'Spiritual Rekindling & Secret Place Prayer', icon: '🕊️' },
  { id: 'temple', label: 'Temple Stewardship, Nervous System & Rest', icon: '🌿' },
  { id: 'marriage', label: 'Marriage, Covenant Atmosphere & Healing', icon: '💍' },
  { id: 'purpose', label: 'Kingdom Career & Clarifying Life Purpose', icon: '✨' }
];

const GROWTH_INTERESTS = [
  'Daily Devotional Consistency',
  'Overcoming Overwhelm & Chronic Burnout',
  'Gentle Parenting & Peaceful Home Atmosphere',
  'Biblical Mindset & Dismantling Worry',
  'Holistic Nutrition & Temple Vitality',
  'Hearing God\'s Voice in Life Transitions',
  'Covenant Marriage Communication',
  'Intercession & Spiritual Warfare',
  'Healthy Emotional Boundaries'
];

const CADENCE_OPTIONS = [
  { id: 'biweekly-1on1', label: 'Bi-Weekly 1-on-1 Spiritual Guidance (Video / Audio)', badge: 'Most Popular' },
  { id: 'monthly-cohort', label: 'Monthly Guided Sisterhood Mentorship Circle', badge: 'Community Focus' },
  { id: 'async-voice', label: 'Asynchronous Audio Exchange & Weekly Prayer', badge: 'Flexible Pace' }
];

export const RequestMentorSection: React.FC = () => {
  const [submission, setSubmission] = useState<MentorRequestSubmission | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(LIFE_SEASONS[0].label);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Daily Devotional Consistency',
    'Overcoming Overwhelm & Chronic Burnout'
  ]);
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [preferredCadence, setPreferredCadence] = useState(CADENCE_OPTIONS[0].label);
  const [additionalContext, setAdditionalContext] = useState('');
  const [formSubmittedToast, setFormSubmittedToast] = useState(false);

  useEffect(() => {
    if (submission) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(submission));
      } catch {
        // Ignore
      }
    }
  }, [submission]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(prev => prev.filter(i => i !== interest));
      }
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine preliminary mentor match based on season / interests
    let matchedMentorName = 'Latisha Langley';
    let matchedMentorRole = 'Founder & Spiritual Formation Director';
    let matchNotes = 'Matched with Latisha based on your focus on devotional rhythm and motherhood balance.';

    if (selectedSeason.includes('Temple') || selectedInterests.some(i => i.includes('Nutrition') || i.includes('Burnout'))) {
      matchedMentorName = 'Dr. Andrea Vance';
      matchedMentorRole = 'Nervous System & Holistic Temple Health Mentor';
      matchNotes = 'Matched with Dr. Vance for somatic grounding, hormone balance, and restorative rest.';
    } else if (selectedSeason.includes('Marriage')) {
      matchedMentorName = 'Pastor Kimberly Thorne';
      matchedMentorRole = 'Covenant Marriage & Relational Peace Advisor';
      matchNotes = 'Matched with Pastor Kimberly for heart-centered communication and home atmosphere.';
    }

    const newSubmission: MentorRequestSubmission = {
      id: `req-${Date.now()}`,
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      currentLifeSeason: selectedSeason,
      growthInterests: selectedInterests,
      primaryGoal: primaryGoal.trim() || 'Desiring holy alignment, emotional restoration, and deeper daily prayer consistency.',
      preferredCadence: preferredCadence,
      additionalContext: additionalContext.trim(),
      status: 'matched',
      matchedMentorName,
      matchedMentorRole,
      matchNotes
    };

    setSubmission(newSubmission);
    setIsEditing(false);
    playGoalCelebrationChime(528);
    setFormSubmittedToast(true);
    setTimeout(() => setFormSubmittedToast(false), 4000);
  };

  const handleResetForm = () => {
    if (submission) {
      setSelectedSeason(submission.currentLifeSeason);
      setSelectedInterests(submission.growthInterests);
      setPrimaryGoal(submission.primaryGoal);
      setPreferredCadence(submission.preferredCadence);
      setAdditionalContext(submission.additionalContext);
    }
    setIsEditing(true);
  };

  return (
    <div id="request-mentor" className="bg-white rounded-3xl border border-[#E7DFD4] p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7DFD4] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#B95B3D]" />
            <h3 className="font-serif text-2xl text-[#211C15]">Request a Community Mentor</h3>
          </div>
          <p className="text-xs text-[#7E6D56]">
            Submit your current growth interests, season of life, and spiritual goals to be matched with a vetted Generouslee mentor.
          </p>
        </div>

        {submission && !isEditing && (
          <Badge variant="sage" size="sm">
            ✓ Mentor Match Active
          </Badge>
        )}
      </div>

      {/* Confirmation Toast */}
      {formSubmittedToast && (
        <div className="p-4 bg-[#EEF2EB] border border-[#D5E0CE] rounded-2xl text-xs text-[#5D7052] font-semibold flex items-center gap-3 animate-fade-in shadow-xs">
          <Sparkles className="w-5 h-5 text-[#5D7052] shrink-0" />
          <div>
            <p className="font-bold text-sm">Mentor Request Submitted Successfully!</p>
            <p className="font-normal text-xs text-[#5D7052]/90">
              We paired your growth profile with a seasoned spiritual director. Details are displayed below.
            </p>
          </div>
        </div>
      )}

      {/* Active Submission View vs Form Input */}
      {submission && !isEditing ? (
        <div className="space-y-6 animate-fade-in">
          {/* Matched Mentor Card */}
          <div className="bg-linear-to-br from-[#FAF8F5] via-[#FCFAF7] to-[#FAF0ED] p-6 rounded-3xl border border-[#E7DFD4] space-y-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF0ED] border border-[#F3DDD7] flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                  🕊️
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="terracotta" size="sm">
                      Preliminary Mentor Match
                    </Badge>
                    <span className="text-xs text-[#7E6D56]">
                      Submitted on {submission.submittedAt}
                    </span>
                  </div>
                  <h4 className="font-serif text-xl text-[#211C15] font-semibold">
                    {submission.matchedMentorName}
                  </h4>
                  <p className="text-xs text-[#B95B3D] font-medium">
                    {submission.matchedMentorRole}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetForm}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7E6D56] hover:text-[#211C15] bg-white border border-[#E7DFD4] px-3.5 py-2 rounded-xl cursor-pointer hover:bg-[#FAF8F5] transition-all shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Preferences</span>
                </button>
              </div>
            </div>

            {/* Mentor Notes / Match Reason */}
            {submission.matchNotes && (
              <div className="p-3.5 rounded-2xl bg-white border border-[#E7DFD4] text-xs text-[#594D3C] flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#B95B3D] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-semibold text-[#211C15]">Match Rationale: </span>
                  {submission.matchNotes}
                </p>
              </div>
            )}

            {/* Application Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/80 border border-[#E7DFD4] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8957C]">
                  Current Life Season
                </span>
                <p className="text-xs font-semibold text-[#211C15] line-clamp-2">
                  {submission.currentLifeSeason}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 border border-[#E7DFD4] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8957C]">
                  Preferred Format
                </span>
                <p className="text-xs font-semibold text-[#211C15] line-clamp-2">
                  {submission.preferredCadence}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 border border-[#E7DFD4] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8957C]">
                  Growth Interests
                </span>
                <p className="text-xs font-semibold text-[#211C15] line-clamp-2">
                  {submission.growthInterests.join(', ')}
                </p>
              </div>
            </div>

            {/* Primary Goal Snippet */}
            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD4] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B95B3D]">
                Your Stated Heart Cry &amp; Goal
              </span>
              <p className="text-xs text-[#594D3C] italic leading-relaxed">
                “{submission.primaryGoal}”
              </p>
            </div>

            {/* Next Steps Alert */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#FAF0ED] rounded-2xl border border-[#F3DDD7]">
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-[#B95B3D] uppercase tracking-wider">
                  Next Step: Introduction &amp; Scheduling
                </h5>
                <p className="text-xs text-[#7E6D56]">
                  {submission.matchedMentorName} will reach out through your Generouslee sisterhood inbox within 48 business hours.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  playGoalCelebrationChime(528);
                  alert(`A welcome calendar invitation has been prepared by ${submission.matchedMentorName}'s team.`);
                }}
              >
                Send Intro Message &rarr;
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Select Current Life Season */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#594D3C] flex items-center justify-between">
              <span>1. Current Life Season &amp; Transition</span>
              <span className="text-[11px] text-[#A8957C] font-normal">Choose one primary focus</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {LIFE_SEASONS.map(season => {
                const isSelected = selectedSeason === season.label;
                return (
                  <button
                    type="button"
                    key={season.id}
                    onClick={() => setSelectedSeason(season.label)}
                    className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF0ED] border-[#B95B3D] ring-1 ring-[#B95B3D] text-[#211C15] shadow-xs'
                        : 'bg-[#FAF8F5] border-[#E7DFD4] text-[#594D3C] hover:border-[#D2C4B1]'
                    }`}
                  >
                    <span className="text-xl select-none">{season.icon}</span>
                    <span className="text-xs font-medium leading-snug">{season.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Growth Interests */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#594D3C] flex items-center justify-between">
              <span>2. Growth Interests &amp; Breakthrough Topics</span>
              <span className="text-[11px] text-[#B95B3D] font-medium">
                {selectedInterests.length} selected
              </span>
            </label>
            <p className="text-xs text-[#7E6D56]">
              Select all areas where you desire mentor wisdom, prayer covering, or accountability:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {GROWTH_INTERESTS.map(interest => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#B95B3D] text-white border-[#B95B3D] shadow-2xs'
                        : 'bg-[#FAF8F5] text-[#594D3C] border-[#E7DFD4] hover:border-[#B95B3D]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Preferred Format / Cadence */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#594D3C]">
              3. Preferred Mentorship Cadence &amp; Format
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CADENCE_OPTIONS.map(opt => {
                const isSelected = preferredCadence === opt.label;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setPreferredCadence(opt.label)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[#FAF0ED] border-[#B95B3D] ring-1 ring-[#B95B3D] shadow-xs'
                        : 'bg-[#FAF8F5] border-[#E7DFD4] hover:border-[#D2C4B1]'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B95B3D]">
                      {opt.badge}
                    </span>
                    <span className="text-xs font-semibold text-[#211C15]">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Primary Goal or Prayer Cry */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#594D3C]">
              4. Specific Goal or Prayer Request (Optional)
            </label>
            <textarea
              value={primaryGoal}
              onChange={e => setPrimaryGoal(e.target.value)}
              placeholder="e.g., I want to move past maternal overwhelm and establish a calm morning devotional routine with my kids..."
              rows={3}
              className="w-full p-3.5 rounded-2xl border border-[#E7DFD4] bg-[#FAF8F5] text-xs text-[#211C15] placeholder-[#A8957C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B95B3D] transition-all"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#E7DFD4]">
            {isEditing && submission && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs text-[#7E6D56] hover:text-[#211C15] font-medium"
              >
                Cancel &amp; View Current Match
              </button>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Send className="w-4 h-4" />}
            >
              Submit Mentor Request &rarr;
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
