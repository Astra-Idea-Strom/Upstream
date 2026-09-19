import type { BrandName, BrandTone, LogoConcept, ColorSwatch, FontPairing } from '@upstream/shared';

export interface PrebuiltTheme {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  gradient: string;
  iconName: string;
  defaultInput: {
    businessName: string;
    industry: string;
    targetAudience: string;
    mission: string;
    tone: BrandTone;
    constraints: string;
  };
  sampleKeywords: string[];
}

export const PREBUILT_THEMES: PrebuiltTheme[] = [
  {
    id: 'sustainable-productivity',
    title: 'Sustainable Productivity',
    category: 'Productivity & Remote Work',
    tagline: 'Mindful focus and calm systems for remote teams',
    description: 'Eco-conscious workflow sanctuary designed to eliminate digital burnout and align distributed teams.',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-emerald-500/20 via-teal-500/20 to-blue-500/20',
    iconName: 'Compass',
    defaultInput: {
      businessName: '',
      industry: 'Sustainable Productivity for Remote Teams',
      targetAudience: 'Distributed engineers, async founders, and remote workers aged 25-40',
      mission: 'Eliminating workplace burnout with calm, carbon-conscious asynchronous productivity tools that build sustainable team momentum.',
      tone: 'minimalist',
      constraints: 'Must feel trustworthy, modern eco-conscious vibe, short memorable names under 10 letters',
    },
    sampleKeywords: ['Watershed', 'Drift', 'Compass', 'Bloom', 'Evergreen'],
  },
  {
    id: 'specialty-coffee',
    title: 'Specialty Coffee & Roastery',
    category: 'Artisanal Food & Beverage',
    tagline: 'Artisanal single-origin roasting and tactile cafe rituals',
    description: 'Direct-trade beans, precision thermodynamics, and aesthetic stoneware ceramics.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-amber-600/20 via-orange-500/20 to-yellow-600/20',
    iconName: 'Coffee',
    defaultInput: {
      businessName: '',
      industry: 'Specialty Coffee & Micro Roastery',
      targetAudience: 'Third-wave coffee lovers, urban café goers, and ritualistic morning espresso drinkers',
      mission: 'Sourcing single-origin micro-lots directly from farmers to craft an elevated morning espresso ritual with uncompromising honesty.',
      tone: 'luxurious',
      constraints: 'Warm, artisanal, tactile, sounds premium and sensory, max 10 letters',
    },
    sampleKeywords: ['Ceramiq', 'Terroir', 'Crema', 'Veloce', 'Amber Mill'],
  },
  {
    id: 'clothes-shoes',
    title: 'Streetwear & Footwear',
    category: 'Fashion & Apparel',
    tagline: 'Bold urban fashion & contemporary kicks',
    description: 'High-energy, youth-centric streetwear brand with gritty, futuristic aesthetic and premium comfort.',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-purple-500/20 via-rose-500/20 to-amber-500/20',
    iconName: 'Shirt',
    defaultInput: {
      businessName: '',
      industry: 'Streetwear & Sneaker Apparel',
      targetAudience: 'Gen Z and millennial streetwear enthusiasts aged 18-32',
      mission: 'Crafting limited-drop apparel and sneakers that merge brutalist architectural silhouettes with effortless daily comfort.',
      tone: 'bold',
      constraints: 'Short names under 9 letters, high-energy, memorable on shoe tags, avoid generic sports words',
    },
    sampleKeywords: ['Kinetics', 'Vanguard', 'Threadvolt', 'Kicksync', 'BrutalStitch'],
  },
  {
    id: 'tech-saas',
    title: 'AI Software & Cloud Studio',
    category: 'Technology & SaaS',
    tagline: 'Next-generation intelligent cloud infrastructure',
    description: 'Autonomous agent frameworks, workflow acceleration, and high-performance computing.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-blue-500/20 via-indigo-500/20 to-cyan-400/20',
    iconName: 'Cpu',
    defaultInput: {
      businessName: '',
      industry: 'AI & Developer Cloud Infrastructure',
      targetAudience: 'Full-stack engineers, AI researchers, and fast-moving tech startups',
      mission: 'Democratizing multi-agent workflows and real-time generative intelligence through frictionless developer tools.',
      tone: 'tech-forward',
      constraints: 'Modern single-word name, memorable domain availability, sounds like Stripe or Vercel, max 8 letters',
    },
    sampleKeywords: ['Synapse', 'Nexus', 'HyperVector', 'Synthflow', 'ModalCore'],
  },
  {
    id: 'organic-botanicals',
    title: 'Botanicals & Clean Skincare',
    category: 'Wellness & Beauty',
    tagline: 'Plant-powered ritualistic skin health',
    description: 'Wildcrafted botanical oils, sustainable glass packaging, and dermatologically tested organic beauty.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-emerald-400/20 via-teal-300/20 to-violet-300/20',
    iconName: 'Flower2',
    defaultInput: {
      businessName: '',
      industry: 'Clean Organic Skincare & Botanicals',
      targetAudience: 'Conscious consumers seeking pure, botanical, cruelty-free morning and evening skin rituals',
      mission: 'Nourishing skin longevity with cold-pressed alpine extracts and regenerative, zero-waste formulation.',
      tone: 'minimalist',
      constraints: 'Earthy, calm, evokes morning dew and clean petals, soothing phonetics',
    },
    sampleKeywords: ['Verdura', 'Dewcraft', 'AlpinePetal', 'PureFlora', 'Herbaceous'],
  },
];

