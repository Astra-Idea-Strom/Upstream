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
  getNamesForConcept,
  getTaglinesForBrand,
  INITIAL_CHAT_MESSAGES,
} from '../mock/mockData';
import { getCanvasSurface } from '../lib/canvasSurfaces';
import { isLegible } from '../lib/color';
import { brandApi } from '../services/api';

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

/**
 * The single completion message for the flow.
 *
 * Both the manual path (`selectLogoStyle`) and the autonomous path
 * (`runFullAutonomousPipeline`) end here, so the transcript finishes the same
 * way however the user got there. Previously each path had its own wording and
 * its own follow-up chips, which made the same event read as two events.
 */
function buildCompletionMessage(brand: BrandName, industry: string, tagline: string): ChatMessage {
  return {
    id: 'msg_complete_' + Date.now(),
    sender: 'assistant',
    text: `**${brand.name} is complete.**\n\n- Brief — ${industry}\n- Name — **${brand.name}**\n- Tagline — *"${tagline}"*\n- Visual — colour palette + font pairing\n- Logo — vector mark\n\nThe export kit is ready below.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestions: ['Use a quieter, more luxurious tone', 'Try a bolder direction', 'Start a new brand'],
  };
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
  /**
   * Real generated artwork, keyed by logo style.
   *
   * The agent returns one FLUX.2 mark per studio style; the canvas renders a
   * procedural SVG for each style. Without this map there is no way for a given
   * tile to know which generated image belongs to it, so the artwork stayed
   * invisible even though it existed. Empty until the agent generates marks.
   */
  logoImageByStyle: Record<string, string>;
  setLogoImages: (images: Record<string, string>) => void;

  // Master Full-Auto Runner
  runFullAutonomousPipeline: () => void;
  /**
   * True while the agent is driving the flow itself. The canvas uses this to
   * render a placeholder for the in-flight step instead of a chooser the user
   * is not expected to interact with.
   */
  isAutoPilot: boolean;

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
}

const defaultInput: BrandInput = {
  businessName: '',
  industry: 'Specialty Coffee Roastery & Micro-Café',
  targetAudience: 'Third-wave coffee lovers, daily espresso purists, and design enthusiasts',
  mission: 'Celebrating the nuanced terroir of heirloom coffee cherries roasted in small, carbon-neutral batches.',
  tone: 'playful',
  constraints: 'Warm, memorable, catchy, sounds great on ceramic mugs and kraft paper bags',
};

// 5 Curated Brand Names default
const FIVE_CURATED_NAMES: BrandName[] = COFFEE_BRAND_NAMES.slice(0, 5);

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
  /**
   * Switching the surface can strand the ink: a colour chosen for the white
   * canvas disappears the moment the canvas turns dark, and the toolbar would
   * still show it as selected. If the current colour cannot be read on the new
   * surface, fall back to that surface's default ink so the two stay in step.
   */
  setCanvaBgMode: (mode) => {
    const surface = getCanvasSurface(mode);
    set((state) => ({
      canvaBgMode: mode,
      canvaTextColor: isLegible(state.canvaTextColor, surface.hex)
        ? state.canvaTextColor
        : surface.ink,
    }));
  },
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
        step: 2,
        hasConfirmedIndustry: true,
      });
      // No timer needed: confirming the brief makes the name step active, and
      // the canvas derives its chooser from progress.
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
      text: `**Brief captured** — ${finalInput.industry}\n\nFive candidate names are on the canvas, with domain availability for each. Pick one to continue.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionOptions: [
        {
          id: 'opt_auto_pilot',
          label: 'Complete the remaining steps',
          actionType: 'run_auto_pipeline',
        },
      ],
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, botMsg],
    }));

    // The name step is now active, so the canvas renders its chooser. The
    // timer only clears the "synthesising" skeleton.
    setTimeout(() => {
      set({ isLoadingNames: false });
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
      text: `**${name.name}** locked in.\n\nFour taglines are ready. Choose one to continue.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, botMsg],
    }));
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
      text: `Tagline locked — *"${tagline}"*.\n\nFive colour harmonies are ready, each with a font pairing. Apply one to continue.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, botMsg],
    }));
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
      text: `Visual system applied to **${get().selectedName.name}**.\n\nFive vector logo directions are ready. Pick a mark to finish the identity.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, botMsg],
    }));
  },

  selectedLogoStyle: 'minimal',
  setSelectedLogoStyle: (style) => set({ selectedLogoStyle: style }),
  selectedLogo: null,
  selectLogo: (logo) => set({ selectedLogo: logo }),

  logoImageByStyle: {},
  setLogoImages: (images) =>
    set((state) => ({ logoImageByStyle: { ...state.logoImageByStyle, ...images } })),

  // STEP 4 -> STEP 5: Logo Style Chosen -> Final Identity & Export Complete!
  selectLogoStyle: (style) => {
    set({
      selectedLogoStyle: style,
      hasConfirmedLogo: true,
      isLogoModalOpen: false,
      step: 5,
    });

    // The celebration is fired by BrandKitExportCard on mount — the one moment
    // the identity is actually finished — so it is not duplicated here.

    const botMsg = buildCompletionMessage(
      get().selectedName,
      get().input.industry,
      get().selectedName.tagline,
    );

    set((state) => ({
      chatMessages: [...state.chatMessages, botMsg],
    }));
  },

  // FULL AUTONOMOUS PIPELINE RUNNER (Names -> Tagline -> Colors -> Visual Flow -> Logo)
  runFullAutonomousPipeline: () => {
    // Close any open choosers and mark the session as agent-driven.
    set({
      isAutoPilot: true,
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
        text: `**${chosenName.name}** locked in.\n\nFour taglines are ready.`,
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
        text: `Tagline locked — *"${chosenTagline}"*\n\nFive colour harmonies are ready.`,
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
        text: `Visual system applied to **${chosenName.name}**.\n\nFive logo directions are ready.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      set((state) => ({ chatMessages: [...state.chatMessages, msg3] }));
    }, 1600);

    // Step 5: Vector Logo & Final Kit (after 2200ms)
    setTimeout(() => {
      set({
        selectedLogoStyle: 'minimal',
        hasConfirmedLogo: true,
        isAutoPilot: false,
        step: 5,
      });

      // Celebration is owned by BrandKitExportCard's mount effect, so both the
      // manual and autonomous paths get exactly one burst.

      const msg4 = buildCompletionMessage(
        chosenName,
        get().input.industry,
        chosenTagline,
      );
      set((state) => ({ chatMessages: [...state.chatMessages, msg4] }));
    }, 2200);
  },

  isLoadingNames: false,
  isLoadingLogos: false,
  isAutoPilot: false,
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
      chatMessages: INITIAL_CHAT_MESSAGES,
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
      isAutoPilot: false,
      logoImageByStyle: {},
      selectedLogo: null,
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

  sendChatMessage: async (text: string) => {
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

    const lower = text.toLowerCase().trim();

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

    // Explicit restart intent
    if (/^(start (a )?new|new (project|brand|identity)|reset|start over)\b/i.test(lower)) {
      set({ isChatTyping: false });
      get().reset();
      return;
    }

    try {
      const currentState = {
        step: get().step,
        industry: get().input.industry,
        tone: get().input.tone,
        targetAudience: get().input.targetAudience,
        mission: get().input.mission,
        selectedName: get().selectedName?.name,
      };

      const history = get().chatMessages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      // Call Groq (GPT OSS 120B) backend endpoint
      const aiRes = await brandApi.chat({
        message: text,
        history,
        currentContext: currentState,
      });

      const reply = aiRes.reply;
      const suggestions = aiRes.suggestions || ['Start a new brand', 'Ask for advice'];
      const detectedIntent = aiRes.detectedIntent;
      const brief = aiRes.extractedBrief;

      // 1. Apply FLUX.2 logo concepts if generated by agent tools
      if (aiRes.logos && aiRes.logos.length > 0) {
        const topLogo = aiRes.logos[0];

        // Key every returned mark by its style so the canvas tiles can each show
        // their own artwork instead of all falling back to the procedural SVG.
        const byStyle: Record<string, string> = {};
        for (const logo of aiRes.logos) {
          if (logo.url && logo.style) byStyle[String(logo.style)] = logo.url;
        }

        set({
          selectedLogo: {
            id: topLogo.id,
            url: topLogo.url,
            prompt: (topLogo as any).prompt || 'Vector logo mark',
            style: (topLogo.style as any) || 'abstract',
            model: 'flux',
            mode: (topLogo.mode as any) || 'scratch',
          },
          // A single generated mark still fills the tile for its own style; if
          // the style is unknown, seed the currently selected tile so the
          // artwork is visible immediately.
          logoImageByStyle: {
            ...get().logoImageByStyle,
            ...(Object.keys(byStyle).length
              ? byStyle
              : { [get().selectedLogoStyle]: topLogo.url }),
          },
          hasConfirmedLogo: true,
          step: 5,
        });
      }

      // 2. Apply canvas / artboard presentation adjustments
      if (aiRes.canvasPatch && typeof aiRes.canvasPatch === 'object') {
        const p: any = aiRes.canvasPatch;
        const patchState: any = {};
        if (p.bgMode || p.surface) patchState.canvaBgMode = p.bgMode || p.surface;
        if (p.headlineFont) patchState.canvaHeadlineFont = p.headlineFont;
        if (typeof p.wordmarkSize === 'number') patchState.canvaWordmarkSize = p.wordmarkSize;
        if (typeof p.taglineSize === 'number') patchState.canvaTaglineSize = p.taglineSize;
        if (typeof p.fontWeight === 'number') patchState.canvaFontWeight = p.fontWeight;
        if (typeof p.letterSpacing === 'number') patchState.canvaLetterSpacing = p.letterSpacing;
        if (p.textColor) patchState.canvaTextColor = p.textColor;
        set(patchState);
      }

      // 3. Apply brand names if generated by agent tools
      if (aiRes.names && aiRes.names.length > 0) {
        const brandNamesList: BrandName[] = aiRes.names.map((n: any, idx: number) => ({
          id: n.id || `name_${Date.now()}_${idx + 1}`,
          name: n.name,
          meaning: n.meaning || '',
          tagline: n.tagline || '',
          domainAvailability: n.domains || {
            com: true,
            io: true,
            co: true,
            handle: { twitter: true, instagram: true },
          },
          visualDirection: {
            palette: n.palette || [
              { hex: '#0F172A', name: 'Midnight', role: 'primary' },
              { hex: '#2563EB', name: 'Cobalt', role: 'secondary' },
              { hex: '#38BDF8', name: 'Sky', role: 'accent' },
              { hex: '#F8FAFC', name: 'Clean White', role: 'background' },
              { hex: '#1E293B', name: 'Dark Ink', role: 'text' },
            ],
            fonts: n.fonts || { headline: 'Outfit', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
            styleDescription: 'Clean modernist geometry with elevated typography.',
          },
        }));
        set({
          brandNames: brandNamesList,
          selectedName: brandNamesList[0],
          hasConfirmedIndustry: true,
          hasConfirmedName: true,
          step: Math.max(get().step, 2) as any,
        });
      }

      // REFINEMENT PATH: once the identity is complete or active
      if (get().hasConfirmedLogo && detectedIntent === 'refine' && brief?.tone) {
        const refinementTone = (brief.tone as BrandTone) || get().input.tone;
        set({
          input: { ...get().input, tone: refinementTone },
          isChatTyping: false,
        });

        const botMsg: ChatMessage = {
          id: 'msg_bot_refine_' + Date.now(),
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions,
        };

        set((state) => ({ chatMessages: [...state.chatMessages, botMsg] }));
        return;
      }

      // NEW BRAND / VENTURE PATH
      if ((detectedIntent === 'new_brand' || (brief && brief.industry)) && brief?.industry) {
        const detectedTheme = brief.industry;
        const detectedTone: BrandTone = (brief.tone as BrandTone) || 'bold';
        const detectedAudience = brief.targetAudience || 'Modern discerning consumers';
        const detectedMission = brief.mission || `Building an unforgettable identity for ${detectedTheme}.`;

        const candidateInput: Partial<BrandInput> = {
          industry: detectedTheme,
          tone: detectedTone,
          targetAudience: detectedAudience,
          mission: detectedMission,
          constraints: 'Modern, memorable, high phonetic appeal',
        };

        // Explicit brand name fast path
        if (brief.businessName) {
          const cleanName = brief.businessName;
          const previewTagline =
            getTaglinesForBrand(cleanName, detectedTheme)[0]?.tagline ?? 'Tagline pending.';

          const brandObj: BrandName = {
            id: 'custom_' + Date.now(),
            name: cleanName,
            meaning: 'Specified by you.',
            tagline: previewTagline,
            domainAvailability: {
              com: true,
              io: true,
              co: true,
              handle: { twitter: true, instagram: true },
            },
            visualDirection: {
              palette: [
                { hex: '#0F172A', name: 'Midnight Slate', role: 'primary' },
                { hex: '#2563EB', name: 'Cobalt Pulse', role: 'secondary' },
                { hex: '#38BDF8', name: 'Sky Breeze', role: 'accent' },
                { hex: '#F8FAFC', name: 'Clean White', role: 'background' },
                { hex: '#1E293B', name: 'Dark Ink', role: 'text' },
              ],
              fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
              styleDescription: 'Clean modernist geometry with elevated human warmth.',
            },
          };

          const names = getNamesForConcept(detectedTheme);

          set({
            input: { ...get().input, ...candidateInput, businessName: cleanName },
            hasConfirmedIndustry: true,
            hasConfirmedName: true,
            hasConfirmedTagline: false,
            hasConfirmedPalette: false,
            hasConfirmedLogo: false,
            isNameModalOpen: false,
            isTaglineModalOpen: false,
            isPaletteModalOpen: false,
            isLogoModalOpen: false,
            selectedName: brandObj,
            brandNames: [brandObj, ...names.slice(0, 4)],
            step: 3,
            isChatTyping: false,
          });
        } else {
          // No explicit name: populate naming candidates
          let names = getNamesForConcept(detectedTheme);

          set({
            input: { ...get().input, ...candidateInput },
            hasConfirmedIndustry: true,
            hasConfirmedName: false,
            hasConfirmedTagline: false,
            hasConfirmedPalette: false,
            hasConfirmedLogo: false,
            isNameModalOpen: false,
            isTaglineModalOpen: false,
            isPaletteModalOpen: false,
            isLogoModalOpen: false,
            brandNames: names,
            selectedName: names[0],
            step: 2,
            isChatTyping: false,
          });

          // Asynchronously fetch live Groq generated names using GPT OSS 120B to enrich the list
          brandApi
            .generate({
              input: {
                industry: detectedTheme,
                tone: detectedTone,
                targetAudience: detectedAudience,
                mission: detectedMission,
                constraints: candidateInput.constraints || '',
              },
              count: 10,
            })
            .then((res) => {
              if (res.names && res.names.length > 0) {
                set({ brandNames: res.names, selectedName: res.names[0] });
              }
            })
            .catch((e) => console.warn('Groq names background fetch error:', e));
        }

        const botMsg: ChatMessage = {
          id: 'msg_bot_' + Date.now(),
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions,
          actionOptions: [
            {
              id: 'opt_auto_pilot',
              label: 'Complete the remaining steps',
              actionType: 'run_auto_pipeline',
            },
          ],
        };

        set((state) => ({
          chatMessages: [...state.chatMessages, botMsg],
        }));
        return;
      }

      // Conversational turn (Greeting, advice, question)
      const botMsg: ChatMessage = {
        id: 'msg_bot_' + Date.now(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions,
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, botMsg],
        isChatTyping: false,
      }));
    } catch (err: any) {
      console.error('[BrandStore] Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: 'msg_bot_err_' + Date.now(),
        sender: 'assistant',
        text: `I had trouble connecting to the AI director (${err?.message || 'Network error'}). Please try again!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Try again', 'Start over'],
      };
      set((state) => ({
        chatMessages: [...state.chatMessages, fallbackMsg],
        isChatTyping: false,
      }));
    }
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

  // Clears the session but stays inside the studio, so "Reset" means "start a
  // fresh brand" instead of throwing the user back to the marketing page.
  reset: () => {
    set({
      viewMode: 'studio',
      chatMessages: INITIAL_CHAT_MESSAGES,
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
      isAutoPilot: false,
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
      logoImageByStyle: {},
      selectedLogo: null,
    });
  },
}));
