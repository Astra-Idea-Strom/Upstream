import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { logoService } from '../services/logo.service';
import { promptService } from '../services/prompt.service';

const ARCHETYPE_FOLDER_MAP: Record<string, string> = {
  abstract: 'Abstract',
  combination: 'Combination',
  emblems: 'Emblems',
  lettermark: 'Lettermark',
  mascot: 'Mascot',
  pictorial: 'Pictorial',
  wordmark: 'Wordmark',
};

/**
 * GET /api/logos/archetypes
 * Returns all 7 archetype UI cards
 */
export const getArchetypes = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: logoService.getArchetypes(),
  });
};

/**
 * GET /api/logos/archetypes/:archetype/exemplars
 * Returns exemplars for a specific archetype
 */
export const getExemplars = (req: Request, res: Response): void => {
  const { archetype } = req.params;
  const exemplars = logoService.getExemplars(archetype);
  res.status(200).json({
    success: true,
    archetype,
    count: exemplars.length,
    data: exemplars,
  });
};

/**
 * POST /api/logos/preview-prompt
 * Returns stitched prompt without invoking AI image generation
 */
export const previewPrompt = (req: Request, res: Response): void => {
  try {
    const payload = logoService.previewPrompt(req.body);
    res.status(200).json({
      success: true,
      data: payload,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/logos/sample-image/:archetype/:fileName
 * Serves the reference logo image directly from Sample_Data/Images
 */
export const getSampleImage = (req: Request, res: Response): void => {
  const { archetype, fileName } = req.params;
  const folder = ARCHETYPE_FOLDER_MAP[archetype.toLowerCase()];

  if (!folder || !fileName) {
    res.status(400).json({ error: 'Invalid archetype or fileName' });
    return;
  }

  // Prevent path traversal
  const safeFileName = path.basename(fileName);
  const candidates = [
    path.resolve(process.cwd(), 'API & Others/Sample_Data/Images', folder, safeFileName),
    path.resolve(process.cwd(), '../../API & Others/Sample_Data/Images', folder, safeFileName),
    path.resolve(process.cwd(), '../API & Others/Sample_Data/Images', folder, safeFileName),
    path.resolve(__dirname, '../../../../API & Others/Sample_Data/Images', folder, safeFileName),
    path.resolve(__dirname, '../../../API & Others/Sample_Data/Images', folder, safeFileName),
  ];

  let targetPath = '';
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      targetPath = c;
      break;
    }
  }

  if (!targetPath) {
    res.status(404).json({ error: 'Sample image not found' });
    return;
  }

  const ext = path.extname(safeFileName).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };

  res.setHeader('Content-Type', mimeTypes[ext] || 'image/jpeg');
  res.sendFile(targetPath);
};
