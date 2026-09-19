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
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs relative overflow-hidden transition-all hover:border-brand-300 animate-in fade-in duration-300">
      {/* Top Tag & Actions */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200/70 text-[10px] font-bold text-brand-800">
            <Sparkles className="w-3 h-3 text-coral-500" />
            <span>CARD 1: BRAND PARAMETERS</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            CONFIRMED
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-brand-600 transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Check className="w-3 h-3" />
              <span>Save</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Edit Parameters"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={openNameModal}
            className="px-3 py-1 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold transition-colors shadow-2xs"
          >
            Inspect 5 Names
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-3.5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Industry & Niche
          </span>
          {isEditing ? (
            <input
              type="text"
              value={industryVal}
              onChange={(e) => setIndustryVal(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-brand-300 text-sm font-bold text-slate-900 focus:outline-none"
            />
          ) : (
            <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-600" />
              <span>{input.industry}</span>
            </h3>
          )}
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
            <Target className="w-3 h-3 text-brand-600" />
            <span>Mission & Purpose</span>
          </span>
          {isEditing ? (
            <textarea
              rows={2}
              value={missionVal}
              onChange={(e) => setMissionVal(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-brand-300 text-xs text-slate-800 focus:outline-none"
            />
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
              "{input.mission}"
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <Users className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <div className="truncate">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                Target Audience
              </span>
              <span className="text-[11px] font-semibold text-slate-700 truncate block">
                {input.targetAudience}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <div className="p-1 rounded-lg bg-white border border-slate-200/60 shadow-2xs">
              {TONE_ICONS[input.tone] || <Flame className="w-3.5 h-3.5 text-orange-500" />}
            </div>
            <div className="truncate">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                Brand Personality
              </span>
              <span className="text-[11px] font-semibold text-slate-700 capitalize block">
                {input.tone} & Distinctive
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
