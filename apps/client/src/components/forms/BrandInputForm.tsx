import React, { useState } from 'react';
import { useBrandStore } from '../../store/brandStore';
import { BrandTone } from '@upstream/shared';
import {
  Wand2,
  Sparkles,
  HelpCircle,
  Briefcase,
  Users,
  Target,
  Smile,
  ShieldCheck,
  Minimize2,
  Flame,
  Cpu,
  Crown,
  ChevronRight,
  RotateCcw,
  Check,
} from 'lucide-react';

interface ToneOption {
  id: BrandTone;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

const TONE_OPTIONS: ToneOption[] = [
  { id: 'bold', label: 'Bold & High Impact', desc: 'Punchy, rebellious, energetic', icon: <Flame className="w-4 h-4 text-orange-500" /> },
  { id: 'luxurious', label: 'Luxurious & Chic', desc: 'Haute couture, refined, bespoke', icon: <Crown className="w-4 h-4 text-amber-500" /> },
  { id: 'tech-forward', label: 'Tech-Forward', desc: 'Future-ready, algorithmic, crisp', icon: <Cpu className="w-4 h-4 text-blue-500" /> },
  { id: 'minimalist', label: 'Minimalist', desc: 'Clean, calm, zen simplicity', icon: <Minimize2 className="w-4 h-4 text-emerald-500" /> },
  { id: 'playful', label: 'Playful & Friendly', desc: 'Approachable, warm, charismatic', icon: <Smile className="w-4 h-4 text-pink-500" /> },
  { id: 'professional', label: 'Professional', desc: 'Trustworthy, executive, stable', icon: <ShieldCheck className="w-4 h-4 text-purple-500" /> },
];

export const BrandInputForm: React.FC = () => {
  const {
    input,
    setInput,
    setStep,
    setLoadingNames,
    regenerateNames,
    isLoadingNames,
  } = useBrandStore();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!input.industry.trim()) errs.industry = 'Industry / niche is required';
    if (!input.targetAudience.trim()) errs.targetAudience = 'Target audience is required';
    if (!input.mission.trim()) errs.mission = 'Brand mission / description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoadingNames(true);
    setStep(2);

    // Simulate AI synthesis
    setTimeout(() => {
      regenerateNames();
      setLoadingNames(false);
    }, 1200);
  };

  return (
    <div id="brand-input-form" className="px-4 sm:px-8 py-10 relative">
      <div className="max-w-4xl mx-auto">
        {/* Form Container Card */}
        <div className="glass-panel rounded-5xl p-6 sm:p-10 shadow-glass border border-white/90 relative overflow-hidden">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/90 text-brand-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              <span>STEP 1 OF 4: BRAND PARAMETERS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Describe Your Vision & Target Market
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Provide context regarding your venture. Our AI synthesizes phonetic appeal, market semantics,
              domain availability, and visual palette harmonies based on your input.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Optional Brand Name & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Existing Brand Name (Optional)</span>
                  <span className="text-[10px] text-slate-400 lowercase font-normal">if already brainstormed</span>
                </label>
                <input
                  type="text"
                  value={input.businessName || ''}
                  onChange={(e) => setInput({ businessName: e.target.value })}
                  placeholder="e.g. Apex, Solis, or leave blank"
                  className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-slate-200/90 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-brand-600" />
                  <span>Industry & Niche</span>
                  <span className="text-coral-500">*</span>
                </label>
                <input
                  type="text"
                  value={input.industry}
                  onChange={(e) => {
                    setInput({ industry: e.target.value });
                    if (errors.industry) setErrors({ ...errors, industry: '' });
                  }}
                  placeholder="e.g. Streetwear & Sneakers, Luxury Fragrance, AI Cloud"
                  className={`w-full px-4 py-3 rounded-2xl bg-white/80 border text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm ${
                    errors.industry ? 'border-red-400' : 'border-slate-200/90 focus:border-brand-500'
                  }`}
                />
                {errors.industry && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.industry}</p>
                )}
              </div>
            </div>

            {/* Row 2: Target Audience */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-600" />
                <span>Target Audience & Customers</span>
                <span className="text-coral-500">*</span>
              </label>
              <input
                type="text"
                value={input.targetAudience}
                onChange={(e) => {
                  setInput({ targetAudience: e.target.value });
                  if (errors.targetAudience) setErrors({ ...errors, targetAudience: '' });
                }}
                placeholder="e.g. Eco-conscious Gen Z sneakerheads aged 18-30 in urban centers"
                className={`w-full px-4 py-3 rounded-2xl bg-white/80 border text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm ${
                  errors.targetAudience ? 'border-red-400' : 'border-slate-200/90 focus:border-brand-500'
                }`}
              />
              {errors.targetAudience && (
                <p className="text-[11px] text-red-500 mt-1">{errors.targetAudience}</p>
              )}
            </div>

            {/* Row 3: Mission & Key Value Proposition */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-brand-600" />
                  <span>Mission, Purpose & What Your Work Is For</span>
                  <span className="text-coral-500">*</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {input.mission.length}/300
                </span>
              </label>
              <textarea
                rows={3}
                maxLength={300}
                value={input.mission}
                onChange={(e) => {
                  setInput({ mission: e.target.value });
                  if (errors.mission) setErrors({ ...errors, mission: '' });
                }}
                placeholder="Describe what problem you solve, what makes your products unique, and the feeling you want to evoke..."
                className={`w-full p-4 rounded-2xl bg-white/80 border text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-sm ${
                  errors.mission ? 'border-red-400' : 'border-slate-200/90 focus:border-brand-500'
                }`}
              />
              {errors.mission && (
                <p className="text-[11px] text-red-500 mt-1">{errors.mission}</p>
              )}
            </div>

            {/* Row 4: Brand Tone Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Brand Personality & Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TONE_OPTIONS.map((tone) => {
                  const isSelected = input.tone === tone.id;
                  return (
                    <button
                      type="button"
                      key={tone.id}
                      onClick={() => setInput({ tone: tone.id })}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/90 ring-2 ring-brand-600/30 shadow-sm'
                          : 'border-slate-200/80 bg-white/70 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-1.5 rounded-xl bg-white shadow-xs border border-slate-100">
                          {tone.icon}
                        </div>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">
                          {tone.label}
                        </span>
                        <span className="text-[10px] text-slate-500 block line-clamp-1 mt-0.5">
                          {tone.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 5: Specific Constraints & Requirements */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Specific Constraints & Naming Guidelines</span>
                <span className="text-[10px] text-slate-400">e.g. short, invented word, .com friendly</span>
              </label>
              <input
                type="text"
                value={input.constraints}
                onChange={(e) => setInput({ constraints: e.target.value })}
                placeholder="e.g. Max 9 letters, modern, punchy, avoid cheesy puns"
                className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-slate-200/90 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
              />

              {/* Quick Constraints Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  'Under 8 letters',
                  'Invented word',
                  'Sounds tech-forward',
                  'European luxury feel',
                  'High .com availability',
                  'Easy pronunciation',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      const current = input.constraints;
                      if (!current.includes(chip)) {
                        setInput({ constraints: current ? `${current}, ${chip}` : chip });
                      }
                    }}
                    className="px-2.5 py-1 rounded-full bg-white border border-brand-100 text-[10px] text-slate-600 hover:text-brand-700 hover:border-brand-300 transition-colors shadow-2xs"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-coral-500" />
                <span>Generates 12 brand names, taglines, color palettes & logo concepts</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isLoadingNames}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-600 via-brand-500 to-coral-500 text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 group transition-all"
                >
                  <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Generate Brand Identities</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
