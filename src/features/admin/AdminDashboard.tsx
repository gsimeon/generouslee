import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  FileText,
  HelpCircle,
  Users,
  ShieldCheck,
  Plus,
  Check,
  X,
  Edit,
  Trash2,
  Eye,
  Send,
  AlertTriangle,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { api } from '../../services/api';
import { ContentItem, Question, User, AuditLog, AnalyticsMetric } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';

interface AdminDashboardProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'questions' | 'users' | 'logs'>('overview');
  const [overviewData, setOverviewData] = useState<{
    metrics: AnalyticsMetric;
    recentQuestions: Question[];
    recentLogs: AuditLog[];
    totalContent: number;
    totalUsers: number;
  } | null>(null);

  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Content Creation State
  const [isNewContentModalOpen, setIsNewContentModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('motherhood');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newStatus, setNewStatus] = useState<'published' | 'draft'>('published');
  const [newTags, setNewTags] = useState('Postpartum Reality, Self-Compassion');
  const [isSubmittingContent, setIsSubmittingContent] = useState(false);

  // Question Answer Modal State
  const [selectedQuestionToAnswer, setSelectedQuestionToAnswer] = useState<Question | null>(null);
  const [responseText, setResponseText] = useState('');
  const [takeaway1, setTakeaway1] = useState('');
  const [takeaway2, setTakeaway2] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  const isAuthorized = user && ['super_admin', 'admin', 'editor', 'moderator'].includes(user.role);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [overview, contents, questions, users, logs] = await Promise.all([
        api.getAdminOverview(),
        api.getContent({ status: 'all' }),
        api.getQuestions({ filter: 'all' }),
        api.getAdminUsers(),
        api.getAuditLogs()
      ]);
      setOverviewData(overview);
      setContentList(contents);
      setQuestionsList(questions);
      setUsersList(users);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      loadAdminData();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-[#B95B3D] mx-auto" />
        <h2 className="font-serif text-2xl text-[#211C15]">Access Restricted</h2>
        <p className="text-sm text-[#594D3C]">
          This operations portal is reserved for Generouslee editorial staff, mentors, and administrators.
        </p>
        <p className="text-xs text-[#7E6D56]">
          (Use the role switcher in the top navigation bar to switch to Editor, Admin, or Super Admin to test this area.)
        </p>
        <Button variant="primary" size="md" onClick={() => onNavigate('home')}>
          Return to Public Site
        </Button>
      </div>
    );
  }

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContent(true);
    try {
      const tagsArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
      await api.createContent({
        title: newTitle,
        category: newCategory,
        excerpt: newExcerpt,
        body: newBody,
        status: newStatus,
        tags: tagsArray
      });
      setIsNewContentModalOpen(false);
      setNewTitle('');
      setNewExcerpt('');
      setNewBody('');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save content');
    } finally {
      setIsSubmittingContent(false);
    }
  };

  const handleAnswerQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestionToAnswer || !responseText.trim()) return;

    setIsAnswering(true);
    try {
      const takeaways = [takeaway1, takeaway2].filter(Boolean);
      await api.respondToQuestion(selectedQuestionToAnswer.id, {
        responseText,
        keyTakeaways: takeaways,
        recommendedContentSlugs: ['silent-grief-of-matrescence'],
        publish: true
      });
      setSelectedQuestionToAnswer(null);
      setResponseText('');
      setTakeaway1('');
      setTakeaway2('');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to record response');
    } finally {
      setIsAnswering(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Admin Header */}
      <div className="bg-[#211C15] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="gold" size="sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Generouslee Operations Desk</span>
            </Badge>
            <span className="text-xs text-[#A8957C] capitalize">Active: {user.role.replace('_', ' ')}</span>
          </div>
          <h1 className="font-serif text-3xl font-normal">Command & Editorial Center</h1>
          <p className="text-xs sm:text-sm text-[#A8957C]">
            Manage content publishing, question moderation, user permissions, and platform health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsNewContentModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Create New Article
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={() => onNavigate('home')}
            className="text-white hover:bg-[#383025]"
          >
            View Public Site
          </Button>
        </div>
      </div>

      {/* 2. Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E7DFD4] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-[#211C15] text-white'
              : 'text-[#594D3C] hover:bg-[#F3EFE9]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview & Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'content'
              ? 'bg-[#211C15] text-white'
              : 'text-[#594D3C] hover:bg-[#F3EFE9]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Content CMS ({contentList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'bg-[#211C15] text-white'
              : 'text-[#594D3C] hover:bg-[#F3EFE9]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Ask Generouslee Desk ({questionsList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-[#211C15] text-white'
              : 'text-[#594D3C] hover:bg-[#F3EFE9]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & RBAC ({usersList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-[#211C15] text-white'
              : 'text-[#594D3C] hover:bg-[#F3EFE9]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {isLoading ? (
        <div className="py-20 text-center text-sm text-[#7E6D56]">
          <span className="inline-block w-6 h-6 border-2 border-[#B95B3D] border-t-transparent rounded-full animate-spin mr-2" />
          Loading administrative records...
        </div>
      ) : activeTab === 'overview' && overviewData ? (
        <div className="space-y-8">
          {/* Top KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-5 space-y-1 border-[#E7DFD4]">
              <span className="text-xs font-semibold text-[#A8957C] uppercase">Registered Members</span>
              <p className="font-serif text-3xl text-[#211C15]">{overviewData.metrics.totalUsers.toLocaleString()}</p>
              <span className="text-[11px] text-[#5D7052] font-medium">+18% this month</span>
            </Card>
            <Card className="p-5 space-y-1 border-[#E7DFD4]">
              <span className="text-xs font-semibold text-[#A8957C] uppercase">Total Content Views</span>
              <p className="font-serif text-3xl text-[#211C15]">{overviewData.metrics.contentViewsTotal.toLocaleString()}</p>
              <span className="text-[11px] text-[#A8957C]">TikTok referral dominant</span>
            </Card>
            <Card className="p-5 space-y-1 border-[#E7DFD4]">
              <span className="text-xs font-semibold text-[#A8957C] uppercase">Questions Submitted</span>
              <p className="font-serif text-3xl text-[#B95B3D]">{overviewData.metrics.questionsSubmittedTotal}</p>
              <span className="text-[11px] text-[#7E6D56]">{overviewData.metrics.questionsAnsweredTotal} answered to date</span>
            </Card>
            <Card className="p-5 space-y-1 border-[#E7DFD4]">
              <span className="text-xs font-semibold text-[#A8957C] uppercase">Saved Articles</span>
              <p className="font-serif text-3xl text-[#211C15]">{overviewData.metrics.savedArticlesTotal.toLocaleString()}</p>
              <span className="text-[11px] text-[#5D7052] font-medium">High retention signal</span>
            </Card>
          </div>

          {/* Social Media to Community Conversion Funnel */}
          <Card className="p-6 md:p-8 space-y-4 border-[#E7DFD4]">
            <div>
              <Badge variant="terracotta" size="sm">Ecosystem Conversion Funnel</Badge>
              <h3 className="font-serif text-xl text-[#211C15] mt-1">Social Media to Village Conversion</h3>
              <p className="text-xs text-[#7E6D56]">
                How TikTok and social audiences convert into active community members and paying masterclass users.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-4">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4] text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#A8957C]">TikTok Inbound</span>
                <p className="font-serif text-xl text-[#211C15]">{overviewData.metrics.conversionFunnel.socialVisitors.toLocaleString()}</p>
                <span className="text-[10px] text-[#7E6D56]">100% baseline</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4] text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#A8957C]">Read Articles</span>
                <p className="font-serif text-xl text-[#211C15]">{overviewData.metrics.conversionFunnel.websiteReaders.toLocaleString()}</p>
                <span className="text-[10px] text-[#5D7052]">50.5% read</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4] text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#A8957C]">Joined Free</span>
                <p className="font-serif text-xl text-[#211C15]">{overviewData.metrics.conversionFunnel.registeredMembers.toLocaleString()}</p>
                <span className="text-[10px] text-[#5D7052]">17.0% signup</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4] text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#A8957C]">Community Active</span>
                <p className="font-serif text-xl text-[#211C15]">{overviewData.metrics.conversionFunnel.communityActive.toLocaleString()}</p>
                <span className="text-[10px] text-[#5D7052]">6.9% circle</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4] text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#A8957C]">Asked Question</span>
                <p className="font-serif text-xl text-[#B95B3D]">{overviewData.metrics.conversionFunnel.askSubmitted.toLocaleString()}</p>
                <span className="text-[10px] text-[#5D7052]">1.0% ask</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4] text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#A8957C]">Academy Course</span>
                <p className="font-serif text-xl text-[#C49746]">{overviewData.metrics.conversionFunnel.courseEnrolled.toLocaleString()}</p>
                <span className="text-[10px] text-[#5D7052]">0.5% paid</span>
              </div>
            </div>
          </Card>
        </div>
      ) : activeTab === 'content' ? (
        /* CONTENT CMS TABLE */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-[#211C15]">All Articles & Guides</h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNewContentModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              New Publication
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E7DFD4] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF8F5] border-b border-[#E7DFD4] text-[#7E6D56]">
                  <tr>
                    <th className="p-4 font-semibold">Title & Pillar</th>
                    <th className="p-4 font-semibold">Author</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Views</th>
                    <th className="p-4 font-semibold">Saves</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3EFE9]">
                  {contentList.map(c => (
                    <tr key={c.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-[#211C15] line-clamp-1">{c.title}</p>
                        <span className="text-[11px] text-[#A8957C] capitalize">{c.category} &bull; {c.readingTimeMinutes} min</span>
                      </td>
                      <td className="p-4 text-[#594D3C]">{c.author.name}</td>
                      <td className="p-4">
                        <Badge variant={c.status === 'published' ? 'sage' : 'gold'} size="sm">
                          {c.status}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono text-xs">{c.viewCount.toLocaleString()}</td>
                      <td className="p-4 font-mono text-xs">{c.saveCount.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onNavigate('article', { slug: c.slug })}
                          className="text-[#B95B3D] hover:underline font-medium cursor-pointer"
                        >
                          Preview &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'questions' ? (
        /* ASK GENEROUSLEE MODERATION DESK */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-[#211C15]">Submitted Community Questions</h3>
              <p className="text-xs text-[#7E6D56]">Review submissions, compose founder guidance, and publish to the public wisdom archive.</p>
            </div>
          </div>

          <div className="space-y-4">
            {questionsList.map(q => (
              <Card key={q.id} className="p-5 border-[#E7DFD4] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F3EFE9] pb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="terracotta" size="sm" className="capitalize">{q.category}</Badge>
                    <span className="text-xs text-[#A8957C]">
                      From: {q.isAnonymous ? 'Anonymous' : q.authorName} &bull; {new Date(q.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant={q.status === 'published' ? 'sage' : 'gold'} size="sm">
                    {q.status}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-serif text-base sm:text-lg text-[#211C15]">
                    &ldquo;{q.questionText}&rdquo;
                  </h4>
                  {q.contextNotes && (
                    <p className="text-xs text-[#7E6D56] mt-1 italic">Context: {q.contextNotes}</p>
                  )}
                </div>

                {q.response ? (
                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E7DFD4] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#5D7052]">
                      <Check className="w-3.5 h-3.5" />
                      <span>Answered by {q.response.responderName}</span>
                    </div>
                    <p className="text-xs text-[#594D3C] line-clamp-3">{q.response.responseText}</p>
                  </div>
                ) : (
                  <div className="pt-2 flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedQuestionToAnswer(q);
                        setResponseText('');
                        setTakeaway1('');
                        setTakeaway2('');
                      }}
                      icon={<Edit className="w-3.5 h-3.5" />}
                    >
                      Write Founder Guidance & Publish
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ) : activeTab === 'users' ? (
        /* USERS & ROLES TABLE */
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-[#211C15]">User Directory & Access Control</h3>
          <div className="bg-white rounded-2xl border border-[#E7DFD4] overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF8F5] border-b border-[#E7DFD4] text-[#7E6D56]">
                <tr>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Interests</th>
                  <th className="p-4 font-semibold">Verified</th>
                  <th className="p-4 font-semibold">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3EFE9]">
                {usersList.map(u => (
                  <tr key={u.id}>
                    <td className="p-4 flex items-center gap-3">
                      <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-[#D2C4B1]" />
                      <div>
                        <p className="font-medium text-[#211C15]">{u.name}</p>
                        <p className="text-xs text-[#7E6D56]">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="sage" size="sm" className="capitalize">
                        {u.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs text-[#594D3C]">
                      {u.interests?.join(', ') || 'None selected'}
                    </td>
                    <td className="p-4">
                      {u.isEmailVerified ? (
                        <span className="text-[#5D7052] font-semibold text-xs">&check; Verified</span>
                      ) : (
                        <span className="text-[#A8957C] text-xs">Pending</span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-[#7E6D56]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* AUDIT LOGS */
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-[#211C15]">Security & Activity Audit Logs</h3>
          <div className="bg-white rounded-2xl border border-[#E7DFD4] overflow-hidden">
            <div className="divide-y divide-[#F3EFE9]">
              {auditLogs.map(log => (
                <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral" size="sm">{log.action}</Badge>
                      <span className="font-medium text-[#211C15]">{log.actorEmail}</span>
                    </div>
                    <p className="text-[#594D3C]">{log.details}</p>
                  </div>
                  <span className="text-[#A8957C] shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: CREATE ARTICLE CMS */}
      <Modal
        isOpen={isNewContentModalOpen}
        onClose={() => setIsNewContentModalOpen(false)}
        title="Compose New Publication"
        subtitle="Write and publish an editorial reflection, guide, or script for Generouslee readers."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateContent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#594D3C] uppercase mb-1">Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Breaking the Cycle of People-Pleasing with In-Laws"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-sm text-[#211C15]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#594D3C] uppercase mb-1">Pillar</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-xs text-[#211C15]"
              >
                <option value="motherhood">Motherhood</option>
                <option value="marriage">Marriage</option>
                <option value="parenting">Parenting</option>
                <option value="mental-wellness">Mental Wellness</option>
                <option value="personal-growth">Personal Growth</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#594D3C] uppercase mb-1">Status</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-xs text-[#211C15]"
              >
                <option value="published">Publish Immediately</option>
                <option value="draft">Save as Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#594D3C] uppercase mb-1">Excerpt (Subtitle)</label>
            <textarea
              required
              rows={2}
              placeholder="Brief 1-2 sentence hook explaining why this reflection matters."
              value={newExcerpt}
              onChange={e => setNewExcerpt(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-xs text-[#211C15]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#594D3C] uppercase mb-1">Article Body (Markdown Supported)</label>
            <textarea
              required
              rows={6}
              placeholder="# Headline&#10;&#10;When we enter this season of life, we often find that...&#10;&#10;### Key Practice:&#10;1. Ground your feet..."
              value={newBody}
              onChange={e => setNewBody(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-xs font-mono text-[#211C15]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#594D3C] uppercase mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              value={newTags}
              onChange={e => setNewTags(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-xs text-[#211C15]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsNewContentModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingContent}>
              Save & Publish Article
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. MODAL: WRITE FOUNDER GUIDANCE FOR ASK GENEROUSLEE */}
      <Modal
        isOpen={Boolean(selectedQuestionToAnswer)}
        onClose={() => setSelectedQuestionToAnswer(null)}
        title="Compose Founder Guidance"
        subtitle={`Responding to: "${selectedQuestionToAnswer?.questionText}"`}
        maxWidth="lg"
      >
        <form onSubmit={handleAnswerQuestion} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#594D3C] uppercase mb-1">
              Founder Response & Advice
            </label>
            <textarea
              required
              rows={6}
              placeholder="Dear sweet mother, take a slow breath with me... First, your guilt is not proof of failure..."
              value={responseText}
              onChange={e => setResponseText(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-sm text-[#211C15]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#594D3C] uppercase">
              Actionable Key Takeaways (Bullet Points)
            </label>
            <input
              type="text"
              placeholder="Takeaway 1 (e.g. Maternal guilt is often conditioned martyrdom rather than moral failure.)"
              value={takeaway1}
              onChange={e => setTakeaway1(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-xs text-[#211C15]"
            />
            <input
              type="text"
              placeholder="Takeaway 2 (e.g. Taking 2 hours of restorative space models self-respect for your children.)"
              value={takeaway2}
              onChange={e => setTakeaway2(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-xs text-[#211C15]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedQuestionToAnswer(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isAnswering}>
              Publish Response to Archive &rarr;
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
