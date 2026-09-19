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
    sampleKeywords: ['Vanguard', 'Drop', 'Sole', 'Stitch', 'Kinetics'],
  },
  {
    id: 'luxury-boutique',
    title: 'Luxury Atelier & Boutique',
    category: 'Haute Couture',
    tagline: 'Timeless elegance & bespoke craftsmanship',
    description: 'Exquisite silk wear, tailored silhouettes, and minimalist European atelier aesthetics.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-violet-400/20 via-pink-300/20 to-indigo-400/20',
    iconName: 'Sparkles',
    defaultInput: {
      businessName: '',
      industry: 'Luxury Fashion & Artisan Boutique',
      targetAudience: 'Affluent individuals valuing sustainable craftsmanship and quiet luxury',
      mission: 'Redefining modern elegance through timeless, ethically produced capsule wardrobes and bespoke accessories.',
      tone: 'luxurious',
      constraints: 'French or Latin roots preferred, sophisticated pronunciation, under 11 characters, no trendy buzzwords',
    },
    sampleKeywords: ['Maison', 'Aura', 'Silk', 'Couture', 'Atelier'],
  },
  {
    id: 'tech-saas',
    title: 'AI Software & Cloud Studio',
    category: 'Technology & SaaS',
    tagline: 'Cloud infrastructure for software teams',
    description: 'Developer platforms, cloud tooling, and high-performance computing.',
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
    sampleKeywords: ['Nexus', 'Synth', 'Vector', 'Pulse', 'Hyper'],
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
    sampleKeywords: ['Flora', 'Verde', 'Dew', 'Bloom', 'Pure'],
  },
  {
    id: 'artisan-coffee',
    title: 'Specialty Coffee & Roastery',
    category: 'Food & Beverage',
    tagline: 'Single-origin beans roasted with precision',
    description: 'Micro-lot ethically sourced coffees, ceramic craftsmanship, and minimalist café experiences.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-amber-600/20 via-orange-500/20 to-yellow-600/20',
    iconName: 'Coffee',
    defaultInput: {
      businessName: '',
      industry: 'Specialty Coffee Roastery & Micro-Café',
      targetAudience: 'Third-wave coffee lovers, daily espresso purists, and design enthusiasts',
      mission: 'Celebrating the nuanced terroir of heirloom coffee cherries roasted in small, carbon-neutral batches.',
      tone: 'playful',
      constraints: 'Warm, memorable, catchy, sounds great on ceramic mugs and kraft paper bags',
    },
    sampleKeywords: ['Roast', 'Bean', 'Brew', 'Crema', 'Origin'],
  },
  {
    id: 'fine-jewelry',
    title: 'Fine Jewelry & Gemstones',
    category: 'Luxury Accessories',
    tagline: 'Sculptural precious metals & lab-grown gems',
    description: 'Recycled 18k gold, conflict-free emeralds, and architectural modern heirloom rings.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    gradient: 'from-rose-400/20 via-purple-400/20 to-amber-300/20',
    iconName: 'Gem',
    defaultInput: {
      businessName: '',
      industry: 'Modern Fine Jewelry & Gemstones',
      targetAudience: 'Self-purchasing modern tastemakers and couples looking for non-traditional ceremonial jewelry',
      mission: 'Handcrafted architectural jewelry sculpted from recycled precious metals and luminous ethically grown stones.',
      tone: 'luxurious',
      constraints: 'Sensual, radiant, short, looks stunning embossed on velvet boxes',
    },
    sampleKeywords: ['Luster', 'Prism', 'Carat', 'Gold', 'Aura'],
  },
];

