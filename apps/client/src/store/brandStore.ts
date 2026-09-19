import { create } from 'zustand';
import type {
  BrandInput,
  BrandName,
  BrandTone,
  LogoStyle,
  LogoConcept,
} from '@upstream/shared';
import {
  PREBUILT_THEMES,
  MOCK_BRAND_NAMES,
  COFFEE_BRAND_NAMES,
  SUSTAINABLE_PRODUCTIVITY_NAMES,
  getNamesForConcept,
  getTaglinesForBrand,
  INITIAL_CHAT_MESSAGES,
} from '../mock/mockData';
import confetti from 'canvas-confetti';

export interface ChatActionOption {
  id: string;
  label: string;
  actionType:
    | 'auto_pick_industry'
    | 'choose_template'
    | 'open_names_modal'
    | 'open_tagline_modal'
    | 'open_palette_modal'
    | 'open_logos_modal'
    | 'run_auto_pipeline'
    | 'custom_prompt';
  payload?: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  actionOptions?: ChatActionOption[];
}

export interface ProjectSession {
  id: string;
  title: string;
  industry: string;
  timestamp: string;
  activeBrandName?: string;
}

interface BrandStore {
  // Page mode: 'landing' vs 'studio'
  viewMode: 'landing' | 'studio';
  setViewMode: (mode: 'landing' | 'studio') => void;

  // Multi-step progression inside studio (1: Input -> 2: 5 Names -> 3: Tagline -> 4: Palette -> 5: Logo & Export)
  step: 1 | 2 | 3 | 4 | 5;
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void;

  // Workspace Card Materialization Flags (Right Panel displays only cards as choices/artifacts)
  hasConfirmedIndustry: boolean;
  hasConfirmedName: boolean;
  hasConfirmedTagline: boolean;
  hasConfirmedPalette: boolean;
  hasConfirmedLogo: boolean;

  // Modals with Blurred Background (Center overlay for choice decisions)
  isNameModalOpen: boolean;
  isTaglineModalOpen: boolean;
  isPaletteModalOpen: boolean;
  isLogoModalOpen: boolean;
  openNameModal: () => void;
  closeNameModal: () => void;
  openTaglineModal: () => void;
  closeTaglineModal: () => void;
  openPaletteModal: () => void;
  closePaletteModal: () => void;
  openLogoModal: () => void;
  closeLogoModal: () => void;

  // Input state
  input: BrandInput;
  setInput: (input: Partial<BrandInput>) => void;
  selectedThemeId: string | null;
  selectTheme: (themeId: string) => void;

  // Confirmation actions
  confirmIndustry: (customInput?: Partial<BrandInput>) => void;

  // Brand Names (5 curated)
  projectId: string;
  brandNames: BrandName[];
  selectedName: BrandName;
  favorites: string[];
  searchQuery: string;

  setBrandNames: (names: BrandName[]) => void;
  selectName: (name: BrandName) => void;
  selectTagline: (tagline: string) => void;
  toggleFavorite: (nameId: string) => void;
  setSearchQuery: (query: string) => void;

  // Selected Color Palette in Step 4
  activePaletteIdx: number;
  setActivePaletteIdx: (idx: number) => void;
  selectPalette: (idx: number) => void;

  // 5 Logo Concepts
  selectedLogoStyle: LogoStyle;
  setSelectedLogoStyle: (style: LogoStyle) => void;
  selectedLogo: LogoConcept | null;
  selectLogo: (logo: LogoConcept) => void;
  selectLogoStyle: (style: LogoStyle) => void;

  // Master Full-Auto Runner
  runFullAutonomousPipeline: () => void;

  // Loading states
  isLoadingNames: boolean;
  isLoadingLogos: boolean;
  setLoadingNames: (loading: boolean) => void;
  setLoadingLogos: (loading: boolean) => void;

  // Project Sessions History
  sessions: ProjectSession[];
  activeSessionId: string;
  createNewProject: () => void;
  loadSession: (sessionId: string) => void;

  // Autonomous Agent Chat Pane
  chatMessages: ChatMessage[];
  isChatTyping: boolean;
  sendChatMessage: (text: string) => void;
  handleActionOption: (option: ChatActionOption) => void;

