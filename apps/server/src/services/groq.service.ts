import { groq, GROQ_MODEL } from '../config/groq';
import { chatCompletion } from './chatProvider.service';
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
      const completion = await chatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        jsonMode: true,
        temperature: 0.8,
        // Scaled to the request: a fixed 3500-token ceiling per naming call was
        // eating the 8000 tokens/minute budget and starving the agent's tool
        // loop of the tokens it needs to call image generation.
        max_tokens: Math.min(3500, 900 + count * 240),
      });

      const content = completion.choices[0]?.message?.content;
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

export interface AgentChatParams {
  message: string;
  history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
  currentContext?: {
    step?: number;
    industry?: string;
    tone?: string;
    targetAudience?: string;
    mission?: string;
    selectedName?: string;
  };
}

export interface AgentChatResult {
  reply: string;
  suggestions?: string[];
  detectedIntent: 'greeting' | 'new_brand' | 'refine' | 'question';
  extractedBrief?: {
    businessName?: string;
    industry?: string;
    tone?: string;
    targetAudience?: string;
    mission?: string;
  };
}

/**
 * Handle conversational interactions with the Upstream AI Brand Director using Groq (GPT OSS 120B)
 */
export async function chatWithAgent(params: AgentChatParams): Promise<AgentChatResult> {
  const { message, history = [], currentContext = {} } = params;

  const contextStr = currentContext.industry
    ? `\nCurrent project state:\n- Active Venture/Industry: ${currentContext.industry}\n- Tone: ${currentContext.tone || 'Not set'}\n- Selected Name: ${currentContext.selectedName || 'None'}\n- Workflow Step: ${currentContext.step || 1}`
    : '\nNo active brand project yet.';

  const systemPrompt = `You are the Upstream AI Brand Director and Creative Strategist.
Your goal is to guide the user in crafting remarkable, distinctive brand identities (brand names, taglines, color palettes, typography, and logos).
${contextStr}

You must ALWAYS respond with valid, parseable JSON conforming strictly to this format:
{
  "reply": "Your helpful, creative, and professional Markdown reply directly addressing the user.",
  "suggestions": ["2-3 short, relevant follow-up action chips"],
  "detectedIntent": "greeting" | "new_brand" | "refine" | "question",
  "extractedBrief": {
    "businessName": "Brand name if user explicitly specified one, otherwise empty",
    "industry": "Clean, descriptive industry category (e.g., Specialty Coffee Roastery, Developer Cloud Platform, Sustainable Streetwear)",
    "tone": "playful | bold | minimalist | luxurious | tech-forward",
    "targetAudience": "Target audience description",
    "mission": "Core mission or value proposition"
  }
}

Guidelines:
1. If the user is greeting or saying hello ("hi", "hello", "hey"), set detectedIntent to "greeting", set extractedBrief fields to empty strings, and warmly ask what kind of business they are planning to launch.
2. If the user describes a new business idea or venture, set detectedIntent to "new_brand", extract a rich brief into extractedBrief, and reply with encouraging creative direction.
3. If the user asks for a refinement (e.g. "make it more luxury", "try darker colors", "give me bolder names"), set detectedIntent to "refine", adjust tone/brief accordingly, and explain how the identity can evolve.
4. Keep the Markdown in "reply" engaging, clear, with good typographic hierarchy.`;

  const messages: any[] = [{ role: 'system', content: systemPrompt }];

  // Include recent conversation turns
  const recentHistory = history.slice(-4);
  for (const h of recentHistory) {
    messages.push({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.text,
    });
  }

  messages.push({ role: 'user', content: message });

  try {
    const completion = await chatCompletion({
      messages,
      jsonMode: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Groq returned an empty chat response');
    }

    const parsed = JSON.parse(content);
    return {
      reply: parsed.reply || 'How can I help you shape your brand identity today?',
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : ['Start a new brand', 'Ask for advice'],
      detectedIntent: parsed.detectedIntent || 'question',
      extractedBrief: parsed.extractedBrief || {},
    };
  } catch (err: any) {
    console.error('[GroqService] chatWithAgent error:', err.message);
    throw err;
  }
}