export const MOCK_BRAND_NAMES: BrandName[] = [
  {
    id: 'brand_01',
    name: 'Kinetics',
    meaning: 'Derived from Greek kinetikos ("moving"), symbolizes unstoppable forward motion and dynamic urban culture.',
    tagline: 'Engineered for the relentless.',
    domainAvailability: {
      com: true,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#7C3AED', name: 'Electric Violet', role: 'primary' },
        { hex: '#1E1B4B', name: 'Midnight Navy', role: 'secondary' },
        { hex: '#FB7185', name: 'Neon Coral', role: 'accent' },
        { hex: '#F8F6FE', name: 'Soft Lilac Fog', role: 'background' },
        { hex: '#0F172A', name: 'Pitch Ink', role: 'text' },
      ],
      fonts: {
        headline: 'Plus Jakarta Sans',
        body: 'Inter',
        headlineWeight: '800',
        bodyWeight: '400',
      },
      styleDescription: 'Futuristic streetwear aesthetics with hyper-contrast typography and glowing neon accents.',
    },
  },
  {
    id: 'brand_02',
    name: 'Aurae',
    meaning: 'From Latin aura ("gentle breeze / radiant light"), evoking weightless beauty and effortless luxury.',
    tagline: 'Quiet luxury, spoken softly.',
    domainAvailability: {
      com: false,
      io: true,
      co: true,
      handle: { twitter: false, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#9060FA', name: 'Silk Lavender', role: 'primary' },
        { hex: '#DDD6FE', name: 'Mist Lilac', role: 'secondary' },
        { hex: '#F59E0B', name: 'Warm Amber Gold', role: 'accent' },
        { hex: '#FCFBFF', name: 'Opal Pearl', role: 'background' },
        { hex: '#1E1035', name: 'Velvet Noir', role: 'text' },
      ],
      fonts: {
        headline: 'Playfair Display',
        body: 'Plus Jakarta Sans',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'European haute atelier with high-serif editorial elegance and delicate pastel gradients.',
    },
  },
  {
    id: 'brand_03',
    name: 'Synapse',
    meaning: 'The neural junction where thoughts spark into reality; ideal for next-generation intelligence tools.',
    tagline: 'Where intelligence connects.',
    domainAvailability: {
      com: true,
      io: true,
      co: false,
      handle: { twitter: true, instagram: false },
    },
    visualDirection: {
      palette: [
        { hex: '#6366F1', name: 'Hyper Indigo', role: 'primary' },
        { hex: '#06B6D4', name: 'Cyan Glow', role: 'secondary' },
        { hex: '#8B5CF6', name: 'Prism Purple', role: 'accent' },
        { hex: '#F8FAFC', name: 'Clean Circuit', role: 'background' },
        { hex: '#0B0F19', name: 'Deep Space', role: 'text' },
      ],
      fonts: {
        headline: 'Outfit',
        body: 'Inter',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Ultra-crisp developer aesthetic with glassmorphic cards and electric terminal accents.',
    },
  },
  {
    id: 'brand_04',
    name: 'Verdura',
    meaning: 'Rooted in Latin viridis ("fresh and thriving"), representing purest botanical formulations.',
    tagline: 'Pure earth. Luminous skin.',
    domainAvailability: {
      com: true,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#10B981', name: 'Botanical Emerald', role: 'primary' },
        { hex: '#A7F3D0', name: 'Mint Dew', role: 'secondary' },
        { hex: '#F472B6', name: 'Wild Rose', role: 'accent' },
        { hex: '#F6FBF8', name: 'Fresh Morning', role: 'background' },
        { hex: '#064E3B', name: 'Deep Canopy', role: 'text' },
      ],
      fonts: {
        headline: 'Merriweather',
        body: 'Inter',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Calming, nature-focused minimalism with tactile organic tones and clean apothecary layout.',
    },
  },
  {
    id: 'brand_05',
    name: 'Voltaic',
    meaning: 'Electrifying momentum and sudden creative spark; embodies rapid creation and boldness.',
    tagline: 'Ignite your next movement.',
    domainAvailability: {
      com: false,
      io: true,
      co: true,
      handle: { twitter: true, instagram: false },
    },
    visualDirection: {
      palette: [
        { hex: '#8B5CF6', name: 'Volt Purple', role: 'primary' },
        { hex: '#3B82F6', name: 'Cobalt Surge', role: 'secondary' },
        { hex: '#FB7185', name: 'Flash Coral', role: 'accent' },
        { hex: '#F9F8FE', name: 'Subtle Fog', role: 'background' },
        { hex: '#111827', name: 'Obsidian', role: 'text' },
      ],
      fonts: {
        headline: 'Plus Jakarta Sans',
        body: 'Inter',
        headlineWeight: '800',
        bodyWeight: '500',
      },
      styleDescription: 'High-octane visual hierarchy with kinetic geometry and stark typographical tension.',
    },
  },
  {
    id: 'brand_06',
    name: 'Lumora',
    meaning: 'A portmanteau of Lumen ("light") and Aura ("radiance"), crafted for glowing, elevated brands.',
    tagline: 'Radiance by design.',
    domainAvailability: {
      com: true,
      io: false,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#EC4899', name: 'Luminous Berry', role: 'primary' },
        { hex: '#8B5CF6', name: 'Royal Violet', role: 'secondary' },
        { hex: '#FBBF24', name: 'Gilded Sun', role: 'accent' },
        { hex: '#FFFBFD', name: 'Alabaster', role: 'background' },
        { hex: '#371B2B', name: 'Plum Noir', role: 'text' },
      ],
      fonts: {
        headline: 'Playfair Display',
        body: 'Plus Jakarta Sans',
        headlineWeight: '600',
        bodyWeight: '400',
      },
      styleDescription: 'Iridescent, warm luxury with ethereal lighting and sculptural gemstone motifs.',
    },
  },
  {
    id: 'brand_07',
    name: 'Ceramiq',
    meaning: 'A sleek, contemporary play on ceramic craft, evoking earthy warmth and tactile precision.',
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
    id: 'brand_08',
    name: 'Solace',
    meaning: 'Peace, tranquility, and shelter; ideal for wellness, boutique sanctuaries, and ritual products.',
    tagline: 'Your everyday sanctuary.',
    domainAvailability: {
      com: false,
      io: true,
      co: true,
      handle: { twitter: false, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#A855F7', name: 'Lavender Mist', role: 'primary' },
        { hex: '#E9D5FF', name: 'Cloud Lilac', role: 'secondary' },
        { hex: '#10B981', name: 'Sage Leaf', role: 'accent' },
        { hex: '#FAF5FF', name: 'Pure Calm', role: 'background' },
        { hex: '#3B0764', name: 'Nightshade', role: 'text' },
      ],
      fonts: {
        headline: 'Plus Jakarta Sans',
        body: 'Inter',
        headlineWeight: '600',
        bodyWeight: '400',
      },
      styleDescription: 'Soft wellness aesthetic with spacious whitespace and soothing pastel gradients.',
    },
  },
  {
    id: 'brand_09',
    name: 'Prismatix',
    meaning: 'Reflecting light into infinite vibrant spectrums; perfect for multidisciplinary studios and bold lines.',
    tagline: 'See the full spectrum.',
    domainAvailability: {
      com: true,
      io: true,
      co: false,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#6366F1', name: 'Prism Indigo', role: 'primary' },
        { hex: '#EC4899', name: 'Neon Magenta', role: 'secondary' },
        { hex: '#06B6D4', name: 'Electric Cyan', role: 'accent' },
        { hex: '#F8F9FE', name: 'Crystal White', role: 'background' },
        { hex: '#1E1B4B', name: 'Deep Space', role: 'text' },
      ],
      fonts: {
        headline: 'Outfit',
        body: 'Inter',
        headlineWeight: '800',
        bodyWeight: '400',
      },
      styleDescription: 'Bold optical geometry with holographic gradients and tech-forward swagger.',
    },
  },
  {
    id: 'brand_10',
    name: 'Velore',
    meaning: 'Inspired by French velours and Italian valore ("worth/value"), defining rich, tactile exclusivity.',
    tagline: 'Curated for the connoisseur.',
    domainAvailability: {
      com: true,
      io: false,
      co: true,
      handle: { twitter: true, instagram: false },
    },
    visualDirection: {
      palette: [
        { hex: '#7C3AED', name: 'Imperial Violet', role: 'primary' },
        { hex: '#C084FC', name: 'Velvet Orchid', role: 'secondary' },
        { hex: '#F59E0B', name: 'Gilded Brass', role: 'accent' },
        { hex: '#FAF8FF', name: 'Ivory Silk', role: 'background' },
        { hex: '#2E1065', name: 'Midnight Plum', role: 'text' },
      ],
      fonts: {
        headline: 'Playfair Display',
        body: 'Inter',
        headlineWeight: '700',
        bodyWeight: '400',
      },
      styleDescription: 'Regal European luxury with velvety textures and timeless golden metallic accents.',
    },
  },
  {
    id: 'brand_11',
    name: 'Driftwood',
    meaning: 'Natural elements sculpted gently by wind and tide into singular works of organic design.',
    tagline: 'Naturally effortless living.',
    domainAvailability: {
      com: true,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#84CC16', name: 'Olive Sprout', role: 'primary' },
        { hex: '#D97706', name: 'Sunbaked Ochre', role: 'secondary' },
        { hex: '#8B5CF6', name: 'Twilight Lavender', role: 'accent' },
        { hex: '#FBFBFA', name: 'Unbleached Cotton', role: 'background' },
        { hex: '#262626', name: 'Charcoal', role: 'text' },
      ],
      fonts: {
        headline: 'Plus Jakarta Sans',
        body: 'Merriweather',
        headlineWeight: '600',
        bodyWeight: '400',
      },
      styleDescription: 'Wabi-sabi organic living with honest textures and serene earth tones.',
    },
  },
  {
    id: 'brand_12',
    name: 'Novaflex',
    meaning: 'A sudden burst of stellar brightness paired with infinite adaptability.',
    tagline: 'Adapt faster than the future.',
    domainAvailability: {
      com: false,
      io: true,
      co: true,
      handle: { twitter: true, instagram: true },
    },
    visualDirection: {
      palette: [
        { hex: '#3B82F6', name: 'Hyper Blue', role: 'primary' },
        { hex: '#8B5CF6', name: 'Quantum Purple', role: 'secondary' },
        { hex: '#10B981', name: 'Matrix Emerald', role: 'accent' },
        { hex: '#F8FAFC', name: 'Starlight Silver', role: 'background' },
        { hex: '#0F172A', name: 'Obsidian Ink', role: 'text' },
      ],
      fonts: {
        headline: 'Outfit',
        body: 'Inter',
        headlineWeight: '800',
        bodyWeight: '500',
      },
      styleDescription: 'Futuristic performance branding with dynamic diagonal motifs and athletic speed.',
    },
  },
];

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

