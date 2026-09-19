import React, { useEffect, useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { LogoArtwork } from '../../brand/LogoArtwork';
import { getPalette } from '../../../lib/palettes';
import { getCanvasSurface } from '../../../lib/canvasSurfaces';
import { cn } from '../../../lib/cn';
import { Check, CreditCard, Package, Pencil, Smartphone } from 'lucide-react';

type Touchpoint = 'lockup' | 'card' | 'packaging' | 'app';

const TOUCHPOINTS: { id: Touchpoint; label: string; icon?: React.ReactNode }[] = [
  { id: 'lockup', label: 'Lockup' },
  { id: 'card', label: 'Business Card', icon: <CreditCard className="h-3.5 w-3.5" /> },
  { id: 'packaging', label: 'Packaging', icon: <Package className="h-3.5 w-3.5" /> },
  { id: 'app', label: 'App Icon', icon: <Smartphone className="h-3.5 w-3.5" /> },
];

/**
 * The lockup editor.
 *
 * The canvas is a single lockup: a monochrome mark, the wordmark, and the
 * tagline — every part driven by the same ink so the toolbar's colour control
 * reads across all three.
 *
 * The mark used to render with its own wordmark *and* sit above a separate
 * editable wordmark, so the name appeared twice and the second copy was the one
 * the user was meant to edit. The mark is now glyph-only.
 */
export const CanvaInteractiveArtboard: React.FC = () => {
  const {
    selectedName,
    selectedLogoStyle,
    activePaletteIdx,
    canvaHeadlineFont,
    canvaWordmarkSize,
    canvaTaglineSize,
    canvaFontWeight,
    canvaLetterSpacing,
    canvaTextColor,
    canvaBgMode,
    logoImageByStyle,
    selectedLogo,
    updateBrandNameText,
    updateTaglineText,
    setCanvaSelectedElement,
  } = useBrandStore();

  const [activeTab, setActiveTab] = useState<Touchpoint>('lockup');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingTagline, setIsEditingTagline] = useState(false);
  const [nameVal, setNameVal] = useState(selectedName.name);
  const [taglineVal, setTaglineVal] = useState(selectedName.tagline);

  const palette = getPalette(activePaletteIdx);
  const surface = getCanvasSurface(canvaBgMode);

  /**
   * The generated mark for the active style, if the agent has produced one.
   *
   * Falls back to whatever single mark exists so the canvas shows the artwork
   * the moment it arrives, even before a per-style set exists.
   */
  const generatedMark = logoImageByStyle[selectedLogoStyle] || selectedLogo?.url;

  /**
   * Keep the edit buffers in step with the brand. They were seeded once from
   * `useState`, so anything that changed the name elsewhere left a stale value
   * waiting in the input.
   */
  useEffect(() => setNameVal(selectedName.name), [selectedName.name]);
  useEffect(() => setTaglineVal(selectedName.tagline), [selectedName.tagline]);

  const handleSaveName = () => {
    if (nameVal.trim()) updateBrandNameText(nameVal.trim());
    setIsEditingName(false);
  };

  const handleSaveTagline = () => {
    if (taglineVal.trim()) updateTaglineText(taglineVal.trim());
    setIsEditingTagline(false);
  };

  // Packaging borrows the palette's background and text roles rather than a
  // hard-coded kraft brown, which used to show on every brand regardless of
  // industry.
  const packagingBox = palette.swatches[3]?.hex ?? '#FDFBF7';
  const packagingInk = palette.swatches[4]?.hex ?? '#1C1917';
  const packagingPrimary = palette.swatches[0]?.hex ?? '#7C3AED';

  /** The hover-revealed edit affordance, now always discoverable. */
  const EditAffordance: React.FC<{ onClick: () => void; label: string }> = ({
    onClick,
    label,
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex-shrink-0 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45"
    >
      <Pencil className="h-3 w-3" />
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Artboard header with touchpoint tabs */}
      <div className="flex flex-col justify-between gap-3 px-1 sm:flex-row sm:items-center">
        <span className="font-display text-xs font-bold text-slate-900">Lockup editor</span>

        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          {TOUCHPOINTS.map((touchpoint) => (
            <button
              key={touchpoint.id}
              type="button"
              onClick={() => setActiveTab(touchpoint.id)}
              aria-pressed={activeTab === touchpoint.id}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/45',
                activeTab === touchpoint.id
                  ? 'bg-white font-bold text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              {touchpoint.icon && (
                <span className="text-slate-400">{touchpoint.icon}</span>
              )}
              <span>{touchpoint.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Surface */}
      <div
        className={cn(
          'relative flex min-h-[360px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border-2 p-8 shadow-sm transition-colors duration-300 sm:min-h-[400px] sm:p-12',
          surface.classes,
        )}
      >
        {activeTab === 'lockup' && (
          <div
            className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 text-center"
            style={{ color: canvaTextColor }}
          >
            {/* Mark — generated artwork when the agent has made one, else the
                procedural glyph. The wordmark below *is* the name. */}
            <LogoArtwork
              brand={selectedName}
              style={selectedLogoStyle}
              variant="none"
              size="lg"
              showName={false}
              imageUrl={generatedMark}
            />

            {/* Editable wordmark */}
            <div
              onClick={() => setCanvaSelectedElement('wordmark')}
              className="group relative cursor-pointer"
            >
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameVal}
                    onChange={(event) => setNameVal(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleSaveName();
                      if (event.key === 'Escape') setIsEditingName(false);
                    }}
                    onBlur={handleSaveName}
                    autoFocus
                    className="border-b-2 border-brand-500 bg-transparent text-center font-display font-black tracking-tight focus:outline-none"
                    style={{
                      fontFamily: canvaHeadlineFont,
                      fontSize: `${canvaWordmarkSize}px`,
                      color: canvaTextColor,
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    title="Save name"
                    aria-label="Save name"
                    className="rounded-lg bg-brand-600 p-1.5 text-white hover:bg-brand-700"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <h2
                    onDoubleClick={() => setIsEditingName(true)}
                    style={{
                      fontFamily: canvaHeadlineFont,
                      fontSize: `${canvaWordmarkSize}px`,
                      fontWeight: canvaFontWeight,
                      letterSpacing: `${canvaLetterSpacing}px`,
                      color: canvaTextColor,
                    }}
                    className="select-none leading-none tracking-tight transition-all"
                  >
                    {selectedName.name}
                  </h2>
                  <EditAffordance onClick={() => setIsEditingName(true)} label="Edit name" />
                </div>
              )}
            </div>

            {/* Editable tagline — the lockup's serif face, so it carries its
                own weight rather than following the wordmark's. */}
            <div
              onClick={() => setCanvaSelectedElement('tagline')}
              className="group relative cursor-pointer"
            >
              {isEditingTagline ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={taglineVal}
                    onChange={(event) => setTaglineVal(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleSaveTagline();
                      if (event.key === 'Escape') setIsEditingTagline(false);
                    }}
                    onBlur={handleSaveTagline}
                    autoFocus
                    className="border-b border-brand-500 bg-transparent text-center font-serif italic focus:outline-none"
                    style={{ fontSize: `${canvaTaglineSize}px`, color: canvaTextColor }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveTagline}
                    title="Save tagline"
                    aria-label="Save tagline"
                    className="rounded-lg bg-brand-600 p-1 text-white hover:bg-brand-700"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <p
                    onDoubleClick={() => setIsEditingTagline(true)}
                    style={{
                      fontSize: `${canvaTaglineSize}px`,
                      color: canvaTextColor,
                      opacity: 0.78,
                      letterSpacing: `${Math.max(0, canvaLetterSpacing - 1)}px`,
                    }}
                    className="select-none font-serif italic leading-tight transition-all"
                  >
                    &ldquo;{selectedName.tagline}&rdquo;
                  </p>
                  <EditAffordance
                    onClick={() => setIsEditingTagline(true)}
                    label="Edit tagline"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'card' && (
          <div className="relative flex h-56 w-full max-w-md flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 text-slate-900 shadow-lg">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white"
              style={{ backgroundColor: palette.swatches[0]?.hex ?? '#0F172A' }}
            >
              {selectedName.name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <h3
                style={{ fontFamily: canvaHeadlineFont }}
                className="text-2xl font-black tracking-tight text-slate-950"
              >
                {selectedName.name}
              </h3>
              <p
                className="mt-0.5 font-serif text-xs italic"
                style={{ color: palette.swatches[0]?.hex ?? '#7C3AED' }}
              >
                &ldquo;{selectedName.tagline}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-2 font-mono text-[10px] text-slate-500">
              <span>contact@{selectedName.name.toLowerCase()}.com</span>
              <span>www.{selectedName.name.toLowerCase()}.com</span>
            </div>
          </div>
        )}

        {activeTab === 'packaging' && (
          <div
            className="flex h-80 w-64 flex-col items-center justify-center gap-3 rounded-3xl border-2 p-6 text-center shadow-xl"
            style={{
              backgroundColor: packagingBox,
              borderColor: `${packagingPrimary}55`,
              color: packagingInk,
            }}
          >
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold"
              style={{ backgroundColor: packagingPrimary, color: packagingBox }}
            >
              {selectedName.name.charAt(0)}
            </div>
            <h4
              style={{ fontFamily: canvaHeadlineFont }}
              className="text-2xl font-black tracking-tight"
            >
              {selectedName.name}
            </h4>
            <p className="font-serif text-xs italic opacity-80">
              &ldquo;{selectedName.tagline}&rdquo;
            </p>
          </div>
        )}

        {activeTab === 'app' && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-32 w-32 transform flex-col items-center justify-center rounded-[28px] bg-gradient-to-br from-brand-600 to-coral-500 text-white shadow-xl shadow-brand-500/20 transition-transform hover:scale-105">
              <span className="font-display text-4xl font-black tracking-tighter">
                {selectedName.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span
              style={{ fontFamily: canvaHeadlineFont, color: canvaTextColor }}
              className="text-base font-bold"
            >
              {selectedName.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
