import React, { useState, useEffect } from 'react';
import { Search, Filter, Bookmark, BookOpen, Clock, Tag as TagIcon, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { ContentItem, Category, Tag } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

interface ContentExplorerProps {
  initialCategory?: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const ContentExplorerPage: React.FC<ContentExplorerProps> = ({ initialCategory, onNavigate }) => {
  const { toggleSave, isSaved } = useAuth();
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    async function loadExplorerData() {
      setIsLoading(true);
      try {
        const [items, cats, tgs] = await Promise.all([
          api.getContent({
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            tag: selectedTag !== 'all' ? selectedTag : undefined,
            search: searchQuery || undefined
          }),
          api.getCategories(),
          api.getTags()
        ]);
        setContentList(items);
        setCategories(cats);
        setTags(tgs);
      } finally {
        setIsLoading(false);
      }
    }
    loadExplorerData();
  }, [selectedCategory, selectedTag, searchQuery]);

  const currentCategoryObj = categories.find(c => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#E7DFD4] p-8 md:p-12 space-y-4">
        <Badge variant="terracotta" size="md">
          {selectedCategory === 'all' ? 'The Generouslee Wisdom Archive' : currentCategoryObj?.name || 'Category'}
        </Badge>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#211C15]">
          {selectedCategory === 'all'
            ? 'Truth, Nourishment, & Practical Guidance'
            : currentCategoryObj?.name}
        </h1>
        <p className="text-base sm:text-lg text-[#594D3C] max-w-2xl leading-relaxed">
          {selectedCategory === 'all'
            ? 'Browse our complete library of honest essays, relationship scripts, and nervous-system practices designed for the realities of modern womanhood and family.'
            : currentCategoryObj?.description}
        </p>

        {/* Search & Filter Bar */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8957C]" />
            <input
              type="text"
              placeholder="Search by topic, symptom, or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#FAF8F5] border border-[#D2C4B1] text-sm text-[#211C15] focus:outline-none focus:ring-2 focus:ring-[#B95B3D]/30"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 text-xs font-semibold text-[#7E6D56] bg-[#F3EFE9] hover:bg-[#E7DFD4] rounded-full"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A8957C] uppercase tracking-wider">
            Filter By Pillar
          </span>
          <span className="text-xs text-[#7E6D56]">
            Showing {contentList.length} resource{contentList.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#211C15] text-white shadow-sm'
                : 'bg-white text-[#594D3C] border border-[#E7DFD4] hover:bg-[#FAF8F5]'
            }`}
          >
            All Pillars
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-[#B95B3D] text-white shadow-sm'
                  : 'bg-white text-[#594D3C] border border-[#E7DFD4] hover:bg-[#FAF8F5]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tags Sub-Filter */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          <TagIcon className="w-3.5 h-3.5 text-[#A8957C] shrink-0" />
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-colors ${
              selectedTag === 'all' ? 'bg-[#EEF2EB] text-[#4D5D44]' : 'text-[#7E6D56] hover:text-[#211C15]'
            }`}
          >
            All Topics
          </button>
          {tags.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTag(t.name)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-colors ${
                selectedTag === t.name ? 'bg-[#EEF2EB] text-[#4D5D44] font-semibold' : 'text-[#7E6D56] hover:text-[#211C15]'
              }`}
            >
              #{t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="py-20 text-center text-sm text-[#7E6D56]">
          <span className="inline-block w-6 h-6 border-2 border-[#B95B3D] border-t-transparent rounded-full animate-spin mr-2" />
          Gathering resources...
        </div>
      ) : contentList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E7DFD4] p-12 text-center space-y-4 max-w-lg mx-auto">
          <BookOpen className="w-10 h-10 text-[#A8957C] mx-auto" />
          <h3 className="font-serif text-xl text-[#211C15]">No resources found</h3>
          <p className="text-xs text-[#594D3C]">
            We couldn&apos;t find any articles matching this specific filter. Try resetting your tags or submit a question to Ask Generouslee.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTag('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('ask')}
            >
              Ask Generouslee &rarr;
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contentList.map(item => (
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
                  <Badge variant="terracotta" size="sm" className="capitalize bg-white/95">
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
                  title={isSaved(item.id) ? 'Saved in Favorites' : 'Save to Favorites'}
                  aria-label={isSaved(item.id) ? 'Saved in Favorites' : 'Save to Favorites'}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#7E6D56]">
                    <Clock className="w-3.5 h-3.5" />
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
      )}
    </div>
  );
};
