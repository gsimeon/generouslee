import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Sparkles,
  Heart,
  PenLine,
  Filter,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { JournalEntry } from '../../types';
import { Badge } from '../../components/common/Badge';

interface ReflectionTrendsChartProps {
  entries: JournalEntry[];
}

type TrendMetric = 'wordCount' | 'sentiment' | 'categories';

export const ReflectionTrendsChart: React.FC<ReflectionTrendsChartProps> = ({ entries }) => {
  const [activeMetric, setActiveMetric] = useState<TrendMetric>('wordCount');
  const [timeRange, setTimeRange] = useState<'7days' | 'all'>('all');

  // Sort chronological for timeline charts
  const sortedChronological = [...entries].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const chartData = sortedChronological.map(e => {
    const d = new Date(e.date + 'T00:00:00');
    const formattedDate = isNaN(d.getTime())
      ? e.date
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const words = e.wordCount ?? (e.reflectionText ? e.reflectionText.trim().split(/\s+/).filter(Boolean).length : 0);
    const sentiment = e.sentimentScore ?? 85;

    return {
      date: formattedDate,
      fullDate: e.date,
      words,
      sentiment,
      category: e.category || 'Faith',
      mood: e.moodTag || 'peaceful',
      emoji: e.moodEmoji || '🕊️',
      title: e.prompt
    };
  });

  // Calculate Category breakdown
  const categoryCounts: Record<string, { count: number; totalWords: number }> = {};
  entries.forEach(e => {
    const cat = e.category || 'Faith';
    if (!categoryCounts[cat]) {
      categoryCounts[cat] = { count: 0, totalWords: 0 };
    }
    const words = e.wordCount ?? (e.reflectionText ? e.reflectionText.trim().split(/\s+/).filter(Boolean).length : 0);
    categoryCounts[cat].count += 1;
    categoryCounts[cat].totalWords += words;
  });

  const categoryBarData = Object.entries(categoryCounts).map(([cat, data]) => ({
    category: cat,
    reflections: data.count,
    avgWords: Math.round(data.totalWords / (data.count || 1))
  }));

  // Aggregate stats
  const totalWords = chartData.reduce((acc, curr) => acc + curr.words, 0);
  const avgWords = chartData.length > 0 ? Math.round(totalWords / chartData.length) : 0;
  const avgSentiment = chartData.length > 0
    ? Math.round(chartData.reduce((acc, curr) => acc + curr.sentiment, 0) / chartData.length)
    : 85;

  // Top category
  let topCategory = 'Faith';
  let maxCatCount = 0;
  Object.entries(categoryCounts).forEach(([cat, d]) => {
    if (d.count > maxCatCount) {
      maxCatCount = d.count;
      topCategory = cat;
    }
  });

  return (
    <div className="bg-white rounded-3xl border border-[#E7DFD4] p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3EFE9] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#B95B3D]" />
            <h3 className="font-serif text-2xl text-[#211C15]">Reflection Trends & Growth Depth</h3>
          </div>
          <p className="text-xs text-[#7E6D56]">
            Visual insights from your historical journaling entries: tracking spiritual depth, consistency, and sentiment.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] border border-[#E7DFD4] rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveMetric('wordCount')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeMetric === 'wordCount'
                ? 'bg-white text-[#B95B3D] shadow-2xs font-semibold'
                : 'text-[#7E6D56] hover:text-[#211C15]'
            }`}
          >
            Word Count Growth
          </button>
          <button
            onClick={() => setActiveMetric('sentiment')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeMetric === 'sentiment'
                ? 'bg-white text-[#5D7052] shadow-2xs font-semibold'
                : 'text-[#7E6D56] hover:text-[#211C15]'
            }`}
          >
            Peace & Sentiment
          </button>
          <button
            onClick={() => setActiveMetric('categories')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeMetric === 'categories'
                ? 'bg-white text-[#C49746] shadow-2xs font-semibold'
                : 'text-[#7E6D56] hover:text-[#211C15]'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {/* Quick Trend Summary KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD4] space-y-1">
          <span className="text-[11px] font-semibold text-[#7E6D56] uppercase tracking-wider block">
            Total Words Written
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold text-[#211C15]">{totalWords}</span>
            <span className="text-[11px] text-[#A8957C]">words</span>
          </div>
          <span className="text-[10px] text-[#5D7052] font-medium flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5" /> Across {entries.length} reflections
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD4] space-y-1">
          <span className="text-[11px] font-semibold text-[#7E6D56] uppercase tracking-wider block">
            Average Entry Depth
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold text-[#B95B3D]">{avgWords}</span>
            <span className="text-[11px] text-[#A8957C]">words / entry</span>
          </div>
          <span className="text-[10px] text-[#7E6D56]">
            {avgWords > 40 ? 'Deep spiritual contemplation' : 'Consistent concise grounding'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD4] space-y-1">
          <span className="text-[11px] font-semibold text-[#7E6D56] uppercase tracking-wider block">
            Positive Sentiment
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold text-[#5D7052]">{avgSentiment}%</span>
            <span className="text-[11px] text-[#A8957C]">peace index</span>
          </div>
          <span className="text-[10px] text-[#5D7052] font-medium flex items-center gap-0.5">
            <Heart className="w-2.5 h-2.5" /> Grounded in gratitude
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD4] space-y-1">
          <span className="text-[11px] font-semibold text-[#7E6D56] uppercase tracking-wider block">
            Primary Growth Theme
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-lg font-bold text-[#C49746] truncate">{topCategory}</span>
          </div>
          <span className="text-[10px] text-[#7E6D56]">
            {maxCatCount} reflections tagged
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="pt-2">
        {chartData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center bg-[#FAF8F5] rounded-2xl border border-dashed border-[#D2C4B1] p-6 text-center space-y-2">
            <PenLine className="w-8 h-8 text-[#A8957C]" />
            <p className="text-sm font-medium text-[#211C15]">No journal reflections to visualize yet</p>
            <p className="text-xs text-[#7E6D56]">Log your first reflection in the Daily Reflection section above to see trends emerge.</p>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeMetric === 'wordCount' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B95B3D" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#B95B3D" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EBE1" />
                  <XAxis
                    dataKey="date"
                    stroke="#A8957C"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#E7DFD4' }}
                  />
                  <YAxis
                    stroke="#A8957C"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-xl border border-[#E7DFD4] shadow-lg text-xs space-y-1">
                            <div className="flex items-center justify-between gap-3 border-b border-[#F3EFE9] pb-1">
                              <span className="font-semibold text-[#211C15]">{d.fullDate}</span>
                              <span className="text-[11px] text-[#B95B3D] font-medium">{d.category}</span>
                            </div>
                            <div className="text-[#594D3C]">
                              <span className="font-bold text-[#B95B3D] text-sm">{d.words}</span> words written
                            </div>
                            <div className="text-[10px] text-[#7E6D56] flex items-center gap-1">
                              <span>Mood: {d.emoji} {d.mood}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="words"
                    stroke="#B95B3D"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorWords)"
                    name="Word Count"
                  />
                </AreaChart>
              ) : activeMetric === 'sentiment' ? (
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EBE1" />
                  <XAxis
                    dataKey="date"
                    stroke="#A8957C"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#E7DFD4' }}
                  />
                  <YAxis
                    domain={[40, 100]}
                    stroke="#A8957C"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-xl border border-[#E7DFD4] shadow-lg text-xs space-y-1">
                            <div className="flex items-center justify-between gap-3 border-b border-[#F3EFE9] pb-1">
                              <span className="font-semibold text-[#211C15]">{d.fullDate}</span>
                              <span className="text-[11px] text-[#5D7052] font-medium">{d.category}</span>
                            </div>
                            <div className="text-[#594D3C]">
                              Spiritual Peace Score:{' '}
                              <span className="font-bold text-[#5D7052] text-sm">{d.sentiment}%</span>
                            </div>
                            <div className="text-[10px] text-[#7E6D56]">
                              Emotional Tone: {d.emoji} {d.mood}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sentiment"
                    stroke="#5D7052"
                    strokeWidth={3}
                    dot={{ fill: '#5D7052', r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
                    activeDot={{ r: 6, fill: '#5D7052' }}
                    name="Positive Peace Index (%)"
                  />
                </LineChart>
              ) : (
                <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EBE1" />
                  <XAxis
                    dataKey="category"
                    stroke="#A8957C"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#E7DFD4' }}
                  />
                  <YAxis
                    stroke="#A8957C"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-xl border border-[#E7DFD4] shadow-lg text-xs space-y-1">
                            <span className="font-semibold text-[#211C15] block border-b border-[#F3EFE9] pb-1">
                              {d.category}
                            </span>
                            <div className="text-[#594D3C]">
                              <span className="font-bold text-[#C49746]">{d.reflections}</span> reflections logged
                            </div>
                            <div className="text-[10px] text-[#7E6D56]">
                              Average {d.avgWords} words per entry
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="reflections"
                    fill="#C49746"
                    radius={[6, 6, 0, 0]}
                    name="Reflections"
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Insight Annotation Footer */}
      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7DFD4] flex items-start gap-3 text-xs">
        <Sparkles className="w-4 h-4 text-[#B95B3D] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-[#211C15]">Spiritual Reflection Pattern:</span>
          <p className="text-[#594D3C] leading-relaxed">
            {avgWords >= 45
              ? `Your reflections show deep intentionality with an average of ${avgWords} words per entry. ${topCategory} continues to be your most explored season of growth.`
              : `You are sustaining consistent daily rhythm. Even brief 2-minute gratitude pauses significantly anchor emotional resilience throughout high-demand weeks.`}
          </p>
        </div>
      </div>
    </div>
  );
};
