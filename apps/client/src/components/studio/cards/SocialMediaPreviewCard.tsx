import React, { useState } from 'react';
import { useBrandStore } from '../../../store/brandStore';
import { LogoArtwork } from '../../brand/LogoArtwork';

// Custom Inline SVG Icons for Platforms
const TwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

import {
  Sun,
  Moon,
  CheckCircle,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';

export const SocialMediaPreviewCard: React.FC = () => {
  const { selectedName, selectedLogoStyle, input } = useBrandStore();
  const [platform, setPlatform] = useState<'twitter' | 'linkedin' | 'instagram'>('twitter');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const headlineFont = selectedName.visualDirection?.fonts?.headline || 'Outfit';
  const palette = selectedName.visualDirection?.palette || [];
  const primaryColor = palette[0]?.hex || '#0F172A';
  const accentColor = palette[2]?.hex || '#F97356';
  const bgLightColor = palette[3]?.hex || '#F8F6FE';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Omnichannel Brand Expression
          </span>
          <h3 className="text-xl font-display font-bold text-slate-950 tracking-tight">
            Social Media Identity Previews
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-world previews of {selectedName.name} across Twitter / X, LinkedIn, and Instagram.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Platform Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setPlatform('twitter')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                platform === 'twitter'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TwitterIcon className="w-3.5 h-3.5 text-[#1DA1F2]" />
              <span className="hidden sm:inline">Twitter / X</span>
            </button>

            <button
              onClick={() => setPlatform('linkedin')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                platform === 'linkedin'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkedinIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
              <span className="hidden sm:inline">LinkedIn</span>
            </button>

            <button
              onClick={() => setPlatform('instagram')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                platform === 'instagram'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C]" />
              <span className="hidden sm:inline">Instagram</span>
            </button>
          </div>
        </div>
      </div>

      {/* Platform Mockup Canvas */}
      <div
        className={`rounded-2xl border transition-colors overflow-hidden ${
          isDarkMode
            ? 'bg-slate-950 border-slate-800 text-slate-100'
            : 'bg-[#F8FAFC] border-slate-200 text-slate-900'
        }`}
      >
        {/* ==================== 1. TWITTER / X PREVIEW ==================== */}
        {platform === 'twitter' && (
          <div className="max-w-xl mx-auto">
            {/* Header Banner (3:1) */}
            <div
              className="h-32 sm:h-40 w-full relative overflow-hidden flex items-center justify-center p-4"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
              }}
            >
              <div className="opacity-15 absolute inset-0 flex items-center justify-center">
                <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant="dark" size="lg" />
              </div>
              <h2
                style={{ fontFamily: headlineFont }}
                className="text-2xl sm:text-3xl font-black text-white tracking-widest uppercase opacity-90 drop-shadow-sm"
              >
                {selectedName.name}
              </h2>
            </div>

            {/* Profile Bar */}
            <div className="px-5 pb-5">
              <div className="flex justify-between items-end -mt-12 sm:-mt-14 mb-3">
                {/* Avatar */}
                <div
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 flex items-center justify-center p-3 shadow-md ${
                    isDarkMode ? 'border-slate-950 bg-slate-900' : 'border-white bg-white'
                  }`}
                >
                  <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant={isDarkMode ? 'dark' : 'light'} size="sm" />
                </div>

                <button
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs ${
                    isDarkMode ? 'bg-white text-slate-950 hover:bg-slate-200' : 'bg-slate-950 text-white hover:bg-slate-800'
                  }`}
                >
                  Follow
                </button>
              </div>

              {/* Bio & Details */}
              <div className="space-y-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 style={{ fontFamily: headlineFont }} className="text-lg font-bold leading-tight">
                      {selectedName.name}
                    </h3>
                    <CheckCircle className="w-4 h-4 text-sky-500 fill-sky-500 text-white" />
                  </div>
                  <span className="text-xs text-slate-500 font-mono">@{selectedName.name.toLowerCase()}</span>
                </div>

                <p className="text-xs leading-relaxed max-w-lg">
                  {selectedName.tagline}. {input.mission || 'Crafting modern design excellence.'}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-sky-500" />
                    <span className="text-sky-500 hover:underline">{selectedName.name.toLowerCase()}.com</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Joined September 2026</span>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs pt-1">
                  <span>
                    <strong className="font-bold">428</strong> <span className="text-slate-500">Following</span>
                  </span>
                  <span>
                    <strong className="font-bold">14.2K</strong> <span className="text-slate-500">Followers</span>
                  </span>
                </div>
              </div>

              {/* Pinned Tweet Sample */}
              <div
                className={`mt-4 p-4 rounded-xl border ${
                  isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 text-[10px] text-slate-400 font-mono">
                  <span>📌 Pinned Post</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center p-1 flex-shrink-0">
                    <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant="light" size="sm" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold">{selectedName.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">@{selectedName.name.toLowerCase()} · 2h</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      We are proud to introduce <strong className="font-bold">{selectedName.name}</strong>. {selectedName.tagline}. Discover the future of {input.industry.toLowerCase()}.
                    </p>

                    {/* Tweet Action Icons */}
                    <div className="flex items-center justify-between pt-2 text-slate-400 max-w-xs text-xs">
                      <span className="flex items-center gap-1 hover:text-sky-500 cursor-pointer">
                        <MessageCircle className="w-3.5 h-3.5" /> 24
                      </span>
                      <span className="flex items-center gap-1 hover:text-emerald-500 cursor-pointer">
                        <Repeat2 className="w-3.5 h-3.5" /> 89
                      </span>
                      <span className="flex items-center gap-1 hover:text-rose-500 cursor-pointer">
                        <Heart className="w-3.5 h-3.5" /> 612
                      </span>
                      <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
                        <Bookmark className="w-3.5 h-3.5" /> 45
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. LINKEDIN PREVIEW ==================== */}
        {platform === 'linkedin' && (
          <div className="max-w-xl mx-auto p-4 sm:p-6">
            <div
              className={`rounded-2xl border overflow-hidden ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
              }`}
            >
              {/* Cover Banner (4:1) */}
              <div
                className="h-28 w-full relative flex items-center justify-end p-4"
                style={{
                  background: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                }}
              >
                <span
                  style={{ fontFamily: headlineFont }}
                  className="text-xl font-bold text-white tracking-wider uppercase opacity-80"
                >
                  {selectedName.name}
                </span>
              </div>

              {/* Company Info */}
              <div className="p-5 relative">
                <div className="flex justify-between items-start -mt-14 mb-3">
                  <div
                    className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center p-2 shadow-md ${
                      isDarkMode ? 'border-slate-900 bg-slate-950' : 'border-white bg-white'
                    }`}
                  >
                    <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant={isDarkMode ? 'dark' : 'light'} size="sm" />
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="px-4 py-1.5 rounded-full bg-[#0A66C2] text-white text-xs font-bold hover:bg-[#084e96] transition-colors">
                      + Follow
                    </button>
                    <button
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'
                      }`}
                    >
                      Visit website
                    </button>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontFamily: headlineFont }} className="text-xl font-bold">
                    {selectedName.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {selectedName.tagline}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {input.industry} · 11-50 employees · 3,420 followers
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. INSTAGRAM PREVIEW ==================== */}
        {platform === 'instagram' && (
          <div className="max-w-sm mx-auto p-4 sm:p-5 space-y-4">
            {/* Instagram Profile Header */}
            <div className="flex items-center gap-5">
              {/* Avatar with Rainbow Story Ring */}
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex-shrink-0">
                <div
                  className={`w-18 h-18 rounded-full border-2 flex items-center justify-center p-2.5 ${
                    isDarkMode ? 'border-slate-950 bg-slate-900' : 'border-white bg-white'
                  }`}
                >
                  <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant={isDarkMode ? 'dark' : 'light'} size="sm" />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between flex-1 text-center text-xs">
                <div>
                  <strong className="block font-bold">24</strong>
                  <span className="text-[10px] text-slate-500">posts</span>
                </div>
                <div>
                  <strong className="block font-bold">18.6K</strong>
                  <span className="text-[10px] text-slate-500">followers</span>
                </div>
                <div>
                  <strong className="block font-bold">342</strong>
                  <span className="text-[10px] text-slate-500">following</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="text-xs space-y-1">
              <h4 style={{ fontFamily: headlineFont }} className="font-bold">
                {selectedName.name}
              </h4>
              <p className="text-slate-500 text-[11px] font-medium">{input.industry}</p>
              <p className="leading-snug text-[11px]">
                {selectedName.tagline} ✦ Handcrafted with precision.
              </p>
              <a href="#" className="text-sky-600 font-medium block text-[11px]">
                linkin.bio/{selectedName.name.toLowerCase()}
              </a>
            </div>

            {/* Story Highlights */}
            <div className="flex items-center gap-3 pt-1">
              {['Collection', 'Atelier', 'Press'].map((storyName, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded-full border flex items-center justify-center text-xs font-bold ${
                      isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {storyName[0]}
                  </div>
                  <span className="text-[9px] text-slate-500 font-medium">{storyName}</span>
                </div>
              ))}
            </div>

            {/* 3x2 Grid Feed Preview */}
            <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-200/60">
              {[1, 2, 3, 4, 5, 6].map((postNum) => (
                <div
                  key={postNum}
                  className="aspect-square rounded-sm overflow-hidden flex items-center justify-center p-2 relative group cursor-pointer"
                  style={{
                    backgroundColor: palette[postNum % palette.length]?.hex || primaryColor,
                  }}
                >
                  <div className="opacity-80">
                    <LogoArtwork brand={selectedName} style={selectedLogoStyle} variant="light" size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