// ============================================================
// 1. SUSTAINABLE PRODUCTIVITY (Brief Flagship Demo - 12 Names)
// ============================================================
export const SUSTAINABLE_PRODUCTIVITY_NAMES: BrandName[] = [
  {
    id: 'sp_01',
    name: 'Watershed',
    category: 'evocative',
    meaning: 'The defining divide where disparate streams of communication converge into effortless clarity.',
    tagline: 'Clarity in every workflow.',
    domainAvailability: {
      com: true,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#2D6A4F', name: 'Sage Forest', role: 'primary' },
        { hex: '#1B4332', name: 'Deep Evergreen', role: 'secondary' },
        { hex: '#52B788', name: 'Sprout Mint', role: 'accent' },
        { hex: '#F7FBF8', name: 'Linen Mist', role: 'background' },
        { hex: '#081C15', name: 'Cedar Charcoal', role: 'text' },
      ],
      fonts: {
        headline: 'Inter',
        body: 'Merriweather',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Modern, calm and eco-conscious with deep forest greens, crisp organic whites, and editorial serif typography.',
    },
  },
  {
    id: 'sp_02',
    name: 'Drift',
    category: 'evocative',
    meaning: 'Effortless asynchronous momentum where tasks move naturally without friction or cognitive drag.',
    tagline: 'Effortless focus for remote teams.',
    domainAvailability: {
      com: false,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#0284C7', name: 'Pacific Slate', role: 'primary' },
        { hex: '#0EA5E9', name: 'Glacier Blue', role: 'secondary' },
        { hex: '#10B981', name: 'Alpine Moss', role: 'accent' },
        { hex: '#F8FAFC', name: 'Pure Frost', role: 'background' },
        { hex: '#0F172A', name: 'Deep Oceanic', role: 'text' },
      ],
      fonts: {
        headline: 'Plus Jakarta Sans',
        body: 'Inter',
        headlineWeight: '600',
        bodyWeight: '400',
      },
      styleDescription: 'Clean Scandinavian simplicity featuring fluid oceanic tones and high-legibility sans-serif hierarchies.',
    },
  },
  {
    id: 'sp_03',
    name: 'Compass',
    category: 'descriptive',
    meaning: 'A steady navigational instrument helping distributed team members align on true North priorities.',
    tagline: 'Navigate your day with intent.',
    domainAvailability: {
      com: true,
      io: false,
      co: true,
      handle: { twitter: true, instagram: false },
    },
    visualDirection: {
      palette: [
        { hex: '#1E3A8A', name: 'Deep Marine', role: 'primary' },
        { hex: '#3B82F6', name: 'Zenith Blue', role: 'secondary' },
        { hex: '#F59E0B', name: 'Brass Needle', role: 'accent' },
        { hex: '#FBFBFE', name: 'Parchment White', role: 'background' },
        { hex: '#172554', name: 'Night Sky', role: 'text' },
      ],
      fonts: {
        headline: 'Outfit',
        body: 'Inter',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Authoritative, trustworthy maritime instrumentation paired with warm golden focal points.',
    },
  },
  {
    id: 'sp_04',
    name: 'Bloom',
    category: 'evocative',
    meaning: 'Cultivating sustainable habits and team rhythms that blossom organically over time rather than withering from rush.',
    tagline: 'Where team momentum flourishes.',
    domainAvailability: {
      com: true,
      io: true,
      co: true,
      handle: { twitter: false, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#059669', name: 'Botanical Emerald', role: 'primary' },
        { hex: '#10B981', name: 'Clover Leaf', role: 'secondary' },
        { hex: '#F43F5E', name: 'Petal Coral', role: 'accent' },
        { hex: '#F0FDF4', name: 'Morning Dew', role: 'background' },
        { hex: '#064E3B', name: 'Evergreen Bark', role: 'text' },
      ],
      fonts: {
        headline: 'Playfair Display',
        body: 'Inter',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Warm, nurturing organic aesthetic blending vibrant botanical greens with subtle floral warm accents.',
    },
  },
  {
    id: 'sp_05',
    name: 'Evergreen',
    category: 'descriptive',
    meaning: 'Building institutional knowledge, documentation, and processes that stay fresh and resilient year-round.',
    tagline: 'Sustainable systems for modern work.',
    domainAvailability: {
      com: false,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#166534', name: 'Pine Canopy', role: 'primary' },
        { hex: '#22C55E', name: 'Lichen Moss', role: 'secondary' },
        { hex: '#EAB308', name: 'Sunlit Resin', role: 'accent' },
        { hex: '#FAFDF6', name: 'Clear Birch', role: 'background' },
        { hex: '#14532D', name: 'Forest Floor', role: 'text' },
      ],
      fonts: {
        headline: 'Plus Jakarta Sans',
        body: 'Merriweather',
        headlineWeight: '800',
        bodyWeight: '400',
      },
      styleDescription: 'Enduring outdoor minimalism evoking calm mountain pines and clean, unhurried focus.',
    },
  },
  {
    id: 'sp_06',
    name: 'Arbor',
    category: 'evocative',
    meaning: 'Deep root systems of thoughtful architecture supporting flexible, agile branches of daily execution.',
    tagline: 'Deep roots, agile branches.',
    domainAvailability: {
      com: true,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#78350F', name: 'Aged Teak', role: 'primary' },
        { hex: '#D97706', name: 'Raw Ochre', role: 'secondary' },
        { hex: '#15803D', name: 'Canopy Leaf', role: 'accent' },
        { hex: '#FFFBEB', name: 'Warm Cream', role: 'background' },
        { hex: '#451A03', name: 'Charred Oak', role: 'text' },
      ],
      fonts: {
        headline: 'Outfit',
        body: 'Inter',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Tactile architectural warmth celebrating natural timber textures and grounding organic tones.',
    },
  },
  {
    id: 'sp_07',
    name: 'Quietude',
    category: 'evocative',
    meaning: 'The profound cognitive silence necessary for breakthrough thinking, protected from ambient digital noise.',
    tagline: 'Calm productivity without notifications.',
    domainAvailability: {
      com: true,
      io: true,
      co: false,
      handle: { twitter: true, instagram: false },
    },
    visualDirection: {
      palette: [
        { hex: '#475569', name: 'Slate Sanctuary', role: 'primary' },
        { hex: '#94A3B8', name: 'Morning Mist', role: 'secondary' },
        { hex: '#6366F1', name: 'Lavender Pulse', role: 'accent' },
        { hex: '#F8FAFC', name: 'Clean Paper', role: 'background' },
        { hex: '#0F172A', name: 'Deep Ink', role: 'text' },
      ],
      fonts: {
        headline: 'Playfair Display',
        body: 'Inter',
        headlineWeight: '600',
        bodyWeight: '400',
      },
      styleDescription: 'Zen-like minimalist clarity prioritizing expansive whitespace and distraction-free visual balance.',
    },
  },
  {
    id: 'sp_08',
    name: 'Verdant',
    category: 'invented',
    meaning: 'A living, breathing operational cadence where teams produce high-impact work without depleting their life balance.',
    tagline: 'Fresh rhythm for distributed teams.',
    domainAvailability: {
      com: false,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#047857', name: 'Verdant Meadow', role: 'primary' },
        { hex: '#34D399', name: 'Fresh Fern', role: 'secondary' },
        { hex: '#F59E0B', name: 'Honey Nectar', role: 'accent' },
        { hex: '#F0FDF9', name: 'Pale Clover', role: 'background' },
        { hex: '#064E3B', name: 'Deep Pine', role: 'text' },
      ],
      fonts: {
        headline: 'Inter',
        body: 'Merriweather',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Restorative, fresh eco-modernism that brings outdoor natural vitality into digital software.',
    },
  },
  {
    id: 'sp_09',
    name: 'Syncline',
    category: 'compound',
    meaning: 'Geological formation where tectonic layers fold gently into a supportive basin without cracking under stress.',
    tagline: 'Structure that bends with your day.',
    domainAvailability: {
      com: true,
      io: false,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#334155', name: 'Basalt Grey', role: 'primary' },
        { hex: '#64748B', name: 'Strata Stone', role: 'secondary' },
        { hex: '#06B6D4', name: 'Spring Well', role: 'accent' },
        { hex: '#F1F5F9', name: 'Limestone', role: 'background' },
        { hex: '#020617', name: 'Midnight Obsidian', role: 'text' },
      ],
      fonts: {
        headline: 'Outfit',
        body: 'Inter',
        headlineWeight: '800',
        bodyWeight: '500',
      },
      styleDescription: 'Structural industrial calm celebrating geological permanence and flexible geometric layouts.',
    },
  },
  {
    id: 'sp_10',
    name: 'Calmpace',
    category: 'compound',
    meaning: 'Engineering sustainable velocity—moving fast through deliberate focus rather than chaotic speed.',
    tagline: 'High impact, zero burnout.',
    domainAvailability: {
      com: true,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#0D9488', name: 'Teal Oasis', role: 'primary' },
        { hex: '#14B8A6', name: 'Serene Wave', role: 'secondary' },
        { hex: '#FB923C', name: 'Warm Terracotta', role: 'accent' },
        { hex: '#F0FDFA', name: 'Sea Foam White', role: 'background' },
        { hex: '#134E4A', name: 'Abyssal Deep', role: 'text' },
      ],
      fonts: {
        headline: 'Plus Jakarta Sans',
        body: 'Inter',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Mindful workplace harmony with crisp oceanic cyan tones and warm restorative accents.',
    },
  },
  {
    id: 'sp_11',
    name: 'Solis',
    category: 'invented',
    meaning: 'Inspired by the sun as the ultimate circadian anchor, synchronizing distributed global team workflows.',
    tagline: 'Bright clarity for daily execution.',
    domainAvailability: {
      com: false,
      io: true,
      co: true,
      handle: { twitter: true, instagram: false },
    },
    visualDirection: {
      palette: [
        { hex: '#D97706', name: 'Solar Amber', role: 'primary' },
        { hex: '#F59E0B', name: 'Golden Zenith', role: 'secondary' },
        { hex: '#2563EB', name: 'Clear Sky', role: 'accent' },
        { hex: '#FFFDF7', name: 'Morning Glow', role: 'background' },
        { hex: '#451A03', name: 'Earth Umber', role: 'text' },
      ],
      fonts: {
        headline: 'Outfit',
        body: 'Inter',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Warm, optimistic morning energy engineered to inspire focused, confident task execution.',
    },
  },
  {
    id: 'sp_12',
    name: 'Kinship',
    category: 'descriptive',
    meaning: 'Reconnecting distributed colleagues through transparent context and psychological safety.',
    tagline: 'Unified work for asynchronous teams.',
    domainAvailability: {
      com: true,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#4338CA', name: 'Indigo Trust', role: 'primary' },
        { hex: '#6366F1', name: 'Soft Violet', role: 'secondary' },
        { hex: '#10B981', name: 'Organic Sprout', role: 'accent' },
        { hex: '#FAF9FF', name: 'Porcelain Tint', role: 'background' },
        { hex: '#1E1B4B', name: 'Midnight Heather', role: 'text' },
      ],
      fonts: {
        headline: 'Playfair Display',
        body: 'Merriweather',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Human-centered warmth and deep intellectual stability tailored for high-trust collaborative teams.',
    },
  },
];

