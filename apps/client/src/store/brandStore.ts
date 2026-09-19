import { create } from 'zustand';
import type { BrandInput, BrandName, LogoConcept, LogoStyle } from '@upstream/shared';
import { MOCK_BRAND_NAMES, PREBUILT_THEMES, INITIAL_CHAT_MESSAGES } from '../mock/mockData';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
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

  // Multi-step progression inside studio (1: Input -> 2: 5 Names -> 3: Palette & Visual Guide -> 4: 5 Logos -> 5: Download As)
  step: 1 | 2 | 3 | 4 | 5;
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void;

  // Input state
  input: BrandInput;
  setInput: (input: Partial<BrandInput>) => void;
  selectedThemeId: string | null;
  selectTheme: (themeId: string) => void;

  // Brand Names (top 5 curated)
  projectId: string;
  brandNames: BrandName[];
  selectedName: BrandName;
  favorites: string[];
  searchQuery: string;

  setBrandNames: (names: BrandName[]) => void;
  selectName: (name: BrandName) => void;
  toggleFavorite: (nameId: string) => void;
  setSearchQuery: (query: string) => void;

  // Selected Color Palette in Step 3
  activePaletteIdx: number;
  setActivePaletteIdx: (idx: number) => void;

  // 5 Logo Concepts
  selectedLogoStyle: LogoStyle;
  setSelectedLogoStyle: (style: LogoStyle) => void;
  selectedLogo: LogoConcept | null;
  selectLogo: (logo: LogoConcept) => void;

  // Loading states
  isLoadingNames: boolean;
  isLoadingLogos: boolean;
  setLoadingNames: (loading: boolean) => void;
  setLoadingLogos: (loading: boolean) => void;

  // Project Sessions History (for left rail)
  sessions: ProjectSession[];
  activeSessionId: string;
  createNewProject: () => void;
  loadSession: (sessionId: string) => void;

  // Left Chat Pane inside Studio
  chatMessages: ChatMessage[];
  isChatTyping: boolean;
  sendChatMessage: (text: string) => void;

  // Quick actions
  startIdentityCreation: () => void;
  regenerateNames: () => void;
  reset: () => void;
}

const defaultInput: BrandInput = {
  businessName: '',
  industry: 'Streetwear & Sneaker Apparel',
  targetAudience: 'Gen Z and urban creators aged 18-32',
  mission: 'Crafting limited-run apparel and sneakers merging architectural silhouettes with sustainable comfort.',
  tone: 'bold',
  constraints: 'Modern, under 9 letters, high-impact branding, punchy and memorable',
};

// 5 Curated Brand Names
const FIVE_CURATED_NAMES: BrandName[] = MOCK_BRAND_NAMES.slice(0, 5);

