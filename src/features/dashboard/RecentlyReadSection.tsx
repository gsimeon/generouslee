import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { getRecentlyRead, clearRecentlyRead, RecentlyReadItem } from '../../utils/readingHistory';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

interface RecentlyReadSectionProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const RecentlyReadSection: React.FC<RecentlyReadSectionProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<RecentlyReadItem[]>([]);

  useEffect(() => {
    setItems(getRecentlyRead());
  }, []);

  const handleClear = () => {
    clearRecentlyRead();
    setItems([]);
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffHours = Math.floor(diffMs / 3600000);
      if (diffHours < 1) return 'Just now';
      if (diffHours === 1) return '1 hour ago';
      if (diffHours < 24) return `${diffHours} hours ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays} days ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#B95B3D]" />
            <h3 className="font-serif text-2xl text-[#211C15]">Recently Read</h3>
          </div>
          <p className="text-xs text-[#7E6D56]">
            Pick up where you left off in the library and continue your study.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-[#A8957C] hover:text-[#B95B3D] transition-colors cursor-pointer"
            >
              Clear history
            </button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('explore')}
          >
            Explore Library &rarr;
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <Card className="p-8 text-center space-y-3 bg-white border-[#E7DFD4] border-dashed">
          <BookOpen className="w-8 h-8 text-[#A8957C] mx-auto opacity-70" />
          <h4 className="font-serif text-base text-[#211C15]">No recently opened articles yet</h4>
          <p className="text-xs text-[#7E6D56] max-w-md mx-auto">
            Browse our curated faith reflections, biblical health guides, and marriage wisdom. Articles you explore will appear here so you can easily resume reading anytime.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('explore')}
          >
            Browse Library Guides
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => onNavigate('article', { slug: item.slug })}
              className="bg-white rounded-2xl border border-[#E7DFD4] p-4 sm:p-5 hover:border-[#D2C4B1] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start gap-4">
                {item.coverImage && (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#E7DFD4]/60"
                  />
                )}

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="terracotta" size="sm" className="capitalize">
                      {item.category.replace('-', ' ')}
                    </Badge>
                    <span className="text-[11px] text-[#A8957C] shrink-0">
                      {formatTimeAgo(item.readAt)}
                    </span>
                  </div>

                  <h4 className="font-serif text-base text-[#211C15] font-normal line-clamp-2 group-hover:text-[#B95B3D] transition-colors leading-snug">
                    {item.title}
                  </h4>
                </div>
              </div>

              {/* Progress & Action */}
              <div className="pt-2 border-t border-[#F3EFE9] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#7E6D56]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#A8957C]" />
                    {item.readingTimeMinutes} min read
                  </span>
                  <span className="text-[11px] font-semibold text-[#B95B3D]">
                    {item.progressPercent}% completed
                  </span>
                </div>

                <div className="w-full h-1.5 bg-[#F0EBE1] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#B95B3D] to-[#D97D54] rounded-full"
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-end text-xs font-semibold text-[#B95B3D] group-hover:translate-x-0.5 transition-transform gap-1 pt-1">
                  <span>Resume Reading</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
