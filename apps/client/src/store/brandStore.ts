import { create } from 'zustand';
import type { BrandInput, BrandName, LogoConcept } from '@upstream/shared';
import { MOCK_BRAND_NAMES, PREBUILT_THEMES, INITIAL_CHAT_MESSAGES } from '../mock/mockData';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

interface BrandStore {
  // Navigation & Flow
  step: 1 | 2 | 3 | 4;
  setStep: (step: 1 | 2 | 3 | 4) => void;

  // Input state
  input: BrandInput;
  setInput: (input: Partial<BrandInput>) => void;
  selectedThemeId: string | null;
  selectTheme: (themeId: string) => void;

  // Brand Names
  projectId: string;
  brandNames: BrandName[];
  selectedName: BrandName | null;
  favorites: string[];
  searchQuery: string;
  filterTone: string;
  filterOnlyAvailable: boolean;

  setBrandNames: (names: BrandName[]) => void;
  selectName: (name: BrandName) => void;
  toggleFavorite: (nameId: string) => void;
  setSearchQuery: (query: string) => void;
  setFilterTone: (tone: string) => void;
  setFilterOnlyAvailable: (val: boolean) => void;

  // Logo Concepts
  logoConcepts: LogoConcept[];
  selectedLogo: LogoConcept | null;
  setLogoConcepts: (logos: LogoConcept[]) => void;
  selectLogo: (logo: LogoConcept) => void;

  // Loading & Generation States
  isLoadingNames: boolean;
  isLoadingLogos: boolean;
  logoGenStage: number; // 0 to 4 for animated progress
  setLoadingNames: (loading: boolean) => void;
  setLoadingLogos: (loading: boolean) => void;
  setLogoGenStage: (stage: number) => void;

  // Left Sidebar & Chat
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeSidebarTab: 'chat' | 'assets';
  setActiveSidebarTab: (tab: 'chat' | 'assets') => void;
  chatMessages: ChatMessage[];
  isChatTyping: boolean;
  sendChatMessage: (text: string) => void;

  // Utility Actions
  regenerateNames: () => void;
  reset: () => void;
}

const defaultInput: BrandInput = {
  businessName: '',
  industry: 'Sustainable Streetwear & Sneaker Fashion',
  targetAudience: 'Eco-conscious Gen Z & urban creators aged 18-32',
  mission: 'Pioneering limited-run apparel and footwear using recycled ocean polymers and architectural silhouettes.',
  tone: 'bold',
  constraints: 'Modern, under 10 letters, high-impact branding, avoid cliché green eco words',
};

export const useBrandStore = create<BrandStore>((set, get) => ({
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
      });
    }
  },

  projectId: 'proj_upstream_' + Date.now().toString(36),
  brandNames: MOCK_BRAND_NAMES,
  selectedName: MOCK_BRAND_NAMES[0],
  favorites: ['brand_01'],
  searchQuery: '',
  filterTone: 'all',
  filterOnlyAvailable: false,

  setBrandNames: (names) => set({ brandNames: names }),
  selectName: (name) => set({ selectedName: name }),
  toggleFavorite: (nameId) =>
    set((state) => ({
      favorites: state.favorites.includes(nameId)
        ? state.favorites.filter((id) => id !== nameId)
        : [...state.favorites, nameId],
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterTone: (tone) => set({ filterTone: tone }),
  setFilterOnlyAvailable: (val) => set({ filterOnlyAvailable: val }),

  logoConcepts: [],
  selectedLogo: null,
  setLogoConcepts: (logos) => set({ logoConcepts: logos }),
  selectLogo: (logo) => set({ selectedLogo: logo }),

  isLoadingNames: false,
  isLoadingLogos: false,
  logoGenStage: 0,
  setLoadingNames: (loading) => set({ isLoadingNames: loading }),
  setLoadingLogos: (loading) => set({ isLoadingLogos: loading }),
  setLogoGenStage: (stage) => set({ logoGenStage: stage }),

  isSidebarOpen: false,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  activeSidebarTab: 'chat',
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
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

    // Realistic AI brand consultant response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      let suggestions: string[] = [];

      if (lower.includes('tagline') || lower.includes('slogan')) {
        reply = `Here are 3 punchy taglines tailored for your ${get().input.industry} concept:\n\n1. "Wear the Motion."\n2. "Sculpted for the Streets."\n3. "Next-Gen Form, Zero Waste."\n\nWould you like me to pair these with your current selected name (${get().selectedName?.name || 'Kinetics'})?`;
        suggestions = ['Apply tagline to current name', 'Generate 3 more minimalist taglines', 'Suggest matching color accents'];
      } else if (lower.includes('color') || lower.includes('palette')) {
        reply = `For a ${get().input.tone} vibe in ${get().input.industry}, I recommend this high-contrast palette:\n\n• Primary: #7C3AED (Electric Violet)\n• Secondary: #1E1B4B (Midnight Navy)\n• Accent: #FB7185 (Neon Coral)\n• Background: #F8F6FE (Lilac Fog)\n• Text: #0F172A (Pitch Ink)\n\nThis gives immense premium presence without feeling dated.`;
        suggestions = ['Apply this palette to my brand', 'Show warm earth tone alternative', 'Explain typography pairings'];
      } else if (lower.includes('name') || lower.includes('boutique') || lower.includes('ideas')) {
        reply = `Exploring creative names for your ${get().input.industry} venture:\n\n• **Vanguardist** (Bold & architectural)\n• **Solstice Atelier** (Refined, radiant, luxurious)\n• **Cortex** (Tech-forward and swift)\n• **Aethel** (Ancient Nordic for noble)\n\nYou can click on any generated card in the studio to preview full visual identity guides!`;
        suggestions = ['Add these to my brand names grid', 'Check .com domain status', 'Switch to luxury boutique theme'];
      } else {
        reply = `I've analyzed your brand notes for "${get().input.industry}". Your positioning targets ${get().input.targetAudience} with a ${get().input.tone} tone. The current brand name "${get().selectedName?.name || 'Kinetics'}" scores 98% on memorability and has verified .com domain availability!`;
        suggestions = ['Generate logo concepts for this name', 'Tune tone to minimalist', 'Export current brand one-pager'];
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
    }, 900);
  },

  regenerateNames: () => {
    set({ isLoadingNames: true });
    setTimeout(() => {
      // Shuffle and slightly vary names
      const shuffled = [...MOCK_BRAND_NAMES].sort(() => 0.5 - Math.random());
      set({
        brandNames: shuffled,
        selectedName: shuffled[0],
        isLoadingNames: false,
      });
    }, 1200);
  },

  reset: () => {
    set({
      step: 1,
      input: defaultInput,
      selectedThemeId: 'clothes-shoes',
      brandNames: MOCK_BRAND_NAMES,
      selectedName: MOCK_BRAND_NAMES[0],
      logoConcepts: [],
      selectedLogo: null,
      logoGenStage: 0,
      searchQuery: '',
      filterTone: 'all',
      filterOnlyAvailable: false,
    });
  },
}));
