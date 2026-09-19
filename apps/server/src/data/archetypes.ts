/**
 * Archetype UI Card Definitions (Step 3: Visual Direction)
 * 
 * Provides metadata, human-readable descriptions, industry recommendations,
 * and reference brand exemplars to render interactive selection cards in the multi-step form.
 */

import { ArchetypeUICard, LogoArchetype } from '../types/logo.types';

export const ARCHETYPE_CARDS: ArchetypeUICard[] = [
  {
    id: 'abstract',
    title: 'Abstract Mark',
    tagline: 'Conceptual Geometric Symbolism',
    description:
      'Uses geometric shapes, mathematical balance, and non-representational forms to express a big conceptual idea without literal pictures.',
    bestForIndustries: ['FinTech', 'SaaS & Cloud', 'AI & Deep Tech', 'Corporate Finance', 'Logistics'],
    keyVisualTraits: ['Rotational symmetry', 'Clean Euclidean vectors', 'Dynamic negative space', 'High scalability'],
    famousExamples: [
      { name: 'Chase Bank', imageFile: 'Chase-logo.jpg' },
      { name: 'MasterCard', imageFile: 'MasterCard-Logo.png' },
      { name: 'Spotify', imageFile: 'Spotify-logo.jpeg' },
      { name: 'Toyota', imageFile: 'Toyota-logo.png' }
    ],
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    iconName: 'Shapes'
  },
  {
    id: 'combination',
    title: 'Combination Mark',
    tagline: 'Unified Symbol + Wordmark',
    description:
      'The most versatile logo structure. Pairs an iconic standalone graphic symbol alongside custom typography, giving you both brand recognition and name clarity.',
    bestForIndustries: ['E-Commerce', 'Sportswear', 'Consumer Tech', 'Retail', 'Telecom'],
    keyVisualTraits: ['Versatile dual-asset usage', 'Harmonized visual weights', 'Independent lockups', 'High trademark viability'],
    famousExamples: [
      { name: 'Amazon', imageFile: 'Amazon-Logo.png' },
      { name: 'Huawei', imageFile: 'Huawei-logo.jpeg' },
      { name: 'Puma', imageFile: 'Puma-Logo..png' }
    ],
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    iconName: 'Layers'
  },
  {
    id: 'emblems',
    title: 'Emblem / Badge',
    tagline: 'Encapsulated Crests & Heritage Seals',
    description:
      'Encloses the brand name, symbols, and details within a unified badge, shield, or crest. Evokes tradition, prestige, authority, and craftsmanship.',
    bestForIndustries: ['Luxury Automotive', 'Universities', 'Beverages & Breweries', 'Heritage Brands', 'Motorsports'],
    keyVisualTraits: ['Encapsulated geometric boundary', 'Heraldic symmetry', 'Metallic / enamel finishes', 'Ornate micro-detailing'],
    famousExamples: [
      { name: 'Porsche', imageFile: 'Porsche-Logo.png' },
      { name: 'Harley-Davidson', imageFile: 'harley-davidson-logo.png' },
      { name: 'Warner Bros.', imageFile: 'Warner-Brothers-Logo.jpg' },
      { name: 'Nivea', imageFile: 'Nivea-logo.png' }
    ],
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    iconName: 'Shield'
  },
  {
    id: 'lettermark',
    title: 'Lettermark / Monogram',
    tagline: 'Iconic Initials & Typographic Ligatures',
    description:
      'Transforms the initial letters or acronym of your brand into an architectural monogram. Perfect for long company names seeking instant recognition.',
    bestForIndustries: ['Media & Entertainment', 'Fashion & Apparel', 'Consumer Conglomerates', 'Fast Food & QSR'],
    keyVisualTraits: ['Architectural kerning', 'Geometric stencil cuts', 'High contrast ligatures', 'Favicon friendly'],
    famousExamples: [
      { name: 'HBO', imageFile: 'HBO-logo.png' },
      { name: 'H&M', imageFile: 'Hennes-logo.jpg' },
      { name: 'Unilever', imageFile: 'Unilever-logo.jpg' },
      { name: "McDonald's", imageFile: 'images.png' }
    ],
    badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    iconName: 'Type'
  },
  {
    id: 'mascot',
    title: 'Mascot Mark',
    tagline: 'Illustrated Character & Brand Ambassador',
    description:
      'Features a stylized character, persona, or illustrated ambassador. Creates warm emotional bonds, high memorability, and friendly customer engagement.',
    bestForIndustries: ['Fast Casual & Snacks', 'Kids & Family', 'SaaS Tools', 'Sports Franchises', 'Gaming'],
    keyVisualTraits: ['Character facial expressiveness', 'Clean bold vector strokes', 'Approachable warmth', 'Merchandise-ready'],
    famousExamples: [
      { name: 'Mailchimp (Freddie)', imageFile: 'Mailchimp-logo.png' },
      { name: 'KFC (Colonel Sanders)', imageFile: 'KFC-logo.png' },
      { name: 'Michelin (Bibendum)', imageFile: 'Michelin-logo.png' },
      { name: 'Pringles (Julius)', imageFile: 'Pringles-logo.png' }
    ],
    badgeColor: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    iconName: 'Smile'
  },
  {
    id: 'pictorial',
    title: 'Pictorial Mark',
    tagline: 'Literal & Stylized Visual Symbols',
    description:
      'Uses a stylized illustration of a recognizable real-world object or creature. Delivers instant metaphorical meaning and global comprehension.',
    bestForIndustries: ['Consumer Electronics', 'Apparel & Lifestyle', 'Energy & Petroleum', 'Conservation & Non-Profit'],
    keyVisualTraits: ['Golden ratio curves', 'Negative space figure-ground interplay', 'Literal visual metaphor', 'Iconic silhouette'],
    famousExamples: [
      { name: 'Apple', imageFile: 'Apple-Logo.png' },
      { name: 'Lacoste', imageFile: 'Lacoste-logo.jpg' },
      { name: 'Shell', imageFile: 'Shell-Logo.jpg' },
      { name: 'WWF', imageFile: 'WWF-logo.png' }
    ],
    badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    iconName: 'Sparkles'
  },
  {
    id: 'wordmark',
    title: 'Wordmark / Logotype',
    tagline: 'Pure Typographic Identity',
    description:
      'Relies purely on custom-designed typographic letterforms without an accompanying graphic icon. Focuses all attention squarely on your brand name.',
    bestForIndustries: ['Beverages & FMCG', 'Toys & Entertainment', 'Media Conglomerates', 'Luxury Goods', 'Direct-to-Consumer'],
    keyVisualTraits: ['Custom script flourishes', 'Distinctive letter kerning', 'Heavy optical weight', 'Unmatched name retention'],
    famousExamples: [
      { name: 'Coca-Cola', imageFile: 'Coca-Cola-logo.jpg' },
      { name: 'LEGO', imageFile: 'Logo-lego.jpg' },
      { name: 'Disney', imageFile: 'images.jpeg' }
    ],
    badgeColor: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    iconName: 'PenTool'
  }
];

export function getArchetypeCard(archetypeId: LogoArchetype): ArchetypeUICard {
  const card = ARCHETYPE_CARDS.find(c => c.id === archetypeId);
  return card || ARCHETYPE_CARDS[0];
}