// ============================================================
// 2. SPECIALTY COFFEE & ROASTERY (12 Names)
// ============================================================
export const COFFEE_BRAND_NAMES: BrandName[] = [
  {
    id: 'coffee_01',
    name: 'Ceramiq',
    category: 'invented',
    meaning: 'A sleek, contemporary play on ceramic craft, evoking earthy warmth and tactile espresso precision.',
    tagline: 'Warmth in every pour.',
    domainAvailability: {
      com: true,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#D97706', name: 'Terracotta Glaze', role: 'primary' },
        { hex: '#FDE68A', name: 'Warm Cream', role: 'secondary' },
        { hex: '#7C3AED', name: 'Artisan Purple', role: 'accent' },
        { hex: '#FDFBF7', name: 'Linen Paper', role: 'background' },
        { hex: '#451A03', name: 'Dark Roast', role: 'text' },
      ],
      fonts: {
        headline: 'Outfit',
        body: 'Merriweather',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Artisanal, cozy sophistication celebrating handmade texture and organic coffee rituals.',
    },
  },
  {
    id: 'coffee_02',
    name: 'Terroir',
    category: 'descriptive',
    meaning: 'Celebrating micro-lot single-origin beans, high-altitude soil, and transparent direct-trade terroir.',
    tagline: 'Crafted from origin to cup.',
    domainAvailability: {
      com: false,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#78350F', name: 'Raw Espresso', role: 'primary' },
        { hex: '#B45309', name: 'Amber Caramel', role: 'secondary' },
        { hex: '#10B981', name: 'Cherry Sprout', role: 'accent' },
        { hex: '#FEFBF6', name: 'Parchment', role: 'background' },
        { hex: '#29180C', name: 'Dark Bean', role: 'text' },
      ],
      fonts: {
        headline: 'Playfair Display',
        body: 'Inter',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Heritage roastery aesthetics with vintage stamp details and earthy organic tones.',
    },
  },
  {
    id: 'coffee_03',
    name: 'Crema',
    category: 'evocative',
    meaning: 'The golden crown of an extraction, denoting velvet mouthfeel, warmth, and daily morning luxury.',
    tagline: 'Pure ritual, daily poured.',
    domainAvailability: {
      com: true,
      io: false,
      co: true,
      handle: { twitter: true, instagram: false },
    },
    visualDirection: {
      palette: [
        { hex: '#92400E', name: 'Rich Crema', role: 'primary' },
        { hex: '#FCD34D', name: 'Morning Glow', role: 'secondary' },
        { hex: '#FB7185', name: 'Rose Hibiscus', role: 'accent' },
        { hex: '#FFFBEB', name: 'Warm Froth', role: 'background' },
        { hex: '#1C1917', name: 'Stoneware', role: 'text' },
      ],
      fonts: {
        headline: 'Plus Jakarta Sans',
        body: 'Inter',
        headlineWeight: '800',
        bodyWeight: '400',
      },
      styleDescription: 'Minimalist Scandinavian café atmosphere with bright warm lighting and soft tactile contrasts.',
    },
  },
  {
    id: 'coffee_04',
    name: 'Veloce',
    category: 'invented',
    meaning: 'Inspired by Italian espresso speed and precision thermodynamics, engineered for energetic modern mornings.',
    tagline: 'Roasted with relentless precision.',
    domainAvailability: {
      com: true,
      io: true,
      co: false,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#EA580C', name: 'Electric Ochre', role: 'primary' },
        { hex: '#3B82F6', name: 'Cold Brew Blue', role: 'secondary' },
        { hex: '#FACC15', name: 'Citrus Zest', role: 'accent' },
        { hex: '#F8FAFC', name: 'Clean Steam', role: 'background' },
        { hex: '#0F172A', name: 'Cast Iron', role: 'text' },
      ],
      fonts: {
        headline: 'Outfit',
        body: 'Inter',
        headlineWeight: '700',
        bodyWeight: '500',
      },
      styleDescription: 'High-energy contemporary espresso lab with industrial lines and vibrant accents.',
    },
  },
  {
    id: 'coffee_05',
    name: 'Amber Mill',
    category: 'compound',
    meaning: 'Echoing the gentle turning of heirloom stone mills and sunbaked parchment coffee cherries.',
    tagline: 'Awaken the subtle nuance.',
    domainAvailability: {
      com: true,
      io: true,
      co: true,
      handle: { twitter: false, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#854D0E', name: 'Sunlit Amber', role: 'primary' },
        { hex: '#EAB308', name: 'Golden Honey', role: 'secondary' },
        { hex: '#7C3AED', name: 'Electric Violet', role: 'accent' },
        { hex: '#FAFAF9', name: 'Natural Kraft', role: 'background' },
        { hex: '#1C1917', name: 'Roasted Bean', role: 'text' },
      ],
      fonts: {
        headline: 'Playfair Display',
        body: 'Merriweather',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Warm, thoughtful craftsmanship that sits gracefully on boutique kraft bags and ceramic mugs.',
    },
  },
  {
    id: 'coffee_06',
    name: 'Roastcraft',
    category: 'compound',
    meaning: 'A deliberate fusion of roasting alchemy, thermodynamic curves, and tactile sensory evaluation.',
    tagline: 'The art and science of roast.',
    domainAvailability: { com: true, io: false, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#451A03', name: 'Espresso Core', role: 'primary' },
        { hex: '#B45309', name: 'Raw Bourbon', role: 'secondary' },
        { hex: '#F59E0B', name: 'Toasted Grain', role: 'accent' },
        { hex: '#FFFDF9', name: 'Filter Paper', role: 'background' },
        { hex: '#1C1917', name: 'Iron Roaster', role: 'text' },
      ],
      fonts: { headline: 'Plus Jakarta Sans', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Industrial artisanal roastery with warm wooden counters and copper machine fittings.',
    },
  },
  {
    id: 'coffee_07',
    name: 'Beanflow',
    category: 'playful',
    meaning: 'Smooth hydraulic water flow and unbroken morning workflow through deliberate caffeine extraction.',
    tagline: 'Fluid momentum, roasted daily.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#C2410C', name: 'Ochre Drop', role: 'primary' },
        { hex: '#FB923C', name: 'Warm Apricot', role: 'secondary' },
        { hex: '#0284C7', name: 'Pure Water', role: 'accent' },
        { hex: '#F8FAFC', name: 'Clean Tile', role: 'background' },
        { hex: '#0F172A', name: 'Slate Mug', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '800', bodyWeight: '400' },
      styleDescription: 'Modern, cheerful specialty coffee brand with clean graphic symbols and bold packaging.',
    },
  },
  {
    id: 'coffee_08',
    name: 'Slowpour',
    category: 'descriptive',
    meaning: 'Honoring deliberate hand-pour rituals and patient concentric bloom cycles.',
    tagline: 'Good things brewed slow.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: false, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#57534E', name: 'Dripper Stone', role: 'primary' },
        { hex: '#A8A29E', name: 'Fine Steam', role: 'secondary' },
        { hex: '#D97706', name: 'Golden Bloom', role: 'accent' },
        { hex: '#FAF5F0', name: 'Unbleached Paper', role: 'background' },
        { hex: '#1C1917', name: 'Kettle Black', role: 'text' },
      ],
      fonts: { headline: 'Playfair Display', body: 'Inter', headlineWeight: '600', bodyWeight: '400' },
      styleDescription: 'Japanese kissaten minimalism celebrating stillness, handcrafted ceramics, and steam.',
    },
  },
  {
    id: 'coffee_09',
    name: 'BaristaQ',
    category: 'invented',
    meaning: 'High-IQ coffee formulation combining micro-batch roasting curves with barista mastery.',
    tagline: 'Intelligence brewed into every cup.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: true, instagram: false } },
    visualDirection: {
      palette: [
        { hex: '#1E293B', name: 'Lab Obsidian', role: 'primary' },
        { hex: '#64748B', name: 'Tamping Steel', role: 'secondary' },
        { hex: '#F59E0B', name: 'Caramel Crown', role: 'accent' },
        { hex: '#FFFFFF', name: 'Clean White', role: 'background' },
        { hex: '#020617', name: 'Portafilter', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '700', bodyWeight: '500' },
      styleDescription: 'Sleek modernist coffee bar with laboratory precision and monochrome elegance.',
    },
  },
  {
    id: 'coffee_10',
    name: 'Altitude',
    category: 'evocative',
    meaning: 'High-elevation volcanic crops grown 2,000 meters above sea level for dense, floral bean complexity.',
    tagline: 'Grown above the clouds.',
    domainAvailability: { com: true, io: true, co: false, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#1E3A8A', name: 'Alpine Sky', role: 'primary' },
        { hex: '#93C5FD', name: 'Cloud Mist', role: 'secondary' },
        { hex: '#B45309', name: 'Highlands Clay', role: 'accent' },
        { hex: '#F0F9FF', name: 'Glacial Clear', role: 'background' },
        { hex: '#082F49', name: 'Volcanic Basalt', role: 'text' },
      ],
      fonts: { headline: 'Inter', body: 'Merriweather', headlineWeight: '800', bodyWeight: '400' },
      styleDescription: 'Expansive alpine grandeur evoking clean mountain wind and transparent single-origin lots.',
    },
  },
  {
    id: 'coffee_11',
    name: 'CremaLab',
    category: 'compound',
    meaning: 'An experimental test kitchen dedicated to micro-fermentation, yeast processing, and roast curves.',
    tagline: 'Sensory discovery in every batch.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#7C2D12', name: 'Roasted Cacao', role: 'primary' },
        { hex: '#EA580C', name: 'Flame Burner', role: 'secondary' },
        { hex: '#FBBF24', name: 'Golden Honey', role: 'accent' },
        { hex: '#FEFCE8', name: 'Butter Foam', role: 'background' },
        { hex: '#18181B', name: 'Graphite Tool', role: 'text' },
      ],
      fonts: { headline: 'Plus Jakarta Sans', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Warm culinary laboratory blending scientific precision with indulgent dessert coffee nuances.',
    },
  },
  {
    id: 'coffee_12',
    name: 'NordicCup',
    category: 'descriptive',
    meaning: 'Light-roast Scandinavian philosophy that lets the natural tea-like florals of the fruit shine.',
    tagline: 'Light roast. Infinite nuance.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: false, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#0F766E', name: 'Nordic Pine', role: 'primary' },
        { hex: '#2DD4BF', name: 'Fjord Water', role: 'secondary' },
        { hex: '#F59E0B', name: 'Sunken Amber', role: 'accent' },
        { hex: '#F8FAFC', name: 'Pale Wood', role: 'background' },
        { hex: '#042F2E', name: 'Deep Evergreen', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '600', bodyWeight: '400' },
      styleDescription: 'Serene Copenhagen roastery aesthetic with blonde birch wood and airy light roast clarity.',
    },
  },
];

