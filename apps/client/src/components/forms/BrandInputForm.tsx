import React, { useState } from 'react';
import { useBrandStore } from '../../store/brandStore';
import { BrandTone } from '@upstream/shared';
import {
  Wand2,
  Sparkles,
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
  Check,
} from 'lucide-react';

interface ToneOption {
  id: BrandTone;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

const TONE_OPTIONS: ToneOption[] = [
  { id: 'bold', label: 'Bold & High Impact', desc: 'Punchy, energetic, urban', icon: <Flame className="w-3.5 h-3.5 text-orange-500" /> },
  { id: 'luxurious', label: 'Luxurious & Chic', desc: 'Haute couture, refined, bespoke', icon: <Crown className="w-3.5 h-3.5 text-amber-500" /> },
  { id: 'tech-forward', label: 'Tech-Forward', desc: 'Future-ready, crisp, algorithmic', icon: <Cpu className="w-3.5 h-3.5 text-blue-500" /> },
  { id: 'minimalist', label: 'Minimalist', desc: 'Clean, calm, zen simplicity', icon: <Minimize2 className="w-3.5 h-3.5 text-emerald-500" /> },
  { id: 'playful', label: 'Playful & Friendly', desc: 'Approachable, warm, charismatic', icon: <Smile className="w-3.5 h-3.5 text-pink-500" /> },
  { id: 'professional', label: 'Professional', desc: 'Trustworthy, executive, stable', icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-500" /> },
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
    if (!input.mission.trim()) errs.mission = 'Brand mission is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoadingNames(true);
    setStep(2);

    setTimeout(() => {
      regenerateNames();
      setLoadingNames(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200/70 text-[10px] font-bold text-brand-800 mb-1">
            <Sparkles className="w-3 h-3 text-coral-500" />
            <span>STEP 1: BRAND PARAMETERS</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Describe Your Business Vision
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure parameters below. Our AI synthesizes phonetic appeal, domain checks, and color harmonies.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-brand-600 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs"
        >
          <span>Generate 5 Names</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Optional Brand Name & Industry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Existing Brand Name (Optional)
            </label>
            <input
              type="text"
              value={input.businessName || ''}
              onChange={(e) => setInput({ businessName: e.target.value })}
              placeholder="e.g. Apex, Solis, or leave blank"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-brand-600" />
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
              placeholder="e.g. Streetwear & Sneaker Apparel, Luxury Perfume"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:bg-white transition-all ${
                errors.industry ? 'border-red-400' : 'border-slate-200 focus:border-brand-500'
              }`}
            />
            {errors.industry && (
              <p className="text-[10px] text-red-500 mt-1">{errors.industry}</p>
            )}
          </div>
        </div>

        {/* Row 2: Target Audience */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Users className="w-3 h-3 text-brand-600" />
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
            placeholder="e.g. Gen Z and urban creators aged 18–32 in major cities"
            className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:bg-white transition-all ${
              errors.targetAudience ? 'border-red-400' : 'border-slate-200 focus:border-brand-500'
            }`}
          />
          {errors.targetAudience && (
            <p className="text-[10px] text-red-500 mt-1">{errors.targetAudience}</p>
          )}
        </div>

        {/* Row 3: Mission & Key Value Proposition */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3 text-brand-600" />
              <span>Mission, Purpose & What Your Work Is For</span>
              <span className="text-coral-500">*</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {input.mission.length}/300
            </span>
          </label>
          <textarea
            rows={2}
            maxLength={300}
            value={input.mission}
            onChange={(e) => {
              setInput({ mission: e.target.value });
              if (errors.mission) setErrors({ ...errors, mission: '' });
            }}
            placeholder="Describe what problem you solve and what makes your offering unique..."
            className={`w-full p-3 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:bg-white transition-all ${
              errors.mission ? 'border-red-400' : 'border-slate-200 focus:border-brand-500'
            }`}
          />
          {errors.mission && (
            <p className="text-[10px] text-red-500 mt-1">{errors.mission}</p>
          )}
        </div>

        {/* Row 4: Brand Personality & Tone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Brand Personality & Tone
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {TONE_OPTIONS.map((tone) => {
              const isSelected = input.tone === tone.id;
              return (
                <button
                  type="button"
                  key={tone.id}
                  onClick={() => setInput({ tone: tone.id })}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-600/20 shadow-2xs'
                      : 'border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="p-1 rounded-lg bg-white shadow-2xs border border-slate-100">
                      {tone.icon}
                    </div>
                    {isSelected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[9px]">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block leading-tight">
                      {tone.label}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                      {tone.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 5: Specific Constraints */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Specific Constraints & Naming Guidelines
          </label>
          <input
            type="text"
            value={input.constraints}
            onChange={(e) => setInput({ constraints: e.target.value })}
            placeholder="e.g. Max 9 letters, modern, punchy, avoid cheesy puns"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
          />

          <div className="flex flex-wrap gap-1.5 mt-2">
            {[
              'Under 8 letters',
              'Invented word',
              'Sounds tech-forward',
              'European luxury feel',
              '.com friendly',
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
                className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] text-slate-600 hover:text-brand-700 hover:border-brand-300 transition-colors shadow-2xs"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Form Bottom Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-coral-500" />
            <span>Generates 5 brand names, taglines, color palettes & vector logos</span>
          </span>

          <button
            type="submit"
            disabled={isLoadingNames}
            className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-brand-600 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Generate 5 Names</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
