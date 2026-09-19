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
 * Handles conversational agent chat replies using Groq (GPT OSS 120B)
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

  const { chatWithAgent } = await import('../services/groq.service');
  const result = await chatWithAgent({ message, history, currentContext });
  res.status(200).json(result);
};
