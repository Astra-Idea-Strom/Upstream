import React, { useState, useMemo } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { getMoodBoardForIndustry, type MoodBoardItem } from '../../../mock/moodBoardData';
import {
  Sparkles,
  RefreshCw,
  Search,
  Maximize2,
  X,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const BrandMoodBoardCard: React.FC = () => {
  const { selectedName, input } = useBrandStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLightbox, setActiveLightbox] = useState<MoodBoardItem | null>(null);

  const moodBoardData = useMemo(() => {
    return getMoodBoardForIndustry(input.industry || selectedName.name);
  }, [input.industry, selectedName.name]);

  const filteredItems = useMemo(() => {
    return moodBoardData.items.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [moodBoardData, activeCategory, searchQuery]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Mood Board & Design Inspiration
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Unsplash Curated
            </span>
          </div>
          <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
            {moodBoardData.aestheticName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {moodBoardData.tagline}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter inspiration..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 w-44 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 no-scrollbar text-xs">
        {['all', 'packaging', 'architecture', 'texture', 'lifestyle', 'typography'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Inspiration' : cat}
          </button>
        ))}
      </div>

      {/* Pinterest-Style Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveLightbox(item)}
            className="group relative break-inside-avoid rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-2xs hover:shadow-md transition-all duration-200"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />

            {/* Gradient Overlay with Details */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-end text-white">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                  style={{ backgroundColor: item.dominantHex }}
                />
                <span className="text-[10px] font-mono text-slate-300 uppercase">
                  {item.dominantHex}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 ml-auto">
                  {item.category}
                </span>
              </div>
              <h4 className="font-bold text-sm leading-tight text-white">{item.title}</h4>
              <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 font-normal">
                {item.description}
              </p>
              <span className="text-[10px] text-slate-400 mt-1 font-mono">
                Photo by {item.photographer}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          onClick={() => setActiveLightbox(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <img
              src={activeLightbox.imageUrl}
              alt={activeLightbox.title}
              className="w-full max-h-[60vh] object-cover"
            />

            <div className="p-5">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">
                  {activeLightbox.category}
                </span>
                <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeLightbox.dominantHex }}
                  />
                  <span className="text-[11px] font-mono font-bold text-slate-700">
                    {activeLightbox.dominantHex}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-950">{activeLightbox.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {activeLightbox.description}
              </p>
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-400">
                <span>Photographer: {activeLightbox.photographer} (Unsplash)</span>
                <a
                  href={activeLightbox.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1"
                >
                  <span>Open Full Resolution</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
