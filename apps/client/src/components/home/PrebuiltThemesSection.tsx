import React from 'react';
import { useBrandStore } from '../../store/brandStore';
import { PREBUILT_THEMES } from '../../mock/mockData';
import {
  ArrowUpRight,
  Sparkles,
  Shirt,
  Cpu,
  Flower2,
  Coffee,
  Gem,
  Check,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Shirt: <Shirt className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  Flower2: <Flower2 className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Gem: <Gem className="w-4 h-4" />,
};

export const PrebuiltThemesSection: React.FC = () => {
  const { selectedThemeId, selectTheme } = useBrandStore();

  return (
    <section className="px-4 sm:px-8 py-10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-8">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Starter kits
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Pick a curated industry to seed the brief. Every field stays editable.
          </p>
        </div>

        {/* Themed Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PREBUILT_THEMES.map((theme) => {
            const isSelected = selectedThemeId === theme.id;

            return (
              <div
                key={theme.id}
                onClick={() => selectTheme(theme.id)}
                className={`group relative rounded-4xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'border-brand-500 ring-4 ring-brand-500/20 shadow-xl bg-white'
                    : 'border-white/80 hover:border-brand-300 bg-white/70 hover:bg-white/95 shadow-glass hover:shadow-glass-hover'
                }`}
              >
                {/* Image Banner Container */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={theme.image}
                    alt={theme.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="glass-pill rounded-full px-3 py-1 text-[11px] font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                      {iconMap[theme.iconName] || <Sparkles className="w-3 h-3" />}
                      <span>{theme.category}</span>
                    </span>

                    {isSelected && (
                      <span className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  {/* Bottom Text Inside Banner */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h4 className="font-display font-bold text-lg text-white leading-snug drop-shadow-sm">
                      {theme.title}
                    </h4>
                    <p className="text-xs text-slate-200 line-clamp-1 opacity-90">
                      {theme.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Body & Prompt Presets */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {theme.description}
                  </p>

                  {/* Keywords Pill List */}
                  <div className="flex flex-wrap gap-1.5">
                    {theme.sampleKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-brand-50 text-[10px] font-medium text-brand-700 border border-brand-100"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">
                      Tone: <strong className="text-slate-900 capitalize">{theme.defaultInput.tone}</strong>
                    </span>

                    <button
                      type="button"
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-brand-600 group-hover:text-white'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