// ============================================================
// 3. STREETWEAR & FOOTWEAR (12 Names)
// ============================================================
export const STREETWEAR_BRAND_NAMES: BrandName[] = [
  {
    id: 'sw_01',
    name: 'Kinetics',
    category: 'evocative',
    meaning: 'Continuous energetic momentum; streetwear engineered for rapid velocity and brutalist silhouettes.',
    tagline: 'Unstoppable momentum in every stride.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#09090B', name: 'Pitch Black', role: 'primary' },
        { hex: '#F43F5E', name: 'Neon Crimson', role: 'secondary' },
        { hex: '#71717A', name: 'Asphalt Dust', role: 'accent' },
        { hex: '#FAFAFA', name: 'Raw Chalk', role: 'background' },
        { hex: '#000000', name: 'True Void', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '900', bodyWeight: '500' },
      styleDescription: 'Aggressive street athletic posture with stark monochrome contrasts and hazard red alerts.',
    },
  },
  {
    id: 'sw_02',
    name: 'Vanguard',
    category: 'descriptive',
    meaning: 'The frontline of contemporary apparel culture, anticipating the next decade of garment engineering.',
    tagline: 'Always ahead of the drop.',
    domainAvailability: { com: true, io: false, co: true, handle: { twitter: true, instagram: false } },
    visualDirection: {
      palette: [
        { hex: '#7C3AED', name: 'Cyber Violet', role: 'primary' },
        { hex: '#C084FC', name: 'Static Orchid', role: 'secondary' },
        { hex: '#22C55E', name: 'Signal Lime', role: 'accent' },
        { hex: '#0F172A', name: 'Night Grid', role: 'background' },
        { hex: '#F8FAFC', name: 'White Ink', role: 'text' },
      ],
      fonts: { headline: 'Plus Jakarta Sans', body: 'Inter', headlineWeight: '800', bodyWeight: '400' },
      styleDescription: 'Futuristic Tokyo runway techwear with high-visibility accents and architectural cutouts.',
    },
  },
  {
    id: 'sw_03',
    name: 'Threadvolt',
    category: 'compound',
    meaning: 'Electrified textile manufacturing that charges basic apparel with dynamic energy.',
    tagline: 'High-voltage daily streetwear.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#EAB308', name: 'Voltage Yellow', role: 'primary' },
        { hex: '#CA8A04', name: 'Industrial Zinc', role: 'secondary' },
        { hex: '#3B82F6', name: 'Arc Blue', role: 'accent' },
        { hex: '#18181B', name: 'Rubber Soling', role: 'background' },
        { hex: '#FFFFFF', name: 'Clean Neon', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '800', bodyWeight: '500' },
      styleDescription: 'Industrial workwear meets high-impact sneakerhead culture with caution tape motifs.',
    },
  },
  {
    id: 'sw_04',
    name: 'Kicksync',
    category: 'compound',
    meaning: 'Connecting footwear ergonomics with urban street culture in seamless synchronization.',
    tagline: 'Synchronize your street step.',
    domainAvailability: { com: true, io: true, co: false, handle: { twitter: false, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#DC2626', name: 'Track Red', role: 'primary' },
        { hex: '#1E293B', name: 'Carbon Fiber', role: 'secondary' },
        { hex: '#94A3B8', name: 'Reflective 3M', role: 'accent' },
        { hex: '#F8FAFC', name: 'Concrete Grey', role: 'background' },
        { hex: '#020617', name: 'Matte Tire', role: 'text' },
      ],
      fonts: { headline: 'Inter', body: 'Inter', headlineWeight: '900', bodyWeight: '400' },
      styleDescription: 'Athletic precision design with aerodynamic lines, 3M reflective cues, and race day spirit.',
    },
  },
  {
    id: 'sw_05',
    name: 'BrutalStitch',
    category: 'descriptive',
    meaning: 'Exposing heavy structural seamwork inspired by brutalist architecture and raw industrial textiles.',
    tagline: 'Raw seams. Uncompromising weight.',
    domainAvailability: { com: true, io: false, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#27272A', name: 'Heavy Canvas', role: 'primary' },
        { hex: '#71717A', name: 'Washed Denim', role: 'secondary' },
        { hex: '#F59E0B', name: 'Copper Rivet', role: 'accent' },
        { hex: '#F4F4F5', name: 'Raw Calico', role: 'background' },
        { hex: '#18181B', name: 'Thread Core', role: 'text' },
      ],
      fonts: { headline: 'Plus Jakarta Sans', body: 'Merriweather', headlineWeight: '800', bodyWeight: '400' },
      styleDescription: 'Heavy-weight custom cotton silhouettes with visible stitch paths and oversized drop proportions.',
    },
  },
  {
    id: 'sw_06',
    name: 'Solecraft',
    category: 'compound',
    meaning: 'Bespoke outsole construction merging orthopedic cushioning with aggressive tread aesthetics.',
    tagline: 'Architectural soles for concrete.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: true, instagram: false } },
    visualDirection: {
      palette: [
        { hex: '#2563EB', name: 'Cobalt Tread', role: 'primary' },
        { hex: '#3B82F6', name: 'Hydro Mesh', role: 'secondary' },
        { hex: '#F97316', name: 'Safety Orange', role: 'accent' },
        { hex: '#FFFFFF', name: 'EVA Foam White', role: 'background' },
        { hex: '#0F172A', name: 'Asphalt Deep', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '700', bodyWeight: '500' },
      styleDescription: 'Futuristic technical footwear styling with modular soles and vibrant high-contrast accents.',
    },
  },
  {
    id: 'sw_07',
    name: 'Voidwear',
    category: 'invented',
    meaning: 'Embracing negative space, monochrome blackout palettes, and oversized stealth draping.',
    tagline: 'The architecture of shadow.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#000000', name: 'Total Void', role: 'primary' },
        { hex: '#18181B', name: 'Charcoal Shadow', role: 'secondary' },
        { hex: '#A1A1AA', name: 'Titanium Accent', role: 'accent' },
        { hex: '#FAFAFA', name: 'Stark Canvas', role: 'background' },
        { hex: '#09090B', name: 'Deep Black', role: 'text' },
      ],
      fonts: { headline: 'Playfair Display', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Avant-garde dark atelier styling with draped silhouettes and subtle luxury metallic hardware.',
    },
  },
  {
    id: 'sw_08',
    name: 'Dropcut',
    category: 'playful',
    meaning: 'Referencing limited-batch product drops and dropped shoulder proportions in tailored hoodies.',
    tagline: 'Limited drops. Infinite posture.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: false, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#84CC16', name: 'Acid Lime', role: 'primary' },
        { hex: '#4D7C0F', name: 'Army Olive', role: 'secondary' },
        { hex: '#F43F5E', name: 'Drop Alert', role: 'accent' },
        { hex: '#1C1917', name: 'Warehouse Black', role: 'background' },
        { hex: '#F5F5F4', name: 'Chalk White', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '900', bodyWeight: '400' },
      styleDescription: 'Scarcity-driven hype streetwear with high-contrast graphic stamps and acid accents.',
    },
  },
  {
    id: 'sw_09',
    name: 'Outstride',
    category: 'evocative',
    meaning: 'Walking with distinct identity that leaves conventional trends behind.',
    tagline: 'Outpace the ordinary.',
    domainAvailability: { com: true, io: false, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#059669', name: 'Forest Runner', role: 'primary' },
        { hex: '#10B981', name: 'Sprout Green', role: 'secondary' },
        { hex: '#FB923C', name: 'Sunset Amber', role: 'accent' },
        { hex: '#F8FAFC', name: 'Pure Cloud', role: 'background' },
        { hex: '#064E3B', name: 'Deep Spruce', role: 'text' },
      ],
      fonts: { headline: 'Plus Jakarta Sans', body: 'Inter', headlineWeight: '800', bodyWeight: '500' },
      styleDescription: 'Trail-running meets street fashion with technical nylon ripstop details and earth accents.',
    },
  },
  {
    id: 'sw_10',
    name: 'Monolith',
    category: 'descriptive',
    meaning: 'Imposing, statuesque apparel built to outlast ephemeral micro-trends.',
    tagline: 'Built like stone. Worn like silk.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: false } },
    visualDirection: {
      palette: [
        { hex: '#3F3F46', name: 'Granite Grey', role: 'primary' },
        { hex: '#71717A', name: 'Chiseled Slate', role: 'secondary' },
        { hex: '#D4D4D8', name: 'Silver Vein', role: 'accent' },
        { hex: '#F4F4F5', name: 'Limestone Block', role: 'background' },
        { hex: '#18181B', name: 'Quarry Dark', role: 'text' },
      ],
      fonts: { headline: 'Inter', body: 'Inter', headlineWeight: '900', bodyWeight: '400' },
      styleDescription: 'Monolithic brutalism with heavy proportions, raw rolled hems, and timeless stone hues.',
    },
  },
  {
    id: 'sw_11',
    name: 'UrbanWeave',
    category: 'compound',
    meaning: 'Interlacing stories of city transit, cultural undergrounds, and premium technical knitting.',
    tagline: 'The fabric of the city.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#6366F1', name: 'Metro Violet', role: 'primary' },
        { hex: '#818CF8', name: 'Transit Line', role: 'secondary' },
        { hex: '#F43F5E', name: 'Signal Beacon', role: 'accent' },
        { hex: '#FAF5FF', name: 'Mist White', role: 'background' },
        { hex: '#1E1B4B', name: 'Subway Tunnel', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Urban mobility lifestyle with engineered seamless knitwear and modern metro maps.',
    },
  },
  {
    id: 'sw_12',
    name: 'ApexKicks',
    category: 'playful',
    meaning: 'The pinnacle of street kicks, engineered for both high-heat display shelves and concrete mileage.',
    tagline: 'Reach the summit of the street.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#EA580C', name: 'Blaze Orange', role: 'primary' },
        { hex: '#FB923C', name: 'Sole Glow', role: 'secondary' },
        { hex: '#2563EB', name: 'Sky Contrast', role: 'accent' },
        { hex: '#FFFFFF', name: 'Fresh Box White', role: 'background' },
        { hex: '#0F172A', name: 'Midnight Tread', role: 'text' },
      ],
      fonts: { headline: 'Plus Jakarta Sans', body: 'Inter', headlineWeight: '800', bodyWeight: '500' },
      styleDescription: 'High-energy sneakerhead boutique with collectible shoe-box packaging and dynamic angles.',
    },
  },
];

