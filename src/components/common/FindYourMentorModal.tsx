import React, { useState } from 'react';
import { Sparkles, CheckCircle, ArrowRight, UserCheck, RefreshCw, Calendar, Clock, Star } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { MentorAssessmentAnswer, MentorRecommendationResult } from '../../types';
import { api } from '../../services/api';

interface FindYourMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: string, params?: Record<string, any>) => void;
  onSelectMentor?: (mentorName: string) => void;
}

export const FindYourMentorModal: React.FC<FindYourMentorModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectMentor
}) => {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<MentorAssessmentAnswer>({
    primarySeason: 'faith-purpose',
    growthGoals: [],
    preferredFormat: '1-on-1 video call',
    weeklyCommitment: '1-2 hours weekly',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<MentorRecommendationResult | null>(null);

  const seasonOptions = [
    { value: 'faith-purpose', label: 'Faith & Spiritual Purpose', desc: 'Deepening intimacy with God, discovering calling, and establishing devotional rhythm.' },
    { value: 'healthy-living', label: 'Temple Care & Healthy Living', desc: 'Nourishing physical health, energy, hormone balance, and biblical fitness.' },
    { value: 'motherhood', label: 'Motherhood & Gentle Parenting', desc: 'Navigating postpartum, toddler years, godly parenting, and maternal burnout.' },
    { value: 'marriage', label: 'Marriage & Relational Harmony', desc: 'Communication breakdown, spiritual headship, intimacy, and domestic partnership.' },
    { value: 'mindset', label: 'Mindset, Identity & Emotional Healing', desc: 'Overcoming impostor syndrome, boundary-setting, people-pleasing, and shame.' }
  ];

  const goalOptions = [
    'Overcome spiritual burnout and renew prayer life',
    'Heal relationship with physical body & energy',
    'Set healthy boundaries without guilt or shame',
    'Strengthen communication & connection in marriage',
    'Manage transition into new season of motherhood',
    'Align professional ambition with kingdom purpose',
    'Cultivate a sisterhood of spiritually accountable women'
  ];

  const toggleGoal = (goal: string) => {
    setAnswers(prev => {
      const exists = prev.growthGoals.includes(goal);
      if (exists) {
        return { ...prev, growthGoals: prev.growthGoals.filter(g => g !== goal) };
      }
      return { ...prev, growthGoals: [...prev.growthGoals, goal] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.submitMentorAssessment(answers);
      setResult(res);
      setStep(3); // Result step
    } catch (err) {
      console.error('Failed to submit mentor assessment', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 3 ? 'Your Recommended Mentors' : 'Find Your Mentor Assessment'}
      subtitle={
        step === 3
          ? 'Curated guides and pathways aligned with your life season and growth goals'
          : `Step ${step} of 2 &bull; 2-minute personalized spiritual assessment`
      }
      maxWidth="lg"
    >
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#594D3C] uppercase tracking-wider">
              1. Which primary season describes where you need guidance today?
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {seasonOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAnswers(prev => ({ ...prev, primarySeason: opt.value }))}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    answers.primarySeason === opt.value
                      ? 'bg-[#FAF0ED] border-[#B95B3D] ring-1 ring-[#B95B3D]'
                      : 'bg-white border-[#E7DFD4] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-semibold text-[#211C15]">
                      {opt.label}
                    </span>
                    {answers.primarySeason === opt.value && (
                      <CheckCircle className="w-4 h-4 text-[#B95B3D]" />
                    )}
                  </div>
                  <p className="text-xs text-[#7E6D56] mt-1">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E7DFD4]">
            <span className="text-xs text-[#A8957C]">Honoring your journey with gentle discernment</span>
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(2)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Goals
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#594D3C] uppercase tracking-wider">
              2. Select your core growth goals (choose all that apply):
            </label>
            <div className="grid grid-cols-1 gap-2">
              {goalOptions.map(g => {
                const isSelected = answers.growthGoals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGoal(g)}
                    className={`px-4 py-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF0ED] border-[#B95B3D] text-[#211C15] font-medium'
                        : 'bg-white border-[#E7DFD4] text-[#594D3C] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>{g}</span>
                    {isSelected ? (
                      <CheckCircle className="w-3.5 h-3.5 text-[#B95B3D] shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded border border-[#D2C4B1]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#594D3C] uppercase mb-1">
                Preferred Format
              </label>
              <select
                value={answers.preferredFormat}
                onChange={e => setAnswers(prev => ({ ...prev, preferredFormat: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-xs text-[#211C15] focus:outline-none focus:border-[#B95B3D]"
              >
                <option value="1-on-1 video call">1-on-1 Video Session</option>
                <option value="Asynchronous voice notes">Asynchronous Voice Notes</option>
                <option value="Small cohort group">Small Cohort Circle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#594D3C] uppercase mb-1">
                Weekly Available Time
              </label>
              <select
                value={answers.weeklyCommitment}
                onChange={e => setAnswers(prev => ({ ...prev, weeklyCommitment: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-xs text-[#211C15] focus:outline-none focus:border-[#B95B3D]"
              >
                <option value="Under 1 hour weekly">Under 1 hour weekly</option>
                <option value="1-2 hours weekly">1-2 hours weekly</option>
                <option value="3+ hours weekly (Immersive)">3+ hours weekly (Immersive)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E7DFD4]">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep(1)}
            >
              &larr; Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              icon={<Sparkles className="w-4 h-4" />}
            >
              {isSubmitting ? 'Analyzing Matches...' : 'View Mentor Matches'}
            </Button>
          </div>
        </form>
      )}

      {step === 3 && result && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#EEF2EB] border border-[#D5DFD1] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#384332]">
              <Sparkles className="w-4 h-4 text-[#5D7052]" />
              <span>Assessment Summary</span>
            </div>
            <p className="text-xs text-[#5D7052] leading-relaxed">
              {result.guidanceAdvice}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg text-[#211C15]">
              Top Recommended Mentors
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.recommendedMentors.map((mentor, idx) => (
                <div
                  key={mentor.id}
                  className={`p-5 rounded-2xl border space-y-3 bg-white flex flex-col justify-between ${
                    idx === 0 ? 'border-[#B95B3D] ring-1 ring-[#B95B3D]/30 shadow-xs' : 'border-[#E7DFD4]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#E7DFD4]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-serif text-sm font-semibold text-[#211C15]">
                            {mentor.name}
                          </h5>
                          {idx === 0 && (
                            <Badge variant="terracotta" size="sm">Top Fit</Badge>
                          )}
                        </div>
                        <p className="text-xs text-[#7E6D56]">{mentor.role}</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#594D3C] line-clamp-2 leading-relaxed">
                      {mentor.bio}
                    </p>

                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4] space-y-1">
                      <div className="text-[10px] font-semibold text-[#5D7052] uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Why this match
                      </div>
                      <p className="text-[11px] text-[#594D3C]">
                        {mentor.matchReason}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {mentor.specialties.map(spec => (
                        <span
                          key={spec}
                          className="px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[10px] text-[#7E6D56] border border-[#E7DFD4]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F3EFE9] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#B95B3D]">{mentor.rate}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onClose();
                        if (onSelectMentor) {
                          onSelectMentor(mentor.name);
                        } else if (onNavigate) {
                          onNavigate('mentorship');
                        }
                      }}
                      className="text-xs"
                    >
                      Book Session &rarr;
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD4] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[#211C15]">Recommended Academy Path</span>
              <p className="text-xs text-[#7E6D56]">
                {result.suggestedMentorshipPath}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-xs text-[#7E6D56]"
            >
              Retake
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
