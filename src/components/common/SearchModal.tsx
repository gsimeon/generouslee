import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, BookOpen, HelpCircle, Tag, FileText } from 'lucide-react';
import { api } from '../../services/api';
import { ContentItem, Question } from '../../types';
import { Badge } from './Badge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [contentResults, setContentResults] = useState<ContentItem[]>([]);
  const [questionResults, setQuestionResults] = useState<Question[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setContentResults([]);
      setQuestionResults([]);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setContentResults([]);
      setQuestionResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [content, questions] = await Promise.all([
          api.getContent({ search: query }),
          api.getQuestions({ filter: 'published' })
        ]);
        setContentResults(content);
        setQuestionResults(
          questions.filter(q =>
            q.questionText.toLowerCase().includes(query.toLowerCase()) ||
            q.response?.responseText.toLowerCase().includes(query.toLowerCase())
          )
        );
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularTopics = [
    'Matrescence',
    'Postpartum Rage',
    'Roommate Phase',
    'Toddler Meltdowns',
    'Setting Boundaries',
    'Maternal Guilt'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#211C15]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E7DFD4] shadow-2xl overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E7DFD4] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#A8957C] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search articles, guides, questions, or topics..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full text-base sm:text-lg bg-transparent border-none outline-none text-[#211C15] placeholder-[#A8957C]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#A8957C] hover:text-[#211C15] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs text-[#7E6D56] hover:bg-[#F3EFE9] rounded-lg border border-[#E7DFD4]"
          >
            ESC
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {!query ? (
            <div>
              <p className="text-xs font-semibold text-[#A8957C] uppercase tracking-wider mb-3">
                Suggested Topics & Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularTopics.map(topic => (
                  <button
                    key={topic}
                    onClick={() => setQuery(topic)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF8F5] border border-[#E7DFD4] text-[#594D3C] hover:bg-[#F3EFE9] hover:border-[#D2C4B1] transition-colors cursor-pointer"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          ) : isSearching ? (
            <div className="py-8 text-center text-sm text-[#7E6D56]">
              <span className="inline-block w-4 h-4 border-2 border-[#B95B3D] border-t-transparent rounded-full animate-spin mr-2" />
              Searching the Generouslee library...
            </div>
          ) : contentResults.length === 0 && questionResults.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[#383025] font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#7E6D56] mt-1">
                Have a specific question on this? You can submit it directly to Latisha.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNavigate('ask');
                }}
                className="mt-4 px-4 py-2 bg-[#FAF0ED] text-[#B95B3D] text-xs font-semibold rounded-full hover:bg-[#F3DDD7] transition-colors"
              >
                Ask Generouslee &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {contentResults.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#A8957C] uppercase tracking-wider mb-3">
                    <BookOpen className="w-4 h-4" />
                    <span>Articles & Guides ({contentResults.length})</span>
                  </div>
                  <div className="space-y-2">
                    {contentResults.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onClose();
                          onNavigate('article', { slug: item.slug });
                        }}
                        className="p-3 rounded-2xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#E7DFD4] transition-all cursor-pointer flex items-start justify-between gap-3 group"
                      >
                        <div>
                          <Badge variant="terracotta" size="sm" className="mb-1 capitalize">
                            {item.category.replace('-', ' ')}
                          </Badge>
                          <h4 className="text-sm font-medium text-[#211C15] group-hover:text-[#B95B3D] transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[#7E6D56] line-clamp-1 mt-0.5">{item.excerpt}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#A8957C] group-hover:text-[#B95B3D] group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {questionResults.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#A8957C] uppercase tracking-wider mb-3">
                    <HelpCircle className="w-4 h-4" />
                    <span>Ask Generouslee Archive ({questionResults.length})</span>
                  </div>
                  <div className="space-y-2">
                    {questionResults.map(q => (
                      <div
                        key={q.id}
                        onClick={() => {
                          onClose();
                          onNavigate('ask', { questionId: q.id });
                        }}
                        className="p-3 rounded-2xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#E7DFD4] transition-all cursor-pointer flex items-start justify-between gap-3 group"
                      >
                        <div>
                          <Badge variant="sage" size="sm" className="mb-1 capitalize">
                            Answered by {q.response?.responderName || 'Latisha'}
                          </Badge>
                          <h4 className="text-sm font-medium text-[#211C15] group-hover:text-[#B95B3D] transition-colors line-clamp-2">
                            &ldquo;{q.questionText}&rdquo;
                          </h4>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#A8957C] group-hover:text-[#B95B3D] shrink-0 mt-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
