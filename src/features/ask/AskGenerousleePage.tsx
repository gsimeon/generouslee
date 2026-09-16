import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Sparkles,
  Send,
  Lock,
  Eye,
  CheckCircle,
  Clock,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { Question } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';

interface AskGenerousleeProps {
  initialQuestionId?: string;
  initialTab?: 'public' | 'mine';
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const AskGenerousleePage: React.FC<AskGenerousleeProps> = ({
  initialQuestionId,
  initialTab = 'public',
  onNavigate
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'public' | 'mine'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [myQuestions, setMyQuestions] = useState<Question[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(initialQuestionId || null);
  const [isLoading, setIsLoading] = useState(true);

  // Submission Form State
  const [questionText, setQuestionText] = useState('');
  const [contextNotes, setContextNotes] = useState('');
  const [category, setCategory] = useState('motherhood');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [publicConsent, setPublicConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);

  const categoriesList = [
    { id: 'all', label: 'All Topics' },
    { id: 'faith-purpose', label: 'Faith & Purpose' },
    { id: 'healthy-living', label: 'Healthy Living' },
    { id: 'motherhood', label: 'Motherhood' },
    { id: 'marriage', label: 'Marriage & Intimacy' },
    { id: 'mindset', label: 'Mindset & Growth' }
  ];

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const [pubList, mineList] = await Promise.all([
        api.getQuestions({
          filter: 'published',
          category: selectedCategory !== 'all' ? selectedCategory : undefined
        }),
        isAuthenticated ? api.getQuestions({ filter: 'mine' }) : Promise.resolve([])
      ]);
      setQuestions(pubList);
      setMyQuestions(mineList);
      if (initialQuestionId) {
        setExpandedQuestionId(initialQuestionId);
      }
    } catch (err) {
      console.error('Failed to load questions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedCategory, isAuthenticated]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (!questionText.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await api.submitQuestion({
        questionText,
        contextNotes,
        category,
        isAnonymous,
        publicConsent
      });
      setMyQuestions(prev => [created, ...prev]);
      setSubmitSuccessMessage('Your question was received with care. Latisha and our mentorship team review submissions weekly.');
      setQuestionText('');
      setContextNotes('');
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setSubmitSuccessMessage(null);
        setActiveTab('mine');
      }, 2500);
    } catch (err: any) {
      alert(err.message || 'Error submitting question');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: Question['status']) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="neutral" size="sm">Submitted &bull; In Queue</Badge>;
      case 'under_review':
        return <Badge variant="gold" size="sm">Under Review by Latisha</Badge>;
      case 'answered':
      case 'published':
        return <Badge variant="sage" size="sm">Answered & Published</Badge>;
      case 'rejected':
        return <Badge variant="rose" size="sm">Not Selected</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Header Banner */}
      <div className="bg-[#FAF0ED] rounded-3xl border border-[#F3DDD7] p-8 md:p-12 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="terracotta" size="md">
              Signature Wisdom Exchange
            </Badge>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#211C15] leading-tight">
              Ask Generouslee.
            </h1>
            <p className="text-base sm:text-lg text-[#594D3C] leading-relaxed">
              Have an honest question about walking in divine purpose, temple care & health, faith in motherhood, or marital alignment?
              Submit your question with complete privacy.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                if (!isAuthenticated) openAuthModal('login');
                else setIsSubmitModalOpen(true);
              }}
              icon={<Send className="w-4 h-4" />}
            >
              Ask Latisha a Question
            </Button>
          </div>
        </div>

        {/* 4-Step Process Visualizer */}
        <div className="pt-6 border-t border-[#F3DDD7] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#7E6D56]">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#B95B3D] text-white flex items-center justify-center font-bold text-[10px]">1</span>
            <span>Anonymous Submission</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#E7DFD4] text-[#211C15] flex items-center justify-center font-bold text-[10px]">2</span>
            <span>Founder & Expert Review</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#E7DFD4] text-[#211C15] flex items-center justify-center font-bold text-[10px]">3</span>
            <span>Thoughtful Response</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#E7DFD4] text-[#211C15] flex items-center justify-center font-bold text-[10px]">4</span>
            <span>Community Wisdom</span>
          </div>
        </div>
      </div>

      {/* 2. Main Tabs */}
      <div className="flex items-center justify-between border-b border-[#E7DFD4] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('public')}
            className={`pb-2 px-1 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'public'
                ? 'border-[#B95B3D] text-[#B95B3D]'
                : 'border-transparent text-[#7E6D56] hover:text-[#211C15]'
            }`}
          >
            Answered Wisdom Library ({questions.length})
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('mine')}
              className={`pb-2 px-1 text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'mine'
                  ? 'border-[#B95B3D] text-[#B95B3D]'
                  : 'border-transparent text-[#7E6D56] hover:text-[#211C15]'
              }`}
            >
              <span>My Submissions</span>
              {myQuestions.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#F3EFE9] text-[#211C15] text-[10px]">
                  {myQuestions.length}
                </span>
              )}
            </button>
          )}
        </div>

        {activeTab === 'public' && (
          <div className="hidden sm:flex items-center gap-2">
            {categoriesList.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-[#211C15] text-white'
                    : 'bg-white border border-[#E7DFD4] text-[#594D3C] hover:bg-[#FAF8F5]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Questions List */}
      {isLoading ? (
        <div className="py-20 text-center text-sm text-[#7E6D56]">
          <span className="inline-block w-6 h-6 border-2 border-[#B95B3D] border-t-transparent rounded-full animate-spin mr-2" />
          Loading wisdom archive...
        </div>
      ) : activeTab === 'public' ? (
        <div className="space-y-6">
          {questions.map(q => {
            const isExpanded = expandedQuestionId === q.id;
            return (
              <Card key={q.id} className="p-6 md:p-8 space-y-6 border-[#E7DFD4]">
                {/* Question Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="terracotta" size="sm" className="capitalize">
                        {q.category}
                      </Badge>
                      <span className="text-xs text-[#A8957C]">
                        Asked by {q.isAnonymous ? 'Anonymous Mother' : q.authorName}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#211C15] font-normal leading-snug">
                      &ldquo;{q.questionText}&rdquo;
                    </h3>
                  </div>

                  <button
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="p-2 text-[#7E6D56] hover:text-[#211C15] hover:bg-[#F3EFE9] rounded-full transition-colors cursor-pointer"
                    aria-label={isExpanded ? 'Collapse response' : 'Expand response'}
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Founder Response */}
                {q.response && (
                  <div className="bg-[#FAF8F5] rounded-2xl border border-[#E7DFD4] p-6 md:p-8 space-y-6">
                    {/* Responder Info */}
                    <div className="flex items-center justify-between border-b border-[#E7DFD4] pb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={q.response.responderAvatar || '/latisha.jpg'}
                          alt={q.response.responderName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-[#D2C4B1]"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#211C15]">
                            {q.response.responderName}
                          </p>
                          <p className="text-xs text-[#7E6D56]">
                            {q.response.responderTitle}
                          </p>
                        </div>
                      </div>
                      <Badge variant="sage" size="sm">
                        Verified Guidance
                      </Badge>
                    </div>

                    {/* Response Text */}
                    <div className="prose prose-stone text-[#383025] text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                      {q.response.responseText}
                    </div>

                    {/* Key Takeaways */}
                    {q.response.keyTakeaways && q.response.keyTakeaways.length > 0 && (
                      <div className="bg-white rounded-xl p-5 border border-[#E7DFD4] space-y-2">
                        <p className="text-xs font-semibold text-[#A8957C] uppercase tracking-wider">
                          Key Truths to Hold Onto:
                        </p>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-[#594D3C]">
                          {q.response.keyTakeaways.map((takeaway, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#B95B3D] font-bold">&bull;</span>
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Related articles prompt */}
                    {q.response.recommendedContentSlugs && q.response.recommendedContentSlugs.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-[#7E6D56]">Related deep-dive:</span>
                        {q.response.recommendedContentSlugs.map(slug => (
                          <button
                            key={slug}
                            onClick={() => onNavigate('article', { slug })}
                            className="text-xs text-[#B95B3D] hover:underline font-medium cursor-pointer"
                          >
                            Read article &rarr;
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        /* My Questions Tab */
        <div className="space-y-6">
          {myQuestions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E7DFD4] p-12 text-center space-y-4 max-w-md mx-auto">
              <HelpCircle className="w-10 h-10 text-[#A8957C] mx-auto" />
              <h3 className="font-serif text-xl text-[#211C15]">No questions submitted yet</h3>
              <p className="text-xs text-[#594D3C]">
                Whatever you are carrying—parenting frustration, marriage fatigue, or maternal guilt—you don&apos;t have to carry it alone.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsSubmitModalOpen(true)}
              >
                Ask Your First Question
              </Button>
            </div>
          ) : (
            myQuestions.map(mq => (
              <Card key={mq.id} className="p-6 border-[#E7DFD4] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F3EFE9] pb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="terracotta" size="sm" className="capitalize">
                      {mq.category}
                    </Badge>
                    <span className="text-xs text-[#A8957C]">
                      Submitted on {new Date(mq.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>{getStatusBadge(mq.status)}</div>
                </div>

                <div>
                  <h4 className="font-serif text-lg text-[#211C15]">
                    &ldquo;{mq.questionText}&rdquo;
                  </h4>
                  {mq.contextNotes && (
                    <p className="text-xs text-[#7E6D56] mt-1 italic">
                      Context provided: {mq.contextNotes}
                    </p>
                  )}
                </div>

                {mq.response ? (
                  <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E7DFD4] space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#5D7052]">
                      <CheckCircle className="w-4 h-4" />
                      <span>Response from {mq.response.responderName}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#383025] leading-relaxed whitespace-pre-line">
                      {mq.response.responseText}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E7DFD4]/60 text-xs text-[#7E6D56] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#A8957C]" />
                    <span>In the queue. Latisha and our mentorship team review and respond on Mondays and Thursdays.</span>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* 4. SUBMIT QUESTION MODAL */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Ask Generouslee"
        subtitle="Your vulnerability is honored here. Every question is handled with compassion, privacy, and zero judgment."
        maxWidth="lg"
      >
        {submitSuccessMessage ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EEF2EB] text-[#5D7052] flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-xl text-[#211C15]">Question Received</h4>
            <p className="text-sm text-[#594D3C]">{submitSuccessMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuestion} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#594D3C] uppercase tracking-wider mb-1.5">
                Which Pillar Does Your Question Relate To?
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-sm text-[#211C15] focus:outline-none focus:ring-2 focus:ring-[#B95B3D]/30"
              >
                <option value="faith-purpose">Faith & Divine Purpose</option>
                <option value="healthy-living">Healthy Living & Temple Care</option>
                <option value="motherhood">Motherhood & Family</option>
                <option value="marriage">Marriage & Relationship Intimacy</option>
                <option value="mindset">Mindset & Self-Motivation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#594D3C] uppercase tracking-wider mb-1.5">
                Your Question (What is feeling heavy or uncertain right now?)
              </label>
              <textarea
                required
                rows={4}
                value={questionText}
                onChange={e => setQuestionText(e.target.value)}
                placeholder="e.g. How do I balance staying disciplined in my physical health and spiritual walk while raising toddlers and working full-time?"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-sm text-[#211C15] focus:outline-none focus:ring-2 focus:ring-[#B95B3D]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#594D3C] uppercase tracking-wider mb-1.5">
                Additional Context (Optional)
              </label>
              <textarea
                rows={2}
                value={contextNotes}
                onChange={e => setContextNotes(e.target.value)}
                placeholder="e.g. Married for 5 years, two children, seeking structure in morning prayer and workout routines."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-xs text-[#211C15] focus:outline-none focus:ring-2 focus:ring-[#B95B3D]/30"
              />
            </div>

            {/* Privacy & Anonymity Toggles */}
            <div className="space-y-3 pt-2 border-t border-[#E7DFD4]">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                  className="mt-1 rounded text-[#B95B3D] focus:ring-[#B95B3D]"
                />
                <div>
                  <span className="text-xs font-semibold text-[#211C15] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#5D7052]" />
                    Keep my name anonymous
                  </span>
                  <p className="text-[11px] text-[#7E6D56]">
                    If published, your question will be signed as &ldquo;Anonymous Member&rdquo;.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publicConsent}
                  onChange={e => setPublicConsent(e.target.checked)}
                  className="mt-1 rounded text-[#B95B3D] focus:ring-[#B95B3D]"
                />
                <div>
                  <span className="text-xs font-semibold text-[#211C15] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#B95B3D]" />
                    Consent to publish response in Wisdom Library
                  </span>
                  <p className="text-[11px] text-[#7E6D56]">
                    Sharing your answer helps thousands of other women who are fighting the exact same quiet battle.
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setIsSubmitModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
              >
                Submit to Latisha &rarr;
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
