import { groq, GROQ_MODEL } from '../config/groq';
import { checkSingleDomain } from './domain.service';
import type { BrandInput, BrandName, VisualDirection, ColorRole } from '@upstream/shared';

interface RawGeneratedItem {
  name: string;
  meaning: string;
  tagline: string;
  styleDescription: string;
  palette: Array<{
    hex: string;
    name: string;
    role: ColorRole;
  }>;
  fonts: {
    headline: string;
    body: string;
    headlineWeight?: string;
    bodyWeight?: string;
  };
}

interface GroqNamingResponse {
  names: RawGeneratedItem[];
}

/**
 * Validate and normalize the visual direction structure from LLM output
 */
function normalizeVisualDirection(item: RawGeneratedItem): VisualDirection {
  const roles: ColorRole[] = ['primary', 'secondary', 'accent', 'background', 'text'];
  const defaultColors = [
    { hex: '#1E293B', name: 'Deep Slate', role: 'primary' as ColorRole },
    { hex: '#3B82F6', name: 'Electric Blue', role: 'secondary' as ColorRole },
    { hex: '#10B981', name: 'Emerald Accent', role: 'accent' as ColorRole },
    { hex: '#F8FAFC', name: 'Off White', role: 'background' as ColorRole },
    { hex: '#0F172A', name: 'Charcoal Text', role: 'text' as ColorRole },
  ];

  let palette = Array.isArray(item.palette) ? item.palette : [];
  if (palette.length < 5) {
    palette = defaultColors;
  } else {
    palette = palette.slice(0, 5).map((c, idx) => ({
      hex: c.hex?.startsWith('#') ? c.hex : `#${c.hex || '000000'}`,
      name: c.name || `Color ${idx + 1}`,
      role: roles[idx] || 'primary',
    }));
  }

  return {
    palette,
    fonts: {
      headline: item.fonts?.headline || 'Inter',
      body: item.fonts?.body || 'Roboto',
      headlineWeight: item.fonts?.headlineWeight || '700',
      bodyWeight: item.fonts?.bodyWeight || '400',
    },
    styleDescription:
      item.styleDescription || 'Modern, clean, and distinct visual identity with balanced typography.',
  };
}

/**
 * Call Groq (llama-3.3-70b / OSS 120B) to generate brand names and visual identities
 */
export async function generateBrandNames(
  input: BrandInput,
  count = 12
): Promise<BrandName[]> {
  const systemPrompt = `You are a world-class brand strategist, naming consultant, and art director.
You generate highly distinctive, memorable brand names with strategic taglines and cohesive visual identities.
ALWAYS respond with valid, parseable JSON conforming strictly to the requested schema. No markdown backticks, no conversational preamble.`;

  const userPrompt = `Generate exactly ${count} diverse and creative brand names for the following business:

- Business Idea / Inspiration: ${input.businessName || 'New venture'}
- Industry: ${input.industry}
- Target Audience: ${input.targetAudience}
- Core Mission & Values: ${input.mission}
- Desired Brand Tone: ${input.tone}
- Constraints & Guidelines: ${input.constraints || 'None'}

Names must be diverse in style (invented/neologisms, compound words, descriptive, evocative, and metaphoric).
Each name must be under 12 characters, easy to pronounce, and commercially viable.

Respond in this exact JSON structure:
{
  "names": [
    {
      "name": "Verdant",
      "meaning": "Derived from latin for green, evoking sustainable growth and freshness.",
      "tagline": "Rooted in tomorrow's productivity.",
      "styleDescription": "Crisp geometric aesthetic with biophilic tones and high legibility.",
      "palette": [
        { "hex": "#1B4332", "name": "Deep Forest", "role": "primary" },
        { "hex": "#40916C", "name": "Sage Green", "role": "secondary" },
        { "hex": "#D8F3DC", "name": "Mint Glaze", "role": "accent" },
        { "hex": "#F8F9FA", "name": "Canvas Snow", "role": "background" },
        { "hex": "#081C15", "name": "Dark Moss", "role": "text" }
      ],
      "fonts": {
        "headline": "Plus Jakarta Sans",
        "body": "Inter",
        "headlineWeight": "700",
        "bodyWeight": "400"
      }
    }
  ]
}`;

  let attempts = 0;
  let lastError: any = null;

  while (attempts < 2) {
    attempts++;
    try {
      const response = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_tokens: 3500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Groq returned empty response');
      }

      const parsed: GroqNamingResponse = JSON.parse(content);
      if (!parsed.names || !Array.isArray(parsed.names)) {
        throw new Error('Groq response missing "names" array');
      }

      return parsed.names.map((item, index) => ({
        id: `name_${Date.now()}_${index + 1}`,
        name: item.name.trim(),
        meaning: item.meaning || '',
        tagline: item.tagline || '',
        domainAvailability: checkSingleDomain(item.name.trim()),
        visualDirection: normalizeVisualDirection(item),
      }));
    } catch (err) {
      lastError = err;
      console.warn(`[GroqService] Attempt ${attempts} failed:`, err);
    }
  }

  throw new Error(`Failed to generate brand names with Groq: ${lastError?.message || 'Unknown error'}`);
}
