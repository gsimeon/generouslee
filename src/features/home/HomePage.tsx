import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Heart,
  HelpCircle,
  BookOpen,
  Bookmark,
  Share2,
  Users,
  GraduationCap,
  Award,
  Download,
  Play,
  CheckCircle,
  Mail,
  ChevronRight,
  MessageSquare,
  Compass
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { ContentItem, Question, Category, CommunityPost } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface HomePageProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onOpenAsk: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenAsk }) => {
  const { toggleSave, isSaved, openAuthModal, isAuthenticated, user } = useAuth();
  const [featuredContent, setFeaturedContent] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const [activeTopic, setActiveTopic] = useState<string>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Dynamic recommendations state
  const [recArticles, setRecArticles] = useState<(ContentItem & { matchReason?: string })[]>([]);
  const [recDiscussions, setRecDiscussions] = useState<(CommunityPost & { groupName?: string; groupIcon?: string; matchReason?: string })[]>([]);
  const [recUserInterests, setRecUserInterests] = useState<string[]>([]);
  const [recFavoritesCount, setRecFavoritesCount] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [content, cats, questions, recs] = await Promise.all([
          api.getContent({ status: 'published' }),
          api.getCategories(),
          api.getQuestions({ filter: 'published' }),
          api.getPersonalizedRecommendations()
        ]);
        setFeaturedContent(content);
        setCategories(cats);
        setAnsweredQuestions(questions.slice(0, 3));
        if (recs) {
          setRecArticles(recs.recommendedArticles || []);
          setRecDiscussions(recs.recommendedDiscussions || []);
          setRecUserInterests(recs.userInterestTags || []);
          setRecFavoritesCount(recs.favoriteCount || 0);
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      }
    }
    loadData();
  }, [user]);

  const filteredContent = activeTopic === 'all'
    ? featuredContent
    : featuredContent.filter(c => c.category === activeTopic);

  const tiktokVideos = [
    {
      id: 'tt-1',
      title: 'Healthy, self-motivated women of God: Walking in your daily purpose',
      views: '1.8M views',
      duration: '1:02',
      topic: 'Faith & Purpose',
      takeaway: 'How to awaken your spiritual self-discipline and stop letting distraction steal your calling.'
    },
    {
      id: 'tt-2',
      title: 'Honoring your temple: Why fitness & nutrition are acts of stewardship',
      views: '1.2M views',
      duration: '0:54',
      topic: 'Temple Care & Health',
      takeaway: 'Taking care of your physical body so you have the vitality to serve your family and community.'
    },
    {
      id: 'tt-3',
      title: 'Why you need like-minded women who hold you accountable in love',
      views: '2.4M views',
      duration: '0:48',
      topic: 'Purpose Sisterhood',
      takeaway: 'Stepping away from gossip and isolation to build an uplifting circle that sharpens your faith.'
    }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
    }
  };

  return (
    <div className="space-y-20 md:space-y-28 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 lg:pt-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <Badge variant="terracotta" size="md">
                A Sisterhood of Purpose, Faith & Healthy Living
              </Badge>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#211C15] font-normal leading-[1.12] tracking-tight">
                Healthy, self-motivated women of God walking boldly in <span className="italic text-[#B95B3D]">purpose.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#594D3C] font-normal leading-relaxed max-w-2xl">
                Trade chronic burnout and comparison for grounded spiritual discipline, healthy temple care, family values, and an uplifting community of like-minded women.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('explore')}
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Start Exploring Wisdom
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate('ask')}
                  icon={<HelpCircle className="w-5 h-5 text-[#B95B3D]" />}
                >
                  Ask Generouslee
                </Button>
              </div>

              {/* Social Proof Bar */}
              <div className="pt-6 border-t border-[#E7DFD4] flex items-center gap-6 text-xs text-[#7E6D56]">
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120"
                    alt="Community member"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                    alt="Community member"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="/latisha.jpg"
                    alt="Latisha Langley"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                </div>
                <div>
                  <span className="font-semibold text-[#211C15]">Trusted by 25,000+ women seeking purpose</span>
                  <span className="block text-[#A8957C]">Connecting the TikTok community (@latishalangley) to an enduring sisterhood</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#E7DFD4] shadow-xl bg-white p-3">
                <img
                  src="/latisha.jpg"
                  alt="Latisha Langley, Founder of Generouslee"
                  referrerPolicy="no-referrer"
                  className="w-full h-[440px] sm:h-[480px] object-cover rounded-2xl"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-[#211C15]/90 backdrop-blur-md rounded-2xl p-5 text-white border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#C49746]" />
                    <span className="text-xs uppercase tracking-wider text-[#D2C4B1]">Note from Latisha (@latishalangley)</span>
                  </div>
                  <p className="text-sm font-serif italic text-[#FAF8F5] leading-snug">
                    &ldquo;Healthy, self-motivated women of God seeking like-minded people serving purpose. You are called to walk boldly, honor your vessel, and lift others as you rise.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUNDER INVITATION & INTENT */}
      <section className="bg-white py-16 border-y border-[#E7DFD4]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="sage" size="md">
            Why Generouslee Exists
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#211C15] font-normal max-w-3xl mx-auto leading-snug">
            Social media gives us 60-second clips. <br className="hidden sm:inline" />
            Here, we build the <span className="italic text-[#5D7052]">sisterhood</span> to sustain real purpose.
          </h2>
          <p className="text-[#594D3C] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            You might have found me on TikTok (@latishalangley) sharing faith reflections, daily motivation, and encouraging words for women of God. But short video algorithms cannot hold your hand during deep life seasons, or give you structured space to ask vulnerable questions and cultivate lifelong sisterhood.
            Generouslee is designed as your digital sanctuary—calm, purpose-filled, and grounded in truth.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#B95B3D] hover:underline cursor-pointer"
            >
              <span>Read Latisha&apos;s story & the Generouslee mission</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* RECOMMENDED FOR YOU (DYNAMIC ENGINE BASED ON FAVORITED CONTENT & GROWTH INTERESTS) */}
      <section id="recommended-for-you" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-[#FAF8F5] border border-[#E7DFD4] rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E7DFD4] pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="terracotta" size="sm">
                  <Sparkles className="w-3 h-3 mr-1 inline" /> Recommended For You
                </Badge>
                {recFavoritesCount > 0 && (
                  <span className="text-xs text-[#7E6D56]">
                    Curated from your {recFavoritesCount} saved favorites & focus areas
                  </span>
                )}
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#211C15] font-normal">
                Personalized Wisdom & Sisterhood
              </h2>
              <p className="text-sm text-[#594D3C] max-w-2xl">
                Dynamically tailored according to your favorited spiritual reads and active growth seasons.
              </p>
            </div>

            {recUserInterests.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#A8957C]">Your active interests:</span>
                {recUserInterests.map(interest => (
                  <Badge key={interest} variant="neutral" size="sm">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recommended Articles (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-[#211C15] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#B95B3D]" />
                  Articles Tuned to Your Journey
                </h3>
                <button
                  onClick={() => onNavigate('explore')}
                  className="text-xs text-[#B95B3D] font-medium hover:underline cursor-pointer"
                >
                  Explore library &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recArticles.slice(0, 4).map(item => (
                  <Card
                    key={item.id}
                    hoverEffect
                    onClick={() => onNavigate('article', { slug: item.slug })}
                    className="p-5 space-y-3 bg-white border-[#E7DFD4] flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="sage" size="sm" className="capitalize">
                          {item.category.replace('-', ' ')}
                        </Badge>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSave(item.id);
                          }}
                          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                            isSaved(item.id)
                              ? 'text-[#B95B3D] bg-[#FAF0ED]'
                              : 'text-[#A8957C] hover:text-[#211C15]'
                          }`}
                          title="Save to Favorites"
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved(item.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <h4 className="font-serif text-base sm:text-lg text-[#211C15] font-normal line-clamp-2">
                        {item.title}
                      </h4>

                      <p className="text-xs text-[#7E6D56] line-clamp-2">
                        {item.excerpt}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-[#F3EFE9]">
                      {item.matchReason && (
                        <div className="text-[11px] text-[#5D7052] font-medium flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 shrink-0" />
                          <span>{item.matchReason}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-[#A8957C]">
                        <span>{item.readingTimeMinutes} min read</span>
                        <span className="text-[#B95B3D] font-semibold flex items-center gap-1">
                          Read Now <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recommended Community Discussions (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-[#211C15] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#5D7052]" />
                  Community Circles For You
                </h3>
                <button
                  onClick={() => onNavigate('community')}
                  className="text-xs text-[#B95B3D] font-medium hover:underline cursor-pointer"
                >
                  All circles &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {recDiscussions.map(disc => (
                  <div
                    key={disc.id}
                    onClick={() => onNavigate('community')}
                    className="p-4 bg-white rounded-2xl border border-[#E7DFD4] hover:border-[#D2C4B1] hover:shadow-xs transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="neutral" size="sm">
                        {disc.groupName}
                      </Badge>
                      <span className="text-[10px] text-[#5D7052] font-medium">Recommended Circle</span>
                    </div>

                    <h5 className="font-serif text-sm font-semibold text-[#211C15] leading-snug line-clamp-2">
                      &ldquo;{disc.title}&rdquo;
                    </h5>

                    <p className="text-xs text-[#7E6D56] line-clamp-2">
                      {disc.content}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#A8957C] pt-2 border-t border-[#F3EFE9]">
                      <span>{disc.authorName}</span>
                      <span className="flex items-center gap-1 text-[#5D7052]">
                        <MessageSquare className="w-3 h-3" />
                        {disc.commentsCount} reflections
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#EEF2EB] border border-[#D5DFD1] space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#5D7052]" />
                  <span className="text-xs font-semibold text-[#384332]">Want to adjust your recommendations?</span>
                </div>
                <p className="text-xs text-[#5D7052] leading-relaxed">
                  Favorite articles in the library or update your season focus to refine your personalized feed.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAuthModal('onboarding')}
                  className="w-full text-xs"
                >
                  Adjust Growth Seasons
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TOPIC / PILLAR SELECTOR & FEATURED CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Badge variant="terracotta" size="sm">
              Explore Our Core Pillars
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#211C15] font-normal mt-2">
              Wisdom For Every Season
            </h2>
            <p className="text-sm text-[#7E6D56] mt-1">
              Select a pillar to explore thoughtful essays, scripts, and practices.
            </p>
          </div>

          {/* Topic Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTopic('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTopic === 'all'
                  ? 'bg-[#211C15] text-white shadow-sm'
                  : 'bg-white text-[#594D3C] border border-[#E7DFD4] hover:bg-[#FAF8F5]'
              }`}
            >
              All Pillars
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTopic(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTopic === cat.slug
                    ? 'bg-[#B95B3D] text-white shadow-sm'
                    : 'bg-white text-[#594D3C] border border-[#E7DFD4] hover:bg-[#FAF8F5]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredContent.slice(0, 6).map(item => (
            <Card
              key={item.id}
              hoverEffect
              onClick={() => onNavigate('article', { slug: item.slug })}
              className="flex flex-col justify-between overflow-hidden group p-0 border-[#E7DFD4]"
            >
              <div className="relative h-52 overflow-hidden bg-[#E7DFD4]">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="terracotta" size="sm" className="capitalize backdrop-blur-xs bg-white/90">
                    {item.category.replace('-', ' ')}
                  </Badge>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(item.id);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                    isSaved(item.id)
                      ? 'bg-[#B95B3D] text-white'
                      : 'bg-white/80 text-[#594D3C] hover:bg-white hover:text-[#B95B3D]'
                  }`}
                  title={isSaved(item.id) ? 'Saved' : 'Save article'}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#7E6D56]">
                    <span>{item.readingTimeMinutes} min read</span>
                    <span>&bull;</span>
                    <span>{item.author.name}</span>
                  </div>
                  <h3 className="font-serif text-xl font-normal text-[#211C15] group-hover:text-[#B95B3D] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#594D3C] line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F3EFE9] flex items-center justify-between text-xs text-[#7E6D56]">
                  <span className="font-medium text-[#B95B3D] group-hover:underline inline-flex items-center gap-1">
                    Read article &rarr;
                  </span>
                  <span>{item.saveCount} saves</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center pt-4">
          <Button
            variant="secondary"
            size="md"
            onClick={() => onNavigate('explore')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Explore All Guides & Articles
          </Button>
        </div>
      </section>

      {/* 4. TIKTOK & SOCIAL MEDIA SHOWCASE */}
      <section className="bg-[#F3EFE9] py-16 border-y border-[#E7DFD4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="rose" size="sm">
                From The Feed To Real Life
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#211C15] font-normal mt-2">
                Curated TikTok Insights
              </h2>
              <p className="text-sm text-[#594D3C] mt-1 max-w-xl">
                The bite-sized reflections that resonated with millions on social media, now paired with deeper articles and exercises.
              </p>
            </div>
            <a
              href="https://www.tiktok.com/@latishalangley"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#B95B3D] hover:underline inline-flex items-center gap-1"
            >
              Follow @latishalangley on TikTok &rarr;
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiktokVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-2xl border border-[#E7DFD4] p-5 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="sage" size="sm">{video.topic}</Badge>
                  <span className="text-[#A8957C] font-medium">{video.views}</span>
                </div>

                <div className="relative rounded-xl bg-[#211C15] text-white p-6 flex flex-col justify-between h-44 overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] text-[#A8957C]">
                    <span>TIKTOK LESSON</span>
                    <span>{video.duration}</span>
                  </div>
                  <p className="font-serif text-base text-white/95 leading-snug">
                    &ldquo;{video.title}&rdquo;
                  </p>
                  <a
                    href="https://www.tiktok.com/@latishalangley"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-[#C49746] hover:text-[#e0b05b] transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span className="font-medium">Watch on TikTok (@latishalangley)</span>
                  </a>
                </div>

                <div>
                  <p className="text-xs text-[#594D3C] leading-relaxed">
                    <strong className="text-[#211C15]">Key takeaway:</strong> {video.takeaway}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SIGNATURE FEATURE: "ASK GENEROUSLEE" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF0ED] rounded-3xl border border-[#F3DDD7] p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <Badge variant="terracotta" size="md">
                Signature Community Pillar
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#211C15] font-normal leading-tight">
                Ask Generouslee. <br />
                <span className="italic text-[#B95B3D]">Real questions. Real answers.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#594D3C] leading-relaxed">
                Struggling with purpose alignment? Honoring your body and mindset? Navigating marriage and motherhood with faith?
                Submit your question anonymously. Latisha and our mentorship team review questions weekly to provide compassionate, actionable, faith-anchored counsel.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('ask')}
                  icon={<HelpCircle className="w-5 h-5" />}
                >
                  Submit Your Question
                </Button>
              </div>
            </div>

            {/* Recently Answered Teasers */}
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-semibold text-[#A8957C] uppercase tracking-wider">
                Recent Public Responses
              </p>
              {answeredQuestions.map(q => (
                <div
                  key={q.id}
                  onClick={() => onNavigate('ask', { questionId: q.id })}
                  className="bg-white rounded-2xl border border-[#E7DFD4] p-5 space-y-3 hover:border-[#D2C4B1] hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#B95B3D] font-semibold capitalize">
                      {q.category} &bull; {q.isAnonymous ? 'Anonymous' : q.authorName} asked:
                    </span>
                    <Badge variant="sage" size="sm">Answered</Badge>
                  </div>
                  <h4 className="font-serif text-base text-[#211C15] font-normal leading-snug">
                    &ldquo;{q.questionText}&rdquo;
                  </h4>
                  {q.response && (
                    <p className="text-xs text-[#594D3C] line-clamp-2 italic bg-[#FAF8F5] p-3 rounded-xl border border-[#E7DFD4]/50">
                      &ldquo;{q.response.responseText}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. ECOSYSTEM TEASERS: Community, Academy, Mentorship */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="sage" size="sm">A Complete Growth Ecosystem</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#211C15] font-normal">
            More than articles. A living ecosystem.
          </h2>
          <p className="text-sm text-[#7E6D56]">
            Deepen your journey through community connection, video masterclasses, and tailored 1-on-1 mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Community */}
          <Card className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2EB] text-[#5D7052] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#211C15]">Community Circles</h3>
              <p className="text-sm text-[#594D3C] leading-relaxed">
                Join intimate, moderated safe-spaces like <em>Women of God Serving Purpose</em>, <em>New Mothers Circle</em>, and <em>Temple Care & Restoration</em>.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('community')}
              className="w-full"
            >
              Explore Circles
            </Button>
          </Card>

          {/* Academy */}
          <Card className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF0ED] text-[#B95B3D] flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#211C15]">Generouslee Academy</h3>
              <p className="text-sm text-[#594D3C] leading-relaxed">
                Step-by-step masterclasses: <em>Walking in Divine Purpose</em> and <em>Marriage After Baby: The Communication Playbook</em>.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('academy')}
              className="w-full"
            >
              View Masterclasses
            </Button>
          </Card>

          {/* Mentorship */}
          <Card className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF8EE] text-[#C49746] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#211C15]">1-on-1 Mentorship</h3>
              <p className="text-sm text-[#594D3C] leading-relaxed">
                Book confidential guidance sessions with Latisha Langley (@latishalangley) and specialized purpose mentors.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('mentorship')}
              className="w-full"
            >
              Book a Mentor Session
            </Button>
          </Card>
        </div>
      </section>

      {/* 7. FREE DOWNLOADABLE RESOURCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#E7DFD4] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <Badge variant="gold" size="sm">Free Printable & Somatic Audio</Badge>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#211C15] font-normal">
              The Temple Care & Emotional Decompression Kit
            </h3>
            <p className="text-sm text-[#594D3C] leading-relaxed">
              Printable workbook, somatic grounding protocol, and the 5-4-3-2-1 nervous system reset guide for overstimulated evenings.
            </p>
          </div>
          <div className="shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('resources')}
              icon={<Download className="w-5 h-5" />}
            >
              Download Free Kit
            </Button>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="bg-[#FAF8F5] py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="sage" size="sm">Community Reflections</Badge>
            <h2 className="font-serif text-3xl font-normal text-[#211C15]">
              Real Stories From Real Women
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-[#E7DFD4] p-6 space-y-4">
              <div className="flex text-[#C49746]">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>&starf;</span>
                ))}
              </div>
              <p className="text-sm text-[#383025] italic leading-relaxed">
                &ldquo;Latisha&apos;s counsel on walking in purpose without losing my peace completely transformed my morning routine. Knowing other women of God are striving for health and purpose was the anchor I needed.&rdquo;
              </p>
              <div className="text-xs font-semibold text-[#7E6D56]">
                — Kemi O., Mother of 2
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E7DFD4] p-6 space-y-4">
              <div className="flex text-[#C49746]">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>&starf;</span>
                ))}
              </div>
              <p className="text-sm text-[#383025] italic leading-relaxed">
                &ldquo;My husband and I started doing the 6-second kiss rule and pausing chore talk after 8:30 PM. For the first time in two years, we feel like partners rather than tired roommates.&rdquo;
              </p>
              <div className="text-xs font-semibold text-[#7E6D56]">
                — Maya & David R.
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E7DFD4] p-6 space-y-4">
              <div className="flex text-[#C49746]">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>&starf;</span>
                ))}
              </div>
              <p className="text-sm text-[#383025] italic leading-relaxed">
                &ldquo;The articles on temple care and faith gave me the courage to prioritize my physical and spiritual health without guilt. Generouslee is the antidote to the superficial social media scroll.&rdquo;
              </p>
              <div className="text-xs font-semibold text-[#7E6D56]">
                — Elena M., First-time mom
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. NEWSLETTER: "YOUR GENEROUSLEE WEEKLY" */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#211C15] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-[#383025] text-[#C49746]">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="font-serif text-3xl font-normal">
              Your Generouslee Weekly
            </h3>
            <p className="text-sm text-[#D2C4B1] leading-relaxed">
              Every Sunday morning: One grounding reflection, one marriage connection prompt, and one practical gentle parenting script. No spam, only nourishment.
            </p>
          </div>

          {newsletterSuccess ? (
            <div className="inline-flex items-center gap-2 p-3 bg-[#383025] border border-[#5D7052] rounded-2xl text-xs text-[#EEF2EB]">
              <CheckCircle className="w-4 h-4 text-[#5D7052]" />
              <span>You&apos;re subscribed. Look for Sunday&apos;s reflection in your inbox!</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-full bg-[#383025] border border-[#594D3C] text-white text-sm focus:outline-none focus:border-[#B95B3D] placeholder-[#7E6D56]"
              />
              <Button type="submit" variant="primary" size="md">
                Subscribe Free
              </Button>
            </form>
          )}

          <p className="text-[11px] text-[#7E6D56]">
            Free forever &bull; Unsubscribe in one click &bull; Your privacy is strictly protected
          </p>
        </div>
      </section>
    </div>
  );
};
