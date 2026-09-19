/**
 * Agent tool catalog + executors.
 *
 * These are the hands the chat model gets. Groq's `openai/gpt-oss-120b`
 * decides *when* to call them; this module decides *what they actually do*.
 *
 * Design rules:
 *  - A tool never throws. It returns `{ ok: false, error }` so the model can
 *    explain the failure in prose instead of the request 500-ing.
 *  - Tools that mutate state return the resulting snapshot, so the model can
 *    describe the new state truthfully instead of guessing.
 *  - Nothing here deletes or clears user-visible sections. Updates are always
 *    partial merges — the canvas must never lose a section it already had.
 */

import * as firebaseService from './firebase.service';
import { generateBrandNames } from './groq.service';
import { logoService } from './logo.service';
import { checkDomains } from './domain.service';
import { describeImage, resolveImageToBase64, saveImageBuffer } from './image.service';
import { listAssets, saveAsset, type AssetKind } from './assetStore.service';
import type { BrandInput, BrandName, BrandTone } from '@upstream/shared';

export interface ToolContext {
  projectId?: string;
}

export interface ToolResult {
  ok: boolean;
  [key: string]: unknown;
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// OpenAI / Groq function-calling schema
// ─────────────────────────────────────────────────────────────────────────────

export const AGENT_TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'generate_brand_names',
      description:
        'Generate real brand names with meanings, taglines and full visual direction (5-colour palette + font pairing). Use whenever the user needs names, or asks for more/other/bolder/luxury names.',
      parameters: {
        type: 'object',
        properties: {
          industry: { type: 'string', description: 'Industry or venture category.' },
          targetAudience: { type: 'string', description: 'Who the brand serves.' },
          mission: { type: 'string', description: 'Mission / value proposition.' },
          tone: {
            type: 'string',
            enum: ['playful', 'professional', 'minimalist', 'bold', 'tech-forward', 'luxurious'],
          },
          constraints: { type: 'string', description: 'Anything the names must respect.' },
          count: { type: 'integer', description: 'How many names (1-12). Default 8.' },
        },
        required: ['industry'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'generate_logo_concepts',
      description:
        'Generate real logo artwork with FLUX.2 [dev]. Returns concept images with URLs. Use when the user asks to create, redraw, refine or restyle a logo mark.',
      parameters: {
        type: 'object',
        properties: {
          brandName: {
            type: 'string',
            description: 'Exact brand name to render in the wordmark. Required.',
          },
          archetypeId: {
            type: 'string',
            enum: ['abstract', 'combination', 'emblems', 'lettermark', 'mascot', 'pictorial', 'wordmark'],
            description: 'Logo archetype. Default abstract.',
          },
          mode: {
            type: 'string',
            enum: ['scratch', 'template'],
            description:
              'scratch = invent from the archetype blueprint; template = adapt a reference mark (needs a reference image). Default scratch.',
          },
          preferredColors: {
            type: 'array',
            items: { type: 'string' },
            description: 'Hex colours to use, e.g. ["#0F172A","#F59E0B"].',
          },
          styleKeywords: { type: 'string', description: 'Aesthetic cues, e.g. "minimal, geometric".' },
          fontStyle: { type: 'string', description: 'Typography direction, e.g. "geometric sans-serif".' },
          industry: { type: 'string' },
          count: { type: 'integer', description: 'Number of concepts (1-4). Default 2.' },
        },
        required: ['brandName'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'generate_logo_suite',
      description:
        'Generate one real FLUX.2 [dev] mark per studio logo style in a single call, keyed by style name (minimal, wordmark, abstract, geometric, illustrative). Use this when the user wants the full set of logo directions / "all five styles" / to fill the logo chooser. Prefer it over calling generate_logo_concepts repeatedly.',
      parameters: {
        type: 'object',
        properties: {
          brandName: { type: 'string', description: 'Exact brand name. Required.' },
          styles: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['minimal', 'wordmark', 'abstract', 'geometric', 'illustrative'],
            },
            description: 'Which styles to render. Omit for all five.',
          },
          preferredColors: { type: 'array', items: { type: 'string' } },
          tagline: { type: 'string' },
          industry: { type: 'string' },
          styleKeywords: { type: 'string' },
          projectId: { type: 'string' },
        },
        required: ['brandName'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'describe_image',
      description:
        'Read an image with Qwen 3.8 27B vision (Cloudflare) and return a detailed description. Use for uploaded certificates, logos, screenshots or reference marks before acting on them.',
      parameters: {
        type: 'object',
        properties: {
          image: {
            type: 'string',
            description: 'Image as a data URI, a public URL, or raw base64.',
          },
          brandName: { type: 'string', description: 'Optional brand context for the description.' },
        },
        required: ['image'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'check_domain_availability',
      description: 'Check .com/.io/.co and social handle availability for a list of candidate names.',
      parameters: {
        type: 'object',
        properties: {
          names: { type: 'array', items: { type: 'string' }, description: 'Candidate names.' },
        },
        required: ['names'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'update_brand_kit',
      description:
        'Change one field of the current brand kit. Partial update only — other fields and canvas sections are preserved. Use whenever the user asks to rename, retagline, retone or re-brief the brand.',
      parameters: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
            enum: [
              'businessName',
              'industry',
              'targetAudience',
              'mission',
              'tone',
              'constraints',
              'tagline',
            ],
          },
          value: { type: 'string', description: 'New value for the field.' },
          projectId: { type: 'string', description: 'Target project id. Optional.' },
        },
        required: ['field', 'value'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'save_brand_asset',
      description:
        'Store an asset against the project: a generated logo, a certificate, a reference upload, a palette or an exported kit. For an image that already has a URL (e.g. a logo you just generated) pass that URL in "url". Only use "image" for brand-new uploads (data URI or base64).',
      parameters: {
        type: 'object',
        properties: {
          kind: {
            type: 'string',
            enum: ['logo', 'certificate', 'reference', 'palette', 'kit', 'other'],
          },
          label: { type: 'string', description: 'Human-readable label.' },
          url: {
            type: 'string',
            description: 'Existing image URL — use this for logos the tools already generated.',
          },
          image: {
            type: 'string',
            description: 'Data URI or base64 for a NEW upload only. Do not put URLs here.',
          },
          data: { type: 'object', description: 'Structured payload, e.g. certificate fields.' },
          tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['kind', 'label'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'list_brand_assets',
      description:
        'List stored assets for the project, optionally filtered by kind. Omit "kind" entirely to list everything — never pass null.',
      parameters: {
        type: 'object',
        properties: {
          kind: {
            type: 'string',
            enum: ['logo', 'certificate', 'reference', 'palette', 'kit', 'other'],
          },
        },
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_project_state',
      description: 'Read the current brand kit: brief, generated names, selected name and assets.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'export_brand_kit',
      description:
        'Assemble the full brand kit (brief, name, palette, fonts, logos, assets) as JSON or Markdown. Omit "format" to get JSON — never pass null.',
      parameters: {
        type: 'object',
        properties: {
          format: { type: 'string', enum: ['json', 'markdown'] },
        },
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'set_canvas_state',
      description:
        'Adjust the canvas/artboard presentation (surface, fonts, sizes, tracking, ink). Send only the keys that change — every other canvas section stays exactly as it is.',
      parameters: {
        type: 'object',
        properties: {
          surface: { type: 'string', enum: ['light', 'linen', 'dark', 'brand'] },
          headlineFont: { type: 'string' },
          wordmarkSize: { type: 'number', description: 'px, 12-120' },
          taglineSize: { type: 'number', description: 'px, 8-48' },
          fontWeight: { type: 'number', description: '100-900' },
          letterSpacing: { type: 'number', description: 'em, -0.1 to 0.5' },
          textColor: { type: 'string', description: 'Hex ink colour' },
        },
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'generate_brand_certificate',
      description:
        'Generate an official Certificate of Brand Authenticity or Trademark Registration using FLUX.2 [dev]. Creates an ornate, museum-quality certificate document image and persists it to project assets. Use when the user asks for a certificate, credentials, trademark or authentication document.',
      parameters: {
        type: 'object',
        properties: {
          brandName: { type: 'string', description: 'Brand name on certificate. Required.' },
          tagline: { type: 'string', description: 'Brand tagline or motto.' },
          industry: { type: 'string', description: 'Venture category.' },
          type: {
            type: 'string',
            enum: ['authenticity', 'trademark', 'founding', 'excellence'],
            description: 'Certificate type. Default authenticity.',
          },
        },
        required: ['brandName'],
      },
    },
  },
] as const;

export type AgentToolName =
  | 'generate_brand_names'
  | 'generate_logo_concepts'
  | 'generate_logo_suite'
  | 'generate_brand_certificate'
  | 'describe_image'
  | 'check_domain_availability'
  | 'update_brand_kit'
  | 'save_brand_asset'
  | 'list_brand_assets'
  | 'get_project_state'
  | 'export_brand_kit'
  | 'set_canvas_state';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const TONES: BrandTone[] = [
  'playful',
  'professional',
  'minimalist',
  'bold',
  'tech-forward',
  'luxurious',
];

function asTone(value: unknown): BrandTone {
  const v = String(value || '').toLowerCase().trim() as BrandTone;
  return TONES.includes(v) ? v : 'bold';
}

/** Find the newest project, so tools work even when the client sends no id. */
async function resolveProject(ctx: ToolContext) {
  if (ctx.projectId) {
    const found = await firebaseService.getProject(ctx.projectId);
    if (found) return found;
  }
  const recent = await firebaseService.listProjects(1);
  return recent[0] ?? null;
}

async function ensureProject(ctx: ToolContext, seed?: Partial<BrandInput>) {
  const existing = await resolveProject(ctx);
  if (existing) return existing;

  const input: BrandInput = {
    businessName: seed?.businessName ?? '',
    industry: seed?.industry ?? 'New venture',
    targetAudience: seed?.targetAudience ?? 'Modern discerning consumers',
    mission: seed?.mission ?? 'Build a memorable, distinctive brand.',
    tone: seed?.tone ?? 'bold',
    constraints: seed?.constraints ?? '',
  };

  const id = await firebaseService.saveProject({ input, generatedNames: [] });
  const created = await firebaseService.getProject(id);
  return created;
}

/** Strip bulky inline image data before handing state to the model. */
function compactProject(project: any) {
  if (!project) return null;
  return {
    projectId: project.id,
    input: project.input,
    selectedName: project.selectedName
      ? {
          name: project.selectedName.name,
          tagline: project.selectedName.tagline,
          palette: project.selectedName.visualDirection?.palette,
          fonts: project.selectedName.visualDirection?.fonts,
        }
      : null,
    generatedNameCount: project.generatedNames?.length ?? 0,
    generatedNames: (project.generatedNames ?? []).slice(0, 12).map((n: BrandName) => ({
      name: n.name,
      tagline: n.tagline,
      meaning: n.meaning,
    })),
    logoConcepts: (project.logoConcepts ?? []).slice(0, 6).map((l: any) => ({
      id: l.id,
      url: l.url,
      style: l.style,
      mode: l.mode,
    })),
    selectedLogo: project.selectedLogo
      ? { id: project.selectedLogo.id, url: project.selectedLogo.url }
      : null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Executors
// ─────────────────────────────────────────────────────────────────────────────

async function toolGenerateBrandNames(args: any, ctx: ToolContext): Promise<ToolResult> {
  const input: BrandInput = {
    businessName: String(args.businessName || ''),
    industry: String(args.industry || 'New venture'),
    targetAudience: String(args.targetAudience || 'Modern discerning consumers'),
    mission: String(args.mission || 'Build a memorable, distinctive brand.'),
    tone: asTone(args.tone),
    constraints: String(args.constraints || ''),
  };
  const count = Math.max(1, Math.min(Number(args.count) || 8, 12));

  const names = await generateBrandNames(input, count);

  const project = await ensureProject(ctx, input);
  if (project) {
    await firebaseService.updateProject(project.id, {
      input,
      generatedNames: names,
      selectedName: project.selectedName ?? names[0],
    });
    ctx.projectId = project.id;
  }

  return {
    ok: true,
    projectId: project?.id,
    count: names.length,
    names: names.map((n) => ({
      id: n.id,
      name: n.name,
      meaning: n.meaning,
      tagline: n.tagline,
      palette: n.visualDirection?.palette,
      fonts: n.visualDirection?.fonts,
      domains: n.domainAvailability,
    })),
  };
}

async function toolGenerateLogoConcepts(args: any, ctx: ToolContext): Promise<ToolResult> {
  const brandName = String(args.brandName || '').trim();
  if (!brandName) return { ok: false, error: 'brandName is required to draw a logo.' };

  const project = await ensureProject(ctx, { industry: args.industry });
  const reference = project?.selectedName;

  const concepts = await logoService.generateLogos({
    projectId: project?.id ?? 'unassigned',
    selectedName: {
      id: 'agent_selected',
      name: brandName,
      meaning: '',
      tagline: args.tagline || '',
      domainAvailability: { com: true, io: true, co: true, handle: { twitter: true, instagram: true } },
      visualDirection: {
        palette: (args.preferredColors ?? []).map((hex: string, i: number) => ({
          hex,
          name: `Colour ${i + 1}`,
          role: (['primary', 'secondary', 'accent', 'background', 'text'] as const)[i] ?? 'primary',
        })),
        fonts: { headline: 'Outfit', body: 'Inter', headlineWeight: '700', bodyWeight: '400' },
        styleDescription: String(args.styleKeywords || ''),
      },
    },
    mode: args.mode === 'template' ? 'template' : 'scratch',
    archetypeId: String(args.archetypeId || 'abstract'),
    preferredColors: Array.isArray(args.preferredColors) ? args.preferredColors : undefined,
    styleKeywords: String(args.styleKeywords || reference?.visualDirection?.styleDescription || ''),
    fontStyle: String(args.fontStyle || reference?.visualDirection?.fonts?.headline || ''),
    industry: String(args.industry || project?.input?.industry || ''),
    count: Math.max(1, Math.min(Number(args.count) || 2, 4)),
  });

  // Persist every concept so it is not lost when the reply is dismissed.
  const stored = concepts.map((c) =>
    saveAsset({
      projectId: project?.id ?? 'unassigned',
      kind: 'logo',
      label: `${brandName} — ${c.style}`,
      url: c.url.startsWith('http') || c.url.startsWith('/') ? c.url : undefined,
      dataUri: c.url.startsWith('data:') ? c.url : undefined,
      data: { prompt: c.prompt, style: c.style, mode: c.mode, model: c.model },
      tags: ['agent-generated'],
    })
  );

  if (project) {
    const existing = project.logoConcepts ?? [];
    await firebaseService.updateProject(project.id, {
      logoConcepts: [...concepts, ...existing].slice(0, 24),
    });
  }

  return {
    ok: true,
    projectId: project?.id,
    brandName,
    logos: concepts.map((c, i) => ({
      id: c.id,
      url: c.url.startsWith('data:') ? '(inline base64 image)' : c.url,
      assetId: stored[i]?.id,
      style: c.style,
      mode: c.mode,
      provider: c.model,
    })),
  };
}

async function toolGenerateLogoSuite(args: any, ctx: ToolContext): Promise<ToolResult> {
  const brandName = String(args.brandName || '').trim();
  if (!brandName) return { ok: false, error: 'brandName is required to build a logo suite.' };

  const project = await ensureProject(ctx, { industry: args.industry });
  const selected = project?.selectedName;

  const { generateLogoSuite } = await import('./logoSuite.service');
  const suite = await generateLogoSuite({
    brandName,
    styles: Array.isArray(args.styles) ? args.styles : undefined,
    preferredColors: Array.isArray(args.preferredColors)
      ? args.preferredColors
      : selected?.visualDirection?.palette?.map((c: any) => c.hex),
    industry: String(args.industry || project?.input?.industry || ''),
    tagline: String(args.tagline || selected?.tagline || ''),
    styleKeywords: String(args.styleKeywords || ''),
    projectId: project?.id ?? ctx.projectId ?? 'unassigned',
    countPerStyle: 1,
  });

  if (project && suite.logos.length > 0) {
    const existing = project.logoConcepts ?? [];
    await firebaseService.updateProject(project.id, {
      logoConcepts: [
        ...suite.logos.map((l) => ({
          id: l.id,
          url: l.url,
          prompt: l.prompt,
          style: l.style,
          model: 'flux' as const,
          mode: 'scratch' as const,
        })),
        ...existing,
      ].slice(0, 24),
    });
  }

  return {
    ok: suite.logos.length > 0,
    projectId: project?.id,
    brandName,
    generatedStyles: Object.keys(suite.byStyle),
    byStyle: suite.byStyle,
    failures: suite.failures,
    error: suite.logos.length === 0 ? 'No style could be rendered.' : undefined,
    note: 'byStyle is keyed by the studio style names — each value is a ready image URL.',
  };
}

async function toolGenerateBrandCertificate(args: any, ctx: ToolContext): Promise<ToolResult> {
  const brandName = String(args.brandName || '').trim();
  if (!brandName) return { ok: false, error: 'brandName is required to issue a certificate.' };

  const project = await ensureProject(ctx, { industry: args.industry });
  const tagline = args.tagline || project?.selectedName?.tagline || '';
  const industry = args.industry || project?.input?.industry || '';
  const certType = String(args.type || 'authenticity');

  const prompt = `Official Certificate of Brand ${certType.toUpperCase()} for "${brandName}". ${
    tagline ? `Tagline: "${tagline}". ` : ''
  }${industry ? `Sector: ${industry}. ` : ''}A magnificent corporate parchment certificate document, ornate guilloche security borders, gold-foil embossed medallion seal stamp, elegant copperplate calligraphy typography, museum lighting, ultra high detail, 8k resolution.`;

  const { generateImageAssets } = await import('./image.service');
  const assets = await generateImageAssets(prompt, 1, 'certificate');
  if (assets.length === 0) {
    return { ok: false, error: 'FLUX.2 could not generate the certificate artwork.' };
  }

  const generated = assets[0];
  const saved = saveAsset({
    projectId: project?.id ?? 'unassigned',
    kind: 'certificate',
    label: `${brandName} — Certificate of ${certType}`,
    url: generated.url,
    dataUri: generated.dataUri,
    data: { prompt, certType, brandName, tagline, industry, provider: generated.provider },
    tags: ['certificate', 'agent-generated'],
  });

  return {
    ok: true,
    projectId: project?.id,
    brandName,
    certificateType: certType,
    certificateUrl: generated.url,
    assetId: saved.id,
    label: saved.label,
  };
}

async function toolDescribeImage(args: any): Promise<ToolResult> {
  const image = String(args.image || '');
  if (!image) return { ok: false, error: 'No image supplied.' };

  const { description, model } = await describeImage(image, args.brandName);
  if (!description) {
    return { ok: false, error: 'Vision model returned no description (check Cloudflare credentials).' };
  }
  return { ok: true, model, description };
}

async function toolCheckDomains(args: any): Promise<ToolResult> {
  const names: string[] = Array.isArray(args.names) ? args.names.map((n: any) => String(n)) : [];
  if (names.length === 0) return { ok: false, error: 'Provide at least one name.' };
  return { ok: true, results: checkDomains(names.slice(0, 20)) };
}

async function toolUpdateBrandKit(args: any, ctx: ToolContext): Promise<ToolResult> {
  const field = String(args.field || '');
  const value = String(args.value ?? '');
  if (!field) return { ok: false, error: 'field is required.' };

  const project = await ensureProject(ctx);
  if (!project) return { ok: false, error: 'No project available to update.' };

  const patch: Record<string, unknown> = {};

  if (field === 'tagline') {
    const selected = project.selectedName ?? project.generatedNames?.[0];
    if (!selected) {
      // No name chosen yet: keep the tagline as a pending note on the brief.
      patch.input = { ...project.input, constraints: value };
    } else {
      patch.selectedName = { ...selected, tagline: value };
    }
  } else if (field === 'tone') {
    patch.input = { ...project.input, tone: asTone(value) };
  } else if (['businessName', 'industry', 'targetAudience', 'mission', 'constraints'].includes(field)) {
    patch.input = { ...project.input, [field]: value };
  } else {
    return { ok: false, error: `Unknown field "${field}".` };
  }

  await firebaseService.updateProject(project.id, patch as any);
  const updated = await firebaseService.getProject(project.id);

  return {
    ok: true,
    projectId: project.id,
    updatedField: field,
    updatedValue: value,
    project: compactProject(updated),
    note: 'Partial update applied. All other fields and canvas sections were left untouched.',
  };
}

async function toolSaveBrandAsset(args: any, ctx: ToolContext): Promise<ToolResult> {
  const kind = (String(args.kind || 'other') as AssetKind) ?? 'other';
  const label = String(args.label || `${kind} asset`);
  const project = await ensureProject(ctx);
  const projectId = project?.id ?? ctx.projectId ?? 'unassigned';

  let url: string | undefined = args.url ? String(args.url) : undefined;
  let dataUri: string | undefined;

  const rawImage = args.image ? String(args.image) : '';

  // The model often hands back a URL in the `image` field — treat it as a URL
  // rather than trying to decode it. Re-uploading a hosted image only creates
  // a duplicate file.
  const looksLikeUrl = /^(https?:\/\/|\/)/i.test(rawImage);
  if (!url && looksLikeUrl) {
    url = rawImage;
  } else if (!url && rawImage) {
    // Genuine inline payload (data URI or base64) → persist so it has a URL too.
    try {
      const { base64, mimeType } = await resolveImageToBase64(rawImage);
      const stored = saveImageBuffer(
        Buffer.from(base64, 'base64'),
        `asset_${kind}`,
        'aicredits',
        mimeType
      );
      url = stored.url;
      dataUri = stored.dataUri;
    } catch (err: any) {
      return { ok: false, error: `Could not store the supplied image: ${err.message}` };
    }
  }

  const saved = saveAsset({
    projectId,
    kind,
    label,
    url,
    dataUri,
    data: args.data && typeof args.data === 'object' ? args.data : undefined,
    tags: Array.isArray(args.tags) ? args.tags.map((t: any) => String(t)) : [],
  });

  return {
    ok: true,
    assetId: saved.id,
    projectId,
    kind: saved.kind,
    label: saved.label,
    url: saved.url,
    createdAt: saved.createdAt,
  };
}

async function toolListBrandAssets(args: any, ctx: ToolContext): Promise<ToolResult> {
  const project = await resolveProject(ctx);
  const projectId = project?.id ?? ctx.projectId ?? 'unassigned';
  const assets = listAssets(projectId, args?.kind ? (String(args.kind) as AssetKind) : undefined);
  return {
    ok: true,
    projectId,
    count: assets.length,
    assets: assets.slice(0, 30).map((a) => ({
      id: a.id,
      kind: a.kind,
      label: a.label,
      url: a.url,
      tags: a.tags,
      createdAt: a.createdAt,
    })),
  };
}

async function toolGetProjectState(_args: any, ctx: ToolContext): Promise<ToolResult> {
  const project = await resolveProject(ctx);
  if (!project) return { ok: true, project: null, note: 'No project started yet.' };
  return {
    ok: true,
    project: compactProject(project),
    assetCount: listAssets(project.id).length,
  };
}

async function toolExportBrandKit(args: any, ctx: ToolContext): Promise<ToolResult> {
  const project = await resolveProject(ctx);
  if (!project) return { ok: false, error: 'Nothing to export yet — no project exists.' };

  const assets = listAssets(project.id);
  const name = project.selectedName ?? project.generatedNames?.[0];
  const format = args?.format === 'markdown' ? 'markdown' : 'json';

  if (format === 'markdown') {
    const palette = (name?.visualDirection?.palette ?? [])
      .map((c) => `- \`${c.hex}\` ${c.name} (${c.role})`)
      .join('\n');
    const markdown = [
      `# ${name?.name ?? 'Untitled'} — Brand Kit`,
      '',
      `**Industry:** ${project.input?.industry ?? '—'}`,
      `**Tagline:** ${name?.tagline ?? '—'}`,
      `**Tone:** ${project.input?.tone ?? '—'}`,
      `**Audience:** ${project.input?.targetAudience ?? '—'}`,
      `**Mission:** ${project.input?.mission ?? '—'}`,
      '',
      '## Palette',
      palette || '_none_',
      '',
      '## Typography',
      `- Headline: ${name?.visualDirection?.fonts?.headline ?? '—'} (${name?.visualDirection?.fonts?.headlineWeight ?? '—'})`,
      `- Body: ${name?.visualDirection?.fonts?.body ?? '—'} (${name?.visualDirection?.fonts?.bodyWeight ?? '—'})`,
      '',
      '## Assets',
      assets.length
        ? assets.map((a) => `- **${a.kind}** — ${a.label}${a.url ? ` → ${a.url}` : ''}`).join('\n')
        : '_none_',
    ].join('\n');

    return { ok: true, format, projectId: project.id, markdown };
  }

  return {
    ok: true,
    format: 'json',
    projectId: project.id,
    kit: {
      brief: project.input,
      name,
      logoConcepts: project.logoConcepts ?? [],
      assets: assets.map((a) => ({ id: a.id, kind: a.kind, label: a.label, url: a.url })),
    },
  };
}

async function toolSetCanvasState(args: any): Promise<ToolResult> {
  const patch: Record<string, unknown> = {};

  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  if (args.surface && ['light', 'linen', 'dark', 'brand'].includes(String(args.surface))) {
    patch.bgMode = String(args.surface);
  }
  if (args.headlineFont) patch.headlineFont = String(args.headlineFont);
  if (typeof args.wordmarkSize === 'number') patch.wordmarkSize = clamp(args.wordmarkSize, 12, 120);
  if (typeof args.taglineSize === 'number') patch.taglineSize = clamp(args.taglineSize, 8, 48);
  if (typeof args.fontWeight === 'number') patch.fontWeight = clamp(args.fontWeight, 100, 900);
  if (typeof args.letterSpacing === 'number') patch.letterSpacing = clamp(args.letterSpacing, -0.1, 0.5);
  if (args.textColor) patch.textColor = String(args.textColor);

  if (Object.keys(patch).length === 0) {
    return { ok: false, error: 'No canvas properties supplied.' };
  }

  return {
    ok: true,
    canvasPatch: patch,
    note: 'Merge these keys into the existing canvas state. Do not replace the whole object.',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Dispatch
// ─────────────────────────────────────────────────────────────────────────────

const EXECUTORS: Record<
  AgentToolName,
  (args: any, ctx: ToolContext) => Promise<ToolResult>
> = {
  generate_brand_names: toolGenerateBrandNames,
  generate_logo_concepts: toolGenerateLogoConcepts,
  generate_logo_suite: toolGenerateLogoSuite,
  generate_brand_certificate: toolGenerateBrandCertificate,
  describe_image: (args, ctx) => toolDescribeImage(args),
  check_domain_availability: (args) => toolCheckDomains(args),
  update_brand_kit: toolUpdateBrandKit,
  save_brand_asset: toolSaveBrandAsset,
  list_brand_assets: toolListBrandAssets,
  get_project_state: toolGetProjectState,
  export_brand_kit: toolExportBrandKit,
  set_canvas_state: (args) => toolSetCanvasState(args),
};

export async function executeTool(
  name: string,
  rawArgs: string,
  ctx: ToolContext
): Promise<ToolResult> {
  const executor = EXECUTORS[name as AgentToolName];
  if (!executor) {
    return { ok: false, error: `Unknown tool "${name}".` };
  }

  let args: any = {};
  try {
    args = rawArgs ? JSON.parse(rawArgs) : {};
  } catch {
    return { ok: false, error: 'Tool arguments were not valid JSON.' };
  }

  const started = Date.now();
  try {
    const result = await executor(args, ctx);
    console.log(
      `[AgentTool] ${name} → ${result.ok ? 'ok' : 'failed'} (${Date.now() - started}ms)`
    );
    return result;
  } catch (err: any) {
    console.warn(`[AgentTool] ${name} threw: ${err.message}`);
    return { ok: false, error: err.message || 'Tool execution failed.' };
  }
}
