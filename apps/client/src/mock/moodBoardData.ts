export interface MoodBoardItem {
  id: string;
  title: string;
  category: 'packaging' | 'texture' | 'architecture' | 'typography' | 'lifestyle';
  imageUrl: string;
  dominantHex: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
  description: string;
  photographer: string;
}

export interface IndustryMoodBoard {
  industry: string;
  aestheticName: string;
  tagline: string;
  items: MoodBoardItem[];
}

export const MOODBOARD_DATABASE: Record<string, IndustryMoodBoard> = {
  coffee: {
    industry: 'Specialty Coffee',
    aestheticName: 'Wabi-Sabi Ceramics & Roasted Crema',
    tagline: 'Tactile stoneware, artisanal espresso crema, and warm unbleached kraft paper',
    items: [
      {
        id: 'c1',
        title: 'Tactile Ceramic Espresso Cup',
        category: 'packaging',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#D97706',
        aspectRatio: 'portrait',
        description: 'Matte earthenware with hand-thrown tactile rim',
        photographer: 'Nathan Dumlao',
      },
      {
        id: 'c2',
        title: 'Micro-Roastery Concrete Interior',
        category: 'architecture',
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#451A03',
        aspectRatio: 'landscape',
        description: 'Poured concrete counters with brushed brass fixtures',
        photographer: 'Demi DeHerrera',
      },
      {
        id: 'c3',
        title: 'Single-Origin Coffee Cherries',
        category: 'lifestyle',
        imageUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#9E2A2B',
        aspectRatio: 'square',
        description: 'High-elevation volcanic soil terroir harvest',
        photographer: 'Battlecreek Coffee',
      },
      {
        id: 'c4',
        title: 'Minimalist Foil-Stamped Pouch',
        category: 'packaging',
        imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#FDE68A',
        aspectRatio: 'portrait',
        description: 'Unbleached kraft paper with blind-debossed typography',
        photographer: 'Tabitha Turner',
      },
      {
        id: 'c5',
        title: 'Morning Light Pour-Over Ritual',
        category: 'lifestyle',
        imageUrl: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#7C3AED',
        aspectRatio: 'landscape',
        description: 'Hand-blown glass dripper with golden extraction',
        photographer: 'Karl Fredrickson',
      },
      {
        id: 'c6',
        title: 'Editorial Coffee Monograph',
        category: 'typography',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#1E1B4B',
        aspectRatio: 'portrait',
        description: 'Generous whitespace with proportional optical kerning',
        photographer: 'Thought Catalog',
      },
    ],
  },
  streetwear: {
    industry: 'Streetwear & Sneakers',
    aestheticName: 'Brutalist Concrete & Kinetic Neon',
    tagline: 'Raw architectural silhouettes, technical nylon, and high-contrast ultraviolet accents',
    items: [
      {
        id: 's1',
        title: 'Technical Sole Architecture',
        category: 'packaging',
        imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#7C3AED',
        aspectRatio: 'portrait',
        description: 'Segmented EVA foam tread with modular heel clip',
        photographer: 'Derick McKinney',
      },
      {
        id: 's2',
        title: 'Brutalist Tokyo Overpass',
        category: 'architecture',
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#0F172A',
        aspectRatio: 'landscape',
        description: 'Exposed aggregate concrete and neon signage reflections',
        photographer: 'Aleksandar Pasaric',
      },
      {
        id: 's3',
        title: 'Ripstop Nylon Texture',
        category: 'texture',
        imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#FB7185',
        aspectRatio: 'square',
        description: 'Reinforced cross-hatch water-repellent grid',
        photographer: 'Clark Street Mercantile',
      },
      {
        id: 's4',
        title: 'Cyberpunk Fluorescent Glow',
        category: 'lifestyle',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#6366F1',
        aspectRatio: 'portrait',
        description: 'Vibrant indigo and magenta twilight street light',
        photographer: 'Neon Talk',
      },
      {
        id: 's5',
        title: 'Modular Drop Box Unboxing',
        category: 'packaging',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#1E1B4B',
        aspectRatio: 'landscape',
        description: 'Magnetic closure rigid paperboard with screenprinted logo',
        photographer: 'Camille/Unsplash',
      },
    ],
  },
  tech: {
    industry: 'AI Cloud Platform',
    aestheticName: 'Dark Terminal & Cyan Glassmorphism',
    tagline: 'Deep space pitch ink, glowing circuit pathways, and precision developer optics',
    items: [
      {
        id: 't1',
        title: 'Prism Glass Reflection',
        category: 'texture',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#06B6D4',
        aspectRatio: 'landscape',
        description: 'Refracted cyan wave patterns on frosted optic lens',
        photographer: 'Milad Fakurian',
      },
      {
        id: 't2',
        title: 'Clean Minimalist Terminal',
        category: 'typography',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#6366F1',
        aspectRatio: 'portrait',
        description: 'Monospaced agent execution runtime with syntax highlights',
        photographer: 'Fotis Fotopoulos',
      },
      {
        id: 't3',
        title: 'Server Core Optical Fiber',
        category: 'architecture',
        imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#0B0F19',
        aspectRatio: 'square',
        description: 'High-throughput photonics in hyperscale datacenter',
        photographer: 'Lars Kienle',
      },
      {
        id: 't4',
        title: 'Geometric Wave Distortion',
        category: 'lifestyle',
        imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
        dominantHex: '#8B5CF6',
        aspectRatio: 'portrait',
        description: 'Algorithmic 3D procedural topological landscape',
        photographer: 'DeepMind',
      },
    ],
  },
};

export function getMoodBoardForIndustry(industryStr: string): IndustryMoodBoard {
  const query = (industryStr || '').toLowerCase();
  if (query.includes('coffee') || query.includes('cafe') || query.includes('roast') || query.includes('ceramiq')) {
    return MOODBOARD_DATABASE.coffee;
  }
  if (query.includes('streetwear') || query.includes('shoe') || query.includes('sneaker') || query.includes('apparel') || query.includes('cloth') || query.includes('kinetics')) {
    return MOODBOARD_DATABASE.streetwear;
  }
  if (query.includes('tech') || query.includes('ai') || query.includes('saas') || query.includes('cloud') || query.includes('software') || query.includes('nexa')) {
    return MOODBOARD_DATABASE.tech;
  }
  return MOODBOARD_DATABASE.coffee;
}
