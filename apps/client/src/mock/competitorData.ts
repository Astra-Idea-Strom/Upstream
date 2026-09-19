export interface SimpleSwatch { hex: string; name: string; }

export interface CompetitorBrand {
  name: string;
  tagline: string;
  category: string;
  positioning: 'Mass Market' | 'Premium Craft' | 'Ultra-Luxury' | 'Enterprise Tech' | 'Indie Cult';
  visualStyle: string;
  pricePoint: '$' | '$$' | '$$$' | '$$$$';
  palette: SimpleSwatch[];
  differentiationAgainst: string;
  marketShare: string;
  mapCoords: { x: number; y: number };
}

export interface IndustryCompetitorSet {
  industry: string;
  userBrandCoords: { x: number; y: number };
  competitors: CompetitorBrand[];
}

export const COMPETITOR_DATABASE: Record<string, IndustryCompetitorSet> = {
  coffee: {
    industry: 'Specialty Coffee & Roastery',
    userBrandCoords: { x: 25, y: 70 },
    competitors: [
      {
        name: 'Blue Bottle Coffee',
        tagline: 'Fresh coffee roasted to order',
        category: 'Specialty Cafe & Beans',
        positioning: 'Premium Craft',
        visualStyle: 'Minimalist Scandinavian, iconic sky blue silhouette on white surfaces',
        pricePoint: '$$$',
        palette: [
          { hex: '#00A3E0', name: 'Cerulean Blue' },
          { hex: '#FFFFFF', name: 'Pure White' },
          { hex: '#231F20', name: 'Roasted Charcoal' },
        ],
        differentiationAgainst: 'Blue Bottle is corporate Nestlé-backed; your brand captures agile artisan DTC intimacy and tactile ceramic unboxing.',
        marketShare: 'Global scale (~100+ cafes)',
        mapCoords: { x: 45, y: 55 },
      },
      {
        name: 'Stumptown Coffee',
        tagline: 'Good coffee doesn’t have to be complicated',
        category: 'Heritage Craft Roaster',
        positioning: 'Indie Cult',
        visualStyle: 'Rustic Pacific-Northwest heritage, kraft paper, vintage serif typography',
        pricePoint: '$$',
        palette: [
          { hex: '#9E2A2B', name: 'Deep Rust' },
          { hex: '#E09F3E', name: 'Amber Glow' },
          { hex: '#335C67', name: 'Pacific Slate' },
        ],
        differentiationAgainst: 'Stumptown leans on gritty vintage nostalgia; your brand brings a clean contemporary architectural aesthetic.',
        marketShare: 'National grocery & cafes',
        mapCoords: { x: -65, y: 30 },
      },
      {
        name: 'Ralph’s Coffee',
        tagline: 'Timeless hospitality & heritage style',
        category: 'Luxury Lifestyle Coffee',
        positioning: 'Ultra-Luxury',
        visualStyle: 'Classic Manhattan green, brass hardware, collegiate typography',
        pricePoint: '$$$$',
        palette: [
          { hex: '#004225', name: 'Racing Green' },
          { hex: '#D4AF37', name: 'Antique Gold' },
          { hex: '#FAF9F6', name: 'Warm Cream' },
        ],
        differentiationAgainst: 'Ralph’s trades on fashion prestige without coffee innovation; your brand marries terroir transparency with modern design.',
        marketShare: 'Boutique flagship locations',
        mapCoords: { x: -40, y: 85 },
      },
    ],
  },
  streetwear: {
    industry: 'Streetwear & Sneaker Apparel',
    userBrandCoords: { x: 80, y: 65 },
    competitors: [
      {
        name: 'Kith',
        tagline: 'Just Us',
        category: 'Curated Streetwear & Kicks',
        positioning: 'Premium Craft',
        visualStyle: 'Monochromatic modular minimalism, serif box logo, high-profile sneaker collabs',
        pricePoint: '$$$',
        palette: [
          { hex: '#111111', name: 'Onyx Black' },
          { hex: '#E5E5E5', name: 'Concrete Gray' },
          { hex: '#C2A687', name: 'Warm Sand' },
        ],
        differentiationAgainst: 'Kith relies on licensed corporate IP; your brand stands for original brutalist technical silhouettes and creator drops.',
        marketShare: 'Global luxury retail',
        mapCoords: { x: 50, y: 60 },
      },
      {
        name: 'Fear of God',
        tagline: 'Luxury loungewear & architectural essentials',
        category: 'Haute Streetwear',
        positioning: 'Ultra-Luxury',
        visualStyle: 'Muted earth tones, oversized slouch proportions, sans-serif embossed typography',
        pricePoint: '$$$$',
        palette: [
          { hex: '#4A4238', name: 'Washed Taupe' },
          { hex: '#A39B8B', name: 'Desert Dune' },
          { hex: '#1C1B1A', name: 'Vintage Black' },
        ],
        differentiationAgainst: 'Fear of God has high pricing barriers; your brand delivers high-concept functional footwear at accessible community drop tiers.',
        marketShare: 'High-fashion wholesale',
        mapCoords: { x: 60, y: 90 },
      },
      {
        name: 'Aimé Leon Dore',
        tagline: 'Queens culture & European tailoring',
        category: 'Heritage Streetwear',
        positioning: 'Premium Craft',
        visualStyle: 'Vintage varsity, rich botanical emeralds, 90s basketball nostalgia',
        pricePoint: '$$$',
        palette: [
          { hex: '#1F3A27', name: 'Queens Green' },
          { hex: '#9C252D', name: 'Varsity Crimson' },
          { hex: '#EADFC7', name: 'Vintage Paper' },
        ],
        differentiationAgainst: 'ALD leans on 90s retro sportswear; your brand pushes futuristic kinetic ergonomics and clean tech-forward fabrics.',
        marketShare: 'Cult status NYC & London',
        mapCoords: { x: -45, y: 70 },
      },
    ],
  },
  tech: {
    industry: 'AI & Developer Cloud Platform',
    userBrandCoords: { x: 90, y: 75 },
    competitors: [
      {
        name: 'Vercel',
        tagline: 'Develop. Preview. Ship.',
        category: 'Frontend Cloud & DX',
        positioning: 'Enterprise Tech',
        visualStyle: 'High-contrast monochrome, simple geometric triangle glyph, monospace accents',
        pricePoint: '$$$',
        palette: [
          { hex: '#000000', name: 'Pitch Black' },
          { hex: '#FFFFFF', name: 'White' },
          { hex: '#0070F3', name: 'Geist Blue' },
        ],
        differentiationAgainst: 'Vercel is web-deployment centric; your brand specializes in autonomous multi-agent systems and real-time generative acceleration.',
        marketShare: 'De-facto frontend cloud',
        mapCoords: { x: 75, y: 70 },
      },
      {
        name: 'Supabase',
        tagline: 'The open source Firebase alternative',
        category: 'Backend as a Service',
        positioning: 'Indie Cult',
        visualStyle: 'Neon emerald lightning glow, dark-mode terminal surfaces, hacker community spirit',
        pricePoint: '$$',
        palette: [
          { hex: '#3ECF8E', name: 'Supabase Emerald' },
          { hex: '#1C1C1C', name: 'Dark Void' },
          { hex: '#24B47E', name: 'Mint Neon' },
        ],
        differentiationAgainst: 'Supabase focuses on Postgres databases; your brand orchestrates reasoning loops and agent memory graphs.',
        marketShare: 'Developer favorite',
        mapCoords: { x: 70, y: 35 },
      },
      {
        name: 'Modal',
        tagline: 'Run generative AI at scale in the cloud',
        category: 'Serverless AI Compute',
        positioning: 'Enterprise Tech',
        visualStyle: 'Minimalist cyan/white, ultra-fast latency visualization, pure developer CLI focus',
        pricePoint: '$$$',
        palette: [
          { hex: '#00D1B2', name: 'Modal Cyan' },
          { hex: '#111827', name: 'Space Black' },
          { hex: '#6366F1', name: 'Indigo Cloud' },
        ],
        differentiationAgainst: 'Modal provides raw compute infrastructure; your brand offers an intelligent design and multi-agent workflow studio.',
        marketShare: 'Fastest growing AI infra',
        mapCoords: { x: 85, y: 65 },
      },
    ],
  },
  luxury: {
    industry: 'Haute Couture & Luxury Atelier',
    userBrandCoords: { x: -30, y: 95 },
    competitors: [
      {
        name: 'The Row',
        tagline: 'Subtle perfection & quiet luxury',
        category: 'Ultra-Luxury Fashion',
        positioning: 'Ultra-Luxury',
        visualStyle: 'Zero external logos, extreme fabric purity, austere editorial photography',
        pricePoint: '$$$$',
        palette: [
          { hex: '#000000', name: 'Obsidian' },
          { hex: '#EBEAE5', name: 'Alabaster' },
          { hex: '#7D7565', name: 'Raw Cashmere' },
        ],
        differentiationAgainst: 'The Row is unapproachable and traditional; your brand brings personal bespoke atelier customization with ethical transparency.',
        marketShare: 'Ultra-luxury benchmark',
        mapCoords: { x: -60, y: 95 },
      },
      {
        name: 'Khaite',
        tagline: 'Reimagining classic American sportswear',
        category: 'Contemporary Luxury',
        positioning: 'Ultra-Luxury',
        visualStyle: 'Sensual structural silhouettes, rich leather textures, warm cinematic lighting',
        pricePoint: '$$$$',
        palette: [
          { hex: '#2B231D', name: 'Rich Espresso' },
          { hex: '#D6C7B2', name: 'Oatmeal Silk' },
          { hex: '#873E23', name: 'Burnt Sienna' },
        ],
        differentiationAgainst: 'Khaite focuses on heavy winter knits; your brand champions fluid year-round capsule wardrobe essentials.',
        marketShare: 'Global luxury mainstay',
        mapCoords: { x: 10, y: 85 },
      },
    ],
  },
  skincare: {
    industry: 'Organic Skincare & Botanicals',
    userBrandCoords: { x: 15, y: 65 },
    competitors: [
      {
        name: 'Aesop',
        tagline: 'Formulations of the highest quality',
        category: 'Botanical Luxury Grooming',
        positioning: 'Premium Craft',
        visualStyle: 'Amber apothecary glass, poetic literary quotes, architectural sanctuary stores',
        pricePoint: '$$$',
        palette: [
          { hex: '#583D2A', name: 'Amber Glass' },
          { hex: '#C2B8A3', name: 'Linen Label' },
          { hex: '#2E2D2B', name: 'Botanical Noir' },
        ],
        differentiationAgainst: 'Aesop relies on commercial fragrance bases; your brand prioritizes wildcrafted cold-pressed bio-actives with verified clinical results.',
        marketShare: 'Global apothecary presence',
        mapCoords: { x: -30, y: 75 },
      },
      {
        name: 'Drunk Elephant',
        tagline: 'Clean clinical skincare with zero suspense',
        category: 'Clean Clinical Beauty',
        positioning: 'Premium Craft',
        visualStyle: 'Neon pastel caps on clinical white pump bottles, playful irreverent tone',
        pricePoint: '$$$',
        palette: [
          { hex: '#FF6F59', name: 'Neon Coral' },
          { hex: '#25C2A0', name: 'Fresh Mint' },
          { hex: '#FFFFFF', name: 'Clinical White' },
        ],
        differentiationAgainst: 'Drunk Elephant uses high-saturation plastic packaging; your brand uses zero-waste circular glass and minimalist tactile earth tones.',
        marketShare: 'Shiseido-owned mass luxury',
        mapCoords: { x: 60, y: 50 },
      },
    ],
  },
  productivity: {
    industry: 'Sustainable Productivity for Remote Teams',
    userBrandCoords: { x: 30, y: 75 },
    competitors: [
      {
        name: 'Notion',
        tagline: 'The all-in-one workspace for your notes, tasks, and wikis',
        category: 'Workspace Generalist Wiki',
        positioning: 'Enterprise Tech',
        visualStyle: 'Monochrome line icons, clean modular blocks, black & white paper aesthetic',
        pricePoint: '$$',
        palette: [
          { hex: '#000000', name: 'Ink Black' },
          { hex: '#FFFFFF', name: 'Canvas White' },
          { hex: '#E3E2E0', name: 'Border Grey' },
        ],
        differentiationAgainst: 'Notion is an overwhelming blank slate with infinite configuration drag; your brand provides opinionated calm workflows and zero-friction asynchronous rituals.',
        marketShare: 'Mass market (~35M+ users)',
        mapCoords: { x: -30, y: -20 },
      },
      {
        name: 'Linear',
        tagline: 'The issue tracker you will actually enjoy using',
        category: 'High-Velocity Developer Tool',
        positioning: 'Indie Cult',
        visualStyle: 'Dark mode, purple keyboard shortcuts, sleek sub-millisecond precision',
        pricePoint: '$$$',
        palette: [
          { hex: '#5E6AD2', name: 'Linear Indigo' },
          { hex: '#111217', name: 'Void Black' },
          { hex: '#8792A2', name: 'Muted Slate' },
        ],
        differentiationAgainst: 'Linear is engineered strictly for sprint-heavy software engineering; your brand champions human-centric async team life and cognitive balance.',
        marketShare: 'Top-tier tech startups',
        mapCoords: { x: 70, y: 40 },
      },
      {
        name: 'Sunsama',
        tagline: 'The digital daily planner for mindful work',
        category: 'Mindful Personal Planner',
        positioning: 'Premium Craft',
        visualStyle: 'Warm neutral tones, calm day-planning timeline, anti-burnout copy',
        pricePoint: '$$$',
        palette: [
          { hex: '#2C5E43', name: 'Forest Green' },
          { hex: '#F4EFE6', name: 'Warm Parchment' },
          { hex: '#D97706', name: 'Amber Focus' },
        ],
        differentiationAgainst: 'Sunsama is an individual daily planner; your brand builds shared team synchronization and collective energy budgeting.',
        marketShare: 'Niche solo professionals',
        mapCoords: { x: -40, y: 60 },
      },
    ],
  },
};

