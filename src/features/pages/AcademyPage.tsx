import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Clock,
  PlayCircle,
  CheckCircle,
  Star,
  Sparkles,
  BookOpen,
  TrendingUp,
  BookmarkCheck,
  Award,
  ChevronRight,
  ExternalLink,
  Flame
} from 'lucide-react';
import { api } from '../../services/api';
import { Course, ContentItem } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';

interface AcademyPageProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const AcademyPage: React.FC<AcademyPageProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [savedArticles, setSavedArticles] = useState<ContentItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [courseProgressMap, setCourseProgressMap] = useState<Record<string, number>>({});
  const [completedReadingIds, setCompletedReadingIds] = useState<string[]>([]);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'my-learning'>('all');

  useEffect(() => {
    async function loadData() {
      const data = await api.getCourses();
      setCourses(data);

      // Load enrolled & progress
      const initialEnrolled: string[] = [];
      const initialProgress: Record<string, number> = {};
      data.forEach(c => {
        if (c.isEnrolled || (c.progressPercent && c.progressPercent > 0)) {
          initialEnrolled.push(c.id);
          initialProgress[c.id] = c.progressPercent || 0;
        }
      });
      setEnrolledCourses(initialEnrolled);
      setCourseProgressMap(initialProgress);

      // Load reading materials for visual progress
      try {
        const contentRes = await api.getContent();
        const savedIds = user?.savedContentIds || [];
        const relevant = contentRes.filter(c => savedIds.includes(c.id) || c.contentType === 'resource' || c.featured);
        setSavedArticles(relevant.slice(0, 6));

        // Load reading completion status from localStorage if available
        const storedRead = localStorage.getItem('generouslee_completed_readings');
        if (storedRead) {
          setCompletedReadingIds(JSON.parse(storedRead));
        } else {
          // Default first item as read for demonstration
          if (relevant.length > 0) {
            setCompletedReadingIds([relevant[0].id]);
          }
        }
      } catch (err) {
        console.error('Error loading reading materials', err);
      }
    }
    loadData();
  }, [user]);

  const handleEnroll = (course: Course) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    const isEnrolled = enrolledCourses.includes(course.id);
    if (isEnrolled) {
      setActiveCourseModal(course);
      return;
    }
    setSelectedCourse(course);
    setEnrollSuccess(false);
  };

  const confirmEnrollment = async () => {
    if (selectedCourse) {
      try {
        await api.enrollCourse(selectedCourse.id);
      } catch (e) {
        // Fallback local update
      }
      setEnrolledCourses(prev => [...new Set([...prev, selectedCourse.id])]);
      setCourseProgressMap(prev => ({ ...prev, [selectedCourse.id]: 0 }));
      setEnrollSuccess(true);
      setTimeout(() => {
        setSelectedCourse(null);
        setEnrollSuccess(false);
      }, 1800);
    }
  };

  const handleUpdateCourseProgress = async (courseId: string, delta: number) => {
    const current = courseProgressMap[courseId] || 0;
    const updated = Math.min(100, Math.max(0, current + delta));
    setCourseProgressMap(prev => ({ ...prev, [courseId]: updated }));
    try {
      await api.updateCourseProgress(courseId, updated);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleReadingCompleted = (id: string) => {
    setCompletedReadingIds(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('generouslee_completed_readings', JSON.stringify(updated));
      return updated;
    });
  };

  // Metrics for the progress tracker
  const totalEnrolled = enrolledCourses.length;
  const enrolledCourseObjects = courses.filter(c => enrolledCourses.includes(c.id));
  const avgCourseProgress = totalEnrolled > 0
    ? Math.round(enrolledCourseObjects.reduce((acc, c) => acc + (courseProgressMap[c.id] || 0), 0) / totalEnrolled)
    : 0;

  const totalReadings = savedArticles.length;
  const completedReadingsCount = savedArticles.filter(a => completedReadingIds.includes(a.id)).length;
  const readingProgressPercent = totalReadings > 0 ? Math.round((completedReadingsCount / totalReadings) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
      {/* Hero Banner */}
      <div className="bg-[#FAF0ED] rounded-3xl border border-[#F3DDD7] p-8 md:p-12 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Badge variant="terracotta" size="md">Self-Paced Mentorship Masterclasses</Badge>
          {isAuthenticated && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E7DFD4] text-xs text-[#594D3C] font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#5D7052] animate-pulse"></span>
              Learning as {user?.name}
            </div>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#211C15] font-normal tracking-tight">
          The Generouslee Academy
        </h1>
        <p className="text-base sm:text-lg text-[#594D3C] max-w-2xl leading-relaxed">
          Structured video curricula, reflective worksheets, and guided mentorship modules curated by Latisha Langley and faith-centered wellness guides.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#7E6D56]">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#5D7052]" /> Lifetime Access & Updates
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#5D7052]" /> Printable Workbooks & Scripts
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#5D7052]" /> 30-Day Money-Back Guarantee
          </span>
        </div>
      </div>

      {/* VISUAL PROGRESS TRACKER FOR LOGGED-IN USER */}
      {isAuthenticated && (
        <section id="learning-progress-tracker" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7DFD4] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#B95B3D]" />
                <h2 className="font-serif text-2xl text-[#211C15]">Your Visual Learning Tracker</h2>
              </div>
              <p className="text-xs sm:text-sm text-[#7E6D56] mt-1">
                Real-time completion metrics for your active mentorship courses and assigned reading materials.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-[#EEF2EB] text-[#5D7052]">
                <Flame className="w-3.5 h-3.5" /> 4-Day Reflection Streak
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => onNavigate('dashboard')}
              >
                Full Dashboard &rarr;
              </Button>
            </div>
          </div>

          {/* Progress Overview Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Overall Course Completion */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#E7DFD4] p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#7E6D56] uppercase tracking-wider">Courses Progress</span>
                  <h3 className="font-serif text-3xl text-[#211C15] mt-1">{avgCourseProgress}%</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF0ED] text-[#B95B3D] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full h-2.5 bg-[#E7DFD4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B95B3D] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${avgCourseProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#7E6D56]">
                  <span>{totalEnrolled} Active Masterclass{totalEnrolled === 1 ? '' : 'es'}</span>
                  <span>{enrolledCourseObjects.filter(c => (courseProgressMap[c.id] || 0) === 100).length} Completed</span>
                </div>
              </div>
            </div>

            {/* Reading Materials Progress */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#E7DFD4] p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#7E6D56] uppercase tracking-wider">Reading Materials</span>
                  <h3 className="font-serif text-3xl text-[#211C15] mt-1">{readingProgressPercent}%</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#EEF2EB] text-[#5D7052] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full h-2.5 bg-[#E7DFD4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5D7052] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${readingProgressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#7E6D56]">
                  <span>{completedReadingsCount} of {totalReadings} guides digested</span>
                  <span>{totalReadings - completedReadingsCount} remaining</span>
                </div>
              </div>
            </div>

            {/* Growth & Certification Status */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#E7DFD4] p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#7E6D56] uppercase tracking-wider">Milestone Badge</span>
                  <h3 className="font-serif text-xl text-[#211C15] mt-1">Sisterhood Scholar</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#E8EFF6] text-[#2C4A6F] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-[#594D3C] leading-relaxed">
                You are on track to earn your Divine Purpose Masterclass Certificate. Complete 2 more lessons to level up.
              </p>

              <div className="pt-2 border-t border-[#E7DFD4]/60 flex items-center justify-between text-xs text-[#7E6D56]">
                <span>Status: In Good Standing</span>
                <span className="text-[#B95B3D] font-medium">Level 2 Member</span>
              </div>
            </div>
          </div>

          {/* Active Courses In-Progress Breakdown */}
          {enrolledCourseObjects.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E7DFD4] p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#594D3C] flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-[#B95B3D]" />
                  Active Course Lessons & Completion
                </h3>
                <span className="text-xs text-[#7E6D56]">Click to continue modules</span>
              </div>

              <div className="space-y-4">
                {enrolledCourseObjects.map(course => {
                  const progress = courseProgressMap[course.id] || 0;
                  const totalLessons = course.lessonsCount || course.lessonCount || 12;
                  const completedLessons = Math.round((progress / 100) * totalLessons);

                  return (
                    <div
                      key={course.id}
                      className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7DFD4] hover:border-[#D2C4B1] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={course.thumbnail || course.coverImage}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover shrink-0 border border-[#E7DFD4]"
                        />
                        <div className="space-y-1">
                          <h4 className="font-serif text-base text-[#211C15] font-normal leading-snug">
                            {course.title}
                          </h4>
                          <p className="text-xs text-[#7E6D56]">
                            Instructor: {course.instructor} &bull; {completedLessons} of {totalLessons} lessons completed
                          </p>
                          <div className="w-48 sm:w-64 h-2 bg-[#E7DFD4] rounded-full overflow-hidden mt-2">
                            <div
                              className="h-full bg-[#B95B3D] rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <span className="text-xs font-bold text-[#211C15] px-2.5 py-1 bg-white rounded-lg border border-[#E7DFD4]">
                          {progress}%
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setActiveCourseModal(course)}
                        >
                          Continue Learning &rarr;
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reading Materials Checklist Visual Tracker */}
          {savedArticles.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E7DFD4] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-[#5D7052]" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#594D3C]">
                    Required & Recommended Reading Progress
                  </h3>
                </div>
                <span className="text-xs text-[#7E6D56]">
                  {completedReadingsCount} of {totalReadings} completed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedArticles.map(article => {
                  const isRead = completedReadingIds.includes(article.id);
                  return (
                    <div
                      key={article.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        isRead
                          ? 'bg-[#F4F7F2] border-[#C7D9BE] text-[#33422C]'
                          : 'bg-[#FAF8F5] border-[#E7DFD4] text-[#211C15]'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Badge variant={isRead ? 'sage' : 'outline'} size="sm">
                            {article.category.replace('-', ' ')}
                          </Badge>
                          <span className="text-[11px] text-[#7E6D56]">
                            {article.readingTimeMinutes} min read
                          </span>
                        </div>
                        <h4
                          onClick={() => onNavigate('article', { slug: article.slug })}
                          className={`text-xs font-medium truncate cursor-pointer hover:underline ${
                            isRead ? 'line-through text-[#62735B]' : 'text-[#211C15]'
                          }`}
                        >
                          {article.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => toggleReadingCompleted(article.id)}
                        className={`shrink-0 p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isRead
                            ? 'bg-[#5D7052] text-white border-[#5D7052]'
                            : 'bg-white text-[#7E6D56] border-[#D2C4B1] hover:border-[#5D7052]'
                        }`}
                        title={isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Course Catalog Filter Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7DFD4] pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#211C15]">Available Masterclasses & Mentorship</h2>
            <p className="text-xs sm:text-sm text-[#7E6D56] mt-1">
              Explore deep transformational learning pathways designed for mental and spiritual restoration.
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-[#FAF8F5] p-1 border border-[#E7DFD4]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-[#211C15] shadow-xs'
                  : 'text-[#7E6D56] hover:text-[#211C15]'
              }`}
            >
              All Courses ({courses.length})
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setActiveTab('my-learning')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'my-learning'
                    ? 'bg-white text-[#211C15] shadow-xs'
                    : 'text-[#7E6D56] hover:text-[#211C15]'
                }`}
              >
                Enrolled ({enrolledCourses.length})
              </button>
            )}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses
            .filter(c => activeTab === 'all' || enrolledCourses.includes(c.id))
            .map(course => {
              const isEnrolled = enrolledCourses.includes(course.id);
              const progress = courseProgressMap[course.id] || 0;

              return (
                <Card
                  key={course.id}
                  className="p-0 overflow-hidden flex flex-col justify-between border-[#E7DFD4] bg-white hover:border-[#D2C4B1] transition-all"
                >
                  <div className="relative h-48 bg-[#E7DFD4]">
                    <img
                      src={course.thumbnail || course.coverImage}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="terracotta" size="sm" className="bg-white/95">
                        {course.category ? course.category.replace('-', ' ') : 'Mentorship'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#211C15]/80 backdrop-blur-xs text-white text-xs font-semibold">
                      {course.price || 'Free'}
                    </div>

                    {isEnrolled && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#5D7052] text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs">
                        <CheckCircle className="w-3 h-3" /> Enrolled ({progress}%)
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#7E6D56]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <PlayCircle className="w-3.5 h-3.5" />
                          {course.lessonsCount || course.lessonCount} lessons
                        </span>
                      </div>

                      <h3 className="font-serif text-xl text-[#211C15] font-normal leading-snug">
                        {course.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#594D3C] line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {isEnrolled && (
                      <div className="space-y-1.5 pt-2 border-t border-[#F3EFE9]">
                        <div className="flex justify-between text-xs text-[#7E6D56]">
                          <span>Your Progress</span>
                          <span className="font-semibold text-[#211C15]">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#E7DFD4] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#B95B3D] rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-[#F3EFE9] space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#7E6D56]">
                        <span>Instructor: {course.instructor}</span>
                        <span>{(course.enrolledCount || 100).toLocaleString()} enrolled</span>
                      </div>

                      <Button
                        variant={isEnrolled ? 'secondary' : 'primary'}
                        size="md"
                        className="w-full"
                        onClick={() => handleEnroll(course)}
                      >
                        {isEnrolled ? 'Open Lesson Player &rarr;' : `Enroll for ${course.price || '$79'}`}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      </div>

      {/* Interactive Course Player / Progress Modal */}
      {activeCourseModal && (
        <Modal
          isOpen={Boolean(activeCourseModal)}
          onClose={() => setActiveCourseModal(null)}
          title={activeCourseModal.title}
          subtitle={`Led by ${activeCourseModal.instructor} &bull; ${activeCourseModal.duration}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E7DFD4] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-[#7E6D56] uppercase tracking-wider">
                    Current Masterclass Progress
                  </span>
                  <h4 className="text-xl font-serif text-[#211C15]">
                    {courseProgressMap[activeCourseModal.id] || 0}% Completed
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateCourseProgress(activeCourseModal.id, -15)}
                    disabled={(courseProgressMap[activeCourseModal.id] || 0) <= 0}
                  >
                    - Prev Lesson
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateCourseProgress(activeCourseModal.id, 15)}
                    disabled={(courseProgressMap[activeCourseModal.id] || 0) >= 100}
                  >
                    + Complete Lesson
                  </Button>
                </div>
              </div>

              <div className="w-full h-3 bg-[#E7DFD4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B95B3D] rounded-full transition-all duration-300"
                  style={{ width: `${courseProgressMap[activeCourseModal.id] || 0}%` }}
                />
              </div>
            </div>

            {/* Course Curriculum Outline */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#594D3C]">
                Curriculum Modules
              </h5>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {[
                  { num: '01', title: 'Foundations of Wholeness & Decompressing Overwhelm', duration: '28 min', completed: (courseProgressMap[activeCourseModal.id] || 0) >= 25 },
                  { num: '02', title: 'Scriptural Identity vs. Performance Perfectionism', duration: '34 min', completed: (courseProgressMap[activeCourseModal.id] || 0) >= 50 },
                  { num: '03', title: 'Somatic Nervous System Practices & Daily Temple Health', duration: '41 min', completed: (courseProgressMap[activeCourseModal.id] || 0) >= 75 },
                  { num: '04', title: 'Establishing Guilt-Free Boundaries & Walking in Purpose', duration: '35 min', completed: (courseProgressMap[activeCourseModal.id] || 0) >= 100 }
                ].map((mod) => (
                  <div
                    key={mod.num}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      mod.completed
                        ? 'bg-[#EEF2EB] border-[#C7D9BE] text-[#33422C]'
                        : 'bg-white border-[#E7DFD4] text-[#211C15]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-[#7E6D56]">{mod.num}</span>
                      <span className="font-medium">{mod.title}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[#7E6D56]">{mod.duration}</span>
                      {mod.completed ? (
                        <CheckCircle className="w-4 h-4 text-[#5D7052]" />
                      ) : (
                        <PlayCircle className="w-4 h-4 text-[#7E6D56]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E7DFD4]">
              <Button variant="secondary" size="md" onClick={() => setActiveCourseModal(null)}>
                Close Player
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Enrollment Checkout Modal */}
      <Modal
        isOpen={Boolean(selectedCourse)}
        onClose={() => setSelectedCourse(null)}
        title={enrollSuccess ? 'Enrollment Confirmed!' : `Enroll in ${selectedCourse?.title}`}
        subtitle={
          enrollSuccess
            ? 'Welcome to the masterclass. You have lifetime access to all lessons and resources.'
            : 'Gain instant lifetime access to video modules, audio guides, and printable workbooks.'
        }
        maxWidth="md"
      >
        {enrollSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EEF2EB] text-[#5D7052] flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-sm text-[#594D3C]">
              Your course materials, progress tracker, and community discussion circle are now unlocked.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E7DFD4] space-y-2 text-xs text-[#594D3C]">
              <div className="flex justify-between font-medium text-sm text-[#211C15]">
                <span>Course Tuition:</span>
                <span className="font-serif text-base text-[#B95B3D]">{selectedCourse?.price || '$79'}</span>
              </div>
              <p>Includes: {selectedCourse?.lessonsCount || selectedCourse?.lessonCount} video lessons &bull; {selectedCourse?.duration} runtime &bull; Audio downloads &bull; Printable workbooks</p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#594D3C] uppercase">
                Payment Method (Instant Checkout)
              </label>
              <div className="p-4 rounded-xl border border-[#D2C4B1] bg-white flex items-center justify-between text-xs">
                <span className="font-semibold text-[#211C15]">Visa ending in 4242</span>
                <span className="text-[#7E6D56]">Expires 12/28</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedCourse(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={confirmEnrollment}>
                Confirm Enrollment ({selectedCourse?.price || '$79'}) &rarr;
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