// ============================================================
// 4. AI SOFTWARE & CLOUD (12 Names)
// ============================================================
export const TECH_SAAS_BRAND_NAMES: BrandName[] = [
  {
    id: 'tech_01',
    name: 'Synapse',
    category: 'descriptive',
    meaning: 'The neural junction where autonomous models, APIs, and workflows spark into coordinated execution.',
    tagline: 'Where intelligence connects.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#3B82F6', name: 'Neural Blue', role: 'primary' },
        { hex: '#60A5FA', name: 'Synaptic Glow', role: 'secondary' },
        { hex: '#10B981', name: 'Terminal Green', role: 'accent' },
        { hex: '#F8FAFC', name: 'Cloud Slate', role: 'background' },
        { hex: '#0F172A', name: 'Obsidian Void', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '800', bodyWeight: '400' },
      styleDescription: 'Cutting-edge AI infrastructure aesthetic with developer terminal accents and clean vector paths.',
    },
  },
  {
    id: 'tech_02',
    name: 'Nexus',
    category: 'evocative',
    meaning: 'The central focal hub orchestrating multi-agent collaboration across planetary cloud infrastructure.',
    tagline: 'The orchestrator of autonomous cloud.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: true, instagram: false } },
    visualDirection: {
      palette: [
        { hex: '#6366F1', name: 'Quantum Indigo', role: 'primary' },
        { hex: '#818CF8', name: 'Orbital Wave', role: 'secondary' },
        { hex: '#EC4899', name: 'Laser Magenta', role: 'accent' },
        { hex: '#0B0F19', name: 'Deep Space', role: 'background' },
        { hex: '#F8FAFC', name: 'Star White', role: 'text' },
      ],
      fonts: { headline: 'Plus Jakarta Sans', body: 'Inter', headlineWeight: '800', bodyWeight: '400' },
      styleDescription: 'Developer-first high velocity tooling with dark-mode aesthetic and electric neon gradients.',
    },
  },
  {
    id: 'tech_03',
    name: 'HyperVector',
    category: 'compound',
    meaning: 'High-dimensional embedding databases accelerated for real-time vector retrieval and inference.',
    tagline: 'High-dimensional speed for modern AI.',
    domainAvailability: { com: true, io: true, co: false, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#8B5CF6', name: 'Vector Violet', role: 'primary' },
        { hex: '#A78BFA', name: 'Tensor Bloom', role: 'secondary' },
        { hex: '#06B6D4', name: 'Latency Cyan', role: 'accent' },
        { hex: '#FAFAFE', name: 'Clean Logic', role: 'background' },
        { hex: '#1E1B4B', name: 'Binary Deep', role: 'text' },
      ],
      fonts: { headline: 'Inter', body: 'Inter', headlineWeight: '900', bodyWeight: '400' },
      styleDescription: 'Precise computational data engineering branding with geometric grid lines and crisp typography.',
    },
  },
  {
    id: 'tech_04',
    name: 'Synthflow',
    category: 'compound',
    meaning: 'Fluid synthesis of unstructured enterprise data into deterministic automated pipelines.',
    tagline: 'Synthesize workflows at scale.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: false, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#0EA5E9', name: 'Stream Blue', role: 'primary' },
        { hex: '#38BDF8', name: 'Vapor Sky', role: 'secondary' },
        { hex: '#F59E0B', name: 'Runtime Gold', role: 'accent' },
        { hex: '#F0F9FF', name: 'Clean Cloud', role: 'background' },
        { hex: '#0C4A6E', name: 'Deep Navy', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '700', bodyWeight: '500' },
      styleDescription: 'Clean frictionless SaaS experience with aerodynamic curves and confident enterprise typography.',
    },
  },
  {
    id: 'tech_05',
    name: 'CognitiveAI',
    category: 'descriptive',
    meaning: 'Empowering software with human-like reasoning, episodic memory, and autonomous task planning.',
    tagline: 'Reasoning software for complex workflows.',
    domainAvailability: { com: true, io: false, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#1D4ED8', name: 'Logic Blue', role: 'primary' },
        { hex: '#60A5FA', name: 'Cortex Light', role: 'secondary' },
        { hex: '#10B981', name: 'Execution Green', role: 'accent' },
        { hex: '#F8FAFC', name: 'White Room', role: 'background' },
        { hex: '#172554', name: 'Core Midnight', role: 'text' },
      ],
      fonts: { headline: 'Plus Jakarta Sans', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Trustworthy enterprise intelligence with high architectural rigor and calm blue harmonies.',
    },
  },
  {
    id: 'tech_06',
    name: 'PulseCompute',
    category: 'compound',
    meaning: 'Elastic serverless compute that breathes in real-time with sudden spikes in LLM query volume.',
    tagline: 'Zero-latency compute on demand.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#7C3AED', name: 'Pulse Purple', role: 'primary' },
        { hex: '#A855F7', name: 'Dynamic Surge', role: 'secondary' },
        { hex: '#06B6D4', name: 'Cooling Stream', role: 'accent' },
        { hex: '#0F172A', name: 'Data Center Dark', role: 'background' },
        { hex: '#F8FAFC', name: 'Fiber White', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '800', bodyWeight: '500' },
      styleDescription: 'High-throughput infrastructure brand with rhythmic waveforms and deep technical credibility.',
    },
  },
  {
    id: 'tech_07',
    name: 'ModalCore',
    category: 'invented',
    meaning: 'A multimodal operating foundation uniting audio, vision, structured data, and language processing.',
    tagline: 'One core for every modality.',
    domainAvailability: { com: true, io: true, co: false, handle: { twitter: false, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#059669', name: 'Matrix Emerald', role: 'primary' },
        { hex: '#34D399', name: 'Light Phosphor', role: 'secondary' },
        { hex: '#8B5CF6', name: 'Prism Violet', role: 'accent' },
        { hex: '#FAFAF9', name: 'Ivory Minimal', role: 'background' },
        { hex: '#064E3B', name: 'Deep Forest', role: 'text' },
      ],
      fonts: { headline: 'Inter', body: 'Inter', headlineWeight: '900', bodyWeight: '400' },
      styleDescription: 'Next-generation developer tool aesthetic blending mathematical rigor with playful generative accents.',
    },
  },
  {
    id: 'tech_08',
    name: 'Autonoma',
    category: 'invented',
    meaning: 'Self-healing, self-provisioning software environments that manage infrastructure autonomously.',
    tagline: 'Self-driving infrastructure for teams.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#2563EB', name: 'Cobalt Pilot', role: 'primary' },
        { hex: '#60A5FA', name: 'Autonomous Blue', role: 'secondary' },
        { hex: '#F59E0B', name: 'Guidance Amber', role: 'accent' },
        { hex: '#F8FAFC', name: 'Clean Cloud', role: 'background' },
        { hex: '#0F172A', name: 'Deep Steel', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Effortless automated control with calm modern curves and intuitive visual feedback.',
    },
  },
  {
    id: 'tech_09',
    name: 'ZeroLatency',
    category: 'descriptive',
    meaning: 'Edge computing optimized for sub-millisecond AI model inferences globally.',
    tagline: 'Instant answers across the globe.',
    domainAvailability: { com: true, io: false, co: true, handle: { twitter: true, instagram: false } },
    visualDirection: {
      palette: [
        { hex: '#DC2626', name: 'Speed Crimson', role: 'primary' },
        { hex: '#F87171', name: 'Instant Ping', role: 'secondary' },
        { hex: '#3B82F6', name: 'Fiber Route', role: 'accent' },
        { hex: '#FFFFFF', name: 'Blank Horizon', role: 'background' },
        { hex: '#09090B', name: 'Pitch Black', role: 'text' },
      ],
      fonts: { headline: 'Plus Jakarta Sans', body: 'Inter', headlineWeight: '800', bodyWeight: '500' },
      styleDescription: 'Ultra-fast performance engineering with sharp aerodynamic angles and high contrast.',
    },
  },
  {
    id: 'tech_10',
    name: 'QuantumMesh',
    category: 'compound',
    meaning: 'Interconnected microservices mesh securing end-to-end token transfer with quantum-resistant encryption.',
    tagline: 'Secure connections across microservices.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#4F46E5', name: 'Mesh Indigo', role: 'primary' },
        { hex: '#818CF8', name: 'Quantum Field', role: 'secondary' },
        { hex: '#10B981', name: 'Verified Node', role: 'accent' },
        { hex: '#0F172A', name: 'Dark Network', role: 'background' },
        { hex: '#F8FAFC', name: 'Node White', role: 'text' },
      ],
      fonts: { headline: 'Inter', body: 'Inter', headlineWeight: '800', bodyWeight: '400' },
      styleDescription: 'Cryptographic architecture branding with intricate lattice geometries and security-grade trust.',
    },
  },
  {
    id: 'tech_11',
    name: 'Brainwave',
    category: 'playful',
    meaning: 'Capturing sudden creative technical breakthroughs and instantly deploying them as scalable web services.',
    tagline: 'From sudden spark to global scale.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#D97706', name: 'Spark Gold', role: 'primary' },
        { hex: '#FBBF24', name: 'Synapse Yellow', role: 'secondary' },
        { hex: '#7C3AED', name: 'Deep Purple', role: 'accent' },
        { hex: '#FEFDF8', name: 'Idea Paper', role: 'background' },
        { hex: '#1C1917', name: 'Obsidian Pen', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Friendly, accessible developer creativity that demystifies machine learning tools for all makers.',
    },
  },
  {
    id: 'tech_12',
    name: 'TensorForge',
    category: 'compound',
    meaning: 'A heavy-duty GPU compilation foundry where raw neural weights are hammered into peak efficiency.',
    tagline: 'Forge performant AI models.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: false, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#B91C1C', name: 'Foundry Red', role: 'primary' },
        { hex: '#EA580C', name: 'Furnace Amber', role: 'secondary' },
        { hex: '#64748B', name: 'Anvil Steel', role: 'accent' },
        { hex: '#18181B', name: 'Crucible Dark', role: 'background' },
        { hex: '#F4F4F5', name: 'Clean Spark', role: 'text' },
      ],
      fonts: { headline: 'Plus Jakarta Sans', body: 'Inter', headlineWeight: '900', bodyWeight: '500' },
      styleDescription: 'Heavyweight compiler infrastructure branding with molten steel warmth and industrial heft.',
    },
  },
];