  // Canva-Style Interactive Editor State & Controls
  canvaSelectedElement: 'wordmark' | 'tagline' | 'background';
  setCanvaSelectedElement: (el: 'wordmark' | 'tagline' | 'background') => void;
  canvaHeadlineFont: string;
  setCanvaHeadlineFont: (font: string) => void;
  canvaWordmarkSize: number;
  setCanvaWordmarkSize: (size: number) => void;
  canvaTaglineSize: number;
  setCanvaTaglineSize: (size: number) => void;
  canvaFontWeight: number;
  setCanvaFontWeight: (weight: number) => void;
  canvaLetterSpacing: number;
  setCanvaLetterSpacing: (spacing: number) => void;
  canvaTextColor: string;
  setCanvaTextColor: (color: string) => void;
  canvaBgMode: 'light' | 'linen' | 'dark' | 'brand';
  setCanvaBgMode: (mode: 'light' | 'linen' | 'dark' | 'brand') => void;
  resetCanvaStyles: () => void;
  updateBrandNameText: (text: string) => void;
  updateTaglineText: (text: string) => void;

  // Quick actions
  startIdentityCreation: (initialPrompt?: string) => void;
  regenerateNames: () => void;
  reset: () => void;

  // Stretch Studio Features
  activeStudioTab: 'identity' | 'moodboard' | 'social' | 'competitors' | 'guidelines';
  setActiveStudioTab: (tab: 'identity' | 'moodboard' | 'social' | 'competitors' | 'guidelines') => void;
  nameAlternativesMap: Record<string, { taglines: string[]; logoStyles: LogoStyle[] }>;
  generateNameAlternatives: (brandId: string) => void;
  applyAlternativeTagline: (brandId: string, tagline: string) => void;
  applyAlternativeLogo: (brandId: string, style: LogoStyle) => void;
  isGuidelinesModalOpen: boolean;
  openGuidelinesModal: () => void;
  closeGuidelinesModal: () => void;
}

const defaultInput: BrandInput = {
  businessName: '',
  industry: 'Sustainable Productivity for Remote Teams',
  targetAudience: 'Remote-first professionals, indie hackers, and distributed teams seeking mindful work-life balance',
  mission: 'Helping remote workers achieve deep focus, reduce burnout, and build sustainable productivity habits through AI-assisted workflows.',
  tone: 'minimalist',
  constraints: 'Memorable, nature-inspired, sounds good in video call intros, works as a .com domain',
};

// 12 Curated Brand Names default
const FIVE_CURATED_NAMES: BrandName[] = SUSTAINABLE_PRODUCTIVITY_NAMES;