export function getCompetitorsForIndustry(industryStr: string): IndustryCompetitorSet {
  const query = (industryStr || '').toLowerCase();
  if (
    query.includes('sustain') ||
    query.includes('productiv') ||
    query.includes('remote') ||
    query.includes('focus') ||
    query.includes('watershed') ||
    query.includes('drift') ||
    query.includes('compass')
  ) {
    return COMPETITOR_DATABASE.productivity;
  }
  if (query.includes('coffee') || query.includes('cafe') || query.includes('roast') || query.includes('ceramiq')) {
    return COMPETITOR_DATABASE.coffee;
  }
  if (query.includes('streetwear') || query.includes('shoe') || query.includes('sneaker') || query.includes('apparel') || query.includes('cloth') || query.includes('kinetics')) {
    return COMPETITOR_DATABASE.streetwear;
  }
  if (query.includes('tech') || query.includes('ai') || query.includes('saas') || query.includes('cloud') || query.includes('software') || query.includes('synapse')) {
    return COMPETITOR_DATABASE.tech;
  }
  if (query.includes('luxury') || query.includes('atelier') || query.includes('couture') || query.includes('boutique') || query.includes('fashion') || query.includes('aurae')) {
    return COMPETITOR_DATABASE.luxury;
  }
  if (query.includes('skin') || query.includes('botanical') || query.includes('wellness') || query.includes('beauty') || query.includes('verdura')) {
    return COMPETITOR_DATABASE.skincare;
  }

  // Fallback dynamic set for custom niche
  return {
    industry: industryStr || 'Modern Venture',
    userBrandCoords: { x: 35, y: 70 },
    competitors: [
      {
        name: 'Legacy Incumbent',
        tagline: 'Standard industry offerings',
        category: 'Enterprise Incumbent',
        positioning: 'Mass Market',
        visualStyle: 'Conservative corporate blue, standard serif typography, generic stock assets',
        pricePoint: '$$',
        palette: [
          { hex: '#1E3A8A', name: 'Corporate Blue' },
          { hex: '#64748B', name: 'Slate' },
          { hex: '#F1F5F9', name: 'Light Gray' },
        ],
        differentiationAgainst: 'Incumbents are slow and bureaucratic; your brand is agile, user-centric, and design-led.',
        marketShare: '45% market share',
        mapCoords: { x: -60, y: -20 },
      },
      {
        name: 'Venture Challenger',
        tagline: 'Fast-moving modern alternative',
        category: 'Scale-Up Challenger',
        positioning: 'Premium Craft',
        visualStyle: 'Vibrant neon gradient, bold sans-serif, mobile-first design system',
        pricePoint: '$$$',
        palette: [
          { hex: '#6366F1', name: 'Indigo Pulse' },
          { hex: '#EC4899', name: 'Pink Glow' },
          { hex: '#0F172A', name: 'Pitch Dark' },
        ],
        differentiationAgainst: 'Challengers prioritize feature bloat; your brand excels in dedicated craft and bespoke quality.',
        marketShare: '15% rapid growth',
        mapCoords: { x: 70, y: 40 },
      },
    ],
  };
}