// ============================================================
// 5. CLEAN ORGANIC BOTANICALS (12 Names)
// ============================================================
export const BOTANICAL_BRAND_NAMES: BrandName[] = [
  {
    id: 'bot_01',
    name: 'Verdura',
    category: 'invented',
    meaning: 'Celebrating wild mountain plant longevity and cold-pressed botanical extractions.',
    tagline: 'Pure earth. Luminous skin.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#2D6A4F', name: 'Alpine Moss', role: 'primary' },
        { hex: '#52B788', name: 'Sprout Green', role: 'secondary' },
        { hex: '#E07A5F', name: 'Sunlit Terracotta', role: 'accent' },
        { hex: '#F4F1DE', name: 'Warm Parchment', role: 'background' },
        { hex: '#3D405B', name: 'Midnight Charcoal', role: 'text' },
      ],
      fonts: { headline: 'Playfair Display', body: 'Merriweather', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Holistic European apothecary aesthetic with tactile matte finishes and gentle herbal gradients.',
    },
  },
  {
    id: 'bot_02',
    name: 'Dewcraft',
    category: 'compound',
    meaning: 'Morning dew condensing on pristine alpine petals, bottled at sunrise for maximum bioactive vitality.',
    tagline: 'Captured at morning dawn.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: true, instagram: false } },
    visualDirection: {
      palette: [
        { hex: '#0D9488', name: 'Crisp Teal', role: 'primary' },
        { hex: '#5EEAD4', name: 'Dew Shimmer', role: 'secondary' },
        { hex: '#F43F5E', name: 'Blush Rose', role: 'accent' },
        { hex: '#F0FDFA', name: 'Morning Mist', role: 'background' },
        { hex: '#134E4A', name: 'Deep Spruce', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '600', bodyWeight: '400' },
      styleDescription: 'Hydrating, crystalline clean skincare with soft glassy reflections and fresh water textures.',
    },
  },
  {
    id: 'bot_03',
    name: 'AlpinePetal',
    category: 'descriptive',
    meaning: 'Resilient flora thriving in harsh high-altitude climates, carrying concentrated protective antioxidants.',
    tagline: 'High-altitude botanical resilience.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#DB2777', name: 'Alpine Rose', role: 'primary' },
        { hex: '#F472B6', name: 'Silk Petal', role: 'secondary' },
        { hex: '#10B981', name: 'Glacier Flora', role: 'accent' },
        { hex: '#FDF2F8', name: 'Snow Quartz', role: 'background' },
        { hex: '#831843', name: 'Stem Bark', role: 'text' },
      ],
      fonts: { headline: 'Playfair Display', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Delicate floral luxury grounded by scientific resilience and serene mountain purity.',
    },
  },
  {
    id: 'bot_04',
    name: 'PureFlora',
    category: 'compound',
    meaning: 'Unadulterated plant cell extracts formulated without synthetic emulsifiers, fillers, or perfumes.',
    tagline: 'Honest botanicals for healthy skin.',
    domainAvailability: { com: true, io: false, co: true, handle: { twitter: false, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#15803D', name: 'Pure Leaf', role: 'primary' },
        { hex: '#86EFAC', name: 'Spring Bud', role: 'secondary' },
        { hex: '#F59E0B', name: 'Cold-Pressed Oil', role: 'accent' },
        { hex: '#F0FDF4', name: 'Organic Cotton', role: 'background' },
        { hex: '#14532D', name: 'Root Soil', role: 'text' },
      ],
      fonts: { headline: 'Plus Jakarta Sans', body: 'Merriweather', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Transparent clean beauty with clinical certifications and earthy herbal honesty.',
    },
  },
  {
    id: 'bot_05',
    name: 'Herbaceous',
    category: 'descriptive',
    meaning: 'Rich aromatic blends of wild rosemary, calendula, and chamomile celebrating whole-plant healing.',
    tagline: 'Whole-plant ritualistic care.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#3F6212', name: 'Olive Herb', role: 'primary' },
        { hex: '#A3E635', name: 'Lime Tendril', role: 'secondary' },
        { hex: '#CA8A04', name: 'Pollen Gold', role: 'accent' },
        { hex: '#FEFCE8', name: 'Herbal Infusion', role: 'background' },
        { hex: '#1A2E05', name: 'Dry Bay Leaf', role: 'text' },
      ],
      fonts: { headline: 'Playfair Display', body: 'Inter', headlineWeight: '600', bodyWeight: '400' },
      styleDescription: 'Vintage botanical engraving aesthetic with apothecary dropper bottles and aromatic notes.',
    },
  },
  {
    id: 'bot_06',
    name: 'Silklux',
    category: 'invented',
    meaning: 'Ultra-lightweight lipid serums that absorb instantaneously, imparting a velvety cashmere finish.',
    tagline: 'Liquid silk for your skin barrier.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#A21CAF', name: 'Silk Orchid', role: 'primary' },
        { hex: '#E879F9', name: 'Velvet Ribbon', role: 'secondary' },
        { hex: '#F59E0B', name: 'Golden Pearl', role: 'accent' },
        { hex: '#FAF5FF', name: 'Cream Cashmere', role: 'background' },
        { hex: '#701A75', name: 'Midnight Plum', role: 'text' },
      ],
      fonts: { headline: 'Playfair Display', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Haute couture skincare combining sensory tactile luxury with dermatologist efficacy.',
    },
  },
  {
    id: 'bot_07',
    name: 'BotanicGlow',
    category: 'playful',
    meaning: 'Restoring natural dermal luminosity through carotenoid-rich rosehip and sea buckthorn oils.',
    tagline: 'Wake up with a natural glow.',
    domainAvailability: { com: true, io: true, co: false, handle: { twitter: true, instagram: false } },
    visualDirection: {
      palette: [
        { hex: '#EA580C', name: 'Sunbeam Orange', role: 'primary' },
        { hex: '#FDBA74', name: 'Warm Apricot', role: 'secondary' },
        { hex: '#059669', name: 'Botanical Leaf', role: 'accent' },
        { hex: '#FFF7ED', name: 'Morning Glow', role: 'background' },
        { hex: '#7C2D12', name: 'Deep Amber', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Bright, cheerful morning radiance celebrating vitamin-rich fruit oils and sun-kissed skin.',
    },
  },
  {
    id: 'bot_08',
    name: 'LuminaSoil',
    category: 'compound',
    meaning: 'Nourishing the skin microbiome from the ground up, honoring regenerative farming and healthy soil biology.',
    tagline: 'Rooted in regenerative soil.',
    domainAvailability: { com: true, io: false, co: true, handle: { twitter: false, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#78350F', name: 'Rich Humus', role: 'primary' },
        { hex: '#D97706', name: 'Sunbaked Ochre', role: 'secondary' },
        { hex: '#16A34A', name: 'Luminous Sprout', role: 'accent' },
        { hex: '#FEF3C7', name: 'Warm Clay', role: 'background' },
        { hex: '#451A03', name: 'Compost Umber', role: 'text' },
      ],
      fonts: { headline: 'Plus Jakarta Sans', body: 'Merriweather', headlineWeight: '800', bodyWeight: '400' },
      styleDescription: 'Earth-honoring regenerative farming ethos with grounded clay tones and fresh sprouting greens.',
    },
  },
  {
    id: 'bot_09',
    name: 'WildSap',
    category: 'evocative',
    meaning: 'Raw nutrient-rich tree sap and birch water tapped sustainably during the first spring thaw.',
    tagline: 'Untamed hydration from wild woods.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#047857', name: 'Deep Birch Woods', role: 'primary' },
        { hex: '#6EE7B7', name: 'Fresh Sap', role: 'secondary' },
        { hex: '#D97706', name: 'Amber Resin', role: 'accent' },
        { hex: '#F0FDF4', name: 'Clean Snowmelt', role: 'background' },
        { hex: '#064E3B', name: 'Dark Bark', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Raw Nordic wilderness foraging aesthetic with minimalist frosted glass bottles.',
    },
  },
  {
    id: 'bot_10',
    name: 'Petalwise',
    category: 'compound',
    meaning: 'Formulation wisdom guided by traditional herbal treatises and modern green lipid chemistry.',
    tagline: 'The wisdom of wild petals.',
    domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#BE185D', name: 'Wild Peony', role: 'primary' },
        { hex: '#F472B6', name: 'Blush Velvet', role: 'secondary' },
        { hex: '#059669', name: 'Sage Leaf', role: 'accent' },
        { hex: '#FDF2F8', name: 'Porcelain Petal', role: 'background' },
        { hex: '#500724', name: 'Cranberry Deep', role: 'text' },
      ],
      fonts: { headline: 'Playfair Display', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
      styleDescription: 'Scholarly botanical heritage with clean modern packaging and delicate petal diagrams.',
    },
  },
  {
    id: 'bot_11',
    name: 'Radiancy',
    category: 'playful',
    meaning: 'An effortless daily dew shield providing barrier defense against urban pollution and blue light.',
    tagline: 'Your daily botanical armor.',
    domainAvailability: { com: true, io: true, co: false, handle: { twitter: true, instagram: false } },
    visualDirection: {
      palette: [
        { hex: '#CA8A04', name: 'Golden Marigold', role: 'primary' },
        { hex: '#FDE047', name: 'Morning Sparkle', role: 'secondary' },
        { hex: '#2563EB', name: 'Blue Light Shield', role: 'accent' },
        { hex: '#FEFCE8', name: 'Dewdrop White', role: 'background' },
        { hex: '#713F12', name: 'Roasted Seed', role: 'text' },
      ],
      fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '800', bodyWeight: '400' },
      styleDescription: 'Vibrant daytime defense skincare with sunny cheerful branding and recyclable aluminum tubes.',
    },
  },
  {
    id: 'bot_12',
    name: 'StemCare',
    category: 'descriptive',
    meaning: 'Plant stem cell culture technology cultivating rare alpine flora without harvesting wild endangered species.',
    tagline: 'Bio-tech purity from cellular nature.',
    domainAvailability: { com: false, io: true, co: true, handle: { twitter: true, instagram: true } },
    visualDirection: {
      palette: [
        { hex: '#0F766E', name: 'Bio Teal', role: 'primary' },
        { hex: '#2DD4BF', name: 'Cellular Cyan', role: 'secondary' },
        { hex: '#EAB308', name: 'Stem Nutrient', role: 'accent' },
        { hex: '#F0FDFA', name: 'Clean Lab Room', role: 'background' },
        { hex: '#134E4A', name: 'Forest Biome', role: 'text' },
      ],
      fonts: { headline: 'Plus Jakarta Sans', body: 'Inter', headlineWeight: '700', bodyWeight: '500' },
      styleDescription: 'Next-generation bio-botanicals marrying clean biotechnology with zero-impact sustainability.',
    },
  },
];