// Helper: Extract brand name if user explicitly specified one in prompt
export function extractBrandName(text: string): string | null {
  const patterns = [
    // Quoted name: "Ceramiq" or 'Aurae' after keywords
    /(?:named|called|brand|company|name)\s*[:=]?\s*["']([^"']+)["']/i,
    // Explicit named or called: "named Ceramiq", "called Aurae"
    /(?:named|called)\s+["']?([A-Za-z0-9&'-]+)["']?/i,
    // "brand name is [Name]" or "company name is [Name]"
    /(?:brand\s+name\s+(?:is|:)|company\s+name\s+(?:is|:)|brand\s+is|company\s+is)\s+["']?([A-Za-z0-9&'-]+)["']?/i,
    // "name: [Name]"
    /(?:name\s*:\s*)([A-Za-z0-9&'-]+)/i,
    // "Ceramiq - specialty coffee"
    /^([A-Z][A-Za-z0-9&'-]{2,20})\s*[-–—:]\s+/i,
  ];

  for (const regex of patterns) {
    const match = text.match(regex);
    if (match && match[1]) {
      const extracted = match[1].trim();
      const stopWords = ['a', 'an', 'the', 'our', 'my', 'new', 'some', 'this', 'that', 'coffee', 'business', 'company', 'brand'];
      if (!stopWords.includes(extracted.toLowerCase()) && extracted.length >= 2 && extracted.length <= 32) {
        return extracted;
      }
    }
  }
  return null;
}

export const useBrandStore = create<BrandStore>((set, get) => ({
  viewMode: 'landing',
  setViewMode: (mode) => set({ viewMode: mode }),

  step: 1,
  setStep: (step) => set({ step }),

  // Card Materialization Flags
  hasConfirmedIndustry: false,
  hasConfirmedName: false,
  hasConfirmedTagline: false,
  hasConfirmedPalette: false,
  hasConfirmedLogo: false,

  // Center Blurred Modals
  isNameModalOpen: false,
  isTaglineModalOpen: false,
  isPaletteModalOpen: false,
  isLogoModalOpen: false,

  openNameModal: () => set({ isNameModalOpen: true }),
  closeNameModal: () => set({ isNameModalOpen: false }),
  openTaglineModal: () => set({ isTaglineModalOpen: true }),
  closeTaglineModal: () => set({ isTaglineModalOpen: false }),
  openPaletteModal: () => set({ isPaletteModalOpen: true }),
  closePaletteModal: () => set({ isPaletteModalOpen: false }),
  openLogoModal: () => set({ isLogoModalOpen: true }),
  closeLogoModal: () => set({ isLogoModalOpen: false }),

  // Canva-Style Interactive Editor State & Controls
  canvaSelectedElement: 'wordmark',
  setCanvaSelectedElement: (el) => set({ canvaSelectedElement: el }),
  canvaHeadlineFont: 'Outfit',
  setCanvaHeadlineFont: (font) => set({ canvaHeadlineFont: font }),
  canvaWordmarkSize: 48,
  setCanvaWordmarkSize: (size) => set({ canvaWordmarkSize: size }),
  canvaTaglineSize: 16,
  setCanvaTaglineSize: (size) => set({ canvaTaglineSize: size }),
  canvaFontWeight: 700,
  setCanvaFontWeight: (weight) => set({ canvaFontWeight: weight }),
  canvaLetterSpacing: 0,
  setCanvaLetterSpacing: (spacing) => set({ canvaLetterSpacing: spacing }),
  canvaTextColor: '#0F172A',
  setCanvaTextColor: (color) => set({ canvaTextColor: color }),
  canvaBgMode: 'light',
  setCanvaBgMode: (mode) => set({ canvaBgMode: mode }),
  resetCanvaStyles: () =>
    set({
      canvaHeadlineFont: 'Outfit',
      canvaWordmarkSize: 48,
      canvaTaglineSize: 16,
      canvaFontWeight: 700,
      canvaLetterSpacing: 0,
      canvaTextColor: '#0F172A',
      canvaBgMode: 'light',
    }),
  updateBrandNameText: (text) =>
    set((state) => ({
      selectedName: { ...state.selectedName, name: text },
    })),
  updateTaglineText: (text) =>
    set((state) => ({
      selectedName: { ...state.selectedName, tagline: text },
    })),

  input: defaultInput,
  setInput: (newInput) =>
    set((state) => ({ input: { ...state.input, ...newInput } })),

  selectedThemeId: 'artisan-coffee',
  selectTheme: (themeId: string) => {
    const theme = PREBUILT_THEMES.find((t) => t.id === themeId);
    if (theme) {
      const names = getNamesForConcept(theme.defaultInput.industry);
      set({
        selectedThemeId: themeId,
        input: { ...theme.defaultInput },
        brandNames: names,
        selectedName: names[0],
        viewMode: 'studio',
        step: 1,
        hasConfirmedIndustry: true,
      });

      // Automatically synthesize names and open modal after a brief pause
      setTimeout(() => {
        set({ isNameModalOpen: true });
      }, 700);
    }
  },

  confirmIndustry: (customInput?: Partial<BrandInput>) => {
    const currentInput = get().input;
    const finalInput = { ...currentInput, ...(customInput || {}) };
    const names = getNamesForConcept(finalInput.industry);

    set({
      input: finalInput,
      hasConfirmedIndustry: true,
      brandNames: names,
      selectedName: names[0],
      step: 2,
      isLoadingNames: true,
    });

    const botMsg: ChatMessage = {
      id: 'msg_bot_confirmed_' + Date.now(),
      sender: 'assistant',
      text: `✨ **Industry Confirmed**: "${finalInput.industry}"\n\nI have generated the **Industry & Concept Card** on your right workspace. Now synthesizing **12 curated brand names** with phonetic and domain availability checks...`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionOptions: [
        {
          id: 'opt_open_names',
          label: '✨ Inspect 12 Generated Names',
          actionType: 'open_names_modal',
        },
        {
          id: 'opt_auto_pilot',
          label: '⚡ Auto-Pilot (All Steps)',
          actionType: 'run_auto_pipeline',
        },
      ],
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, botMsg],
    }));

    // Center modal with blurred background pops open
    setTimeout(() => {
      set({
        isLoadingNames: false,
        isNameModalOpen: true,
      });
    }, 700);
  },

  projectId: 'proj_upstream_' + Date.now().toString(36),
  brandNames: FIVE_CURATED_NAMES,
  selectedName: FIVE_CURATED_NAMES[0],
  favorites: ['coffee_01'],
  searchQuery: '',

  setBrandNames: (names) => set({ brandNames: names }),

  // STEP 1 -> STEP 2: Name Chosen -> Automatically advances to Tagline
  selectName: (name) => {
    set({
      selectedName: name,
      hasConfirmedName: true,
      isNameModalOpen: false,
      step: 2,
    });

    const botMsg: ChatMessage = {
      id: 'msg_bot_name_chosen_' + Date.now(),
      sender: 'assistant',
      text: `Selected **${name.name}**! The **Brand Name Card** has materialized on your right workspace.\n\nNow synthesizing 4 strategic tagline concepts tailored to ${name.name}...`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionOptions: [
        {
          id: 'opt_tagline',
          label: `⚡ Select Tagline for "${name.name}"`,
          actionType: 'open_tagline_modal',
        },
        {
          id: 'opt_auto_pilot',
          label: '⚡ Auto-Pilot Remaining Steps',
          actionType: 'run_auto_pipeline',
        },
      ],
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, botMsg],
    }));

    // Automatically open Tagline modal for user
    setTimeout(() => {
      set({ isTaglineModalOpen: true });
    }, 700);
  },

  // STEP 2 -> STEP 3: Tagline Chosen -> Automatically advances to Color Palette
  selectTagline: (tagline: string) => {
    const currentName = get().selectedName;
    const updated = { ...currentName, tagline };

    set({
      selectedName: updated,
      hasConfirmedTagline: true,
      isTaglineModalOpen: false,
      step: 3,
    });

    const botMsg: ChatMessage = {
      id: 'msg_bot_tagline_' + Date.now(),
      sender: 'assistant',
      text: `Tagline locked: *"${tagline}"*! Updated on your brand card.\n\nNow formulating 5 harmonic visual color palettes and typography pairings for **${updated.name}**...`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionOptions: [
        {
          id: 'opt_palette',
          label: '🎨 View Color & Font Harmonies',
          actionType: 'open_palette_modal',
        },
        {
          id: 'opt_auto_pilot',
          label: '⚡ Auto-Pilot Remaining Steps',
          actionType: 'run_auto_pipeline',
        },
      ],
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, botMsg],
    }));

    // Automatically open Palette modal for user
    setTimeout(() => {
      set({ isPaletteModalOpen: true });
    }, 700);
  },

  toggleFavorite: (nameId) =>
    set((state) => ({
      favorites: state.favorites.includes(nameId)
        ? state.favorites.filter((id) => id !== nameId)
        : [...state.favorites, nameId],
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),

  activePaletteIdx: 0,
  setActivePaletteIdx: (idx) => set({ activePaletteIdx: idx }),

  // STEP 3 -> STEP 4: Palette Chosen -> Automatically advances to Logo Marks
  selectPalette: (idx) => {
    set({
      activePaletteIdx: idx,
      hasConfirmedPalette: true,
      isPaletteModalOpen: false,
      step: 4,
    });

    const botMsg: ChatMessage = {
      id: 'msg_bot_palette_' + Date.now(),
      sender: 'assistant',
      text: `Visual palette locked in! **Visual Palette Card** added to your workspace.\n\nNow synthesizing 5 architectural vector logo styles for **${get().selectedName.name}**...`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionOptions: [
        {
          id: 'opt_logos',
          label: '💎 Inspect 5 Vector Logo Marks',
          actionType: 'open_logos_modal',
        },
        {
          id: 'opt_auto_pilot',
          label: '⚡ Auto-Pilot Remaining Steps',
          actionType: 'run_auto_pipeline',
        },
      ],
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, botMsg],
    }));

    // Automatically open Logo modal for user
    setTimeout(() => {
      set({ isLogoModalOpen: true });
    }, 800);
  },

  selectedLogoStyle: 'minimal',
  setSelectedLogoStyle: (style) => set({ selectedLogoStyle: style }),
  selectedLogo: null,
  selectLogo: (logo) => set({ selectedLogo: logo }),

  // STEP 4 -> STEP 5: Logo Style Chosen -> Final Identity & Export Complete!
  selectLogoStyle: (style) => {
    set({
      selectedLogoStyle: style,
      hasConfirmedLogo: true,
      isLogoModalOpen: false,
      step: 5,
    });

    if (typeof window !== 'undefined') {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {
        // Safe fallback if canvas not available
      }
    }

    const botMsg: ChatMessage = {
      id: 'msg_bot_logo_' + Date.now(),
      sender: 'assistant',
      text: `🎉 **Brand Identity Generation Complete!**\n\nAll 5 investor-ready cards have materialized on your workspace canvas:\n1. **Industry & Concept Card**\n2. **Brand Name & Tagline Card**\n3. **Visual Palette & Fonts Card**\n4. **Vector Logo Artwork Card**\n5. **Brand Kit Export Card**\n\nYou can toggle dark/light contrast modes, preview touchpoints, or download your complete Brand Kit PDF.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: ['Download PDF Brand Card', 'Copy Design Tokens', 'Start New Project'],
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, botMsg],
    }));
  },

  // FULL AUTONOMOUS PIPELINE RUNNER (Names -> Tagline -> Colors -> Visual Flow -> Logo)
  runFullAutonomousPipeline: () => {
    // Close any open modals
    set({
      isNameModalOpen: false,
      isTaglineModalOpen: false,
      isPaletteModalOpen: false,
      isLogoModalOpen: false,
    });

    const currentNames = get().brandNames;
    const chosenName = currentNames[0] || FIVE_CURATED_NAMES[0];
    const taglines = getTaglinesForBrand(chosenName.name, get().input.industry);
    const chosenTagline = taglines[0]?.tagline || chosenName.tagline;

    // Step 1: Confirm Industry
    set({ hasConfirmedIndustry: true });

    // Step 2: Name (after 400ms)
    setTimeout(() => {
      set({
        selectedName: chosenName,
        hasConfirmedName: true,
      });

      const msg1: ChatMessage = {
        id: 'msg_auto_name_' + Date.now(),
        sender: 'assistant',
        text: `⚡ [Autonomous Agent]: Synthesized and selected primary brand name **${chosenName.name}** (Match: 98/100). Materialized Brand Name Card.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      set((state) => ({ chatMessages: [...state.chatMessages, msg1] }));
    }, 400);

    // Step 3: Tagline (after 1000ms)
    setTimeout(() => {
      const updated = { ...chosenName, tagline: chosenTagline };
      set({
        selectedName: updated,
        hasConfirmedTagline: true,
      });

      const msg2: ChatMessage = {
        id: 'msg_auto_tagline_' + Date.now(),
        sender: 'assistant',
        text: `⚡ [Autonomous Agent]: Calibrated strategic tagline: *"${chosenTagline}"* (${taglines[0]?.angle || 'Artisanal Craft'}).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      set((state) => ({ chatMessages: [...state.chatMessages, msg2] }));
    }, 1000);

    // Step 4: Color Palette (after 1600ms)
    setTimeout(() => {
      set({
        activePaletteIdx: 0,
        hasConfirmedPalette: true,
      });

      const msg3: ChatMessage = {
        id: 'msg_auto_palette_' + Date.now(),
        sender: 'assistant',
        text: `⚡ [Autonomous Agent]: Established 5-color harmony and calibrated typography pairing (Headline: ${chosenName.visualDirection?.fonts.headline || 'Outfit'}, Body: ${chosenName.visualDirection?.fonts.body || 'Inter'}). Materialized Visual Palette Card.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      set((state) => ({ chatMessages: [...state.chatMessages, msg3] }));
    }, 1600);

    // Step 5: Vector Logo & Final Kit (after 2200ms)
    setTimeout(() => {
      set({
        selectedLogoStyle: 'minimal',
        hasConfirmedLogo: true,
        step: 5,
      });

      if (typeof window !== 'undefined') {
        try {
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
        } catch (e) {}
      }

      const msg4: ChatMessage = {
        id: 'msg_auto_complete_' + Date.now(),
        sender: 'assistant',
        text: `🎉 [Autonomous Agent]: **All 5 Brand Identity Artifacts Generated!**\n\n- Industry: ${get().input.industry}\n- Name: **${chosenName.name}**\n- Tagline: *"${chosenTagline}"*\n- Visual: 5-Color Harmony + Font Pairing\n- Logo: Architectural Vector Mark\n- Kit: PDF & PNG Export ready.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Download PDF Brand Card', 'Copy Design Tokens', 'Start New Project'],
      };
      set((state) => ({ chatMessages: [...state.chatMessages, msg4] }));
    }, 2200);
  },

  isLoadingNames: false,
  isLoadingLogos: false,
  setLoadingNames: (loading) => set({ isLoadingNames: loading }),
  setLoadingLogos: (loading) => set({ isLoadingLogos: loading }),

  sessions: [
    { id: 's1', title: 'Specialty Coffee', industry: 'Coffee Roastery', timestamp: 'Today', activeBrandName: 'Ceramiq' },
    { id: 's2', title: 'Kinetics Footwear', industry: 'Streetwear & Kicks', timestamp: 'Yesterday', activeBrandName: 'Kinetics' },
    { id: 's3', title: 'Aurae Atelier', industry: 'Haute Couture', timestamp: '3 days ago', activeBrandName: 'Aurae' },
  ],
  activeSessionId: 's1',

  createNewProject: () => {
    const newId = 's_' + Date.now();
    const newSession: ProjectSession = {
      id: newId,
      title: 'New Brand Project',
      industry: 'Custom Venture',
      timestamp: 'Just now',
    };
    set((state) => ({
      sessions: [newSession, ...state.sessions],
      activeSessionId: newId,
      viewMode: 'studio',
      step: 1,
      hasConfirmedIndustry: false,
      hasConfirmedName: false,
      hasConfirmedTagline: false,
      hasConfirmedPalette: false,
      hasConfirmedLogo: false,
      isNameModalOpen: false,
      isTaglineModalOpen: false,
      isPaletteModalOpen: false,
      isLogoModalOpen: false,
      input: {
        businessName: '',
        industry: '',
        targetAudience: '',
        mission: '',
        tone: 'bold',
        constraints: '',
      },
    }));
  },

  loadSession: (sessionId) => {
    const s = get().sessions.find((item) => item.id === sessionId);
    if (s) {
      set({
        activeSessionId: sessionId,
        viewMode: 'studio',
      });
    }
  },

  chatMessages: INITIAL_CHAT_MESSAGES,
  isChatTyping: false,

  handleActionOption: (option: ChatActionOption) => {
    switch (option.actionType) {
      case 'auto_pick_industry':
        get().confirmIndustry(option.payload);
        break;
      case 'choose_template':
        if (option.payload?.themeId) {
          get().selectTheme(option.payload.themeId);
          get().confirmIndustry();
        }
        break;
      case 'open_names_modal':
        set({ isNameModalOpen: true });
        break;
      case 'open_tagline_modal':
        set({ isTaglineModalOpen: true });
        break;
      case 'open_palette_modal':
        set({ isPaletteModalOpen: true });
        break;
      case 'open_logos_modal':
        set({ isLogoModalOpen: true });
        break;
      case 'run_auto_pipeline':
        get().runFullAutonomousPipeline();
        break;
      case 'custom_prompt':
        if (option.payload?.prompt) {
          get().sendChatMessage(option.payload.prompt);
        }
        break;
    }
  },

  sendChatMessage: (text: string) => {
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMsg],
      isChatTyping: true,
    }));

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      let suggestions: string[] = [];
      let actionOptions: ChatActionOption[] = [];

      // Check if user is asking for auto-pilot / full flow
      if (
        lower.includes('auto') ||
        lower.includes('pilot') ||
        lower.includes('all steps') ||
        lower.includes('everything') ||
        lower.includes('step by step')
      ) {
        set({ isChatTyping: false });
        get().runFullAutonomousPipeline();
        return;
      }

      // Check if user explicitly provided a brand name in their prompt (Fast-Path)
      const explicitName = extractBrandName(text);

      // Detect Concept & Venture parameters from prompt
      let detectedTheme = 'Specialty Coffee Roastery & Micro-Café';
      let detectedTone: BrandTone = 'playful';
      let detectedAudience = 'Third-wave coffee lovers, daily espresso purists, and design enthusiasts';
      let detectedMission = 'Celebrating the nuanced terroir of heirloom coffee cherries roasted in small, carbon-neutral batches.';

      const isCoffee =
        lower.includes('coffee') ||
        lower.includes('cofee') ||
        lower.includes('coffe') ||
        lower.includes('cafe') ||
        lower.includes('roast') ||
        lower.includes('brew') ||
        lower.includes('espresso');

      const isStreetwear =
        lower.includes('apparel') ||
        lower.includes('shoe') ||
        lower.includes('kicks') ||
        lower.includes('streetwear') ||
        lower.includes('cloth') ||
        lower.includes('sneaker');

      const isTech =
        lower.includes('tech') ||
        lower.includes('saas') ||
        lower.includes('ai') ||
        lower.includes('software') ||
        lower.includes('cloud') ||
        lower.includes('code');

      const isSkincare =
        lower.includes('skincare') ||
        lower.includes('organic') ||
        lower.includes('botanical') ||
        lower.includes('beauty') ||
        lower.includes('wellness');

      if (isStreetwear) {
        detectedTheme = 'Streetwear & Sneaker Apparel';
        detectedTone = 'bold';
        detectedAudience = 'Gen Z and urban creators aged 18-32';
        detectedMission = 'Crafting limited-run apparel and sneakers merging architectural silhouettes with sustainable comfort.';
      } else if (isTech) {
        detectedTheme = 'AI & Developer Cloud Infrastructure';
        detectedTone = 'tech-forward';
        detectedAudience = 'Full-stack engineers, AI researchers, and fast-moving tech startups';
        detectedMission = 'Democratizing multi-agent workflows and real-time generative intelligence through frictionless developer tools.';
      } else if (isSkincare) {
        detectedTheme = 'Clean Organic Skincare & Botanicals';
        detectedTone = 'minimalist';
        detectedAudience = 'Conscious consumers seeking pure, botanical, cruelty-free skin rituals';
        detectedMission = 'Nourishing skin longevity with cold-pressed alpine extracts and zero-waste packaging.';
      } else if (!isCoffee && text.length > 5) {
        // Custom generic business venture
        detectedTheme = text.length > 30 ? text.slice(0, 30) + '...' : text;
        detectedTone = 'bold';
        detectedAudience = 'Modern discerning consumers and forward-thinking clients';
        detectedMission = `Building an unforgettable identity for "${text}".`;
      }

      const candidateInput: Partial<BrandInput> = {
        industry: detectedTheme,
        tone: detectedTone,
        targetAudience: detectedAudience,
        mission: detectedMission,
        constraints: 'Modern, memorable, high phonetic appeal, verified domain availability',
      };

      const names = getNamesForConcept(candidateInput.industry || detectedTheme);

      // FAST PATH: If user already provided a brand name, skip 5-name generation and immediately suggest color palette & open Canva editor
      if (explicitName) {
        const cleanName = explicitName;
        const brandObj: BrandName = {
          id: 'custom_' + Date.now(),
          name: cleanName,
          meaning: `Founder-specified brand identity curated for ${detectedTheme.toLowerCase()}.`,
          tagline: `Crafted with distinction for ${detectedTheme.toLowerCase()}.`,
          domainAvailability: {
            com: true,
            io: true,
            co: true,
            handle: { twitter: true, instagram: true },
          },
          visualDirection: {
            palette: [
              { hex: '#1C1917', name: 'Obsidian Roast', role: 'text' },
              { hex: '#C2410C', name: 'Terracotta Ember', role: 'primary' },
              { hex: '#EA580C', name: 'Crema Gold', role: 'secondary' },
              { hex: '#FDFBF7', name: 'Parchment Milk', role: 'background' },
              { hex: '#78716C', name: 'Pumice Stone', role: 'accent' },
            ],
            fonts: {
              headline: 'Outfit',
              body: 'Plus Jakarta Sans',
              headlineWeight: '700',
              bodyWeight: '400',
            },
            styleDescription: 'Clean modernist geometry with elevated human warmth.',
          },
        };

        set({
          input: { ...get().input, ...candidateInput, businessName: cleanName },
          hasConfirmedIndustry: true,
          hasConfirmedName: true,
          isNameModalOpen: false,
          isTaglineModalOpen: false,
          selectedName: brandObj,
          brandNames: [brandObj, ...names.slice(0, 4)],
          step: 4,
          isChatTyping: false,
        });

        reply = `✨ **Brand Name Locked: "${cleanName}"**\n\nI recognized your brand name: **${cleanName}**!\n- **Name Generation**: Skipped (Name specified by user)\n- **Industry**: ${detectedTheme}\n\n🎨 **Next: Color Palette & Visual Identity**\nI've opened the curated **Color Palette** selection for you, and activated the **Canva-style Design Controls** on your right workspace where you can live-edit typography, sizes, weights, and colors!`;

        actionOptions = [
          {
            id: 'opt_palette_open',
            label: '🎨 Suggest & Choose Color Palette',
            actionType: 'open_palette_modal',
          },
          {
            id: 'opt_auto_pilot',
            label: '⚡ Run Auto-Pilot for Remaining Steps',
            actionType: 'run_auto_pipeline',
          },
        ];

        suggestions = [
          'Choose Warm Terracotta Palette',
          'Switch font to Syne or Playfair Display',
          'Generate Vector Logos',
        ];

        const botMsg: ChatMessage = {
          id: 'msg_bot_' + Date.now(),
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions,
          actionOptions,
        };

        set((state) => ({
          chatMessages: [...state.chatMessages, botMsg],
        }));

        // Immediately suggest color palette modal after 500ms
        setTimeout(() => {
          set({ isPaletteModalOpen: true });
        }, 500);

        return;
      }

      // Default path (no name provided): automatically confirm industry and populate Card 1
      set({
        input: { ...get().input, ...candidateInput },
        hasConfirmedIndustry: true,
        brandNames: names,
        selectedName: names[0],
        step: 2,
        isChatTyping: false,
      });

      reply = `✨ **Autonomous Agent Initialized**\n\nI analyzed your vision: *"${text}"*\n- **Industry**: ${detectedTheme}\n- **Tone**: ${detectedTone}\n- **Audience**: ${detectedAudience}\n\n**Card 1: Industry & Concept** is now live on your workspace. Now synthesizing 5 curated brand names with phonetic scoring...`;

      actionOptions = [
        {
          id: 'opt_open_names',
          label: '✨ Open 5 Generated Names',
          actionType: 'open_names_modal',
        },
        {
          id: 'opt_auto_pilot',
          label: '⚡ Run Full Auto-Pilot (All Steps)',
          actionType: 'run_auto_pipeline',
        },
      ];

      suggestions = [
        '⚡ Run Full Auto-Pilot (All Steps)',
        'Open 5 Generated Names',
        'Make tone more luxury & quiet',
      ];

      const botMsg: ChatMessage = {
        id: 'msg_bot_' + Date.now(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions,
        actionOptions,
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, botMsg],
      }));

      // Automatically open the 5 names center modal after 800ms
      setTimeout(() => {
        set({ isNameModalOpen: true });
      }, 800);
    }, 600);
  },

  startIdentityCreation: (initialPrompt?: string) => {
    set({
      viewMode: 'studio',
      step: 1,
      hasConfirmedIndustry: false,
      hasConfirmedName: false,
      hasConfirmedTagline: false,
      hasConfirmedPalette: false,
      hasConfirmedLogo: false,
    });

    if (initialPrompt) {
      setTimeout(() => {
        get().sendChatMessage(initialPrompt);
      }, 300);
    }
  },

  regenerateNames: () => {
    set({ isLoadingNames: true });
    setTimeout(() => {
      const names = getNamesForConcept(get().input.industry);
      const shuffled = [...names].sort(() => 0.5 - Math.random());
      set({
        brandNames: shuffled,
        selectedName: shuffled[0],
        isLoadingNames: false,
        isNameModalOpen: true,
      });
    }, 700);
  },

  // Stretch Studio Features
  activeStudioTab: 'identity',
  setActiveStudioTab: (tab) => set({ activeStudioTab: tab }),

  nameAlternativesMap: {},
  generateNameAlternatives: (brandId) => {
    const state = get();
    const brand = state.brandNames.find((b) => b.id === brandId) || state.selectedName;
    const nameStr = brand.name || 'Brand';
    
    // Synthesize 3 distinct tailored taglines and 3 distinct logo styles
    const altTaglines = [
      `Pure Expression of ${nameStr}`,
      `Architected for ${state.input.industry || 'Tomorrow'}`,
      `Where Craft Meets Modern Distinction`,
    ];
    const altLogos: LogoStyle[] = ['minimal', 'wordmark', 'abstract'];

    set((s) => ({
      nameAlternativesMap: {
        ...s.nameAlternativesMap,
        [brandId]: {
          taglines: altTaglines,
          logoStyles: altLogos,
        },
      },
    }));
  },

  applyAlternativeTagline: (brandId, tagline) => {
    set((state) => {
      const updatedNames = state.brandNames.map((b) =>
        b.id === brandId ? { ...b, tagline } : b
      );
      const isCurrentSelected = state.selectedName?.id === brandId;
      return {
        brandNames: updatedNames,
        selectedName: isCurrentSelected ? { ...state.selectedName, tagline } : state.selectedName,
      };
    });
  },

  applyAlternativeLogo: (brandId, style) => {
    set((state) => {
      const isCurrentSelected = state.selectedName?.id === brandId;
      return {
        selectedLogoStyle: isCurrentSelected ? style : state.selectedLogoStyle,
      };
    });
  },

  isGuidelinesModalOpen: false,
  openGuidelinesModal: () => set({ isGuidelinesModalOpen: true }),
  closeGuidelinesModal: () => set({ isGuidelinesModalOpen: false }),

  reset: () => {
    set({
      viewMode: 'landing',
      step: 1,
      input: defaultInput,
      hasConfirmedIndustry: false,
      hasConfirmedName: false,
      hasConfirmedTagline: false,
      hasConfirmedPalette: false,
      hasConfirmedLogo: false,
      isNameModalOpen: false,
      isTaglineModalOpen: false,
      isPaletteModalOpen: false,
      isLogoModalOpen: false,
      brandNames: FIVE_CURATED_NAMES,
      selectedName: FIVE_CURATED_NAMES[0],
      selectedLogoStyle: 'minimal',
      canvaSelectedElement: 'wordmark',
      canvaHeadlineFont: 'Outfit',
      canvaWordmarkSize: 48,
      canvaTaglineSize: 16,
      canvaFontWeight: 700,
      canvaLetterSpacing: 0,
      canvaTextColor: '#0F172A',
      canvaBgMode: 'light',
    });
  },
}));
