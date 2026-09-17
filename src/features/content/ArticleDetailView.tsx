import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Bookmark,
  Share2,
  Clock,
  Calendar,
  Volume2,
  Check,
  ArrowLeft,
  HelpCircle,
  Mail,
  Heart,
  MessageCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { ContentItem } from '../../types';
import { addRecentlyRead } from '../../utils/readingHistory';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';

interface ArticleDetailProps {
  slug: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const ArticleDetailView: React.FC<ArticleDetailProps> = ({ slug, onNavigate }) => {
  const { toggleSave, isSaved } = useAuth();
  const [article, setArticle] = useState<ContentItem | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ContentItem[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      setIsLoading(true);
      try {
        const item = await api.getContentBySlug(slug);
        setArticle(item);
        addRecentlyRead(item, 85);
        const related = await api.getContent({ category: item.category });
        setRelatedArticles(related.filter(r => r.id !== item.id).slice(0, 3));
      } catch (err) {
        console.error('Failed to load article', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-28 text-center text-sm text-[#7E6D56]">
        <span className="inline-block w-6 h-6 border-2 border-[#B95B3D] border-t-transparent rounded-full animate-spin mr-2" />
        Preparing your reading space...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#211C15]">Article Not Found</h2>
        <p className="text-sm text-[#594D3C]">
          The reflection you are looking for may have been archived or moved.
        </p>
        <Button variant="primary" size="md" onClick={() => onNavigate('explore')}>
          Browse All Articles
        </Button>
      </div>
    );
  }

  const handleShare = (platform: 'whatsapp' | 'x' | 'facebook' | 'copy') => {
    const url = window.location.href;
    const text = `${article.title} — Generouslee`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
    } else if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      {/* 1. Breadcrumbs & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('explore')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7E6D56] hover:text-[#211C15] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#A8957C]">
          <span onClick={() => onNavigate('home')} className="hover:text-[#211C15] cursor-pointer">Home</span>
          <ChevronRight className="w-3 h-3" />
          <span onClick={() => onNavigate('category', { slug: article.category })} className="hover:text-[#211C15] capitalize cursor-pointer">
            {article.category.replace('-', ' ')}
          </span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#383025] truncate max-w-[200px]">{article.title}</span>
        </div>
      </div>

      {/* 2. Article Header */}
      <header className="space-y-6">
        <Badge variant="terracotta" size="md" className="capitalize">
          {article.category.replace('-', ' ')}
        </Badge>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#211C15] leading-[1.18] tracking-tight">
          {article.title}
        </h1>

        <p className="text-lg sm:text-xl text-[#594D3C] font-normal leading-relaxed">
          {article.excerpt}
        </p>

        {/* Author & Meta Row */}
        <div className="pt-4 border-t border-[#E7DFD4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatarUrl}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-[#D2C4B1]"
            />
            <div>
              <p className="text-sm font-semibold text-[#211C15]">{article.author.name}</p>
              <p className="text-xs text-[#7E6D56]">{article.author.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#7E6D56]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTimeMinutes} min read
            </span>
          </div>
        </div>

        {/* Action Toolbar: Save, Audio preview, Share */}
        <div className="bg-[#FAF8F5] border border-[#E7DFD4] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Save to Favorites Button */}
            <button
              onClick={() => toggleSave(article.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isSaved(article.id)
                  ? 'bg-[#B95B3D] text-white border-[#B95B3D]'
                  : 'bg-white text-[#383025] border-[#D2C4B1] hover:bg-[#F3EFE9]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{isSaved(article.id) ? 'Saved in Favorites' : 'Save to Favorites'}</span>
            </button>

            {/* Simulated Audio Reflection */}
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-[#5D7052] text-white border-[#5D7052]'
                  : 'bg-white text-[#4D5D44] border-[#DCE4D6] hover:bg-[#EEF2EB]'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isPlayingAudio ? 'Pause Audio Reflection' : 'Listen (Audio)'}</span>
            </button>
          </div>

          {/* Social Sharing */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#A8957C] hidden sm:inline">Share:</span>
            <button
              onClick={() => handleShare('whatsapp')}
              className="px-2.5 py-1.5 bg-white border border-[#D2C4B1] rounded-full hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors"
              title="Share to WhatsApp"
            >
              WhatsApp
            </button>
            <button
              onClick={() => handleShare('x')}
              className="px-2.5 py-1.5 bg-white border border-[#D2C4B1] rounded-full hover:bg-black hover:text-white hover:border-black transition-colors"
              title="Share to X"
            >
              X
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="px-2.5 py-1.5 bg-white border border-[#D2C4B1] rounded-full hover:bg-[#FAF8F5] transition-colors flex items-center gap-1"
              title="Copy Link"
            >
              {isCopied ? <Check className="w-3 h-3 text-[#5D7052]" /> : <Share2 className="w-3 h-3" />}
              <span>{isCopied ? 'Copied' : 'Link'}</span>
            </button>
          </div>
        </div>

        {/* Audio player bar if active */}
        {isPlayingAudio && (
          <div className="bg-[#EEF2EB] border border-[#DCE4D6] rounded-2xl p-4 flex items-center justify-between gap-4 animate-fade-in text-xs text-[#4D5D44]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5D7052] animate-pulse" />
              <span>Playing narrator audio: &ldquo;{article.title}&rdquo; (Latisha Langley)</span>
            </div>
            <span className="font-mono text-[11px]">02:14 / 05:40</span>
          </div>
        )}
      </header>

      {/* 3. Hero Visual Image */}
      <div className="rounded-3xl overflow-hidden border border-[#E7DFD4] shadow-md bg-[#FAF8F5]">
        <img
          src={article.coverImage}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="w-full max-h-[460px] object-cover"
        />
      </div>

      {/* 4. Article Editorial Body */}
      <div className="prose prose-stone lg:prose-lg max-w-none text-[#24211D] space-y-6 leading-relaxed font-sans">
        {article.body.split('\n\n').map((para, idx) => {
          const trimmed = para.trim();
          if (!trimmed) return null;

          if (trimmed.startsWith('# ')) {
            return (
              <h2 key={idx} className="font-serif text-2xl sm:text-3xl font-normal text-[#211C15] pt-6 pb-2">
                {trimmed.replace('# ', '')}
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-serif text-xl sm:text-2xl font-normal text-[#211C15] pt-4 pb-1">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-[#B95B3D] bg-[#FAF0ED] p-5 my-6 rounded-r-2xl font-serif italic text-base sm:text-lg text-[#211C15]"
              >
                {trimmed.replace('> ', '').replace(/^"|"$/g, '')}
              </blockquote>
            );
          }
          if (trimmed.startsWith('1. ') || trimmed.startsWith('- ')) {
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E7DFD4] space-y-2 my-4">
                <p className="text-sm sm:text-base text-[#383025] leading-relaxed whitespace-pre-line">
                  {trimmed}
                </p>
              </div>
            );
          }
          return (
            <p key={idx} className="text-base sm:text-lg text-[#383025] leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>

      {/* 5. Tags & Categorization */}
      <div className="pt-6 border-t border-[#E7DFD4] flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#A8957C] uppercase tracking-wider mr-2">
          Themes in this reflection:
        </span>
        {article.tags.map(tag => (
          <Badge key={tag} variant="neutral" size="sm">
            #{tag}
          </Badge>
        ))}
      </div>

      {/* 6. Ask Generouslee Inline Prompt */}
      <div className="bg-[#FAF0ED] rounded-3xl border border-[#F3DDD7] p-8 space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl text-[#B95B3D] shadow-xs">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl text-[#211C15]">
              Does this resonate with your current season?
            </h3>
            <p className="text-sm text-[#594D3C] leading-relaxed">
              If you have a personal question about walking in purpose, temple care, or navigating relational shifts, submit it to Latisha through Ask Generouslee.
            </p>
          </div>
        </div>
        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="md" onClick={() => onNavigate('ask')}>
            Ask Latisha a Question &rarr;
          </Button>
        </div>
      </div>

      {/* 7. Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-[#E7DFD4]">
          <h3 className="font-serif text-2xl font-normal text-[#211C15]">
            Further Reading on {article.category.replace('-', ' ')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map(rel => (
              <Card
                key={rel.id}
                hoverEffect
                onClick={() => onNavigate('article', { slug: rel.slug })}
                className="p-0 overflow-hidden border-[#E7DFD4]"
              >
                <img
                  src={rel.coverImage}
                  alt={rel.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover"
                />
                <div className="p-4 space-y-2">
                  <span className="text-[11px] font-semibold text-[#A8957C] uppercase">
                    {rel.readingTimeMinutes} min read
                  </span>
                  <h4 className="font-serif text-base text-[#211C15] font-normal line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
