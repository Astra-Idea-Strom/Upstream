import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import {
  Briefcase,
  Users,
  Target,
  Sparkles,
  Edit3,
  Check,
  Flame,
  Crown,
  Cpu,
  Minimize2,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import type { BrandTone } from '@upstream/shared';

const TONE_ICONS: Record<BrandTone, React.ReactNode> = {
  bold: <Flame className="w-3.5 h-3.5 text-orange-500" />,
  luxurious: <Crown className="w-3.5 h-3.5 text-amber-500" />,
  'tech-forward': <Cpu className="w-3.5 h-3.5 text-blue-500" />,
  minimalist: <Minimize2 className="w-3.5 h-3.5 text-emerald-500" />,
  playful: <Smile className="w-3.5 h-3.5 text-pink-500" />,
  professional: <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />,
};

export const IndustryConceptCard: React.FC = () => {
  const { input, setInput, openNameModal } = useBrandStore();
  const [isEditing, setIsEditing] = useState(false);
  const [industryVal, setIndustryVal] = useState(input.industry);
  const [missionVal, setMissionVal] = useState(input.mission);

  const handleSave = () => {
    setInput({ industry: industryVal, mission: missionVal });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-300/80 p-6 sm:p-7 shadow-sm shadow-emerald-500/5 relative overflow-hidden transition-all text-left animate-in fade-in duration-300">
      {/* Top Colorful Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-brand-500" />

      {/* Top Tag & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-slate-200/90 gap-2 pt-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider text-emerald-900">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>CARD 1: BRAND PARAMETERS</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            CONFIRMED
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-brand-600 transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Check className="w-3 h-3" />
              <span>Save Changes</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Edit Parameters"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={openNameModal}
            className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition-colors shadow-2xs"
          >
            Inspect 5 Names
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Target Industry & Niche
          </span>
          {isEditing ? (
            <input
              type="text"
              value={industryVal}
              onChange={(e) => setIndustryVal(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-brand-300 text-sm font-bold text-slate-900 focus:outline-none"
            />
          ) : (
            <h3 className="text-xl font-bold text-slate-950 font-display flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>{input.industry}</span>
            </h3>
          )}
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mission & Value Hook</span>
          </span>
          {isEditing ? (
            <textarea
              rows={2}
              value={missionVal}
              onChange={(e) => setMissionVal(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-brand-300 text-xs text-slate-800 focus:outline-none"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/90 font-normal">
              "{input.mission}"
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Target Audience
              </span>
              <span className="text-xs font-semibold text-slate-900 truncate block mt-0.5">
                {input.targetAudience}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800 flex-shrink-0">
              {TONE_ICONS[input.tone] || <Flame className="w-4 h-4 text-orange-500" />}
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Brand Personality
              </span>
              <span className="text-xs font-semibold text-slate-900 capitalize block mt-0.5">
                {input.tone} & Distinctive
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
