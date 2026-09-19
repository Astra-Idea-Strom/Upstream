import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { LogoArtwork } from '../../brand/LogoArtwork';
import {
  Check,
  CreditCard,
  Package,
  Smartphone,
  Edit3,
} from 'lucide-react';

export const CanvaInteractiveArtboard: React.FC = () => {
  const {
    selectedName,
    selectedLogoStyle,
    canvaHeadlineFont,
    canvaWordmarkSize,
    canvaTaglineSize,
    canvaFontWeight,
    canvaLetterSpacing,
    canvaTextColor,
    canvaBgMode,
    updateBrandNameText,
    updateTaglineText,
    setCanvaSelectedElement,
  } = useBrandStore();

  const [activeTab, setActiveTab] = useState<'lockup' | 'card' | 'packaging' | 'app'>('lockup');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingTagline, setIsEditingTagline] = useState(false);
  const [nameVal, setNameVal] = useState(selectedName.name);
  const [taglineVal, setTaglineVal] = useState(selectedName.tagline);

  const handleSaveName = () => {
    if (nameVal.trim()) {
      updateBrandNameText(nameVal.trim());
    }
    setIsEditingName(false);
  };

  const handleSaveTagline = () => {
    if (taglineVal.trim()) {
      updateTaglineText(taglineVal.trim());
    }
    setIsEditingTagline(false);
  };

  const bgStyles = {
    light: 'bg-white border-slate-200/90 text-slate-900',
    linen: 'bg-[#FDFBF7] border-amber-200/80 text-amber-950',
    dark: 'bg-slate-950 border-slate-800 text-white',
    brand: 'bg-gradient-to-br from-brand-600 via-brand-700 to-coral-500 border-transparent text-white',
  }[canvaBgMode] || 'bg-white border-slate-200 text-slate-900';

  const isDarkCanvas = canvaBgMode === 'dark' || canvaBgMode === 'brand';
  const effectiveTextColor = isDarkCanvas ? '#FFFFFF' : canvaTextColor;

  return (
    <div className="space-y-4">
      {/* Artboard header with touchpoint tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <span className="font-display text-xs font-bold text-slate-900">Lockup editor</span>

        {/* Touchpoint Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('lockup')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'lockup'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Lockup</span>
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'card'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            <span>Business Card</span>
          </button>
          <button
            onClick={() => setActiveTab('packaging')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'packaging'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-slate-400" />
            <span>Packaging</span>
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'app'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            <span>App Icon</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Surface */}
      <div
        className={`w-full min-h-[360px] sm:min-h-[400px] rounded-3xl border-2 p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 shadow-sm ${bgStyles}`}
      >
        {activeTab === 'lockup' && (
          <div className="flex flex-col items-center justify-center text-center space-y-5 max-w-xl mx-auto">
            {/* Logo Mark */}
            <div className="transform hover:scale-105 transition-transform duration-200">
              <LogoArtwork
                brand={selectedName}
                style={selectedLogoStyle}
                variant={isDarkCanvas ? 'dark' : 'light'}
                size="md"
              />
            </div>

            {/* Editable Brand Wordmark */}
            <div
              onClick={() => setCanvaSelectedElement('wordmark')}
              className="relative group cursor-pointer"
            >
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameVal}
                    onChange={(e) => setNameVal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    autoFocus
                    className="text-center font-display font-black bg-transparent border-b-2 border-brand-500 focus:outline-none tracking-tight"
                    style={{
                      fontFamily: canvaHeadlineFont,
                      fontSize: `${canvaWordmarkSize}px`,
                      color: effectiveTextColor,
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDoubleClick={() => setIsEditingName(true)}
                  className="flex items-center justify-center gap-2"
                >
                  <h2
                    style={{
                      fontFamily: canvaHeadlineFont,
                      fontSize: `${canvaWordmarkSize}px`,
                      fontWeight: canvaFontWeight,
                      letterSpacing: `${canvaLetterSpacing}px`,
                      color: effectiveTextColor,
                    }}
                    className="tracking-tight leading-none select-none transition-all"
                  >
                    {selectedName.name}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-black/10 hover:bg-black/20 text-current transition-opacity text-xs"
                    title="Edit Name"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Editable Tagline */}
            <div
              onClick={() => setCanvaSelectedElement('tagline')}
              className="relative group cursor-pointer"
            >
              {isEditingTagline ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={taglineVal}
                    onChange={(e) => setTaglineVal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTagline()}
                    autoFocus
                    className="text-center italic font-serif bg-transparent border-b border-brand-500 focus:outline-none"
                    style={{
                      fontSize: `${canvaTaglineSize}px`,
                      color: effectiveTextColor,
                    }}
                  />
                  <button
                    onClick={handleSaveTagline}
                    className="p-1 rounded-lg bg-brand-600 text-white"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  onDoubleClick={() => setIsEditingTagline(true)}
                  className="flex items-center justify-center gap-2"
                >
                  <p
                    style={{
                      fontSize: `${canvaTaglineSize}px`,
                      color: isDarkCanvas ? 'rgba(255,255,255,0.8)' : effectiveTextColor,
                      letterSpacing: `${Math.max(0, canvaLetterSpacing - 1)}px`,
                    }}
                    className="italic font-serif leading-tight select-none transition-all"
                  >
                    "{selectedName.tagline}"
                  </p>
                  <button
                    onClick={() => setIsEditingTagline(true)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-black/10 hover:bg-black/20 text-current transition-opacity text-xs"
                    title="Edit Tagline"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'card' && (
          <div className="w-full max-w-md h-56 rounded-2xl bg-white text-slate-900 border border-slate-200/90 p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold">
              {selectedName.name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <h3
                style={{ fontFamily: canvaHeadlineFont }}
                className="text-2xl font-black tracking-tight text-slate-950"
              >
                {selectedName.name}
              </h3>
              <p className="text-xs text-brand-700 italic font-serif mt-0.5">
                "{selectedName.tagline}"
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-100">
              <span>contact@{selectedName.name.toLowerCase()}.com</span>
              <span>www.{selectedName.name.toLowerCase()}.com</span>
            </div>
          </div>
        )}

        {activeTab === 'packaging' && (
          <div className="w-64 h-80 rounded-3xl bg-[#EBE5D8] border-2 border-[#D6CDBC] p-6 flex flex-col items-center justify-center gap-3 text-center text-[#3D2E1E] shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-[#3D2E1E] text-white flex items-center justify-center font-bold text-xl">
              {selectedName.name.charAt(0)}
            </div>
            <h4
              style={{ fontFamily: canvaHeadlineFont }}
              className="text-2xl font-black tracking-tight text-[#2A1E12]"
            >
              {selectedName.name}
            </h4>
            <p className="text-xs italic font-serif text-[#6B5742]">
              "{selectedName.tagline}"
            </p>
          </div>
        )}

        {activeTab === 'app' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-[28px] bg-gradient-to-br from-brand-600 to-coral-500 text-white flex flex-col items-center justify-center shadow-xl shadow-brand-500/20 transform hover:scale-105 transition-transform">
              <span className="font-display font-black text-4xl tracking-tighter">
                {selectedName.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span
              style={{ fontFamily: canvaHeadlineFont }}
              className="text-base font-bold text-slate-800"
            >
              {selectedName.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