// Fallback Default Mock List (12 items)
export const MOCK_BRAND_NAMES: BrandName[] = SUSTAINABLE_PRODUCTIVITY_NAMES;

export const MOCK_LOGOS_BY_STYLE: Record<string, LogoConcept[]> = {
  default: [
    {
      id: 'logo_01',
      style: 'minimal',
      prompt: 'Minimalist continuous-line monogram glyph, clean geometric curves, works on dark and light',
      url: 'minimal',
    },
    {
      id: 'logo_02',
      style: 'wordmark',
      prompt: 'Custom architectural typography wordmark with optical kerning and hidden accent ligature',
      url: 'wordmark',
    },
    {
      id: 'logo_03',
      style: 'abstract',
      prompt: 'Abstract dynamic prism emblem, overlapping translucent gradients, 3D modern tech symbol',
      url: 'abstract',
    },
    {
      id: 'logo_04',
      style: 'geometric',
      prompt: 'Precision geometric badge with golden ratio proportions and bold circular silhouette',
      url: 'geometric',
    },
  ],
};

export interface BrandTaglineOption {
  id: string;
  tagline: string;
  angle: string;
  tone: string;
}

export const MOCK_TAGLINES_BY_BRAND: Record<string, BrandTaglineOption[]> = {
  Watershed: [
    { id: 't1', tagline: 'Clarity in every workflow.', angle: 'Strategic Clarity', tone: 'Direct, calming, and memorable' },
    { id: 't2', tagline: 'Where work converges effortlessly.', angle: 'Systemic Flow', tone: 'Speaks to seamless tool unification' },
    { id: 't3', tagline: 'Calm systems for distributed ambition.', angle: 'Mindful Remote', tone: 'Prioritizes mental longevity' },
    { id: 't4', tagline: 'Unified priorities. Zero noise.', angle: 'Punchy Minimal', tone: 'Short, sharp executive positioning' },
  ],
  Drift: [
    { id: 't1', tagline: 'Effortless focus for remote teams.', angle: 'Flow State', tone: 'Lightweight and low cognitive drag' },
    { id: 't2', tagline: 'Move with the current of your day.', angle: 'Organic Cadence', tone: 'Anti-burnout, natural rhythm' },
    { id: 't3', tagline: 'Asynchronous work that floats free.', angle: 'Modern Distributed', tone: 'Speaks directly to time-zone independence' },
    { id: 't4', tagline: 'Less friction. More depth.', angle: 'Minimalist Focus', tone: 'Clean, confident clarity' },
  ],
  Compass: [
    { id: 't1', tagline: 'Navigate your day with intent.', angle: 'Directional Purpose', tone: 'Authoritative, grounding and reliable' },
    { id: 't2', tagline: 'True North for distributed priorities.', angle: 'Alignment', tone: 'Keeps everyone aimed at shared goals' },
    { id: 't3', tagline: 'Steady navigation in an era of distraction.', angle: 'Focus Sanctuary', tone: 'Offers safety and orientation' },
    { id: 't4', tagline: 'Know where your time goes.', angle: 'Clarity & Control', tone: 'Empowering personal productivity' },
  ],
  Bloom: [
    { id: 't1', tagline: 'Where team momentum flourishes.', angle: 'Organic Growth', tone: 'Encouraging, vibrant, and alive' },
    { id: 't2', tagline: 'Cultivate focus. Harvest impact.', angle: 'Nurturing Systems', tone: 'Transforms daily inputs to results' },
    { id: 't3', tagline: 'Sustainable progress in full color.', angle: 'Inspiring Energy', tone: 'Celebrates deliberate breakthroughs' },
    { id: 't4', tagline: 'Growing better ways to work.', angle: 'Evolutionary', tone: 'Humble yet visionary' },
  ],
  Ceramiq: [
    { id: 't1', tagline: 'Warmth in every pour.', angle: 'Artisanal & Cozy', tone: 'Evokes tactile stoneware mugs and single-origin comfort' },
    { id: 't2', tagline: 'Rooted in origin, crafted in ceramic.', angle: 'Terroir & Craft', tone: 'Highlights ethical sourcing and handmade coffee rituals' },
    { id: 't3', tagline: 'Pure heirloom extraction, daily ritual.', angle: 'Modern Minimalist', tone: 'Focuses on precision roasting and deliberate mornings' },
    { id: 't4', tagline: 'The architecture of morning coffee.', angle: 'Design-Forward', tone: 'Sophisticated appeal for boutique roastery spaces' },
  ],
  Kinetics: [
    { id: 't1', tagline: 'Unstoppable momentum in every stride.', angle: 'Kinetic Energy', tone: 'High-impact streetwear and performance posture' },
    { id: 't2', tagline: 'Engineered for movement, built for street.', angle: 'Architectural Street', tone: 'Brutalist lines and urban durability' },
    { id: 't3', tagline: 'Brutalist lines. Zero hesitation.', angle: 'Bold Minimal', tone: 'Short, commanding, Gen-Z resonant' },
    { id: 't4', tagline: 'Defy the standard silhouette.', angle: 'Forward Avant-Garde', tone: 'Limited-edition drop culture and high design' },
  ],
  Synapse: [
    { id: 't1', tagline: 'Where intelligence connects.', angle: 'Neural Innovation', tone: 'Next-generation AI frameworks and high-bandwidth thought' },
    { id: 't2', tagline: 'The neural layer for autonomous work.', angle: 'Agentic Infrastructure', tone: 'Developer-first automation and orchestration' },
    { id: 't3', tagline: 'Code at the speed of thought.', angle: 'High-Velocity Developer', tone: 'Ultra-low latency and frictionless tooling' },
    { id: 't4', tagline: 'Cognitive power, unlocked.', angle: 'Enterprise AI', tone: 'Authoritative, scalable cloud intelligence' },
  ],
  Verdura: [
    { id: 't1', tagline: 'Pure earth. Luminous skin.', angle: 'Clean Botanical', tone: 'Alpine botanical extracts and gentle daily radiance' },
    { id: 't2', tagline: 'Wildcrafted botanicals, clinical results.', angle: 'Derm-Botanical', tone: 'Balances nature with proven active ingredients' },
    { id: 't3', tagline: 'Skin rituals from alpine soil.', angle: 'Slow Beauty', tone: 'Tactile morning ritual and mindful packaging' },
    { id: 't4', tagline: 'Nourish without compromise.', angle: 'Conscious Purity', tone: 'Zero-waste, cruelty-free certification' },
  ],
};