export const useBrandStore = create<BrandStore>((set, get) => ({
  viewMode: 'landing',
  setViewMode: (mode) => set({ viewMode: mode }),

  step: 1,
  setStep: (step) => set({ step }),

  input: defaultInput,
  setInput: (newInput) =>
    set((state) => ({ input: { ...state.input, ...newInput } })),

  selectedThemeId: 'clothes-shoes',
  selectTheme: (themeId: string) => {
    const theme = PREBUILT_THEMES.find((t) => t.id === themeId);
    if (theme) {
      set({
        selectedThemeId: themeId,
        input: { ...theme.defaultInput },
        viewMode: 'studio',
        step: 1,
      });
    }
  },

  projectId: 'proj_upstream_' + Date.now().toString(36),
  brandNames: FIVE_CURATED_NAMES,
  selectedName: FIVE_CURATED_NAMES[0],
  favorites: ['brand_01'],
  searchQuery: '',

  setBrandNames: (names) => set({ brandNames: names }),
  selectName: (name) => set({ selectedName: name }),
  toggleFavorite: (nameId) =>
    set((state) => ({
      favorites: state.favorites.includes(nameId)
        ? state.favorites.filter((id) => id !== nameId)
        : [...state.favorites, nameId],
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),

  activePaletteIdx: 0,
  setActivePaletteIdx: (idx) => set({ activePaletteIdx: idx }),

  selectedLogoStyle: 'minimal',
  setSelectedLogoStyle: (style) => set({ selectedLogoStyle: style }),
  selectedLogo: null,
  selectLogo: (logo) => set({ selectedLogo: logo }),

  isLoadingNames: false,
  isLoadingLogos: false,
  setLoadingNames: (loading) => set({ isLoadingNames: loading }),
  setLoadingLogos: (loading) => set({ isLoadingLogos: loading }),

  sessions: [
    { id: 's1', title: 'Kinetics Footwear', industry: 'Streetwear & Kicks', timestamp: 'Today', activeBrandName: 'Kinetics' },
    { id: 's2', title: 'Aurae Atelier', industry: 'Haute Couture', timestamp: 'Yesterday', activeBrandName: 'Aurae' },
    { id: 's3', title: 'Synapse Engine', industry: 'Cloud AI Platform', timestamp: '3 days ago', activeBrandName: 'Synapse' },
  ],
  activeSessionId: 's1',

  createNewProject: () => {
    const newId = 's_' + Date.now();
    const newSession: ProjectSession = {
      id: newId,
      title: 'New Brand Project',
      industry: 'Custom Idea',
      timestamp: 'Just now',
    };
    set((state) => ({
      sessions: [newSession, ...state.sessions],
      activeSessionId: newId,
      viewMode: 'studio',
      step: 1,
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

      if (lower.includes('name') || lower.includes('ideas') || lower.includes('brand')) {
        reply = `I've analyzed your concept for ${get().input.industry}. The 5 curated names currently generated on the right pane are:\n\n1. **Kinetics** (Streetwear & dynamic motion)\n2. **Aurae** (Quiet European luxury)\n3. **Synapse** (Intelligent connectivity)\n4. **Verdura** (Botanical purity)\n5. **Voltaic** (High-voltage bold energy)\n\nClick any card on the right to select it, or ask me to tweak the tone!`;
        suggestions = ['Move to Color Palette step', 'Make names more playful', 'Check .com availability'];
      } else if (lower.includes('color') || lower.includes('palette')) {
        reply = `For your brand tone (${get().input.tone}), here is our harmonized 5-color palette:\n\n• Primary: #7C3AED (Electric Violet)\n• Secondary: #1E1B4B (Midnight Navy)\n• Accent: #FB7185 (Neon Coral)\n• Background: #F8F6FE (Lilac Fog)\n• Text: #0F172A (Pitch Ink)\n\nI've updated the palette recommendations on Step 3 for you.`;
        suggestions = ['Go to Visual Guide step', 'Suggest earthy warm tones', 'Generate matching logos'];
      } else if (lower.includes('logo') || lower.includes('sketch')) {
        reply = `I can synthesize 5 vector logo styles for "${get().selectedName.name}":\n\n• Minimalist Continuous-Line Glyph\n• Modern Architectural Wordmark\n• Abstract Dynamic Prism\n• Geometric Golden-Ratio Crest\n• Illustrative Organic Badge\n\nClick over to Step 4 on the right to watch the live generation!`;
        suggestions = ['Take me to Logo Studio', 'View dark mode mockups', 'Export PDF Brand Card'];
      } else {
        reply = `Great direction! I've noted: "${text}". I can adapt your brand parameters, recommend taglines, or adjust visual palettes right now.`;
        suggestions = ['Show 5 curated names', 'Preview color palette', 'Build logo concepts'];
      }

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
    }, 850);
  },

  startIdentityCreation: () => {
    set({
      viewMode: 'studio',
      step: 1,
    });
  },

  regenerateNames: () => {
    set({ isLoadingNames: true });
    setTimeout(() => {
      const shuffled = [...MOCK_BRAND_NAMES].sort(() => 0.5 - Math.random()).slice(0, 5);
      set({
        brandNames: shuffled,
        selectedName: shuffled[0],
        isLoadingNames: false,
      });
    }, 1100);
  },

  reset: () => {
    set({
      viewMode: 'landing',
      step: 1,
      input: defaultInput,
      brandNames: FIVE_CURATED_NAMES,
      selectedName: FIVE_CURATED_NAMES[0],
      selectedLogoStyle: 'minimal',
    });
  },
}));
