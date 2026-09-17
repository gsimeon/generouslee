import React, { useState, useMemo } from 'react';
import { Sparkles, X, Search, BookOpen, Shuffle, Check } from 'lucide-react';
import { REFLECTION_PROMPT_LIBRARY, ReflectionPromptItem } from '../../data/reflectionPrompts';

interface PromptLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: ReflectionPromptItem) => void;
  selectedPromptId?: string;
}

export const PromptLibraryModal: React.FC<PromptLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
  selectedPromptId
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => [
    { id: 'all', label: 'All Prompts', emoji: '✨' },
    { id: 'peace', label: "God's Peace", emoji: '🕊️' },
    { id: 'release', label: 'Surrender & Release', emoji: '🌿' },
    { id: 'gratitude', label: 'Gratitude & Wonder', emoji: '🙏' },
    { id: 'motherhood', label: 'Motherhood Grace', emoji: '🤍' },
    { id: 'faith', label: 'Faith Anchors', emoji: '✨' },
    { id: 'temple', label: 'Temple & Rest', emoji: '🌸' },
  ], []);

  const filteredPrompts = useMemo(() => {
    return REFLECTION_PROMPT_LIBRARY.filter(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.prompt.toLowerCase().includes(q) ||
          item.scriptureAnchor.toLowerCase().includes(q) ||
          item.placeholderHint.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const handleRandomPick = () => {
    const randomIndex = Math.floor(Math.random() * REFLECTION_PROMPT_LIBRARY.length);
    const chosen = REFLECTION_PROMPT_LIBRARY[randomIndex];
    onSelectPrompt(chosen);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FAF8F5] border border-[#E7DFD4] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E7DFD4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F0EBE1] flex items-center justify-center text-[#B95B3D]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-[#211C15]">Prompt of the Day Library</h3>
              <p className="text-xs text-[#7E6D56]">
                Thoughtful, scripture-anchored prompts to unlock your journaling flow.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomPick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F5EFE6] text-[#B95B3D] hover:bg-[#EDE3D5] transition-colors cursor-pointer border border-[#E7DFD4]"
              title="Pick a random prompt"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Inspire Me</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#A8957C] hover:text-[#211C15] hover:bg-[#F0EBE1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#F0EBE1] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#A8957C] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by theme, scripture, or keywords (peace, surrender, temple)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#D2C4B1] bg-[#FAF8F5] text-xs text-[#211C15] placeholder-[#A8957C] focus:outline-none focus:border-[#B95B3D]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#A8957C] hover:text-[#211C15]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[#B95B3D] text-white border-[#B95B3D] font-semibold shadow-2xs'
                    : 'bg-[#FAF8F5] text-[#594D3C] border-[#E7DFD4] hover:border-[#B95B3D]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Prompts List Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {filteredPrompts.length === 0 ? (
            <div className="p-8 text-center text-[#7E6D56] bg-white rounded-2xl border border-[#E7DFD4] space-y-2">
              <BookOpen className="w-8 h-8 text-[#A8957C] mx-auto opacity-50" />
              <p className="text-sm font-medium text-[#211C15]">No prompts match your search</p>
              <p className="text-xs">Try searching for other words or reset the category filter.</p>
            </div>
          ) : (
            filteredPrompts.map(item => {
              const isSelected = selectedPromptId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectPrompt(item);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-[#FAF0ED] border-[#B95B3D] shadow-xs ring-1 ring-[#B95B3D]'
                      : 'bg-white border-[#E7DFD4] hover:border-[#B95B3D] hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[#B95B3D] flex items-center gap-1 bg-[#FAF0ED] px-2.5 py-0.5 rounded-full border border-[#F3DDD7]">
                          <span>{item.categoryEmoji}</span>
                          <span>{item.categoryLabel}</span>
                        </span>
                        <span className="text-[10px] text-[#A8957C] uppercase font-semibold">
                          Recommended: {item.suggestedMode === 'gratitude' ? 'Gratitude Log' : item.suggestedMode === 'challenge' ? 'Challenge Log' : 'Full Alignment'}
                        </span>
                      </div>

                      <h4 className="font-serif text-base text-[#211C15] group-hover:text-[#B95B3D] transition-colors leading-snug">
                        “{item.prompt}”
                      </h4>

                      <p className="text-[11px] text-[#5D7052] italic font-medium">
                        {item.scriptureAnchor}
                      </p>

                      <p className="text-[11px] text-[#7E6D56]">
                        {item.placeholderHint}
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`shrink-0 text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#B95B3D] text-white'
                          : 'bg-[#F0EBE1] text-[#594D3C] group-hover:bg-[#B95B3D] group-hover:text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <span>Use This</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#E7DFD4] flex items-center justify-between text-xs text-[#7E6D56]">
          <span>
            {filteredPrompts.length} prompt{filteredPrompts.length === 1 ? '' : 's'} available
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-[#D2C4B1] text-[#594D3C] hover:bg-[#FAF8F5] transition-colors font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