export function getTaglinesForBrand(brandName: string, industry?: string): BrandTaglineOption[] {
  if (MOCK_TAGLINES_BY_BRAND[brandName]) {
    return MOCK_TAGLINES_BY_BRAND[brandName];
  }
  return [
    { id: 't_def_1', tagline: `${brandName}. Designed for what matters.`, angle: 'Strategic Clarity', tone: 'Direct, modern, and memorable' },
    { id: 't_def_2', tagline: `Redefining ${industry ? industry.split(' ')[0] : 'the category'}.`, angle: 'Category Definer', tone: 'Bold and authoritative positioning' },
    { id: 't_def_3', tagline: `Pure craft. Zero compromise.`, angle: 'High Integrity', tone: 'Speaks to premium craftsmanship and quality' },
    { id: 't_def_4', tagline: `Engineered for modern momentum.`, angle: 'Dynamic Innovation', tone: 'Contemporary and forward-looking' },
  ];
}

export function getNamesForConcept(industryOrPrompt: string): BrandName[] {
  const lower = industryOrPrompt.toLowerCase();
  
  // Sustainable productivity / remote work / calm / focus (Hackathon Brief Flagship Demo)
  if (
    lower.includes('sustain') ||
    lower.includes('productiv') ||
    lower.includes('remote') ||
    lower.includes('work') ||
    lower.includes('focus') ||
    lower.includes('task') ||
    lower.includes('organ') ||
    lower.includes('team') ||
    lower.includes('mindful')
  ) {
    return SUSTAINABLE_PRODUCTIVITY_NAMES;
  }

  // Coffee / roastery / cafe / espresso / beverage
  if (
    lower.includes('coffee') ||
    lower.includes('cofee') ||
    lower.includes('coffe') ||
    lower.includes('cafe') ||
    lower.includes('roast') ||
    lower.includes('brew') ||
    lower.includes('espresso') ||
    lower.includes('latte') ||
    lower.includes('cappuccino') ||
    lower.includes('bean')
  ) {
    return COFFEE_BRAND_NAMES;
  }

  // Streetwear / footwear / fashion / clothing / kicks
  if (
    lower.includes('street') ||
    lower.includes('wear') ||
    lower.includes('shoe') ||
    lower.includes('kick') ||
    lower.includes('cloth') ||
    lower.includes('apparel') ||
    lower.includes('fashion') ||
    lower.includes('sneaker') ||
    lower.includes('couture')
  ) {
    return STREETWEAR_BRAND_NAMES;
  }

  // AI / Cloud / Software / SaaS / Developer / Computing
  if (
    lower.includes('ai') ||
    lower.includes('tech') ||
    lower.includes('cloud') ||
    lower.includes('software') ||
    lower.includes('saas') ||
    lower.includes('developer') ||
    lower.includes('code') ||
    lower.includes('agent') ||
    lower.includes('data') ||
    lower.includes('compute')
  ) {
    return TECH_SAAS_BRAND_NAMES;
  }

  // Botanicals / Skincare / Wellness / Beauty / Cosmetics
  if (
    lower.includes('skin') ||
    lower.includes('botanic') ||
    lower.includes('beauty') ||
    lower.includes('care') ||
    lower.includes('cosmetic') ||
    lower.includes('flora') ||
    lower.includes('herb') ||
    lower.includes('petal') ||
    lower.includes('spa') ||
    lower.includes('wellness')
  ) {
    return BOTANICAL_BRAND_NAMES;
  }

  // Default rich fallback: Sustainable Productivity
  return SUSTAINABLE_PRODUCTIVITY_NAMES;
}

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'm1',
    sender: 'assistant' as const,
    text: `Hello! I'm your Upstream Autonomous Brand Agent. Describe your business vision or startup idea (e.g. "Building a sustainable productivity app for remote teams"), and I will autonomously synthesize 12 curated names, taglines, domain checks, visual directions, logo concepts, and investor exports.`,
    timestamp: 'Just now',
    suggestions: [
      'Building a sustainable productivity app for remote teams',
      'We are building a coffee business and looking to have a brand',
      'Streetwear and sneaker apparel for Gen Z creators',
      'Autonomous AI cloud platform for developers',
      'Clean organic botanical skincare ritual brand',
    ],
  },
];
