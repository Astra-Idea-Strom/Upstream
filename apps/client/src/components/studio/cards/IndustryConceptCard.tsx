import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { CardShell } from '../CardShell';
import { Button, IconButton } from '../../ui/primitives';
import type { BrandTone } from '@upstream/shared';
import {
  Check,
  Cpu,
  Crown,
  Edit3,
  Flame,
  Minimize2,
  ShieldCheck,
  Smile,
} from 'lucide-react';

const TONE_ICONS: Record<BrandTone, React.ReactNode> = {
  bold: <Flame className="h-3.5 w-3.5 text-orange-500" />,
  luxurious: <Crown className="h-3.5 w-3.5 text-amber-500" />,
  'tech-forward': <Cpu className="h-3.5 w-3.5 text-blue-500" />,
  minimalist: <Minimize2 className="h-3.5 w-3.5 text-emerald-500" />,
  playful: <Smile className="h-3.5 w-3.5 text-pink-500" />,
  professional: <ShieldCheck className="h-3.5 w-3.5 text-brand-500" />,
};

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 ' +
  'transition-colors focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10';

/**
 * Step 1 artefact — the confirmed brief the rest of the flow is generated from.
 */
export const IndustryConceptCard: React.FC = () => {
  const { input, setInput, openNameModal } = useBrandStore();
  const [isEditing, setIsEditing] = useState(false);
  const [industryVal, setIndustryVal] = useState(input.industry);
  const [missionVal, setMissionVal] = useState(input.mission);

  const handleSave = () => {
    setInput({ industry: industryVal, mission: missionVal });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIndustryVal(input.industry);
    setMissionVal(input.mission);
    setIsEditing(false);
  };

  return (
    <CardShell
      id="step-card-brief"
      step={1}
      variant="confirmed"
      status={{ label: 'Confirmed', tone: 'success', dot: true }}
      actions={
        <>
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Check className="h-3.5 w-3.5" />}
                onClick={handleSave}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <IconButton label="Edit brief" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-3.5 w-3.5" />
              </IconButton>
              <Button variant="outline" size="sm" onClick={openNameModal}>
                Inspect names
              </Button>
            </>
          )}
        </>
      }
    >
      <dl className="space-y-4">
        <div>
          <dt className="text-2xs font-bold uppercase tracking-wider text-slate-400">
            Industry & niche
          </dt>
          <dd className="mt-1">
            {isEditing ? (
              <input
                type="text"
                value={industryVal}
                onChange={(event) => setIndustryVal(event.target.value)}
                className={FIELD_CLASS}
                aria-label="Industry and niche"
              />
            ) : (
              <span className="font-display text-base font-bold text-slate-900">
                {input.industry}
              </span>
            )}
          </dd>
        </div>

        <div>
          <dt className="text-2xs font-bold uppercase tracking-wider text-slate-400">
            Mission & purpose
          </dt>
          <dd className="mt-1">
            {isEditing ? (
              <textarea
                rows={3}
                value={missionVal}
                onChange={(event) => setMissionVal(event.target.value)}
                className={`${FIELD_CLASS} resize-none leading-relaxed`}
                aria-label="Mission and purpose"
              />
            ) : (
              <p className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs leading-relaxed text-slate-600">
                {input.mission}
              </p>
            )}
          </dd>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <dt className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              Target audience
            </dt>
            <dd className="mt-1 text-xs font-medium leading-snug text-slate-700">
              {input.targetAudience}
            </dd>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <dt className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              Brand personality
            </dt>
            <dd className="mt-1 flex items-center gap-1.5 text-xs font-medium capitalize text-slate-700">
              {TONE_ICONS[input.tone] ?? TONE_ICONS.bold}
              {input.tone}
            </dd>
          </div>
        </div>
      </dl>
    </CardShell>
  );
};
