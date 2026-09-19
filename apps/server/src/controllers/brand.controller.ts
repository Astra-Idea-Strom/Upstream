import { Request, Response } from 'express';
import * as brandService from '../services/brand.service';
import { logoService } from '../services/logo.service';
import type {
  GenerateBrandRequest,
  GenerateLogosRequest,
  GenerateLogosResponse,
} from '@upstream/shared';

/**
 * POST /api/brand/generate
 * Generates 10-15 brand names, taglines, visual direction, and domain checks via Groq
 */
export const generateBrand = async (req: Request, res: Response): Promise<void> => {
  const { input, count }: GenerateBrandRequest = req.body;

  if (!input || !input.industry || !input.targetAudience) {
    res.status(400).json({
      error: 'INVALID_INPUT',
      message: 'Industry, targetAudience, and mission are required in input.',
      statusCode: 400,
    });
    return;
  }

  const result = await brandService.generateBrand(input, count || 12);
  res.status(200).json(result);
};

/**
 * POST /api/brand/logos
 * Generates logo concepts using Gemini (template mode) or Flux (scratch mode)
 */
export const generateLogos = async (req: Request, res: Response): Promise<void> => {
  const request: GenerateLogosRequest = req.body;

  if (!request.selectedName || !request.selectedName.name) {
    res.status(400).json({
      error: 'INVALID_REQUEST',
      message: 'selectedName with valid brand name is required.',
      statusCode: 400,
    });
    return;
  }

  const logos = await logoService.generateLogos(request);
  const response: GenerateLogosResponse = { logos };
  res.status(200).json(response);
};

/**
 * POST /api/brand/chat
 * Conversational agent chat: Groq GPT-OSS-120B with server-side tools
 * (naming, FLUX.2 logo generation, Qwen vision, project + asset mutations).
 */
export const chatAgent = async (req: Request, res: Response): Promise<void> => {
  const { message, history, currentContext } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({
      error: 'INVALID_REQUEST',
      message: 'A non-empty "message" string is required.',
      statusCode: 400,
    });
    return;
  }

  const { runAgentChat } = await import('../services/agent.service');
  const result = await runAgentChat({ message, history, currentContext });
  res.status(200).json(result);
};

/**
 * GET /api/brand/diagnostics
 * Which providers are configured and actually reachable right now.
 * Cheap to call; useful for spotting a dead key before a demo.
 */
export const diagnostics = async (_req: Request, res: Response): Promise<void> => {
  const { providerDiagnostics, CLOUDFLARE_VISION_MODEL, AICREDITS_IMAGE_MODEL } = await import(
    '../config/imagegen'
  );

  const probe = async (label: string, fn: () => Promise<boolean>) => {
    const started = Date.now();
    try {
      const ok = await fn();
      return { provider: label, reachable: ok, latencyMs: Date.now() - started };
    } catch (err: any) {
      return { provider: label, reachable: false, latencyMs: Date.now() - started, error: err.message };
    }
  };

  const [chat, vision, image] = await Promise.all([
    probe('groq', async () => {
      const key = process.env.GROQ_API_KEY;
      if (!key) return false;
      const r = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      });
      return r.ok;
    }),
    probe('cloudflare-qwen-vision', async () => {
      const token = process.env.CLOUDFLARE_API_TOKEN;
      const account = process.env.CLOUDFLARE_ACCOUNT_ID;
      if (!token || !account) return false;
      const r = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${CLOUDFLARE_VISION_MODEL}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: 'reply with ok' }], max_tokens: 5 }),
        }
      );
      return r.ok;
    }),
    probe('aicredits-flux-2-dev', async () => {
      const key = process.env.AICREDITS_API_KEY;
      const base = process.env.AICREDITS_BASE_URL || 'https://api.aicredits.in/v1';
      if (!key) return false;
      // Cheap reachability check: authenticated catalog listing, no credits burned.
      const r = await fetch(`${base}/models`, { headers: { Authorization: `Bearer ${key}` } });
      return r.ok;
    }),
  ]);

  res.status(200).json({
    configured: providerDiagnostics(),
    probes: { chat, vision, image },
    models: { chat: process.env.GROQ_MODEL, vision: CLOUDFLARE_VISION_MODEL, image: AICREDITS_IMAGE_MODEL },
    timestamp: new Date().toISOString(),
  });
};

/**
 * GET /api/brand/assets?projectId=...&kind=logo
 * List stored assets (certificates, logos, references, palettes, kits).
 */
export const listAssetsHandler = async (req: Request, res: Response): Promise<void> => {
  const projectId = String(req.query.projectId || '').trim();
  if (!projectId) {
    res.status(400).json({
      error: 'INVALID_REQUEST',
      message: 'projectId query parameter is required.',
      statusCode: 400,
    });
    return;
  }

  const { listAssets } = await import('../services/assetStore.service');
  const kind = req.query.kind ? (String(req.query.kind) as any) : undefined;
  const assets = listAssets(projectId, kind);
  res.status(200).json({ projectId, count: assets.length, assets });
};

/**
 * POST /api/brand/assets
 * Persist an asset without going through chat (certificates, uploads, exports).
 */
export const saveAssetHandler = async (req: Request, res: Response): Promise<void> => {
  const { projectId, kind, label, url, image, data, tags } = req.body || {};

  if (!projectId || !kind || !label) {
    res.status(400).json({
      error: 'INVALID_REQUEST',
      message: 'projectId, kind and label are required.',
      statusCode: 400,
    });
    return;
  }

  const { resolveImageToBase64, saveImageBuffer } = await import('../services/image.service');
  const { saveAsset } = await import('../services/assetStore.service');

  let resolvedUrl: string | undefined = url;
  let dataUri: string | undefined;

  if (!resolvedUrl && image) {
    const { base64, mimeType } = await resolveImageToBase64(String(image));
    const stored = saveImageBuffer(Buffer.from(base64, 'base64'), `asset_${kind}`, 'aicredits', mimeType);
    resolvedUrl = stored.url;
    dataUri = stored.dataUri;
  }

  const asset = saveAsset({
    projectId: String(projectId),
    kind,
    label: String(label),
    url: resolvedUrl,
    dataUri,
    data: data && typeof data === 'object' ? data : undefined,
    tags: Array.isArray(tags) ? tags.map(String) : [],
  });

  res.status(201).json({ asset });
};