export const COFFEE_BRAND_NAMES: BrandName[] = [
  {
    id: 'coffee_01',
    name: 'Ceramiq',
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
];

export interface BrandTaglineOption {
  id: string;
  tagline: string;
  angle: string;
  tone: string;
}

export const MOCK_TAGLINES_BY_BRAND: Record<string, BrandTaglineOption[]> = {
  Ceramiq: [
    { id: 't1', tagline: 'Warmth in every pour.', angle: 'Artisanal & Cozy', tone: 'Evokes tactile stoneware mugs and single-origin comfort' },
    { id: 't2', tagline: 'Rooted in origin, crafted in ceramic.', angle: 'Terroir & Craft', tone: 'Highlights ethical sourcing and handmade coffee rituals' },
    { id: 't3', tagline: 'Pure heirloom extraction, daily ritual.', angle: 'Modern Minimalist', tone: 'Focuses on precision roasting and deliberate mornings' },
    { id: 't4', tagline: 'The architecture of morning coffee.', angle: 'Design-Forward', tone: 'Sophisticated appeal for boutique roastery spaces' },
  ],
  Terroir: [
    { id: 't1', tagline: 'Crafted from origin to cup.', angle: 'Heritage & Direct Trade', tone: 'Direct relationship with high-altitude growers' },
    { id: 't2', tagline: 'Soil, altitude, climate, craft.', angle: 'Terroir Science', tone: 'Celebrates micro-climates and elevation' },
    { id: 't3', tagline: 'Single-origin honesty in every roast.', angle: 'Ethical Purism', tone: 'Transparent, uncompromised coffee bean processing' },
    { id: 't4', tagline: 'Taste the mountain.', angle: 'Punchy & Memorable', tone: 'Bold sensory connection with volcanic soils' },
  ],
  Crema: [
    { id: 't1', tagline: 'Pure ritual, daily poured.', angle: 'Scandinavian Minimal', tone: 'Serene morning routine for specialty coffee fans' },
    { id: 't2', tagline: 'The golden crown of your morning.', angle: 'Sensory Luxury', tone: 'Celebrates the rich velvet extraction of espresso' },
    { id: 't3', tagline: 'Velvet extractions for curious palates.', angle: 'Craft Lab', tone: 'Experimental yet approachable roaster culture' },
    { id: 't4', tagline: 'Crafted slow, enjoyed pure.', angle: 'Mindful Living', tone: 'Anti-rush, high-quality artisanal enjoyment' },
  ],
  Veloce: [
    { id: 't1', tagline: 'Roasted with relentless precision.', angle: 'High-Precision', tone: 'Thermodynamic roasting profiles and digital consistency' },
    { id: 't2', tagline: 'Speed, clarity, morning ignition.', angle: 'Urban Momentum', tone: 'High-energy espresso for driven innovators' },
    { id: 't3', tagline: 'Precision espresso for unstoppable days.', angle: 'Performance Lifestyle', tone: 'Italian speed merged with third-wave standards' },
    { id: 't4', tagline: 'Engineered for pure clarity.', angle: 'Modernist Tech', tone: 'Clean extraction without bitterness' },
  ],
  'Amber Mill': [
    { id: 't1', tagline: 'Awaken the subtle nuance.', angle: 'Poetic & Sensory', tone: 'Highlights delicate florals, stone fruits, and honey notes' },
    { id: 't2', tagline: 'Heirloom stone mills, slow-roasted beans.', angle: 'Old-World Craft', tone: 'Honoring traditional milling and sun-dried cherries' },
    { id: 't3', tagline: 'From sunbaked cherries to golden cups.', angle: 'Natural Process', tone: 'Story of warmth and golden extraction' },
    { id: 't4', tagline: 'Tradition ground with reverence.', angle: 'Heritage Roaster', tone: 'Resonant and trustworthy branding' },
  ],
  Kinetics: [
    { id: 't1', tagline: 'Unstoppable momentum in every stride.', angle: 'Kinetic Energy', tone: 'High-impact streetwear and performance athletic posture' },
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
  return MOCK_BRAND_NAMES.slice(0, 5);
}

type SeedMessage = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
};

/**
 * The transcript starts empty.
 *
 * The agent panel renders its own greeting and starter prompts, so seeding a
 * welcome message here duplicated the same four prompts twice on first load
 * (once as buttons, once as suggestion chips).
 */
export const INITIAL_CHAT_MESSAGES: SeedMessage[] = [];
