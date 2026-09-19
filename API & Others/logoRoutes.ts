/**
 * Express Route Handlers for Logo Orchestration API
 * Mount this in your Express app: app.use('/api/logos', logoRouter);
 */

import { Router, Request, Response } from 'express';
import { LogoPromptService } from './promptService';
import { GenerateLogoRequest } from './brandTypes';
import { ARCHETYPE_CARDS } from './archetypes';

export const logoRouter = Router();
const promptService = new LogoPromptService();

/**
 * GET /api/logos/archetypes
 * Returns UI metadata cards for React Step 3 (Visual Direction)
 */
logoRouter.get('/archetypes', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: ARCHETYPE_CARDS
  });
});

/**
 * GET /api/logos/archetypes/:archetype/exemplars
 * Returns specific reference brands for an archetype (e.g. /abstract/exemplars)
 */
logoRouter.get('/archetypes/:archetype/exemplars', (req: Request, res: Response) => {
  try {
    const archetype = req.params.archetype as any;
    const exemplars = promptService.getExemplarsByArchetype(archetype);
    res.json({
      success: true,
      archetype,
      count: exemplars.length,
      data: exemplars
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/logos/preview-prompt
 * Preview stitched prompt without making an OpenAI API call
 */
logoRouter.post('/preview-prompt', (req: Request, res: Response) => {
  try {
    const body: GenerateLogoRequest = req.body;
    const stitched = promptService.buildLogoPrompt(body);
    res.json({
      success: true,
      data: stitched
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/logos/generate
 * Stitches prompt and invokes OpenAI DALL-E 3 (or configured engine)
 */
logoRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const body: GenerateLogoRequest = req.body;
    
    // 1. Build the tailored prompt payload
    const promptPayload = promptService.buildLogoPrompt(body);
    const dallePayload = promptService.createOpenAIDallePayload(body, {
      size: '1024x1024',
      quality: 'standard'
    });

    /**
     * NOTE: If using the official openai npm package:
     * 
     * import OpenAI from 'openai';
     * const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
     * const response = await openai.images.generate({
     *   model: dallePayload.model,
     *   prompt: dallePayload.prompt,
     *   n: dallePayload.n,
     *   size: dallePayload.size,
     *   quality: dallePayload.quality,
     *   response_format: dallePayload.response_format
     * });
     * const imageUrl = response.data[0].url;
     */

    // Returning prompt blueprint and mock payload structure ready for your OpenAI client
    res.json({
      success: true,
      message: 'Prompt stitched successfully. Ready for OpenAI image dispatch.',
      promptDetails: promptPayload,
      openaiPayload: dallePayload
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
