import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { CardShell } from '../CardShell';
import { Button, IconButton } from '../../ui/primitives';
import { Check, Edit3 } from 'lucide-react';

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 ' +
  'transition-colors focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10';

/**
 * Step 1 artefact — the confirmed brief the rest of the flow is generated from.
 *
 * The industry is the card's headline and the mission reads as plain prose; the
 * audience and tone sit in one quiet meta row. No field is wrapped in its own
 * bordered box with an uppercase label, because the value already says what it
 * is.
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
                Names
              </Button>
            </>
          )}
        </>
      }
    >
      <div className="space-y-4">
        {isEditing ? (
          <input
            type="text"
            value={industryVal}
            onChange={(event) => setIndustryVal(event.target.value)}
            className={`${FIELD_CLASS} font-display text-base font-bold`}
            aria-label="Industry and niche"
          />
        ) : (
          <h3 className="font-display text-xl font-black tracking-tight text-slate-950">
            {input.industry}
          </h3>
        )}

        {isEditing ? (
          <textarea
            rows={3}
            value={missionVal}
            onChange={(event) => setMissionVal(event.target.value)}
            className={`${FIELD_CLASS} resize-none leading-relaxed`}
            aria-label="Mission and purpose"
          />
        ) : (
          <p className="text-sm leading-relaxed text-slate-600">{input.mission}</p>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-2xs">
          <span className="flex items-baseline gap-1.5">
            <span className="text-slate-400">Audience</span>
            <span className="font-medium text-slate-700">{input.targetAudience}</span>
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-slate-400">Tone</span>
            <span className="font-medium capitalize text-slate-700">{input.tone}</span>
          </span>
        </div>
      </div>
    </CardShell>
  );
};
