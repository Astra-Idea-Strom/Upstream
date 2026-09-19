import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import {
  Briefcase,
  Users,
  Target,
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
  bold: <Flame className="w-3.5 h-3.5 text-slate-700" />,
  luxurious: <Crown className="w-3.5 h-3.5 text-slate-700" />,
  'tech-forward': <Cpu className="w-3.5 h-3.5 text-slate-700" />,
  minimalist: <Minimize2 className="w-3.5 h-3.5 text-slate-700" />,
  playful: <Smile className="w-3.5 h-3.5 text-slate-700" />,
  professional: <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />,
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
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Brand Core & Strategy
          </span>
          <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
            {input.industry}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 rounded-lg bg-slate-950 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Edit Strategy"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={openNameModal}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
          >
            Change Name
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Mission & Purpose
          </span>
          {isEditing ? (
            <textarea
              rows={2}
              value={missionVal}
              onChange={(e) => setMissionVal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-slate-500 leading-relaxed"
            />
          ) : (
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              "{input.mission}"
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <div className="truncate">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Target Audience
              </span>
              <span className="text-xs font-semibold text-slate-900 truncate block mt-0.5">
                {input.targetAudience}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="p-1 rounded bg-white border border-slate-200 shadow-2xs">
              {TONE_ICONS[input.tone] || <Flame className="w-3.5 h-3.5 text-slate-700" />}
            </div>
            <div className="truncate">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Personality Tone
              </span>
              <span className="text-xs font-semibold text-slate-900 capitalize block mt-0.5">
                {input.tone}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
